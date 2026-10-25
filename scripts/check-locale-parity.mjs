#!/usr/bin/env node
/*
 * Report which strings are still waiting for Arabic.
 *
 * The Arabic dictionary inherits anything it has not overridden, which keeps
 * the page whole while the transcreation is in progress — and makes the gap
 * invisible to anyone who reads English. This script is what keeps it visible:
 * it walks the English copy, walks the Arabic overrides, and prints every leaf
 * the Arabic has not claimed. The output is a transcreation brief, in the
 * order a reader meets it on the page.
 *
 *   node scripts/check-locale-parity.mjs              report, exit 0
 *   node scripts/check-locale-parity.mjs --strict     exit 1 if anything is missing
 *
 * `--strict` is deliberately not part of `npm run check` yet: the Arabic is
 * knowingly incomplete today, and a build that fails on a known state is a
 * build nobody can run. Turn it on in the pre-launch gate, once §5 has been
 * reviewed and expanded — that is when a missing Arabic string stops being a
 * known state and becomes a bug. See docs/BEFORE-PUBLISH.md item 6.
 *
 * ── How it reads the copy ───────────────────────────────────────────────────
 *
 * It imports the two modules for real, via Node's type stripping, rather than
 * parsing them. Both files import only types, and `import type` is erased
 * before Node resolves anything — so neither the `@/` path alias nor the rest
 * of the app is involved, and the data this reports on is exactly the data the
 * site renders. An earlier version hand-parsed the object literals and
 * silently under-reported; counting what you actually loaded is the only
 * version of this worth trusting.
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const strict = process.argv.includes("--strict");

const load = async (rel) => {
  const url = pathToFileURL(resolve(root, rel)).href;
  try {
    return await import(url);
  } catch (error) {
    console.error(`✗ Could not load ${rel}\n  ${error.message}`);
    if (String(error.message).includes("Type Stripping")) {
      console.error("  This script needs Node 22.6+ with --experimental-strip-types.");
    }
    process.exit(1);
  }
};

const { copy: en } = await load("content/en/index.ts");
const { overrides: ar } = await load("content/ar/overrides.ts");

/**
 * Walk the English copy and record every leaf, with the Arabic beside it.
 *
 * Arrays are one unit, not one per element: `deepMerge` replaces an array
 * wholesale, so a translated list of four proof points is a single piece of
 * work and reporting it as four would overstate what is left.
 */
function walk(enNode, arNode, path, out) {
  if (Array.isArray(enNode)) {
    out.push({ path, done: Array.isArray(arNode), kind: `list of ${enNode.length}` });
    return;
  }
  if (enNode !== null && typeof enNode === "object") {
    for (const [key, value] of Object.entries(enNode)) {
      const next = arNode !== null && typeof arNode === "object" ? arNode[key] : undefined;
      walk(value, next, path ? `${path}.${key}` : key, out);
    }
    return;
  }
  if (typeof enNode === "string") {
    // An empty English string is a deliberate blank (the final CTA has no
    // eyebrow), not something awaiting Arabic.
    if (enNode === "") return;
    out.push({ path, done: typeof arNode === "string" && arNode.length > 0, kind: "text" });
  }
  // Booleans and numbers (plan.recommended) are not copy.
}

const leaves = [];
walk(en, ar, "", leaves);

/*
 * `href` is not copy.
 *
 * The Arabic hero overrides its CTAs as whole objects, so the href comes along
 * with the label and would otherwise count as translated — flattering the
 * number — while every untranslated href would count as outstanding work that
 * nobody should ever do. A URL is the same in both languages.
 */
const copyLeaves = leaves.filter((l) => !l.path.endsWith(".href"));

const done = copyLeaves.filter((l) => l.done);
const missing = copyLeaves.filter((l) => !l.done);
const pct = copyLeaves.length === 0 ? 0 : Math.round((done.length / copyLeaves.length) * 100);

const bar = (() => {
  const width = 32;
  const filled = Math.round((pct / 100) * width);
  return `${"█".repeat(filled)}${"░".repeat(width - filled)}`;
})();

console.log("");
console.log("  Arabic transcreation status");
console.log("  ──────────────────────────────────────────────────────");
console.log(`  ${bar}  ${pct}%`);
console.log(`  ${done.length} of ${copyLeaves.length} copy items have Arabic.`);
console.log("");

if (missing.length > 0) {
  console.log("  Waiting for Arabic — the transcreation brief, in page order:");
  console.log("");

  let lastSection = "";
  for (const leaf of missing) {
    const parts = leaf.path.split(".");
    // Group by the section a writer would recognise: "home.toneChecker",
    // "footer", "nav".
    const section = parts[0] === "home" ? parts.slice(0, 2).join(".") : parts[0];
    if (section !== lastSection) {
      console.log(`    ${section}`);
      lastSection = section;
    }
    const tail = leaf.path.slice(section.length + 1) || "(self)";
    console.log(`      · ${tail}${leaf.kind === "text" ? "" : `  [${leaf.kind}]`}`);
  }

  console.log("");
  console.log("  Add these to content/ar/overrides.ts. Transcreate, do not translate:");
  console.log("  keep the rhythm, follow the Arabic voice profile for the Markyos");
  console.log("  brand itself, and never run it through a translator (copy doc §1.5, §5).");
  console.log("");
}

if (strict && missing.length > 0) {
  console.error(`✗ ${missing.length} copy items have no Arabic. Required before launch.`);
  process.exit(1);
}

if (missing.length === 0) {
  console.log("  ✓ Arabic is complete.");
} else {
  console.log("  Not a failure yet — run with --strict to make it one (see header).");
}
console.log("");
