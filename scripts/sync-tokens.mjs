#!/usr/bin/env node
/*
 * Sync the design tokens from the platform app into this one.
 *
 * ── Why this exists ─────────────────────────────────────────────────────────
 *
 * The marketing site and the product are two deploys, and the single worst
 * outcome for a company whose whole pitch is "brand decay is what happens when
 * a brand lives in two places" is a marketing site whose blue is not the
 * product's blue. Copying the tokens once guarantees exactly that, six months
 * from now, quietly.
 *
 * So the tokens are generated, never authored here. `lib/theme.ts` and
 * `app/globals.css` in the platform app remain the only place a brand value is
 * decided; this script lifts the three token blocks out and writes them to
 * `app/tokens.generated.css`, which `app/globals.css` imports and no one edits.
 *
 * ── The two modes ───────────────────────────────────────────────────────────
 *
 *   node scripts/sync-tokens.mjs            re-generate from the platform app
 *   node scripts/sync-tokens.mjs --check    fail if the committed file is stale
 *
 * `--check` runs inside `npm run check`, so a token change in the platform app
 * that nobody pulled across turns into a failed build here rather than a
 * slightly-wrong blue on the homepage.
 *
 * ── The one assumption ──────────────────────────────────────────────────────
 *
 * The platform app sits beside this one, which is true of the repository
 * layout today ("Platform Code/markyosmvp" and "Platform Code/Landing Page").
 * Pass --source to point elsewhere; set MARKYOS_PLATFORM_CSS in CI, where the
 * sibling checkout may not exist. If the source is missing, --check passes with
 * a warning rather than failing: a contributor without the platform repo
 * checked out should still be able to build the marketing site.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const sourceArg = args.find((a) => a.startsWith("--source="))?.split("=")[1];

const SOURCE =
  sourceArg ??
  process.env.MARKYOS_PLATFORM_CSS ??
  resolve(root, "..", "markyosmvp", "app", "globals.css");

const TARGET = resolve(root, "app", "tokens.generated.css");

/** The blocks we lift, in the order they must appear. */
const BLOCKS = [
  { selector: ":root {", name: "dark theme (the default)" },
  { selector: ':root[data-theme="light"] {', name: "light theme" },
  { selector: "@theme inline {", name: "Tailwind v4 theme mapping" },
];

/**
 * Extract a top-level CSS block by its opening line.
 *
 * A brace counter rather than a regex, because the blocks contain nested
 * parens and long comments, and `[\s\S]*?}` would stop at the first closing
 * brace inside a comment.
 */
function extractBlock(css, selector) {
  const start = css.indexOf(`\n${selector}`);
  if (start === -1) return null;

  let depth = 0;
  let i = start + 1;
  for (; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return css.slice(start + 1, i + 1);
    }
  }
  return null;
}

function generate() {
  const css = readFileSync(SOURCE, "utf8");
  const parts = [];

  for (const { selector, name } of BLOCKS) {
    const block = extractBlock(css, selector);
    if (!block) {
      console.error(
        `✗ Could not find the ${name} block ("${selector}") in:\n  ${SOURCE}\n` +
          `  The platform app's globals.css has been restructured. Update BLOCKS in this script.`,
      );
      process.exit(1);
    }
    parts.push(block);
  }

  return [
    "/*",
    " * GENERATED FILE — DO NOT EDIT.",
    " *",
    " * Written by `npm run sync:tokens` from the platform app's app/globals.css.",
    " * Edit the tokens there; this file is a copy and any change made here is",
    " * lost on the next sync and reported as drift by `npm run check:tokens`.",
    " *",
    " * The token contract these belong to is documented in the platform repo at",
    " * docs/token-contract.md. The two rules that matter to this site:",
    " *   - consume a token, never hardcode a hex, radius or type size;",
    " *   - a token may be added, never renamed, removed or redefined.",
    " */",
    "",
    ...parts,
    "",
  ].join("\n");
}

if (!existsSync(SOURCE)) {
  const message =
    `⚠ Platform stylesheet not found at:\n  ${SOURCE}\n` +
    `  Pass --source=<path> or set MARKYOS_PLATFORM_CSS to sync tokens.`;
  if (checkOnly) {
    // Not a failure: someone building only the marketing site has no reason to
    // have the platform repo checked out, and the committed tokens are valid.
    console.warn(`${message}\n  Skipping token drift check.`);
    process.exit(0);
  }
  console.error(message);
  process.exit(1);
}

const next = generate();

if (checkOnly) {
  const current = existsSync(TARGET) ? readFileSync(TARGET, "utf8") : "";
  if (current !== next) {
    console.error(
      "✗ Design tokens are out of date.\n" +
        "  The platform app's tokens have changed since app/tokens.generated.css was written.\n" +
        "  Run `npm run sync:tokens` and commit the result.",
    );
    process.exit(1);
  }
  console.log("✓ Design tokens match the platform app.");
  process.exit(0);
}

writeFileSync(TARGET, next, "utf8");

const tokenCount = (next.match(/^\s{2}--[\w-]+:/gm) ?? []).length;
console.log(
  `✓ Wrote app/tokens.generated.css — ${tokenCount} declarations from ${BLOCKS.length} blocks.`,
);
