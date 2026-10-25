import "server-only";
import type { Article, ArticleSummary, Comparison, ContentRef, ContentSource } from "./adapter";
import type { Locale } from "@/lib/i18n/locales";
import { seedArticles } from "@/content/editorial/ar";

/*
 * The seed content source — PLACEHOLDER editorial content.
 *
 * It exists because the blog, the guides and the help centre are real pages
 * in the information architecture with real designs, and they could not be
 * reviewed against an empty state. The twelve posts, five guides and fourteen
 * help articles are the ones planned in
 * docs/copy/pages_ar_3_resources_company.md; the bodies are placeholder text
 * written to each title's own angle. See content/editorial/ar.ts.
 *
 * Two properties keep this from becoming permanent by accident:
 *
 *   - **Arabic only.** `locale` is honoured rather than ignored: asking for
 *     English returns nothing, because none of this has been translated and
 *     serving Arabic under an English URL is the one thing the bilingual
 *     claim cannot afford. The English blog renders its empty state, which is
 *     true.
 *   - **It loses to the CMS.** `composeContent` in ./index.ts prefers Payload
 *     for every slug it has. Publishing a real post replaces its placeholder
 *     without anybody editing code.
 *
 * `provisional` is set on everything here, and the article template renders a
 * notice from it, so no reader mistakes this for finished writing.
 */

const EMPTY: Comparison[] = [];

function summaries(collection: "blog" | "guides" | "help"): ArticleSummary[] {
  return seedArticles[collection].map(
    ({ slug, title, excerpt, publishedAt, category, readingMinutes }) => ({
      slug,
      title,
      excerpt,
      publishedAt,
      category,
      readingMinutes,
      provisional: true,
    }),
  );
}

export const seedContent: ContentSource = {
  async listArticles({ locale, collection, limit }) {
    if (locale !== "ar") return [];
    const list = summaries(collection).sort((a, b) =>
      a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
    );
    return limit ? list.slice(0, limit) : list;
  },

  async getArticle({ locale, collection, slug }): Promise<Article | null> {
    if (locale !== "ar") return null;
    const found = seedArticles[collection].find((article) => article.slug === slug);
    return found ? { ...found, provisional: true } : null;
  },

  async listComparisons(_locale: Locale): Promise<Comparison[]> {
    // The two comparison pages are page copy, not editorial content: they are
    // in content/pages/ar/resources.ts. This collection is for the named
    // competitor pages, which cannot be published until every fact on them is
    // checked against the competitor's own site — see Part 3, page 27.
    return EMPTY;
  },

  async getComparison(_ref: ContentRef): Promise<Comparison | null> {
    return null;
  },
};
