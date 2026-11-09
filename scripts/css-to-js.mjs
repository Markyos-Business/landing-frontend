/*
 * CSS → Tailwind CSS-in-JS, comments kept.
 *
 * The site's styles live in `tailwind/*.js` as the objects Tailwind's
 * `addBase` takes, the way markyos-frontend keeps its own. This turns a
 * stylesheet into that shape without re-deciding anything: every selector,
 * declaration and at-rule comes across verbatim and in its original order,
 * and every comment lands beside the rule it was written for.
 *
 * ── Why some blocks are arrays ────────────────────────────────────────────
 *
 * A JS object cannot hold the same key twice, and CSS repeats selectors on
 * purpose — the same class again further down, after the rule it has to win
 * against. Writing those into one object would merge them into the first
 * one's position and silently change the cascade. So a block whose children
 * repeat a key is written as an array of one-key objects, which Tailwind
 * emits in array order (see `ke()` in tailwindcss/dist/lib.mjs); a block with
 * no repeats stays a plain object, which reads better and emits the same.
 * The top level of a module is always an array, for the same reason.
 *
 * Used by `npm run sync:tokens`, and once to move styles/*.css into
 * tailwind/ on 9 Nov 2026.
 */

import postcss from "postcss";

const INDENT = "  ";

function comment(node, pad) {
  const text = `/*${node.raws.left ?? " "}${node.text}${node.raws.right ?? " "}*/`;
  return text
    .split("\n")
    .map((line, i) => (i === 0 ? pad + line : line.replace(/^\s*/, pad + " ")))
    .join("\n");
}

function key(node) {
  if (node.type === "rule") return node.selectors.join(", ");
  if (node.type === "atrule") return `@${node.name}${node.params ? " " + node.params : ""}`;
  return node.prop;
}

function emitBody(nodes, pad) {
  const entries = nodes.filter((n) => n.type !== "comment");
  const keys = entries.map(key);
  const repeats = new Set(keys).size !== keys.length;
  const inner = pad + INDENT;
  const lines = [];
  for (const node of nodes) {
    if (node.type === "comment") {
      lines.push(comment(node, inner));
      continue;
    }
    const pair = emitPair(node, inner);
    lines.push(repeats ? `${inner}{ ${pair.trimStart()} },` : `${pair},`);
  }
  if (!lines.length) return "{}";
  return `${repeats ? "[" : "{"}\n${lines.join("\n")}\n${pad}${repeats ? "]" : "}"}`;
}

function emitPair(node, pad) {
  if (node.type === "decl") {
    const value = node.value + (node.important ? " !important" : "");
    return `${pad}${JSON.stringify(node.prop)}: ${JSON.stringify(value)}`;
  }
  if (node.type === "rule" || node.type === "atrule") {
    if (node.type === "atrule" && !node.nodes) {
      throw new Error(`Body-less at-rule @${node.name} ${node.params} cannot be written as CSS-in-JS`);
    }
    return `${pad}${JSON.stringify(key(node))}: ${emitBody(node.nodes, pad)}`;
  }
  throw new Error(`Unhandled node type ${node.type}`);
}

/**
 * Convert top-level nodes to an exported array.
 *
 * `unwrapLayer` drops an enclosing `@layer <name> { … }` — every module is
 * registered through `addBase`, which supplies the layer itself.
 */
export function nodesToModule(nodes, exportName, { header = "", unwrapLayer = false } = {}) {
  let list = nodes;
  if (unwrapLayer) {
    list = list.flatMap((n) => (n.type === "atrule" && n.name === "layer" && n.nodes ? n.nodes : [n]));
  }
  const lines = [];
  for (const node of list) {
    if (node.type === "comment") lines.push(comment(node, INDENT));
    else lines.push(`${INDENT}{ ${emitPair(node, INDENT).trimStart()} },`);
  }
  return `${header}export const ${exportName} = [\n${lines.join("\n")}\n];\n`;
}

export function cssToModule(css, exportName, options) {
  return nodesToModule(postcss.parse(css).nodes, exportName, options);
}

export { postcss };
