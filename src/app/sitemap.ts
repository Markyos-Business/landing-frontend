import { CONTENT_TAG, contentApi } from "@/lib/content/djangoClient";
import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_HREFLANG, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { pageUrl } from "@/lib/seo";
import { PUBLISHED_PATHS, localesFor } from "@/lib/pages/registry";
import { getHelpSitemap } from "@/lib/content/help";

/*
 * The sitemap.
 *
 * Only pages with real content, in the languages they are actually written
 * in. Two rules, and both are about not asking a crawler to resolve a
 * contradiction:
 *
 *   - A `noindex` page is never listed. The registry filters those out
 *     before they get here, so a page becomes indexable and enters the
 *     sitemap in the same edit rather than in two.
 *   - A page is listed once per locale that *has* it, which the registry
 *     answers per path. A page written in Arabic only renders an honest
 *     "not translated yet" notice under /en, and listing that would be
 *     inviting a crawler to index it after its own metadata said not to.
 *
 * The homepage is written out below because it is not in the registry, not
 * because it is the only page in both languages — it stopped being that on
 * 8 Nov 2026.
 */

type Entry = {
  path: string;
  priority: number;
  locales: readonly Locale[];
  lastModified?: string;
  /** Per-language paths, when they differ (the Help Center's). */
  paths?: Partial<Record<Locale, string>>;
};
export const revalidate = 3600;

const ROUTES: Entry[] = [
  { path: "", priority: 1, locales: LOCALES },
  ...PUBLISHED_PATHS.map(({ path, priority }) => ({
    path,
    priority,
    locales: localesFor(path),
  })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  type Editorial = { results: { path: string; locales: Locale[]; lastModified: string }[] };
  let editorial: Editorial | null;
  try {
    editorial = await contentApi<Editorial>("/content/public/sitemap/", [CONTENT_TAG]);
  } catch (error) {
    // A sleeping backend must not fail a deploy: build with the static pages
    // and let the hourly revalidation add the CMS ones. At runtime, throw so
    // Next keeps serving the last good sitemap.
    if (process.env.NEXT_PHASE !== "phase-production-build") throw error;
    editorial = null;
  }
  /*
   * The Help Center: the home, each topic with published articles, and each
   * published public article, in the languages it is published in. Its
   * slugs differ per language, so each entry carries its own paths; Arabic
   * ones are percent-encoded here, as a URL in a sitemap must be.
   */
  const help: Entry[] = (await getHelpSitemap()).map(({ paths, lastModified }) => {
    const encoded = Object.fromEntries(
      Object.entries(paths).map(([l, p]) => [l, encodeURI(p as string)]),
    ) as Partial<Record<Locale, string>>;
    const locales = LOCALES.filter((l) => encoded[l]);
    return {
      path: encoded[locales[0]] ?? "/help",
      paths: encoded,
      locales,
      priority: 0.5,
      ...(lastModified ? { lastModified } : {}),
    };
  });
  // The CMS help collection is replaced by the Help Center once it is live.
  const editorialEntries = (editorial?.results ?? []).filter(
    (entry) => !(help.length > 1 && entry.path.startsWith("/help/")),
  );
  /*
   * An editorial index (/blog, /guides, /compare, /whats-new) is listed once
   * it has one real published piece in a language: that is exactly when the
   * index stops being noindex. The platform's sitemap already leaves out
   * placeholder (provisional) pieces, so its paths are the test.
   */
  const indexes: Entry[] = ["/blog", "/guides", "/compare", "/whats-new"].flatMap((section) => {
    const locales = LOCALES.filter((l) =>
      editorialEntries.some((e) => e.path.startsWith(`${section}/`) && e.locales.includes(l)),
    );
    return locales.length ? [{ path: section, priority: 0.7, locales }] : [];
  });
  const routes: Entry[] = [
    ...ROUTES.filter((r) => !(help.length > 1 && r.path === "/help")),
    ...indexes,
    ...editorialEntries.map((entry) => ({ ...entry, priority: 0.6 })),
    ...help,
  ];
  const lastModified = new Date();

  return routes.flatMap(({ path, priority, locales, lastModified: updated, paths }) => {
    const at = (l: Locale) => paths?.[l] ?? path;
    const fallback = locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales[0];
    return locales.map((locale) => ({
      url: pageUrl(locale, at(locale)),
      lastModified: updated ?? lastModified,
      changeFrequency: "weekly" as const,
      priority,
      /*
       * The locale pair, declared here as well as in the page's own metadata.
       * A crawler that reaches a page from the sitemap rather than from a
       * link still needs to be told which other languages it exists in — and
       * for most of these that is Arabic alone, which is the point.
       */
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [LOCALE_HREFLANG[l], pageUrl(l, at(l))]),
          ["x-default", pageUrl(fallback, at(fallback))],
        ]),
      },
    }));
  });
}
