export const designSystemTokens = [
  /* Markyos Design System — marketing identity tokens ("Markyos Light").
   Source of truth: the Markyos Design System project, via
   MARKYOS-DESIGN-SYSTEM.md §3. Do not invent values here; when the design
   system changes, a new export replaces that file and these values follow it.
   
   This layer sits between `tailwind/base-tokens.js` (the base layer, owned here
   since 15 Nov 2026) and `tailwind/tokens.js` (which re-points the site's
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
    /*
     * Slowed on 19 Nov 2026, with everything else on the page.
     *
     * These two are the *interaction* clocks -- a hover scrim, a knob
     * travelling, a chevron turning -- not the entrance ones, and they get
     * the smaller share of the slowdown deliberately. A reveal that takes
     * half again as long reads as considered; a hover that takes half again
     * as long reads as a page that has not noticed the pointer. 1.4x here
     * against 1.5x on the entrances.
     */
    "--mk-dur-fast": "170ms",
    "--mk-dur-base": "250ms",
    /* fades into the canvas — for product imagery */
    "--mk-fade-bottom": "linear-gradient(#000 55%, transparent 100%)",
    "--mk-fade-band": "linear-gradient(transparent 0%, #000 25% 72%, transparent 100%)",
    "--mk-fade-end": "linear-gradient(90deg, #000 60%, transparent 100%)",
  } },
];

