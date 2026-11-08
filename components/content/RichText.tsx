import type React from "react";
import {
  RichText as LexicalRichText,
  type JSXConverterArgs,
  type JSXConverters,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";

/*
 * The three table nodes are not in Payload's `DefaultNodeTypes`, because the
 * table feature is still flagged experimental. Their shape is stable and
 * small, so it is declared here rather than reached for through the
 * feature's internals — `children` to render, and the header bitfield.
 */
type TableNode = SerializedLexicalNode & {
  children?: SerializedLexicalNode[];
  headerState?: number;
};

/* The converter map is indexed by `JSXConverter<any>`, so a converter has to
   accept the widest node and narrow for itself. */
const asTable = (node: SerializedLexicalNode): TableNode => node as TableNode;
const kids = (node: SerializedLexicalNode): SerializedLexicalNode[] =>
  asTable(node).children ?? [];

/*
 * Renders what the editor wrote.
 *
 * The node tree is mapped to components rather than injected as HTML. That
 * matters more than it sounds: `dangerouslySetInnerHTML` on CMS output means
 * whatever an editor pastes — from Word, from a webpage, from an email — goes
 * into the page as markup. Mapping nodes means the output is only ever
 * elements this file chose.
 *
 * Styling is applied by the wrapper's `.mk-prose` class rather than per node,
 * so an article and a help page look the same without either knowing about
 * the other.
 */

/*
 * Tables.
 *
 * The default converter writes the grid as inline styles —
 * `border:1px solid #ccc; padding:8px` on every cell. Three things wrong
 * with that here: `#ccc` is a raw hex rather than a token, inline styles
 * beat the `.mk-prose` rules that are supposed to own this, and the colour
 * is a mid grey that was chosen for neither of the site's grounds.
 *
 * So the three table nodes are mapped like every other node, with no style
 * attribute, and globals.css styles `.mk-prose table` the way it styles the
 * rest of the prose. The horizontal scroll lives on the wrapper because a
 * comparison table is the one thing in an article that genuinely cannot
 * stack on a phone.
 */
const tableConverters: JSXConverters = {
  table: ({ node, nodesToJSX }: JSXConverterArgs) => (
    <div className="mk-prose-table">
      <table>
        <tbody>{nodesToJSX({ nodes: kids(node) })}</tbody>
      </table>
    </div>
  ),
  tablerow: ({ node, nodesToJSX }: JSXConverterArgs) => (
    <tr>{nodesToJSX({ nodes: kids(node) })}</tr>
  ),
  tablecell: ({ node, nodesToJSX }: JSXConverterArgs) => {
    const children = nodesToJSX({ nodes: kids(node) });
    // Lexical stores the header state as a bitfield: 1 is a column header
    // (the top row), 2 a row header (the first column). Either is a <th>,
    // and `scope` is what makes the pairing readable to a screen reader —
    // which is most of the value of a comparison table.
    const state = asTable(node).headerState ?? 0;
    if (state === 0) return <td>{children}</td>;
    return <th scope={state === 2 ? "row" : "col"}>{children}</th>;
  },
};

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...tableConverters,
  // Headings start at h2: the page template owns the h1. An editor who picks
  // "Heading 1" in the toolbar would otherwise ship a second one, which is a
  // real accessibility and SEO problem that is invisible while writing.
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const level = Math.min(Math.max(Number(node.tag?.slice(1) ?? 2), 2), 4);
    const Tag = `h${level}` as "h2" | "h3" | "h4";
    return <Tag>{children}</Tag>;
  },
});

export function RichText({
  data,
  className = "",
}: {
  data: unknown;
  className?: string;
}) {
  // An unpublished or empty body is a normal state, not an error — a draft
  // with only a title is a thing people make.
  if (!data || typeof data !== "object") return null;

  return (
    <div className={`mk-prose ${className}`}>
      <LexicalRichText
        data={data as SerializedEditorState}
        converters={converters}
      />
    </div>
  );
}
