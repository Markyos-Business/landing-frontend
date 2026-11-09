/*
 * Route params, turned back into the values they stand for.
 *
 * A dynamic segment arrives percent-encoded, because that is what was on the
 * wire: a browser asking for /blog/السلام sends
 * /blog/%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85, and `params.slug` is that
 * string. `generateStaticParams`, meanwhile, returns slugs straight out of
 * the CMS, decoded. So the two halves of the same route disagree for any slug
 * that is not plain ASCII — which, on an Arabic-first site, is the case the
 * moment somebody writes a post title in Arabic and lets the CMS slugify it.
 *
 * It fails quietly and completely: the route prerenders, the file lands in
 * .next, and the page inside it is the 404. The blog index links to the piece
 * and the link is dead. A build cannot catch it, and it does not show up at
 * all until a non-ASCII slug exists — which is why it was found by probing a
 * cold server for every article rather than by reading the code.
 */

/**
 * The decoded form of a single dynamic segment.
 *
 * Falls back to the raw value when the segment is not valid percent-encoding
 * (`/blog/%zz`, a hand-mangled URL, a scanner). That value will not match
 * anything and the page 404s, which is the honest answer — better than a 500
 * from a request nobody meant to make.
 */
export function routeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
