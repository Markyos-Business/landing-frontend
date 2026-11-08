import Link from "next/link";
import Image from "next/image";
import type { Article, ArticleSummary } from "@/lib/content";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { pageUrl } from "@/lib/seo";
import { Eyebrow, Glow, Section } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Mark } from "@/components/brand/Logo";
import { RichText } from "@/components/content/RichText";
import { HelpBrowser } from "@/components/page/HelpBrowser";

/*
 * The editorial templates — blog, guides, help centre.
 *
 * ── Three indexes now, not one ────────────────────────────────────────────
 *
 * It used to be one index and one article template for all three, on the
 * argument that they are the same two pages with different words. That was
 * right while all three were lists of titles and wrong once they had real
 * content in them: a magazine, a shelf of downloads and a support centre are
 * three different things to arrive at, and a reader arrives at each with a
 * different question.
 *
 *   /blog    one piece to read now, then the rest to browse.  "What's new?"
 *   /guides  a shelf. Every item equal, nothing featured.     "What is there?"
 *   /help    search first, then categories.                   "Where's my answer?"
 *
 * What they still share — and what keeps this one file rather than three — is
 * the card, the cover, the meta line, the reading-time plural and the whole
 * article template. The shapes differ; the vocabulary does not.
 *
 * ── Covers, with no photographs ───────────────────────────────────────────
 *
 * The references these are drawn from are photographic: a hero shot on the
 * article, a landscape on every card. This site has no imagery by design and
 * nothing in the content model carries a picture today — `heroImage` is
 * optional and no seeded piece sets one. So a cover is typeset instead of
 * photographed: the piece's own category, large, on one of four grounds mixed
 * from the site's single blue. It is a real object rather than a placeholder
 * frame, it cannot go stale, and the day a post arrives with a photograph
 * `Cover` renders that instead without anything else changing.
 */

export type { Collection } from "@/lib/content";
import type { Collection } from "@/lib/content";

/* ── plurals ──────────────────────────────────────────────────────────────
 *
 * Arabic does not have one plural, it has six categories, and a count of one
 * takes a different word from a count of three — "1 دقائق" is as wrong as
 * "1 minutes" and was on every card in the help centre until a screenshot
 * caught it. `Intl.PluralRules` knows the categories; these map them to each
 * noun's four written forms. Written out rather than templated, because the
 * number itself disappears in the dual and the singular — which is exactly
 * the case a format string gets wrong.
 */
const AR_PLURAL = new Intl.PluralRules("ar");

function arabicMinutes(count: number): string {
  switch (AR_PLURAL.select(count)) {
    case "one":
      return "دقيقة واحدة للقراءة";
    case "two":
      return "دقيقتان للقراءة";
    case "few":
      return `${count} دقائق للقراءة`;
    default:
      return `${count} دقيقة للقراءة`;
  }
}

function arabicArticles(count: number): string {
  switch (AR_PLURAL.select(count)) {
    case "zero":
      return "لا مقالات";
    case "one":
      return "مقال واحد";
    case "two":
      return "مقالان";
    case "few":
      return `${count} مقالات`;
    default:
      return `${count} مقالاً`;
  }
}

/*
 * The URL segment for each collection.
 *
 * Four of the five are their own name. `whatsNew` is not: the route is
 * `/whats-new`, which cannot be a TypeScript key without quoting it
 * everywhere, and a hyphen in an identifier is the kind of thing that
 * silently becomes `/whatsNew` in one link out of twenty. One map, and every
 * link below reads it.
 */
const PATH: Record<Collection, string> = {
  blog: "blog",
  guides: "guides",
  help: "help",
  compare: "compare",
  whatsNew: "whats-new",
};

type CollectionCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  empty: string;
  back: string;
  readingTime: (minutes: number) => string;
  /** Said on every piece ticked "Placeholder content" in the panel. */
  provisional: string;
};

