import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
function modules(appUrl) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} };
    cache.set(file, mod);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const requireLocal = name => {
      if (name === "@payloadcms/next/withPayload") return { withPayload: config => config };
      assert(name.startsWith("."), `Unexpected runtime dependency: ${name}`);
      let target = path.resolve(path.dirname(file), name);
      if (!fs.existsSync(target)) target += ".ts";
      return load(target);
    };
    vm.runInNewContext(`(function(require,module,exports){${code}\n})`, { URL, process: { env: { NEXT_PUBLIC_APP_URL: appUrl } } }, { filename: file })(requireLocal, mod, mod.exports);
    return mod.exports;
  }
  return load;
}
let cases = 0;
for (const [configured, origin] of [[undefined, "https://app.markyos.com"], [" https://staging.markyos.test/ ", "https://staging.markyos.test"]]) {
  const load = modules(configured);
  const { localeHref, isAppHandoff } = load(path.join(root, "src/lib/i18n/href.ts"));
  for (const lang of ["en", "ar"]) for (const route of ["/start", "/signup", "/register", "/login"]) {
    const target = new URL(localeHref(lang, `${route}?type=company&campaign=launch#form`));
    assert.equal(target.origin, origin);
    assert.equal(target.pathname, route === "/login" ? "/login" : "/signup");
    assert.equal(target.searchParams.get("lang"), lang);
    assert.equal(target.searchParams.get("type"), "company");
    assert.equal(target.searchParams.get("campaign"), "launch");
    assert.equal(target.hash, "#form");
    assert(isAppHandoff(route));
    cases++;
  }
  assert.equal(new URL(localeHref("en", "/start?lang=ar")).searchParams.get("lang"), "ar");
  assert.equal(localeHref("en", "/pricing"), "/en/pricing");
  assert.equal(localeHref("ar", "/pricing"), "/pricing");
  assert.equal(localeHref("en", "mailto:hello@markyos.com"), "mailto:hello@markyos.com");
  assert(!isAppHandoff("/starter"));
  const config = load(path.join(root, "next.config.ts")).default;
  const redirects = await config.redirects();
  for (const source of ["/start", "/signup", "/register", "/login"]) {
    const redirect = redirects.find(entry => entry.source === source);
    assert.equal(redirect?.destination, `${origin}/${source === "/login" ? "login" : "signup"}`);
    assert.equal(redirect.permanent, false);
  }
}
// Catch future drift between the handoff destinations and actual platform routes.
for (const route of ["login", "signup"]) {
  const platform = path.resolve(root, "../markyos-frontend/src/app/(auth)");
  if (fs.existsSync(platform)) assert(fs.existsSync(path.join(platform, route, "page.tsx")), `Missing platform route: ${route}`);
}
console.log(`Auth handoff: ${cases} language/origin/route combinations passed; queries, fragments, legacy redirects and platform routes verified.`);
