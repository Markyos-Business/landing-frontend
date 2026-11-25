import { BASE, assertServerUp } from "./browser-lib.mjs";

/*
 * The Help Center home and topic pages (C1), against a running site.
 *
 * In both languages: the home answers with its search form, its contact link
 * and its topics; every topic it links to answers 200; no link has an empty
 * category (`/help//…`); and a topic opened with the other language's slug
 * (what the header's language switch produces) redirects to this
 * language's slug instead of 404ing. Article pages are C4's, and are checked
 * there.
 *
 *   BASE_URL=http://localhost:3120 npm run check:help
 */

await assertServerUp();

/*
 * Whether the platform has published any help content. With none — or with
 * no CONTENT_API_URL at all, as in CI, which builds the site without a
 * backend — /help rightly shows an empty Help Center home (the CMS fallback
 * page was retired on 25 Nov 2026), and the Help Center checks
 * below have nothing to look at, the way check:articles passes with 0
 * articles. Once the API reports content, a /help without the Help Center is
 * a failure again.
 */
const API = process.env.CONTENT_API_URL?.trim().replace(/\/+$/, "") ?? "";
async function helpPublished() {
  if (!API) return false;
  try {
    const res = await fetch(`${API}/help/public/home/?locale=en`);
    if (!res.ok) return false;
    const home = await res.json();
    return ["categories", "popular", "gettingStarted", "recent"].some((key) => (home[key]?.length ?? 0) > 0);
  } catch {
    return false;
  }
}
const published = await helpPublished();

const ROOTS = { ar: "", en: "/en" };
const failures = [];
const fail = (msg) => failures.push(`  ${msg}`);
const topics = {};
const fallback = [];

for (const [lang, root] of Object.entries(ROOTS)) {
  const res = await fetch(`${BASE}${root}/help`);
  const html = await res.text();
  if (res.status !== 200) fail(`${root}/help → ${res.status}`);
  if (!html.includes("data-help-center")) {
    if (published) fail(`${root}/help is not the Help Center home, although the help API has published content`);
    else fallback.push(`${root}/help`);
    continue;
  }
  if (!html.includes(`action="${root}/help/search"`)) fail(`${root}/help: search form doesn't submit to ${root}/help/search`);
  if (!html.includes(`href="${root}/contact?topic=support"`)) fail(`${root}/help: no contact link`);
  if (html.includes(`${root}/help//`)) fail(`${root}/help: a link with an empty category`);

  const pattern = new RegExp(`href="(${root}/help/[^"/#?]+)"`, "g");
  topics[lang] = [...new Set([...html.matchAll(pattern)].map((m) => m[1]))].filter((p) => !p.endsWith("/search"));
  if (topics[lang].length === 0) {
    // No published help (or no API, as in CI): /help is the Help Center home
    // with nothing in it yet, which is right. With content, it's a failure.
    if (published) fail(`${root}/help links to no topics`);
    else fallback.push(`${root}/help`);
    continue;
  }
  for (const path of topics[lang]) {
    const topic = await fetch(BASE + path, { redirect: "manual" });
    if (topic.status !== 200) fail(`${path} → ${topic.status}`);
  }
}

// The language switch: an Arabic topic path under /en lands on the English topic.
for (const path of topics.ar ?? []) {
  if (/^\/help\/[a-z0-9-]+$/.test(path)) continue; // same slug in both
  const res = await fetch(`${BASE}/en${path}`, { redirect: "manual" });
  // A cold render can send the same Location twice, which fetch joins with
  // ", " (browsers accept identical duplicates); the first is the target.
  const to = (res.headers.get("location") ?? "").split(", ")[0];
  if (![301, 307, 308].includes(res.status) || !to.includes("/en/help/")) {
    fail(`/en${path} → ${res.status} ${to} (expected a redirect to the English topic)`);
    continue;
  }
  const landed = await fetch(new URL(to, BASE));
  if (landed.status !== 200) fail(`/en${path} redirects to ${to}, which answers ${landed.status}`);
}

// Articles (C4).
let articleCount = 0;
for (const [lang, root] of Object.entries(ROOTS)) {
  const html = await (await fetch(`${BASE}${root}/help`)).text();
  const pattern = new RegExp(`href="(${root}/help/[^"/#?]+/[^"/#?]+)"`, "g");
  const paths = [...new Set([...html.matchAll(pattern)].map((m) => m[1]))];
  for (const path of paths) {
    articleCount += 1;
    const res = await fetch(BASE + path, { redirect: "manual" });
    const page = await res.text();
    if (res.status !== 200) {
      fail(`${path} → ${res.status}`);
      continue;
    }
    if ((page.match(/<h1[\s>]/g) ?? []).length !== 1) fail(`${path}: not exactly one h1`);
    if (!page.includes('"@type":"Article"')) fail(`${path}: no Article structured data`);
    if (!page.includes('"@type":"BreadcrumbList"')) fail(`${path}: no BreadcrumbList`);
    if (!/<link rel="canonical"/.test(page)) fail(`${path}: no canonical`);
    if (!/hrefLang="x-default"|hreflang="x-default"/i.test(page)) fail(`${path}: no hreflang`);

    // The same path in the other language: a redirect, or the notice.
    const otherRoot = lang === "en" ? "" : "/en";
    const swapped = otherRoot + path.slice(root.length);
    const swap = await fetch(BASE + swapped, { redirect: "manual" });
    const ok = [301, 307, 308].includes(swap.status) || (swap.status === 200 && (await swap.text()).includes("noindex"));
    if (!ok) fail(`${swapped} → ${swap.status} (expected a redirect or the not-translated notice)`);
  }
}

// Search (C5): the page answers with results for a word from the first
// article's title, is never indexed, and the instant-results route answers.
for (const [lang, root] of Object.entries(ROOTS)) {
  const home = await (await fetch(`${BASE}${root}/help`)).text();
  const title = home.match(/class="mk-bidi block[^"]*font-medium[^"]*mk-underline-reveal">([^<]+)</)?.[1] ?? "";
  const word = title.split(/\s+/).find((w) => w.length > 3) ?? "";
  if (!word) continue;
  const page = await fetch(`${BASE}${root}/help/search?q=${encodeURIComponent(word)}`);
  const html = await page.text();
  if (page.status !== 200) fail(`${root}/help/search → ${page.status}`);
  if (!html.includes("noindex")) fail(`${root}/help/search is indexable`);
  if (!html.includes('role="option"')) fail(`${root}/help/search?q=${word}: no results rendered`);
  const api = await fetch(`${BASE}/api/help/search?q=${encodeURIComponent(word)}&locale=${lang}`);
  const data = api.ok ? await api.json() : null;
  if (!data || !(data.total > 0)) fail(`/api/help/search?q=${word}&locale=${lang} → ${api.status}, ${data?.total ?? "no"} results`);
}

if (failures.length) {
  console.error(`\n✗ Help Center: ${failures.length} problem(s):\n\n${failures.join("\n")}\n`);
  process.exit(1);
}
if (fallback.length === Object.keys(ROOTS).length) {
  console.log(
    `\n  ✓ Help Center skipped: ${API ? "the help API has no published content" : "no CONTENT_API_URL (no help API)"}, so ${fallback.join(" and ")} show an empty Help Center home, and both answer 200.\n`,
  );
  process.exit(0);
}
console.log(
  `\n  ✓ Help Center home, ${(topics.ar?.length ?? 0) + (topics.en?.length ?? 0)} topic pages and ${articleCount} article pages answer in both languages.\n`,
);
