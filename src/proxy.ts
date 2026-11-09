import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
 * Locale routing.
 *
 * In Next 16 this file is `src/proxy.ts`, not `middleware.ts` — the middleware
 * convention is deprecated and renamed. Proxy is deployed to the edge and must
 * not rely on shared module state, so the two locale segments are written out
 * literally here rather than imported: this file *is* the mapping between the
 * public URL shape and the `src/app/[lang]` route, and a constant that could drift
 * from it would be the bug, not the fix.
 *
 * ── The shape ─────────────────────────────────────────────────────────────
 *
 * Arabic is the site. It is served from the root — `/`, `/pricing` — and
 * English lives under `/en`. Every page renders from `src/app/[lang]`, so an
 * unprefixed path has no route to match and is **rewritten** onto `/ar/...`.
 * A rewrite, not a redirect: the reader's URL stays clean, and the page that
 * answers it is the same statically generated one.
 *
 * `/ar/...` is therefore an internal path that leaked, and it 301s to the
 * canonical unprefixed URL. Without that, every Arabic page would exist at
 * two addresses — which splits its ranking and makes the canonical tag argue
 * with the server.
 *
 * ── Why there is no Accept-Language negotiation any more ───────────────────
 *
 * There was, and it sent a browser asking for English to `/en`. That was
 * right when the two editions were equals. They are not: Arabic is the
 * primary edition and English is being translated from it, so content
 * negotiation would send an English-speaking visitor to the *less* finished
 * half of the site on the strength of a header they never set deliberately.
 * The language switch in the header is explicit, discoverable, and crawlable,
 * which is what that choice should be.
 */

const AR = "/ar";
const EN = "/en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // English keeps its segment and matches a route as written.
  if (pathname === EN || pathname.startsWith(`${EN}/`)) {
    return NextResponse.next();
  }

  // The internal Arabic path, made canonical. 301 and not 307: the mapping is
  // a property of the site, not of who is asking, so it is safe to cache for
  // ever and cheap for everyone after the first visitor.
  if (pathname === AR || pathname.startsWith(`${AR}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(AR.length) || "/";
    return NextResponse.redirect(url, 301);
  }

  // Everything else is Arabic.
  const url = request.nextUrl.clone();
  url.pathname = `${AR}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /*
   * Without a matcher, proxy runs on every request including `_next/static`
   * and everything in `public/` — which would rewrite the font and logo URLs
   * and break them. The negative lookahead also exempts the routes that must
   * stay locale-free: the API, and the files search engines fetch at a fixed
   * path.
   */
  matcher: [
    /*
     * `admin` is excluded for the same reason `api` is: the CMS is not a
     * localized marketing page. Without it, /admin would be rewritten to
     * /ar/admin, which no route serves — the admin panel would 404 and the
     * cause would not be obvious.
     *
     * `icon`, `apple-icon` and `opengraph-image` are Next's generated metadata
     * routes. They are referenced from the <head> at the site root, so sending
     * them through the locale rewrite turns every tab icon and every social
     * card into a 404. Found by running the page and reading the network log.
     */
    "/((?!_next|api|admin|start|login|favicon|icon|apple-icon|opengraph-image|robots\.txt|sitemap\.xml|fonts/|brand/).*)",
  ],
};
