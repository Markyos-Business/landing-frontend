import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
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
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {}, { filename: file })(requireLocal, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const { CURRENT_PRICES, CURRENT_LIMITS, currentPricingPage, currentPricingTeaser } = load(path.join(root, "content/current-pricing.ts"));
const serial = (value) => JSON.parse(JSON.stringify(value));
let comparisons = 0;

// The app sells one thing: a monthly PayPal plan per brand. Every figure on
// the site must be the backend's, and nothing may sell what isn't sold.
const backend = path.resolve(root, "../markyos-backend/apps/brands/billing.py");
if (fs.existsSync(backend)) {
  const literal = fs.readFileSync(backend, "utf8").match(/PRICES = (\{[\s\S]*?\n\})/)[1];
  const cents = JSON.parse(literal.replace(/,\s*([}\]])/g, "$1"));
  assert.deepEqual(Object.keys(cents).sort(), Object.keys(CURRENT_PRICES).sort(), "account types drift from backend PRICES");
  for (const [account, prices] of Object.entries(cents)) {
    assert.equal(CURRENT_PRICES[account].subscription * 100, prices.subscription, `${account}: backend monthly price drift`);
  }
  comparisons++;
}
const platform = path.resolve(root, "../markyos-frontend/src/constants/accountTypes.ts");
if (fs.existsSync(platform)) {
  const { ACCOUNT_TYPES } = load(platform);
  for (const [account, prices] of Object.entries(CURRENT_PRICES)) {
    assert.equal(prices.subscription, ACCOUNT_TYPES[account].prices.subscription, `${account}: platform monthly price drift`);
    assert.deepEqual(serial(CURRENT_LIMITS[account]), serial(ACCOUNT_TYPES[account].limits), `${account}: platform limits drift`);
  }
  comparisons++;
}

for (const locale of ["en", "ar"]) {
  const { pricingPages } = load(path.join(root, `content/pages/${locale}/pricing.ts`));
  const page = pricingPages.find((p) => p.path === "/pricing");
  assert.deepEqual(serial(page), serial(currentPricingPage(locale)));
  const home = load(path.join(root, `content/${locale}/${locale === "en" ? "index" : "overrides"}.ts`));
  const teaser = (home.copy ?? home.overrides).home.pricingTeaser;
  assert.deepEqual(serial(teaser), serial(currentPricingTeaser(locale)));
  const plans = page.blocks.find((b) => b.kind === "plans");
  assert.equal(plans.plans.length, 3);
  assert.equal(plans.billing, undefined, "Do not advertise annual billing without backend support");
  for (const plan of plans.plans) {
    const url = new URL(plan.cta.href, "https://markyos.test");
    const type = url.searchParams.get("type");
    assert(type in CURRENT_PRICES);
    assert.equal(url.searchParams.has("plan"), false, "Signup must not imply a paid purchase");
    assert.equal(plan.price, `$${CURRENT_PRICES[type].subscription}`);
    assert.equal(plan.annual, undefined);
  }
  for (const plan of [...teaser.studioPlans, ...teaser.companyPlans]) {
    assert.equal(new URL(plan.cta.href, "https://markyos.test").searchParams.has("plan"), false);
    assert(plan.price.startsWith("$"));
  }
}

// Retired products and providers never appear on the site again.
const RETIRED = [/project pass/i, /تصريح (ال)?مشروع/, /\bstripe\b/i];
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(ts|tsx|md|mdx|json)$/.test(entry.name) ? [full] : [];
  });
// Comments may still explain history; only shipped strings count.
const withoutComments = (code) =>
  ts.transpileModule(code, { compilerOptions: { removeComments: true, target: ts.ScriptTarget.ES2022 } }).outputText;
const offenders = [];
for (const file of walk(path.join(root, "content"))) {
  const raw = fs.readFileSync(file, "utf8");
  const text = /\.(ts|tsx)$/.test(file) ? withoutComments(raw) : raw;
  for (const pattern of RETIRED) if (pattern.test(text)) offenders.push(`${path.relative(root, file)}: ${pattern}`);
}
assert.deepEqual(offenders, [], `Retired pricing still on the site:\n${offenders.join("\n")}`);

console.log(`Pricing: both locales and homepage agree, no retired products; ${comparisons} sibling billing contracts compared${comparisons < 2 ? " (missing sibling repositories skipped)" : ""}.`);