export const COLLECTIONS: Record<Collection, Record<Locale, CollectionCopy>> = {
  blog: {
    ar: {
      eyebrow: "الموارد",
      title: "المدونة.",
      lead: "عن العلامات التي تُصنع بعناية، وتعيش بالعربية والإنجليزية.",
      empty: "لا توجد مقالات بعد. الأولى قيد الكتابة.",
      back: "المدونة",
      readingTime: arabicMinutes,
      provisional:
        "هذه المقالة محتوى مبدئي، كُتبت لتجربة تصميم الصفحة قبل أن نكتب مقالاتنا الحقيقية. لا تعتمد على تفاصيلها، ولا تشاركها خارج الفريق.",
    },
    en: {
      eyebrow: "Resources",
      title: "Blog.",
      lead: "On brands made carefully, and kept alive in Arabic and English.",
      empty: "No posts yet. The first one is being written.",
      back: "Blog",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This piece is placeholder content, written to try the page design before the real articles are written. Don't rely on it or share it outside the team.",
    },
  },
  guides: {
    ar: {
      eyebrow: "الموارد",
      title: "أدلة وقوالب تستخدمها اليوم.",
      lead: "مجانية، وعملية، وبالعربية والإنجليزية. خذها إلى مشروعك القادم، سواء استخدمت ماركيوس أم لا.",
      empty: "الأدلة قيد الكتابة.",
      back: "الأدلة",
      readingTime: arabicMinutes,
      provisional:
        "هذا الدليل محتوى مبدئي، كُتب لتجربة تصميم الصفحة قبل أن نكتب أدلّتنا الحقيقية. لا تعتمد على تفاصيله، ولا تشاركه خارج الفريق.",
    },
    en: {
      eyebrow: "Resources",
      title: "Guides and templates you can use today.",
      lead: "Free, practical, and in both languages.",
      empty: "The guides are being written.",
      back: "Guides",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This guide is placeholder content, written to try the page design before the real guides are written.",
    },
  },
  compare: {
    ar: {
      eyebrow: "الموارد",
      title: "ماركيوس مقابل غيره.",
      lead: "مقارنات صريحة مع الأدوات التي تستخدمها اليوم، ومتى يكون غيرنا أنسب لك.",
      empty: "المقارنات قيد الكتابة.",
      back: "المقارنات",
      readingTime: arabicMinutes,
      provisional:
        "هذه المقارنة محتوى مبدئي. لا تعتمد على تفاصيلها، ولا تشاركها خارج الفريق.",
    },
    en: {
      eyebrow: "Resources",
      title: "Markyos compared.",
      lead: "Straight comparisons with the tools you use today, including when the other one suits you better.",
      empty: "The comparisons are being written.",
      back: "Comparisons",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This comparison is placeholder content. Don't rely on it or share it outside the team.",
    },
  },
  whatsNew: {
    ar: {
      eyebrow: "الموارد",
      title: "الجديد في ماركيوس.",
      lead: "كل ما أضفناه، بتاريخه، وما يعنيه لك.",
      empty: "لا توجد تحديثات بعد.",
      back: "الجديد",
      readingTime: arabicMinutes,
      provisional:
        "هذا التحديث محتوى مبدئي. لا تعتمد على تفاصيله، ولا تشاركه خارج الفريق.",
    },
    en: {
      eyebrow: "Resources",
      title: "What's new in Markyos.",
      lead: "Everything we have added, dated, and what it means for you.",
      empty: "No updates yet.",
      back: "What's new",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This update is placeholder content. Don't rely on it or share it outside the team.",
    },
  },
  help: {
    ar: {
      eyebrow: "مركز المساعدة",
      title: "كيف نساعدك؟",
      lead: "شروحات خطوة بخطوة لكل ما في ماركيوس: البدء، والمشاريع، والدليل، والتسليم، والنبرة، والحساب والفوترة.",
      empty: "مقالات المساعدة قيد الكتابة.",
      back: "مركز المساعدة",
      readingTime: arabicMinutes,
      provisional:
        "هذا المقال محتوى مبدئي، كُتب لتجربة تصميم الصفحة. قد تختلف الخطوات عن المنتج النهائي.",
    },
    en: {
      eyebrow: "Help centre",
      title: "How can we help?",
      lead: "Step-by-step guidance for everything in Markyos.",
      empty: "The help articles are being written.",
      back: "Help centre",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This article is placeholder content, written to try the page design.",
    },
  },
};

/*
 * The structural words, shared by all three collections.
 *
 * Here and not in `COLLECTIONS` because they say the same thing on every one
 * of them — "latest", "all", "categories", "share". Three copies of each
 * would be three places for them to drift apart.
 */
