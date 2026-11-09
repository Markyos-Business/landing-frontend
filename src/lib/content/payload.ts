import "server-only";
import type { Article, ArticleSummary, Collection, ContentSource } from "./adapter";
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
 * after an edit.
 *
 * ── Why the rate is per language ──────────────────────────────────────────
 *
 * This used to be a flat 200 a minute, on the reasoning that Arabic is slower
 * per word but uses fewer of them and the two cancel out. They do not cancel
 * at the sizes this site publishes. A 271-word Arabic post is 1.36 minutes at
 * 200 and rounds to "one minute"; so does a 90-word help article. When the
 * editorial moved into the CMS on 8 Nov 2026 and every piece started coming
 * through here, that rounding flattened the whole blog index to the same
 * label, which is a hint that has stopped hinting.
 *
 * 180 for Arabic is the figure the editorial seed was already using to
 * compute exactly these numbers before the move, so the published values did
 * not change when the content did.
 */
const WORDS_PER_MINUTE: Record<Locale, number> = { ar: 180, en: 200 };
function countWords(body: unknown): number {
  if (!body || typeof body !== "object") return 0;
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
  return words;
}

function readingMinutes(body: unknown, locale: Locale): number | undefined {
  const words = countWords(body);
  if (words === 0) return undefined;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE[locale]));
}

const toSummary = (doc: Doc, locale: Locale): ArticleSummary => {
  const hero = media(doc.heroImage);
  const og = media(doc.ogImage);
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    excerpt: str(doc.excerpt),
    publishedAt: str(doc.publishedAt) || str(doc.createdAt),
    heroImage: hero.url,
    heroImageAlt: hero.alt,
    ogImage: og.url,
    category:
      doc.category && typeof doc.category === "object"
        ? str((doc.category as Doc).label)
        : undefined,
    readingMinutes: readingMinutes(doc.body, locale),
    // A document ticked "Placeholder content" in the panel. Absent rather
    // than false when it is finished writing, so the flag stays optional on
    // the type and a missing field never reads as provisional.
    provisional: doc.provisional === true ? true : undefined,
  };
};

const toArticle = (doc: Doc, locale: Locale): Article => {
  const author =
    doc.author && typeof doc.author === "object"
      ? {
          name: str((doc.author as Doc).name),
          role: str((doc.author as Doc).role) || undefined,
          avatar: media((doc.author as Doc).avatar).url,
        }
      : undefined;

  return {
    ...toSummary(doc, locale),
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
const COLLECTION: Record<Collection, "posts" | "guides" | "helpArticles" | "comparisons" | "updates"> = {
  blog: "posts",
  guides: "guides",
  help: "helpArticles",
  compare: "comparisons",
  whatsNew: "updates",
};

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
        return asDocs(result.docs)
          .filter(translated)
          .map((doc) => toSummary(doc, locale));
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
        return doc && translated(doc) ? toArticle(doc, locale) : null;
      },
      null,
    );
  },
};

