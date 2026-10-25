import fs from "node:fs";
import path from "node:path";
import { BASE, assertServerUp, chromium } from "./browser-lib.mjs";

/*
 * Drive every page in a real browser, at three widths.
 *
 * What this checks is deliberately narrow — the things that are objectively
 * wrong on any page, in any language, and that nothing else in `npm run
 * check` can see:
 *
 *   - the page answers 200
 *   - no console errors, no failed or 4xx/5xx subrequests
 *   - nothing overflows the viewport sideways (and *what* overflows, named)
 *   - exactly one <h1>
 *   - `dir` matches the locale the URL promises
 *
 * It is not a visual check and makes no judgement about design. It is the
 * floor. Three of the four bugs that shipped into review were found here and
 * by scripts/check-articles.mjs, with tsc and ESLint green the whole time:
 * every page prefetching an off-site redirect, a language switch that 404'd
 * on articles, and `1 دقائق` from an Arabic plural with a count of one.
 *
 *   npm run build && npx next start -p 3210
 *   node scripts/check-pages.mjs
 *
 * BASE_URL=https://staging.example.com checks a deploy instead.
 */

const MANIFEST = path.resolve(import.meta.dirname, "../.next/prerender-manifest.json");

/*
 * The page list comes out of the build, not out of this file.
 *
 * A hand-kept list is a list that silently stops covering the pages added
 * after somebody last remembered it — and the whole value here is breadth.
 */
function routes() {
  if (!fs.existsSync(MANIFEST)) {
    console.error(`No build found at ${MANIFEST}.\n\n  npm run build\n`);
    process.exit(1);
  }
  const all = Object.keys(JSON.parse(fs.readFileSync(MANIFEST, "utf8")).routes);

  // Internal and non-HTML entries are not pages.
  const pages = all.filter((r) => !r.startsWith("/_") && !path.extname(r));

  const article = /^\/(ar|en)\/(blog|guides|help)\/./;
  const seen = new Map();
  const out = [];

  for (const route of pages) {
    // Articles share one template, so a handful per collection per locale
    // tells us what all thirty-two would. check-articles.mjs asks for every
    // one of them; this one is about layout, and would otherwise spend most
    // of its time re-checking the same component.
    if (article.test(route)) {
      const key = route.split("/").slice(0, 3).join("/");
      const n = (seen.get(key) ?? 0) + 1;
      seen.set(key, n);
      if (n > 2) continue;
    }
    // Arabic is served unprefixed; /ar/... 301s to it, so check the real URL.
    out.push(route.startsWith("/ar") ? route.slice(3) || "/" : route);
  }
  return out;
}

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 800, height: 900 },
  { name: "phone", width: 390, height: 844 },
];

await assertServerUp();

const PAGES = routes();
const browser = await chromium().launch({ channel: "chrome" });
const problems = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  const failed = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("requestfailed", (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url()}`);
  });

  for (const url of PAGES) {
    errors.length = 0;
    failed.length = 0;
    const res = await page.goto(BASE + url, { waitUntil: "networkidle" });
    if (res.status() !== 200) problems.push(`${vp.name} ${url} status ${res.status()}`);

    const m = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      h1: document.querySelectorAll("h1").length,
      dir: document.documentElement.dir,
      // Whatever pokes past the viewport is what actually causes the sideways
      // scroll, so name it rather than only reporting that it happened.
      wide: [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > document.documentElement.clientWidth + 2 || r.left < -2);
        })
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`),
    }));

    if (m.scrollW > m.clientW + 1) {
      problems.push(`${vp.name} ${url} overflow ${m.scrollW}>${m.clientW} via ${m.wide.join(", ")}`);
    }
    if (m.h1 !== 1) problems.push(`${vp.name} ${url} has ${m.h1} h1`);
    const wantDir = url.startsWith("/en") ? "ltr" : "rtl";
    if (m.dir !== wantDir) problems.push(`${vp.name} ${url} dir=${m.dir} want ${wantDir}`);
    if (errors.length) problems.push(`${vp.name} ${url} console: ${errors.slice(0, 2).join(" | ")}`);
    if (failed.length) problems.push(`${vp.name} ${url} request: ${failed.slice(0, 2).join(" | ")}`);
  }
  await page.close();
  console.log(`  ${vp.name}: ${PAGES.length} pages`);
}

await browser.close();

if (problems.length) {
  console.error(`\n✗ ${problems.length} problems:\n\n` + problems.join("\n") + "\n");
  process.exit(1);
}
console.log(`\n✓ ${PAGES.length} pages × ${VIEWPORTS.length} viewports, no problems.\n`);
