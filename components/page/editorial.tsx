import Link from "next/link";
import Image from "next/image";
import type { Article, ArticleSummary } from "@/lib/content";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Eyebrow, Glow, Section } from "@/components/ui/Section";
import { Arrow, Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/content/RichText";

/*
 * The editorial templates — blog, guides, help centre.
 *
 * One index and one article template for all three collections, because they
 * are the same two pages with different words around them. Giving each
 * collection its own pair is how a help article ends up looking nothing like
 * a blog post for no reason anybody chose.
 *
 * Both are server components. The copy below is per-collection rather than in
 * the site dictionary because it is structural — a heading and an empty state
 * — and because it would otherwise be thirty-odd keys in a contract that is
 * about the homepage.
 */

export type Collection = "blog" | "guides" | "help";

/*
 * "N minutes to read", in Arabic.
 *
 * Arabic does not have one plural, it has six categories, and a count of one
 * takes a different word from a count of three — "1 دقائق" is as wrong as
 * "1 minutes" and was on every card in the help centre until a screenshot
 * caught it. `Intl.PluralRules` knows the categories; this maps them to the
 * noun's four written forms:
 *
 *   one  دقيقة واحدة     two  دقيقتان
 *   few  N دقائق  (3–10)  many N دقيقة  (11+)
 *
 * Written out rather than templated, because the number itself disappears in
 * the dual and the singular — which is exactly the case a format string gets
 * wrong.
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

type CollectionCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  empty: string;
  back: string;
  readingTime: (minutes: number) => string;
  /** Said on every placeholder piece. See lib/content/seed.ts. */
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

/** A standing notice on anything from the seed source. */
function ProvisionalNote({ text }: { text: string }) {
  return (
    <aside className="mk-inset flex gap-3 border-s-2 border-s-[var(--accent)]">
      <Icon name="scan" size={18} className="mt-0.5 flex-none text-[var(--accent-text)]" />
      <p className="mk-bidi text-[length:var(--fs-ui)] leading-[1.6] text-[var(--text-muted)]">{text}</p>
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

  /*
   * Grouped by category when every piece has one.
   *
   * The help centre is unreadable as a flat list of fourteen titles — the
   * source's own structure is categories with articles under them — and the
   * blog's categories make a long list scannable. Falling back to a flat list
   * when a category is missing means a half-tagged collection still renders.
   */
  const grouped = posts.length > 0 && posts.every((post) => post.category);
  const categories = grouped
    ? [...new Set(posts.map((post) => post.category as string))]
    : [];

  /*
   * The newest piece leads, but only if it has a picture to lead with.
   *
   * `posts` arrives newest-first from the adapter. A grouped collection skips
   * this: the help centre's first article is not more important than the
   * others, it is just the one that happens to sort first.
   */
  const featured = !grouped && posts[0]?.heroImage ? posts[0] : null;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <>
      <section
        aria-labelledby="coll-heading"
        className="relative overflow-hidden pt-[clamp(3rem,7vw,5rem)] pb-[clamp(2rem,5vw,3.5rem)]"
      >
        <Glow className="start-1/2 top-0 w-[min(50rem,100%)] -translate-x-1/2 opacity-60" />
        <div className="mk-container relative">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1 id="coll-heading" className="mk-h2-lg mk-bidi mt-4 max-w-[46rem]">
            {copy.title}
          </h1>
          <p className="mk-lead mk-bidi mt-5 max-w-[40rem]">{copy.lead}</p>
        </div>
      </section>

      {/* No top padding: the title and the collection under it are one block,
          and the hero section above already carries the space between them. */}
      <Section className="pt-0">
        {posts.length === 0 ? (
          // The honest empty state. Better than three invented posts.
          <p className="mk-bidi text-[var(--text-muted)]">{copy.empty}</p>
        ) : grouped ? (
          <div className="space-y-14">
            {categories.map((category) => (
              <section key={category} aria-label={category}>
                <h2 className="mk-bidi mk-eyebrow mk-rule pt-6">{category}</h2>
                <PostRows
                  className="mt-6"
                  posts={posts.filter((post) => post.category === category)}
                  collection={collection}
                  locale={locale}
                  copy={copy}
                  showCategory={false}
                />
              </section>
            ))}
          </div>
        ) : (
          <>
            {featured ? (
              <FeaturedPost
                post={featured}
                collection={collection}
                locale={locale}
                copy={copy}
              />
            ) : null}
            {rest.length ? (
              <PostRows
                className={featured ? "mt-8" : ""}
                posts={rest}
                collection={collection}
                locale={locale}
                copy={copy}
                showCategory
              />
            ) : null}
          </>
        )}
      </Section>
    </>
  );
}

/*
 * The newest piece, given the room its picture needs.
 *
 * Only when it actually has one: a featured slot with an empty frame in it is
 * worse than no featured slot, and the seed content is half-illustrated. The
 * rest of the collection is rows below, which is the reference's composition
 * for an index — one thing to look at, then a list to scan.
 */
function FeaturedPost({
  post,
  collection,
  locale,
  copy,
}: {
  post: ArticleSummary;
  collection: Collection;
  locale: Locale;
  copy: CollectionCopy;
}) {
  const published = formatDate(post.publishedAt, locale);

  return (
    <Link
      href={localeHref(locale, `/${collection}/${post.slug}`)}
      className="group grid overflow-hidden rounded-[var(--mk-r-blog)] shadow-[0_0_0_1px_var(--hairline-strong)] transition-colors hover:bg-[var(--surface-1)] md:grid-cols-2"
    >
      <Image
        src={post.heroImage as string}
        alt={post.heroImageAlt ?? ""}
        width={768}
        height={512}
        className="aspect-[3/2] w-full object-cover"
      />

      <div className="flex flex-col justify-between gap-8 p-6 sm:p-[var(--mk-card-pad)]">
        <div>
          <p className="mk-bidi text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
            {[post.category, published].filter(Boolean).join(" · ")}
          </p>
          <h3 className="mk-bidi mt-2 text-[length:var(--fs-d3)] leading-[1.2] font-medium text-[var(--text)]">
            {post.title}
          </h3>
          <p className="mk-bidi mt-3 text-[length:var(--fs-body)] leading-[1.65] text-[var(--text-muted)]">
            {post.excerpt}
          </p>
        </div>

        <p className="mk-bidi flex items-center gap-2 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          {post.readingMinutes ? <span>{copy.readingTime(post.readingMinutes)}</span> : null}
          <Arrow size={14} />
        </p>
      </div>
    </Link>
  );
}

/*
 * The collection as rows, not a grid of boxes.
 *
 * A row is meta, then the title, then how long it takes to read — which is
 * the order someone scanning an index actually asks those questions in. They
 * sit inside one ring and are separated by 5% hairlines rather than each
 * being its own card, so fourteen help articles read as one list instead of
 * fourteen objects (MARKYOS-DESIGN-SYSTEM.md §10, "Row").
 */
function PostRows({
  posts,
  collection,
  locale,
  copy,
  showCategory,
  className = "",
}: {
  posts: ArticleSummary[];
  collection: Collection;
  locale: Locale;
  copy: CollectionCopy;
  showCategory: boolean;
  className?: string;
}) {
  return (
    <ul
      className={`overflow-hidden rounded-[var(--mk-r-blog)] shadow-[0_0_0_1px_var(--hairline-strong)] ${className}`}
    >
      {posts.map((post) => {
        const published = formatDate(post.publishedAt, locale);
        const meta = [showCategory ? post.category : null, published].filter(Boolean).join(" · ");

        return (
          <li
            key={post.slug}
            className="border-t border-[var(--hairline)] first:border-t-0"
          >
            <Link
              href={localeHref(locale, `/${collection}/${post.slug}`)}
              className="flex items-center gap-5 px-5 py-4 transition-colors hover:bg-[var(--surface-3)] sm:px-6"
            >
              <span className="min-w-0 flex-1">
                {meta ? (
                  <span className="mk-bidi block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                    {meta}
                  </span>
                ) : null}
                <span className="mk-bidi mt-1 block text-[length:var(--fs-body)] leading-[1.5] font-medium text-[var(--text)]">
                  {post.title}
                </span>
              </span>

              {post.readingMinutes ? (
                <span className="mk-bidi hidden flex-none text-[length:var(--fs-eyebrow)] text-[var(--text-muted)] sm:block">
                  {copy.readingTime(post.readingMinutes)}
                </span>
              ) : null}
              <Arrow size={14} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ── the article ──────────────────────────────────────────────────────────── */

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
  const published = post.publishedAt ? formatDate(post.publishedAt, locale) : null;

  return (
    <Section id="post" labelledBy="post-heading" className="pt-[clamp(2.5rem,6vw,4rem)]">
      <article className="mk-measure">
        <nav aria-label="Breadcrumb" className="mb-7">
          <Link
            href={localeHref(locale, `/${collection}`)}
            className="mk-bidi inline-flex items-center gap-1.5 text-[length:var(--fs-ui)] font-medium text-[var(--accent-text)] hover:underline"
          >
            <Icon name="chevron" size={13} className="rotate-90 rtl:-rotate-90" />
            {copy.back}
          </Link>
        </nav>

        {post.category ? (
          <p className="mk-bidi text-[length:var(--fs-ui)] font-medium text-[var(--accent-text)]">
            {post.category}
          </p>
        ) : null}

        <h1 id="post-heading" className="mk-h2 mk-bidi mt-3">
          {post.title}
        </h1>

        {post.excerpt ? <p className="mk-lead mk-bidi mt-5">{post.excerpt}</p> : null}

        <div className="mk-bidi mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[var(--hairline)] py-4 text-[length:var(--fs-ui)] text-[var(--text-muted)]">
          {post.author?.name ? <span>{post.author.name}</span> : null}
          {published ? <time dateTime={post.publishedAt}>{published}</time> : null}
          {post.readingMinutes ? <span>{copy.readingTime(post.readingMinutes)}</span> : null}
        </div>

        {post.provisional ? (
          <div className="mt-7">
            <ProvisionalNote text={copy.provisional} />
          </div>
        ) : null}

        {post.heroImage ? (
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt ?? ""}
            width={1600}
            height={900}
            priority
            className="mt-9 w-full rounded-[var(--radius-card)] object-cover"
          />
        ) : null}

        <RichText data={post.body} className="mt-9" />
      </article>
    </Section>
  );
}
