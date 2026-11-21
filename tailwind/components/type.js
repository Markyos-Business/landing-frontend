export const typeStyles = [
  /* Type. Registered by tailwind.config.js, in order. */
  /* ── Type ────────────────────────────────────────────────────────────────── */
  /*
   * Display type: three roles, three weights.
   *
   * Until 18 Nov 2026 all three shared one weight and one tracking, because
   * the design system capped every weight at 500 -- there was no 600 to fall
   * back to and no second tracking to choose between. The 21st.dev-style brief
   * replaces that with a deliberate split, and the split is the look:
   *
   *   hero display   700, -0.05em, line-height 1.0   -- very tight, two lines
   *   section title  500, -0.022em, line-height 1.1  -- calm, left-aligned
   *   card title     600, -0.01em, line-height 1.3   -- 18px, in the text scale
   *
   * A hero at -0.05em and a card title at -0.05em are not the same decision:
   * at 88px the tracking is what makes the line read as one object, and at
   * 18px the same value just looks cramped. Hence one value per role.
   *
   * Arabic takes none of this tracking -- see the override below.
   */
  { ".mk-display, .mk-h2-lg, .mk-h2": {
    "font-family": "var(--font-display)",
    "color": "var(--text)",
    "text-wrap": "balance",
  } },
  { ".mk-display": {
    "font-size": "var(--fs-display)",
    "font-weight": "var(--mk-weight-display)",
    "letter-spacing": "var(--g-hero-tracking)",
    "line-height": "var(--mk-lh-display)",
  } },
  { ".mk-h2-lg, .mk-h2": {
    "font-size": "var(--fs-h2)",
    "font-weight": "var(--mk-weight-text-medium)",
    "letter-spacing": "var(--g-h2-tracking)",
    "line-height": "var(--mk-lh-display-2)",
  } },
  /*
   * Card titles sit in the text scale, not the display scale: 18px at 600,
   * with only a hair of tracking.
   */
  { ".mk-h3": {
    "font-family": "var(--font-display)",
    "font-size": "var(--fs-h3)",
    "font-weight": "var(--mk-weight-card-title)",
    "line-height": "1.3",
    "letter-spacing": "-0.01em",
    "color": "var(--text)",
  } },
  /*
   * The card subtitle that sits under a card title in a bento footer: 16px,
   * muted, untracked. The brief pairs every title with one of these.
   */
  { ".mk-card-sub": {
    "font-size": "1rem",
    "font-weight": "var(--mk-weight-text)",
    "line-height": "1.4",
    "letter-spacing": "0",
    "color": "var(--text-muted)",
  } },
  /*
   * Arabic does not take the Latin tracking.
   *
   * Negative tracking on an Arabic headline pulls joined letterforms into each
   * other — it is not a tighter line, it is a broken word. The Arabic face also
   * sits optically smaller than Inter at the same size and needs more leading.
   */
  /*
   * The second selector is the heading that carries the Arabic itself rather
   * than sitting inside something Arabic — an Arabic headline on an English
   * page. `[dir="rtl"] …` is a descendant selector and cannot match it, and
   * the `:lang(ar)` rule in the base layer loses to `.mk-h2` here, because a
   * later layer beats an earlier one whatever the specificity. Without this
   * line the only Arabic word on 28 English pages was set in Arial.
   */
  { "[dir=\"rtl\"] :where(.mk-display, .mk-h2-lg, .mk-h2, .mk-h3), :lang(ar):where(.mk-display, .mk-h2-lg, .mk-h2, .mk-h3)": {
    "font-family": "var(--font-arabic)",
    "letter-spacing": "0",
    "line-height": "var(--mk-lh-display-ar)",
  } },
  /* The paragraph under a section heading. */
  { ".mk-lead": {
    "font-size": "var(--fs-lead)",
    "line-height": "1.6",
    "color": "var(--text-muted)",
  } },
  /* Body copy inside a card or a column. */
  { ".mk-body": {
    "font-size": "var(--fs-body)",
    "line-height": "1.6",
    "color": "var(--text-muted)",
  } },
  { ".mk-body strong, .mk-lead strong": {
    "color": "var(--text)",
    "font-weight": "500",
  } },
  /*
   * The eyebrow.
   *
   * Grey, uppercase, tracked out — never coloured. Uppercase is a *style role*
   * here, which is why it is applied in CSS and never typed into the copy.
   *
   * Two forms: an uppercase tracked one inside a card ("STEP 2 · ANALYZE") and
   * a sentence-case label above a section heading ("For studios"), which is the
   * `-accent` variant. It is white rather than blue: blue is light on this
   * site, never ink.
   */
  { ".mk-eyebrow": {
    "font-size": "var(--fs-eyebrow)",
    "font-weight": "500",
    "letter-spacing": "0.1em",
    "text-transform": "uppercase",
    "color": "var(--text-muted)",
  } },
  { ".mk-eyebrow-accent": {
    "color": "var(--text)",
    "text-transform": "none",
    "letter-spacing": "0",
    "font-size": "var(--fs-ui)",
  } },
  /*
   * The brackets came off, 21 Nov 2026.
   *
   * `.mk-eyebrow-bracket` drew `[` and `]` around a centred label — the
   * reference's way of marking the top of a section, and an argument that a
   * two-word grey line above a heading needs closing off or it reads as the
   * heading's own first line. The owner looked at it on the page and did not
   * want the punctuation. Nothing replaces it: the eyebrow is a tab by its
   * size, its ink and the space under it, which is how every other label on
   * this site already works.
   *
   * The class and its `bracket` prop are gone rather than emptied, so no
   * call site can ask for punctuation that is no longer drawn.
   */
  /* Arabic has no case, and tracking breaks its joins — so the eyebrow's two
   Latin mannerisms both come off in RTL. */
  { "[dir=\"rtl\"] .mk-eyebrow": {
    "letter-spacing": "0",
    "text-transform": "none",
  } },
];
