export const designSystemTokens = [
  /* Markyos Design System — marketing identity tokens ("Markyos Light").
   Source of truth: the Markyos Design System project, via
   MARKYOS-DESIGN-SYSTEM.md §3. Do not invent values here; when the design
   system changes, a new export replaces that file and these values follow it.
   
   This layer sits between `tailwind/tokens.generated.js` (the product's tokens, which
   are generated and never edited) and `tailwind/tokens.js` (which re-points the site's
   own token names onto these). Nothing reads `--mk-*` directly from a
   component: components read the site's names, and `tailwind/tokens.js` is the one
   place the two vocabularies meet. */
  { ":root": {
    /* canvas + panels */
    "--mk-canvas": "#000000",
    "--mk-panel-1": "#111111",
    "--mk-panel-2": "#1a1a1a",
    "--mk-panel-3": "#242424",
    /* hover / pressed only */
    /* text — hierarchy by opacity, never by colour */
    "--mk-text-1": "#ffffff",
    "--mk-text-2": "rgba(255, 255, 255, 0.8)",
    "--mk-text-3": "rgba(255, 255, 255, 0.6)",
    "--mk-text-4": "rgba(255, 255, 255, 0.4)",
    /* disabled / decorative only */
    /* lines + fills */
    "--mk-line-strong": "rgba(255, 255, 255, 0.2)",
    "--mk-line": "rgba(255, 255, 255, 0.1)",
    "--mk-line-subtle": "rgba(255, 255, 255, 0.05)",
    "--mk-fill-2": "rgba(255, 255, 255, 0.1)",
    "--mk-fill-2-hover": "rgba(255, 255, 255, 0.16)",
    "--mk-scrim": "rgba(0, 0, 0, 0.35)",
    "--mk-glass": "rgba(255, 255, 255, 0.16)",
    /* + backdrop-filter: blur(12px); floating pills only */
    /* signature light — blue core, deep-blue falloff */
    "--mk-blue": "#0099ff",
    "--mk-blue-deep": "#0055ff",
    "--mk-blue-edge": "#33b5ff",
    "--mk-blue-soft": "rgba(0, 153, 255, 0.14)",
    "--mk-glow": "0 0 6px #0099ff, 0 0 24px rgba(0, 153, 255, 0.65), 0 0 64px rgba(0, 85, 255, 0.4)",
    "--mk-glow-soft": "0 0 18px rgba(0, 153, 255, 0.35)",
    "--mk-glow-inset": "inset 0 0 12px rgba(0, 153, 255, 0.5)",
    "--mk-glow-text": "0 0 8px rgba(0, 153, 255, 0.9), 0 0 28px rgba(0, 85, 255, 0.6)",
    "--mk-light-pool": "radial-gradient(45% 45% at 50% 50%, rgba(0, 85, 255, 0.32) 0%, rgba(0, 0, 0, 0) 70%)",
    "--mk-beam": "0 0 12px #0099ff, 0 0 40px #0055ff",
    "--mk-data-bar": "linear-gradient(90deg, #0099ff, #0055ff 45%, #000)",
    /* UI-state accents — status dots, tags, chart series, product mocks. Never layout chrome. */
    "--mk-state-approved": "#00de68",
    "--mk-state-review": "#8a58ff",
    "--mk-state-expiring": "#ffbb00",
    "--mk-state-rejected": "#ff0066",
    "--mk-state-info": "#00ccff",
    "--mk-state-approved-soft": "rgba(0, 222, 104, 0.14)",
    "--mk-state-review-soft": "rgba(138, 88, 255, 0.16)",
    "--mk-state-expiring-soft": "rgba(255, 187, 0, 0.14)",
    "--mk-state-rejected-soft": "rgba(255, 0, 102, 0.14)",
    "--mk-state-info-soft": "rgba(0, 204, 255, 0.14)",
    /* type */
    "--mk-features": "\"cv01\", \"cv05\", \"cv09\", \"cv11\"",
    "--mk-weight-display": "500",
    "--mk-weight-text": "400",
    "--mk-track-display": "-0.04em",
    "--mk-lh-display": "1",
    "--mk-lh-display-2": "1.1",
    "--mk-lh-display-ar": "1.3",
    "--mk-lh-text-ar": "1.6",
    "--mk-d1": "54px",
    "--mk-d2": "44px",
    "--mk-d3": "28px",
    "--mk-d1-mobile": "36px",
    "--mk-d2-mobile": "28px",
    "--mk-t-lead": "18px",
    "--mk-t-caption": "15px",
    "--mk-t-ui": "14px",
    "--mk-t-meta": "12px",
    /* shape */
    "--mk-r-chip": "4px",
    "--mk-r-status": "6px",
    "--mk-r-button": "8px",
    "--mk-r-ui": "15px",
    "--mk-r-blog": "20px",
    "--mk-r-feature": "25px",
    "--mk-r-pill": "999px",
    "--mk-shadow-raised": "0 0 0 1px rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.6)",
    /* layout */
    "--mk-container": "1100px",
    "--mk-gutter": "20px",
    "--mk-section-y": "100px",
    "--mk-stack": "60px",
    "--mk-card-pad": "25px",
    "--mk-header-h": "64px",
    /* motion */
    "--mk-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "--mk-dur-fast": "120ms",
    "--mk-dur-base": "180ms",
    /* fades into the canvas — for product imagery */
    "--mk-fade-bottom": "linear-gradient(#000 55%, transparent 100%)",
    "--mk-fade-band": "linear-gradient(transparent 0%, #000 25% 72%, transparent 100%)",
    "--mk-fade-end": "linear-gradient(90deg, #000 60%, transparent 100%)",
  } },
];

