import Link from "next/link";
import type { AnnouncementCopy } from "@/content/types";
import { isBeta } from "@/lib/launch";
import { isAppHandoff, localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Arrow } from "@/components/ui/Icon";

/*
 * The announcement bar.
 *
 * Two versions of this copy exist and exactly one is true at a time. Which one
 * shows is read from the launch phase rather than decided here, so flipping
 * NEXT_PUBLIC_LAUNCH_PHASE on 15 Feb 2027 swaps it everywhere at once — the
 * bar, the hero's CTAs and every MVP chip — instead of someone editing three
 * files on launch morning.
 *
 * The beta copy's numbers (25 studios, 15 companies) are the real beta sizes.
 * That is the only reason the scarcity is allowed to be there.
 */

export function AnnouncementBar({
  copy,
  locale,
}: {
  copy: AnnouncementCopy;
  locale: Locale;
}) {
  const active = isBeta ? copy.beta : copy.live;

  return (
    <div className="border-b border-[var(--hairline)] bg-[var(--surface-0)]">
      <div className="mk-container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center text-[length:var(--fs-ui)]">
        {/* `mk-bidi` resolves each string's own direction, which still matters
            now the Arabic is written: the beta line carries Latin numerals and
            the live one may carry a product name. */}
        <span className="mk-bidi text-[var(--text-muted)]">{active.text}</span>
        <Link
          href={localeHref(locale, active.cta.href)}
          // In beta this points at /start, which redirects off-site. See
          // isAppHandoff: prefetching it costs a cross-origin request on every
          // page load and caches nothing.
          prefetch={isAppHandoff(active.cta.href) ? false : undefined}
          className="inline-flex items-center gap-1.5 font-medium text-[var(--accent-text)] hover:underline"
        >
          {/* The arrow is a component, not a glyph in the copy: it has to point
              the way the page reads, and in Arabic that is the other way. */}
          <span className="mk-bidi">{active.cta.label}</span>
          <Arrow size={13} />
        </Link>
      </div>
    </div>
  );
}
