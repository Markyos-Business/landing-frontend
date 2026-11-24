export const pricingStyles = [
  /*
   * The plan card, restyled 19 Nov 2026.
   *
   * The owner asked for the pricing to take the look of Originkit's
   * "Pricing 04" while keeping the real plans, the Arabic copy and the SAR
   * prices. So this is a translation, not a port: the reference section was
   * read for what makes it look the way it does, and each value mapped onto a
   * token that already says the same thing on this page.
   *
   *   #060708 page               -> var(--canvas)           both near-black
   *   #0b0d0f card               -> var(--surface-1)        a hair lighter, as there
   *   rgba(234,242,255,.07) edge -> var(--hairline-strong)  .075, the same line
   *   #5cc8ff cyan               -> var(--accent-edge)      the brief's one accent
   *
   * Three things in the reference could not come across, and each is a rule
   * rather than a preference:
   *
   * - **JetBrains Mono** carries its numerals. §2 loads Inter and Thmanya and
   *   nothing else, and a third family for three rows of figures is not a
   *   trade this page makes — worse, a Latin mono face has no Arabic and the
   *   value column is bilingual. `font-variant-numeric: tabular-nums` gets
   *   what the mono was actually for: digits on a common width, so the values
   *   line up down the column.
   * - **11px and 12.5px labels.** The floor is 12px (§1.6), so both are 12.
   * - **Uppercase with 1px of tracking** on the badge. §11: Arabic has no
   *   case, so the transform and the tracking come off in RTL.
   */

  /* -- The card ------------------------------------------------------------
   *
   * Registered after `.mk-card`, which these refine: both are single-class
   * selectors, so the tie is broken by order and the later rule wins. That is
   * the whole reason this module sits where it does in index.js.
   */
  { ".mk-plan": {
    "position": "relative",
    "display": "flex",
    "flex-direction": "column",
    "border-radius": "22px",
    "background": "var(--surface-1)",
    "box-shadow": "inset 0 0 0 1px var(--hairline-strong)",
  } },

  /* -- The recommended card, lit -------------------------------------------
   *
   * The reference pools light behind this card with a masked radial in a
   * wrapper element (`.pro-wrap > .aura`). That wrapper cannot come across:
   * the cards here are the grid items themselves, so wrapping one would take
   * it out of the grid and collapse the row.
   *
   * A negative-z pseudo-element is the usual answer and it is wrong here. An
   * element that establishes a stacking context paints its own background
   * before its negative-z children, so the aura would be painted over by the
   * very card it is meant to sit behind.
   *
   * An outer box-shadow has neither problem: it paints outside the border box
   * without a wrapper, without a stacking context and without a direction, so
   * it is identical in both editions. It is also what `.mk-neon` already does
   * on this page, and the note there says why — "outer rather than inset, so
   * it reads as light around the card rather than as a border drawn inside
   * it". Three stops: the lit edge, a tight halo, and the wide soft pool that
   * is the thing the reference is actually doing.
   *
   * The gradient is the reference's top sheen, as a second background layer
   * rather than a pseudo-element, so nothing is painted over the card's own
   * content and there is no stacking order to get wrong.
   */
  { ".mk-plan-lit": {
    "background":
      "linear-gradient(to bottom," +
      " color-mix(in oklab, var(--accent-edge) 9%, transparent)," +
      " transparent 44%), var(--surface-1)",
    "box-shadow":
      "inset 0 0 0 1px color-mix(in oklab, var(--accent-edge) 38%, transparent)," +
      "0 0 0 5px color-mix(in oklab, var(--accent-edge) 8%, transparent)," +
      "0 34px 80px -26px color-mix(in oklab, var(--accent-edge) 45%, transparent)",
  } },

  /* -- The badge on the recommended card ----------------------------------
   *
   * A solid pale pill with the canvas as ink, which is the reference's badge
   * (`#060708` on `#5cc8ff`) rather than §7's ghost tag. The fill is the
   * palette's pale blue, and it is the fill because it is the only value here
   * that is both the reference's pale pill *and* legible at this size.
   * Measured on the page, as ratios against the fill:
   *
   *   canvas ink on --accent-edge   4.59   the obvious choice, and too low
   *   white on --accent-edge        4.33   lower still
   *   white on --accent             7.20   clears, but it is a dark pill
   *   canvas ink on --mk-blue-ink   9.17   clears, and it is a pale pill
   *
   * The floor for type this small is 7:1 (§4's note on `--text-muted`), so the
   * first two are out whatever they look like. `--mk-blue-ink` is named for
   * ink because nothing had needed this blue as a fill before; this is that
   * use, and it beats the ghost tag it replaces on contrast as well as on
   * resemblance.
   */
  { ".mk-plan-tag": {
    "display": "inline-flex",
    "align-items": "center",
    "flex": "none",
    "border-radius": "var(--radius-pill)",
    "padding-block": "0.25rem",
    "padding-inline": "0.5625rem",
    "background": "var(--mk-blue-ink)",
    "color": "var(--canvas)",
    "font-size": "var(--fs-eyebrow)",
    "font-weight": "500",
    "line-height": "1",
    "letter-spacing": "0.08em",
    "text-transform": "uppercase",
    "white-space": "nowrap",
  } },
  /* §11: Arabic has no case, and it is never tracked. */
  { "[dir=\"rtl\"] .mk-plan-tag": {
    "letter-spacing": "0",
    "text-transform": "none",
  } },

  /* -- The amount ----------------------------------------------------------
   *
   * The reference gives the price a 64px band and sets it at 56px. The sizes
   * stay on the container query PlansBlock already carries, because that query
   * is load-bearing: it is the fix for a measured bug where the price wrapped
   * between the number and its currency at four plans and hung out of the card
   * at five. The steps are raised, not replaced.
   */
  { ".mk-plan-amount": {
    "font-weight": "600",
    "line-height": "1",
    "letter-spacing": "-0.04em",
    "white-space": "nowrap",
    "font-variant-numeric": "tabular-nums",
  } },
  { "[dir=\"rtl\"] .mk-plan-amount": {
    "letter-spacing": "0",
  } },

  /* -- The limits ----------------------------------------------------------
   *
   * Ruled above and below rather than above only, which is what gives the
   * reference its ledger. `tabular-nums` stands in for the mono face.
   */
  { ".mk-plan-limits": {
    "display": "grid",
    "gap": "0.625rem",
    "margin-block": "0",
    "padding-block": "1rem",
    "border-block": "1px solid var(--hairline-strong)",
  } },
  { ".mk-plan-limit": {
    "display": "flex",
    "justify-content": "space-between",
    "gap": "0.75rem",
    "font-size": "var(--fs-ui)",
  } },
  { ".mk-plan-limit dt": {
    "color": "var(--text-muted)",
    "line-height": "1.5",
  } },
  { ".mk-plan-limit dd": {
    "margin": "0",
    "font-weight": "500",
    "font-variant-numeric": "tabular-nums",
    "text-align": "end",
  } },

  /* -- The strip under the row ---------------------------------------------
   *
   * The reference closes with a bar of small print and one way out. Same card
   * surface and same hairline, so the row and the bar read as one object.
   */
  { ".mk-plan-strip": {
    "display": "flex",
    "flex-wrap": "wrap",
    "align-items": "center",
    "justify-content": "space-between",
    "gap": "0.75rem 1.5rem",
    "border-radius": "18px",
    "padding-block": "1.25rem",
    "padding-inline": "1.5rem",
    "background": "var(--surface-1)",
    "box-shadow": "inset 0 0 0 1px var(--hairline-strong)",
  } },
  { ".mk-plan-strip-items": {
    "display": "flex",
    "flex-wrap": "wrap",
    "gap": "0.5rem 1.375rem",
    "margin": "0",
    "padding": "0",
    "list-style": "none",
    "font-size": "var(--fs-eyebrow)",
    "color": "var(--text-muted)",
    "font-variant-numeric": "tabular-nums",
  } },
  { ".mk-plan-strip-items b": {
    "color": "var(--text)",
    "font-weight": "500",
  } },

  /* ── The launch offer ───────────────────────────────────────────────────
   *
   * One card, on the same surface and the same hairline as every other card
   * here. It is deliberately not lit, not blue-filled and not edged in the
   * accent: `.mk-plan-lit` is the one object a pricing section may mark that
   * way, and the offer is not a plan -- it is a condition on all three. The
   * only accent on it is the discounted figure, which is the one thing in
   * the block a reader is looking for.
   */
  /*
   * The card fills its container.
   *
   * It was capped at 48rem, which is the cap `.mk-callout` carries and the
   * reasoning was borrowed with it: a body of prose past about 62ch stops
   * being readable, so a card running the full 1100px spends its last 40%
   * on nothing. That is true of a paragraph and false of this. The block is
   * a three-column ledger with a clock over it, and a ledger does not have
   * a measure -- capped, it sat 338px short of the plans grid directly
   * below it, against one edge, and read as a card that had failed to
   * load.
   *
   * The one thing inside it that *is* prose keeps its own cap: the lead
   * carries `.mk-measure`, so widening the card did not widen the sentence.
   */
  /* The server-rendered sentence, and what a reader keeps with no
     JavaScript. Sized as a lead rather than as small print: before the
     timer mounts, this is the deadline. */
  { ".mk-offer-window": {
    "margin": "0",
    "font-size": "var(--fs-ui)",
    "color": "var(--text-muted)",
  } },

  { ".mk-offer-clock": {
    "display": "flex",
    "flex-wrap": "wrap",
    "align-items": "center",
    "gap": "0.75rem 1rem",
  } },
  { ".mk-offer-clock-label": {
    "font-size": "var(--fs-ui)",
    "color": "var(--text-muted)",
  } },
  { ".mk-offer-cells": {
    "display": "flex",
    "gap": "0.5rem",
  } },
  /*
   * A cell is a figure over its unit.
   *
   * `min-inline-size` and not a fixed width: the Arabic units are «دقيقة»
   * and «ثانية», which set wider than "mins" and "secs", and a cell sized
   * for the Latin labels would clip them. The floor keeps the four cells
   * even while the widest label decides the rest.
   *
   * `tabular-nums` is the whole reason this does not jitter: without it the
   * digits are proportional, every cell changes width as its number changes,
   * and the row shuffles sideways once a second.
   */
  { ".mk-offer-cell": {
    "display": "flex",
    "flex-direction": "column",
    "align-items": "center",
    "gap": "0.125rem",
    "min-inline-size": "3.25rem",
    "padding-block": "0.5rem",
    "padding-inline": "0.5rem",
    "border-radius": "var(--radius-widget)",
    "background": "var(--surface-2)",
    "box-shadow": "inset 0 0 0 1px var(--hairline)",
  } },
  { ".mk-offer-cell b": {
    "font-size": "1.375rem",
    "font-weight": "600",
    "line-height": "1.1",
    "color": "var(--text)",
    "font-variant-numeric": "tabular-nums",
  } },
  { ".mk-offer-cell small": {
    "font-size": "var(--fs-eyebrow)",
    "color": "var(--text-muted)",
  } },
  /* The homepage strip's clock: the same cells, one step down, so the line
     stays a line rather than becoming a second heading. */
  { ".mk-offer-clock-sm .mk-offer-cell": {
    "min-inline-size": "2.75rem",
    "padding-block": "0.375rem",
  } },
  { ".mk-offer-clock-sm .mk-offer-cell b": {
    "font-size": "1rem",
  } },

  /*
   * Three rows: who, what it was, what it is until the offer ends.
   *
   * A `<dl>` laid out on a grid, not a table, because each row is one term
   * and its two values. The columns are `max-content` at both ends so the
   * two figures sit against the end edge in either direction and the name
   * takes the slack -- which is also what makes it mirror with no rule of
   * its own.
   */
  /*
   * One set of columns for every row, via `subgrid`.
   *
   * Each row declared its own `minmax(0, 1fr) max-content max-content`,
   * which makes three independent grids that happen to be stacked. A
   * `max-content` track then sizes to the widest thing in *that row*, so the
   * heading row sized to "Monthly plan" and the body rows to "$19" -- and
   * the heading sat 100px away from the column it names. Measured in both
   * editions; the third column only looked right because its header is
   * wider than its figures and everything in it is flush to the end edge.
   *
   * The tracks belong to the list, and the rows inherit them. That is what
   * `subgrid` is for, and it keeps the row a box, which the hairline below
   * needs -- `display: contents` would have dissolved the element the rule
   * is painted on.
   */
  /*
   * Fractions, not `max-content`, now that the card is the full container.
   *
   * `max-content` sizes a column to its widest cell, which at 762px put the
   * two figures hard against the end edge with the name taking every pixel
   * of slack. At 1100 that slack becomes most of the row: a name, 700px of
   * nothing, then `$228 $114` in the corner, which no longer reads as a
   * table at all.
   *
   * The floor stays in `minmax` so the columns cannot collapse under the
   * Arabic headers -- «سنتك الأولى» sets wider than "$114" -- and the ratio puts
   * the name on a little under half the row with the two figures sharing
   * the rest, which is what the three headers sit over in both editions.
   */
  { ".mk-offer-rows": {
    "margin": "0",
    "display": "grid",
    "grid-template-columns": "minmax(0, 1.6fr) minmax(6rem, 1fr) minmax(6rem, 1fr)",
    "gap": "0",
  } },
  { ".mk-offer-row": {
    "display": "grid",
    "grid-column": "1 / -1",
    "grid-template-columns": "subgrid",
    "align-items": "baseline",
    "gap": "0.75rem 1.25rem",
    "padding-block": "0.75rem",
    "box-shadow": "inset 0 -1px 0 var(--hairline)",
  } },
  { ".mk-offer-row:last-child": {
    "box-shadow": "none",
  } },
  { ".mk-offer-row dt": {
    "font-size": "var(--fs-ui)",
    "color": "var(--text)",
  } },
  { ".mk-offer-row dd": {
    "margin": "0",
    "font-size": "var(--fs-ui)",
    "font-variant-numeric": "tabular-nums",
  } },
  { ".mk-offer-row-head": {
    "font-size": "var(--fs-eyebrow)",
    "color": "var(--text-muted)",
    "padding-block-end": "0.5rem",
  } },
  /*
   * `justify-self`, not `text-align`, for the two figure columns.
   *
   * Both were aligned with `text-align: end`, and `end` is resolved against
   * **the element's own** direction. Every cell in these columns carries
   * `.mk-bidi` -- `unicode-bidi: plaintext` -- which resolves direction from
   * the first strong character in the cell. A header reads «سنتك الأولى»
   * and resolves RTL, so its `end` is the left. A figure reads `$114`, whose
   * characters are all neutral or weak, so plaintext falls back to LTR and
   * its `end` is the right. The header and the figure it names were aligned
   * to opposite edges of the same column.
   *
   * It was invisible while the tracks were `max-content`, because a column
   * sized to its own widest cell leaves almost no room to disagree in. The
   * moment the card went full width and the tracks became fractions, each
   * header sat a couple of hundred pixels from its own numbers.
   *
   * `justify-self` is resolved against the **grid's** direction instead, so
   * every cell in the row lands on the same edge whatever its contents
   * resolve to, and the whole ledger still mirrors with the page. The same
   * trap, and the same instrument, as the table columns in
   * tailwind/components/page-blocks.js.
   */
  /* Centred in their tracks, not flush to the end edge: the owner's call,
     21 Nov 2026. Still `justify-self` and still one value for the header and
     its figures alike, so the column stays a column -- see the note above
     for why this cannot be `text-align`. */
  { ".mk-offer-row > :nth-child(2), .mk-offer-row > :nth-child(3)": {
    "justify-self": "center",
  } },
  { ".mk-offer-was": {
    "color": "var(--text-muted)",
  } },
  /* The one accented figure in the block. */
  { ".mk-offer-now": {
    "color": "var(--accent-on-soft)",
    "font-weight": "500",
  } },

  { ".mk-offer-terms": {
    "margin": "0",
    "padding": "0",
    "list-style": "none",
    "display": "grid",
    "gap": "0.5rem",
    "font-size": "var(--fs-eyebrow)",
    "line-height": "1.6",
    "color": "var(--text-muted)",
  } },

  /*
   * The homepage strip.
   *
   * One row that wraps to three on a phone, centred because the section
   * around it is. `justify-content: center` rather than a side, so it needs
   * no mirroring.
   */
  { ".mk-offer-strip": {
    "display": "flex",
    "flex-wrap": "wrap",
    "align-items": "center",
    "justify-content": "center",
    "gap": "0.75rem 1.125rem",
    "padding-block": "0.875rem",
    "padding-inline": "1.25rem",
    "border-radius": "var(--radius-widget)",
    "background": "var(--surface-2)",
    "box-shadow": "inset 0 0 0 1px var(--hairline-strong)",
    "font-size": "var(--fs-ui)",
    "color": "var(--text)",
    "text-align": "center",
  } },

  /* -- "Pick it if" and "Move up when" -------------------------------------
   *
   * Copy deck v4.3 puts two sentences above the limits on every card. They
   * reuse `.mk-plan-limits` for the rule above and below, because they are the
   * same ledger, but a pair here does not fit on one line: "You work alone,
   * with one or two clients at a time" beside a 70px label in a card 200px
   * wide would be four words a line. So the label sits over its sentence
   * rather than beside it, and the two colours swap -- the label is the
   * secondary thing to read here, where in the limits below the label is what
   * the eye runs down.
   */
  { ".mk-plan-fit": {
    "display": "grid",
    "gap": "0.1875rem",
    "font-size": "var(--fs-ui)",
  } },
  { ".mk-plan-fit dt": {
    "font-size": "var(--fs-eyebrow)",
    "font-weight": "500",
    "color": "var(--text-faint)",
  } },
  { ".mk-plan-fit dd": {
    "margin": "0",
    "line-height": "1.5",
    "color": "var(--text-muted)",
  } },

  /* -- The chooser ---------------------------------------------------------
   *
   * One question above the cards, answered by a row of chips. Not the
   * segmented switch: that control is "which of these am I", exclusive and
   * permanent, with a knob that travels. This one starts with nothing picked
   * -- the recommended card is already lit -- and the answers are of different
   * lengths, which a track of equal columns handles badly and a wrapping row
   * handles well.
   *
   * The chips are the brief's buttons at the small size, in the ghost fill,
   * so they read as the same family as everything else on the page. The picked
   * one takes the accent edge, matching the card it just lit.
   */
  { ".mk-choice-row": {
    "display": "flex",
    "flex-wrap": "wrap",
    "justify-content": "center",
    "gap": "0.625rem",
  } },
  { ".mk-choice": {
    "display": "inline-flex",
    "align-items": "center",
    "min-block-size": "2.75rem",
    "padding-inline": "1rem",
    "border": "0",
    "border-radius": "var(--radius-btn)",
    "background": "var(--surface-2)",
    "box-shadow": "inset 0 0 0 1px var(--hairline-strong)",
    "color": "var(--text-muted)",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "line-height": "1.3",
    "cursor": "pointer",
    "transition":
      "color var(--mk-dur-base) var(--mk-ease), box-shadow var(--mk-dur-base) var(--mk-ease)",
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-choice": {
      "transition": "none",
    },
  } },
  { ".mk-choice:hover": {
    "color": "var(--text)",
  } },
  { ".mk-choice[aria-checked=\"true\"]": {
    "color": "var(--text)",
    "box-shadow":
      "inset 0 0 0 1px color-mix(in oklab, var(--accent-edge) 45%, transparent)," +
      "0 0 0 4px color-mix(in oklab, var(--accent-edge) 8%, transparent)",
  } },
];
