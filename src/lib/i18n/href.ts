import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

/*
 * Turn a copy href into a real one.
 *
 * Copy stores paths the way a writer thinks about them — "/pricing" — with no
 * locale in them. There is one correct place to add it, and this is that
 * place, so no component has to remember and no copy file has to be duplicated
 * per language just to carry a prefix.
 *
 * ── Arabic has no prefix ──────────────────────────────────────────────────
 *
 * The default locale is Arabic and it lives at the root: `/pricing`, not
 * `/ar/pricing`. English carries its segment: `/en/pricing`. That asymmetry
 * is the whole of the Arabic copy document §0.5, and it exists in exactly two
 * places — here, and in `src/proxy.ts`, which maps the unprefixed URL onto the
 * `src/app/[lang]` route that actually renders it.
 *
 * The slugs stay English in both languages, also per §0.5: they are easier to
 * share and to type, and Arabic slugs get percent-mangled by most apps.
 *
 * Four kinds of href are left exactly as written:
 *
 *   - absolute URLs, which point off-site;
 *   - "#anchor", which stays on the page being read;
 *   - "/start" and "/login", which are the hand-off into the product app and
 *     are redirected out by next.config.ts. These must never be localised:
 *     prefixing them would produce /en/start, which no route serves and the
 *     proxy would not rescue, so the single most important link on the page
 *     would 404;
 *   - "mailto:" and "tel:".
 */

const PASSTHROUGH_PREFIXES = ["/start", "/login"];

/**
 * Whether this href hands off to the product app rather than staying here.
 *
 * `next.config.ts` redirects /start and /login to app.markyos.com, so these
 * are cross-origin links wearing a relative href. That matters for
 * prefetching: Next prefetches every <Link> in the viewport, and the CTA is
 * in the header of every page, so without this each page load fires a request
 * at another origin that can only ever answer with a redirect. Nothing is
 * cached by it, because what comes back is not a route in this app.
 *
 * Found by driving the site: every page reported a failed request to
 * app.markyos.com before the first interaction.
 */
export function isAppHandoff(href: string): boolean {
  return PASSTHROUGH_PREFIXES.some(
    (p) => href === p || href.startsWith(`${p}?`) || href.startsWith(`${p}/`),
  );
}

/** The URL prefix a locale is published under — "" for Arabic, "/en". */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function localeHref(locale: Locale, href: string): string {
  if (/^[a-z]+:/i.test(href)) return href; // http:, https:, mailto:, tel:
  if (href.startsWith("#")) return href;
  if (isAppHandoff(href)) return href;

  const prefix = localePrefix(locale);
  // "/" under the unprefixed locale is "/" and not the empty string, which is
  // not a URL; under /en it is "/en" and not "/en/", because a trailing slash
  // would be a second URL for the same page.
  if (href === "/") return prefix || "/";
  return `${prefix}${href}`;
}

/**
 * Split a public pathname into its locale and the route below it.
 *
 * Takes the path as the browser has it, which for Arabic has no locale in it
 * at all. An explicit "/ar/..." is still recognised — `src/proxy.ts` redirects it
 * to the canonical unprefixed form, but this runs on the client too and must
 * not mis-read a URL that is mid-redirect.
 */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) {
    const rest = segments.slice(1).join("/");
    return { locale: first, path: rest ? `/${rest}` : "/" };
  }

  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/**
 * The same page in the other locale, for the language switcher.
 *
 * Swapping the segment is not enough once one locale is unprefixed: going
 * from /en/pricing to Arabic means *dropping* a segment, and coming back
 * means adding one. So the path is split and rebuilt rather than patched —
 * which also means the switcher keeps the reader on the page they were
 * reading, the single most irritating thing a bilingual site can get wrong.
 */
export function swapLocaleInPath(pathname: string, next: Locale): string {
  const { path } = splitLocalePath(pathname);
  return localeHref(next, path);
}
