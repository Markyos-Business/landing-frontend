import type { PageDoc } from "@/content/pages/types";
import { pages as arabicPages } from "@/content/pages/ar";
import { pages as englishPages } from "@/content/pages/en";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/locales";

/*
 * The page registry.
 *
 * One list per language, and every consequence of a page existing follows
 * from them: the route is generated, the sitemap entry is generated, the
 * hreflang pair is generated, and the 404 for anything not in them is
 * generated. There is no second place to remember.
 *
 * ── Arabic owns the path list ─────────────────────────────────────────────
 *
 * Arabic is the site, and it is written first. The Arabic set decides which
 * paths exist; the English set is an *edition* of those paths, never a new
 * one. An English page at a path Arabic does not have would be a route with
 * no canonical and no pair, so it is a build error rather than a surprise.
 *
 * ── A path may have one edition or two ────────────────────────────────────
 *
 * Until 8 Nov 2026 none of these pages had an English edition and this file
 * said so with a constant. Now it is a lookup, because the two sets are
 * filled in at different speeds and the honest answer is per path.
 *
 * Where there is no English edition, `/en/<path>` serves a `noindex` notice
 * with a link to the Arabic page, rather than either of the two tempting
 * wrong answers:
 *
 *   - **404.** The language switch sits in the header of every page, so a 404
 *     would be reachable from one click on all thirty-odd of them, and would
 *     read as a broken site rather than as an unfinished translation.
 *   - **Arabic under an English URL.** That tells a crawler the English page
 *     exists and is in Arabic, which is the one thing hreflang is for
 *     preventing.
 *
 * `localesFor(path)` is what keeps the crawler's story straight: a page with
 * one edition declares one locale, so there is no pair to mismatch.
 */

const BY_LOCALE: Record<Locale, Map<string, PageDoc>> = {
  ar: new Map(arabicPages.map((page) => [page.path, page])),
  en: new Map(englishPages.map((page) => [page.path, page])),
};

if (process.env.NODE_ENV !== "production") {
  for (const [locale, set] of [
    ["ar", arabicPages],
    ["en", englishPages],
  ] as const) {
    // Two entries for one path means one of them silently never renders.
    if (BY_LOCALE[locale].size !== set.length) {
      const seen = new Set<string>();
      const duplicates = set
        .map((p) => p.path)
        .filter((path) => (seen.has(path) ? true : (seen.add(path), false)));
      throw new Error(`Duplicate page paths in content/pages/${locale}: ${duplicates.join(", ")}`);
    }
  }

  // An English page at a path Arabic does not have has no canonical, no
  // breadcrumb parent and no pair. Almost always a typo in the path.
  const orphans = englishPages
    .map((page) => page.path)
    .filter((path) => !BY_LOCALE[DEFAULT_LOCALE].has(path));
  if (orphans.length) {
    throw new Error(
      `content/pages/en has pages at paths content/pages/ar does not: ${orphans.join(", ")}`,
    );
  }
}

/** Every registered route below the locale segment, with a leading slash. */
export const ALL_PATHS: readonly string[] = arabicPages.map((page) => page.path);

/**
 * The routes that belong in the sitemap.
 *
 * `noindex` pages are excluded, because listing a page in the sitemap while
 * telling the crawler not to index it is asking it to resolve a
 * contradiction — and the sitemap is the half people forget to update.
 */
export const PUBLISHED_PATHS: readonly { path: string; priority: number }[] = arabicPages
  .filter((page) => !page.noindex)
  .map((page) => ({ path: page.path, priority: page.priority ?? 0.6 }));

/**
 * One locale's edition of a page, or undefined if it has none.
 *
 * The locale defaults to Arabic so a caller that only wants to know whether
 * the *path* is real — the catch-all route's 404 check — reads the same as
 * it did before there were two sets.
 */
export function getPage(path: string, locale: Locale = DEFAULT_LOCALE): PageDoc | undefined {
  return BY_LOCALE[locale].get(path);
}

/**
 * Which locales to declare for a registered page.
 *
 * Exactly the ones with an edition written, in `LOCALES` order so the
 * hreflang block is stable between builds.
 */
export function localesFor(path: string): readonly Locale[] {
  return LOCALES.filter((locale) => BY_LOCALE[locale].has(path));
}
