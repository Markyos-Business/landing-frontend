import fs from "node:fs";
import path from "node:path";
import { launch, BASE, assertServerUp } from "./browser-lib.mjs";

/*
 * Is every section aligned to the start edge, and aligned the same way?
 *
 * ── What this is for, and how it differs from check:bidi ──────────────────
 *
 * `check:bidi` asks one question: does a block of Arabic lay itself out
 * right-to-left? That catches the isolate trap, where a heading ends up on
 * the wrong side of the page outright. It cannot see three other ways a
 * section comes out misaligned, because all three are *correct* bidi:
 *
 *   1. A property that resolves physically. `text-align: left`, `float`,
 *      `justify-content: left` and `direction: ltr` do not flip, so they
 *      point the same way in both editions — right in English, wrong in
 *      Arabic. `check:design` greps the source for the physical forms it
 *      knows; this asks the browser for the *resolved* value, which is the
 *      only way to catch one that arrived through a Tailwind arbitrary
 *      value, an inline style, or a shorthand.
 *
 *   2. A row that did not mirror. In a right-to-left row the first child
 *      sits rightmost. When a row keeps its English order the text inside
 *      each cell still reads correctly, so nothing looks broken up close —
 *      the icon is simply on the wrong side of its label.
 *
 *   3. A head that does not sit where its own content sits. This is the one
 *      that is invisible to every other check, because nothing about it is
 *      a defect in isolation: a centred `h2` is centred on purpose, and the
 *      grid under it is start-aligned on purpose. Together they read as two
 *      unrelated objects, and a page that does it in some sections and not
 *      others has no rule a reader can follow — the heading jumps between
 *      the right edge and the middle as you scroll. Fifty-one sections were
 *      doing it on 7 Nov 2026.
 *
 * ── The rule for (3), and why centring is not simply banned ──────────────
 *
 * A head may centre, but only over content that is itself centred. Two
 * shapes earn it and both are *measured* here rather than named:
 *
 *   - A head block whose every child centres with it, which is the hero.
 *   - A centred frame: content narrower than its container with equal gaps
 *     either side, which is a centred object and not a column of text. The
 *     showcase's product shot is one — 865px inside 1100px, 118px a side.
 *
 * A full-width table or grid is not a centred object, whatever it looks
 * like: its text starts at the start edge, so its head belongs there too.
 *
 * A numeric table centres its value columns and starts its label column.
 * The head answers to the label column, so that is the cell this compares.
 *
 * ── There is no allow-list, and that is the point ─────────────────────────
 *
 * This started with one. The homepage is composed section by section from
 * the design reference, which §0 of MARKYOS-DESIGN-SYSTEM.md gives
 * authority over layout, so its five centred heads looked like a decision
 * to record rather than a drift to fail. Measuring them said otherwise:
 * four sit over something genuinely centred and the rule above clears them
 * on their own measurements, without being told which page they are on. The
 * fifth sat over a start-aligned table, and no reference image maps to it.
 * It moved to the start edge with the rest.
 *
 * So every page answers to the same rule. The exemption list would have
 * hidden the one real finding behind four false ones.
 *
 *   npm run check:align
 */

const MANIFEST = path.resolve(import.meta.dirname, "../.next/prerender-manifest.json");

/*
 * Every Arabic route in the build, which is where start-alignment is the
 * question. One article per collection: they share a template.
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
    if (route.startsWith("/en")) continue;
    if (article.test(route)) {
      const key = route.split("/").slice(0, 3).join("/");
      const n = (seen.get(key) ?? 0) + 1;
      seen.set(key, n);
      if (n > 1) continue;
    }
    out.push(route.startsWith("/ar") ? route.slice(3) || "/" : route);
  }
  return out;
}

/* Below this, a gap is padding or a trailing space rather than a flip. */
const SLACK = 4;

/*
 * Two viewports, because alignment is where the two layouts differ most:
 * the rows that stack on a phone are the rows whose order only matters on a
 * desktop, and the heads that share a line with a control only share it
 * when there is room.
 */
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
];

