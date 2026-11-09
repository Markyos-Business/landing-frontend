import Link from "next/link";
import type { Article, Collection } from "@/lib/content";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { pageUrl } from "@/lib/seo";
import { Section, Icon, type IconName, Mark, RichText } from "@/components/ui";
import { PATH, COLLECTIONS, UI } from "./copy";
import { formatDate, Cover, ProvisionalNote } from "./shared";

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
                    `time` is in the plaintext list in tailwind/, so without
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
