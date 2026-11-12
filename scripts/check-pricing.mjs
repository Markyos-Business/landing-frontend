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
const { CURRENT_PRICES, currentPricingPage, currentPricingTeaser } = load(path.join(root, "content/current-pricing.ts"));
const serial = (value) => JSON.parse(JSON.stringify(value));
let comparisons = 0;
const backend = path.resolve(root, "../markyos-backend/apps/brands/billing.py");
if (fs.existsSync(backend)) {
  const literal = fs.readFileSync(backend, "utf8").match(/PRICES = (\{[\s\S]*?\n\})/)[1];
  const cents = JSON.parse(literal.replace(/,\s*([}\]])/g, "$1"));
  for (const [account, prices] of Object.entries(cents)) {
    assert.equal(CURRENT_PRICES[account].pass * 100, prices.pass, `${account}: backend pass price drift`);
    assert.equal(CURRENT_PRICES[account].subscription * 100, prices.subscription, `${account}: backend monthly price drift`);
  }
  comparisons++;
}
const platform = path.resolve(root, "../markyos-frontend/src/constants/accountTypes.ts");
if (fs.existsSync(platform)) {
  const { ACCOUNT_TYPES } = load(platform);
  for (const [account, prices] of Object.entries(CURRENT_PRICES)) assert.deepEqual(serial(prices), serial(ACCOUNT_TYPES[account].prices), `${account}: platform price drift`);
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
    assert.equal(plan.price, `$${CURRENT_PRICES[type].pass}`);
    assert(plan.rows[0].value.includes(`$${CURRENT_PRICES[type].subscription}`));
    assert.equal(plan.annual, undefined);
  }
  for (const plan of [...teaser.studioPlans, ...teaser.companyPlans]) assert.equal(new URL(plan.cta.href, "https://markyos.test").searchParams.has("plan"), false);
}
console.log(`Pricing: both locales and homepage agree; ${comparisons} sibling billing contracts compared${comparisons < 2 ? " (missing sibling repositories skipped)" : ""}.`);