export const themeTokens = [
  /*
   * The marketing site's token names, pointed at the 21st.dev-style dark
   * design (docs/design-brief.md).
   *
   * -- What changed, 18 Nov 2026 --------------------------------------------
   *
   * The site was a light page: #F7F8FA ground, #0B0B0F ink, white cards on
   * long blue-grey shadows. The brief replaces that with a near-black canvas,
   * one electric-blue accent, hairline-bordered cards and no card shadows at
   * all. Dark is now the only mode.
   *
   * Colours are OKLCH, as the brief specifies. The names are unchanged, which
   * is the whole point: forty-two components read `var(--text-muted)` and
   * `var(--surface-1)`, so the chrome, the blog and every page under
   * `content/pages/` turn dark from this one file.
   *
   * -- Two departures from the brief, both deliberate ------------------------
   *
   * **The fonts stay.** The brief asks for General Sans. This site is Arabic
   * first -- `/` is Arabic, `/en` is English -- and General Sans has no Arabic
   * glyphs, so adopting it would leave the default edition unset. Inter keeps
   * the Latin and Thmanya Sans keeps the Arabic, which is what was approved.
   *
   * **Blue is never ink.** `--primary` is oklch(0.485 0.291 264.1), which
   * measures about 2.2:1 against this canvas -- it fails as text at any size.
   * The brief only ever asks for it as a fill, a selection, an underline and a
   * glow, so that is all it does here. Where a blue *label* is needed,
   * `--accent-on-soft` and `--mk-blue-ink` carry a lighter blue solved for the
   * dark ground.
   *
   * -- The art direction, in one line ---------------------------------------
   *
   * Ink, not paper. A near-black ground with a cool tint, cards a hair lighter
   * than the page and edged in white at 7%, type at three steps of near-white,
   * and the one blue used as light: button fills, selection, the underline
   * under a number, and soft glows seaming the sections together.
   */
  { ":root, .dark": {
    /* ground + surfaces -- the brief's section 1 surfaces */
    "--background": "oklch(0.141 0.004 285.8)",
    "--canvas": "oklch(0.141 0.004 285.8)",
    /* page, near-black with a cool tint */
    "--card": "oklch(0.158 0.003 286)",
    "--surface-0": "oklch(0.158 0.003 286)",
    "--surface-1": "oklch(0.158 0.003 286)",
    /* bento cell, a hair lighter than the page */
    "--surface-2": "oklch(0.21 0.006 285.9)",
    /* inputs, secondary buttons, table heads, segmented tracks */
    "--surface-3": "oklch(0.274 0.005 286)",
    /* hover / selected row only */
    "--popover": "oklch(0.204 0 0)",
    "--muted": "oklch(0.21 0.006 285.9)",
    "--secondary": "oklch(0.274 0.005 286)",
    "--card-top": "oklch(0.158 0.003 286)",
    /* flat: cards are edged, never lifted */
    "--card-bottom": "oklch(0.158 0.003 286)",
    /*
     * Lines -- hairlines, white at low alpha. The brief is explicit that cards
     * carry a ~0.8px border at about 7% white and no drop shadow, so the
     * ladder that used to describe shadow depth now describes edge strength.
     */
    "--hairline": "oklch(0.975 0.002 286 / 0.055)",
    /* dividers inside a card */
    "--hairline-strong": "oklch(0.975 0.002 286 / 0.075)",
    /* card edges, rows, header rule */
    "--border": "oklch(0.274 0.005 286)",
    "--ghost-fill": "oklch(0.975 0.002 286 / 0.08)",
    /* secondary button fill */
    /*
     * Text -- three steps of near-white, never pure white for body.
     *
     * --text-muted is the one worth the arithmetic: oklch(0.654 0.014 286) is
     * about 6.9:1 on this canvas, so it clears AA for body copy, which the
     * brief's section 7 asks for by name.
     */
    "--foreground": "oklch(0.968 0.001 286.4)",
    "--text": "oklch(0.968 0.001 286.4)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--text-secondary": "oklch(0.86 0.004 286)",
    /* long-form prose */
    "--text-muted": "oklch(0.654 0.014 286)",
    /* subtitles, captions, body under a heading */
    "--text-faint": "oklch(0.654 0.014 286)",
    /* meta, column heads -- the same step; nothing dimmer passes AA */
    /*
     * The one accent. A fill and a light, not an ink -- see the header note.
     */
    "--primary": "oklch(0.485 0.291 264.1)",
    "--primary-foreground": "oklch(1 0 0)",
    "--accent": "oklch(0.485 0.291 264.1)",
    "--ring": "oklch(0.485 0.291 264.1)",
    "--accent-edge": "oklch(0.6 0.24 264)",
    "--accent-soft": "oklch(0.485 0.291 264.1 / 0.16)",
    "--accent-ink": "oklch(1 0 0)",
    /*
     * Blue that is allowed to carry text, solved for this ground.
     *
     * oklch(0.76 0.14 255) measures about 8.4:1 on the canvas and still reads
     * as the brand blue. --accent-text is white, because the design language
     * sets links in white with an arrow and keeps blue for the fill behind
     * them.
     */
    "--accent-text": "oklch(0.968 0.001 286.4)",
    "--accent-on-soft": "oklch(0.76 0.14 255)",
    "--mk-blue-ink": "oklch(0.76 0.14 255)",
    /* primary CTA -- the blue fill, white label, with the brief's inset lip */
    "--solid": "oklch(0.485 0.291 264.1)",
    "--solid-from": "oklch(0.485 0.291 264.1)",
    "--solid-to": "oklch(0.485 0.291 264.1)",
    "--solid-ink": "oklch(1 0 0)",
    "--solid-lip": "inset 0 1px 0 oklch(1 0 0 / 0.22)",
    "--track": "oklch(0.274 0.005 286)",
    "--glow": "oklch(0.485 0.291 264.1 / 0.38)",
    /* the light pool's core, and the section seams */
    /*
     * The brief replaces lifted cards with edged ones, so these three stay as
     * names (components read them) and now describe rings, not shadows.
     */
    "--lift-card": "0 0 0 1px oklch(0.975 0.002 286 / 0.075)",
    "--lift-ring": "0 0 0 1px oklch(0.975 0.002 286 / 0.075)",
    "--lift-blue":
      "0 0 0 1px oklch(0.6 0.24 264 / 0.35), 0 40px 80px -44px oklch(0.485 0.291 264.1 / 0.55)",
    /*
     * The deep panel -- the final CTA of the brief's section 4.7.
     *
     * On a light page this was the one dark object. On a dark page it inverts:
     * the panel is the one *lit* object, a deep blue tint with a faded collage
     * behind it. Both stops are solved for white: oklch(0.32 0.2 264) is about
     * 9.6:1 and oklch(0.42 0.26 264) about 6.4:1, so the display line and the
     * lead under it both clear AA.
     */
    "--mk-deep-near": "oklch(0.32 0.2 264)",
    "--mk-deep-far": "oklch(0.42 0.26 264)",
    "--mk-on-deep": "oklch(1 0 0)",
    "--mk-on-deep-soft": "oklch(0.86 0.07 264)",
    "--lift-deep": "0 0 0 1px oklch(0.975 0.002 286 / 0.09)",
    /*
     * The state hues, back to the bright values a dark ground wants.
     *
     * The light page had to darken these to be legible on near-white; on
     * near-black the opposite is true, so these return to the design system's
     * own values, which were picked for black in the first place.
     */
    "--mk-state-approved": "#00de68",
    "--mk-state-review": "#8a58ff",
    "--mk-state-expiring": "#ffbb00",
    "--mk-state-rejected": "#ff0066",
    "--mk-state-info": "#00ccff",
    /* type -- the brief's section 2 scale, on Inter and Thmanya */
    "--font-display": "var(--font-inter), \"Inter\", var(--font-thmanya), var(--font-plex-arabic), system-ui,\n    sans-serif",
    "--font-arabic": "var(--font-thmanya), var(--font-plex-arabic), system-ui, sans-serif",
    "--font-mono": "ui-monospace, \"SF Mono\", \"Cascadia Code\", Consolas, monospace",
    /*
     * Scaled down with the homepage hero, 19 Nov 2026.
     *
     * This was clamp(2.75rem, 6vw, 5.5rem) -- the same curve
     * `--mk-fs-hero` had, and 86.4px on a 1440px desktop. `.mk-display`
     * is worn by exactly one element, the `<h1>` of every content
     * page's hero, so the fifty-one inner pages opened at the same
     * size the homepage did and had the same fault: 832px of headline
     * over 225px of height, before the lead or the buttons.
     *
     * It follows `--mk-fs-hero` to 4.6vw/68px so the two kinds of hero
     * still open at one size. If one moves again, move both.
     */
    "--fs-display": "clamp(2.375rem, 4.6vw, 4.25rem)",
    /* 44 -> 88, hero display */
    "--fs-h2-lg": "clamp(1.75rem, 3.6vw, 2.75rem)",
    /* 28 -> 44, and the big statement line */
    "--fs-h2": "clamp(1.75rem, 3.6vw, 2.75rem)",
    /* 28 -> 44, one h2 size */
    "--fs-d3": "clamp(1.75rem, 3.6vw, 2.75rem)",
    /* 28 -> 44 -- founder, faq */
    "--fs-h3": "1.125rem",
    /* 18 -- card titles, at weight 600 */
    "--fs-lead": "clamp(1.0625rem, 1.4vw, 1.1875rem)",
    /* 17 -> 19 -- hero subtitle, card subtitles */
    "--fs-body": "1.125rem",
    /* 18 -- the brief's desktop body base */
    "--fs-ui": "0.875rem",
    /* 14 -- nav, buttons */
    "--fs-eyebrow": "0.8125rem",
    /* 13 -- column heads, meta */
    /*
     * Weights. The brief wins on this: display is 700 and card titles are 600,
     * where the design system capped everything at 500. `WEIGHT_CEILING` in
     * scripts/check-design-rules.mjs was raised to 700 to match, so the gate
     * still fails 800 and 900.
     */
    "--mk-weight-display": "700",
    "--mk-weight-card-title": "600",
    "--mk-weight-text-medium": "500",
    "--mk-weight-text": "400",
    "--g-hero-tracking": "-0.05em",
    /* very tight, Latin only -- Arabic is never tracked */
    "--g-h2-tracking": "-0.022em",
    /* shape -- the brief's section 1 radii */
    "--radius": "0.5rem",
    "--radius-btn": "10px",
    "--radius-card": "20px",
    "--radius-frame": "28px",
    /* big outer frames around product previews */
    "--radius-widget": "14px",
    /* the inner media panel of a bento cell */
    "--radius-pill": "999px",
    /* motion -- the brief's section 5 curves, used instead of the defaults */
    "--ease-out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
    /* reveals, cards sliding in */
    "--ease-smooth": "cubic-bezier(0.2, 0.7, 0.2, 1)",
    /* hover, small UI */
    "--ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
    /* carousels, progress bars */
    "--ease-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
  } },
];
