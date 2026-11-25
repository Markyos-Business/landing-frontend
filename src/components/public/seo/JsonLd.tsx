/*
 * Structured data for a page, as one schema.org graph.
 *
 * The content is our own copy or the CMS's published fields, never raw user
 * input, and JSON.stringify escapes what matters. `</script>` inside a string
 * would still break out, so `<` is escaped the same way PageView does it.
 */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }) {
  if (!graph.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
