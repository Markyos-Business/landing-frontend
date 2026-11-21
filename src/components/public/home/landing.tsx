import type { Locale } from "@/lib/i18n/locales";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName, Mark as BrandMark } from "@/components/ui";
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
 * `src/components/public/home/` is exempt from the `raw-hex`, `physical-props`,
 * `inline-svg` and `type-floor` rules in `scripts/check-design-rules.mjs`
 * for exactly this reason; the exemption table there says so.
 */

/*
 * The ink, the grounds and the lifts -- as tokens, not as values.
 *
 * -- Why these stopped being hex, 18 Nov 2026 ------------------------------
 *
 * These constants were the design file's own numbers, read off a *light*
 * page: #0B0B0F ink at seven opacities on an #F7F8FA ground, white cards on
 * long blue-grey shadows. The 21st.dev-style brief replaces that ground with
 * a near-black canvas, and a hardcoded near-black ink does not survive that
 * change -- it would have painted black text on a black page across every
 * section that imports from here, which is twenty-seven files.
 *
 * So each one now names the token that already carries its meaning. The
 * mapping is the point: `INK` was never "the colour #0B0B0F", it was "the
 * colour type is set in", and `--text` is that colour on whichever ground the
 * site is currently on. Re-pointing the token layer now moves the homepage
 * with it instead of leaving it behind.
 *
 * -- The three AA departures are gone, and that is not a regression ---------
 *
 * On the light ground, the design file's quietest greys (55%, 50% and 45% of
 * the ink) measured 4.34:1, 3.9:1 and 3.5:1 -- all under AA for text below
 * 24px, and all carrying real copy, so they were darkened to 62/62/58 and the
 * names kept the file's numbering to keep the mapping legible.
 *
 * That correction is no longer needed at this layer: `--text-muted` is solved
 * for the dark canvas once, in tailwind/tokens.js, at about 6.9:1. The five
 * middle steps therefore collapse onto it. They are kept as separate names
 * only so the twenty-seven importers do not all have to change at once, and
 * so a future ground can pull them apart again.
 *
 * `--text-faint` is the one step below, for meta and column heads.
 */
export const INK = "var(--text)";
export const INK_72 = "var(--text-secondary)";
export const INK_64 = "var(--text-muted)";
export const INK_62 = "var(--text-muted)";
export const INK_55 = "var(--text-muted)";
export const INK_50 = "var(--text-muted)";
export const INK_45 = "var(--text-faint)";

/*
 * Blue.
 *
 * These two are unchanged, and on this ground they finally behave the way the
 * design system always described them. #0099FF measures about 6.0:1 on the
 * near-black canvas, so it is legible as ink here where it was 2.82:1 on the
 * light page and had to be swapped for #0077FF; #0055FF stays the falloff for
 * gradients and glows.
 *
 * The brief's own `--primary` -- the electric blue on the buttons -- is a
 * third, deeper value and lives only in the token layer, because it is a fill
 * and fails as text at any size.
 */
export const BLUE = "#0099FF";
export const BLUE_DEEP = "#0055FF";

/*
 * The blue that is allowed to carry text.
 *
 * `BLUE` and `BLUE_DEEP` are fills and glows. #0055FF as *ink* measures about
 * 3.2:1 on this canvas -- under AA for anything below 24px -- and it was
 * being used for exactly that in ten places: category pills, table column
 * heads, the locale row's accent number, icon glyphs, the path links.
 *
 * `--mk-blue-ink` is oklch(0.76 0.14 255), about 8.4:1, and still reads as
 * the brand blue. Fills keep the deep value; only ink moved. This is the same
 * split the light page needed in the opposite direction, where #0099FF was
 * too pale to set type in and #0077FF was the answer.
 */
export const BLUE_INK = "var(--mk-blue-ink)";

/* The grounds. */
export const CANVAS = "var(--canvas)";
export const PANEL = "var(--surface-2)";
export const TRACK = "var(--track)";

