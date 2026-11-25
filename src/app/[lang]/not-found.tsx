import Link from "next/link";
import { getLocale } from "@/lib/i18n/dictionary";
import { localeHref } from "@/lib/i18n/href";
import { NOT_FOUND_COPY as COPY } from "@/content/not-found";
import { Eyebrow, Glow, Section } from "@/components/ui";

/*
 * 404, inside the locale.
 *
 * It renders within the locale layout, so it keeps the header, the footer and
 * the right writing direction — which matters more here than on most pages: a
 * reader who lands on a broken Arabic URL and gets a left-to-right English
 * error page has been told the bilingual claim is not true.
 *
 * Copy from docs/copy/pages_ar_4_signup_legal.md page 31. Its one job is to
 * get the visitor somewhere useful in one click, which is why it offers four
 * destinations rather than only the homepage: somebody who mistyped a
 * solutions URL wants the solutions hub, not the top of the site.
 */


export default async function NotFound() {
  const locale = await getLocale();
  const copy = COPY[locale];

  return (
    <Section id="not-found" labelledBy="not-found-heading" className="relative overflow-clip">
      <Glow className="mk-center-x -top-24 w-[min(48rem,110%)]" />
      <div className="mk-measure relative py-12">
        <Eyebrow>404</Eyebrow>
        <h1 id="not-found-heading" className="mk-h2 mk-bidi mt-4">
          {copy.title}
        </h1>
        <p className="mk-lead mk-bidi mt-5">{copy.body}</p>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={localeHref(locale, "/")} className="mk-btn mk-solid">
            <span className="mk-bidi">{copy.home}</span>
          </Link>

          {copy.links.map((link) => (
            <Link
              key={link.href}
              href={localeHref(locale, link.href)}
              className="mk-bidi text-sm font-medium text-[var(--accent-text)] mk-underline-reveal underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
