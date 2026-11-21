"use client";

import { useEffect, useState } from "react";

/*
 * The clock on a dated offer.
 *
 * ── Why nothing is computed on the server ────────────────────────────────
 *
 * Every other number on this site is the same number for everybody. This one
 * is a difference between two clocks, and the server's is not the reader's.
 * Rendering "40 days 06:12:33" on the server means shipping HTML that is
 * already stale by the time it is read, and hydrating it against a client
 * that computes something else — which React resolves by throwing the
 * server's markup away and warning about it.
 *
 * So the server renders `fallback`: the offer's two dates, as a sentence.
 * That is the honest static form of "there is a deadline" — it is crawlable,
 * it is what a reader with no JavaScript gets, and it does not rot. The timer
 * replaces it on mount, from the reader's own clock.
 *
 * ── Why it takes itself down ─────────────────────────────────────────────
 *
 * These pages are statically generated. A build from December would otherwise
 * still be advertising the offer in March, because nothing re-renders a
 * static page when a date passes. `phase` is recomputed every tick, so the
 * moment the reader's clock passes `closes` the countdown stops being a
 * countdown and `onEnded` lets the block around it say so instead. The one
 * state that cannot correct itself is no-JavaScript, and that state shows a
 * sentence with an end date in it rather than a promise about time left.
 *
 * ── Why four cells and not a sentence ────────────────────────────────────
 *
 * Arabic inflects a counted noun three ways — يوم, يومان, أيام — and a
 * sentence built by concatenation gets it wrong twice out of three. A column
 * of figure-over-unit never inflects in either language, needs no plural
 * rules, and is what a countdown looks like anyway. The unit labels come from
 * the content file for the same reason every other string does.
 */

type Phase = "before" | "during" | "after";

export type CountdownCopy = {
  before: string;
  during: string;
  after: string;
  units: { days: string; hours: string; minutes: string; seconds: string };
};

function phaseOf(now: number, opens: number, closes: number): Phase {
  if (now < opens) return "before";
  if (now > closes) return "after";
  return "during";
}

export function Countdown({
  opens,
  closes,
  copy,
  fallback,
  compact = false,
  onEnded,
}: {
  opens: string;
  closes: string;
  copy: CountdownCopy;
  /** What the server renders, and what a reader without JavaScript keeps. */
  fallback: string;
  /** The homepage strip: one line, no cells. */
  compact?: boolean;
  /** Told once the window has closed, so the block can replace itself. */
  onEnded?: () => void;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const opensAt = Date.parse(opens);
    const closesAt = Date.parse(closes);
    /* A malformed instant must not render NaN at a reader. Leaving `now`
       null keeps the fallback sentence, which is still true. */
    if (Number.isNaN(opensAt) || Number.isNaN(closesAt)) return;

    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [opens, closes]);

  const opensAt = Date.parse(opens);
  const closesAt = Date.parse(closes);
  const phase = now === null ? null : phaseOf(now, opensAt, closesAt);

  useEffect(() => {
    if (phase === "after") onEnded?.();
  }, [phase, onEnded]);

  /*
   * The first client render is deliberately the server's render.
   *
   * `now` is null until the effect runs, so phase is null and this is the
   * same fallback the server sent — which is why there is no
   * `suppressHydrationWarning` here and should not be one. Reaching for that
   * would hide exactly the mismatch this null state exists to avoid.
   */
  if (phase === null) {
    return <p className="mk-bidi mk-offer-window">{fallback}</p>;
  }

  if (phase === "after") {
    return <p className="mk-bidi mk-offer-window">{copy.after}</p>;
  }

  const target = phase === "before" ? opensAt : closesAt;
  const left = Math.max(0, target - (now as number));
  const seconds = Math.floor(left / 1000);
  const cells: [number, string][] = [
    [Math.floor(seconds / 86400), copy.units.days],
    [Math.floor(seconds / 3600) % 24, copy.units.hours],
    [Math.floor(seconds / 60) % 60, copy.units.minutes],
    [seconds % 60, copy.units.seconds],
  ];

  /*
   * One live region, not four.
   *
   * `aria-live` on a seconds counter would announce a new number every
   * second, which is unusable. The figures are `aria-hidden` and the whole
   * thing carries a single static label naming what the clock is for; a
   * screen-reader user gets the deadline from `fallback`'s sentence, which
   * is still in the markup above on /pricing.
   */
  return (
    <div className={compact ? "mk-offer-clock mk-offer-clock-sm" : "mk-offer-clock"}>
      <span className="mk-bidi mk-offer-clock-label">
        {phase === "before" ? copy.before : copy.during}
      </span>
      <span className="mk-offer-cells" aria-hidden="true">
        {cells.map(([value, unit]) => (
          <span key={unit} className="mk-offer-cell">
            {/* `dir="ltr"`: a two-digit figure is a number in both editions,
                and a counter that reorders its own digits in Arabic is the
                bug this site's `.mk-bidi` exists to prevent. */}
            <b dir="ltr">{String(value).padStart(2, "0")}</b>
            <small className="mk-bidi">{unit}</small>
          </span>
        ))}
      </span>
    </div>
  );
}
