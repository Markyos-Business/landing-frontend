import type { Locale } from "@/lib/i18n/locales";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Mark as BrandMark } from "@/components/brand/Logo";
import { Spark } from "@/components/ui/Spark";
import { isAppHandoff, localeHref } from "@/lib/i18n/href";

/*
 * The landing design's shared values, as components.
 *
 * ── Why these are inline styles and not classes ───────────────────────────
 *
 * The homepage is a literal trace of `Landing Copy/Markyos Landing AR
 * (readable).html`, which is a design-tool export: every value in it is an
 * inline style, and the point of tracing it rather than re-deriving it is
 * that the numbers come across unchanged. Pulling them into Tailwind classes
 * would mean re-deciding each one, which is the thing a trace is for not
 * doing.
 *
 * What lives here is only what the design file repeats — the two lifts, the
 * gradient clause, the pill, the tool chip, the icon tile. A value used once
 * stays at its use site, where it can be checked against the design file by
 * reading one line.
 *
 * `components/sections/` is exempt from the `raw-hex`, `physical-props`,
 * `inline-svg` and `type-floor` rules in `scripts/check-design-rules.mjs`
 * for exactly this reason; the exemption table there says so.
 */

/*
 * The ink, and its opacities.
 *
 * ── Three of these are darker than the design file's ─────────────────────
 *
 * The export sets its quietest greys at 55%, 50% and 45% of #0B0B0F. On this
 * near-white ground those land at 4.34:1, 3.9:1 and 3.5:1 against text — all
 * under the 4.5:1 that WCAG AA asks of text below 24px, and all used for
 * real copy: plan rows, column heads, card sublines, mock labels. A rendered
 * sweep counted 80 failures across the page.
 *
 * Black-on-white is a forgiving direction and it is easy to assume a grey is
 * fine because it looks fine; it was fine on the previous black site because
 * white-on-black at the same opacity is a different measurement entirely,
 * which is why the earlier audit found none of this.
 *
 * So the three quiet greys are darkened to clear the threshold — 62% for the
 * two that carry text, 58% for the smallest. The visible change is slight;
 * the names keep the design file's numbering so the mapping is still legible.
 * This is a deliberate departure from the trace, and the only one made for a
 * reason other than RTL correctness.
 */
export const INK = "#0B0B0F";
export const INK_72 = "rgba(11,11,15,.72)";
export const INK_64 = "rgba(11,11,15,.64)";
export const INK_62 = "rgba(11,11,15,.62)";
export const INK_55 = "rgba(11,11,15,.62)"; /* design file: .55 — 4.34:1 */
export const INK_50 = "rgba(11,11,15,.62)"; /* design file: .50 — 3.9:1 */
export const INK_45 = "rgba(11,11,15,.58)"; /* design file: .45 — 3.5:1 */

/* Blue, used as ink on light rather than as glow on black. */
export const BLUE = "#0099FF";
export const BLUE_DEEP = "#0055FF";

/* The grounds. */
export const CANVAS = "#F7F8FA";
export const PANEL = "#F4F6FA";
export const TRACK = "#F0F2F6";

/* The lifts. A card either rings or lifts; the long one is the page's. */
export const RING = "0 0 0 1px rgba(11,11,15,.05)";
export const RING_6 = "0 0 0 1px rgba(11,11,15,.06)";
export const LIFT = "0 0 0 1px rgba(11,11,15,.05),0 30px 70px -40px rgba(11,20,60,.28)";
export const LIFT_BLUE = "0 0 0 1px rgba(11,11,15,.06),0 40px 80px -44px rgba(0,85,255,.4)";
export const LIFT_CARD = "0 0 0 1px rgba(11,11,15,.06),0 24px 50px -30px rgba(0,85,255,.35)";
/* The one selected object in a composition: a lit ring and a soft halo. */
export const SELECTED = "0 0 0 1.5px #0099FF,0 0 0 6px rgba(0,153,255,.08)";

