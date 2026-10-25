/*
 * A tiny writer for Lexical editor state.
 *
 * The blog, guides and help pages render `RichText`, which takes the editor's
 * serialized node tree — the shape Payload will hand back once editorial
 * content lives in the CMS. The seed content has to be in the same shape, or
 * the page would need a second rendering path and the design review would be
 * of something the real content will never look like.
 *
 * Hand-writing that tree is unreadable, so the seed files are written as
 * plain arrays — a string is a paragraph, `{ h2 }` a heading, `{ ul }` a list
 * — and this converts them. One direction only: this is for seed content, not
 * a general-purpose Markdown parser.
 */

export type Node =
  | string
  | { h2: string }
  | { h3: string }
  | { ul: string[] }
  | { ol: string[] }
  | { quote: string };

type Lex = Record<string, unknown>;

/** `direction` is on every node because Lexical stores it per node. */
const DIR = "rtl";

function text(value: string): Lex {
  return {
    type: "text",
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
    text: value,
    version: 1,
  };
}

function paragraph(value: string): Lex {
  return {
    type: "paragraph",
    children: [text(value)],
    direction: DIR,
    format: "",
    indent: 0,
    textFormat: 0,
    textStyle: "",
    version: 1,
  };
}

function heading(value: string, tag: "h2" | "h3"): Lex {
  return {
    type: "heading",
    tag,
    children: [text(value)],
    direction: DIR,
    format: "",
    indent: 0,
    version: 1,
  };
}

function list(items: string[], ordered: boolean): Lex {
  return {
    type: "list",
    listType: ordered ? "number" : "bullet",
    tag: ordered ? "ol" : "ul",
    start: 1,
    children: items.map((item, i) => ({
      type: "listitem",
      value: i + 1,
      checked: undefined,
      children: [text(item)],
      direction: DIR,
      format: "",
      indent: 0,
      version: 1,
    })),
    direction: DIR,
    format: "",
    indent: 0,
    version: 1,
  };
}

function quote(value: string): Lex {
  return {
    type: "quote",
    children: [text(value)],
    direction: DIR,
    format: "",
    indent: 0,
    version: 1,
  };
}

export function body(nodes: Node[]): unknown {
  return {
    root: {
      type: "root",
      children: nodes.map((node) => {
        if (typeof node === "string") return paragraph(node);
        if ("h2" in node) return heading(node.h2, "h2");
        if ("h3" in node) return heading(node.h3, "h3");
        if ("ul" in node) return list(node.ul, false);
        if ("ol" in node) return list(node.ol, true);
        return quote(node.quote);
      }),
      direction: DIR,
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

/** Roughly how long the piece takes to read, from its own word count. */
export function readingMinutes(nodes: Node[]): number {
  const words = nodes
    .map((node) => {
      if (typeof node === "string") return node;
      if ("h2" in node) return node.h2;
      if ("h3" in node) return node.h3;
      if ("ul" in node) return node.ul.join(" ");
      if ("ol" in node) return node.ol.join(" ");
      return node.quote;
    })
    .join(" ")
    .split(/\s+/).length;
  // ~180 Arabic words a minute, and never less than one.
  return Math.max(1, Math.round(words / 180));
}