const UI: Record<
  Locale,
  {
    latest: string;
    all: string;
    categories: string;
    related: string;
    share: string;
    searchLabel: string;
    searchPlaceholder: string;
    clear: string;
    noMatch: string;
    /** Names the suggestion list under the search field. */
    suggestions: string;
    articles: (n: number) => string;
    date: string;
    category: string;
    reading: string;
    results: (n: number) => string;
  }
> = {
  ar: {
    latest: "أحدث المقالات",
    all: "كل المقالات",
    categories: "التصنيفات",
    related: "اقرأ أيضاً",
    share: "شارك",
    searchLabel: "ابحث في مركز المساعدة",
    searchPlaceholder: "ابحث في مقالات المساعدة…",
    clear: "امسح البحث",
    noMatch: "لا توجد مقالات تطابق بحثك.",
    suggestions: "نتائج مقترحة",
    articles: arabicArticles,
    date: "التاريخ",
    category: "التصنيف",
    reading: "وقت القراءة",
    results: arabicArticles,
  },
  en: {
    latest: "Latest posts",
    all: "All posts",
    categories: "Categories",
    related: "Read next",
    share: "Share",
    searchLabel: "Search the help centre",
    searchPlaceholder: "Search help articles…",
    clear: "Clear search",
    noMatch: "No articles match your search.",
    suggestions: "Suggested results",
    articles: (n) => (n === 1 ? "1 article" : `${n} articles`),
    date: "Date",
    category: "Category",
    reading: "Reading time",
    results: (n) => (n === 1 ? "1 result" : `${n} results`),
  },
};

function formatDate(value: string, locale: Locale): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/*
 * Which of the four cover grounds a piece gets.
 *
 * Hashed from the category rather than from the slug, so every piece in a
 * category shares a ground and the index reads as sections of a magazine
 * instead of a bag of colours. Deterministic, so it does not change between
 * the server render and the client, and stable across a rebuild.
 */
function tone(key: string | undefined): number {
  if (!key) return 0;
  let sum = 0;
  for (let i = 0; i < key.length; i += 1) sum = (sum + key.charCodeAt(i)) % 1024;
  return sum % 4;
}

/*
 * A cover.
 *
 * `heroImage` wins whenever a piece has one — the day editorial starts
 * shooting, nothing here changes. Without one it is typeset: the category on
 * a mixed-blue ground, with the mark in the corner. `aria-hidden` either way,
 * because the title it sits above already says what the piece is.
 */