/* The dotted ground inside a mock frame. */
export const DOTS = "radial-gradient(rgba(11,11,15,.09) 1px,transparent 1.3px) 0 0/14px 14px,#F4F6FA";

/*
 * The headline's second clause.
 *
 * `background-clip: text` with a transparent fill, which is how the design
 * file paints it; it is the one gradient on the page.
 *
 * The values and the direction handling live in `.mk-accent-clause` rather
 * than here, for two reasons. The data-driven pages use the same treatment on
 * their own headlines and should not re-state it; and the design file's light
 * end was #0099FF, which is 2.82:1 on this ground — under the 3:1 that AA asks
 * of display text — so the figures belong somewhere they can be checked. See
 * `--mk-blue-ink` in theme.css.
 */
export function Accent({
  children,
  at,
  load = false,
}: {
  children: ReactNode;
  /*
   * Where this clause falls in the headline's word count — so it arrives
   * after the line above it rather than with it.
   *
   * It arrives as one phrase and not word by word, and that is forced rather
   * than chosen. `.mk-accent-clause` paints its blue through
   * `background-clip: text` with `color: transparent`, so what you see is the
   * *wrapper's* background showing through a text-shaped clip — the glyphs
   * themselves paint nothing. Fading the words inside it therefore fades
   * nothing at all, which is exactly what it did: the words measured 0.08,
   * 0.01, 0, 0, 0, 0 and the clause was fully, brightly visible in the
   * screenshot taken at the same instant. The animation has to be on the
   * element that owns the gradient. Giving each word its own clip would work
   * too and would restart the ramp six times across one line, which is a
   * change to a brand treatment and not this component's to make.
   */
  at?: number;
  /** Clock-driven rather than scroll-driven. The hero only — see `Words`. */
  load?: boolean;
}) {
  if (at === undefined) return <span className="mk-accent-clause">{children}</span>;
  return (
    <span
      className={`mk-accent-clause mk-word-at${load ? " mk-word-at-load" : ""}`}
      style={{ "--i": at } as CSSProperties}
    >
      {children}
    </span>
  );
}

/*
 * A display heading.
 *
 * Arabic is never tracked — the design file sets `--mk-track-display-ar: 0`
 * and the reason is mechanical, not aesthetic: negative tracking breaks the
 * joins between Arabic letters. Since this site is published in Arabic, the
 * heading carries no tracking and `[dir=rtl]` in globals.css keeps it at 0
 * for the Arabic face regardless.
 */
