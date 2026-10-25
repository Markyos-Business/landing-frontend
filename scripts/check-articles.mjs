import { BASE, assertServerUp } from "./browser-lib.mjs";

/*
 * Every article the three index pages link to, in both locales, answered.
 *
 * No browser: this is only about status codes, and the point is to ask for
 * *every* article rather than the one or two a page sweep happens to visit.
 *
 * It exists because that is what it takes to catch this class of bug. A post
 * published with the Arabic slug `السلام` returned 404 while the blog index
 * linked to it, because a dynamic route param arrives percent-encoded and
 * `generateStaticParams` returns it decoded (see lib/pages/params.ts). The
 * build was green, the type-check was green, and the page sweep visited
 * /blog/brand-decay and was happy.
 *
 * Run it after anything that touches editorial routing, and after adding
 * content whose slug is not plain ASCII.
 */

await assertServerUp();

async function linkedArticles(indexPath) {
  const res = await fetch(BASE + indexPath);
  if (!res.ok) {
    console.error(`${indexPath} itself answered ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();
  const found = new Set();
  for (const m of html.matchAll(/href="(\/(?:en\/)?(?:blog|guides|help)\/[^"#?]+)"/g)) {
    found.add(m[1]);
  }
  return [...found];
}

const articles = (
  await Promise.all(["/blog", "/guides", "/help"].map(linkedArticles))
).flat();

// Both editions of each: the language switch in the header offers the other
// one from every article page, so a 404 there is reachable from everywhere.
const targets = [...new Set(articles.flatMap((p) => [p, `/en${p}`]))];

const bad = [];
for (const url of targets) {
  const res = await fetch(BASE + url, { redirect: "manual" });
  if (res.status !== 200) bad.push(`  ${url} → ${res.status}`);
}

if (bad.length) {
  console.error(`\n✗ ${bad.length} of ${targets.length} article URLs did not answer 200:\n`);
  console.error(bad.join("\n") + "\n");
  process.exit(1);
}

console.log(
  `\n✓ ${articles.length} articles, ${targets.length} URLs across both locales, all 200.\n`,
);
