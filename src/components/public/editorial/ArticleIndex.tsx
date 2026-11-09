import Link from "next/link";
import type { ArticleSummary, Collection } from "@/lib/content";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Section } from "@/components/ui";
import { PATH, type CollectionCopy, COLLECTIONS, UI } from "./copy";
import { formatDate, Cover, IndexHero } from "./shared";
import { HelpIndex } from "./HelpIndex";

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
                    <span className="mk-bidi block text-[length:var(--fs-ui)] leading-[1.5] font-medium text-[var(--text)] mk-underline-reveal">
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
        <span className="mk-bidi mt-3.5 block text-[length:var(--fs-d3)] leading-[1.25] font-medium text-[var(--text)] mk-underline-reveal">
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

              <span className="mk-bidi mt-3 block text-[length:var(--fs-h3)] leading-[1.35] font-medium text-[var(--text)] mk-underline-reveal">
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
