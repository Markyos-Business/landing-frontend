import "server-only";
import type {
  Article,
  ArticleSummary,
  Comparison,
  ContentRef,
  ContentSource,
} from "./adapter";
import type { Locale } from "@/lib/i18n/locales";
import { payloadClient, safeRead } from "./payloadClient";

/*
 * The Payload-backed content source.
 *
 * Reads through the Local API — in process, no HTTP. Implements the same
 * interface `localContent` did, so swapping between them changes one line in
 * `index.ts` and no page.
 *
 * Every read is wrapped in `safeRead`: a CMS problem must degrade the blog to
 * empty, never take the site down. An index page that renders "nothing
 * published yet" during a database hiccup is a far better failure than a 500
 * on a route the homepage links to.
 */

type Doc = Record<string, unknown>;

/*
 * Payload generates a precise interface per collection. These mappers
 * deliberately work on the loose shape instead: they read a handful of fields
 * that every editorial collection shares, which is what lets one `toSummary`
 * serve posts, guides and help articles. Going through `unknown` is the
 * honest way to say so.
 */
const asDocs = (docs: unknown): Doc[] => (docs ?? []) as Doc[];

const str = (v: unknown): string => (typeof v === "string" ? v : "");

const media = (v: unknown): { url?: string; alt?: string } => {
  if (v && typeof v === "object" && "url" in v) {
    const m = v as Doc;
    return { url: str(m.url) || undefined, alt: str(m.alt) || undefined };
  }
  return {};
};

/**
 * Reading time.
 *
 * Counted from the Lexical tree rather than stored, so it cannot go stale
 * after an edit. 200 words a minute for English; Arabic is slower per word but
 * uses fewer of them, which cancels out closely enough for a hint that only
 * ever needs to be roughly right.
 */
function readingMinutes(body: unknown): number | undefined {
  if (!body || typeof body !== "object") return undefined;
  let words = 0;
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const n = node as Doc;
    if (typeof n.text === "string") words += n.text.split(/\s+/).filter(Boolean).length;
    if (n.children) walk(n.children);
    if (n.root) walk(n.root);
  };
  walk(body);
  return words > 0 ? Math.max(1, Math.round(words / 200)) : undefined;
}

const toSummary = (doc: Doc): ArticleSummary => {
  const hero = media(doc.heroImage);
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    excerpt: str(doc.excerpt),
    publishedAt: str(doc.publishedAt) || str(doc.createdAt),
    heroImage: hero.url,
    heroImageAlt: hero.alt,
    category:
      doc.category && typeof doc.category === "object"
        ? str((doc.category as Doc).label)
        : undefined,
    readingMinutes: readingMinutes(doc.body),
  };
};

const toArticle = (doc: Doc): Article => {
  const author =
    doc.author && typeof doc.author === "object"
      ? {
          name: str((doc.author as Doc).name),
          role: str((doc.author as Doc).role) || undefined,
          avatar: media((doc.author as Doc).avatar).url,
        }
      : undefined;

  return {
    ...toSummary(doc),
    // The editor state, passed straight through. See Article.body.
    body: doc.body ?? null,
    author,
    seoTitle: str(doc.seoTitle) || undefined,
    seoDescription: str(doc.seoDescription) || undefined,
  };
};

/*
 * Is this doc actually written in the locale that was asked for?
 *
 * Payload returns the record whatever locale you ask for; the *localized
 * fields* are what vary. With fallback disabled (see below) an untranslated
 * field comes back empty, so an Arabic-only post requested as English is a
 * record with a blank title, a blank excerpt and no body.
 *
 * Rendered, that was a live English article page with an empty <h1> and a
 * <title> of " — Markyos", and a blank card on /en/blog. The seeded
 * placeholders hid it completely, because the seed simply has no English
 * entries and correctly fell through to the "Arabic only, for now" notice.
 * The first real post published in one language brought it back.
 *
 * Title is the test because it is `required` in every editorial collection,
 * so it is present in exactly the locales somebody has actually written.
 */
const translated = (doc: Doc): boolean => str(doc.title).trim().length > 0;

/*
 * Locale fallback is off for every public read.
 *
 * `payload.config.ts` sets `fallback: true`, which fills an untranslated
 * field from the default locale. That is right in the admin, where an editor
 * wants to see what they are translating from. It is wrong on the public
 * site, and in both directions: it would print English body copy under an
 * Arabic URL, and it leaves the opposite case blank rather than absent.
 *
 * Off, a piece exists in exactly the languages it is written in, and
 * everything else renders the same "not translated yet" notice the other
 * twenty-seven subpages use. That is the rule the rest of the site already
 * follows — see components/page/NotTranslated.tsx.
 */
const NO_FALLBACK = false;
/** The CMS collection behind each public section. */
const COLLECTION = {
  blog: "posts",
  guides: "guides",
  help: "helpArticles",
} as const;

export const payloadContent: ContentSource = {
  async listArticles({ locale, collection, limit = 50 }) {
    return safeRead(
      `list ${collection}`,
      async () => {
        const payload = await payloadClient();
        const result = await payload.find({
          collection: COLLECTION[collection],
          locale,
          limit,
          depth: 1,
          sort: "-publishedAt",
          // Access control already filters drafts for anonymous reads, but
          // being explicit here means a future authenticated render cannot
          // accidentally leak an unpublished post onto a public index.
          where: { _status: { equals: "published" } },
          fallbackLocale: NO_FALLBACK,
        });
        return asDocs(result.docs).filter(translated).map(toSummary);
      },
      [],
    );
  },

  async getArticle({ locale, collection, slug }) {
    return safeRead(
      `get ${collection}/${slug}`,
      async () => {
        const payload = await payloadClient();
        const result = await payload.find({
          collection: COLLECTION[collection],
          locale,
          limit: 1,
          depth: 2,
          where: {
            slug: { equals: slug },
            _status: { equals: "published" },
          },
          fallbackLocale: NO_FALLBACK,
        });
        const doc = asDocs(result.docs)[0];
        return doc && translated(doc) ? toArticle(doc) : null;
      },
      null,
    );
  },

  async listComparisons(locale: Locale) {
    return safeRead(
      "list comparisons",
      async () => {
        const payload = await payloadClient();
        const result = await payload.find({
          collection: "comparisons",
          locale,
          limit: 50,
          depth: 1,
          where: { _status: { equals: "published" } },
        });
        return asDocs(result.docs).map(toComparison);
      },
      [],
    );
  },

  async getComparison({ locale, slug }: ContentRef) {
    return safeRead(
      `get comparison/${slug}`,
      async () => {
        const payload = await payloadClient();
        const result = await payload.find({
          collection: "comparisons",
          locale,
          limit: 1,
          depth: 1,
          where: { slug: { equals: slug }, _status: { equals: "published" } },
        });
        const doc = asDocs(result.docs)[0];
        return doc ? toComparison(doc) : null;
      },
      null,
    );
  },
};

function toComparison(doc: Doc): Comparison {
  const rows = Array.isArray(doc.comparisonRows) ? (doc.comparisonRows as Doc[]) : [];
  const objections = Array.isArray(doc.objectionHandling)
    ? (doc.objectionHandling as Doc[])
    : [];

  return {
    slug: str(doc.slug),
    competitorName: str(doc.competitorName),
    intro: doc.intro ?? null,
    rows: rows.map((r) => ({
      feature: str(r.feature),
      competitor: str(r.competitor),
      markyos: str(r.markyos),
    })),
    objections: objections.map((o) => ({
      question: str(o.question),
      answer: o.answer ?? null,
    })),
  };
}
