import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { Section } from "@/components/ui";

/*
 * The English edition of something written only in Arabic.
 *
 * Arabic is the primary edition and English is translated from it, so this is
 * the honest answer for the twenty-seven subpages and for every article in
 * the blog, the guides and the help centre.
 *
 * It is a notice and not a 404, and that is the whole reason it exists: the
 * language switch sits in the header of every page, so a 404 here would be
 * one click away everywhere and would read as a broken site rather than as an
 * unfinished translation. It was a 404 on the article pages until driving the
 * site caught the switcher prefetching one.
 *
 * Always `noindex`, and the page it belongs to declares `hreflang` for Arabic
 * only — so a crawler is never told an English page exists and is thin.
 *
 * Written in English on purpose: it is the English edition of the page, and
 * the person reading it asked for English.
 */

export function NotTranslated({
  locale,
  path,
  name,
  /** Where English *does* have something — a collection index, usually. */
  fallback,
}: {
  locale: Locale;
  /** The Arabic page this stands in for. */
  path: string;
  name: string;
  fallback?: { label: string; href: string };
}) {
  return (
    <Section className="pt-[clamp(4rem,10vw,7rem)]">
      <div className="mk-measure">
        <p className="mk-eyebrow mk-eyebrow-accent">Arabic only, for now</p>
        {/*
         * The name is the Arabic page's own title, sitting in a document
         * declared `lang="en"`. Without `lang` and `dir` here it inherited
         * English: a screen reader pronounced Arabic with an English voice,
         * and the heading was set in Inter rather than the Arabic face.
         * CLAUDE.md asks for exactly this on any standalone string that may
         * be either language.
         */}
        <h1 className="mk-h2 mt-4" lang={DEFAULT_LOCALE} dir="rtl">
          {name}
        </h1>
        <p className="mk-lead mt-5">
          This page is written in Arabic and has not been translated yet. Markyos is built
          Arabic-first, and the English edition follows.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={localeHref(DEFAULT_LOCALE, path)}
            hrefLang={DEFAULT_LOCALE}
            lang={DEFAULT_LOCALE}
            className="mk-btn mk-solid"
          >
            {/* The Arabic face explicitly: this string sits in an otherwise
                English, left-to-right page, so it does not inherit it. */}
            <span style={{ fontFamily: "var(--font-arabic)" }} dir="rtl">
              اقرأ الصفحة بالعربية
            </span>
          </Link>

          {fallback ? (
            <Link
              href={localeHref(locale, fallback.href)}
              className="mk-tap inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-text)] mk-underline-reveal underline-offset-4"
            >
              {fallback.label}
            </Link>
          ) : null}

          <Link
            href={localeHref(locale, "/")}
            className="mk-tap inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-text)] mk-underline-reveal underline-offset-4"
          >
            English homepage
          </Link>
        </div>
      </div>
    </Section>
  );
}
