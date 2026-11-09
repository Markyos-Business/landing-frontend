import Link from "next/link";
import type { FooterCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Logo } from "@/components/ui";

/*
 * The footer.
 *
 * Five columns: the mark, then Product, For, Resources, Company. The brand
 * line closes it — "Markyos. Every asset. Every instruction. Both
 * directions." — which is the same line as the hero's eyebrow, deliberately,
 * so the page ends on the claim it opened with rather than on a sitemap.
 *
 * The links are set in full white and the legal row under them in grey. That
 * is the reference's ordering and it is the right way round: the four columns
 * are navigation somebody came here to use, and the privacy and terms links
 * are an obligation that has to be present and does not have to compete.
 *
 * Every column heading is a real heading, so the footer's four link groups are
 * navigable as a list rather than as sixteen loose links.
 */

export function Footer({ copy, locale }: { copy: FooterCopy; locale: Locale }) {
  return (
    <footer>
      <div className="mk-container mk-rule py-14">
        <div className="mk-seq mk-seq-end grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <Link
            href={localeHref(locale, "/")}
            aria-label="Markyos"
            className="flex items-start"
          >
            <Logo locale={locale} height={22} className="text-[var(--text)]" title="" />
          </Link>

          {copy.columns.map((column) => (
            <nav key={column.heading} aria-labelledby={`footer-${column.heading}`}>
              <h2
                id={`footer-${column.heading}`}
                className="mk-bidi mb-5 text-[length:var(--fs-ui)] font-medium text-[var(--text)]"
              >
                {column.heading}
              </h2>
              {/* The padding below adds 14px to each link and the spacing
                  drops by the same, so the column looks identical and every
                  link is a 33px target instead of a 19px one. A 44px target
                  would overlap its neighbour on this pitch — see `.mk-tap`
                  in globals.css. */}
              <ul className="space-y-0">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <Link
                      href={localeHref(locale, link.href)}
                      className="mk-bidi block py-[0.4375rem] text-[length:var(--fs-ui)] font-medium text-[var(--text)] transition-colors hover:text-[var(--accent-text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mk-rise mk-rise-end mt-14 flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mk-bidi text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{copy.line}</p>
          {/* 24px apart and 24px tall, so the legal row satisfies WCAG
              2.5.8 with a mouse too — `.mk-tap` only grows the hit area on a
              coarse pointer, and at 16px tall with a 20px gap these were the
              page's only remaining target failure at desktop. */}
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {copy.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={localeHref(locale, link.href)}
                  className="mk-bidi mk-tap block py-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