export const themeTokens = [
  /*
   * The marketing site's token names, pointed at the Markyos Landing design.
   *
   * ── What changed, and why this file no longer reads from tailwind/tokens.js ───
   *
   * `MARKYOS-DESIGN-SYSTEM.md` describes a black site: "Black is the brand.
   * Light is the colour." The landing design the site is now built to —
   * `Landing Copy/Markyos Landing AR (readable).html` — is a *light* page:
   * #F7F8FA canvas, #0B0B0F ink, white cards lifted on soft blue-grey shadows.
   * Both cannot be true, and the page that ships is the light one.
   *
   * So the values below are the design file's own, read off its markup, rather
   * than mapped onto the `--mk-*` identity layer. `tailwind/tokens.js` is still
   * imported and still holds the blue-light scale, which the design file uses
   * unchanged (#0099FF core, #0055FF falloff) — but its canvas, panel and text
   * ramps now describe a site that does not exist, and nothing here reads them.
   *
   * ── Why the mapping still exists ──────────────────────────────────────────
   *
   * Forty-two components read names like `var(--text-muted)` and
   * `var(--surface-1)`. Keeping those names and re-pointing them means the
   * chrome, the blog, and every data-driven page under `content/pages/` turn
   * light from this one file. The homepage sections under `src/components/public/home/`
   * are a literal trace of the design file and carry their own values inline;
   * everything else still comes through here.
   *
   * `src/app/tokens.generated.css` is generated from the platform app and is never
   * edited. Where a product token name needs a different value here, it is
   * re-pointed below rather than changed at the source.
   *
   * ── The art direction, in one line ────────────────────────────────────────
   *
   * Paper, not ink. A near-white ground, white cards that lift off it on long
   * soft shadows, near-black type at three opacities, and blue used twice: as
   * the gradient inside a headline's second clause, and as the light pooled
   * behind whatever the section is about.
   */
  { ":root": {
    /* ground + surfaces */
    "--canvas": "#f7f8fa",
    "--surface-0": "#ffffff",
    "--surface-1": "#ffffff",
    /* cards */
    "--surface-2": "#f4f6fa",
    /* inputs, secondary buttons, table heads, segmented tracks */
    "--surface-3": "#f0f2f6",
    /* hover / selected row only */
    "--card-top": "#ffffff",
    /* flat: the gradient is retired */
    "--card-bottom": "#ffffff",
    /* lines — the design file draws edges with ring shadows, not borders */
    "--hairline": "rgba(11, 11, 15, 0.05)",
    /* dividers inside a card */
    "--hairline-strong": "rgba(11, 11, 15, 0.07)",
    /* card edges, rows, header rule */
    /* text — hierarchy by opacity of the one ink */
    "--text": "#0b0b0f",
    "--text-secondary": "rgba(11, 11, 15, 0.72)",
    /* long-form prose */
    "--text-muted": "rgba(11, 11, 15, 0.64)",
    /* body copy under a heading */
    /* .55 measures 4.34:1 on this ground — under AA for text below 24px.
     See the note on INK_55 in src/components/public/home/landing.tsx. */
    "--text-faint": "rgba(11, 11, 15, 0.62)",
    /* meta, captions, column heads */
    /* accent */
    "--accent": "#0055ff",
    /* INK on light: icons, active labels, links */
    "--accent-text": "#0055ff",
    "--accent-soft": "rgba(0, 153, 255, 0.08)",
    "--accent-on-soft": "#0055ff",
    "--accent-ink": "#ffffff",
    "--accent-edge": "#0099ff",
    /*
     * The blue the page is allowed to set *text* in.
     *
     * The design system's core blue is #0099FF and it is defined as light —
     * glow, ring, fill — never ink, and the arithmetic says why: #0099FF on
     * #F7F8FA measures 2.82:1, under the 3:1 that WCAG AA asks even of text at
     * 24px and over. The landing design departs from that rule in one place, the
     * gradient on a headline's closing clause, and so inherited the problem: the
     * light end of that gradient was under the threshold on every headline that
     * carries one.
     *
     * #0077FF is 3.89:1 on this ground and 4.09:1 on white, still reads as the
     * brand blue, and runs into --mk-blue-deep (5.28:1) without a visible seam.
     * Fills and glows keep #0099FF; only ink moved.
     */
    "--mk-blue-ink": "#0077ff",
    /* primary CTA — flat near-black, white label */
    "--solid": "#0b0b0f",
    "--solid-from": "#0b0b0f",
    "--solid-to": "#0b0b0f",
    "--solid-ink": "#ffffff",
    "--track": "#f0f2f6",
    "--glow": "rgba(0, 153, 255, 0.11)",
    /* the light pool's core */
    /* the design file's two lifts, as tokens so cards agree with each other */
    "--lift-card": "0 0 0 1px rgba(11, 11, 15, 0.05), 0 30px 70px -40px rgba(11, 20, 60, 0.28)",
    "--lift-ring": "0 0 0 1px rgba(11, 11, 15, 0.06)",
    "--lift-blue": "0 0 0 1px rgba(11, 11, 15, 0.06), 0 40px 80px -44px rgba(0, 85, 255, 0.4)",
    /*
     * The deep panel — the one dark object on a light page.
     *
     * A page that is paper all the way down has nothing to close on. The
     * closing CTA used to end on `.mk-horizon`, an enormous pale ellipse lit
     * from below, which ends a page by fading out of it: at the moment the
     * visitor is being asked to decide, the design was dissolving. The ask is
     * now a panel of the brand's own blue, inset on the ground, with the light
     * moving inside it rather than pooling behind it.
     *
     * Both stops are solved for white text, not picked by eye. The design
     * system's core #0099FF measures 2.9:1 against white and #0055FF 5.6:1 —
     * enough for a display line, under AA for the 17px lead beneath it — so the
     * ground behind the copy stops at #0040E0 (7.5:1) and deepens to #0A1F8C
     * (13.2:1) at the reading edge. The brighter blues appear only in the light
     * that plays across the far side, where no copy goes.
     *
     * --mk-on-deep-soft carries the lead and the eyebrow: #C9D8FF is 5.25:1 on
     * the lighter stop and 9.3:1 on the darker one. A pale blue rather than a
     * grey, because a grey over blue reads as faded where a tint reads as quiet.
     */
    "--mk-deep-near": "#0a1f8c",
    "--mk-deep-far": "#0040e0",
    "--mk-on-deep": "#ffffff",
    "--mk-on-deep-soft": "#c9d8ff",
    "--lift-deep": "0 0 0 1px rgba(11, 11, 15, 0.04), 0 40px 80px -40px rgba(0, 64, 224, 0.45)",
    /* type */
    "--font-display": "var(--font-inter), \"Inter\", var(--font-thmanya), var(--font-plex-arabic), system-ui,\n    sans-serif",
    "--font-arabic": "var(--font-thmanya), var(--font-plex-arabic), system-ui, sans-serif",
    "--fs-display": "clamp(2.375rem, 6vw, 4.75rem)",
    /* 38 → 76 */
    "--fs-h2-lg": "clamp(1.875rem, 4.6vw, 3.5rem)",
    /* 30 → 56 */
    "--fs-h2": "clamp(1.875rem, 4.2vw, 3.25rem)",
    /* 30 → 52 */
    "--fs-d3": "clamp(1.75rem, 3.6vw, 2.75rem)",
    /* 28 → 44 — founder, faq */
    "--fs-h3": "1.375rem",
    /* 22 — card titles */
    "--fs-lead": "clamp(1.0625rem, 1.6vw, 1.25rem)",
    /* 17 → 20 */
    "--fs-body": "1rem",
    /* 16 */
    "--fs-ui": "0.9375rem",
    /* 15 */
    "--fs-eyebrow": "0.8125rem",
    /* 13 — column heads, meta */
    "--g-hero-tracking": "-0.01em",
    /*
     * The state hues, re-pointed for a light ground.
     *
     * `tailwind/tokens.js` sets these for black: #FFBB00 amber, #00DE68 green,
     * #00CCFF cyan. On near-white they are almost invisible as text — the tone
     * checker's "Flag" label measured 1.6:1 — because a hue picked to glow on
     * black has nowhere to go on white.
     *
     * The darker values below are the design file's own: it draws the same
     * states as #C2004E, #00799A and #6A3BE0 in its mock rows. So this is the
     * light page's palette, not an invention — the tokens simply had not been
     * re-pointed yet. Fills stay bright; only the ink darkens, which is why the
     * `-soft` tints are left alone.
     */
    "--mk-state-approved": "#00894a",
    "--mk-state-review": "#6a3be0",
    "--mk-state-expiring": "#8a6200",
    "--mk-state-rejected": "#c2004e",
    "--mk-state-info": "#00799a",
    /* shape — the design file's radii are much larger than the product's */
    "--radius-card": "28px",
    "--radius-widget": "16px",
    "--radius-pill": "999px",
  } },
];
