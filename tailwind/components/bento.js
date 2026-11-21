export const bentoStyles = [
  /*
   * The 21st.dev-style primitives: the bento cell, the framed preview, the
   * section seam and the hero's aurora. Added 18 Nov 2026 with
   * docs/design-brief.md; registered by tailwind.config.js, in order.
   */

  /* -- The bento cell ------------------------------------------------------
   *
   * The brief's main card: a 20px rounded box on the card surface with a
   * hairline edge, 8px of padding around an inner media panel, and a footer
   * row carrying a title, a subtitle and a link.
   *
   * `container-type: inline-size`, because the brief asks for the inner
   * layout to adapt to the *cell's* width rather than the viewport's -- a
   * cell that is one-third of a row at 1440px and full width at 820px is the
   * same CSS either way, and a media query cannot tell those apart.
   *
   * `overflow: clip` rather than `hidden`: both clip identically, but only
   * `hidden` makes the box a scroll container, and `animation-timeline:
   * view()` resolves against the nearest one -- so every reveal inside a
   * `hidden` cell would be measured against a box that never scrolls and
   * would silently never run. That has already cost this codebase 66 reveals
   * once.
   */
  { ".mk-bento-cell": {
    "container-type": "inline-size",
    "position": "relative",
    "isolation": "isolate",
    "overflow": "clip",
    "display": "flex",
    "flex-direction": "column",
    "border": "0",
    "border-radius": "var(--radius-card)",
    "background": "var(--card)",
    "box-shadow": "var(--lift-ring)",
    "padding": "0.5rem",
  } },
  /* The inner media panel: the picture, the mock, the demo. */
  { ".mk-bento-media": {
    "position": "relative",
    "overflow": "clip",
    "border-radius": "var(--radius-widget)",
    "background": "var(--surface-2)",
    "flex": "1",
    "min-block-size": "0",
    "transition": "scale 200ms var(--ease-smooth)",
  } },
  /*
   * The hover: the media scales, the cell does not.
   *
   * The brief gives the inner media 1.00 -> 1.02 on hover and leaves the card
   * still, which is why the scale is on the panel and the clip is on the cell:
   * the picture grows into its own corners instead of the whole card moving.
   */
  { ".mk-bento-cell:hover .mk-bento-media, .mk-bento-cell:focus-within .mk-bento-media": {
    "scale": "1.02",
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-bento-cell:hover .mk-bento-media, .mk-bento-cell:focus-within .mk-bento-media": {
      "scale": "1",
    },
    ".mk-bento-media": {
      "transition": "none",
    },
  } },
  /* The footer row: title and subtitle at the start, link at the end. */
  { ".mk-bento-foot": {
    "display": "flex",
    "align-items": "flex-end",
    "justify-content": "space-between",
    "gap": "1rem",
    "padding": "1rem 0.75rem 0.5rem",
  } },
  /* Under about 22rem of *cell* width the link drops below the title. */
  { "@container (max-width: 22rem)": {
    ".mk-bento-foot": {
      "flex-direction": "column",
      "align-items": "flex-start",
      "gap": "0.5rem",
    },
  } },

  /* -- The framed product preview -----------------------------------------
   *
   * The outer frame under the hero: 28px radius, a hairline, and a faint
   * white fill so the frame reads as a surface the product sits inside rather
   * than as a border drawn around it.
   */
  { ".mk-frame": {
    "position": "relative",
    "border-radius": "var(--radius-frame)",
    "background": "var(--ghost-fill)",
    "box-shadow": "var(--lift-ring)",
    "padding": "clamp(0.5rem, 1vw, 0.75rem)",
  } },

  /* -- The section seams --------------------------------------------------
   *
   * "Soft blue glow seams": a blurred blob of the accent sitting behind a
   * section boundary, so the page breathes with light as it is scrolled.
   *
   * The brief renders these on small canvases and says a blurred radial
   * gradient is fine. It is more than fine -- a canvas per boundary is a
   * composite layer per boundary, and this is one painted element that never
   * invalidates.
   *
   * `pointer-events: none` and `aria-hidden` at the call site: it is light,
   * not content. Centred on the boundary with a logical offset so it does not
   * need mirroring on Arabic.
   */
  { ".mk-seam": {
    "position": "absolute",
    "inset-inline": "0",
    "block-size": "320px",
    "pointer-events": "none",
    "z-index": "0",
    "background":
      "radial-gradient(50% 50% at 50% 50%,\n    var(--glow) 0%,\n    color-mix(in oklab, var(--glow) 40%, transparent) 42%,\n    transparent 72%)",
    "filter": "blur(80px)",
    "opacity": "0.85",
  } },

  /* -- The hero's aurora ---------------------------------------------------
   *
   * The brief's hero background is "a slow, dark, swirling blue gradient" on a
   * canvas, and allows layered blurred radial gradients animated with CSS
   * where WebGL would be overkill. It is overkill here: this is a marketing
   * hero above the fold on a site whose section 7 asks for Lighthouse >= 90 on
   * mobile, and a WebGL context is a shader compile, a canvas layer and a
   * rAF loop before the headline paints.
   *
   * So: three radial gradients on one element, drifting on a 48s loop, fading
   * to the canvas at the bottom. One element, no script, no main-thread work.
   */
  { ".mk-aurora": {
    "position": "absolute",
    "inset": "0",
    "pointer-events": "none",
    "z-index": "0",
    /*
     * A ribbon, not a wash.
     *
     * The first pass was three concentric blobs, which averaged out to an
     * even blue haze. In screenshots/01-hero.jpg the light has a *shape*: a
     * broad band sweeping down from the upper left across the headline and
     * off the right edge, brightest along its spine and dark either side of
     * it. Three wide, flat ellipses offset along one diagonal give that
     * band; the narrow one is its brighter core.
     */
    "background":
      "radial-gradient(60% 26% at 28% 16%, color-mix(in oklab, var(--accent) 42%, transparent) 0%, transparent 76%),\n    radial-gradient(48% 20% at 58% 30%, color-mix(in oklab, var(--accent-edge) 30%, transparent) 0%, transparent 74%),\n    radial-gradient(70% 30% at 76% 6%, color-mix(in oklab, var(--mk-deep-far) 38%, transparent) 0%, transparent 78%)",
    "filter": "blur(60px)",
    "animation": "mk-aurora 48s var(--ease-in-out) infinite alternate",
    /*
     * Fades into the canvas at both ends, so the hero has no edge.
     *
     * The bottom has faded since this was written. The top did not, and it
     * had to: the three ellipses sit at 16%, 30% and 6% down the box under a
     * 60px blur, and the host is `overflow: clip`, so the blur that should
     * have carried them off the top was cut square instead. On every page
     * that opens with a breadcrumb -- the fifty-one content pages do -- the
     * strip above the hero is bare canvas and the hero began one pixel later
     * at full strength, which is a seam straight across the page.
     *
     * 26% is the ramp. 14% took the measured step at the clip line down to
     * under 1% of the luminance range, which is below the threshold -- and it
     * still read as an edge, because the ramp *began* exactly where the
     * section did and the eye reads the onset of a gradient against a flat
     * field as a line whether or not there is one in the pixels. A longer
     * ramp has a gentler onset, which is the part that was visible.
     */
    "mask-image": "linear-gradient(to bottom, transparent 0%, #000 26%, #000 58%, transparent 100%)",
  } },
  { "@keyframes mk-aurora": {
    "from": {
      "translate": "0 0",
      "scale": "1",
    },
    "to": {
      "translate": "0 -4%",
      "scale": "1.12",
    },
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-aurora": {
      "animation": "none",
    },
  } },
  /*
   * The light pool above it, which the section cuts in half.
   *
   * `.mk-aurora` was only half of the seam. Every page hero also carries a
   * `.mk-glow` at `-top-40`, and the section is `overflow: clip` -- so the
   * pool is 620px tall, starts 61px above the box, and is sliced square at
   * the box's top edge. That slice is a 992px-wide horizontal cut straight
   * across the page, one pixel under the breadcrumb, on all fifty-one content
   * pages and the three editorial hubs.
   *
   * A pool cannot be clipped and look like light, so it fades before it is.
   * The ramp runs to 40% of the pool's own height, which puts the clip line at
   * about a quarter of full strength -- and a quarter of a 0.11-alpha blue
   * over near-black is a step small enough to disappear.
   *
   * On a class rather than on `.mk-glow` itself: the pool is used in a dozen
   * places that do not clip, and a mask there would dim light that has nothing
   * wrong with it.
   */
  { ".mk-hero-wash": {
    /*
     * The transparent zone has to *cover* the clipped band, not ramp through
     * it. A ramp from 0 does not help: the clip happens at a fixed offset
     * inside the pool's own box -- 173px of a 620px box on a content page,
     * 28% -- and whatever the mask is worth at 28%, that is the size of the
     * step. Measured at 1440px, isolating the pool from the aurora:
     *
     *   -top-40, no mask                 4.01   the reported seam
     *   -top-40, mask ramping 0 -> 40%   2.37   a ramp through the clip
     *   -top-40, mask 0 -> 34% -> 66%    0.93   the floor
     *
     * 0.93 of 255 is what the aurora alone leaves, so the pool contributes
     * nothing to the edge at 34%. It covers the editorial hubs too, whose
     * pool is pulled up by -top-32 against a wider box -- about 15%.
     */
    "mask-image": "linear-gradient(to bottom, transparent 0 34%, #000 66%)",
  } },

  /* -- The link arrow nudge ------------------------------------------------
   *
   * 2px along the reading direction on hover. `--mk-dir` is the existing
   * direction sign, so this is one rule for both editions rather than a
   * mirrored pair.
   */
  { ".mk-bento-foot .mk-arrow": {
    "transition": "translate 280ms var(--ease-smooth)",
  } },
  { ".mk-bento-cell:hover .mk-bento-foot .mk-arrow": {
    "translate": "calc(2px * var(--mk-dir, 1)) 0",
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-bento-foot .mk-arrow": {
      "transition": "none",
    },
    ".mk-bento-cell:hover .mk-bento-foot .mk-arrow": {
      "translate": "0 0",
    },
  } },
  /*
   * The press, for controls that are not `.mk-btn`.
   *
   * The traced homepage builds its CTAs as styled `<Link>`s rather than from
   * the button vocabulary, so they do not inherit `.mk-btn:active`. Same
   * value, same curve, same reduced-motion carve-out.
   */
  { ".mk-press": {
    "transition": "scale 170ms var(--ease-smooth), filter 250ms var(--ease-smooth)",
  } },
  /*
   * ...and its hover, which it did not have.
   *
   * These buttons set their own fill as an inline style, and an inline style
   * beats a rule -- so a `:hover { background: ... }` here would do nothing at
   * all. `filter` is not set inline, so it is the one hook that works for
   * both tones: `brightness` lifts the blue fill and the 8%-white ghost alike,
   * and the drop-shadow puts the accent glow *outside* the box without
   * touching the inline `box-shadow` that carries the primary's inset lip.
   */
  { ".mk-press:hover": {
    "filter": "brightness(1.12) drop-shadow(0 6px 18px var(--glow))",
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-press:hover": {
      "filter": "brightness(1.12)",
    },
  } },
  { ".mk-press:active": {
    "scale": "0.97",
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-press": {
      "transition": "none",
    },
    ".mk-press:active": {
      "scale": "1",
    },
  } },
  /* -- The trio: three cards that must not leave a hole -------------------
   *
   * Four sections on the homepage show exactly three cards — the three
   * pains, the three stages, the three audiences, the three things the
   * platform does not replace. All four used
   * `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`, which is the right
   * instrument for a list of unknown length and the wrong one for a list of
   * exactly three: between roughly 700 and 990px it resolves to two columns,
   * so the third card sits alone beside an empty half-row. Measured on `/`
   * and `/en` at 820 and 930, all four did it at once.
   *
   * `auto-fit` cannot be told "and if one is left over, widen it", because
   * the column count it picks is not expressible in CSS. So the count is
   * stated here instead — one, two, then three — and the two-column step
   * carries the rule that closes the hole: a last child in an odd position
   * is the orphan, and it spans the row.
   *
   * `:last-child:nth-child(odd)` is scoped to the two-column step on
   * purpose. At three columns a third card is also an odd last child, and
   * the same selector would stretch it across the whole row — which is why
   * the three-column step hands `grid-column` back.
   *
   * Gaps stay with the sections: these four do not agree on one (16 and 20),
   * and the gap is a property of the cards, not of the counting.
   *
   * The widened card is the same card, wider: icon, title, line, and the
   * action under the copy, all on the card's start padding. Three ways of
   * spending the extra width were built and taken out again -- centring the
   * block, setting the icon beside the copy, and holding the action out at
   * the end edge. Each of them filled the row by moving something, and all
   * three read wrong for one reason: the three cards are a set, the eye
   * follows a single start edge down the section, and a third card that
   * centres, indents or re-orders its content stops being the same kind of
   * card. Room left over at the end of a wide card is not a defect. A hole
   * in the grid was.
   */
  { ".mk-trio": {
    "display": "grid",
    "grid-template-columns": "minmax(0, 1fr)",
  } },
  { "@media (min-width: 44rem)": {
    ".mk-trio": {
      "grid-template-columns": "repeat(2, minmax(0, 1fr))",
    },
    ".mk-trio > :last-child:nth-child(odd)": {
      "grid-column": "1 / -1",
    },
  } },
  { "@media (min-width: 62rem)": {
    ".mk-trio": {
      "grid-template-columns": "repeat(3, minmax(0, 1fr))",
    },
    ".mk-trio > :last-child:nth-child(odd)": {
      "grid-column": "auto",
    },
  } },
];