function Cover({
  post,
  word,
  size = "card",
}: {
  post: ArticleSummary;
  /*
   * What the cover says when the piece has no category.
   *
   * Not a hypothetical: the first post published through the CMS had none,
   * and the cover came out as an empty gradient with a mark in the corner.
   * The collection's own name is always true and always present, which is
   * the only kind of fallback worth having.
   */
  word?: string;
  size?: "feature" | "card" | "thumb";
}) {
  if (post.heroImage) {
    return (
      <Image
        src={post.heroImage}
        alt={post.heroImageAlt ?? ""}
        width={1600}
        height={900}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <span className="mk-cover" data-tone={tone(post.category)} data-size={size} aria-hidden="true">
      {size === "thumb" ? null : (
        <span className="mk-cover-word mk-bidi">{post.category ?? word ?? ""}</span>
      )}
      <span className="mk-cover-mark">
        <Mark size={size === "thumb" ? 18 : 26} />
      </span>
    </span>
  );
}

/**
 * A standing notice on anything from the seed source.
 *
 * `.mk-inset` is a panel recessed *into a card* and this one sits on the
 * page, so it is built the way everything else on this ground lifts off it:
 * white, a ring, and an accent edge marking it as an aside.
 */
function ProvisionalNote({ text }: { text: string }) {
  return (
    <aside className="flex gap-3 rounded-[var(--radius-widget)] border-s-2 border-s-[var(--accent)] bg-[var(--surface-1)] p-4 shadow-[0_0_0_1px_var(--hairline)]">
      <Icon name="comments" size={18} className="mt-0.5 flex-none text-[var(--accent-text)]" />
      <p className="mk-bidi text-[length:var(--fs-ui)] leading-[1.6] text-[var(--text-muted)]">
        {text}
      </p>
    </aside>
  );
}

/* ── the index ────────────────────────────────────────────────────────────── */

export function ArticleIndex({
  collection,
  locale,
  posts,
}: {
  collection: Collection;
  locale: Locale;
  posts: ArticleSummary[];
}) {
  const copy = COLLECTIONS[collection][locale];
  const ui = UI[locale];

  if (collection === "help") {
    return <HelpIndex locale={locale} posts={posts} copy={copy} ui={ui} />;
  }

  return (
    <>
      <IndexHero copy={copy} />

      {/* No top padding: the title and the collection under it are one block,
          and the hero section above already carries the space between them. */}
      <Section className="pt-0">
        {posts.length === 0 ? (
          // The honest empty state. Better than three invented posts.
          <p className="mk-bidi text-[var(--text-muted)]">{copy.empty}</p>
        ) : collection === "blog" ? (
          <BlogBody posts={posts} locale={locale} copy={copy} ui={ui} />
        ) : (
          /* Every section that is not the help centre and not the blog: the
             guides, the comparisons and the release notes. The collection
             was hard-coded to "guides" here, which was true while guides
             were the only one and silently wrong the day they were not —
             /compare and /whats-new both rendered their cards linking to
             /guides/<slug>, and every one of those nineteen URLs 404ed. */
          <PostGrid posts={posts} collection={collection} locale={locale} copy={copy} cols={2} />
        )}
      </Section>
    </>
  );
}

function IndexHero({ copy }: { copy: CollectionCopy }) {
  return (
    <section
      aria-labelledby="coll-heading"
      className="relative overflow-clip pt-[clamp(3rem,7vw,5rem)] pb-[clamp(2.5rem,5vw,4rem)]"
    >
      <Glow className="mk-center-x -top-32 w-[min(54rem,110%)]" />
      {/* Centred, like every other hub on the site. The articles below stay
          on the start edge, where long-form belongs. */}
      <div className="mk-seq-load mk-container relative flex flex-col items-center text-center">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 id="coll-heading" className="mk-load-move mk-h2-lg mk-bidi mt-4 max-w-[46rem]">
          {copy.title}
        </h1>
        <p className="mk-load-move mk-lead mk-bidi mt-5 max-w-[40rem]">{copy.lead}</p>
      </div>
    </section>
  );
}

/*
 * The blog: one piece to read now, then the rest to browse.
 *
 * The newest piece takes the full height of the opening row with the four
 * after it listed beside it, which is the composition the reference uses and
 * the reason it works: a reader who came for "what's new" is answered by the
 * big one, and a reader who came back after a fortnight scans the four.
 * Everything from the sixth on is the grid below.
 */
function BlogBody({
  posts,
  locale,
  copy,
  ui,
}: {
  posts: ArticleSummary[];
  locale: Locale;
  copy: CollectionCopy;
  ui: (typeof UI)[Locale];
}) {
  const [lead, ...others] = posts;
  const latest = others.slice(0, 4);
  const rest = others.slice(4);

  return (
    <>
      <div className="mk-seq grid gap-6 lg:grid-cols-[1.75fr_1fr]">
        <FeaturePost post={lead} locale={locale} copy={copy} />

        <aside aria-labelledby="latest-heading">
          <h2
            id="latest-heading"
            className="mk-bidi text-[length:var(--fs-h3)] font-medium text-[var(--text)]"
          >
            {ui.latest}
          </h2>

          <ul className="mt-4 flex flex-col">
            {latest.map((post) => (
              <li key={post.slug} className="border-t border-[var(--hairline)] first:border-t-0">
                <Link
                  href={localeHref(locale, `/blog/${post.slug}`)}
                  className="group flex items-start gap-3.5 py-3.5"
                >
                  <span className="mk-cover-frame aspect-[16/9] w-16 flex-none">
                    <Cover post={post} size="thumb" word={copy.back} />
                  </span>
                  <span className="min-w-0">
                    <span className="mk-bidi block text-[length:var(--fs-ui)] leading-[1.5] font-medium text-[var(--text)] group-hover:underline">
                      {post.title}
                    </span>
                    <span className="mk-bidi mt-1.5 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                      <Meta post={post} locale={locale} copy={copy} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {rest.length ? (
        <div className="mt-[clamp(3.5rem,7vw,5.5rem)]">
          <h2 className="mk-rise mk-bidi text-[length:var(--fs-d3)] leading-[1.25] font-medium text-[var(--text)]">
            {ui.all}
          </h2>
          <PostGrid
            className="mt-8"
            posts={rest}
            collection="blog"
            locale={locale}
            copy={copy}
            cols={3}
          />
        </div>
      ) : null}
    </>
  );
}

/* The date and the reading time, as one line, in that order. */
function Meta({
  post,
  locale,
  copy,
}: {
  post: ArticleSummary;
  locale: Locale;
  copy: CollectionCopy;
}) {
  const published = formatDate(post.publishedAt, locale);
  const parts = [
    published,
    post.readingMinutes ? copy.readingTime(post.readingMinutes) : null,
  ].filter(Boolean);
  // A middle dot, not a bullet: it is a separator between two facts and it
  // must not be read aloud as a list item.
  return <>{parts.join(" · ")}</>;
}

/* A category, as a pill. The one place a category is a visible object. */
function CategoryPill({ name }: { name: string }) {
  return (
    <span className="mk-cat-pill mk-bidi">
      {name}
    </span>
  );
}

/*
 * The lead piece: a cover with the words on it.
 *
 * The scrim is part of `.mk-feature-post` rather than an opacity on the text,
 * because the text has to stay at full strength — it is a headline, not a
 * caption — and what gives way is the picture behind it.
 */
function FeaturePost({
  post,
  locale,
  copy,
}: {
  post: ArticleSummary;
  locale: Locale;
  copy: CollectionCopy;
}) {
  return (
    <Link
      href={localeHref(locale, `/blog/${post.slug}`)}
      className="mk-feature-post mk-pop mk-reach group"
    >
      <span className="mk-feature-post-art">
        <Cover post={post} size="feature" word={copy.back} />
      </span>

      <span className="mk-feature-post-body">
        {post.category ? <CategoryPill name={post.category} /> : null}
        <span className="mk-bidi mt-3.5 block text-[length:var(--fs-d3)] leading-[1.25] font-medium text-[var(--text)] group-hover:underline">
          {post.title}
        </span>
        <span className="mk-bidi mt-2.5 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          <Meta post={post} locale={locale} copy={copy} />
        </span>
      </span>
    </Link>
  );
}

/*
 * The collection as cards.
 *
 * Cards and not the rows this used to be: a row carries a title and nothing
 * else, which is right for a support index where the title *is* the question,
 * and wrong for a magazine where the excerpt is half the reason to open one.
 * The help centre kept the rows.
 */
function PostGrid({
  posts,
  collection,
  locale,
  copy,
  cols,
  className = "",
}: {
  posts: ArticleSummary[];
  collection: Collection;
  locale: Locale;
  copy: CollectionCopy;
  cols: 2 | 3;
  className?: string;
}) {
  const columns = cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

  return (
    <ul className={`mk-seq grid gap-5 ${columns} ${className}`}>
      {posts.map((post) => (
        <li key={post.slug} className="flex">
          <Link
            href={localeHref(locale, `/${PATH[collection]}/${post.slug}`)}
            className="mk-post-card mk-reach group"
          >
            <span className="mk-post-card-art">
              <Cover post={post} word={copy.back} />
            </span>

            <span className="flex flex-1 flex-col p-5">
              {post.category ? <CategoryPill name={post.category} /> : null}

              <span className="mk-bidi mt-3 block text-[length:var(--fs-h3)] leading-[1.35] font-medium text-[var(--text)] group-hover:underline">
                {post.title}
              </span>

              <span className="mk-bidi mt-2 block text-[length:var(--fs-body)] leading-[1.65] text-[var(--text-muted)]">
                {post.excerpt}
              </span>

              <span className="mk-bidi mt-auto block pt-5 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                <Meta post={post} locale={locale} copy={copy} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ── the help centre ──────────────────────────────────────────────────────
 *
 * Search first, then categories, then everything. A reader arrives here with
 * a question already formed, and the fastest route from a formed question to
 * an answer is a text field — so the field is in the hero rather than below
 * the fold, and the categories are what the reader falls back to when the
 * words they tried were not our words.
 *
 * `HelpBrowser` is the only client component in this file's tree. It does the
 * filtering, because filtering fourteen titles the reader can already see is
 * not worth a round trip, and because a search that needs the network is a
 * search that is slower than scrolling.
 */
function HelpIndex({
  locale,
  posts,
  copy,
  ui,
}: {
  locale: Locale;
  posts: ArticleSummary[];
  copy: CollectionCopy;
  ui: (typeof UI)[Locale];
}) {
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[];

  /*
   * The hero and the search are one object, so the hero is rendered by
   * `HelpBrowser` rather than beside it.
   *
   * The field belongs *in* the panel — it is the first thing the page is
   * for, and a search bar sitting under the panel it belongs to reads as the
   * start of the list instead of the end of the header. The heading is still
   * server-rendered: a client component is hydrated, not fetched, so the h1
   * is in the HTML either way.
   */
  if (posts.length === 0) {
    return (
      <>
        <IndexHero copy={copy} />
        <Section className="pt-0">
          <p className="mk-bidi text-[var(--text-muted)]">{copy.empty}</p>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section className="pt-[clamp(1.5rem,4vw,2.5rem)]">
          <HelpBrowser
            locale={locale}
            hero={{ eyebrow: copy.eyebrow, title: copy.title, lead: copy.lead }}
            posts={posts.map((post) => ({
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              category: post.category ?? "",
              readingMinutes: post.readingMinutes ?? 0,
            }))}
            categories={categories.map((name) => ({
              name,
              icon: helpIcon(name),
              count: posts.filter((p) => p.category === name).length,
            }))}
            labels={{
              search: ui.searchLabel,
              placeholder: ui.searchPlaceholder,
              clear: ui.clear,
              categories: ui.categories,
              all: ui.all,
              noMatch: ui.noMatch,
              suggestions: ui.suggestions,
            }}
            /* Pluralised here and passed down as finished strings. Arabic has
               six plural categories and the client bundle has no business
               carrying a second copy of the rules for them. */
            counts={Object.fromEntries(
              categories.map((name) => [
                name,
                ui.articles(posts.filter((p) => p.category === name).length),
              ]),
            )}
            readingTimes={Object.fromEntries(
              posts.map((p) => [p.slug, p.readingMinutes ? copy.readingTime(p.readingMinutes) : ""]),
            )}
            /*
             * A list and not a function. A server component cannot hand a
             * client one a callback — it has to serialise — and the count
             * can only ever be 0 to however many articles there are, so the
             * whole answer fits in an array of that length.
             */
            resultWords={Array.from({ length: posts.length + 1 }, (_, n) => ui.results(n))}
          />
      </Section>
    </>
  );
}

/*
 * An icon for a help category.
 *
 * Matched on a word in the name rather than on its position in the list,
 * because the list's order is the content's and a rocket landing on
 * "Billing" because it sorted third is worse than no icon at all. Both
 * languages, because the CMS will publish English categories eventually, and
 * `book` when nothing matches — which is a neutral answer, not a wrong one.
 */
function helpIcon(name: string): IconName {
  const table: [RegExp, IconName][] = [
    [/بدء|البداية|start|getting/i, "rocket"],
    [/استبيان|تحليل|brief|analys/i, "form"],
    [/أصول|دليل|asset|guideline/i, "folder"],
    [/تسليم|handoff|deliver/i, "package"],
    [/صوت|نبرة|voice|tone/i, "commentDots"],
    [/فريق|مشارك|team|shar/i, "users"],
    [/نطاق|نشر|domain|publish/i, "globe"],
    [/حساب|فوتر|account|billing/i, "coins"],
    [/خصوص|أمان|privacy|security/i, "lock"],
  ];
  for (const [pattern, icon] of table) if (pattern.test(name)) return icon;
  return "book";
}

/* ── the article ──────────────────────────────────────────────────────────── */

/*
 * One piece, in the shape the reference lays out.
 *
 * A meta row of three labelled facts across the top under hairlines, the
 * title, the standfirst, the byline, then the cover full width, then the body
 * on a reading measure with the share rail beside it. Each part answers a
 * question a reader asks before they commit to reading: how old is this, what
 * is it about, how long will it take, who wrote it.
 */
export function ArticleView({
  collection,
  locale,
  post,
}: {
  collection: Collection;
  locale: Locale;
  post: Article;
  }) {
  const copy = COLLECTIONS[collection][locale];
  const ui = UI[locale];
  const published = post.publishedAt ? formatDate(post.publishedAt, locale) : null;
  const url = pageUrl(locale, `/${PATH[collection]}/${post.slug}`);

  return (
    <Section id="post" labelledBy="post-heading" className="pt-[clamp(2rem,5vw,3.5rem)]">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href={localeHref(locale, `/${PATH[collection]}`)}
          className="mk-bidi inline-flex items-center gap-1.5 text-[length:var(--fs-ui)] font-medium text-[var(--accent-text)] hover:underline"
        >
          <Icon name="chevron" size={13} className="rotate-90 rtl:-rotate-90" />
          {copy.back}
        </Link>
      </nav>

      <div className="mk-article-head mk-seq-load">
        <dl className="mk-article-meta">
          {published ? (
            <div>
              <dt>{ui.date}</dt>
              <dd>
                {/* `mk-bidi` on the <time>, which looks backwards and is not.
                    `time` is in the plaintext list in globals.css, so without
                    this it is an isolate: the <dd> around it scans for a
                    strong character, finds one object replacement character,
                    falls back to left-to-right and sends "2 أكتوبر 2026" to
                    the far edge of its own cell while the two cells beside it
                    sit on the right. `.mk-bidi` inside one of those blocks
                    *stops* isolating, so the date resolves at the <dd> that
                    owns the alignment. */}
                <time className="mk-bidi" dateTime={post.publishedAt}>
                  {published}
                </time>
              </dd>
            </div>
          ) : null}
          {post.category ? (
            <div>
              <dt>{ui.category}</dt>
              <dd className="mk-bidi">{post.category}</dd>
            </div>
          ) : null}
          {post.readingMinutes ? (
            <div>
              <dt>{ui.reading}</dt>
              <dd className="mk-bidi">{copy.readingTime(post.readingMinutes)}</dd>
            </div>
          ) : null}
        </dl>

        <h1 id="post-heading" className="mk-load-move mk-h2 mk-bidi mt-7 max-w-[22ch]">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mk-load-move mk-lead mk-bidi mt-5 max-w-[54ch]">{post.excerpt}</p>
        ) : null}

        {post.author?.name ? (
          <div className="mk-load-move mt-7 flex items-center gap-3">
            <span className="mk-byline-avatar" aria-hidden="true">
              <Mark size={18} />
            </span>
            <span>
              <span className="mk-bidi block text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
                {post.author.name}
              </span>
              {post.author.role ? (
                <span className="mk-bidi block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                  {post.author.role}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mk-article-art mk-rise">
        <Cover post={post} size="feature" word={copy.back} />
      </div>

      <div className="mk-article-body">
        <ShareRail url={url} title={post.title} label={ui.share} />

        <article className="mk-measure min-w-0">
          {post.provisional ? (
            <div className="mb-9">
              <ProvisionalNote text={copy.provisional} />
            </div>
          ) : null}

          <RichText data={post.body} />
        </article>
      </div>
    </Section>
  );
}

/*
 * The share rail.
 *
 * Three plain links and no JavaScript: each is a share intent the platform
 * answers with its own composer, so nothing here needs the clipboard, a
 * permission or a client component. WhatsApp is the third rather than
 * Facebook because this site's first audience is in the Gulf, where it is
 * where a link actually gets passed on.
 *
 * Sticky beside the body on a wide screen and a plain row above it on a
 * narrow one — see `.mk-share-rail`. It is a `<nav>` with a label, so a
 * screen reader can skip the three of them in one move.
 */
function ShareRail({ url, title, label }: { url: string; title: string; label: string }) {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const links: { name: IconName; href: string; label: string }[] = [
    { name: "twitter", href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`, label: "X" },
    {
      name: "linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      label: "LinkedIn",
    },
    { name: "whatsapp", href: `https://wa.me/?text=${text}%20${encoded}`, label: "WhatsApp" },
  ];

  return (
    <nav aria-label={label} className="mk-share-rail">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mk-share-link"
        >
          <Icon name={link.name} size={16} label={`${label} — ${link.label}`} />
        </a>
      ))}
    </nav>
  );
}
