/*
 * Form fields.
 *
 * ── Why this is a module and not four long class lists ─────────────────────
 *
 * Until the contact form there were two fields on the whole site: the help
 * centre's search box, styled here as `.mk-help-search`, and the newsletter's
 * single email input, which carried its styling inline as a 400-character
 * `className`. One inline field is a judgement call. Four of them — a name, an
 * address, a topic and a message, each repeating the same ring, radius,
 * padding and placeholder colour — is how the fifth one ends up 2px different
 * and nobody notices for a month. That is the rule `docs/DESIGN.md` sets for
 * every other part of the vocabulary, so the fields get a module like the
 * rest.
 *
 * Everything below is tokens. No value is invented here: the ground is the
 * `--surface-2` the brief names for inputs, the edge is `--hairline-strong`,
 * the corner is the 10px `--radius-btn` the buttons use, and the focus ring is
 * the same blue halo `.mk-help-search` already wears.
 */

export const formStyles = [
  /* The stack. One column; `.mk-form-row` opts a pair into sharing a line. */
  { ".mk-form": {
    "display": "grid",
    "gap": "14px",
  } },
  { ".mk-form-row": {
    "display": "grid",
    "gap": "14px",
  } },
  { "@media (width >= 36rem)": {
    ".mk-form-row": {
      "grid-template-columns": "1fr 1fr",
    },
  } },

  /* A label over its control. Logical gap, so it mirrors with the page. */
  { ".mk-field": {
    "display": "grid",
    "gap": "7px",
    "min-inline-size": "0",
  } },
  { ".mk-field > span": {
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "color": "var(--text-muted)",
    /* `start`, never `left`: the label sits on the reading edge of whichever
     language the page is in. */
    "text-align": "start",
  } },

  /*
   * The "optional" marker, inside the label.
   *
   * An `<em>` so it is part of the label's own text — a screen reader reads
   * "Phone, optional" as one accessible name, which is the whole point of
   * marking it. `font-style: normal` because the emphasis here is semantic,
   * not visual; italics in Arabic are a synthetic slant of a face that was
   * never drawn with one, and §2 of the design system does not have them.
   *
   * 12px is the site's floor and this sits on it. `margin-inline-start`, so
   * the marker follows the label in both directions.
   */
  { ".mk-field-hint": {
    "margin-inline-start": "0.5em",
    "font-size": "var(--fs-eyebrow)",
    "font-style": "normal",
    "font-weight": "400",
    "color": "var(--text-faint)",
  } },

  /*
   * What is wrong with a required field (25 Nov 2026), under its control. The
   * state hue, never colour alone: the sentence says what to fix, and the
   * control's `aria-describedby` points at it so a screen reader reads it with
   * the field. 13px, one step above the floor, because it has to be read.
   */
  /* `.mk-field > .mk-field-error`, not just the class: the message is a direct
     span of the label, and `.mk-field > span` (the label text) would win. */
  { ".mk-field > .mk-field-error": {
    "font-size": "0.8125rem",
    "font-weight": "500",
    "color": "var(--mk-state-rejected)",
  } },
  { ".mk-field :where(input, textarea, select)[aria-invalid=\"true\"]": {
    "box-shadow": "inset 0 0 0 1px var(--mk-state-rejected)",
  } },

  /*
   * The controls.
   *
   * Selected by element inside `.mk-field` rather than by a class on each
   * one, because an input, a textarea and a select have to be *identical*
   * here — three classes is three chances for them not to be.
   */
  { ".mk-field :where(input, textarea, select)": {
    "inline-size": "100%",
    "min-inline-size": "0",
    "border": "0",
    "border-radius": "var(--radius-btn)",
    "background": "var(--surface-2)",
    "box-shadow": "inset 0 0 0 1px var(--hairline-strong)",
    "padding-block": "11px",
    "padding-inline": "14px",
    "font": "inherit",
    "font-size": "var(--fs-ui)",
    "line-height": "1.5",
    "color": "var(--text)",
    /* A field is a box, and its text starts on the reading edge. */
    "text-align": "start",
    "transition": "box-shadow 160ms var(--ease-smooth)",
  } },
  /*
   * The select, and the chevron that belongs to it.
   *
   * `appearance: none` first, because the native arrow is the one piece of
   * interface on this site that the browser draws rather than we do. It is a
   * different glyph from every other chevron here, at a size and weight
   * nothing sets, and the browser lays it out *inside* the field's own
   * inline-end padding — so it sits hard against the rounded corner with no
   * room of its own, and a long option runs underneath it. On the Arabic
   * edition it lands on the corner the page ends at, where it reads as a
   * caret adrift in the gutter rather than part of the control.
   *
   * What replaces it is the site's own chevron, from the one icon system §6
   * allows: `Icon name="chevron"`, which is Line Awesome's `angle-down` —
   * the same glyph the nav disclosures use. It is positioned on
   * `inset-inline-end`, so it mirrors with the page and needs no RTL rule of
   * its own, and the control reserves width for it so the selected option can
   * never reach it. `angle-down` points down in both editions: a chevron
   * meaning "this opens" is not a direction, and it does not flip.
   */
  { ".mk-select": {
    "position": "relative",
    "display": "grid",
    "min-inline-size": "0",
  } },
  { ".mk-field select": {
    "appearance": "none",
    "-webkit-appearance": "none",
    /* 14px to the edge, a 16px glyph, 14px before the text. */
    "padding-inline-end": "44px",
    "cursor": "pointer",
  } },
  { ".mk-select-arrow": {
    "position": "absolute",
    "inset-inline-end": "14px",
    "inset-block-start": "50%",
    "transform": "translateY(-50%)",
    /* 60% white at rest, like every other icon on the site. */
    "color": "var(--text-muted)",
    /*
     * The chevron is a picture of the control, not a second target: a click
     * on it has to fall through to the select underneath, or the one part of
     * the field that looks most like a button is the one part that does
     * nothing.
     */
    "pointer-events": "none",
    "transition": "color 160ms var(--ease-smooth)",
  } },
  { ".mk-select:focus-within .mk-select-arrow": {
    "color": "var(--text)",
  } },

  { ".mk-field :where(input, textarea)::placeholder": {
    "color": "var(--text-faint)",
    /* Placeholders inherit the field's own resolved direction, so an Arabic
     hint in an `dir="ltr"` email field would otherwise start on the far side
     of a field nobody has typed in yet. */
    "opacity": "1",
  } },

  /*
   * Focus.
   *
   * The blue inset ring plus a soft halo, which is what the help search does
   * and what §10 of the design system specifies for an input. `base.js`
   * already draws a 2px outline on `:focus-visible` for every control on the
   * site; this is the resting ring turning blue underneath it, so a mouse
   * user gets the state too.
   */
  { ".mk-field :where(input, textarea, select):focus": {
    "box-shadow": "inset 0 0 0 1px var(--accent), 0 0 0 4px var(--accent-soft)",
  } },
  { ".mk-field :where(input, textarea, select):disabled": {
    "opacity": "0.6",
    "cursor": "not-allowed",
  } },

  /*
   * The message box.
   *
   * `resize: vertical` only: a horizontally resizable textarea inside a grid
   * column can be dragged wider than the card holding it, which on a phone
   * means a field that scrolls the page sideways. The height is in `lh` so
   * the box is six lines of whatever face the page is set in — Thmanya Sans
   * runs taller than Inter, and six lines is the unit that matters, not 9rem.
   */
  { ".mk-field textarea": {
    "min-block-size": "6lh",
    "resize": "vertical",
  } },

  /*
   * An invalid field, once the browser agrees it is invalid.
   *
   * `:user-invalid`, not `:invalid`: `:invalid` matches an empty required
   * field from the first paint, so every form on the site would open with
   * three red boxes before anybody had typed anything.
   */
  { ".mk-field :where(input, textarea):user-invalid": {
    "box-shadow": "inset 0 0 0 1px var(--mk-state-rejected)",
  } },

  /* A 44px target on a touch screen, like every other control here. */
  { "@media (pointer: coarse)": {
    ".mk-field :where(input, select)": {
      "min-block-size": "2.75rem",
    },
  } },

  /*
   * The honeypot.
   *
   * Off-screen rather than `display: none` or `hidden`: a bot that parses CSS
   * skips a hidden field, and some password managers skip them too. It is
   * taken out of the tab order and out of the accessibility tree on the
   * element itself — see the form component.
   */
  { ".mk-honeypot": {
    "position": "absolute",
    "inline-size": "1px",
    "block-size": "1px",
    "overflow": "hidden",
    "clip-path": "inset(50%)",
    "white-space": "nowrap",
  } },

  /*
   * The result line.
   *
   * Always in the DOM, never conditionally mounted, because it is the form's
   * `aria-live` region: a region that appears at the same moment as its text
   * is a region screen readers have not been watching, and the announcement
   * is lost. Empty and reserving no space until there is something to say.
   */
  { ".mk-form-status": {
    "font-size": "var(--fs-ui)",
    "line-height": "1.6",
    "color": "var(--text-muted)",
    "text-align": "start",
  } },
  { ".mk-form-status:empty": {
    "display": "none",
  } },
  { ".mk-form-status a": {
    "color": "var(--text)",
    "text-decoration": "underline",
    "text-underline-offset": "0.2em",
  } },
];
