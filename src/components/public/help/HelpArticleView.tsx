import Link from "next/link";
import type { HelpArticle, HelpCard } from "@/lib/content/help";
import { helpPath } from "@/lib/content/help";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon, Section } from "@/components/ui";
import { Bidi } from "./Bidi";
import type { TocItem } from "./body";
import { HELP_COPY } from "./copy";
import { ArticleRow, ContactFallback } from "./HelpHome";

/*
 * A Help Center article (C4).
 *
 * Breadcrumb, one h1, when it was last updated and how long it takes, then
 * the body beside its table of contents (sticky on a wide screen, a
 * disclosure above the body on a narrow one). After it: the feedback
 * question (C6), related articles, previous/next in the topic, and the way
 * to a person. Printing keeps only the article itself.
 */
export function HelpArticleView({
  locale,
  article,
  html,
  toc,
  minutes,
}: {
  locale: Locale;
  article: HelpArticle;
  /** The body, prepared by `prepareHelpBody`. */
  html: string;
  toc: TocItem[];
  minutes: number;
}) {
  const c = HELP_COPY[locale];
  const updated = article.publishedAt ? formatDay(article.publishedAt, locale) : null;

  return (
    <Section className="pt-[clamp(1.5rem,4vw,2.5rem)]">
      <nav aria-label={c.article.breadcrumb} className="mk-bidi mk-no-print text-[length:var(--fs-ui)] text-[var(--text-muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <Crumb href={localeHref(locale, "/help")} label={c.category.breadcrumb} first />
          {article.parentCategory ? (
            <Crumb href={localeHref(locale, helpPath(article.parentCategory.slug))} label={article.parentCategory.title} />
          ) : null}
          {article.category ? (
            <Crumb href={localeHref(locale, helpPath(article.category.slug))} label={article.category.title} />
          ) : null}
        </ol>
      </nav>

      <div className="mk-help-article mt-6">
        <article className="min-w-0" aria-labelledby="help-article-title">
          <p className="mk-eyebrow mk-bidi">{c.articleType[article.type]}</p>
          <h1 id="help-article-title" className="mk-h2 mk-bidi mt-3 max-w-[28ch]">
            <Bidi text={article.title} locale={locale} />
          </h1>
          {article.summary ? (
            <p className="mk-lead mk-bidi mt-4 max-w-[60ch]">
              <Bidi text={article.summary} locale={locale} />
            </p>
          ) : null}
          <p className="mk-help-meta mk-bidi mt-4">
            {updated && article.publishedAt ? (
              <span>
                {c.article.updated} <time dateTime={article.publishedAt}>{updated}</time>
              </span>
            ) : null}
            <span>{c.article.readingTime(minutes)}</span>
          </p>

          {toc.length > 1 ? (
            <details className="mk-help-toc-inline mk-no-print mt-6">
              <summary className="mk-bidi">{c.article.toc}</summary>
              <TocList toc={toc} />
            </details>
          ) : null}

          <div className="mk-prose mk-help-body mt-8" dangerouslySetInnerHTML={{ __html: html }} />

          {/* C6: the "Was this article helpful?" question goes here. */}
        </article>

        {toc.length > 1 ? (
          <aside className="mk-help-toc mk-no-print" aria-labelledby="help-toc">
            <p id="help-toc" className="mk-eyebrow mk-bidi">
              {c.article.toc}
            </p>
            <TocList toc={toc} />
          </aside>
        ) : null}
      </div>

      {article.related.length > 0 ? (
        <section aria-labelledby="help-related" className="mk-no-print mt-[clamp(2.5rem,5vw,4rem)]">
          <h2 id="help-related" className="mk-help-h2 mk-bidi">{c.article.related}</h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {article.related.map((card) => (
              <li key={card.id} className="flex">
                <ArticleRow locale={locale} card={card} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {article.previous || article.next ? (
        <nav aria-label={c.article.pager} className="mk-help-pager mk-no-print mt-[clamp(2.5rem,5vw,4rem)]">
          <PagerLink locale={locale} card={article.previous} label={c.article.previous} rel="prev" />
          <PagerLink locale={locale} card={article.next} label={c.article.next} rel="next" />
        </nav>
      ) : null}

      <div className="mk-no-print">
        <ContactFallback locale={locale} />
      </div>
    </Section>
  );
}

function Crumb({ href, label, first = false }: { href: string; label: string; first?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {first ? null : <Icon name="chevron" size={12} className="mk-help-row-mark" />}
      <Link href={href} className="mk-help-crumb">
        {label}
      </Link>
    </li>
  );
}

function TocList({ toc }: { toc: TocItem[] }) {
  return (
    <ol className="mt-3 grid gap-2">
      {toc.map((item) => (
        <li key={item.id} className={item.level === 3 ? "ps-4" : undefined}>
          <a href={`#${item.id}`} className="mk-help-crumb mk-bidi text-[length:var(--fs-ui)] text-[var(--text-muted)]">
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

function PagerLink({ locale, card, label, rel }: { locale: Locale; card: HelpCard | null; label: string; rel: "prev" | "next" }) {
  if (!card) return <span aria-hidden="true" />;
  return (
    <Link href={localeHref(locale, helpPath(card.categorySlug, card.slug))} rel={rel} className={`mk-help-row group mk-help-pager-${rel}`}>
      <span className="min-w-0">
        <span className="mk-bidi block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{label}</span>
        <span className="mk-bidi mt-1 block text-[length:var(--fs-ui)] font-medium text-[var(--text)] mk-underline-reveal">
          {card.title}
        </span>
      </span>
    </Link>
  );
}

/** "12 Sep 2026" / «12 سبتمبر 2026», Western digits in both (design system §11). */
export function formatDay(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: locale === "ar" ? "long" : "short",
    year: "numeric",
  }).format(date);
}
