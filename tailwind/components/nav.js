export const navStyles = [
  /*
   * The header, as the brief draws it: no bar, a fade -- and now a blur.
   *
   * The site header was an opaque `--canvas` band with a 1px rule under it.
   * The brief asks for a transparent header that content scrolls *under*,
   * with "a subtle top-down black gradient behind it so text stays
   * readable" -- so the band is a gradient that is solid at the top edge and
   * gone by the bottom, and the rule went away. Scrolled content fades out
   * under it instead of hitting a line.
   *
   * ── The blur, and why it is on a pseudo-element ──────────────────────────
   *
   * Asked for on 19 Nov 2026. This file and `Header.tsx` both said it could
   * never come back, and the reason they gave was real but was a reason about
   * *where*, not about *whether*: `backdrop-filter` makes an element the
   * containing block for its `position: fixed` descendants, and the phone
   * menu is a fixed descendant of this header. Filtering the header itself
   * sized that panel against a 64px box instead of the viewport, and it
   * collapsed to nothing.
   *
   * A pseudo-element has no descendants. `::before` carries the filter, the
   * header does not, and the phone sheet goes on resolving against the
   * viewport -- which `check:nav` opens and closes on every build.
   *
   * `color-mix` in oklab rather than a second rgba, so the midpoint is
   * perceptually halfway and the fade has no grey band in the middle. The
   * tint is lighter than it was (82% at the top, not 100%) because an opaque
   * top edge is a blur you cannot see.
   */
  { ".mk-site-header": {
    "position": "sticky",
    "inset-block-start": "0",
    "z-index": "50",
    "background":
      "linear-gradient(to bottom,\n    color-mix(in oklab, var(--canvas) 82%, transparent) 0%,\n    color-mix(in oklab, var(--canvas) 58%, transparent) 58%,\n    transparent 100%)",
  } },
  /*
   * The blurred backdrop, behind the tint and behind the bar's own content.
   *
   * `z-index: -1` inside the header's own stacking context (it is sticky with
   * `z-index: 50`, so it has one): the pseudo paints under the header's
   * background and its children, and over the page scrolling beneath. That
   * ordering is the point -- the blur samples the page, the gradient tints
   * the blur, and the logo and the links sit on top of both.
   *
   * Masked, not cut. A `backdrop-filter` ends at its own box edge, and an
   * abrupt end to a blur is a seam exactly like the one the hero had: the
   * mask runs it out over the bottom 30% so the sharpening is gradual and
   * lands where the tint has already gone.
   *
   * `saturate` with the blur because a blur alone washes the accent out of
   * whatever passes under it, and the one thing passing under this header is
   * a page whose only colour is the accent.
   */
  { ".mk-site-header::before": {
    "content": "\"\"",
    "position": "absolute",
    "inset": "0",
    "z-index": "-1",
    "pointer-events": "none",
    "-webkit-backdrop-filter": "blur(14px) saturate(140%)",
    "backdrop-filter": "blur(14px) saturate(140%)",
    "mask-image": "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
  } },
  /*
   * ── The phone sheet ──────────────────────────────────────────────────────
   *
   * It used to appear and disappear on the `hidden` attribute, which is not a
   * state anything can animate between -- `hidden` removes the box, so there
   * is no "before" for a transition to start from. The panel is always in the
   * DOM now and `data-open` is the state.
   *
   * `visibility`, not `display`, for the closed state: it takes the sheet's
   * links out of the tab order and out of the accessibility tree exactly as
   * `hidden` did, and unlike `display` it can be *delayed*, which is what
   * lets the sheet fade out before it stops existing. That is the whole of
   * the `visibility 0s 240ms` below -- the property flips after the fade
   * rather than at the start of it.
   */
  { ".mk-nav-sheet": {
    "position": "fixed",
    "inset-inline": "0",
    "inset-block-end": "0",
    "z-index": "40",
    "overflow-y": "auto",
    "overscroll-behavior": "contain",
    "background": "var(--canvas)",
    "border-block-start": "1px solid var(--hairline)",
    "opacity": "0",
    "translate": "0 -0.75rem",
    "visibility": "hidden",
    "transition":
      "opacity 260ms var(--ease-smooth),\n    translate 320ms var(--ease-smooth),\n    visibility 0s 340ms",
  } },
  { ".mk-nav-sheet[data-open=\"true\"]": {
    "opacity": "1",
    "translate": "0 0",
    "visibility": "visible",
    "transition":
      "opacity 320ms var(--ease-out-expo),\n    translate 460ms var(--ease-out-expo),\n    visibility 0s",
  } },
  /*
   * The rows arrive one after another, and only on the way in.
   *
   * `backwards` so a row is in its start state through its own delay rather
   * than flashing at full opacity and then being animated. `--i` is set on
   * each row by MobileNav.tsx -- an index, not a nth-child rule, because the
   * sheet's rows are a mix of `<li>`s with different contents and a
   * `:nth-child` ramp would have to be rewritten every time one moves.
   *
   * 60ms a row, capped by the markup at the tenth: the sheet has about a
   * dozen rows and anything past 600ms is a queue rather than a cascade,
   * which is the same number `.mk-seq-load` settled on. Both were 2/3 of
   * this until the page was slowed by half on 19 Nov 2026.
   *
   * Scoped to `[data-open="true"]`, so closing is the sheet's own fade and
   * not twelve rows leaving separately.
   */
  { ".mk-nav-sheet[data-open=\"true\"] .mk-nav-row": {
    "animation": "mk-nav-row 560ms var(--ease-out-expo) backwards",
    "animation-delay": "calc(90ms + var(--i, 0) * 60ms)",
  } },
  { "@keyframes mk-nav-row": {
    "from": {
      "opacity": "0",
      "translate": "0 0.625rem",
    },
  } },
  /*
   * The accordions inside it.
   *
   * A `<details>` cannot transition its own open state -- the content is in
   * the box or it is not -- so the animation is on the contents, which exist
   * only while it is open. `grid-template-rows: 0fr -> 1fr` is the one way to
   * animate to a height nothing has measured; the child needs `min-height: 0`
   * or it refuses to be smaller than its content.
   */
  { ".mk-nav-fold": {
    "display": "grid",
    "grid-template-rows": "1fr",
    "animation": "mk-nav-fold 380ms var(--ease-out-expo)",
  } },
  { ".mk-nav-fold > *": {
    "min-block-size": "0",
  } },
  { "@keyframes mk-nav-fold": {
    "from": {
      "grid-template-rows": "0fr",
      "opacity": "0",
    },
  } },
  /* The chevron turns, and the burger turns into a cross. */
  { ".mk-nav-chev": {
    "transition": "rotate 320ms var(--ease-out-expo)",
  } },
  { "details[open] > summary .mk-nav-chev": {
    "rotate": "180deg",
  } },
  { ".mk-nav-toggle-icon": {
    "display": "grid",
    "place-items": "center",
    "transition": "rotate 380ms var(--ease-out-expo)",
  } },
  { ".mk-nav-toggle[aria-expanded=\"true\"] .mk-nav-toggle-icon": {
    "rotate": "90deg",
  } },
  /*
   * Nothing moves for a reader who asked for stillness. The sheet still
   * opens and closes; it simply arrives rather than travels.
   */
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-nav-sheet, .mk-nav-sheet[data-open=\"true\"]": {
      "transition": "opacity 120ms linear, visibility 0s",
      "translate": "0 0",
    },
    ".mk-nav-sheet[data-open=\"true\"] .mk-nav-row, .mk-nav-fold": {
      "animation": "none",
    },
    ".mk-nav-chev, .mk-nav-toggle-icon": {
      "transition": "none",
    },
  } },
  /* The navigation and its menus. Registered by tailwind.config.js, in order. */
  /* ── The navigation, and the one card behind its three menus ─────────────
   *
   * The header's menus used to be a full-container slab that appeared and
   * disappeared. Each one was a separate object: open Solutions, close it, open
   * Platform, and the page had shown you two unrelated rectangles with nothing
   * to say they were the same piece of furniture.
   *
   * They are one object now. `.mk-nav-frame` is a single decorative element —
   * the white card, the radius and the lift, and nothing else — and the panels
   * paint no background at all. Nav.tsx measures whichever panel is open and
   * hands the frame its width, height and offset in pixels, so moving from one
   * menu to the next resizes and slides the card that is already on screen
   * instead of swapping it for another one.
   *
   * Pixels, and a `translate`, because that is the only way this animates:
   * `inline-size: max-content` has no value to interpolate from, and a logical
   * inset cannot be transitioned against a different logical inset without the
   * card travelling through a layout pass on every frame.
   *
   * Three rules keep the frame honest. It is `aria-hidden` and
   * `pointer-events: none`, so nothing is ever read from it or clicked on it.
   * It is first in the DOM and sets no `z-index`, so the panels paint over it
   * by document order and there is no stacking context to maintain. And it
   * carries no content, so if the measurement never ran — JavaScript off, an
   * old browser, a panel that was never opened — the menus still work; they are
   * simply unlit.
   */
  { ".mk-nav": {
    "position": "relative",
  } },
  /* The bar's own items: a nav link, and a trigger that is one with a chevron.
   Both are 15px/500 at 64% ink, the header's resting weight. */
  { ".mk-nav-link": {
    "display": "inline-flex",
    "align-items": "center",
    "gap": "0.375rem",
    "border-radius": "var(--mk-r-button)",
    "padding-block": "0.5rem",
    "padding-inline": "0.75rem",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "color": "var(--text-muted)",
    "transition": "color var(--mk-dur-fast) var(--mk-ease)",
  } },
  { ".mk-nav-link:hover, .mk-nav-trigger[data-open=\"true\"]": {
    "color": "var(--text)",
  } },
  /*
   * The frame.
   *
   * `calc(100% + 0.875rem)` is the gap under the nav, and it is the header's
   * own padding rather than a number picked for this element — the panel hangs
   * off the bar, not off the trigger, so the distance that reads as "attached"
   * is the one the header already uses. Nav.tsx's CLOSE_DELAY is what carries a
   * pointer across it.
   */
  { ".mk-nav-frame": {
    "position": "absolute",
    "inset-inline-start": "0",
    "inset-block-start": "calc(100% + 0.875rem)",
    "inline-size": "var(--mk-nav-w, 0px)",
    "block-size": "var(--mk-nav-h, 0px)",
    "translate": "var(--mk-nav-x, 0px) 0",
    "border-radius": "var(--radius-card)",
    "background": "var(--surface-0)",
    "box-shadow": "var(--lift-card)",
    "opacity": "0",
    "transform": "translateY(-0.5rem)",
    "pointer-events": "none",
    "transition": "opacity var(--mk-dur-fast) var(--mk-ease),\n    transform var(--mk-dur-base) var(--mk-ease)",
  } },
  { ".mk-nav[data-nav-open=\"true\"] > .mk-nav-frame": {
    "opacity": "1",
    "transform": "none",
  } },
  /* The list is a tenth of the width of a mega panel, and the site's 28px card
   corner on a 200px box curves through its first and last row. */
  { ".mk-nav[data-nav-kind=\"list\"] > .mk-nav-frame": {
    "border-radius": "var(--radius-widget)",
  } },
  /*
   * Geometry animates on a menu-to-menu move and at no other time.
   *
   * `data-nav-morph` is set by Nav.tsx and is true only when a panel was
   * already on screen when this one opened. Without that condition the first
   * open of the session would unfold the card out of a 0×0 point, and every
   * re-measure — a window resize, the Arabic face arriving — would animate a
   * correction the reader never asked for.
   */
  { ".mk-nav[data-nav-morph=\"true\"] > .mk-nav-frame": {
    "transition": "opacity var(--mk-dur-fast) var(--mk-ease),\n    transform var(--mk-dur-base) var(--mk-ease),\n    inline-size 200ms var(--mk-ease),\n    block-size 200ms var(--mk-ease),\n    border-radius 200ms var(--mk-ease),\n    translate 200ms var(--mk-ease)",
  } },
  /*
   * A panel: contents only, positioned against the nav root so that it shares
   * one coordinate system with the frame.
   *
   * `max-block-size` with its own scroll, because the panel is absolutely
   * positioned inside a sticky header and therefore travels with the header
   * rather than with the page — anything taller than the viewport would not be
   * below the fold, it would be unreachable. That is exactly what happened
   * between 768px and 1024px before the columns stopped stacking, and it would
   * still happen in any short window.
   */
  /*
   * The bridge across the gap, on the nav rather than on the panel.
   *
   * The panel sits 0.875rem below the trigger row, and that strip is dead
   * space: leaving a trigger starts the close timer, and only re-entering the
   * nav cancels it. Crossing 14px is then a race between the pointer and the
   * timer, and `check:nav` was losing it about half the time -- reporting the
   * Arabic "Resources" panel closed 64-71% of the way to its first link.
   *
   * -- Why the obvious place does not work -----------------------------------
   *
   * The first attempt put this on `.mk-nav-panel::before`, offset upward into
   * the gap. It never received a single pointer event: the panel carries
   * `overflow-y: auto`, and a pseudo-element positioned outside its host's box
   * is clipped by the host's own overflow. Tracing the crossing with
   * `elementFromPoint` is what showed it -- through the whole gap the topmost
   * element was the header's container, never the panel.
   *
   * `.mk-nav` is the panel's positioned ancestor, is not clipped, and spans
   * every trigger, so one strip under the whole row closes the gap for all of
   * them. Only while something is open, so it never sits over the page when
   * the nav is at rest.
   */
  { ".mk-nav[data-nav-open=\"true\"]::after": {
    "content": "\"\"",
    "position": "absolute",
    "inset-block-start": "100%",
    "inset-inline": "0",
    "block-size": "0.875rem",
  } },
  { ".mk-nav-panel": {
    "position": "absolute",
    "inset-inline-start": "0",
    "inset-block-start": "calc(100% + 0.875rem)",
    "inline-size": "max-content",
    "max-inline-size": "var(--mk-nav-max, 60rem)",
    "max-block-size": "calc(100vh - var(--mk-header-h) - 2.5rem)",
    "translate": "var(--mk-nav-x, 0px) 0",
    "overflow-x": "hidden",
    "overflow-y": "auto",
    "overscroll-behavior": "contain",
  } },
  { ".mk-nav[data-nav-morph=\"true\"] .mk-nav-panel": {
    "transition": "translate 200ms var(--mk-ease)",
  } },
  /*
   * The contents cross-fade over the morphing card.
   *
   * `transition-behavior: allow-discrete` is what makes this possible against
   * the `hidden` attribute: it holds `display` at its old value for the length
   * of the fade, so the panel being closed is still painted while it goes to
   * zero and the one being opened starts from `@starting-style` rather than
   * appearing at full strength over a card that is still the wrong size.
   *
   * Longhand, not the `transition` shorthand. A browser that does not know
   * `allow-discrete` drops this one declaration and gets a cross-fade with a
   * hard `display` switch in the middle of it; the same thing written as a
   * shorthand would be invalid in full, and the fade would be lost everywhere.
   *
   * `pointer-events` goes off the moment a panel is no longer the open one, so
   * the few frames it spends fading out cannot swallow a click meant for what
   * is underneath.
   */
  { "@media (prefers-reduced-motion: no-preference)": {
    ".mk-nav-panel": {
      "transition-property": "opacity, display",
      "transition-duration": "230ms",
      "transition-timing-function": "var(--mk-ease)",
      "transition-behavior": "allow-discrete",
    },
    ".mk-nav-panel[data-open=\"false\"]": {
      "opacity": "0",
      "pointer-events": "none",
    },
    "@starting-style": {
      ".mk-nav-panel[data-open=\"true\"]": {
        "opacity": "0",
      },
    },
  } },
  { ".mk-nav-body": {
    "display": "flex",
    "align-items": "stretch",
  } },
  /*
   * The rail.
   *
   * A menu that is only a list of destinations is a sitemap, and a sitemap
   * makes the visitor do the sorting. The rail says what the whole menu is for
   * before they read a single link, and ends with the one way in that does not
   * require choosing a column first.
   *
   * It is the panel's only tinted surface, and it runs the full height —
   * including past the strip — which is why it rounds both of its own start
   * corners rather than inheriting a clip from the frame it sits on.
   *
   * Below 80rem it is gone. Three columns and a rail want about 1080px; the
   * container gives 984 at the 1024px where this nav first appears, and
   * squeezing the rail in there takes the columns down to 181px, which is
   * narrower than a two-word title in either language.
   */
  { ".mk-nav-rail": {
    "display": "flex",
    "flex": "none",
    "flex-direction": "column",
    "inline-size": "13.5rem",
    "padding": "1.5rem",
    /* `--surface-3`, not `--surface-2`. The rail is a tint on white rather
     than on the page's near-white ground, so it starts with 2% less to work
     with than the same token has anywhere else on the site; at `--surface-2`
     it read as a rendering artefact rather than as a panel. The hairline is
     what actually draws the edge — the tint only warms the side it is on. */
    "background": "var(--surface-3)",
    "border-inline-end": "1px solid var(--hairline-strong)",
    "border-start-start-radius": "var(--radius-card)",
    "border-end-start-radius": "var(--radius-card)",
  } },
  { "@media (width < 80rem)": {
    ".mk-nav-rail": {
      "display": "none",
    },
  } },
  { ".mk-nav-rail-title": {
    "font-family": "var(--font-display)",
    "font-size": "var(--fs-h3)",
    "font-weight": "500",
    "line-height": "1.25",
    "letter-spacing": "-0.01em",
    "color": "var(--text)",
    "text-wrap": "balance",
  } },
  /* Arabic is never tracked, and sets at the Arabic display leading. */
  { "[dir=\"rtl\"] .mk-nav-rail-title": {
    "font-family": "var(--font-arabic)",
    "letter-spacing": "0",
    "line-height": "1.5",
  } },
  { ".mk-nav-rail-link": {
    /* Under the line, not pinned to the floor. A mega panel runs to 600px and
     a link pinned to the bottom of that is a second, unrelated control at
     the far end of an empty column; under the claim it reads as the sentence
     continuing into a destination. */
    "margin-block-start": "1.25rem",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    /*
     * Blue, as of 21 Nov 2026, at the owner's request.
     *
     * These two links -- this one and `.mk-nav-more` -- are the only ones in
     * the panel that leave it for a whole page rather than a feature, and
     * they were white like everything around them. `--mk-blue-ink` and not
     * `--accent`: the accent is the fill blue, about 2.2:1 on this ground and
     * illegible as type. `--mk-blue-ink` is the same hue solved for a dark
     * ground at about 8.4:1, and it is the token the footer's hover already
     * uses, so the site has one blue that is allowed to carry text and not
     * two.
     */
    "color": "var(--mk-blue-ink)",
  } },
  /*
   * `minmax(0, 15rem)` and not `15rem`.
   *
   * The panel is `max-content` wide, so a fixed track gives it its natural
   * width — three columns at 240px — and that is the measurement the frame is
   * drawn from. The `0` floor is what happens afterwards: when `--mk-nav-max`
   * clamps the panel on a narrower window the tracks have somewhere to go, and
   * the columns tighten instead of the panel overflowing the gutter.
   */
  { ".mk-nav-cols": {
    "display": "grid",
    "flex": "1 1 auto",
    "min-inline-size": "0",
    "grid-template-columns": "repeat(var(--mk-nav-cols, 3), minmax(0, 15rem))",
    "gap": "1.5rem",
    "padding-block": "1.5rem",
    "padding-inline": "1.25rem",
  } },
  /* 0.75rem of inline padding on every heading and link in the columns, so the
   text sits on one line down the panel while a row's hover fill is wider
   than the text it covers. */
  { ".mk-nav-group": {
    "padding-inline": "0.75rem",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "color": "var(--text)",
  } },
  { ".mk-nav-rows": {
    "display": "grid",
    "gap": "0.125rem",
  } },
  /*
   * The rule under a column's head, where there is one.
   *
   * A heading and a row title are both 15px/500 in the page's own ink — they
   * have to be, because a column head that is quieter than the rows under it
   * stops being a heading — so what separates them cannot be weight or colour.
   * Without this line the first solution in each column read as a fourth
   * audience, and the description that used to sit between them is gone, so it
   * is now the only thing holding them apart.
   *
   * Scoped to `data-labelled`, because the Platform menu has no headings to
   * separate from anything: an unattached rule across the top of a column of
   * modules is a lid, not a division.
   */
  { ".mk-nav-cols[data-labelled=\"true\"] .mk-nav-rows": {
    "margin-block-start": "0.875rem",
    "padding-block-start": "0.875rem",
    "border-block-start": "1px solid var(--hairline)",
  } },
  { ".mk-nav-row": {
    "display": "block",
    "border-radius": "var(--radius-widget)",
    "padding-block": "0.5rem",
    "padding-inline": "0.75rem",
    "transition": "background-color var(--mk-dur-fast) var(--mk-ease)",
  } },
  { ".mk-nav-row:hover": {
    "background": "var(--surface-2)",
  } },
  { ".mk-nav-row-title": {
    "display": "block",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "color": "var(--text)",
  } },
  { ".mk-nav-row-line": {
    "display": "block",
    "margin-block-start": "0.125rem",
    "font-size": "var(--fs-eyebrow)",
    "line-height": "1.45",
    "color": "var(--text-muted)",
  } },
  { ".mk-nav-more": {
    "display": "inline-block",
    "margin-block-start": "0.75rem",
    "padding-inline": "0.75rem",
    "font-size": "var(--fs-eyebrow)",
    "font-weight": "500",
    /* Blue, for the reason given on `.mk-nav-rail-link` just above. */
    "color": "var(--mk-blue-ink)",
  } },
  /* The underline is drawn at rest in transparent and fades in, so it eases
     like every other hover here instead of snapping (see
     `.mk-underline-reveal` in buttons.js, the same move). */
  { ".mk-nav-rail-link, .mk-nav-more": {
    "text-decoration-line": "underline",
    "text-decoration-color": "transparent",
    "text-underline-offset": "0.25em",
    "transition": "text-decoration-color var(--mk-dur-fast) var(--mk-ease)",
  } },
  { ".mk-nav-rail-link:hover, .mk-nav-more:hover": {
    "text-decoration-color": "currentColor",
  } },
  /* Resources: four approved labels and no descriptions under them, so it is a
   list and not a third mega menu. It keeps the same frame. */
  { ".mk-nav-list": {
    "min-inline-size": "12.5rem",
    "padding": "0.625rem",
  } },
  { ".mk-nav-list-link": {
    "display": "block",
    "border-radius": "var(--radius-widget)",
    "padding-block": "0.5rem",
    "padding-inline": "0.75rem",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "color": "var(--text-muted)",
    "transition": "background-color var(--mk-dur-fast) var(--mk-ease),\n    color var(--mk-dur-fast) var(--mk-ease)",
  } },
  { ".mk-nav-list-link:hover": {
    "background": "var(--surface-2)",
    "color": "var(--text)",
  } },
  /*
   * Reduced motion.
   *
   * The card still appears, still in the right place and at the right size —
   * it simply arrives rather than travelling. Nothing here reports anything the
   * reader could not see without it, so unlike the page's scroll layer there is
   * no piece of this worth keeping.
   */
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-nav-frame, .mk-nav[data-nav-morph=\"true\"] > .mk-nav-frame, .mk-nav[data-nav-morph=\"true\"] .mk-nav-panel": {
      "transition": "none",
    },
    ".mk-nav-frame": {
      "transform": "none",
    },
  } },

  /* ── The announcement bar ───────────────────────────────────────────────
   *
   * Deck v4.1 §1.1: full width, centred, above the nav, on every page. It is
   * in normal flow before `.mk-site-header`, which is sticky, so it scrolls
   * away and the nav pins behind it with no offset anywhere.
   *
   * 32px, not the deck's 40 (21 Nov 2026). The owner asked for a smaller
   * bar. The height came out of the clock rather than out of the type: the
   * cells were a figure stacked over its unit, two lines that could not be
   * compressed because the lower one is already at the site's 12px floor.
   * Laid out as a row -- `05 days`, baseline-aligned -- the clock is one
   * line, and one line of 13px type with 2px of padding is a 32px bar. The
   * type did not shrink; the geometry did.
   *
   * It is the one place on this site the accent is a flat fill. §1.4 of the
   * design system reserves blue for light -- glow, edge, focus, progress --
   * and bans it as a section fill, and that rule holds for sections. This is
   * not a section: it is a single 40px strip of chrome above the page whose
   * entire job is to be seen before anything else, and giving it a panel
   * fill would make it a second header. It is the only exception, it is
   * forty pixels tall, and it disappears when the offer closes.
   */
  { ".mk-announce": {
    "position": "relative",
    "z-index": "60",
    "display": "flex",
    "align-items": "center",
    "justify-content": "center",
    "gap": "0.5rem",
    "min-block-size": "2rem",
    "padding-block": "0.125rem",
    /* Room for the close button at the end edge, so a long line never runs
       under it. Logical, so it swaps sides with the locale. */
    "padding-inline": "2.75rem",
    "background": "var(--accent)",
    "color": "#FFFFFF",
    "font-size": "var(--fs-eyebrow)",
    "text-align": "center",
  } },
  { ".mk-announce-link": {
    "display": "flex",
    "flex-wrap": "wrap",
    "align-items": "center",
    "justify-content": "center",
    "gap": "0.375rem 0.75rem",
    "color": "inherit",
    "text-decoration": "none",
    "font-weight": "500",
  } },
  { ".mk-announce-link:hover": {
    "text-decoration": "underline",
    "text-underline-offset": "0.2em",
  } },
  /* The deck writes two wordings, long and short below 810px. Both are in
     the markup and CSS picks -- a width measured in JavaScript would paint
     the wrong one first. 50.625rem is 810px, the same breakpoint the hero
     and the nav already switch at. */
  { ".mk-announce-short": {
    "display": "none",
  } },
  { "@media (width < 50.625rem)": {
    ".mk-announce-long": { "display": "none" },
    ".mk-announce-short": { "display": "inline" },
    ".mk-announce-cta": { "display": "none" },
  } },
  /*
   * No clock on a phone.
   *
   * Measured at 390px: the short line is 143px in Arabic and about 190 in
   * English, the clock is 223 (its "ends in" label plus four cells), the
   * gutters take 104 for the close button, and the bar is 390 wide. It
   * wrapped -- the line above the clock, the bar 79px tall instead of 40,
   * and `check:align` flagged it on all 51 Arabic routes, because a
   * two-line flex row reads as a row that kept its English order.
   *
   * Three ways out and only one of them is honest. Dropping the cells to
   * days and hours still did not fit once the close button's 44px coarse
   * target is paid for. Dropping the clock's own label fitted, and made a
   * bar that counts down without saying whether it is counting to the
   * offer opening or to it closing -- an ambiguous clock on a promotion is
   * worse than no clock.
   *
   * So below 36rem the bar is the deck's bar: one short line, 40px, and a
   * tap through to /pricing, where the offer block has the room to carry
   * the countdown properly. The clock stays on every width that can hold
   * it, which is tablets up.
   */
  { "@media (width < 36rem)": {
    ".mk-announce .mk-offer-clock": { "display": "none" },
  } },
  /* The countdown, on the accent rather than on the page: its cells take a
     white veil instead of `--surface-2`, which on blue would read as a hole
     punched in the bar. */
  { ".mk-announce .mk-offer-cell": {
    /*
     * A row, not a column.
     *
     * Everywhere else a cell is a figure over its unit, which is what a
     * countdown looks like when it has a block to itself. In a 32px strip
     * that stack *is* the height, so here the two sit on one line against a
     * shared baseline. `min-inline-size` goes back to auto: the floor on the
     * stacked cell exists to keep four narrow columns even, and a row cell
     * is already as wide as its own label.
     */
    "display": "flex",
    "flex-direction": "row",
    "align-items": "baseline",
    "gap": "0.25rem",
    "background": "rgba(255,255,255,0.16)",
    "box-shadow": "none",
    "padding-block": "0",
    "padding-inline": "0.375rem",
    "min-inline-size": "auto",
  } },
  { ".mk-announce .mk-offer-cell b": {
    "font-size": "0.8125rem",
    "color": "#FFFFFF",
  } },
  { ".mk-announce .mk-offer-cell small, .mk-announce .mk-offer-clock-label, .mk-announce .mk-offer-window": {
    "color": "rgba(255,255,255,0.82)",
  } },
  { ".mk-announce .mk-offer-cell small": {
    "line-height": "1",
  } },
  { ".mk-announce .mk-offer-clock": {
    "gap": "0.375rem 0.5rem",
  } },
  /* The label that stands in for the deck's arrow — see AnnouncementBar.tsx.
     Underlined at rest, because it is the one part of the bar that states
     the action, and hidden with the long wording below 810px where the bar
     is already carrying its short line and a clock. */
  { ".mk-announce-cta": {
    "text-decoration": "underline",
    "text-underline-offset": "0.2em",
  } },
  { ".mk-announce-close": {
    "position": "absolute",
    "inset-inline-end": "0.5rem",
    "inset-block-start": "50%",
    "translate": "0 -50%",
    "display": "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    /* 32px, which is the smallest this site lets a control be, and it grows
       to 44 on a coarse pointer like every other one. */
    "inline-size": "2rem",
    "block-size": "2rem",
    "border-radius": "var(--radius-widget)",
    "color": "rgba(255,255,255,0.82)",
    "transition": "background-color 120ms var(--mk-ease), color 120ms var(--mk-ease)",
  } },
  { ".mk-announce-close:hover": {
    "background": "rgba(255,255,255,0.16)",
    "color": "#FFFFFF",
  } },
  /*
   * On a coarse pointer the bar keeps its old height.
   *
   * The close button grows to 44px there, like every other control on this
   * site, and a 44px target centred on a 32px strip hangs 6px over the
   * header below it. So the bar is 32px where it is clicked and 44 where it
   * is tapped -- the control sets the floor, not the decoration.
   */
  { "@media (pointer: coarse)": {
    ".mk-announce": { "min-block-size": "2.75rem" },
    ".mk-announce-close": { "inline-size": "2.75rem", "block-size": "2.75rem" },
  } },
];