export function Display({
  as: Tag = "h2",
  id,
  size = "h2",
  children,
  style,
}: {
  as?: "h1" | "h2" | "h3";
  id?: string;
  size?: "hero" | "h2" | "h2lg" | "h3";
  children: ReactNode;
  style?: CSSProperties;
}) {
  const fs = {
    /*
     * A token, not a value, because the two scripts do not take the same
     * size. globals.css sets it per `lang`: see --mk-fs-hero.
     */
    hero: "var(--mk-fs-hero)",
    h2lg: "clamp(30px,4.6vw,56px)",
    h2: "clamp(30px,4.2vw,52px)",
    h3: "clamp(28px,3.6vw,44px)",
  }[size];

  return (
    <Tag
      id={id}
      style={{
        margin: 0,
        fontWeight: 500,
        fontSize: fs,
        lineHeight: size === "hero" ? "var(--mk-lh-hero)" : 1.3,
        textWrap: "balance",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* The lead paragraph under a heading. */
export function Lead({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <p
      className="mk-bidi"
      style={{
        margin: 0,
        fontSize: 17,
        lineHeight: 1.9,
        color: INK_64,
        textWrap: "pretty",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/*
 * The CTA.
 *
 * A `<Link>`, never a `<button>` that navigates — the one rule from
 * MARKYOS-DESIGN-SYSTEM.md that the landing design does not contradict and
 * that matters for anybody who opens things in a new tab.
 *
 * The press state is `:active` scaling in the design file. That is a hover
 * lift by another name, so it is left out: states, not choreography.
 *
 * `prefetch={false}` on an app handoff. `/start` and `/login` are redirected
 * off-site by next.config.ts, so Next prefetching them fires a cross-origin
 * request that can only answer with a redirect, caches nothing, and logs a
 * CORS failure on every page load. The hero alone has two of them. This is a
 * bug that has reached review here before — see the note on `isAppHandoff`.
 */
export function Cta({
  href,
  locale,
  children,
  size = "lg",
  tone = "solid",
  style,
}: {
  href: string;
  /*
   * Required, not optional, and that is the point.
   *
   * `href` here is a path without a locale — "/pricing", the same string
   * the Arabic page uses — so a link that does not go through
   * `localeHref` sends an English reader to the Arabic page. Seven of them
   * did, on the homepage, until 8 Nov 2026. Making this required turns
   * that from something a reviewer has to notice into a type error.
   */
  locale: Locale;
  children: ReactNode;
  size?: "lg" | "md" | "sm";
  /*
   * `light` is the pill inside `.mk-deep` — the closing panel, where the
   * page's near-black primary is the one fill that disappears. The ink and
   * the ground swap; nothing else about the control changes.
   */
  tone?: "solid" | "quiet" | "light";
  style?: CSSProperties;
}) {
  const h = { lg: 52, md: 50, sm: 40 }[size];
  const px = { lg: 26, md: 24, sm: 18 }[size];

  const pill = (
    <Link
      href={localeHref(locale, href)}
      prefetch={isAppHandoff(href) ? false : undefined}
      className="mk-bidi"
      style={{
        blockSize: h,
        paddingInline: px,
        borderRadius: 999,
        background: { solid: INK, light: "#fff", quiet: "transparent" }[tone],
        color: tone === "solid" ? "#fff" : INK,
        display: "inline-flex",
        alignItems: "center",
        /* Centred rather than packed to the start: a CTA in `.mk-doors` is
           stretched to the pair's shared width, and a label packed to the
           start edge of a box wider than itself looks like a mistake. */
        justifyContent: "center",
        gap: 10,
        fontSize: size === "sm" ? 15 : 16,
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </Link>
  );

  /*
   * The filled pill carries the cursor light; the quiet one does not.
   *
   * Same rule as `components/ui/Button.tsx`, and the same reason: one lit ask
   * per section. `tone="quiet"` is a transparent pill with ink type and
   * nothing to reflect, so it is left alone.
   */
  return tone === "quiet" ? (
    pill
  ) : (
    /*
     * `full` whenever the caller sized the pill itself. A CTA that was told to
     * fill its parent was told that about the box it used to be — this wrapper
     * is that box now, and a shrink-wrapped one would turn `100%` back into
     * "as wide as the label".
     */
    <Spark tone={tone === "light" ? "deep" : "ink"} full={style?.inlineSize === "100%"}>
      {pill}
    </Spark>
  );
}

/*
 * A text link out of a section.
 *
 * It used to end in an arrow — hence its old name, `ArrowLink`. The arrows
 * came off the whole site on 6 Nov 2026, so what marks it as a link now is
 * what marked it before the arrow was added: the one blue, and weight 500
 * against the 400 around it.
 */
export function TextLink({
  href,
  locale,
  children,
  style,
}: {
  href: string;
  /** Required. See the note on `Cta`. */
  locale: Locale;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <Link
      href={localeHref(locale, href)}
      prefetch={isAppHandoff(href) ? false : undefined}
      className="mk-bidi mk-tap"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        /* 15px text in a 24px line box: an inline link is the smallest thing
           on the page somebody has to hit, and the design system asks for
           44px on a coarse pointer. `.mk-tap` grows the hit area there
           without moving the text. */
        fontSize: 15,
        fontWeight: 500,
        color: BLUE_DEEP,
        ...style,
      }}
    >
      {children}
    </Link>
  );
}

/*
 * A tool name in the "replaces" row.
 *
 * `dir="ltr"` on a Latin name inside an Arabic line, set explicitly rather
 * than left to the bidi algorithm: "Guidelines.site" in an RTL paragraph
 * otherwise renders with its dot in the wrong place.
 */
export function ToolChip({
  name,
  latin,
  style,
}: {
  name: string;
  latin?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      dir={latin ? "ltr" : undefined}
      style={{
        minBlockSize: 34,
        padding: "4px 14px",
        borderRadius: 999,
        background: "#fff",
        boxShadow: "0 0 0 1px rgba(11,11,15,.06)",
        display: "inline-flex",
        alignItems: "center",
        fontFamily: latin ? "Inter, sans-serif" : undefined,
        fontSize: latin ? 13 : 14,
        color: INK_55,
        ...style,
      }}
    >
      {name}
    </span>
  );
}

/*
 * The icon tile: a glyph centred on a tinted rounded square.
 *
 * One shape at three sizes across the page — 34px in a list row, 36–38px
 * beside a label, 46px at the top of an audience card.
 */
export function IconTile({
  name,
  size = 38,
  tone = "blue",
  style,
}: {
  name: IconName;
  size?: number;
  tone?: "blue" | "ink" | "white";
  style?: CSSProperties;
}) {
  const bg = {
    blue: "rgba(0,153,255,.08)",
    ink: INK,
    white: "#fff",
  }[tone];

  return (
    <span
      aria-hidden="true"
      style={{
        flex: "none",
        inlineSize: size,
        blockSize: size,
        borderRadius: Math.round(size * 0.3),
        background: bg,
        boxShadow: tone === "white" ? RING : undefined,
        display: "grid",
        placeItems: "center",
        ...style,
      }}
    >
      <Icon
        name={name}
        size={Math.round(size * 0.5)}
        style={{ color: tone === "ink" ? "#fff" : BLUE_DEEP }}
      />
    </span>
  );
}

/*
 * The iconmark, at the ink colour the light page uses.
 *
 * A thin wrapper over `components/brand/Mark` rather than a second masking
 * implementation — §12 wants one place that knows where the brand files are,
 * and this page asks for the mark five times. The wrapper exists only to set
 * the colour, because the brand component paints `currentColor` and the
 * sections that use it are not inside an ink-coloured text context.
 */
export function Mark({ size, colour = INK }: { size: number; colour?: string }) {
  return (
    <span style={{ display: "block", color: colour }}>
      <BrandMark size={size} />
    </span>
  );
}

/*
 * The light pool behind the one object a section is about.
 *
 * Decorative, so it is aria-hidden and carries nothing. Positioned by the
 * caller because the design file places each one differently.
 */
export function Pool({ style }: { style: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        background:
          "radial-gradient(50% 50% at 50% 50%,rgba(0,153,255,.11),rgba(0,153,255,0) 70%)",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

/*
 * A section: 1120px wide, and more air around it than the design file gave it.
 *
 * The file's rhythm was 120px at the top end. It is 168px here, asked for on
 * 6 Nov 2026 — the page had grown denser than the trace and the sections had
 * stopped reading as separate things. The floor moved with it, because the
 * complaint is about the narrow widths too.
 */
export function Band({
  id,
  labelledBy,
  children,
  white = false,
  width = 1120,
  style,
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  /** The alternating white band. The design file alternates ground and white. */
  white?: boolean;
  width?: number;
  style?: CSSProperties;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      style={{
        position: "relative",
        padding: "clamp(100px,12vw,168px) 24px",
        background: white ? "#fff" : undefined,
        boxShadow: white ? "0 0 0 1px rgba(11,11,15,.04)" : undefined,
        ...style,
      }}
    >
      {/*
       * The section's own blocks reveal in sequence as the section arrives.
       *
       * One class here rather than one per section, because what a section's
       * direct children *are* is already the right granularity: a heading, a
       * lead, a picture, a grid, a closing row. A child too tall to reveal as
       * one piece — a seven-stop dial, an eight-card grid — carries
       * `mk-still mk-seq` instead and passes the reveal down to its own
       * children. See the motion block in globals.css for why half a viewport
       * is the limit.
       */}
      <div className="mk-seq" style={{ position: "relative", maxWidth: width, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}
