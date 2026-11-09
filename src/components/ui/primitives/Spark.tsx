"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * The cursor light on a primary CTA.
 *
 * A specular highlight rides inside the pill under the pointer, and the edge
 * it is nearest lights up. Both are driven by one spring, so the light lags
 * the cursor slightly and overshoots when it stops — which is what makes it
 * read as a reflection on a surface rather than as a cursor follower.
 *
 * ── What this is a departure from ─────────────────────────────────────────
 *
 * `landing.tsx` says of the CTA: "The press state is `:active` scaling in the
 * design file. That is a hover lift by another name, so it is left out:
 * states, not choreography." This is choreography, and it was asked for. The
 * two can be told apart, though, and the distinction is worth keeping: a lift
 * moves the control, so the thing you are aiming at is somewhere else by the
 * time you click it. Nothing here moves. The pill's box, its label and its hit
 * area are identical at every frame; what changes is light falling on a
 * surface that stays put.
 *
 * ── Where the numbers come from ───────────────────────────────────────────
 *
 * The spring constants, the ±12px overshoot beyond the pill, the 0.5 exponent
 * on the glow's rise and the 32ms step cap are the reference implementation's,
 * unchanged. The palette is not: the reference is warm orange (#CD3100 →
 * #FF7950 → a white hot spot) and this site has one accent, which is light —
 * #0099FF core into #0055FF falloff, §8. The edge rings are transposed stop
 * for stop onto that ramp, so the filament and the bloom land where the
 * reference put them. The light *inside* the pill is not, and could not be:
 * see `.mk-spark-glint` in tailwind/, where the arithmetic is.
 *
 * ── Four things it does that the reference does not ───────────────────────
 *
 * **It rests at 0.42, not at 1.** The reference rests fully lit and can
 * afford to: it is one button on a dark page. This ground is #F7F8FA and the
 * homepage has ten of these.
 *
 * **It rests on the end edge, which is the start edge in Arabic.** The
 * reference parks the light at the physical right, which is where its arrow
 * points. This site's arrow flips, so the resting gleam reads from the
 * element's own computed direction and parks under the arrow in both locales.
 * The light in motion stays physical — a reflection follows the hand.
 *
 * **It does nothing at all on a coarse pointer.** There is no cursor to
 * follow, every listener would be dead weight on the device least able to
 * carry it, and a `pointermove` from a tap would make the light jump on
 * touch. The resting gleam still paints — it is CSS — so the control looks
 * the same, it just never moves.
 *
 * **The whole thing is custom properties on one element.** The reference
 * writes `style.opacity` and `style.filter` onto four refs per frame. Here the
 * frame sets four variables on the root and the cascade does the rest, which
 * is also why the resting state is correct before any JavaScript runs: the
 * defaults are declared in `.mk-spark`, so a CTA is lit on the server.
 */

/** Spring, in hertz, and its damping ratio. From the reference. */
const FREQUENCY = 3.4;
const DAMPING = 0.78;
/** Below 1, so the edge comes up fast and finishes slowly. */
const GLOW_RISE = 0.5;
/*
 * How lit a CTA is when nothing is pointing at it.
 *
 * The reference rests at full intensity, and it can: it is one button on a
 * dark page. This site's ground is #F7F8FA and the homepage has ten of these,
 * so ten saturated blue halos at rest is not a resting state, it is a page
 * with ten emergencies on it. The gleam stays — it is the whole look — at a
 * little under half, and the cursor is what brings it up.
 */
const REST_GAIN = 0.42;
/** Per second, roughly: how fast the gain crosses between rest and engaged. */
const GAIN_RATE = 9;
/** A tab-away leaves one enormous delta; clamp it rather than let it explode. */
const MAX_STEP = 0.032;

export function Spark({
  tone = "ink",
  full = false,
  children,
}: {
  /**
   * `ink` is the near-black pill on paper: blue edge, blue specular inside it.
   * `deep` is the white pill inside `.mk-deep`, where blue is the ground and
   * the pill is already the brightest thing — so the edge turns white and
   * there is no interior light, because there is no putting light inside
   * white.
   */
  tone?: "ink" | "deep";
  /*
   * The wrapper fills its parent instead of shrink-wrapping the pill.
   *
   * It has to be told, because it cannot see. A caller that sized the button
   * with `w-full` — the plan cards do — was sizing the button against its
   * grid cell; now it sizes against this wrapper, and a shrink-wrapped
   * wrapper makes `w-full` mean "as wide as the label", which is the width it
   * already was. `.mk-doors` needs none of this: there the wrapper is the
   * grid item and the track stretches it.
   */
  full?: boolean;
  /** The CTA itself. Stays a server component: it is passed, not imported. */
  children: ReactNode;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    /*
     * The light is physical, and that is deliberate.
     *
     * `--mk-spark-x` is a pixel offset from the centre of the pill on the
     * screen's x-axis, not on the reading axis, and the two edge glows are the
     * physical ones. A reflection follows the hand; it does not know which way
     * the page reads. The one thing that does know is where the light comes to
     * rest, because that is a composition decision rather than a physical one
     * — under the arrow, which flips.
     */
    const dir = getComputedStyle(el).direction === "rtl" ? -1 : 1;

    let bound = 1;
    let rest = 0;
    let x = 0;
    let target = 0;
    let velocity = 0;
    let gain = REST_GAIN;
    let inside = false;
    let last = 0;
    let frame: number | null = null;

    /*
     * Position and engagement are published separately and multiplied in CSS.
     *
     * They answer different questions — "which edge" and "how lit" — and the
     * glint needs only the second. Multiplying them here instead would mean
     * the glint could not be dimmed at rest without a third variable.
     */
    const paint = () => {
      const n = Math.max(-1, Math.min(1, x / bound));
      const lit = Math.abs(n) ** GLOW_RISE;
      el.style.setProperty("--mk-spark-x", `${x.toFixed(2)}px`);
      el.style.setProperty("--mk-spark-plus", (n > 0 ? lit : 0).toFixed(3));
      el.style.setProperty("--mk-spark-minus", (n < 0 ? lit : 0).toFixed(3));
      el.style.setProperty("--mk-spark-gain", gain.toFixed(3));
    };

    const measure = () => {
      bound = el.getBoundingClientRect().width / 2 + 12;
      rest = bound * dir;
      // Re-park only when nothing is in flight, or a resize mid-hover would
      // yank the light out from under the cursor.
      if (!inside && frame === null) {
        x = rest;
        target = rest;
        paint();
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    const still =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) return () => observer.disconnect();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, MAX_STEP);
      last = now;
      const w = 2 * Math.PI * FREQUENCY;
      velocity += (w * w * (target - x) - 2 * DAMPING * w * velocity) * dt;
      x += velocity * dt;

      // Not sprung: the gain has no momentum to express, and an overshoot on
      // it would read as the CTA flickering rather than as light arriving.
      const settled = inside ? 1 : REST_GAIN;
      gain += (settled - gain) * Math.min(1, dt * GAIN_RATE);
      paint();

      // Keep going while the pointer is in, or while the spring or the gain is
      // still visibly moving. Then stop dead — an idle rAF per CTA is a
      // battery bug on a page with ten of them.
      if (inside || Math.abs(settled - gain) > 0.01 || Math.abs(target - x) > 0.15 || Math.abs(velocity) > 0.6) {
        frame = requestAnimationFrame(step);
      } else {
        frame = null;
        x = target;
        velocity = 0;
        gain = settled;
        paint();
      }
    };

    const kick = () => {
      if (frame === null) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    };

    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      inside = true;
      target = Math.max(-bound, Math.min(bound, event.clientX - (box.x + box.width / 2)));
      kick();
    };
    // Leave the light where it was rather than snapping it home: the spring
    // carries it back out to the resting edge on its own.
    const onLeave = () => {
      inside = false;
      target = rest;
      kick();
    };
    // Keyboard focus has no position, so the light centres — the one state
    // where both edges are equally lit and the pill reads as simply on.
    const onFocus = () => {
      inside = false;
      target = 0;
      kick();
    };
    const onBlur = () => {
      inside = false;
      target = rest;
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocus);
    el.addEventListener("focusout", onBlur);

    return () => {
      observer.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocus);
      el.removeEventListener("focusout", onBlur);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      ref={root}
      className={
        `mk-spark${tone === "deep" ? " mk-spark-deep" : " mk-spark-glint"}` +
        `${full ? " mk-spark-full" : ""}`
      }
    >
      {/* Two rings, one per side of the x-axis. The second is the first
          mirrored, so there is one gradient ramp to keep in step, not two. */}
      <span aria-hidden="true" className="mk-spark-edge mk-spark-edge-plus" />
      <span aria-hidden="true" className="mk-spark-edge mk-spark-edge-minus" />
      {/* The specular is a pseudo-element of the pill, not an element here:
          it has to sit between the pill's fill and its label. See
          `.mk-spark-glint` in tailwind/. */}
      {children}
    </span>
  );
}
