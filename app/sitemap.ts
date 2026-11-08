import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_HREFLANG, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { pageUrl } from "@/lib/seo";
import { PUBLISHED_PATHS, localesFor } from "@/lib/pages/registry";

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

type Entry = { path: string; priority: number; locales: readonly Locale[] };

const ROUTES: Entry[] = [
  { path: "", priority: 1, locales: LOCALES },
  ...PUBLISHED_PATHS.map(({ path, priority }) => ({
    path,
    priority,
    locales: localesFor(path),
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap(({ path, priority, locales }) =>
    locales.map((locale) => ({
      url: pageUrl(locale, path),
      lastModified,
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
          ...locales.map((l) => [LOCALE_HREFLANG[l], pageUrl(l, path)]),
          [
            "x-default",
            pageUrl(locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales[0], path),
          ],
        ]),
      },
    })),
  );
}
