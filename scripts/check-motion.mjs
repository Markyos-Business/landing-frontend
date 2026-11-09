import fs from "node:fs";
import path from "node:path";
import { BASE, assertServerUp, launch } from "./browser-lib.mjs";

/*
 * Every revealed element has to reach its own settled state.
 *
 * The reveals in `tailwind/` are scroll-driven: an element's animation
 * is positioned along its crossing of the viewport rather than along a clock.
 * That is what makes them fail safe — no JavaScript, and a browser without
 * `animation-timeline` drops the whole block and renders the page as it
 * shipped — and it has one failure mode that nothing else here can see.
 *
 * A `cover` range is the viewport *plus* the element, and the scroll
 * available to something near the foot of the document is only whatever is
 * below it. An element placed too low therefore runs out of range: it stops
 * part-faded, or part-translated, and stays that way for ever. It has
 * happened: the footer's closing bar sat at 0.45 opacity on every page until
 * `.mk-rise-end` was written for it, and it was the shortest page on the
 * site that showed it.
 *
 * The mirror failure is an element *above* the fold given a scroll-driven
 * reveal instead of a clock-driven one, which never starts — and a third is
 * an animation on `translate` applied to something that uses `translate` to
 * position itself, which lands it somewhere other than where the layout put
 * it. All three look identical from here: at the end of its range the
 * element is not where its own styles say it should be.
 *
 * ── Why it snapshots the page first ──────────────────────────────────────
 *
 * "Settled" is not "opacity 1, translate none". The help centre's hero glyph
 * rests at 0.12 opacity and centres itself with `translate: 0 -50%`; a reveal
 * that returns it there is correct. So this disables every animation, records
 * what each element's own styles produce, puts them back, and compares the
 * walked page against that. The assertion is "the animation left no trace",
 * which is the actual contract — `backwards` fills only before the range, so
 * past it an element must be byte-for-byte what it would be with no motion in
 * the stylesheet at all.
 *
 *   npm run check:motion
 *
 * BASE_URL=https://staging.example.com checks a deploy instead.
 */

const MANIFEST = path.resolve(import.meta.dirname, "../.next/prerender-manifest.json");

/* The classes that put an element under a timeline. `.mk-drift` and the light
   pools are deliberately absent: they are continuous rather than arrivals, so
   they are *meant* to be off their resting position for the whole crossing,
   and they return to it only once the element is off screen entirely. */
const SELECTOR = [
  ".mk-rise",
  ".mk-seq > *",
  ".mk-seq-rows > *",
  ".mk-seq-pop > *",
  ".mk-pop",
  ".mk-slide-start",
  ".mk-slide-end",
  ".mk-words > *",
  ".mk-word-at",
  ".mk-load",
  ".mk-seq-load > *",
  ".mk-draw",
].join(",");

/*
 * The page list comes out of the build, for the reason check-pages.mjs gives:
 * a hand-kept list stops covering the pages added after somebody last
 * remembered it. Two per article collection is enough — they share a
 * template, and what differs between them is their length, which is the one
 * thing this check is sensitive to, so it takes the two it is given.
 */
function routes() {
  if (!fs.existsSync(MANIFEST)) {
    console.error(`No build found at ${MANIFEST}.\n\n  npm run build\n`);
    process.exit(1);
  }
  const all = Object.keys(JSON.parse(fs.readFileSync(MANIFEST, "utf8")).routes);
  const pages = all.filter((r) => !r.startsWith("/_") && !path.extname(r));
  const article = /^\/(ar|en)\/(blog|guides|help)\/./;
  const seen = new Map();
  const out = [];

  for (const route of pages) {
    if (article.test(route)) {
      const key = route.split("/").slice(0, 3).join("/");
      const n = (seen.get(key) ?? 0) + 1;
      seen.set(key, n);
      if (n > 2) continue;
    }
    out.push(route.startsWith("/ar") ? route.slice(3) || "/" : route);
  }
  return out;
}

await assertServerUp();

const PAGES = routes();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
let walked = 0;

