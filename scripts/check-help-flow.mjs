import { BASE, assertServerUp, launch } from "./browser-lib.mjs";

/*
 * The Help Center, end to end, the way a visitor uses it (HC-EPIC-001):
 * search from the Help Center home → open a result → answer "Was this
 * article helpful?". In English with Yes, in Arabic with No + a reason and
 * a comment. Each run is a new visitor (its own browser identity), so the
 * platform's one-vote-per-visitor guard doesn't refuse a second run.
 *
 *   BASE_URL=http://localhost:3120 npm run check:help-flow
 */

await assertServerUp();

/*
 * Nothing to walk through without published help content: with none, or with
 * no CONTENT_API_URL at all (CI builds the site without a backend), /help is
 * the fallback page and has no article to search for. The same rule as
 * check:help, which this follows; once the API reports content, the flow is
 * checked again.
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
if (!(await helpPublished())) {
  console.log(
    `\n  ✓ Help Center flow skipped: ${API ? "the help API has no published content" : "no CONTENT_API_URL (no help API)"}, so there is no article to search for.\n`,
  );
  process.exit(0);
}

const browser = await launch();
const run = Math.random().toString(36).slice(2, 10);
const failures = [];

const cases = [
  { lang: "en", root: "/en", vote: "Yes", thanks: "Thanks. Glad it helped." },
  {
    lang: "ar",
    root: "",
    vote: "لا",
    reason: "غير واضحة",
    comment: "الخطوة الثانية غير واضحة.",
    send: "أرسل",
    thanks: "شكراً لك. سنستفيد من رأيك لتحسين المقالة.",
  },
];

for (const c of cases) {
  const context = await browser.newContext({
    userAgent: `Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/131 Safari/537.36 help-flow/${run}-${c.lang}`,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}${c.root}/help`, { waitUntil: "load" });
    // A word from the first article on the page, so the check fits any content.
    const title = (await page.locator("a.mk-help-row").first().textContent()) ?? "";
    const word = title.split(/\s+/).find((w) => w.length > 3) ?? title.trim();
    const box = page.getByRole("searchbox").first();
    await box.fill(word);
    await box.press("Enter");
    await page.waitForURL(/\/help\/search\?/);
    const first = page.getByRole("option").first();
    await first.waitFor({ timeout: 10000 });
    await first.click();
    await page.waitForURL(/\/help\/[^/]+\/[^/?#]+$/, { timeout: 10000 });

    const feedback = page.locator("section.mk-help-feedback");
    await feedback.getByRole("button", { name: c.vote, exact: true }).click();
    if (c.reason) {
      await feedback.getByLabel(c.reason).check();
      await feedback.getByRole("textbox").fill(c.comment);
      await feedback.getByRole("button", { name: c.send, exact: true }).click();
    }
    await feedback.getByRole("heading", { name: c.thanks }).waitFor({ timeout: 10000 });

    // Coming back says thanks again instead of asking.
    await page.reload({ waitUntil: "load" });
    await feedback.getByRole("heading", { name: c.thanks }).waitFor({ timeout: 10000 });
    console.log(`  ✓ ${c.lang}: searched “${word}”, opened ${decodeURI(new URL(page.url()).pathname)}, answered ${c.vote}`);
  } catch (error) {
    failures.push(`  ${c.lang}: ${error.message.split("\n")[0]}`);
    await page.screenshot({ path: `help-flow-${c.lang}-failure.png`, fullPage: true }).catch(() => {});
  }
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error(`\n✗ Help Center flow:\n${failures.join("\n")}\n`);
  process.exit(1);
}
console.log("\n  ✓ A visitor can search, open an article and vote, in both languages.\n");
