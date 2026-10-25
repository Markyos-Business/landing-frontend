import Link from "next/link";
import type { Cta } from "@/content/types";
import { isAppHandoff, localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Arrow, Icon } from "./Icon";

/*
 * The CTA.
 *
 * Every call to action on this site is a link, never a <button>: each one
 * navigates, and a button that navigates breaks middle-click, cmd-click and
 * "copy link address" for no gain.
 *
 * Three variants, matching the three weights the reference actually uses:
 *
 *   solid    the light pill — the primary ask. Both hero CTAs are solid,
 *            because the page offers two doors of equal weight (copy doc
 *            §1.4) and making one louder tells half the audience they are the
 *            wrong half.
 *   outline  a card's own surface with a card's own edge. What a CTA *inside*
 *            a card wears, so it belongs to the card rather than competing
 *            with the hero from halfway down the page.
 *   link     amber text and an arrow. "Compare all plans", "See the full
 *            roadmap" — a way out of a section, not an ask.
 *
 * The arrow is part of the component rather than part of the copy, because it
 * has to flip in Arabic and a glyph pasted into a string will not.
 */

type Variant = "solid" | "outline" | "link";

const VARIANTS: Record<Variant, string> = {
  solid: "mk-btn mk-solid",
  outline: "mk-btn mk-outline",
  link:
    "inline-flex items-center gap-1.5 text-sm font-medium " +
    "text-[var(--accent-text)] hover:underline underline-offset-4",
};

export function Button({
  cta,
  locale,
  variant = "solid",
  size = "md",
  arrow = true,
  className = "",
}: {
  cta: Cta;
  locale: Locale;
  variant?: Variant;
  size?: "md" | "sm";
  /** Off for a CTA that is a destination rather than a step forward. */
  arrow?: boolean;
  className?: string;
}) {
  const sizing = variant !== "link" && size === "sm" ? " mk-btn-sm" : "";

  return (
    <Link
      href={localeHref(locale, cta.href)}
      // A link that redirects off-site cannot be prefetched usefully; see
      // isAppHandoff.
      prefetch={isAppHandoff(cta.href) ? false : undefined}
      className={`${VARIANTS[variant]}${sizing} ${className}`}
    >
      {/* `mk-bidi`: a CTA label is one standalone string, and until the Arabic
          is written it is an English one sitting in an RTL page. */}
      <span className="mk-bidi">{cta.label}</span>
      {arrow ? <Arrow size={variant === "link" ? 14 : 16} /> : null}
    </Link>
  );
}

/**
 * The hero's "See how it works for you" — a quiet pill with a downward
 * chevron that scrolls rather than navigates.
 *
 * Separate from Button because the affordance is different: the chevron says
 * "further down this page", where an arrow says "somewhere else".
 */
export function ScrollCta({ cta, locale }: { cta: Cta; locale: Locale }) {
  return (
    <Link
      href={localeHref(locale, cta.href)}
      prefetch={isAppHandoff(cta.href) ? false : undefined}
      className="mk-btn mk-outline mk-btn-sm"
    >
      <span className="mk-bidi">{cta.label}</span>
      <Icon name="chevron" size={14} className="flex-none" />
    </Link>
  );
}
