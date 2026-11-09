import fs from "node:fs";
import path from "node:path";
import { launch, BASE, assertServerUp } from "./browser-lib.mjs";

/*
 * Does any Arabic block lay itself out left-to-right?
 *
 * ── The bug this exists to catch ──────────────────────────────────────────
 *
 * `tailwind/` gives every real text element `unicode-bidi: plaintext` on
 * the Arabic page, so a line decides its own direction from its own first
 * strong character. That is right, and it has one trap.
 *
 * `plaintext` reads *characters*. An isolated child is not a character to it
 * — the algorithm sees one neutral object replacement character and nothing
 * inside. If a block's whole content is isolated, no strong character is
 * found, UAX9 P3 falls back to left-to-right, and `text-align: start`
 * resolves to the left. The Arabic inside still reads correctly, so nothing
 * looks broken up close: the heading is simply on the wrong side of the page.
 *
 * Two shapes produce it, and both were everywhere on 21 Oct 2026:
 *
 *   <h2><span class="mk-bidi">عربي</span></h2>     — an inline isolate
 *   <td><span class="inline-flex">…chip…</span></td> — an atomic flex box
 *
 * 250 blocks across five pages, including every footer link, every heading
 * the CMS renders, and most cells of the comparison tables.
 *
 * ── Why a browser and not a grep ──────────────────────────────────────────
 *
 * Nothing in the markup is wrong. `text-align: start` is correct, `dir="rtl"`
 * is correct, `mk-bidi` is correct in isolation. The defect only exists once
 * the cascade and the bidi algorithm have both run, which means it only
 * exists in a browser. `tsc`, eslint and `check:pages` all passed throughout.
 *
 * ── What it measures ──────────────────────────────────────────────────────
 *
 * For every block that holds Arabic and is start-aligned: how far its text
 * sits from the start (right) edge of its own box, versus from the end edge.
 * A block whose text has drifted to the end edge is laying out the wrong way.
 *
 *   npm run check:bidi
 */

/*
 * Eight pages by hand, plus one article per collection from the build.
 *
 * The hand-kept half is the set of pages whose layouts are unique. The other
 * half is here because a hand-kept list only covers what somebody remembered,
 * and the article template was not on it: the date in `.mk-article-meta` sat
 * on the wrong edge of its own cell from the day that row was written, on
 * every one of the thirty-two articles, in a `<dd>` whose only child was a
 * `<time>` — an isolate, and precisely the shape this check exists to find.
 *
 * One article per collection rather than all thirty-two: they share a
 * template, so the thirty-second would re-measure the thirty-first's markup.
 * The route list comes out of `.next/prerender-manifest.json`, the way
 * check-pages and check-motion get theirs.
 */
const MANIFEST = path.resolve(import.meta.dirname, "../.next/prerender-manifest.json");

/*
 * Every Arabic route in the build, derived rather than remembered.
 *
 * This was eight pages by hand plus one article per collection, and the
 * hand-kept half is why the article date shipped misaligned on thirty-two
 * pages: the article template was not on the list, because nobody
 * remembered to put it there. Extending it by three names fixed that one
 * page shape and left the next one to be forgotten the same way.
 *
 * So the list comes out of `.next/prerender-manifest.json` now, the way
 * check-pages, check-motion and check-align all get theirs. One article per
 * collection still, because the thirty-two share a template and the
 * thirty-second would re-measure the thirty-first's markup.
 */
function routes() {
  if (!fs.existsSync(MANIFEST)) {
    console.error(`No build found at ${MANIFEST}.\n\n  npm run build\n`);
    process.exit(1);
  }
  const all = Object.keys(JSON.parse(fs.readFileSync(MANIFEST, "utf8")).routes);
  const pages = all.filter((r) => !r.startsWith("/_") && !path.extname(r));
  const article = /^\/(ar|en)\/(blog|guides|help)\/./;
  const seen = new Set();
  const out = [];
  for (const route of pages) {
    // Arabic is where start-alignment is the question; /en is the mirror.
    if (route.startsWith("/en")) continue;
    if (article.test(route)) {
      const key = route.split("/").slice(0, 3).join("/");
      if (seen.has(key)) continue;
      seen.add(key);
    }
    // Arabic is served unprefixed; /ar/... 301s to it, so ask for the real URL.
    out.push(route.startsWith("/ar") ? route.slice(3) || "/" : route);
  }
  return out;
}

const PAGES = routes();

/* Slack, in px. Below this a gap is padding or a trailing space, not a flip. */
const SLACK = 16;

await assertServerUp();

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

let total = 0;

