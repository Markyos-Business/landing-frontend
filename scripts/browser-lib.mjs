import { createRequire } from "node:module";
import path from "node:path";

/*
 * Where Chromium comes from.
 *
 * This package does not depend on Playwright, and should not: it is a
 * verification tool, not a build or runtime dependency, and pulling a browser
 * driver into the landing page's install for the sake of two scripts is a
 * cost every `npm ci` pays forever.
 *
 * So resolve it from here if it happens to be installed, and otherwise from
 * the product app next door, which has it. If neither has it, say which two
 * places were tried rather than throwing MODULE_NOT_FOUND at somebody who
 * has no reason to know this arrangement exists.
 */

const SIBLINGS = [
  // The product app, one level up from the landing page.
  path.resolve(import.meta.dirname, "../../markyosmvp/package.json"),
];

export function chromium() {
  const tried = [];
  for (const from of [path.resolve(import.meta.dirname, "../package.json"), ...SIBLINGS]) {
    try {
      return createRequire(from)("playwright").chromium;
    } catch {
      tried.push(from);
    }
  }
  console.error(
    "Playwright not found. Tried:\n" +
      tried.map((t) => `  ${t}`).join("\n") +
      "\n\nInstall it in either place (`npm i -D playwright`), or point SIBLINGS\n" +
      "in scripts/browser-lib.mjs at a checkout that has it.",
  );
  process.exit(1);
}

/** The server to drive. Override with BASE_URL to check a deploy. */
export const BASE = process.env.BASE_URL ?? "http://localhost:3210";

export async function assertServerUp() {
  try {
    await fetch(BASE, { signal: AbortSignal.timeout(5000) });
  } catch {
    console.error(`Nothing answering at ${BASE}.\n\n  npm run build && npx next start -p 3210\n`);
    process.exit(1);
  }
}
