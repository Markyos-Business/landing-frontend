import Link from "next/link";
import type { FooterCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { FooterLogo } from "./FooterLogo";

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
      <div className="mk-container mk-rule py-11 sm:py-14">
        {/*
         * Two columns on a phone, not one.
         *
         * It was `grid gap-10 sm:grid-cols-2 lg:grid-cols-5`, so below 640px
         * the whole footer was a single tower: the mark, then four stacked
         * navs, 40px apart, each heading 20px clear of its links. Measured at
         * 375px it came to **1164px** -- one and a half phone viewports of
         * footer -- and because the links are short Arabic words set to the
         * start edge, roughly half the width of every one of those 1164 pixels
         * was empty. That is the "big white space": not a gap anybody added,
         * but a one-column layout holding two-word links.
         *
         * Two columns fill the measure and halve the height. The gaps split --
         * 24px across, 36px down -- because a column gap is separating two
         * lists side by side and a row gap is separating two groups, and the
         * single `gap-10` was being asked to be both.
         */}
        {/*
         * Six columns at `lg`, not five, because the mark now takes two.
         *
         * The traced lockup is 56px tall, which is 231px wide in Arabic and
         * 290px in English -- and a fifth of this grid is 180px at 1440 and
         * 162px at 1024. It overflowed its own cell at both. Two of six is
         * 327px, which holds the wider English lockup with room, and leaves
         * the four link columns 143px each: still wider than the 148px they
         * get on a phone, where every label already fits.
         */}
        <div className="mk-seq mk-seq-end grid grid-cols-2 gap-x-6 gap-y-9 sm:gap-10 lg:grid-cols-6">
          {/*
           * The mark spans the row rather than sitting in half of it with an
           * empty half beside it. One column again at `lg`, where it is the
           * first of five.
           *
           * `FooterLogo` is the lockup with its outline traced and its anchor
           * points animated over it -- the real SVG underneath, a canvas on
           * top, the same shape in the same colour at rest. It is a client
           * component and the only one in this footer; everything else here
           * stays server-rendered.
           */}
          <FooterLogo locale={locale} />

          {copy.columns.map((column) => (
            <nav key={column.heading} aria-labelledby={`footer-${column.heading}`}>
              <h2
                id={`footer-${column.heading}`}
                className="mk-bidi mb-3 text-[length:var(--fs-ui)] font-medium text-[var(--text)] sm:mb-5"
              >
                {column.heading}
              </h2>
              {/* The padding below adds 14px to each link and the spacing
                  drops by the same, so the column looks identical and every
                  link is a 33px target instead of a 19px one. A 44px target
                  would overlap its neighbour on this pitch — see `.mk-tap`
                  in tailwind/. */}
              <ul className="space-y-0">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <Link
                      href={localeHref(locale, link.href)}
                      /* Blue on hover, not `--accent-text`.
                         `--accent-text` is oklch(0.968 ...) -- near-white,
                         the same ink the link already sits in -- so these
                         had a `transition-colors` and nothing to transition
                         to. `--mk-blue-ink` is the accent solved for a dark
                         ground, which is what the rest of the site hovers
                         links to. */
                      className="mk-bidi block [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:py-3 py-[0.4375rem] text-[length:var(--fs-ui)] font-medium text-[var(--text)] transition-colors hover:text-[var(--mk-blue-ink)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mk-rise mk-rise-end mt-10 flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
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
                  className="mk-bidi mk-tap block py-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)] transition-colors hover:text-[var(--mk-blue-ink)]"
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
