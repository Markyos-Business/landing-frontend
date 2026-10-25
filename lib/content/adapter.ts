import type { Locale } from "@/lib/i18n/locales";

/*
 * The content boundary.
 *
 * Two kinds of content live on this site and they have different lifecycles:
 *
 *   1. **Page copy** — the homepage, /studios, /companies, pricing. Written
 *      once, reviewed by a strategist, versioned in git alongside the
 *      components that render it. This never goes in a CMS: it changes with
 *      the design, a copy edit wants a code review, and a CMS round-trip to
 *      change a headline buys nothing. It lives in `content/{locale}/`.
 *
 *   2. **Editorial content** — blog posts, guides, comparison pages, help
 *      articles. Added weekly, forever, by whoever is writing that week. This
 *      is what the CMS is for, and what the collections in the CMS
 *      architecture doc describe.
 *
 * Everything below is kind 2, behind an interface. The reason is sequencing:
 * the site has to go live for the beta well before Payload is wired up, so
 * phase 1 serves editorial content from local MDX files and phase 3 swaps in
 * Payload's Local API. Components ask this interface, never a data source — so
 * that swap touches one file and no page.
 *
 * See docs/CONTENT-MODEL.md for the field-level model.
 */

export type ContentRef = {
  /** Shared across locales, so /en/blog/x and /ar/blog/x are the same post. */
  slug: string;
  locale: Locale;
};

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  /** Resolved to an absolute URL by the adapter, wherever the file lives. */
  heroImage?: string;
  heroImageAlt?: string;
  category?: string;
  readingMinutes?: number;
  /**
   * The piece is placeholder content, not finished writing.
   *
   * Set only by the seed source (lib/content/seed.ts). The templates render a
   * notice from it and keep the page out of the index, because placeholder
   * prose that ranks is placeholder prose that gets cited. Anything from the
   * CMS leaves it unset.
   */
  provisional?: boolean;
};

export type Article = ArticleSummary & {
  /**
   * The rich text, as the editor's serialized state.
   *
   * Deliberately `unknown` rather than an HTML string: HTML from a CMS has to
   * be injected with `dangerouslySetInnerHTML`, which is exactly as dangerous
   * as it sounds the first time an editor pastes from Word. Handing the tree
   * to a renderer that maps nodes to components keeps the output to elements
   * we chose. `components/content/RichText.tsx` does the rendering.
   */
  body: unknown;
  author?: { name: string; role?: string; avatar?: string };
  seoTitle?: string;
  seoDescription?: string;
};

export type ComparisonRow = {
  feature: string;
  competitor: string;
  markyos: string;
};

export type Comparison = {
  slug: string;
  competitorName: string;
  /** Editor state, as with Article.body. */
  intro: unknown;
  rows: ComparisonRow[];
  objections: { question: string; answer: unknown }[];
};

/**
 * What any content source must provide.
 *
 * Deliberately read-only and deliberately small: the marketing site never
 * writes content, and a wider interface would be an invitation to let a page
 * reach for something only one of the two implementations can do.
 */
export type ContentSource = {
  listArticles(opts: { locale: Locale; collection: "blog" | "guides" | "help"; limit?: number }): Promise<ArticleSummary[]>;
  getArticle(opts: ContentRef & { collection: "blog" | "guides" | "help" }): Promise<Article | null>;
  listComparisons(locale: Locale): Promise<Comparison[]>;
  getComparison(ref: ContentRef): Promise<Comparison | null>;
};
