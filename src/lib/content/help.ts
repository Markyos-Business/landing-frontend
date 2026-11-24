import "server-only";
import type { Locale } from "@/lib/i18n/locales";
import { CONTENT_TAG, contentApi, contentApiUrl } from "./djangoClient";
import { upstreamHeaders } from "./helpSearch";

/*
 * The Help Center, read from the platform's help API (`/help/public/...`).
 *
 * Separate from `content` (blog, guides, compare…) because it is a separate
 * model on the platform: categories with subcategories, articles with a
 * type and an audience, and a home that ranks articles by what visitors
 * read. Everything here is public-only: the platform answers these as an
 * anonymous visitor, so a signed-in-only article can never reach a page.
 *
 * Cached under the same tag as the rest of the content, so a publish in the
 * admin clears it. A failure is `null`, never a thrown 500: the routes fall
 * back to what the site showed before (see app/[lang]/help).
 */

export type HelpCategory = {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  articleCount: number;
  subcategories?: HelpCategory[];
};

export type HelpCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: "guide" | "tutorial" | "faq" | "troubleshooting";
  categorySlug: string;
  categoryTitle: string;
  publishedAt: string | null;
};

export type HelpHome = {
  categories: HelpCategory[];
  popular: HelpCard[];
  gettingStarted: HelpCard[];
  recent: HelpCard[];
};

export type HelpCategoryPage = Omit<HelpCategory, "subcategories"> & {
  parent: Omit<HelpCategory, "subcategories"> | null;
  articles: HelpCard[];
  subcategories: (Omit<HelpCategory, "subcategories"> & { articles: HelpCard[] })[];
};

async function read<T>(path: string): Promise<T | null> {
  try {
    return await contentApi<T>(path, [CONTENT_TAG]);
  } catch {
    return null;
  }
}

export function getHelpHome(locale: Locale): Promise<HelpHome | null> {
  return read<HelpHome>(`/help/public/home/?locale=${locale}`);
}

/** `slug` decoded (as `routeSlug` returns it); encoded here for the URL. */
export function getHelpCategory(locale: Locale, slug: string): Promise<HelpCategoryPage | null> {
  return read<HelpCategoryPage>(`/help/public/categories/${encodeURIComponent(slug)}/?locale=${locale}`);
}

/** The site path of an article or category, before the locale prefix. */
export const helpPath = (category: string, article?: string): string =>
  `/help/${encodeURIComponent(category)}${article ? `/${encodeURIComponent(article)}` : ""}`;

type Crumb = { title: string; slug: string };
type Address = { categorySlug: string; slug: string };

/** One published article as the website shows it (C4). */
export type HelpArticle = {
  id: string;
  locale: Locale;
  slug: string;
  title: string;
  summary: string;
  bodyHtml: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: { url: string; alt: string } | null;
  type: HelpCard["type"];
  categorySlug: string;
  author: string | null;
  tags: string[];
  lastReviewed: string | null;
  publishedAt: string | null;
  category: Crumb | null;
  parentCategory: Crumb | null;
  /** The same article's address in each language it is published in. */
  alternates: Partial<Record<Locale, Address>>;
  related: HelpCard[];
  previous: HelpCard | null;
  next: HelpCard | null;
};

/** `slug` decoded, as `routeSlug` returns it. */
export function getHelpArticle(locale: Locale, slug: string): Promise<HelpArticle | null> {
  return read<HelpArticle>(`/help/public/articles/${encodeURIComponent(slug)}/?locale=${locale}`);
}

/** Every public Help Center page, with its path (below the locale) per language. */
export type HelpSitemapEntry = { paths: Partial<Record<Locale, string>>; lastModified?: string | null };

export async function getHelpSitemap(): Promise<HelpSitemapEntry[]> {
  return (await read<{ results: HelpSitemapEntry[] }>("/help/public/sitemap/"))?.results ?? [];
}

/** One search result: a card with the matching stretch of the body. */
export type HelpSearchHit = HelpCard & { snippet: string };

export type HelpSearchResponse = {
  query: string;
  total: number;
  results: HelpSearchHit[];
  facets: {
    categories: { id: number; title: string; count: number }[];
    types: { type: HelpCard["type"]; count: number }[];
  };
  suggestions: HelpCard[];
  popular?: HelpCard[];
  queryId?: number;
};

/**
 * A search for the page's first render (C5). Never logged and never cached:
 * the browser logs the query itself once the reader settles on it, so link
 * prefetches and crawlers don't count as searches.
 */
export async function searchHelp(
  locale: Locale,
  params: { q: string; category?: string; type?: string },
  /** The visitor's request headers: the call is signed and limited per visitor. */
  incoming: Headers,
): Promise<HelpSearchResponse | null> {
  const root = contentApiUrl();
  if (!root) return null;
  const query = new URLSearchParams({ q: params.q.slice(0, 200), locale });
  if (params.category && /^\d+$/.test(params.category)) query.set("category", params.category);
  if (params.type && /^[a-z]+$/.test(params.type)) query.set("type", params.type);
  try {
    const response = await fetch(`${root}/help/public/search/?${query}`, {
      headers: upstreamHeaders(new Request("http://site.invalid", { headers: incoming })),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok ? ((await response.json()) as HelpSearchResponse) : null;
  } catch {
    return null;
  }
}
