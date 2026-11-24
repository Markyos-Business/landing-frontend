export const buttonsStyles = [
  /* Rules, buttons and pointer states. Registered by tailwind.config.js, in order. */
  /* ── Rules ───────────────────────────────────────────────────────────────── */
  /* The line between sections. Full-bleed, drawn by the section rather than by
   a card, so it survives a section having no card in it. */
  { ".mk-rule": {
    "border-block-start": "1px solid var(--hairline)",
  } },
  /* ── Buttons ─────────────────────────────────────────────────────────────── */
  /*
   * The button.
   *
   * 8px radius, not a pill: radius encodes size class in this system, and a
   * button sits in the 8px class with inputs, tags and nav items.
   *
   * 38px tall for a hero or section CTA, 32px inside a card or the header.
   * Neither clears the 44px that touch guidance asks for, so a coarse pointer
   * gets the taller target. Keying off the pointer rather than the viewport is
   * the honest test: it is a finger, not a narrow window, that needs the room.
   *
   * Weight 500 — the heaviest weight anywhere on this site.
   */
  { ".mk-btn": {
    "position": "relative",
    "isolation": "isolate",
    "display": "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    "gap": "0.625rem",
    /*
     * Not pills any more.
     *
     * The light page's CTAs were 52px pills. The brief's buttons are 10px
     * rounded rectangles at two sizes -- 44px with 15px text for a hero or a
     * section, 32px with 13px text inside a card or the header -- and the
     * squarer corner is a large part of why the chrome reads as a tool rather
     * than as a brochure.
     */
    "border-radius": "var(--radius-btn)",
    "min-block-size": "2.75rem",
    "padding-inline": "1.25rem",
    "font-size": "0.9375rem",
    "font-weight": "var(--mk-weight-text-medium)",
    "line-height": "1",
    "white-space": "nowrap",
    /*
     * The brief's four transitions, at its two durations: colour, edge and
     * brightness at 250ms, and the press scale faster at 170ms so the button
     * feels like it answers before it finishes moving. Both were 180/120
     * until the page was slowed on 19 Nov 2026; the ratio between them is
     * the part that matters and it is unchanged.
     */
    "transition": "background-color 250ms var(--ease-smooth),\n    box-shadow 250ms var(--ease-smooth),\n    filter 250ms var(--ease-smooth),\n    scale 170ms var(--ease-smooth)",
  } },
  /*
   * The press.
   *
   * This is a deliberate reversal: the design system's section 13 forbade
   * press and hover transforms outright, and "no animations while pressing on
   * any button" was a standing instruction. The brief asks for scale 0.97 on
   * every button and was adopted in full on 18 Nov 2026, knowing that.
   *
   * `scale` rather than `transform`, so it composes with the arrow nudge and
   * the idle float instead of overwriting their transforms.
   */
  { ".mk-btn:active": {
    "scale": "0.97",
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-btn": {
      "transition": "background-color 250ms var(--ease-smooth),\n      box-shadow 250ms var(--ease-smooth)",
    },
    ".mk-btn:active": {
      "scale": "1",
    },
  } },
  /*
   * Hover and press, for every filled variant at once.
   *
   * One 35% black scrim over whatever the resting fill is. That is the whole
   * state model: no lift, no shrink, no nudge, and no variant needing its own
   * hover colour — which is what kept the white CTA and the grey one in step
   * when the white one stopped being a gradient.
   */
  { ".mk-btn::after": {
    "content": "\"\"",
    "position": "absolute",
    "inset": "0",
    "border-radius": "inherit",
    "background": "rgba(255, 255, 255, 0.14)",
    "opacity": "0",
    "pointer-events": "none",
    "transition": "opacity var(--mk-dur-fast) var(--mk-ease)",
  } },
  /*
   * The scrim is now the *secondary* hover only.
   *
   * The brief gives the primary button `filter: brightness(1.1)`, and laying a
   * white scrim over a brightened blue as well was visibly two effects. So the
   * solid fill brightens and everything else keeps the scrim, which on this
   * ground is what makes an 8%-white ghost button visibly answer the pointer.
   */
  { ".mk-btn:not(.mk-solid):hover::after, .mk-btn:not(.mk-solid):active::after": {
    "opacity": "1",
  } },
  /*
   * The primary's hover: brighter, and lit.
   *
   * The brief gives it `filter: brightness(1.1)` and nothing else, which on a
   * near-black page is a change you have to look for. The accent is already
   * the page's one light source, so the hover says so: the fill brightens and
   * the button casts a little of its own colour onto the ground under it.
   *
   * `drop-shadow` rather than a second `box-shadow`, so the inset lip that
   * `.mk-solid` carries is left alone rather than replaced.
   */
  { ".mk-btn.mk-solid:hover": {
    "filter": "brightness(1.12) drop-shadow(0 6px 18px var(--glow))",
  } },
  /*
   * The secondary's hover gains an edge.
   *
   * The scrim alone lifts an 8%-white fill to about 20%, which reads as "a
   * bit lighter" rather than as "this is a control". A hairline at the same
   * time gives it a shape, which is what the primary gets from its lip.
   */
  { ".mk-btn:not(.mk-solid):hover": {
    "box-shadow": "inset 0 0 0 1px oklch(0.975 0.002 286 / 0.14)",
  } },
  { "@media (prefers-reduced-motion: reduce)": {
    ".mk-btn.mk-solid:hover": {
      "filter": "brightness(1.12)",
    },
  } },
  /* Inside a card or the header. Same type size — 14px is the UI size and there
   is nothing below it but meta. */
  /* Inside a card or the header: the brief's small size, 32px with 13px text. */
  { ".mk-btn-sm": {
    "min-block-size": "2rem",
    "padding-inline": "0.75rem",
    "font-size": "0.8125rem",
  } },
  { "@media (pointer: coarse)": {
    ".mk-btn, .mk-btn-sm": {
      "min-block-size": "2.75rem",
    },
  } },
  /* ── Pointer states ─────────────────────────────────────────────────────────
   *
   * The design system's §1 line 9 allows "one 35% black scrim" on hover and
   * nothing else — no lift, no nudge, no choreography — and this file used to
   * carry a comment at exactly this spot saying so, and saying that the arrow
   * therefore had no hover nudge and needed no reduced-motion block to undo
   * one. That rule describes the black site; the header of
   * MARKYOS-DESIGN-SYSTEM.md marks §1, §5 and §13 superseded for the website,
   * and §5 is the one that had the nudge deleted.
   *
   * What replaces it is still narrow. Two rules, both of them *answers* rather
   * than ornament: a CTA presses, and a card that is a link rises toward the
   * pointer. (There was a third — a link's arrow leaned the way it pointed —
   * which went when the arrows did, 6 Nov 2026.) Each is on an element the
   * reader is already aiming at, which is the one place motion cannot be in the
   * way — and each is inside `(hover: hover) and (pointer: fine)`, so a
   * touchscreen, where `:hover` sticks after a tap, gets none of it.
   *
   * The travel is gated on `prefers-reduced-motion` and the colour and shadow
   * are not, which is the split those rules ask for: a state change is
   * information, and only the movement is the thing somebody may not want.
   */
  { "@media (hover: hover) and (pointer: fine)": [
    /*
     * A button does not move.
     *
     * It used to rise 2px toward the pointer and drop back on `:active`, so
     * the press was the motion. That came off on 6 Nov 2026 at the user's
     * request, and it puts this file back on §1 line 9 of
     * MARKYOS-DESIGN-SYSTEM.md, which allows a hover scrim and nothing else:
     * no lift, no nudge, no choreography. The colour still changes, because a
     * state change is information — only the movement was decoration, and a
     * control that moves under the finger reads as unsteady rather than as
     * responsive.
     */
    /*
     * A card that is a link rises toward the pointer.
     *
     * `filter: drop-shadow` and not `box-shadow`, for a reason specific to this
     * site: most of these cards set their lift as an inline `boxShadow`, from
     * the design file's own values, and an inline style beats any rule in any
     * layer — so a `box-shadow` hover here would need `!important` to land, on
     * every card, for ever. `drop-shadow` is a different property, it composites
     * against the card's real silhouette rather than its box, and it is free to
     * animate.
     *
     * `:focus-within` as well as `:hover`, so arriving by keyboard gets the same
     * answer. `.mk-reach` is applied at call sites; the selector beside it covers
     * a card that is *itself* an anchor, which is the shape this treatment is
     * for, so a new one is covered without anybody remembering this rule exists.
     */
    { ".mk-reach, a.mk-card": {
      "transition": "translate var(--mk-dur-base) var(--mk-ease),\n      filter var(--mk-dur-base) var(--mk-ease)",
    } },
    { ":where(.mk-reach, a.mk-card):hover, :where(.mk-reach, a.mk-card):focus-within": {
      "filter": "drop-shadow(0 18px 30px rgba(0, 0, 0, 0.6))",
    } },
    { "@media (prefers-reduced-motion: no-preference)": {
      ":where(.mk-reach, a.mk-card):hover, :where(.mk-reach, a.mk-card):focus-within": {
        "translate": "0 -3px",
      },
    } },
    /*
     * The support centre's article rows, which already answered the pointer
     * with a fill and now answer it with the same lift as every other card.
     *
     * Listed here rather than added to the selectors above because the row
     * declares a `transition` of its own, further down this file: a shorthand
     * at equal specificity and a later line wins outright, so being named up
     * there would have had its background transition quietly delete the
     * lift's. The lift is declared where that transition is, and this block
     * states only the hover.
     *
     * `.mk-help-row` and *not* `.mk-help-tile`, which sits beside it and looks
     * identical. The row is an `<a>` — a card-shaped link to an article, which
     * is exactly what this treatment is for. The tile is a `<button>` that
     * filters the list in place, and a button on this site does not move: it
     * takes a fill and nothing else. That is §1 line 9 of
     * MARKYOS-DESIGN-SYSTEM.md and the 6 Nov instruction, and two controls
     * looking alike is not a reason to break it.
     */
    { ".mk-help-row:hover, .mk-help-row:focus-within": {
      "filter": "drop-shadow(0 14px 22px rgba(0, 0, 0, 0.6))",
    } },
    { "@media (prefers-reduced-motion: no-preference)": {
      ".mk-help-row:hover, .mk-help-row:focus-within": {
        "translate": "0 -2px",
      },
    } },
  ] },
  /*
   * A text link whose underline arrives on hover, rather than snapping in.
   *
   * The line is always drawn and only its colour changes, transparent to the
   * link's own, so nothing on the line moves and the change can ease over the
   * same 170ms every other hover on the site takes. On a link itself it
   * answers its own hover; on a title inside a card that is the link
   * (`.group`), it answers the card's — which is what `hover:underline` and
   * `group-hover:underline` did instantly. Hover-capable pointers only, as
   * Tailwind's `hover:` was, so a tap does not leave a line behind.
   */
  { ".mk-underline-reveal": {
    "text-decoration-line": "underline",
    "text-decoration-color": "transparent",
    "transition": "text-decoration-color var(--mk-dur-fast) var(--mk-ease)",
  } },
  { "@media (hover: hover)": {
    ".mk-underline-reveal:hover, .group:hover .mk-underline-reveal": {
      "text-decoration-color": "currentColor",
    },
  } },
];
