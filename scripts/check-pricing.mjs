import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

/*
 * Pricing has one source: the backend's `GET /billing/plans/`, read at render
 * by src/lib/billing/plans.ts. This check keeps it that way.
 *
 *   1. No price figure is written into the pricing content or components.
 *   2. Nothing sells what isn't sold: no Stripe, no Project Pass, no annual
 *      billing, no `?plan=` on a sign-up link.
 *   3. The account types the site lays out are the backend's PRICES keys
 *      (when ../markyos-backend is checked out beside this repo).
 *   4. The builders render both locales with figures from a sample payload,
 *      and without any when the backend was unreachable.
 */

const root = path.resolve(import.meta.dirname, "..");
const rel = (file) => path.relative(root, file);
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const requireLocal = (name) => {
    assert(name.startsWith("."), `Unexpected runtime dependency: ${name}`);
    let target = path.resolve(path.dirname(file), name);
    if (!fs.existsSync(target)) target += ".ts";
    return load(target);
  };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, { Intl }, { filename: file })(requireLocal, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
// Comments may still explain history; only shipped strings count.
const withoutComments = (code) =>
  ts.transpileModule(code, { compilerOptions: { removeComments: true, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.Preserve } }).outputText;
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(ts|tsx|md|mdx|json)$/.test(entry.name) ? [full] : [];
  });
const shipped = (file) => {
  const raw = fs.readFileSync(file, "utf8");
  return /\.(ts|tsx)$/.test(file) ? withoutComments(raw) : raw;
};

const pricing = load(path.join(root, "content/current-pricing.ts"));
const { ACCOUNT_TYPES, currentPricingPage, currentPricingTeaser, resolvePriced, teaserPlans } = pricing;
assert.equal(pricing.CURRENT_PRICES, undefined, "CURRENT_PRICES is back: prices come from /billing/plans/");
assert.equal(pricing.CURRENT_LIMITS, undefined, "CURRENT_LIMITS is back: limits come from /billing/plans/");

// 1. No hard-coded price figures where pricing is written or drawn.
const PRICING_FILES = [
  "content/current-pricing.ts",
  "content/pages/en/pricing.ts",
  "content/pages/ar/pricing.ts",
  "src/components/public/home/pricing-teaser",
  "src/components/public/pages/blocks/PlansBlock.tsx",
  "src/components/public/pages/blocks/PricedBlock.tsx",
  "src/lib/billing",
].flatMap((p) => {
  const full = path.join(root, p);
  return fs.statSync(full).isDirectory() ? walk(full) : [full];
});
const CURRENCY_FIGURE = [
  /[$€£]\s?\d/, // $29, $ 29
  /\d+(\.\d+)?\s?(USD|usd|SAR|دولار|ريال)/, // 29 USD, 29 دولاراً
  /(USD|SAR)\s?\d/, // USD 29
  /\b\d{3,5}\s*(cents|سنت)/, // 2900 cents
];
// A literal amount in a number slot: { monthly: 2900 }, subscription: 29.
const AMOUNT_FIELD = /\b(monthly|subscription|price|amount)\s*:\s*\d/;
const figures = [];
for (const file of PRICING_FILES) {
  const text = shipped(file);
  for (const pattern of [...CURRENCY_FIGURE, AMOUNT_FIELD]) {
    const hit = text.match(pattern);
    if (hit) figures.push(`${rel(file)}: "${hit[0]}"`);
  }
}
assert.deepEqual(figures, [], `Hard-coded price figures; read them from /billing/plans/:\n${figures.join("\n")}`);

// The current plan amounts, written as money anywhere on the site.
const backendFile = path.resolve(root, "../markyos-backend/apps/brands/billing.py");
const backendSource = fs.existsSync(backendFile) ? fs.readFileSync(backendFile, "utf8") : null;
const amounts = new Set([19, 29, 99]);
if (backendSource) {
  for (const [, cents] of backendSource.matchAll(/"subscription":\s*(\d+)/g)) amounts.add(Number(cents) / 100);
}
const list = [...amounts].join("|");
const PLAN_AMOUNT = [new RegExp(`\\$\\s?(${list})(?![\\d.,])`), new RegExp(`(?<![\\d.])(${list})\\s?(USD|دولار)`)];
const stray = [];
for (const file of [...walk(path.join(root, "content")), ...walk(path.join(root, "src"))]) {
  const text = shipped(file);
  for (const pattern of PLAN_AMOUNT) {
    const hit = text.match(pattern);
    if (hit) stray.push(`${rel(file)}: "${hit[0]}"`);
  }
}
assert.deepEqual(stray, [], `A current plan price is written into the site:\n${stray.join("\n")}`);

