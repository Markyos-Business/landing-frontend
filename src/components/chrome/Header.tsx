import Link from "next/link";
import type { NavCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Logo } from "@/components/brand/Logo";
import { LangSwitch } from "./LangSwitch";
import { Nav } from "./nav";
import { MobileNav } from "./MobileNav";
import { Spark } from "@/components/ui/Spark";

/*
 * The header.
 *
 * Four items plus a CTA: Solutions, Platform, Pricing, Resources. The first
 * two used to be "For studios" and "For companies"; they are now two of the
 * three audience columns inside Solutions, which also made room for
 * freelancers — who sign up as a Studio workspace but buy for a different
 * reason, and who had nowhere to be named before. See
 * `markyos_solutions_menu.md` §1.1 and §3.4.
 *
 * The nav sits immediately after the logo rather than centred in the bar,
 * which is where the design reference puts it. The difference matters more
 * than it sounds: a centred nav reads as a site with equal destinations, and
 * a nav anchored to the logo reads as a product with a way in.
 *
 * Three client islands and nothing else: the two dropdowns (Nav), the phone
 * menu (MobileNav), and the language switch, which needs the current path so
 * it can offer the same page in the other language. Everything around them is
 * server-rendered.
 */

export function Header({ copy, locale }: { copy: NavCopy; locale: Locale }) {
  return (
    /*
     * Opaque, and deliberately not blurred.
     *
     * It used to be `color-mix(... 85%, transparent)` with `backdrop-blur`,
     * which the design system does not have: the header is flat `--canvas`
     * with a 10% rule under it. It also broke the phone menu, which is the
     * reason it can never come back: `backdrop-filter` makes an
     * element the containing block for its `position: fixed` descendants, so
     * the panel below was being sized against a 56px-tall header instead of
     * the viewport and collapsed to nothing. Found by opening the menu.
     */
    <header className="sticky top-0 z-50 bg-[var(--canvas)] shadow-[inset_0_-1px_0_var(--hairline-strong)]">
      {/*
       * `gap-3` under lg, where there is no nav to separate from the logo.
       *
       * At 375 the English bar laid out the lockup, the language switch,
       * "Start free" and the menu button into 383px — 8px past the viewport,
       * so the whole page scrolled sideways. Arabic fits at the same gap
       * because «ابدأ مجاناً» is narrower than "Start free"; this is the
       * second time a header breakpoint has been set on the Arabic page and
       * been wrong on the English one, which is why both are measured now.
       */}
      <div className="mk-container flex h-[var(--mk-header-h)] items-center gap-3 lg:gap-7">
        <Link
          href={localeHref(locale, "/")}
          className="flex shrink-0 items-center"
          aria-label="Markyos"
        >
          {/* Masked `currentColor`, so the mark takes the header's ink.
              `locale` picks the Arabic lockup on Arabic pages — different
              artwork, not a mirrored copy (§12). The link already carries
              the label, so the image does not repeat it. */}
          <Logo locale={locale} height={24} className="text-[var(--text)]" title="" />
        </Link>

        {/*
         * `-mx-3` cancels the padding the triggers carry for their hover
         * target, so the first nav item still lines up with the logo.
         *
         * `lg`, not `md`. At exactly 768 the English header laid out four nav
         * items, the language switch, "Log in" and "Start free" into 9px more
         * than the viewport, and the page gained a horizontal scrollbar.
         * Arabic fits because its words are shorter — which is the whole
         * reason a breakpoint chosen on the Arabic page cannot be trusted
         * until the English one is measured. 768–1023 uses the phone menu.
         */}
        <nav aria-label="Main" className="-mx-3 hidden lg:block">
          <Nav items={copy.items} locale={locale} />
        </nav>

        {/* `ms-auto` and not `ml-auto`: in Arabic this group sits on the left,
            and a physical margin would pin it to the wrong edge. */}
        <div className="ms-auto flex items-center gap-2.5 sm:gap-4">
          {/* Hidden below 360px, where the bar cannot hold four things — see the
              note on the row's gap. The phone menu carries it there.
              `max-[22.5rem]` is `width < 360`, not `<= 360`: Tailwind v4's
              `max-*` is exclusive, which is why a 22rem bound left exactly
              352px — a real viewport — still overflowing. */}
          <span className="max-[22.5rem]:hidden">
            <LangSwitch locale={locale} label={copy.languageLabel} />
          </span>

          <Link
            href="/login"
            prefetch={false}
            className="mk-bidi hidden py-1 text-[length:var(--fs-ui)] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] lg:block"
          >
            {copy.login}
          </Link>

          {/* The standing ask, and the only lit thing in the header. */}
          <Spark>
            <Link href="/start" prefetch={false} className="mk-btn mk-btn-sm mk-solid">
              <span className="mk-bidi">{copy.startFree}</span>
            </Link>
          </Spark>

          <MobileNav copy={copy} locale={locale} />
        </div>
      </div>
    </header>
  );
}
