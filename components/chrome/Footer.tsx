import Link from "next/link";
import type { FooterCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Logo } from "@/components/brand/Logo";

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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <Link
            href={localeHref(locale, "/")}
            aria-label="Markyos"
            className="flex items-start"
          >
            <Logo className="h-4 w-auto text-[var(--text)]" />
          </Link>

          {copy.columns.map((column) => (
            <nav key={column.heading} aria-labelledby={`footer-${column.heading}`}>
              <h2
                id={`footer-${column.heading}`}
                className="mk-bidi mb-5 text-[length:var(--fs-ui)] font-medium text-[var(--text)]"
              >
                {column.heading}
              </h2>
              <ul className="space-y-3.5">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <Link
                      href={localeHref(locale, link.href)}
                      className="mk-bidi text-[length:var(--fs-ui)] font-medium text-[var(--text)] transition-colors hover:text-[var(--accent-text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mk-bidi text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{copy.line}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {copy.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={localeHref(locale, link.href)}
                  className="mk-bidi text-[length:var(--fs-eyebrow)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
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
