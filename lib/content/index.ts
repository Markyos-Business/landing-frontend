import type { ContentSource } from "./adapter";
import { payloadContent } from "./payload";
import { seedContent } from "./seed";

/*
 * The one place the content source is chosen.
 *
 * Pages import `content` and are unaware of which implementation answered —
 * which is what let the site ship against a stub before the CMS existed, and
 * what would let it move again if Payload were ever replaced.
 *
 * ── Why two sources are composed rather than one chosen ───────────────────
 *
 * Payload is the real source. `seedContent` holds the placeholder blog,
 * guides and help articles that the editorial designs were reviewed against
 * (see ./seed.ts), and it fills in **only where Payload has nothing**.
 *
 * Per slug, not per collection. That is the part that matters: publishing one
 * real post replaces that one placeholder and leaves the other eleven
 * standing, so the section can be migrated an article at a time instead of
 * going from all-placeholder to one-real-post-and-an-empty-page. Nobody has
 * to flip a flag, and nothing has to be deleted on a deadline.
 *
 * When the CMS is unreachable the seed is what the page gets, which is the
 * right failure: a reader sees an article, and the deploy that is meant to
 * replace it is still the thing that replaces it.
 */

function composeContent(primary: ContentSource, fallback: ContentSource): ContentSource {
  return {
    async listArticles(opts) {
      const [live, seeded] = await Promise.all([
        primary.listArticles(opts).catch(() => []),
        fallback.listArticles(opts),
      ]);

      const published = new Set(live.map((article) => article.slug));
      const merged = [...live, ...seeded.filter((article) => !published.has(article.slug))];

      merged.sort((a, b) =>
        a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
      );
      return opts.limit ? merged.slice(0, opts.limit) : merged;
    },

    async getArticle(opts) {
      const live = await primary.getArticle(opts).catch(() => null);
      return live ?? fallback.getArticle(opts);
    },

    async listComparisons(locale) {
      const live = await primary.listComparisons(locale).catch(() => []);
      return live.length ? live : fallback.listComparisons(locale);
    },

    async getComparison(ref) {
      const live = await primary.getComparison(ref).catch(() => null);
      return live ?? fallback.getComparison(ref);
    },
  };
}

export const content: ContentSource = composeContent(payloadContent, seedContent);

export { getSiteCopy } from "./pageCopy";

export type {
  Article,
  ArticleSummary,
  Comparison,
  ComparisonRow,
  ContentSource,
} from "./adapter";