for (const path of PAGES) {
  const response = await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (!response || response.status() !== 200) {
    console.error(`  ✗ ${path} returned ${response ? response.status() : "nothing"}`);
    total += 1;
    continue;
  }

  const hits = await page.evaluate((slack) => {
    const ARABIC = /[؀-ۿݐ-ݿ]/;

    /*
     * The first *strong* character, which is what the algorithm reads.
     *
     * This asked `ARABIC.test(text[0])` and that is not the same question.
     * UAX9 P2 scans for the first character of type L, R or AL; digits are
     * EN or AN — weak — and spaces and punctuation are neutral, so all of
     * them are skipped on the way to the decision.
     *
     * Testing only the first character therefore excluded exactly the
     * strings most likely to be laid out backwards: the ones with no strong
     * character at the front, whose direction rests entirely on what comes
     * after. "8 سبتمبر 2026" is one. The article date was the defect this
     * check was extended to the article routes to catch, in a `<dd>` whose
     * only child is an isolating `<time>` — and it still could not see it,
     * because the string starts with "8". Proven by planting the defect
     * again after the extension: the date sat 164px off the start edge
     * while the two cells beside it sat on it, and the check passed.
     */
    const STRONG = /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

    function firstStrongIsArabic(text) {
      const hit = STRONG.exec(text);
      return hit ? ARABIC.test(hit[0]) : false;
    }

    const out = [];

    for (const el of document.querySelectorAll("body *")) {
      const style = getComputedStyle(el);
      if (style.direction !== "rtl") continue;
      if (style.textAlign !== "start") continue;
      if (style.display === "inline") continue;

      const text = (el.innerText || "").trim();
      // The first strong character decides, which is what plaintext reads.
      if (!text || !firstStrongIsArabic(text)) continue;

      /*
       * A row of tracks answers for its cells, not for itself.
       *
       * This check compares an element's ink box to its own box, which is
       * the right question for a block of text and a meaningless one for a
       * grid or a flex row: the ink box spans the cells that *have* text, so
       * a deliberately empty leading cell is arithmetically identical to the
       * whole row having drifted.
       *
       * That is one finding this reported for three weeks. The homepage's
       * effect table heads three columns — a label column and two cases —
       * and the header row leaves the label column empty, because the label
       * belongs to each data row. On the Arabic page that empty first column
       * is the rightmost 213px, so the row's ink began 232px off the start
       * edge and was read as a flip. Measured per cell, both headings end
       * exactly at the start edge of their own column.
       *
       * Nothing is lost by skipping the container: every cell is an element
       * in this same sweep, so a row whose cells really have drifted is
       * still caught, once per cell, and named at the cell that did it.
       */
      const laysOutInTracks =
        style.display === "grid" ||
        style.display === "inline-grid" ||
        ((style.display === "flex" || style.display === "inline-flex") &&
          style.flexDirection.startsWith("row"));
      if (laysOutInTracks && el.children.length > 1) continue;

      const box = el.getBoundingClientRect();
      if (box.width < 8) continue;

      // Where the text actually sits, rather than where the box is.
      const range = document.createRange();
      range.selectNodeContents(el);
      const ink = range.getBoundingClientRect();
      if (ink.width === 0) continue;

      /*
       * Measured against the *content* box, not the border box.
       *
       * An indented row is not a misaligned one. The platform grid's file
       * tree nests its children with `padding-inline-start`, and the
       * stakeholder list indents under its group — on the Arabic page that
       * is 30-34px of deliberate padding, which this read as 30-34px of
       * wrongness and reported nine false positives. Subtracting the
       * padding asks the question that was always meant: does the text
       * start where its own content box starts.
       */
      const padStart = parseFloat(style.paddingInlineStart) || 0;
      const padEnd = parseFloat(style.paddingInlineEnd) || 0;

      const fromStart = Math.round(box.right - ink.right - padStart);
      const fromEnd = Math.round(ink.left - box.left - padEnd);

      if (fromStart > slack && fromStart > fromEnd + slack) {
        out.push({
          tag: el.tagName.toLowerCase(),
          text: text.replace(/\s+/g, " ").slice(0, 36),
          fromStart,
        });
      }
    }
    return out;
  }, SLACK);

  if (hits.length) {
    console.error(`\n  ${path} — ${hits.length} Arabic blocks laid out from the left`);
    for (const hit of hits.slice(0, 10)) {
      console.error(`    ${String(hit.fromStart).padStart(4)}px off the start edge  <${hit.tag}> ${hit.text}`);
    }
    if (hits.length > 10) console.error(`    … and ${hits.length - 10} more`);
    total += hits.length;
  }
}

await browser.close();

if (total > 0) {
  console.error(
    `\n✗ ${total} blocks hold Arabic but lay out left-to-right.\n\n` +
      "  Almost always an isolate the parent cannot see through: a\n" +
      "  `.mk-bidi` on an inline child of a block that is already plaintext,\n" +
      "  or an `inline-flex` wrapper, which is atomic whatever its\n" +
      "  `unicode-bidi` says. See the rules under `.mk-bidi` in\n" +
      "  tailwind/, and `.mk-atomic` for the flex case.\n",
  );
  process.exit(1);
}

console.log(`\n✓ ${PAGES.length} pages, no Arabic laid out left-to-right.`);
