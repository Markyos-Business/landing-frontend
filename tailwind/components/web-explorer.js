export const webExplorerStyles = [
  /* The web block and the solution explorer. Imported by tailwind/, in order. */
  /*
   * Three audiences, one mark, nine solutions.
   *
   * The picture under the hero on /solutions. Its block note says why it is
   * aria-hidden and why it is boxes rather than a drawing; this is how the
   * boxes make a diagram.
   *
   * Three rows in a column: the tiles, the rule, the chips. Each tile and
   * each chip carries its own 20px stub, so the connectors are children of
   * the things they connect rather than absolutely positioned against them —
   * which means the diagram re-flows on a phone instead of coming apart, and
   * there is no coordinate anywhere to go stale when a label gets longer.
   *
   * The rule is two flex-grown hairlines with the mark between them. Both
   * segments carry `.mk-draw`, so each grows from its own start edge as the
   * section crosses — on /ar that is the right, which makes the pair open
   * outwards from the mark in the reading direction.
   */
  /* Close to what it introduces. The hero above it already carries a full
   section's padding, and the three cards below are what the diagram's top
   row is pointing at — 100px of nothing between them read as two sections
   that happened to be adjacent. */
  { ".mk-web-section": {
    "padding-block-end": "clamp(1.5rem, 3vw, 2.5rem)",
  } },
  { ".mk-web": {
    "display": "grid",
    "justify-items": "center",
  } },
  { ".mk-web-row": {
    "display": "flex",
    "flex-wrap": "wrap",
    "justify-content": "center",
    "gap": "8px 10px",
    "margin": "0",
    "padding": "0",
    "list-style": "none",
  } },
  { ".mk-web-node": {
    "display": "flex",
    "flex-direction": "column",
    "align-items": "center",
  } },
  { ".mk-web-stub": {
    "inline-size": "1px",
    "block-size": "20px",
    "background": "var(--hairline-strong)",
  } },
  /* A wrapped row of chips would leave the second line's stubs pointing at
   nothing, so they come off below the first line only. */
  { ".mk-web-chips .mk-web-node:nth-child(n + 6) .mk-web-stub": {
    "block-size": "10px",
    "opacity": "0.5",
  } },
  { ".mk-web-tile": {
    "display": "inline-flex",
    "align-items": "center",
    "gap": "8px",
    "padding-block": "9px",
    "padding-inline": "14px",
    "border-radius": "var(--radius-pill)",
    "background": "var(--surface-0)",
    "box-shadow": "var(--lift-card)",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "color": "var(--text)",
    "white-space": "nowrap",
  } },
  { ".mk-web-tile-icon": {
    "display": "grid",
    "place-items": "center",
    "inline-size": "1.5rem",
    "block-size": "1.5rem",
    "border-radius": "50%",
    "background": "var(--accent-soft)",
    "color": "var(--accent)",
  } },
  { ".mk-web-rail": {
    "display": "flex",
    "align-items": "center",
    "inline-size": "min(100%, 46rem)",
  } },
  /*
   * Each run fades out as it leaves the mark.
   *
   * A flat hairline straight through reads as one line with a badge sitting
   * on it. Fading each segment towards its far end makes the mark the place
   * the runs come *from*, which is the sentence the diagram is making. The
   * gradient is stated `to right` and flipped for RTL, because a gradient
   * direction is physical and this one has to point away from the mark in
   * both editions.
   */
  { ".mk-web-line": {
    "flex": "1",
    "block-size": "1px",
    "background": "linear-gradient(\n    to right,\n    transparent,\n    var(--hairline-strong) 45%,\n    rgba(0, 153, 255, 0.45)\n  )",
  } },
  { ".mk-web-line:last-child": {
    "background": "linear-gradient(\n    to left,\n    transparent,\n    var(--hairline-strong) 45%,\n    rgba(0, 153, 255, 0.45)\n  )",
  } },
  { "[dir=\"rtl\"] .mk-web-line": {
    "background": "linear-gradient(\n    to left,\n    transparent,\n    var(--hairline-strong) 45%,\n    rgba(0, 153, 255, 0.45)\n  )",
  } },
  { "[dir=\"rtl\"] .mk-web-line:last-child": {
    "background": "linear-gradient(\n    to right,\n    transparent,\n    var(--hairline-strong) 45%,\n    rgba(0, 153, 255, 0.45)\n  )",
  } },
  /* The one lit object in the section (§8): the mark where the three runs
   meet, on the page's own blue. */
  { ".mk-web-hub": {
    "display": "grid",
    "flex": "none",
    "place-items": "center",
    "inline-size": "2.75rem",
    "block-size": "2.75rem",
    "border-radius": "50%",
    "background": "var(--surface-0)",
    "color": "var(--accent)",
    "box-shadow": "0 0 0 1.5px var(--accent-edge),\n    0 0 0 7px rgba(0, 153, 255, 0.08),\n    0 18px 40px -22px rgba(0, 85, 255, 0.45)",
  } },
  { ".mk-web-chip": {
    "display": "inline-flex",
    "align-items": "center",
    "padding-block": "6px",
    "padding-inline": "12px",
    "border-radius": "var(--radius-pill)",
    "background": "var(--surface-0)",
    "box-shadow": "var(--lift-ring)",
    "font-size": "var(--fs-eyebrow)",
    "line-height": "1.4",
    "color": "var(--text-muted)",
    "white-space": "nowrap",
  } },
  /*
   * The solutions explorer.
   *
   * The reference's shape for this kind of section: a column of things to
   * choose from on the reading side, and the one you chose, large, beside it.
   * The component's own note says why it is tabs rather than a switch and why
   * all nine panels are in the HTML.
   *
   * ── The two layouts ──────────────────────────────────────────────────────
   *
   * One markup, two grids. Below 64rem the list is two columns of compact
   * tiles above the stage, because nine stacked rows would be a screen and a
   * half of scrolling before a phone reader reached the thing the list
   * controls. At 64rem and up it is the reference's layout: a 20rem column
   * beside the stage.
   *
   * Everything is logical, so the column is on the reading side in both
   * editions: `grid-template-columns` follows `direction` on its own, and
   * nothing here names left or right.
   */
  { ".mk-explorer": {
    "display": "grid",
    "gap": "16px",
  } },
  { "@media (min-width: 64rem)": {
    ".mk-explorer": {
      "grid-template-columns": "20rem 1fr",
      "gap": "24px",
      "align-items": "start",
    },
  } },
  { ".mk-explorer-list": {
    "display": "grid",
    "gap": "6px",
    "grid-template-columns": "repeat(2, minmax(0, 1fr))",
  } },
  { "@media (min-width: 64rem)": {
    ".mk-explorer-list": {
      "grid-template-columns": "minmax(0, 1fr)",
    },
  } },
  { ".mk-explorer-tab": {
    "display": "flex",
    "align-items": "center",
    "gap": "10px",
    "inline-size": "100%",
    "padding-block": "10px",
    "padding-inline": "12px",
    "border-radius": "var(--radius-widget)",
    "text-align": "start",
    "transition": "background-color var(--mk-dur-fast) var(--mk-ease),\n    box-shadow var(--mk-dur-fast) var(--mk-ease)",
  } },
  /*
   * The selected tile is the one lit object in the section.
   *
   * White on the band's own ground with the brand's ring, which is the same
   * device `.mk-neon` uses for a selected plan — the reference marks its
   * chosen item the same way, and §8 allows exactly one of these per section.
   */
  { ".mk-explorer-tab.is-active": {
    "background": "var(--surface-0)",
    "box-shadow": "0 0 0 1.5px var(--accent-edge), 0 0 0 5px rgba(0, 153, 255, 0.08)",
  } },
  /*
   * The selected tile's glyph inverts into the brand blue.
   *
   * Nine identical 8%-blue tiles in a column give the list no focal point —
   * the ring alone marks the selection, and at 1.5px it is doing that work on
   * its own. Filling the one selected tile is the §10 "selected object" move
   * and it is visible from across the page, which a hairline is not.
   */
  { ".mk-explorer-tab.is-active .mk-explorer-tab-icon": {
    "background": "var(--mk-blue)",
    "color": "#fff",
    "box-shadow": "var(--mk-glow-soft)",
  } },
  { "@media (hover: hover) and (pointer: fine)": {
    ".mk-explorer-tab:not(.is-active):hover": {
      "background": "var(--surface-2)",
    },
  } },
  { ".mk-explorer-tab-icon": {
    "display": "grid",
    "flex": "none",
    "place-items": "center",
    "inline-size": "2rem",
    "block-size": "2rem",
    "border-radius": "var(--radius-widget)",
    "background": "var(--accent-soft)",
    "color": "var(--accent)",
  } },
  { ".mk-explorer-tab-title": {
    "display": "block",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "line-height": "1.35",
    "color": "var(--text)",
  } },
  { ".mk-explorer-tab-who": {
    "display": "block",
    "margin-block-start": "2px",
    "font-size": "var(--fs-eyebrow)",
    "line-height": "1.35",
    "color": "var(--text-muted)",
  } },
  /*
   * The stage holds its height between solutions.
   *
   * Nine panels, nine different pictures, and the tallest is twice the
   * shortest — so switching moved everything below the section and, at the
   * bottom of the list, moved the tab out from under the pointer that had
   * just clicked it. A floor set to the tallest common case stops the page
   * walking about while somebody reads across the nine.
   *
   * Only where the two sit side by side. On a phone the panel is under the
   * list rather than beside it, nothing below it is on screen while you
   * choose, and a floor there would be empty space on the short panels.
   */
  /*
   * The stage carries the section's one light source.
   *
   * §8 puts a light pool behind the one object a section is about, and on this
   * page that object is the panel the nine tabs drive — but the explorer went
   * in without one, so the whole middle of /solutions was white cards on a
   * near-white ground with the brand's blue appearing only as 16px icon tiles.
   * The closing CTA was the one thing on the page with any light in it.
   *
   * `isolation` so the pool's negative z-index is trapped here rather than
   * resolving against the section, and `position: relative` so it has
   * something to be absolute against. Neither makes a scroll container, so
   * the `view()` timelines inside the panels survive — which `overflow:
   * hidden` would not have.
   */
  { ".mk-explorer-stage": {
    "position": "relative",
    "isolation": "isolate",
    "min-inline-size": "0",
  } },
  /*
   * Centred by `.mk-center-x`, not by hand.
   *
   * The first version re-spelled that utility's `inset-inline-start: 50%` and
   * `translate: calc(-50% * var(--mk-dir))` inline and sized the pool at 120%
   * of the stage, which put 70px of it past the stage on each side. Nothing
   * clips here, so the page gained a horizontal scrollbar and every section
   * on it shifted. `100%` is the cap for the same reason: a pool wider than
   * the box it sits in has nothing to be stopped by.
   */
  { ".mk-explorer-glow": {
    "inset-block-start": "-6%",
    "inline-size": "min(34rem, 100%)",
  } },
  /*
   * The panel arrives rather than cutting.
   *
   * No JavaScript and no key on the element: an animation does not run while
   * its element is `display: none`, and it starts fresh the moment the
   * element is displayed again — which is exactly what `hidden` flipping off
   * does. So eight hidden panels hold a cocked animation each, and whichever
   * one is shown next plays it. The first one plays on load, which is also
   * right: it is the only panel that has never been seen.
   *
   * `backwards` and not `both`, the rule this file follows everywhere: the
   * settled panel has to carry no `translate` of its own, or it becomes a
   * containing block for anything positioned inside it.
   */
  { "@media (prefers-reduced-motion: no-preference)": {
    ".mk-explorer-stage > [role=\"tabpanel\"]": {
      "animation": "mk-swap 320ms var(--mk-ease) backwards",
    },
  } },
  { "@keyframes mk-swap": {
    "from": {
      "opacity": "0",
      "translate": "0 10px",
    },
  } },
  { "@media (min-width: 64rem)": {
    ".mk-explorer-stage": {
      "min-block-size": "32rem",
    },
  } },
  { ".mk-explorer-panel": {
    "border-radius": "var(--mk-r-feature)",
    "background": "var(--surface-0)",
    "box-shadow": "var(--lift-card)",
    "padding": "clamp(20px, 3vw, 32px)",
  } },
  /* The panel owns its own focus ring: it is focusable for the reason the
   component's note gives, and a 0-offset outline would sit under the
   card's own shadow. */
  { ".mk-explorer-stage > [role=\"tabpanel\"]:focus-visible": {
    "outline": "2px solid var(--accent)",
    "outline-offset": "3px",
    "border-radius": "var(--mk-r-feature)",
  } },
  /*
   * A mock on a white panel.
   *
   * Six of the nine views are white cards, and a white card on a white panel
   * is an edge nobody can see. Inside the stage they sit on the page's own
   * ground instead, which puts the same 1px of contrast back without giving
   * the picture a second frame.
   */
  { ".mk-explorer-shot": {
    "border-radius": "var(--radius-card)",
    "background": "var(--canvas)",
    "padding": "clamp(12px, 2vw, 20px)",
  } },
];