// 2. Retired products and providers never appear on the site again.
const RETIRED = [
  /project pass/i, /تصريح (ال)?مشروع/, /\bstripe\b/i,
  // The pre-billing plan model (Nov 2026): plan names, project slots, seats and
  // the partner reward. The app sells one plan per brand, by account type.
  /\b(Solo|Starter|Agency|Business|Enterprise|Brand|Team|Pro) plans?\b/,
  /\bon (Solo|Pro|Agency|Brand|Team|Starter)\b/,
  /partner reward|\b2[05]% (of what|back|when)/i,
  /«(الوكالة|العلامة|الفريق|البداية|الفردية|الاحترافية|الأعمال|المؤسسات)»/,
  /مكافأة الشريك|حصة المشروع|خطة المؤسسات|الخطة الاحترافية/,
  // A dollar figure in copy is a price that can drift from /billing/plans/.
  /\$\d/,
];
const offenders = [];
for (const file of [...walk(path.join(root, "content")), ...walk(path.join(root, "src/components"))]) {
  const text = shipped(file);
  for (const pattern of RETIRED) if (pattern.test(text)) offenders.push(`${rel(file)}: ${pattern}`);
}
assert.deepEqual(offenders, [], `Retired pricing still on the site:\n${offenders.join("\n")}`);

// 3. The account types are the backend's.
let compared = false;
if (backendSource) {
  const literal = backendSource.match(/^PRICES = \{([\s\S]*?)\n\}/m);
  assert(literal, "PRICES not found in markyos-backend/apps/brands/billing.py");
  const keys = [...literal[1].matchAll(/^\s{4}"([a-z_]+)":/gm)].map((m) => m[1]);
  assert.deepEqual([...keys].sort(), ["company", "freelancer", "studio"], "backend PRICES keys must be studio/freelancer/company");
  assert.deepEqual([...ACCOUNT_TYPES].sort(), [...keys].sort(), "site account types drift from backend PRICES");
  compared = true;
}

// 4. Both locales render from a payload, and without one.
const serial = (value) => JSON.parse(JSON.stringify(value));
const SAMPLE = {
  currency: "usd",
  interval: "month",
  perBrand: true,
  free: { brands: 1, editors: 0 },
  types: {
    studio: { monthly: 4100, limits: { brands: null, editors: null } },
    freelancer: { monthly: 3100, limits: { brands: 3, editors: 0 } },
    company: { monthly: 13100, limits: { brands: 1, editors: null } },
  },
};
const asText = (value) => JSON.stringify(value);
for (const locale of ["en", "ar"]) {
  const { pricingPages } = load(path.join(root, `content/pages/${locale}/pricing.ts`));
  const page = pricingPages.find((p) => p.path === "/pricing");
  assert.deepEqual(serial(page), serial(currentPricingPage(locale)));
  const home = load(path.join(root, `content/${locale}/${locale === "en" ? "index" : "overrides"}.ts`));
  const teaser = (home.copy ?? home.overrides).home.pricingTeaser;
  assert.deepEqual(serial(teaser), serial(currentPricingTeaser(locale)));

  const priced = page.blocks.filter((b) => b.kind === "priced");
  assert.deepEqual(serial(priced.map((b) => b.part).sort()), ["compare", "plans"], "/pricing shows the plans and the free-vs-paid comparison");
  for (const block of priced) {
    const withFigures = asText(resolvePriced(block, locale, SAMPLE));
    const without = asText(resolvePriced(block, locale, null));
    for (const figure of ["$41", "$31", "$131"]) {
      assert(withFigures.includes(figure), `${locale} ${block.part}: ${figure} from the payload is not shown`);
      assert(!without.includes(figure), `${locale} ${block.part}: a figure shown without plans`);
    }
    assert(!/[$]\s?\d/.test(without), `${locale} ${block.part}: a figure shown without plans`);
  }

  const plans = resolvePriced(priced.find((b) => b.part === "plans"), locale, SAMPLE);
  assert.equal(plans.plans.length, 3);
  assert.equal(plans.billing, undefined, "Do not advertise annual billing without backend support");
  for (const plan of plans.plans) {
    const url = new URL(plan.cta.href, "https://markyos.test");
    const type = url.searchParams.get("type");
    assert(ACCOUNT_TYPES.includes(type));
    assert.equal(url.searchParams.has("plan"), false, "Signup must not imply a paid purchase");
    assert.equal(plan.price, `$${SAMPLE.types[type].monthly / 100}`);
    assert.equal(plan.annual, undefined);
  }

  const compare = resolvePriced(priced.find((b) => b.part === "compare"), locale, SAMPLE);
  assert.equal(compare.head.length, 2 + ACCOUNT_TYPES.length, "free column plus one per account type");
  assert.equal(compare.rows[1][1], String(SAMPLE.free.brands), "free brands come from the payload");

  for (const plans of [SAMPLE, null]) {
    const cards = teaserPlans(locale, plans);
    for (const plan of [...cards.studioPlans, ...cards.companyPlans]) {
      assert.equal(new URL(plan.cta.href, "https://markyos.test").searchParams.has("plan"), false);
      assert.equal(Boolean(plan.price), Boolean(plans));
    }
  }
}

console.log(
  `Pricing: no hard-coded figures, no retired products; both locales render from /billing/plans/ and without it; ${
    compared ? "account types match backend PRICES" : "markyos-backend not found, PRICES keys skipped"
  }.`,
);
