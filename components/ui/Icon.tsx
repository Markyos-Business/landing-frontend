import type { HTMLAttributes } from "react";

/*
 * The icon set: Line Awesome 1.3.0, and nothing else.
 *
 * One icon system is the rule (MARKYOS-DESIGN-SYSTEM.md §1.10 and §6). No
 * hand-drawn SVG, no PNG icons, no emoji and no Unicode symbols standing in
 * for icons. This file used to hold fourteen hand-drawn paths; they were a
 * second icon system in all but name, and the first time a section needed a
 * fifteenth glyph somebody would have drawn it in a slightly different hand.
 *
 * The font and its `.la-*` class map come from the `line-awesome` package,
 * imported once in app/[lang]/layout.tsx. The package carries its own woff2,
 * so nothing is fetched from a CDN at runtime.
 *
 * ── Why a wrapper rather than `<i class="las la-folder">` at call sites ───
 *
 * Three reasons, and they are the same reasons the design system ships its
 * own Icon component. The glyph names stay in one table, so renaming one is
 * one edit. Sizing stays on the 16/18/22 steps instead of whatever a section
 * felt like. And the accessibility decision is made once: these are all
 * decoration beside a visible label, so the element is `aria-hidden` and
 * announces nothing — an icon that is ever the *only* label for a control
 * passes `label` and stops being hidden.
 *
 * Unicode arrows (→ ← ↓ ↗ ⇄) are still correct *inside copy* — "Learn more →"
 * is text, not an icon. They just never stand in for one of these.
 *
 * If a glyph is missing from Line Awesome: ask. Do not draw one.
 *
 * The logo is not an icon. It lives in components/brand/Logo.tsx and renders
 * the real files from public/brand/.
 */

export type IconName =
  | "languages"
  | "palette"
  | "layers"
  | "scan"
  | "penSquare"
  | "users"
  | "user"
  | "package"
  | "grid"
  | "check"
  | "form"
  | "phone"
  | "rocket"
  | "arrow"
  | "chevron"
  | "menu"
  | "close"
  /*
   * Added for the v2 homepage's product grid. Every one is a glyph Line
   * Awesome already ships — this is a name added to the indirection, not a
   * drawn icon, which is the line §6 actually draws.
   */
  | "folder"
  | "folderOpen"
  | "database"
  | "lock"
  | "globe"
  | "plus"
  | "minus"
  | "arrowUp";

/*
 * Our names → Line Awesome's.
 *
 * The keys are what a section asks for and read in the language of this site;
 * the values are the glyph names in the font. Keeping the indirection means a
 * section never has to know that "scan" is drawn as a magnifying glass.
 */
const LA: Record<IconName, string> = {
  languages: "language",
  palette: "palette",
  layers: "layer-group",
  scan: "search",
  penSquare: "pen-square",
  users: "users",
  user: "user",
  package: "box",
  grid: "th-large",
  check: "check",
  form: "clipboard-list",
  phone: "mobile-alt",
  rocket: "rocket",
  arrow: "arrow-right",
  chevron: "angle-down",
  menu: "bars",
  close: "times",
  folder: "folder",
  folderOpen: "folder-open",
  database: "database",
  lock: "lock",
  globe: "globe",
  plus: "plus",
  minus: "minus",
  arrowUp: "arrow-up",
};

export function Icon({
  name,
  label,
  size = 20,
  className = "",
  ...props
}: {
  name: IconName;
  /** Only when the icon is the sole label for a control. Otherwise omit it. */
  label?: string;
  size?: number;
} & Omit<HTMLAttributes<HTMLElement>, "children">) {
  return (
    <i
      {...props}
      className={`las la-${LA[name]}${className ? ` ${className}` : ""}`}
      style={{
        fontSize: size,
        lineHeight: 1,
        /*
         * A square box at the glyph's own size. An icon font is text, so
         * without this it takes the advance width of whichever glyph it is,
         * and a row of icons sits at a row of different widths.
         */
        inlineSize: "1em",
        textAlign: "center",
        flex: "none",
        display: "inline-block",
        ...props.style,
      }}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    />
  );
}

/*
 * The arrow that follows a CTA label.
 *
 * It points the way the page reads, so in Arabic it points the other way.
 * `.mk-arrow` does the flip in CSS — one rule, and no component can forget
 * it. There is no hover nudge: states, not choreography.
 */
export function Arrow({ size = 16 }: { size?: number }) {
  return <Icon name="arrow" size={size} className="mk-arrow" />;
}