await assertServerUp();

const PAGES = routes();
const browser = await launch();
const hard = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

  for (const route of PAGES) {
    const response = await page.goto(BASE + route, { waitUntil: "networkidle" });
    if (!response || response.status() !== 200) {
      hard.push(`  ${vp.name.padEnd(7)} ${route} returned ${response ? response.status() : "nothing"}`);
      continue;
    }

    const found = await page.evaluate(({ slack }) => {
      const ARABIC = /[؀-ۿݐ-ݿ]/;
      const out = [];

      function where(el) {
        const bits = [];
        let n = el;
        for (let i = 0; i < 3 && n && n !== document.body; i += 1) {
          let s = n.tagName.toLowerCase();
          const cls = (n.getAttribute("class") || "")
            .split(/\s+/)
            .filter((c) => c.startsWith("mk-"))
            .slice(0, 2)
            .join(".");
          if (cls) s += "." + cls;
          bits.unshift(s);
          n = n.parentElement;
        }
        return bits.join(" > ");
      }

      /*
       * A subtree that declares `dir="ltr"` is a picture of the product, and
       * the product does not mirror — the design system says so, and the
       * mocks carry the attribute for exactly this reason. Its inner layout
       * is not this check's business.
       */
      function inLtrIsland(el) {
        let n = el;
        while (n && n !== document.body) {
          if (n.getAttribute && n.getAttribute("dir") === "ltr") return true;
          n = n.parentElement;
        }
        return false;
      }

      // ── Rules 1 and 2, over every element on the page ──────────────────
      for (const el of document.querySelectorAll("body *")) {
        const st = getComputedStyle(el);
        if (st.display === "none" || st.visibility === "hidden") continue;
        const box = el.getBoundingClientRect();
        if (box.width < 2 || box.height < 2) continue;
        if (inLtrIsland(el)) continue;

        const text = (el.innerText || "").trim();

        if (st.textAlign === "left" || st.textAlign === "right") {
          out.push({ detail: `text-align: ${st.textAlign}`, at: where(el) });
        }
        if (st.float === "left" || st.float === "right") {
          out.push({ detail: `float: ${st.float}`, at: where(el) });
        }
        if (st.justifyContent === "left" || st.justifyContent === "right") {
          out.push({ detail: `justify-content: ${st.justifyContent}`, at: where(el) });
        }
        if (st.justifyItems === "left" || st.justifyItems === "right") {
          out.push({ detail: `justify-items: ${st.justifyItems}`, at: where(el) });
        }
        if (st.direction === "ltr" && text && ARABIC.test(text[0])) {
          out.push({ detail: "direction: ltr, holding Arabic", at: where(el) });
        }

        // Rule 2 — a row of siblings that kept its English order.
        const flex = st.display === "flex" || st.display === "inline-flex";
        const grid = st.display === "grid" || st.display === "inline-grid";
        if (st.direction !== "rtl" || !(flex || grid)) continue;
        if (flex && !st.flexDirection.startsWith("row")) continue;

        const kids = [...el.children].filter((k) => {
          const ks = getComputedStyle(k);
          if (ks.display === "none" || ks.position === "absolute" || ks.position === "fixed") return false;
          const kb = k.getBoundingClientRect();
          return kb.width > 1 && kb.height > 1;
        });
        if (kids.length < 2) continue;

        const rects = kids.map((k) => k.getBoundingClientRect());
        /*
         * Only the children sharing the first visual line. A wrapped row or
         * a multi-row grid says nothing about inline order, and reading one
         * as a single line is how a check like this invents findings.
         */
        const top = rects[0].top;
        const line = rects.filter((r) => Math.abs(r.top - top) < r.height * 0.6);
        if (line.length < 2) continue;

        if (line[0].right < line[line.length - 1].right - slack) {
          out.push({
            detail: `row kept its English order — ${line.length} cells, first child is leftmost`,
            at: where(el),
          });
        }
      }

      // ── Rule 3, over every section that has a head ─────────────────────
      function ink(el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const b = r.getBoundingClientRect();
        return b.width > 0 ? b : null;
      }

      for (const sec of document.querySelectorAll("main section")) {
        const head = sec.querySelector("h1, h2");
        if (!head || !ink(head)) continue;
        if (getComputedStyle(head).textAlign !== "center") continue;

        const block = head.parentElement;

        /*
         * Does this head sit over a centred object rather than a column of
         * text? Measured: a content box below the head, sitting with equal
         * gaps either side of the section's container, and leaving at least
         * a tenth of the container's width as air.
         *
         * That last clause is the whole rule, and the first version did not
         * have it. "Narrower than its container, centred in it" also
         * describes the comparison table's shell — 1044px inside 1100,
         * 28px of symmetric margin — which is a full-width block with an
         * inset, not a centred object, and reads as one. It exempted the
         * very section a planted test had just centred the head of, so the
         * check passed its own test by not being able to see it.
         *
         * A tenth separates them with room to spare: the showcase frame
         * leaves 236px of 1100 (21%), the table shell 56px (5%). Below that
         * the air is not air, it is padding.
         */
        const container = sec.querySelector(".mk-container") || sec;
        const cb = container.getBoundingClientRect();
        let centredFrame = false;
        for (const el of container.querySelectorAll(":scope > *, :scope > * > *")) {
          if (block.contains(el) || el.contains(block)) continue;
          const b = el.getBoundingClientRect();
          if (b.width < 80 || b.height < 40) continue;
          const left = b.left - cb.left;
          const right = cb.right - b.right;
          if (Math.abs(left - right) <= 2 && left + right >= cb.width * 0.1) {
            centredFrame = true;
            break;
          }
        }
        if (centredFrame) continue;

        /*
         * The hero needs no clause of its own. A title card holds nothing
         * but its own centred block, so the search below finds no
         * start-aligned run to disagree with and the section never reaches
         * the report. Exempting it by "the head block centres as a whole"
         * was tried and withdrawn: that is also true of a centred head over
         * a start-aligned table, which is the one real finding this check
         * was written for.
         */

        // What the head introduces: the first real text run below it.
        let body = null;
        for (const c of sec.querySelectorAll("p, li, td, th, dd, h3")) {
          if (block.contains(c)) continue;
          if (inLtrIsland(c)) continue;
          if ((c.innerText || "").trim().length < 18) continue;
          const b = c.getBoundingClientRect();
          if (b.width < 40 || b.height < 8) continue;
          body = c;
          break;
        }
        if (!body) continue;

        /*
         * A numeric table centres its value columns. The head answers to the
         * label column, so compare against that cell instead.
         */
        if (body.tagName === "TD" || body.tagName === "TH") {
          const row = body.closest("tr");
          const first = row ? row.querySelector("td, th") : null;
          if (first) body = first;
        }

        if (getComputedStyle(body).textAlign === "center") continue;

        out.push({
          detail: `centred head over start-aligned <${body.tagName.toLowerCase()}>`,
          at: (head.innerText || "").replace(/\s+/g, " ").slice(0, 44),
        });
      }

      return out;
    }, { slack: SLACK });

    for (const f of found) {
      hard.push(`  ${vp.name.padEnd(7)} ${route.padEnd(32)} ${f.detail}\n            ${f.at}`);
    }
  }

  await page.close();
}

await browser.close();

if (hard.length) {
  console.error(`\n✗ ${hard.length} alignment problems.\n`);
  for (const l of hard) console.error(l);
  console.error(
    "\n  A physical property does not flip — use the logical form.\n" +
      "  A row that kept its English order has an icon on the wrong side of\n" +
      "  its label. A centred head over start-aligned content opens the\n" +
      "  section in the middle of the page and then steps back to the edge:\n" +
      "  either the head goes to the start edge, or what it introduces\n" +
      "  becomes a centred object. See the note at the top of this file.\n",
  );
  process.exit(1);
}

console.log(
  `\n✓ ${PAGES.length} Arabic routes × ${VIEWPORTS.length} viewports, every section aligned to the start edge.\n`,
);
