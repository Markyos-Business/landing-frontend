import "server-only";
import type { Article, ArticleSummary, Collection, ContentSource } from "./adapter";
import { CONTENT_TAG, contentApi, contentApiFresh } from "./djangoClient";

/*
 * The content source backed by the Markyos platform (Django).
 *
 * Website content is written in the platform's admin area, at /admin/cms,
 * and published there as a frozen snapshot. This reads those snapshots over
 * the public API, which already answers in this interface's shapes: the
 * summary and article fields are named the way `adapter.ts` names them, so
 * the mapping below is a guard, not a translation.
 *
 * Every read is cached under one tag for an hour, and `/api/revalidate`
 * clears that tag the moment something is published or taken offline. Like
 * the Payload source, a failure degrades to "nothing published yet", never a
 * 500 on a page the homepage links to.
 *
 * `body` is HTML here, not a Lexical tree. The platform cleans it against an
 * allowlist when it is saved and again when it is served; RichText renders
 * it inside `.mk-prose`. See RichText for the other half.
 */

type Doc = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const opt = (v: unknown): string | undefined => str(v) || undefined;

const toSummary = (doc: Doc): ArticleSummary => ({
  slug: str(doc.slug),
  title: str(doc.title),
  excerpt: str(doc.excerpt),
  publishedAt: str(doc.publishedAt),
  heroImage: opt(doc.heroImage),
  heroImageAlt: opt(doc.heroImageAlt),
  ogImage: opt(doc.ogImage),
  category: opt(doc.category),
  readingMinutes: typeof doc.readingMinutes === "number" && doc.readingMinutes > 0 ? doc.readingMinutes : undefined,
  // Absent rather than false on finished writing, as the type asks.
  provisional: doc.provisional === true ? true : undefined,
});

const toArticle = (doc: Doc): Article => {
  const author = doc.author && typeof doc.author === "object" ? (doc.author as Doc) : null;
  return {
    ...toSummary(doc),
    body: str(doc.body) || null,
    author: author ? { name: str(author.name), role: opt(author.role), avatar: opt(author.avatar) } : undefined,
    seoTitle: opt(doc.seoTitle),
    seoDescription: opt(doc.seoDescription),
  };
};

/** Title is required to publish, so an empty one is a language nobody wrote. */
const translated = (doc: Doc): boolean => str(doc.title).trim().length > 0;

/*
 * What a failed read becomes.
 *
 * At runtime it is thrown. Next keeps serving the last good page when a
 * refresh throws and retries on the next request, so a backend that is
 * asleep (Render's free tier takes longer to wake than this site waits) no
 * longer gets an empty list or a 404 cached for an hour. Swallowing it did.
 *
 * During `next build` there is no last good page to fall back on, and a
 * sleeping backend must not fail a deploy, so the build renders the empty
 * fallback; the next publish or the hourly refresh fills it in.
 */
const building = () => process.env.NEXT_PHASE === "phase-production-build";

async function safe<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[cms] ${label} unavailable: ${message.slice(0, 160)}`);
    if (!building()) throw error;
    return fallback;
  }
}

export const djangoContent: ContentSource = {
  async listArticles({ locale, collection, limit = 50 }) {
    return safe(
      `list ${collection}`,
      async () => {
        const data = await contentApi<{ results: Doc[] }>(
          `/content/public/${collection}/?locale=${locale}&limit=${limit}`,
          [CONTENT_TAG, `${CONTENT_TAG}:${collection}`],
        );
        return (data?.results ?? []).filter(translated).map(toSummary);
      },
      [],
    );
  },

  async getArticle({ locale, collection, slug }) {
    return safe(
      `get ${collection}/${slug}`,
      async () => {
        const doc = await contentApi<Doc>(
          `/content/public/${collection}/${encodeURIComponent(slug)}/?locale=${locale}`,
          [CONTENT_TAG, `${CONTENT_TAG}:${collection}`],
        );
        return doc && translated(doc) ? toArticle(doc) : null;
      },
      null,
    );
  },
};

const COLLECTIONS: readonly Collection[] = ["blog", "guides", "help", "compare", "whatsNew"];

/**
 * An editor's draft behind a signed preview link (7 days), or null when the
 * link is bad, expired, or the draft has no title in this language. Never
 * cached, never indexed.
 */
export async function getPreview(
  token: string,
  locale: string,
): Promise<{ collection: Collection; article: Article } | null> {
  const doc = await contentApiFresh<Doc>(
    `/content/public/preview/${encodeURIComponent(token)}/?locale=${locale}`,
  );
  const kind = doc ? str(doc.kind) : "";
  if (!doc || !translated(doc) || !(COLLECTIONS as readonly string[]).includes(kind)) return null;
  return { collection: kind as Collection, article: toArticle(doc) };
}

export type { Collection };
