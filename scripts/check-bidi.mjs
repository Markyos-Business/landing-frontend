import { chromium, BASE, assertServerUp } from "./browser-lib.mjs";

/*
 * Does any Arabic block lay itself out left-to-right?
 *
 * ── The bug this exists to catch ──────────────────────────────────────────
 *
 * `globals.css` gives every real text element `unicode-bidi: plaintext` on
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

const PAGES = [
  "/",
  "/pricing",
  "/platform",
  "/solutions",
  "/blog",
  "/help",
  "/about",
  "/roadmap",
];

/* Slack, in px. Below this a gap is padding or a trailing space, not a flip. */
const SLACK = 16;

await assertServerUp();

const browser = await chromium().launch({ channel: "chrome" });
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
    const out = [];

    for (const el of document.querySelectorAll("body *")) {
      const style = getComputedStyle(el);
      if (style.direction !== "rtl") continue;
      if (style.textAlign !== "start") continue;
      if (style.display === "inline") continue;

      const text = (el.innerText || "").trim();
      // The first strong character decides, which is what plaintext reads.
      if (!text || !ARABIC.test(text[0])) continue;

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
      "  app/globals.css, and `.mk-atomic` for the flex case.\n",
  );
  process.exit(1);
}

console.log(`\n✓ ${PAGES.length} pages, no Arabic laid out left-to-right.`);
