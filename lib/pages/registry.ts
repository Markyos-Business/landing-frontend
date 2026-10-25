import type { PageDoc } from "@/content/pages/types";
import { pages as arabicPages } from "@/content/pages/ar";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";

/*
 * The page registry.
 *
 * One list, and every consequence of a page existing follows from it: the
 * route is generated, the sitemap entry is generated, the hreflang pair is
 * generated, and the 404 for anything not in it is generated. There is no
 * second place to remember.
 *
 * ── Only Arabic is written ────────────────────────────────────────────────
 *
 * Arabic is the site; the English edition of these pages has not been
 * translated yet. That is a deliberate sequence, not an omission — the copy
 * is being finished in Arabic first and translated from it.
 *
 * So `/en/<path>` for one of these serves an honest, `noindex` notice with a
 * link to the Arabic page, rather than either of the two tempting wrong
 * answers:
 *
 *   - **404.** The language switch sits in the header of every page, so a 404
 *     would be reachable from one click on all thirty-odd of them, and would
 *     read as a broken site rather than as an unfinished translation.
 *   - **Arabic under an English URL.** That tells a crawler the English page
 *     exists and is in Arabic, which is the one thing hreflang is for
 *     preventing.
 *
 * `alternatesFor` is what keeps the crawler's story straight: a page with no
 * English edition declares only Arabic, so there is no pair to mismatch.
 */

const BY_PATH = new Map<string, PageDoc>(arabicPages.map((page) => [page.path, page]));

if (process.env.NODE_ENV !== "production") {
  // Two entries for one path means one of them silently never renders.
  if (BY_PATH.size !== arabicPages.length) {
    const seen = new Set<string>();
    const duplicates = arabicPages
      .map((p) => p.path)
      .filter((path) => (seen.has(path) ? true : (seen.add(path), false)));
    throw new Error(`Duplicate page paths in content/pages/ar: ${duplicates.join(", ")}`);
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

/** The Arabic edition of a page, or undefined if the path is not registered. */
export function getPage(path: string): PageDoc | undefined {
  return BY_PATH.get(path);
}

/** Whether this locale has its own edition of the registered pages. */
export function hasEdition(locale: Locale): boolean {
  return locale === DEFAULT_LOCALE;
}

/**
 * Which locales to declare for a registered page.
 *
 * Only Arabic until the English translation lands, at which point this
 * returns both and every hreflang pair on the site appears at once.
 */
export function localesFor(): readonly Locale[] {
  return [DEFAULT_LOCALE];
}
