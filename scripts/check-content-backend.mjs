import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const code = ts.transpileModule(fs.readFileSync(new URL("../src/lib/content/connection.ts", import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
for(const [env,expected] of [
  [{NODE_ENV:"development"},"http://localhost:8010/api/v1"],
  [{NODE_ENV:"production"},"https://api.markyos.com/api/v1"],
  [{NODE_ENV:"production",VERCEL_ENV:"preview"},"https://api-staging.markyos.com/api/v1"],
  [{NODE_ENV:"production",CONTENT_API_URL:" http://localhost:8010/api/v1/ "},"http://localhost:8010/api/v1"],
]) {
 const mod={exports:{}};
 vm.runInNewContext(`(function(module,exports){${code}\n})`,{process:{env}})(mod,mod.exports);
 assert.equal(mod.exports.contentApiUrl(),expected);
}
const index=fs.readFileSync(new URL("../src/lib/content/index.ts",import.meta.url),"utf8");
assert(!index.includes('from "./payload"'));
const track=fs.readFileSync(new URL("../src/app/api/track/route.ts",import.meta.url),"utf8");
assert(!track.includes("payloadClient"));
assert(!fs.existsSync(new URL("../src/app/(payload)",import.meta.url)));
console.log("Shared backend: local, production, preview and explicit origins passed; no active Payload source, tracking fallback or route group.");