/*
 * The lifts -- which are edges now.
 *
 * The brief is explicit that cards carry a hairline and no drop shadow, so
 * `LIFT` and `RING` have converged: both are the 1px white-at-7.5% edge that
 * `--lift-card` and `--lift-ring` now describe. `LIFT_CARD` keeps a glow,
 * because the one card a section is about is still allowed to be lit.
 */
export const RING = "var(--lift-ring)";
export const RING_6 = "var(--lift-ring)";
export const LIFT = "var(--lift-card)";
export const LIFT_CARD = "var(--lift-blue)";
/* The one selected object in a composition: a lit ring and a soft halo. The
 halo doubles on dark -- at 8% it was invisible against the canvas. */
export const SELECTED = "0 0 0 1.5px #0099FF,0 0 0 6px rgba(0,153,255,.16)";

/* The dotted ground inside a mock frame, inverted for the dark panel. */
export const DOTS =
  "radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.3px) 0 0/14px 14px,var(--surface-2)";

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
 * `--mk-blue-ink` in tailwind/tokens.js.
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
 * heading carries no tracking and `[dir=rtl]` in tailwind/ keeps it at 0
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
     * size. tailwind/ sets it per `lang`: see --mk-fs-hero.
     */
    hero: "var(--mk-fs-hero)",
    /*
     * One section size, which is the brief's: clamp(28px, 3.6vw, 44px) for a
     * section title and for the big statement line alike. These were three
     * sizes (56 / 52 / 44) traced off the light design file; the brief gives
     * the whole section tier a single step, and collapsing them is most of
     * why the page now reads as one rhythm rather than three.
     */
    h2lg: "clamp(28px,3.6vw,44px)",
    h2: "clamp(28px,3.6vw,44px)",
    h3: "clamp(28px,3.6vw,44px)",
  }[size];

  /*
   * The weight, per role.
   *
   * This was a flat `fontWeight: 500` -- correct when the design system
   * capped every weight at 500, and the reason the homepage hero was still
   * arriving at 500 after the token layer had been moved to 700: an inline
   * style beats the class that was carrying the new weight.
   *
   * The hero is the brief's display weight; everything in the section tier
   * stays at 500, which the brief also asks for. Card titles are not this
   * component -- they are `.mk-h3` at 600.
   */
  const weight = size === "hero"
    ? "var(--mk-weight-display)"
    : "var(--mk-weight-text-medium)";

  return (
    <Tag
      id={id}
      style={{
        margin: 0,
        fontWeight: weight,
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
  tone?: "solid" | "quiet" | "light" | "onDeep";
  style?: CSSProperties;
}) {
  /*
   * The brief's two button sizes, not the design file's three pills.
   *
   * 52 / 50 / 40px pills at 26px of padding were traced off the light design
   * file. The brief gives buttons two sizes -- 44px tall with 15px text for a
   * hero or a section, 32px with 13px text inside a card or the header -- and
   * a 10px corner instead of a pill. `md` collapses onto `lg`: the brief has
   * no middle size, and 50 against 52 was never a distinction anyone could
   * see.
   */
  const h = { lg: 44, md: 44, sm: 32 }[size];
  const px = { lg: 20, md: 20, sm: 12 }[size];

  const pill = (
    <Link
      href={localeHref(locale, href)}
      prefetch={isAppHandoff(href) ? false : undefined}
      /* `.mk-press` is the brief's 0.97 on press. This CTA is a styled Link
         rather than a `.mk-btn`, so it does not inherit the button's own. */
      className="mk-bidi mk-press"
      style={{
        blockSize: h,
        paddingInline: px,
        borderRadius: "var(--radius-btn)",
        /*
         * The brief's two fills.
         *
         * `solid` is the primary: the one electric blue with a white label
         * and the 1px inset lip along its top edge, which is what reads as a
         * light source above the page rather than as a blue rectangle.
         * `light` is the secondary: white at 8% and no edge, because the
         * brief is explicit that the secondary has a fill and no border, so
         * the pair differs by fill alone.
         *
         * Briefly, between the ground going dark and this change, `solid` was
         * the *inverted* pill -- `INK` as a fill, which now resolves to
         * near-white. It was correct arithmetic and the wrong button: the
         * hero's two asks rendered as white lozenges.
         */
        background: {
          solid: "var(--solid)",
          /*
           * `onDeep` is the primary, inverted.
           *
           * The closing panel is the one place on the page where the accent
           * is the *ground*, so the blue fill cannot be the loud button
           * there -- it would be a blue rectangle on a blue panel. Both
           * doors wore `light` instead, an 8%-white ghost, and measured on
           * the rendered panel that is a fill you have to look for: the pair
           * read as two outlines rather than as the page's closing ask.
           *
           * White, with the canvas as ink, which is what `.mk-deep-solid`
           * already does on all fifty-one content pages. Named for the
           * ground rather than for the role, for the same reason that rule
           * had to stop saying `var(--text)`: this pill is white in both
           * themes because of where it sits.
           */
          onDeep: "var(--mk-on-deep)",
          light: "var(--ghost-fill)",
          quiet: "transparent",
        }[tone],
        color: tone === "solid" ? "var(--solid-ink)"
          : tone === "onDeep" ? "var(--canvas)"
          : "var(--text)",
        boxShadow: tone === "solid" ? "var(--solid-lip)" : undefined,
        display: "inline-flex",
        alignItems: "center",
        /* Centred rather than packed to the start: a CTA in `.mk-doors` is
           stretched to the pair's shared width, and a label packed to the
           start edge of a box wider than itself looks like a mistake. */
        justifyContent: "center",
        gap: 10,
        fontSize: size === "sm" ? 13 : 15,
        fontWeight: "var(--mk-weight-text-medium)",
        ...style,
      }}
    >
      {children}
    </Link>
  );

  /*
   * No cursor light on buttons.
   *
   * `Spark` painted a specular highlight inside the pill and lit the nearest
   * edge, resting at 0.42 so a light page could carry ten of them. On the dark
   * ground it reads as a blue halo around every button, and the reference
   * (docs/21st-reference/screenshots/01-hero.jpg) has no glow on buttons at
   * all: the primary is a flat blue fill with a 1px inset lip, the secondary is
   * a flat ghost fill, and both are clean-edged. The brief's section 3 gives
   * buttons exactly three states -- brighten on hover, scale 0.97 on press, and
   * the lip -- so the glow is gone rather than re-tuned.
   */
  return pill;
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
        color: BLUE_INK,
        ...style,
      }}
    >
      {children}
    </Link>
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
  /*
   * The tile fills. `blue` doubles its alpha for this ground -- an 8% tint
   * of #0099FF was a visible wash on near-white and is nothing on
   * near-black -- and `ink` becomes a raised grey rather than the inverted
   * fill, because the glyph on it is set in `--text` and an inverted tile
   * would need an inverted glyph as well for one tone out of three.
   */
  const bg = {
    blue: "rgba(0,153,255,.16)",
    ink: "var(--surface-3)",
    white: "var(--surface-1)",
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
        style={{ color: tone === "ink" ? "var(--text)" : BLUE_DEEP }}
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
        /* The alternating band. On the light page the page was #F7F8FA and
           the band was white; here the page is the darker of the two and the
           band is the card surface, so the alternation reads the same way
           round -- the band is always the lighter field. */
        background: white ? "var(--surface-1)" : undefined,
        boxShadow: white ? "var(--lift-ring)" : undefined,
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
       * children. See the motion block in tailwind/ for why half a viewport
       * is the limit.
       */}
      <div className="mk-seq" style={{ position: "relative", maxWidth: width, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}
