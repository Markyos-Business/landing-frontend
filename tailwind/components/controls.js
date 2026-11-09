export const controlsStyles = [
  /* Controls: fills, bands, tables and the billing switch. Registered by tailwind.config.js, in order. */
  /* ── Controls ────────────────────────────────────────────────────────────── */
  /*
   * The primary action: flat white, black label.
   *
   * No gradient and no hover colour of its own. Every filled control on this
   * site states hover and press the same way — one 35% black scrim laid over
   * the resting fill by `.mk-btn::after` — so a variant only has to declare
   * what it looks like at rest.
   */
  { ".mk-solid": {
    "background": "var(--solid)",
    "color": "var(--solid-ink)",
  } },
  /*
   * The secondary action.
   *
   * "The fill is the affordance, and an edge as well would read as two" was true
   * on the black site, where `--surface-2` was #1A1A1A against a #000 ground — a
   * step you could see. Re-pointed for the light page it is #F4F6FA against
   * #F7F8FA, which is a 1.01:1 step: the fill stopped being an affordance and
   * these buttons became floating labels. The second CTA beside the closing ask
   * on nine pages, and the plan buttons on /pricing, were all reading as text.
   *
   * So the edge is the affordance now, and the fill is white — which also means
   * the control reads the same whether its section is on the ground or on the
   * white band, where a tinted fill would have had the opposite problem.
   */
  { ".mk-outline": {
    "background": "var(--surface-1)",
    "border": "0",
    "box-shadow": "0 0 0 1px var(--hairline-strong)",
    "color": "var(--text)",
  } },
  /*
   * …and its press scrim runs the other way.
   *
   * `.mk-btn::after` lays white at 14% over the resting fill, which is the right
   * direction for the solid CTA (near-black) and no direction at all on a white
   * one. One variant, one override — the rest of the state model is unchanged.
   */
  { ".mk-btn.mk-outline::after": {
    "background": "rgba(11, 11, 15, 0.05)",
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
    "background": "#fff",
    "box-shadow": "0 0 0 1px rgba(11, 11, 15, 0.04)",
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
