export const adminStyles = [
  /*
   * The Markyos skin for the Payload admin.
   *
   * ── Why this is a re-point and not a restyle ──────────────────────────────
   *
   * Payload's admin is built on about thirty theme variables — `--theme-bg`,
   * `--theme-elevation-N`, `--theme-text` — and every one of its own components
   * reads them. Re-pointing those is the same move `tailwind/tokens.js` makes for
   * the marketing site: one file decides the look, and nothing has to know the
   * difference. Writing rules against Payload's internal class names instead
   * would break on their next release, and there are a lot of them.
   *
   * So: almost no component selectors below, only variables, with the handful
   * of exceptions at the bottom that are genuinely ours (the brand mark's
   * sizing, the primary button, the reading measure) and are marked as such.
   *
   * ── Which palette, and why it changed ─────────────────────────────────────
   *
   * It used to be the platform app's dark one, read out of
   * `tailwind/tokens.generated.js`: #060607 ground, #16161a cards, a white-opacity
   * text ramp. The argument was that the admin is product UI and sits beside
   * the platform in somebody's day.
   *
   * That argument was written when markyos.com was a black site. It is not one
   * any more — the site was rebuilt to the light landing design on 3 Nov 2026,
   * and the admin is the only Markyos surface a person reaches *from* the site,
   * usually in the next tab. Side by side, a near-black panel and a paper site
   * read as two products. So the admin now follows the website:
   *
   *   paper ground, white cards lifted off it, one near-black ink at four
   *   steps, blue used as light rather than as a fill, 28px cards and 16px
   *   controls, Inter with the brand's character alternates, nothing heavier
   *   than 500.
   *
   * `tailwind/tokens.js` is registered before this (tailwind.admin.config.js) and is the only source of values here —
   * the same file the website's chrome, blog and data-driven pages read. There
   * are no literals below and no second palette to keep in step: when the
   * landing design moves, the admin moves with it.
   *
   * `tailwind/tokens.generated.js` is deliberately *not* imported any more. It
   * carries the platform's two palettes, and its `:root[data-theme="light"]`
   * block would outrank `tailwind/tokens.js`'s plain `:root` the moment Payload wrote
   * `data-theme="light"` onto <html> — the admin would have silently rendered
   * the platform's light theme (#eeeef2 ground, #0062b8 accent) instead of the
   * website's. Importing one palette is also the whole point.
   *
   * ── The elevation ramp runs the other way now ─────────────────────────────
   *
   * Payload's ramp is ordered back-to-front: `elevation-0` is furthest back and
   * `elevation-1000` furthest forward. On the old dark theme that meant it
   * climbed in lightness. On a light theme it falls — 0 is a surface and 1000
   * is the ink — which is why the numbers below descend.
   *
   * One departure from Payload's own light theme, and it is the design's: there
   * a white page carries grey cards, here a paper page carries white ones. The
   * landing design lifts a card by making it *lighter* than its ground and
   * floating it on a long soft shadow, and that inversion is most of what makes
   * the site look like itself.
   */
  { "html, html[data-theme=\"light\"], html[data-theme=\"dark\"]": {
    /*
     * Stated on all three selectors, not just `:root`.
     *
     * Payload writes `data-theme` onto <html>, and its own `html[data-theme=…]`
     * blocks are specificity (0,1,1) where a bare `:root` is (0,1,0) — so a
     * plain `:root` loses to them. Matching their shape wins on source order
     * instead. Naming the dark selector too means the panel stays this palette
     * even if a stored preference or a stray toggle sets `dark`: there is one
     * palette here, so there is nothing for a theme switch to switch to.
     */
    "color-scheme": "light",
    /* ground */
    "--theme-bg": "var(--canvas)",
    "--theme-input-bg": "var(--surface-0)",
    "--theme-border-color": "var(--hairline-strong)",
    /* Drawers and modals darken the page with the ink, not with a grey. */
    "--theme-overlay": "color-mix(in srgb, var(--text) 45%, transparent)",
    "--theme-elevation-0": "var(--surface-0)",
    /* white — the lowest object is still a card */
    "--theme-elevation-50": "var(--surface-0)",
    /* cards, the sidebar, table heads */
    "--theme-elevation-100": "var(--surface-2)",
    /* inputs, secondary buttons, hovers, tracks */
    /*
     * 150–350 are Payload's edges — table rules, input rings, collapsible
     * borders — with a few disabled labels and SVG strokes sharing the slots.
     *
     * They climb in ink rather than naming a grey, because the site draws every
     * edge as the one ink at a low alpha and never as a separate neutral. 150
     * is the site's own card edge; the rest are the firmer rules a dense table
     * needs, which a 7% hairline cannot carry at row height.
     */
    "--theme-elevation-150": "var(--hairline-strong)",
    /* card edges, row rules, input rings */
    "--theme-elevation-200": "color-mix(in srgb, var(--text) 16%, transparent)",
    "--theme-elevation-250": "color-mix(in srgb, var(--text) 22%, transparent)",
    "--theme-elevation-300": "color-mix(in srgb, var(--text) 26%, transparent)",
    "--theme-elevation-350": "color-mix(in srgb, var(--text) 34%, transparent)",
    /*
     * 400 is the panel's workhorse grey: 88 of Payload's rules set `color` from
     * it — field descriptions, placeholders, table meta, half the labels.
     *
     * Payload's own light value is #9a9a9a, which measures **2.85:1** on white
     * and fails AA at any size. It is pointed at the site's meta ink instead
     * (5.55:1 on white, 5.3:1 on the canvas) — the same token the website sets
     * captions and column heads in, so the admin's quiet text is as readable as
     * the site's. The cost is that the twenty-odd borders sharing this slot are
     * firmer than Payload draws them; that is the legible direction to err in.
     */
    "--theme-elevation-400": "var(--text-faint)",
    "--theme-elevation-450": "var(--text-faint)",
    "--theme-elevation-500": "var(--text-faint)",
    /* meta, captions */
    "--theme-elevation-550": "var(--text-muted)",
    "--theme-elevation-600": "var(--text-muted)",
    /* descriptions */
    "--theme-elevation-650": "var(--text-muted)",
    "--theme-elevation-700": "var(--text-secondary)",
    /* prose */
    "--theme-elevation-750": "var(--text-secondary)",
    "--theme-elevation-800": "var(--text-secondary)",
    "--theme-elevation-850": "var(--text)",
    "--theme-elevation-900": "var(--text)",
    "--theme-elevation-950": "var(--text)",
    "--theme-elevation-1000": "var(--text)",
    "--theme-text": "var(--text)",
    /*
     * Payload spends its `success` ramp on the primary action and on every
     * active state — the selected nav item, a checked box, the focus ring. On
     * this site that colour is the blue, and blue here is light rather than
     * ink: it marks what is live, it does not label anything.
     */
    "--theme-success-50": "var(--accent-soft)",
    "--theme-success-100": "var(--accent-soft)",
    "--theme-success-150": "color-mix(in srgb, var(--accent) 16%, transparent)",
    "--theme-success-200": "color-mix(in srgb, var(--accent) 22%, transparent)",
    "--theme-success-400": "var(--accent-edge)",
    "--theme-success-500": "var(--accent)",
    "--theme-success-600": "var(--accent)",
    "--theme-success-900": "var(--accent-on-soft)",
    /*
     * State hues: the light page's, not the design system's.
     *
     * §3 gives #FF0066 and #FFBB00, which were picked to glow on black and are
     * close to invisible as text on paper — the same arithmetic that made
     * `tailwind/tokens.js` re-point them. These read the re-pointed tokens, so the admin
     * and the site call an error the same colour.
     *
     * Each tint is mixed from its own token rather than written as a second
     * value, so there is only ever one definition of "error" to change.
     */
    "--theme-error-50": "color-mix(in srgb, var(--mk-state-rejected) 8%, transparent)",
    "--theme-error-100": "color-mix(in srgb, var(--mk-state-rejected) 14%, transparent)",
    "--theme-error-150": "color-mix(in srgb, var(--mk-state-rejected) 22%, transparent)",
    "--theme-error-500": "var(--mk-state-rejected)",
    "--theme-error-900": "var(--mk-state-rejected)",
    "--theme-warning-50": "color-mix(in srgb, var(--mk-state-expiring) 8%, transparent)",
    "--theme-warning-100": "color-mix(in srgb, var(--mk-state-expiring) 14%, transparent)",
    "--theme-warning-150": "color-mix(in srgb, var(--mk-state-expiring) 22%, transparent)",
    "--theme-warning-500": "var(--mk-state-expiring)",
    "--theme-warning-900": "var(--mk-state-expiring)",
    /*
     * Shape — the landing design's radii, which are much larger than the
     * platform's: 28 for a card, 16 for a control. `radius-s` is Payload's
     * smallest chrome (checkboxes, code spans) and has no token on the site, so
     * it is derived rather than invented: half a control's radius.
     */
    "--style-radius-s": "calc(var(--radius-widget) / 2)",
    "--style-radius-m": "var(--radius-widget)",
    "--style-radius-l": "var(--radius-card)",
  } },
  /*
   * Inter and Thmanya, the same two faces as the website.
   *
   * `--font-body` and `--font-serif` are Payload's names. The families
   * themselves are loaded by `src/app/fonts.ts` and reach this layout through
   * `cms/views/AdminFonts.tsx`, which declares `--font-inter`, `--font-thmanya`
   * and `--font-plex-arabic` on `:root` for the admin the way `src/app/[lang]`
   * declares them for the site. Before that existed, every Arabic string in the
   * panel — content locale labels, Arabic post titles, the Arabic UI — rendered
   * in a system fallback.
   *
   * The stack leads with `--font-latin` — Inter's own family, without the
   * metric-adjusted "Inter Fallback" that `--font-inter` carries behind it.
   * That ordering is the whole fix and the reason the variable exists: the
   * fallback is Arial on Windows, Arial has Arabic, and a stack that reaches it
   * before Thmanya paints every Arabic string in the panel in Arial while the
   * computed `font-family` still names the brand face. See the note in
   * AdminFonts.tsx, and the identical one in `tailwind/` at `:lang(ar)`.
   *
   * IBM Plex Sans Arabic is not named here and does not need to be: it is the
   * last-resort fallback inside `--font-arabic`, which the `:lang(ar)` rule
   * below uses. Naming it in this stack would put it where it could be reached
   * before Thmanya, which is the thing §2.1 forbids.
   */
  { ":root": {
    "--font-body": "var(--font-latin), var(--font-thmanya), var(--font-inter), system-ui,\n    -apple-system, sans-serif",
    "--font-serif": "var(--font-body)",
  } },
  /*
   * Declared Arabic is set in the Arabic face.
   *
   * `<html lang="ar">` when the panel's own language is Arabic, and this also
   * catches an Arabic island inside an English panel wherever one is marked up.
   * Keyed on language rather than direction because the thing that decides a
   * typeface is the language — and because Payload sets `lang`, not `dir`, from
   * the chosen admin locale. It has to outrank Payload's `body { font-family }`,
   * which it does: a declaration on `body` beats what its descendants inherit
   * from `<html>`, and `:lang(ar)` matches `body` itself at a higher
   * specificity than an element selector.
   */
  { ":lang(ar)": {
    "font-family": "var(--font-arabic)",
  } },
  /*
   * Inter's character alternates, as on the website (§1.5): a single-storey
   * "a" is not Markyos, and the admin sits beside the site in the same tab.
   */
  { "body": {
    "font-feature-settings": "\"cv01\", \"cv05\", \"cv09\", \"cv11\"",
  } },
  /*
   * Nothing above 500 (§13).
   *
   * Payload sets 600 and 700 on headings, table headers and buttons. This is
   * the one place a sweep by selector is better than a variable, because there
   * is no weight variable to re-point — and `:where()` keeps the specificity at
   * zero, so any component that genuinely needs its own weight still wins.
   */
  { ":where(h1, h2, h3, h4, h5, h6, th, legend, label, button, .btn, strong, b)": {
    "font-weight": "500",
  } },
  /*
   * ── The four rules below are ours, by selector, and say why ───────────────
   */
  /*
   * The primary action is the website's button: near-black, white label, pill.
   *
   * It used to be the design system's product blue with a glow (§10), which was
   * right when the admin was a dark panel sitting beside the platform. On the
   * site the one solid control is `--solid` — near-black — and blue is reserved
   * for light. Making the admin's primary button the site's button keeps that
   * reading intact: the blue in this panel now means "this is the live one",
   * never "press this".
   *
   * What it must not lose is the separation it was introduced for. "Publish
   * changes" and "Save Draft" once sat side by side in two greys a few percent
   * apart — the consequential action and the reversible one looked the same,
   * which is a thing you find out by pressing the wrong one. Near-black against
   * a white outline is a wider gap than blue against grey was.
   *
   * This is a variable override, not a restyle: Payload's button declares its
   * own four custom properties and every state reads them, so the component
   * keeps its sizing, focus ring and disabled handling.
   */
  { ".btn--style-primary": {
    "--bg-color": "var(--solid)",
    "--color": "var(--solid-ink)",
    /* Lifting the ink rather than darkening it: a near-black control has
     nowhere darker to go. No movement on press — the site's rule. */
    "--hover-bg": "var(--text-secondary)",
    "--hover-color": "var(--solid-ink)",
  } },
  { ".btn--style-primary, .btn--style-secondary": {
    "border-radius": "var(--radius-pill)",
  } },
  /*
   * A reading measure on the document editor.
   *
   * Payload stretches the field column to the full window: at 1440px a
   * one-line "Eyebrow" field was a 1320px-wide box holding four words, and a
   * label sat a screen's width away from the value it names. Every page on the
   * site caps its measure; this is the same cap, and it is the single biggest
   * difference between the admin feeling like a form and feeling like the
   * product.
   *
   * `max-inline-size`, not `max-width`, because Payload mirrors the whole panel
   * when the admin runs in Arabic. It is a cap and not a width, so narrow
   * windows are untouched, and the rich-text and live-preview layouts — which
   * set their own widths further in — are unaffected.
   *
   * The cap is on the fields and not on the column that holds them, because a
   * tab bar is chrome rather than content: capping the column put the
   * homepage's seven tabs into a 995px strip inside a 960px box, so "Founder,
   * FAQ & close" had to be scrolled to. The tabs field opts out and the fields
   * inside each tab are caught by the same rule one level down.
   */
  { ".document-fields__fields .field-type": {
    "max-inline-size": "60rem",
  } },
  { ".document-fields__fields .tabs-field, .document-fields__fields .tabs-field__tabs-wrap": {
    "max-inline-size": "none",
  } },
  /*
   * The sidebar is a surface, not a margin.
   *
   * Payload draws the nav with no fill and separates it from the page with a
   * border taken from `elevation-100` — which on the old dark panel was a
   * visible step and on this one is #F4F6FA against a #F7F8FA ground, a
   * difference of about one percent. The sidebar had no edge at all: the
   * collection list simply floated at the side of the page.
   *
   * It is white on the paper instead, which is the arrangement the whole site
   * is built from, with the edge at the site's own rule weight. `border-inline`
   * because Payload mirrors the panel in Arabic and the sidebar changes sides.
   */
  { ".nav": {
    "background": "var(--surface-0)",
    "border-inline-end-color": "var(--hairline-strong)",
  } },
  /*
   * The brand mark, in the sidebar and on the login screen.
   *
   * Ours, not Payload's — see cms/views/BrandLogo.tsx. The sizing lives here
   * because the component renders the real SVG file from public/brand/ and is
   * not allowed to redraw or recolour it (§12). It masks `currentColor`, so on
   * this panel it comes out in the ink rather than in white.
   */
  { ".mk-admin-logo": {
    "display": "block",
    "inline-size": "auto",
    "block-size": "1.25rem",
  } },
  { ".mk-admin-icon": {
    "display": "block",
    /* Square: the mark is 1:1, and the slot it sits in is too. */
    "inline-size": "1.375rem",
    "block-size": "1.375rem",
  } },
];
