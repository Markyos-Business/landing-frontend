import "server-only";
import type { Article, ArticleSummary, ContentRef, ContentSource } from "./adapter";

/*
 * Phase 1 content source: nothing.
 *
 * The /resources hub is in the information architecture and in the footer, but
 * there are no posts yet, and an editorial section with three invented posts in
 * it is worse than one that says it is coming. These return empty so the hub
 * can render its real empty state, and so every page that consumes the content
 * interface is already written against the shape Payload will return.
 *
 * Replaced in phase 2 by MDX files under `content/articles/{locale}/`, or
 * skipped entirely if Payload lands first. Either way: no page changes.
 */

export const localContent: ContentSource = {
  async listArticles(): Promise<ArticleSummary[]> {
    return [];
  },

  async getArticle(_ref: ContentRef & { collection: string }): Promise<Article | null> {
    return null;
  },
};
