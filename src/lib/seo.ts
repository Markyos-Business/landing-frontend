import type { Metadata } from "next";
import { LOCALES, LOCALE_HREFLANG, DEFAULT_LOCALE, type Locale } from "./i18n/locales";
import { localePrefix } from "./i18n/href";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

/**
 * The absolute URL of a page, in the shape the site actually publishes.
 *
 * Arabic has no locale segment, so this cannot be built by interpolating the
 * locale — doing that is how a canonical tag ends up pointing at `/ar/pricing`
 * while every link on the site points at `/pricing`, and a crawler believes
 * the tag.
 */
export function pageUrl(locale: Locale, path = ""): string {
  /*
   * No trailing slash, including on the Arabic homepage — where there is
   * neither a locale segment nor a path, so this is the bare origin.
   *
   * That looks wrong and is deliberate. Next normalises every URL it puts in
   * `<link rel="canonical">` and `hreflang` against `metadataBase` and emits
   * it without the trailing slash, and it is not configurable. Adding one
   * here would only affect the sitemap, which this function also builds — so
   * the sitemap would claim `https://markyos.com/` while every page's own
   * canonical claimed `https://markyos.com`. Two strings for one page is the
   * single thing canonicalisation exists to prevent, and a crawler compares
   * strings. Matching Next is the version where they agree.
   */
  return `${SITE_URL}${localePrefix(locale)}${path}`;
}

/**
 * Build the canonical + hreflang block for a page.
 *
 * Every page exists twice, once per locale, and a bilingual site that does not
 * declare the pairing gets treated as two sites competing for the same terms.
 * `x-default` points at Arabic because that is what the root serves: a
 * visitor who types markyos.com gets Arabic, so that is the page a crawler
 * with no language signal should be given. The two have to agree, or the
 * crawler is told one thing and the reader is given another.
 *
 * `path` is the route *below* the locale segment, with a leading slash:
 * "" for the homepage, "/pricing" for pricing.
 */
export function alternates(
  locale: Locale,
  path = "",
  /**
   * The locales this particular page actually exists in.
   *
   * Defaults to all of them, which is right for the pages that are written
   * in both. The pages under /solutions are written in Arabic only so far,
   * and declaring an English alternate for them would promise a crawler a
   * page that is a "not translated yet" notice — see src/lib/pages/registry.ts.
   */
  available: readonly Locale[] = LOCALES,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of available) {
    languages[LOCALE_HREFLANG[l]] = pageUrl(l, path);
  }
  const fallback = available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : available[0];
  if (fallback) languages["x-default"] = pageUrl(fallback, path);

  return {
    canonical: pageUrl(locale, path),
    languages,
  };
}

type PageMetaInput = {
  locale: Locale;
  /** Route below the locale segment, leading slash, "" for home. */
  path?: string;
  title: string;
  description: string;
  /** Open Graph title, when the social headline differs from the page title. */
  ogTitle?: string;
  /**
   * This page's own social card, absolute or site-relative.
   *
   * Overrides the site-wide one below. Articles set it from the image their
   * writer made for them; everything else leaves it alone.
   */
  ogImage?: string;
  ogDescription?: string;
  /** Which locales this page exists in. See `alternates`. */
  available?: readonly Locale[];
  /** Keep the page out of the index — placeholders and legal frames. */
  noindex?: boolean;
};

/**
 * One metadata builder for every page, so no page can quietly ship without a
 * canonical, an hreflang pair or an OG image.
 */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  ogTitle,
  ogImage,
  ogDescription,
  available,
  noindex,
}: PageMetaInput): Metadata {
  const url = pageUrl(locale, path);

  return {
    // Set here rather than as a static `metadata` export in the layout: a
    // route may export `metadata` or `generateMetadata`, never both, and
    // every page on this site needs a locale-dependent title — so they all
    // use the function and this is the one place the base URL can live.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: alternates(locale, path, available),
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      url,
      siteName: "Markyos",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      /*
       * The page's own card where it has one, and the site-wide card
       * otherwise.
       *
       * The fallback was marked PLACEHOLDER and "do not ship the site
       * without it", and it is still one file per language for every page
       * that is not an article. The forty written resources each shipped
       * their own at 1200x630, in both languages, so those now share a link
       * preview with the piece rather than with the whole site.
       */
      images: [
        {
          url: ogImage
            ? ogImage.startsWith("http")
              ? ogImage
              : `${SITE_URL}${ogImage}`
            : `${SITE_URL}/brand/og-${locale}.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
    },
  };
}
