import Link from "next/link";
import type { HelpCategoryPage } from "@/lib/content/help";
import { helpPath } from "@/lib/content/help";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon, Section } from "@/components/ui";
import { HELP_COPY } from "./copy";
import { ArticleRow, ContactFallback, HelpSearchForm } from "./HelpHome";
import { categoryIcon } from "./icons";

/*
 * One topic: its articles, then each subcategory's, under a breadcrumb back
 * to the home. The search stays at the top, because a reader who picked the
 * wrong topic should not have to go back to find the field.
 */
export function HelpCategoryView({ locale, page }: { locale: Locale; page: HelpCategoryPage }) {
  const c = HELP_COPY[locale];
  const empty = page.articles.length === 0 && page.subcategories.every((s) => s.articles.length === 0);

  return (
    <Section className="pt-[clamp(1.5rem,4vw,2.5rem)]">
      <nav aria-label={c.category.breadcrumb} className="mk-bidi text-[length:var(--fs-ui)] text-[var(--text-muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={localeHref(locale, "/help")} className="mk-help-crumb">
              {c.category.breadcrumb}
            </Link>
          </li>
          {page.parent ? (
            <li className="flex items-center gap-2">
              <Icon name="chevron" size={12} className="mk-help-row-mark" />
              <Link href={localeHref(locale, helpPath(page.parent.slug))} className="mk-help-crumb">
                {page.parent.title}
              </Link>
            </li>
          ) : null}
        </ol>
      </nav>

      <header className="mt-5 flex items-start gap-4">
        <span className="mk-help-tile-icon mk-help-tile-icon-lg" aria-hidden="true">
          <Icon name={categoryIcon(page.icon)} size={22} />
        </span>
        <div className="min-w-0">
          <h1 className="mk-h2-lg mk-bidi">{page.title}</h1>
          {page.description ? <p className="mk-lead mk-bidi mt-3 max-w-[40rem]">{page.description}</p> : null}
          <p className="mk-bidi mt-2 text-[length:var(--fs-ui)] text-[var(--text-muted)]">{c.count.articles(page.articleCount)}</p>
        </div>
      </header>

      <HelpSearchForm locale={locale} />

      {empty ? <p className="mk-bidi mt-8 text-[var(--text-muted)]">{c.category.empty}</p> : null}

      {page.articles.length > 0 ? (
        <ul className="mk-seq mt-8 grid gap-3 md:grid-cols-2">
          {page.articles.map((card) => (
            <li key={card.id} className="flex">
              <ArticleRow locale={locale} card={card} withSummary />
            </li>
          ))}
        </ul>
      ) : null}

      {page.subcategories
        .filter((sub) => sub.articles.length > 0)
        .map((sub) => (
          <section key={sub.id} aria-labelledby={`help-sub-${sub.id}`} className="mt-[clamp(2rem,4vw,3rem)]">
            <h2 id={`help-sub-${sub.id}`} className="mk-help-h2 mk-bidi">
              <Link href={localeHref(locale, helpPath(sub.slug))} className="mk-help-crumb">
                {sub.title}
              </Link>
            </h2>
            <ul className="mk-seq mt-5 grid gap-3 md:grid-cols-2">
              {sub.articles.map((card) => (
                <li key={card.id} className="flex">
                  <ArticleRow locale={locale} card={card} withSummary />
                </li>
              ))}
            </ul>
          </section>
        ))}

      <ContactFallback locale={locale} />
    </Section>
  );
}