for (const route of PAGES) {
  const response = await page.goto(BASE + route, { waitUntil: "networkidle" });
  if (!response || response.status() !== 200) {
    problems.push(`\n  ${route} returned ${response ? response.status() : "nothing"}`);
    continue;
  }

  const result = await page.evaluate(async (sel) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    /*
     * Wait for the clock-driven reveals, by asking them rather than by
     * guessing at a duration.
     *
     * A fixed timeout was the first version and it was flaky: under load —
     * `npm run check` compiling in the next terminal — 1400ms was not enough
     * and the above-the-fold cascade read as stranded mid-reveal on every
     * page that has a hero. These are the animations on the document
     * timeline; the scroll-driven ones are never "finished" by definition,
     * and anything running for ever (the ecosystem's pulses) would block a
     * wait on them, so both are filtered out.
     */
    const settleClocks = async () => {
      const deadline = performance.now() + 8000;
      while (performance.now() < deadline) {
        const pending = document.getAnimations().filter((a) => {
          if (!(a.timeline instanceof DocumentTimeline)) return false;
          if (a.effect?.getTiming().iterations === Infinity) return false;
          return a.playState !== "finished";
        });
        if (!pending.length) return;
        await sleep(50);
      }
    };

    const grab = (el) => {
      const cs = getComputedStyle(el);
      return { opacity: cs.opacity, translate: cs.translate, scale: cs.scale, filter: cs.filter };
    };

    await settleClocks();

    // 1. The page with no animation: what every element's own styles say.
    const off = document.createElement("style");
    off.textContent = `${sel} { animation: none !important; }`;
    document.head.append(off);
    await sleep(80);
    const rest = new Map();
    for (const el of document.querySelectorAll(sel)) rest.set(el, grab(el));
    off.remove();
    /* Lifting the override restarts every clock-driven animation from zero,
       so the above-the-fold cascade has to be waited out a second time or
       `.mk-load` reads as stranded mid-reveal on every page. */
    await settleClocks();

    // 2. The same elements, walked, each judged once its box is above the
    //    viewport — the point by which every range here has to be over.
    const bad = [];
    const seen = new Set();
    const stops = [];
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) stops.push(y);
    stops.push(document.documentElement.scrollHeight);

    /*
     * Wait for the scroll to reach computed style, by asking rather than by
     * guessing at a delay.
     *
     * A scroll-driven animation is updated off the main thread, so the first
     * `getComputedStyle` after a jump can still be the *previous* stop's
     * value. A fixed 60ms used to be enough and stopped being enough: the
     * homepage reported a `.mk-pop` figure stranded at opacity 0.9667, which
     * is exactly what that element reads 700px earlier — and the same
     * element, measured by scrolling straight to the same offset, reported
     * `playState: "finished"` and opacity 1. Nothing was stuck; the check was
     * reading one stop behind.
     *
     * So: settle the values the judgement is about to read, the same way
     * `settleClocks` settles the clock-driven ones. Two frames, because a
     * composited update lands on the frame after the one that applies it, and
     * stop as soon as nothing moves.
     */
    const twoFrames = () =>
      new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const same = (a, b) =>
      a.opacity === b.opacity &&
      a.translate === b.translate &&
      a.scale === b.scale &&
      a.filter === b.filter;

    const stabilise = async (els) => {
      if (!els.length) return;
      const deadline = performance.now() + 1000;
      let prev = els.map(grab);
      while (performance.now() < deadline) {
        await twoFrames();
        const next = els.map(grab);
        if (next.every((v, i) => same(v, prev[i]))) return;
        prev = next;
      }
    };

    for (const y of stops) {
      window.scrollTo({ top: y, behavior: "instant" });
      await sleep(60);

      // Geometry is settled as soon as the scroll applies, so the set to
      // judge can be chosen first and only its styles waited on.
      const due = [];
      for (const el of document.querySelectorAll(sel)) {
        if (seen.has(el) || el.getBoundingClientRect().bottom > 0) continue;
        due.push(el);
      }
      await stabilise(due);

      for (const el of due) {
        seen.add(el);
        const now = grab(el);
        const want = rest.get(el);
        if (!want) continue;
        const drifted = ["opacity", "translate", "scale", "filter"].filter((k) =>
          k === "opacity"
            ? Math.abs(Number(now[k]) - Number(want[k])) > 0.01
            : now[k] !== want[k],
        );
        if (drifted.length) {
          bad.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className?.toString?.() ?? "").slice(0, 52),
            text: (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 30),
            off: drifted.map((k) => `${k} ${now[k]} (own: ${want[k]})`).join(", "),
          });
        }
      }
    }
    return { bad, total: seen.size };
  }, SELECTOR);

  walked += result.total;
  if (result.bad.length) {
    problems.push(`\n  ${route} — ${result.bad.length} left mid-reveal`);
    for (const b of result.bad.slice(0, 8)) {
      problems.push(`    <${b.tag}> ${b.cls}\n      "${b.text}"\n      ${b.off}`);
    }
    if (result.bad.length > 8) problems.push(`    … and ${result.bad.length - 8} more`);
  }
}

await browser.close();

if (problems.length) {
  console.error(`\n  Reveals that never finish${problems.join("\n")}`);
  console.error(
    "\n✗ Elements are left mid-reveal.\n\n" +
      "  A `cover` range is the viewport plus the element, so one near the\n" +
      "  foot of the page can run out of scroll before it finishes. Give it\n" +
      "  `.mk-rise-end` / `.mk-seq-end`, which measure in `entry` instead —\n" +
      "  or `.mk-still`, if the element positions itself with `translate`\n" +
      "  and the reveal is fighting it. See the motion block in\n" +
      "  tailwind/.\n",
  );
  process.exit(1);
}

console.log(
  `\n✓ ${walked} revealed elements across ${PAGES.length} pages all reach their settled state.`,
);
