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

const ROOTS = { ar: "", en: "/en" };
const failures = [];
const fail = (msg) => failures.push(`  ${msg}`);
const topics = {};

for (const [lang, root] of Object.entries(ROOTS)) {
  const res = await fetch(`${BASE}${root}/help`);
  const html = await res.text();
  if (res.status !== 200) fail(`${root}/help → ${res.status}`);
  if (!html.includes("data-help-center")) {
    fail(`${root}/help is not the Help Center home (no published articles in the help API?)`);
    continue;
  }
  if (!html.includes(`action="${root}/help/search"`)) fail(`${root}/help: search form doesn't submit to ${root}/help/search`);
  if (!html.includes(`href="${root}/contact?topic=support"`)) fail(`${root}/help: no contact link`);
  if (html.includes(`${root}/help//`)) fail(`${root}/help: a link with an empty category`);

  const pattern = new RegExp(`href="(${root}/help/[^"/#?]+)"`, "g");
  topics[lang] = [...new Set([...html.matchAll(pattern)].map((m) => m[1]))].filter((p) => !p.endsWith("/search"));
  if (topics[lang].length === 0) fail(`${root}/help links to no topics`);
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

if (failures.length) {
  console.error(`\n✗ Help Center: ${failures.length} problem(s):\n\n${failures.join("\n")}\n`);
  process.exit(1);
}
console.log(`\n  ✓ Help Center home and ${(topics.ar?.length ?? 0) + (topics.en?.length ?? 0)} topic pages answer in both languages.\n`);
