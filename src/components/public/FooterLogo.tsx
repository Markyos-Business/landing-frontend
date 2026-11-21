"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { LOCKUP, Logo, LogoTrace, TRACE_INSET } from "@/components/ui";

/*
 * The footer's lockup, traced.
 *
 * ── What is on the page ──────────────────────────────────────────────────
 *
 * A canvas that traces `/brand/markyos-lockup{-ar}.svg` and animates the
 * anchor points along its outline, with the real `<Logo>` underneath as the
 * fallback — and only as the fallback. The two are not shown together: the
 * trace insets the artwork to leave room for the stroke and the nodes, which
 * are drawn outside the outline, so a logo filling the same box is a second,
 * larger copy of the same mark and the pair reads as a printing fault. That
 * is exactly what the first build looked like.
 *
 * So `onReady` fires on the first frame that paints and the fallback goes.
 * Until then — no JavaScript, a failed fetch, a server render, a canvas the
 * browser will not give us — the footer shows the lockup and nothing is
 * missing. The trace draws the letters filled in `--text`, which is what the
 * fallback was drawing, so the swap is not a visible change of state.
 *
 * ── Size ─────────────────────────────────────────────────────────────────
 *
 * The lockup was 22px tall here. The effect cannot say anything at 22px: its
 * anchors land a few device pixels apart and are drawn at a radius scaled
 * from the artwork's height, so they are a grey fuzz along the edge rather
 * than points on a path. 56px is where they separate.
 *
 * The stage is bigger than the lockup by `TRACE_INSET`, because that is the
 * margin the nodes live in. Both numbers come from the component rather than
 * being repeated here: when the inset changes, this box changes with it.
 *
 * §12's floor is a 120px-wide lockup, which the Arabic ratio puts at 30px
 * tall — so 56px is comfortably above it.
 *
 * ── The drag guard ───────────────────────────────────────────────────────
 *
 * The nodes can be dragged, and the lockup is a link to the homepage. Those
 * two facts fight: a drag that ends inside the box is a click as far as the
 * anchor is concerned, so pulling a node and letting go navigated away. The
 * guard is the usual one — remember where the pointer went down, and if it
 * has travelled more than a few pixels by the time it comes up, that was a
 * drag and the click is cancelled.
 *
 * 6px rather than 0: a plain click on a trackpad moves a pixel or two, and a
 * logo that refuses to be clicked is worse than one that occasionally
 * navigates.
 */

/** The lockup's own height, as drawn. The stage around it is larger. */
const DRAWN = 56;
const DRAG_SLOP = 6;

export function FooterLogo({ locale }: { locale: Locale }) {
  const down = useRef<{ x: number; y: number } | null>(null);
  const [traced, setTraced] = useState(false);
  const lockup = LOCKUP[locale === "ar" ? "ar" : "en"];

  /* The stage, sized so the artwork inside it lands at exactly `DRAWN`. */
  const stage = {
    blockSize: Math.round(DRAWN / TRACE_INSET.y),
    inlineSize: Math.round((DRAWN * lockup.ratio) / TRACE_INSET.x),
  };

  return (
    <Link
      href={localeHref(locale, "/")}
      aria-label="Markyos"
      className="col-span-2 flex items-start"
      onPointerDown={(e) => {
        down.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        const from = down.current;
        down.current = null;
        if (!from) return;
        if (Math.hypot(e.clientX - from.x, e.clientY - from.y) > DRAG_SLOP) e.preventDefault();
      }}
    >
      <span className="relative block" style={stage}>
        {/*
         * The fallback, centred at the size the trace draws the artwork, so
         * nothing jumps when it is retired. `title=""`: the link already
         * carries the accessible name, and a second one is a duplicate.
         */}
        <span
          className="absolute inset-0 grid place-items-center"
          style={{ opacity: traced ? 0 : 1 }}
        >
          <Logo locale={locale} height={DRAWN} className="text-[var(--text)]" title="" />
        </span>

        {/* `aria-hidden`: the same mark again, as decoration. */}
        <span aria-hidden="true" className="absolute inset-0 block">
          <LogoTrace
            src={`/brand/${lockup.file}.svg`}
            /* The beat is long; the footer is somewhere a reader lingers. */
            hold={3}
            /*
             * Anchors further apart than the component ships with.
             *
             * `nodeSpacing` is a percentage of the artwork's drawn height, so
             * the 4% default was solved against a 300px display letter: on a
             * 56px lockup it puts an anchor every four device pixels, which at
             * this scale is a dotted line rather than a path with points on
             * it. 11% gives about twelve, which is where they separate into
             * nodes you can see and take hold of.
             */
            advanced={{ nodeSpacing: 11, nodeSize: 7 }}
            onReady={() => setTraced(true)}
          />
        </span>
      </span>
    </Link>
  );
}
