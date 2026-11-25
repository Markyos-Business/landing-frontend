/*
 * Renders an article body.
 *
 * From the platform (src/lib/content/django.ts) the body is HTML. It is
 * cleaned against an allowlist twice before it arrives — when it is saved and
 * again when it is served — so it can hold only the elements the platform's
 * editor makes: no scripts, no handlers, no styles, no h1. The one change made
 * here is the scroll wrapper every table gets.
 *
 * The Lexical renderer for Payload's JSON bodies was removed on 25 Nov 2026:
 * nothing on the site reads Payload any more, and the one-off export converts
 * its bodies to HTML on the way out.
 *
 * Styling is applied by the wrapper's `.mk-prose` class rather than per
 * element, so an article and a help page look the same without either knowing
 * about the other.
 */
export function RichText({
  data,
  className = "",
}: {
  data: unknown;
  className?: string;
}) {
  // An unpublished or empty body is a normal state, not an error — a draft
  // with only a title is a thing people make.
  if (typeof data !== "string" || !data) return null;
  const html = data
    .replace(/<table\b/g, '<div class="mk-prose-table"><table')
    .replace(/<\/table>/g, "</table></div>");
  return <div className={`mk-prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
