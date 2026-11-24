export const controlsStyles = [
  /* Controls: fills, bands, tables and the billing switch. Registered by tailwind.config.js, in order. */
  /* ── Controls ────────────────────────────────────────────────────────────── */
  /*
   * The primary action: the electric blue, white label.
   *
   * White-on-near-black until 18 Nov 2026. The brief makes the one accent the
   * primary button, and white on this blue measures about 8.6:1, so the label
   * is comfortable at 13px as well as 15.
   *
   * The inset lip is the brief's detail and worth keeping: a 1px white
   * highlight along the top edge at 22%, which reads as a light source above
   * the page and is the difference between a blue rectangle and a button.
   */
  { ".mk-solid": {
    "background": "var(--solid)",
    "color": "var(--solid-ink)",
    "box-shadow": "var(--solid-lip)",
  } },
  /*
   * The secondary action: a ghost fill, no edge.
   *
   * This has now been three things. On the black site it was `--surface-2`
   * (#1A1A1A on #000), a step you could see. Re-pointed for the light page it
   * became #F4F6FA on #F7F8FA -- a 1.01:1 step, so the fill stopped being an
   * affordance and these buttons read as floating labels; the fix then was to
   * make the edge the affordance.
   *
   * On this ground the fill works again, and the brief is explicit that the
   * secondary button has a fill and *no* border: white at 8% over a near-black
   * page is a clearly visible object, and dropping the ring means the two CTAs
   * beside each other differ by fill alone, which is what makes the pair read
   * as one control with a primary.
   */
  { ".mk-outline": {
    "background": "var(--ghost-fill)",
    "border": "0",
    "color": "var(--text)",
  } },
  /*
   * The white band.
   *
   * The light page alternates ground and white every section — the homepage does
   * it fourteen times — and that alternation is what makes a 120px gap between
   * two sections read as a chapter break rather than as a hole. The data-driven
   * pages had neither: one flat #F7F8FA field from the breadcrumb to the footer,
   * separated by a 1px rule, with 200px of nothing at every boundary.
   *
   * A shadow rather than a border, so the band's own height is unchanged and the
   * edge cannot be covered by a child.
   */
  { ".mk-band": {
    /* The lighter field, not a white one. On the light page the ground was
       #F7F8FA and the band was white; on this ground the band is the card
       surface, so the alternation still reads the same way round -- the band
       is always the lighter of the two -- instead of being a sheet of white
       across a near-black page. */
    "background": "var(--surface-1)",
    "box-shadow": "0 0 0 1px rgba(255, 255, 255, 0.064)",
  } },
  /*
   * Centre an absolutely-positioned decoration on the inline axis.
   *
   * `inset-inline-start: 50%` flips with the locale; `translateX(-50%)` never
   * does, and CSS has no logical translate — so the pair that every centred
   * glow on this site was written with put the glow half its own width off on
   * the Arabic page. `--mk-dir` carries the sign, as it does for the pricing
   * toggle's knob and the funnel's tiles.
   */
  { ".mk-center-x": {
    "inset-inline-start": "50%",
    "translate": "calc(-50% * var(--mk-dir)) 0",
    /* …and the same offset again for `.mk-drift`, whose keyframes replace the
     whole `translate` property. See the drift block's note. */
    "--mk-drift-x": "calc(-50% * var(--mk-dir))",
  } },
  /*
   * The table shell.
   *
   * A wide table is the one thing on these pages that genuinely cannot stack, so
   * it scrolls sideways — and the frame around a scroll region is what tells a
   * reader there is more of it. The homepage's answer is a white card lifted off
   * the ground with 10px of its own padding, so the first and last rows do not
   * touch the corner radius; a 1px border round an 11-row comparison drew a box
   * nobody needed and sat flat on a ground it was the same weight as.
   *
   * Inside, the rows are separated by an alternating tint rather than by rules.
   * Odd rows take the canvas colour, so the table reads the same way whether its
   * section is on the ground or on the white band.
   */
  /*
   * The shell a wide table scrolls inside.
   *
   * ── `overflow-y: clip` is load-bearing, and it is about motion ──────────
   *
   * The callers set `overflow-x: auto` so a 860px table can be swiped on a
   * phone. CSS then computes the *other* axis from `visible` to `auto`, because
   * `visible` is not a possible computed value beside a scrolling axis — so the
   * shell silently became a scroll container on the block axis too, and every
   * `animation-timeline: view()` inside it resolved against a box that never
   * scrolls. That is the trap `.mk-card` documents and it cost the row reveals
   * their timeline: `.mk-seq-rows` measured against the shell sat at 100%
   * progress and did nothing.
   *
   * `clip` clips without being scrollable, and `auto` beside `clip` is a legal
   * pair that stays as specified — so the table still swipes sideways, nothing
   * scrolls vertically, and the rows' timeline resolves against the document
   * where it belongs. Nothing is clipped in practice: a table is exactly as
   * tall as its rows.
   */
  { ".mk-table-shell": {
    "background": "var(--surface-1)",
    "border-radius": "var(--radius-card)",
    "box-shadow": "var(--lift-card)",
    "padding": "10px",
    "overflow-y": "clip",
  } },
  /*
   * Monthly or yearly, decided in CSS.
   *
   * Every paid plan renders both of its amounts — see `src/components/public/pages/
   * BillingSwitch.tsx` for why they are both in the HTML — and the switch sets
   * one attribute on the wrapper around the head and the grid. These two rules
   * are the whole mechanism: no price is re-rendered, nothing is measured, and
   * a card stays a server component.
   *
   * An element with no `data-bill` belongs to both cycles and is never hidden,
   * which is how the free plan keeps showing "مجاناً" on either setting.
   *
   * `display: none` rather than `visibility` or an opacity: a hidden amount
   * must leave the line, or the card would size itself to two prices and sit
   * half empty on whichever cycle is showing. It also takes the figure out of
   * the accessibility tree, which is the point — a screen reader on the
   * monthly setting should hear the monthly price and not both.
   */
  { "[data-billing=\"monthly\"] [data-bill=\"annual\"], [data-billing=\"annual\"] [data-bill=\"monthly\"]": {
    "display": "none",
  } },
];
