export const navStyles = [
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
      "transition-duration": "160ms",
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
    "color": "var(--accent-text)",
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
    "color": "var(--accent-text)",
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
];
