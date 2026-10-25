import Link from "next/link";
import { getLocale } from "@/lib/i18n/dictionary";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Eyebrow, Glow, Section } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Icon";

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

const COPY: Record<
  Locale,
  { title: string; body: string; home: string; links: { label: string; href: string }[] }
> = {
  ar: {
    title: "هذه الصفحة غير موجودة.",
    body: "ربما تغيّر الرابط، أو لم تُنشر الصفحة بعد. لكن العلامة كلها هنا.",
    home: "العودة إلى الرئيسية",
    links: [
      { label: "الحلول", href: "/solutions" },
      { label: "الأسعار", href: "/pricing" },
      { label: "مركز المساعدة", href: "/help" },
    ],
  },
  en: {
    title: "That page is not here.",
    body: "The link may be old, or the page may not be written yet.",
    home: "Back to the homepage",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Pricing", href: "/pricing" },
      { label: "Help centre", href: "/help" },
    ],
  },
};

export default async function NotFound() {
  const locale = await getLocale();
  const copy = COPY[locale];

  return (
    <Section id="not-found" labelledBy="not-found-heading" className="relative overflow-hidden">
      <Glow className="start-1/2 top-0 w-[min(44rem,100%)] -translate-x-1/2 opacity-50" />
      <div className="mk-measure relative py-12">
        <Eyebrow>404</Eyebrow>
        <h1 id="not-found-heading" className="mk-h2 mk-bidi mt-4">
          {copy.title}
        </h1>
        <p className="mk-lead mk-bidi mt-5">{copy.body}</p>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={localeHref(locale, "/")} className="mk-btn mk-solid">
            <span className="mk-bidi">{copy.home}</span>
            <Arrow size={16} />
          </Link>

          {copy.links.map((link) => (
            <Link
              key={link.href}
              href={localeHref(locale, link.href)}
              className="mk-bidi text-sm font-medium text-[var(--accent-text)] underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
