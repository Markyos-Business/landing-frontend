export const baseStyles = [
  /* Element defaults. Registered by tailwind.config.js, in order. */
  { "*": {
    "box-sizing": "border-box",
  } },
  { "html": {
    /* The in-page anchors (the hero's "see how it works" jumps to the path
     chooser) need to clear the sticky header. */
    "scroll-behavior": "smooth",
    "scroll-padding-block-start": "5rem",
    "-webkit-text-size-adjust": "100%",
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    "html": {
      "scroll-behavior": "auto",
    },
  } },
  { "body": {
    "margin": "0",
    "min-height": "100%",
    "background": "var(--canvas)",
    "color": "var(--text)",
    "font-family": "var(--font-inter), var(--font-thmanya), system-ui, sans-serif",
    "-webkit-font-smoothing": "antialiased",
    /* Inter's alternate glyph set, exactly the four the design system names:
     single-storey a, tailed l, alternate 1, flat-top 3. They warm Inter up
     where it sits beside Arabic. Arabic faces ignore features they don't
     ship. ss03/ss07 were dropped — see MARKYOS-DESIGN-SYSTEM.md §5. */
    "font-feature-settings": "var(--mk-features)",
  } },
  /*
   * Arabic gets the Arabic face for body text too, not only for headings.
   *
   * Keyed off the `dir` attribute rather than a class, so it follows the one
   * thing that is always correct for the locale being rendered and cannot fall
   * out of step with it.
   *
   * Matched on the element rather than on `body`, so it also catches an Arabic
   * island inside an English page — the product mock in the hero is a real
   * Arabic brand hub shown to English readers, and it has to be set in the
   * Arabic face whichever locale the page around it is in.
   */
  { "[dir=\"rtl\"]": {
    "font-family": "var(--font-arabic)",
    /* Thmanya Sans sits optically smaller than Inter at the same size, and the
     Arabic script needs more leading to stay readable with its ascenders.
     1.6 is the design system's text leading for Arabic. */
    "line-height": "var(--mk-lh-text-ar)",
  } },
  /*
   * Declared Arabic is set in the Arabic face, and this rule is why the brand
   * face is used at all.
   *
   * `[dir="rtl"]` above matches `<html>`, but `body` re-declares
   * `font-family` on the next line, and a declaration on `body` beats what its
   * descendants would otherwise inherit from `<html>`. So every paragraph,
   * nav link and footer link on an Arabic page was resolving against the body
   * stack instead.
   *
   * That stack is `var(--font-inter), var(--font-thmanya), …`, which looks
   * harmless and is not: next/font expands `--font-inter` to
   * `Inter, "Inter Fallback"`, and "Inter Fallback" is a metric-adjusted local
   * face — Arial on Windows — that *does* carry Arabic glyphs. Inter has none,
   * so the browser fell through to Arial and stopped, one position before
   * Thmanya. Headings escaped it only because they get an explicit rule later.
   * Measured with CSS.getPlatformFontsForNode, not read off the stack: the
   * computed `font-family` named Thmanya the whole time while the engine was
   * painting Arial.
   *
   * Keyed on `:lang(ar)` rather than on direction, because the thing that
   * decides a typeface is the language, not the way the line runs — and it is
   * `lang` that a screen reader reads too. It therefore also catches an Arabic
   * island inside an English page, which `[dir="rtl"]` on an ancestor cannot:
   * the language switch, and the name of an Arabic-only page in the notice
   * that stands in for its English edition.
   */
  { ":lang(ar)": {
    "font-family": "var(--font-arabic)",
  } },
  /* Arabic display copy: never tracked — tracking breaks the joins between
   letters — and 1.3 rather than the text leading. */
  { "[dir=\"rtl\"] :where(h1, h2, h3)": {
    "letter-spacing": "0",
    "line-height": "var(--mk-lh-display-ar)",
  } },
  { "h1, h2, h3": {
    "font-family": "var(--font-display)",
    /* Display type is set tight; the token carries the brand's own tracking. */
    "letter-spacing": "var(--g-hero-tracking, -0.02em)",
    "text-wrap": "balance",
    "margin": "0",
  } },
  { "p": {
    "text-wrap": "pretty",
    "margin": "0",
  } },
  { "a": {
    "color": "inherit",
    "text-decoration": "none",
  } },
  /*
   * One visible focus ring for the whole site.
   *
   * `:focus-visible`, so it appears for a keyboard and not for a mouse click,
   * and on an outline rather than a box-shadow so it is never clipped by an
   * ancestor's overflow.
   */
  { ":where(a, button, input, textarea, select, summary, [tabindex]):focus-visible": {
    /* Blue, because focus is light — not `--accent-text`, which is now white
     and would be invisible as a ring against white type. */
    "outline": "2px solid var(--accent)",
    "outline-offset": "2px",
    "border-radius": "var(--mk-r-chip)",
  } },
];
