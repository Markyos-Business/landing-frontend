import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

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

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
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
