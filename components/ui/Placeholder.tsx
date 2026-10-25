import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { localeHref } from "@/lib/i18n/href";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { alternates } from "@/lib/seo";
import { notFound } from "next/navigation";

/*
 * A route that exists but has no copy yet.
 *
 * Every one of these is linked from the header or the footer on every page, so
 * the alternative to a placeholder is a 404 reachable from everywhere — which
 * is worse for a visitor and much worse for a crawler.
 *
 * Two properties make this honest rather than lazy:
 *
 *   `noindex`. An empty page in the index is a page that ranks for a term and
 *   then disappoints, which costs more than not ranking. The moment a page
 *   gets real copy it drops this component and becomes indexable.
 *
 *   It says what it is. No lorem, no invented feature list, no "exciting
 *   things coming" — the page states plainly that it is being written and
 *   sends the visitor somewhere useful.
 *
 * The page copy for these lives in markyos_site_architecture_and_copy.md, which
 * is written against the older /solutions information architecture. Resolving
 * that conflict is the open decision in docs/OPEN-DECISIONS.md, and it is why
 * these are placeholders rather than half-built pages.
 */

export function buildPlaceholderMetadata({
  locale,
  path,
  title,
}: {
  locale: Locale;
  path: string;
  title: string;
}): Metadata {
  return {
    title: `${title} — Markyos`,
    // Not indexable, and deliberately not described: there is nothing here to
    // describe yet, and a meta description written for a page that does not
    // exist is a promise made on the search results page.
    robots: { index: false, follow: true },
    alternates: alternates(locale, path),
  };
}

export async function resolvePlaceholderLocale(
  params: Promise<{ lang: string }>,
): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

export function Placeholder({
  locale,
  title,
  note,
}: {
  locale: Locale;
  title: string;
  /** One line on what will be here. Plain, specific, no hype. */
  note: string;
}) {
  return (
    <Section id="placeholder" labelledBy="placeholder-heading">
      <div className="mk-measure py-10">
        <h1 id="placeholder-heading" className="text-4xl font-medium leading-tight">
          {title}
        </h1>
        <p className="mt-6 text-lg text-[var(--text-muted)]">{note}</p>
        <p className="mt-8">
          <Link
            href={localeHref(locale, "/")}
            className="font-medium text-[var(--accent-text)] hover:underline"
          >
            Back to the homepage
          </Link>
        </p>
      </div>
    </Section>
  );
}
