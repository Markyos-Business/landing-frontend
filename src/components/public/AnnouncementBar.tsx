"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { OfferBarCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import { Countdown } from "@/components/features/offer/Countdown";
import { Icon } from "@/components/ui";

/*
 * The announcement bar.
 *
 * Copy deck v4.1 §1.1: full width, above the floating nav, centred, linking
 * to /pricing, on every page. It scrolls away with the page while the nav
 * stays sticky, which is what it does here for free -- the bar is in normal
 * flow *before* `.mk-site-header`, and the header is `position: sticky; top:
 * 0`, so the header pins to the viewport the moment the bar has scrolled
 * past and nothing has to compute an offset.
 *
 * ── Why this is not the pill that was removed ────────────────────────────
 *
 * v4.0 put the offer in an announcement pill above the hero headline. The
 * owner removed that pill on 19 Nov 2026, and it stays removed. v4.1 moved
 * the offer to this bar instead, which is a different object in a different
 * place: above the nav rather than inside the hero composition, on all
 * fifty-one pages rather than on the homepage, and dismissible.
 */

/*
 * Whether the bar is hidden, as an external store rather than as state.
 *
 * Both reasons to hide it are the reader's own and neither exists on the
 * server: the dismissal is in their browser and the expiry is on their
 * clock. The obvious shape -- `useState(null)` plus an effect that reads
 * both -- is a synchronous setState inside an effect, which React 19 flags
 * as a cascading render and which paints the bar for one frame before
 * removing it. For the first element on the page that frame is a layout
 * shift of the whole document, and the one that counts against CLS.
 *
 * `useSyncExternalStore` has a server snapshot, so the server renders
 * nothing, the first client render already knows the answer, and there is
 * no effect and no intermediate frame.
 */
let listeners: (() => void)[] = [];
/** Dismissed in this tab, before anything is written to storage. */
let dismissedHere: string | null = null;

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

function emit() {
  for (const l of listeners) l();
}

function isHidden(key: string, closes: string): boolean {
  if (dismissedHere === key) return true;
  /* Private windows, cleared site data and blocked storage all throw or
     return null here. None of them is a reason to hide an offer. */
  try {
    if (window.localStorage.getItem(key) === "1") return true;
  } catch {
    /* ignore */
  }
  /* A statically generated page does not re-render when a date passes, so
     the expiry is checked here, on the reader's clock, every render. The
     boolean is stable either side of the instant, which is what
     `getSnapshot` requires. */
  const closesAt = Date.parse(closes);
  return !Number.isNaN(closesAt) && Date.now() > closesAt;
}

export function AnnouncementBar({ copy, locale }: { copy: OfferBarCopy; locale: Locale }) {
  /*
   * Dismissal is keyed to the offer, not to the bar.
   *
   * The deck asks for the choice to be "remembered for that visitor until
   * the offer changes". Keying the stored value by the offer's closing
   * instant makes that literal: a new offer has a new close, so it does not
   * match what was stored and the bar comes back by itself. There is no
   * version number anybody has to remember to bump.
   */
  const key = `mk-offer-dismissed:${copy.closes}`;

  const hidden = useSyncExternalStore(
    subscribe,
    () => isHidden(key, copy.closes),
    /* The server renders no bar at all. */
    () => true,
  );

  if (hidden) return null;

  const dismiss = () => {
    dismissedHere = key;
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      /* Remembering is a convenience; not remembering is not a failure. */
    }
    emit();
  };

  return (
    <div className="mk-announce">
      <Link href={localeHref(locale, copy.link.href)} className="mk-announce-link">
        {/* Two wordings, one of them always hidden, rather than a measured
            width: the deck writes a separate short line for below 810px, and
            a width read in JavaScript would paint the wrong one first. */}
        <span className="mk-bidi mk-announce-long">{copy.label}</span>
        <span className="mk-bidi mk-announce-short">{copy.short}</span>
        <Countdown
          opens={copy.opens}
          closes={copy.closes}
          copy={copy.countdown}
          fallback={copy.window}
          compact
          /* The clock is what notices the window closing while somebody is
             sitting on the page. `isHidden` is already true by then; this
             only tells the store to ask again. */
          onEnded={emit}
        />
        {/*
         * The label, where the deck draws an arrow.
         *
         * §1.1 writes the bar as "Launch offer: 50% off your first three
         * months →". This site has no arrows: they came off every page on
         * 6 Nov 2026 because a label that says where it goes does not need
         * a picture saying "forward", and `.mk-arrow` -- the rule that used
         * to flip them for RTL -- went with them. An arrow added back here
         * would have pointed right on the Arabic page, which is the exact
         * failure that rule existed to prevent.
         *
         * So the affordance is the words. It is also the only part of the
         * bar that says what pressing it does, which the arrow never did.
         */}
        <span className="mk-bidi mk-announce-cta">{copy.link.label}</span>
      </Link>
      <button type="button" onClick={dismiss} className="mk-announce-close" aria-label={copy.close}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
