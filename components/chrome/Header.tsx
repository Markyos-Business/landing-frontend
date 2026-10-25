import Link from "next/link";
import type { NavCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Logo } from "@/components/brand/Logo";
import { LangSwitch } from "./LangSwitch";
import { Nav } from "./Nav";
import { MobileNav } from "./MobileNav";

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
      <div className="mk-container flex h-[var(--mk-header-h)] items-center gap-7">
        <Link
          href={localeHref(locale, "/")}
          className="flex shrink-0 items-center"
          aria-label="Markyos"
        >
          {/* Inline, so the mark inherits the header's text colour. The
              source SVG declares no fill and would otherwise render black on
              a near-black header. */}
          <Logo className="h-4 w-auto text-[var(--text)]" />
        </Link>

        {/* `-mx-3` cancels the padding the triggers carry for their hover
            target, so the first nav item still lines up with the logo. */}
        <nav aria-label="Main" className="-mx-3 hidden md:block">
          <Nav items={copy.items} locale={locale} />
        </nav>

        {/* `ms-auto` and not `ml-auto`: in Arabic this group sits on the left,
            and a physical margin would pin it to the wrong edge. */}
        <div className="ms-auto flex items-center gap-4">
          <LangSwitch locale={locale} label={copy.languageLabel} />

          <Link
            href="/login"
            prefetch={false}
            className="mk-bidi hidden text-[length:var(--fs-ui)] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] md:block"
          >
            {copy.login}
          </Link>

          <Link href="/start" prefetch={false} className="mk-btn mk-btn-sm mk-solid">
            <span className="mk-bidi">{copy.startFree}</span>
          </Link>

          <MobileNav copy={copy} locale={locale} />
        </div>
      </div>
    </header>
  );
}
