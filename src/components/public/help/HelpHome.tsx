import Link from "next/link";
import type { HelpCard, HelpCategory, HelpHome as HomeData } from "@/lib/content/help";
import { helpPath } from "@/lib/content/help";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon, Section } from "@/components/ui";
import { HELP_COPY } from "./copy";
import { categoryIcon } from "./icons";

/*
 * The Help Center home (C1).
 *
 * Search first, because a reader arrives with a question already formed; then
 * "Getting started" for the reader who doesn't have one yet; then the topics;
 * then what others read and what changed; and last, a way to a person.
 *
 * All of it is server-rendered. The search is a plain GET form onto
 * /help/search, so it works before (and without) any JavaScript.
 */
export function HelpHome({ locale, data }: { locale: Locale; data: HomeData }) {
  const c = HELP_COPY[locale];
  const topics = data.categories.filter((cat) => cat.articleCount > 0);

  return (
    <>
      <Section className="pt-[clamp(1.5rem,4vw,2.5rem)]">
        <div className="mk-help-hero mk-seq-load" data-help-center="">
          <p className="mk-eyebrow mk-eyebrow-accent mk-bidi">{c.home.hero.eyebrow}</p>
          <h1 id="help-heading" className="mk-load-move mk-h2-lg mk-bidi mt-4 max-w-[34rem]">
            {c.home.hero.title}
          </h1>
          <p className="mk-load-move mk-lead mk-bidi mt-4 max-w-[38rem]">{c.home.hero.lead}</p>
          <span className="mk-help-hero-glyph mk-still" aria-hidden="true">
            <Icon name="help" size={230} />
          </span>
          <HelpSearchForm locale={locale} />
        </div>

        {data.gettingStarted.length > 0 ? (
          <section aria-labelledby="help-start" className="mt-[clamp(2.5rem,5vw,4rem)]">
            <h2 id="help-start" className="mk-help-h2 mk-bidi">{c.home.gettingStarted.title}</h2>
            <p className="mk-bidi mt-2 text-[length:var(--fs-ui)] text-[var(--text-muted)]">
              {c.home.gettingStarted.lead}
            </p>
            <ul className="mk-seq mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.gettingStarted.map((card) => (
                <li key={card.id} className="flex">
                  <ArticleRow locale={locale} card={card} withSummary />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {topics.length > 0 ? (
          <section aria-labelledby="help-topics" className="mt-[clamp(2.5rem,5vw,4rem)]">
            <h2 id="help-topics" className="mk-help-h2 mk-bidi">{c.home.categories.title}</h2>
            <ul className="mk-seq mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((cat) => (
                <li key={cat.id} className="flex">
                  <CategoryTile locale={locale} category={cat} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-[clamp(2rem,4vw,3rem)] lg:grid-cols-2">
          <ArticleColumn id="help-popular" title={c.home.popular.title} locale={locale} cards={data.popular} />
          <ArticleColumn id="help-recent" title={c.home.recent.title} locale={locale} cards={data.recent} />
        </div>

        <ContactFallback locale={locale} />
      </Section>
    </>
  );
}

export function HelpSearchForm({ locale, query = "" }: { locale: Locale; query?: string }) {
  const c = HELP_COPY[locale].home.search;
  return (
    <form role="search" action={localeHref(locale, "/help/search")} method="get" className="mk-help-search mk-help-search-lg mk-load-move">
      <label htmlFor="help-q" className="mk-sr-only">
        {c.label}
      </label>
      <Icon name="scan" size={18} className="flex-none text-[var(--text-faint)]" />
      <input
        id="help-q"
        name="q"
        type="search"
        defaultValue={query}
        required
        maxLength={200}
        autoComplete="off"
        enterKeyHint="search"
        placeholder={c.placeholder}
        className="mk-bidi"
      />
      <button type="submit" className="mk-btn mk-btn-sm mk-solid flex-none">
        {c.submit}
      </button>
    </form>
  );
}

function CategoryTile({ locale, category }: { locale: Locale; category: HelpCategory }) {
  const c = HELP_COPY[locale];
  return (
    <Link href={localeHref(locale, helpPath(category.slug))} className="mk-help-tile mk-help-topic group">
      <span className="mk-help-tile-icon" aria-hidden="true">
        <Icon name={categoryIcon(category.icon)} size={18} />
      </span>
      <span className="min-w-0">
        <span className="mk-bidi block text-[length:var(--fs-ui)] font-medium text-[var(--text)] mk-underline-reveal">
          {category.title}
        </span>
        {category.description ? (
          <span className="mk-bidi mt-1 block text-[length:var(--fs-eyebrow)] leading-[1.5] text-[var(--text-muted)] line-clamp-2">
            {category.description}
          </span>
        ) : null}
        <span className="mk-bidi mt-1 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          {c.count.articles(category.articleCount)}
        </span>
      </span>
    </Link>
  );
}

function ArticleColumn({ id, title, locale, cards }: { id: string; title: string; locale: Locale; cards: HelpCard[] }) {
  if (cards.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mk-help-h2 mk-bidi">{title}</h2>
      <ul className="mk-seq mt-5 grid gap-3">
        {cards.map((card) => (
          <li key={card.id} className="flex">
            <ArticleRow locale={locale} card={card} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ArticleRow({ locale, card, withSummary = false }: { locale: Locale; card: HelpCard; withSummary?: boolean }) {
  const c = HELP_COPY[locale];
  const meta = [card.categoryTitle, c.articleType[card.type]].filter(Boolean).join(" · ");
  return (
    <Link href={localeHref(locale, helpPath(card.categorySlug, card.slug))} className="mk-help-row group">
      <span className="min-w-0">
        <span className="mk-bidi block text-[length:var(--fs-ui)] leading-[1.5] font-medium text-[var(--text)] mk-underline-reveal">
          {card.title}
        </span>
        {withSummary && card.summary ? (
          <span className="mk-bidi mt-1.5 block text-[length:var(--fs-eyebrow)] leading-[1.5] text-[var(--text-muted)] line-clamp-2">
            {card.summary}
          </span>
        ) : null}
        <span className="mk-bidi mt-1.5 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{meta}</span>
      </span>
      <Icon name="chevron" size={14} className="mk-help-row-mark" />
    </Link>
  );
}

export function ContactFallback({ locale }: { locale: Locale }) {
  const c = HELP_COPY[locale].home.contact;
  return (
    <aside aria-labelledby="help-contact" className="mk-help-contact mt-[clamp(2.5rem,5vw,4rem)]">
      <span className="mk-help-tile-icon" aria-hidden="true">
        <Icon name="commentDots" size={18} />
      </span>
      {/* Grows from 16rem, so on a phone the button wraps under the text
          instead of squeezing it into a column. */}
      <div className="min-w-0 flex-[1_1_16rem]">
        <h2 id="help-contact" className="mk-bidi text-[length:var(--fs-h3)] font-medium text-[var(--text)]">
          {c.title}
        </h2>
        <p className="mk-bidi mt-1 text-[length:var(--fs-ui)] text-[var(--text-muted)]">{c.body}</p>
      </div>
      <Link href={localeHref(locale, "/contact?topic=support")} className="mk-btn mk-solid flex-none">
        {c.action}
      </Link>
    </aside>
  );
}
