import { Words, wordCount } from "@/components/ui/Words";
import type { CSSProperties } from "react";
import type { HeroCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { isBeta } from "@/lib/launch";
import { BrandHub } from "@/components/mock/BrandHub";
import { Cover, GuidelinesBuilder, TEMPLATES } from "@/components/mock/GuidelinesBuilder";
import { Accent, Cta, Display, Mark, Pool } from "./landing";

/*
 * The two ends of the homepage.
 *
 * `Hero` is the opening; `variant="final"` is the closing ask. Both state the
 * same two-door choice — the copy deck is explicit that the visitor picks a
 * side in the hero, the sign-up screen asks the same question, and the final
 * CTA repeats it so the decision feels familiar rather than new — and both
 * CTAs carry equal weight at both ends: same fill, same size, neither quiet.
 * That is a positioning decision. Making one primary would tell the visitor
 * which audience we actually want, and half of them would be the wrong half.
 *
 * ── Why these are two components now ──────────────────────────────────────
 *
 * They were one, parameterised, because they say the same thing. They no
 * longer look like the same thing. The hero is a centred composition on paper,
 * open at the edges, with the light pooled behind it. The closing ask is
 * `.mk-deep`: an inverted panel, inset on the ground, copy packed to the
 * reading edge, light moving across the far side of it.
 *
 * The parameterised version had reached eight `final ?` ternaries — padding,
 * measure, type size, spacing, which decoration, whether the mark appears —
 * and the ninth would have been the alignment. A component whose every value
 * is a branch is two components sharing an argument list. What they actually
 * share is the copy type, the pair of doors, and the pre-launch ask, and both
 * get those by reading the same `HeroCopy`.
 */

/*
 * Which ask is live.
 *
 * Before launch there is no free plan to start, so a "Start free" button is a
 * promise the product cannot keep that day. `beta` is optional in the type and
 * this falls back to the public copy when it is absent, so a new hero cannot
 * accidentally lose its CTAs.
 */
function liveAsk(copy: HeroCopy) {
  return isBeta && copy.beta ? copy.beta : copy;
}

export function Hero({
  copy,
  locale,
  as = "h1",
  id,
  variant = "hero",
}: {
  copy: HeroCopy;
  /* The hub in the window reads the page's language. See BrandHub.tsx. */
  locale: Locale;
  as?: "h1" | "h2";
  id?: string;
  variant?: "hero" | "final";
}) {
  if (variant === "final") return <FinalCta copy={copy} locale={locale} as={as} id={id} />;

  const ask = liveAsk(copy);
  const scene = copy.scene;

  return (
    <section id="top" aria-labelledby={id} className="mk-hero">
      <Pool
        style={{
          insetInlineStart: "50%",
          top: -260,
          inlineSize: 1100,
          blockSize: 720,
          transform: "translateX(calc(-50% * var(--mk-dir)))",
        }}
      />

      {/*
       * One stage, and everything in it is positioned from its centre.
       *
       * Every chip and every cover is an offset from the product window's
       * centre rather than a position of its own — which is what makes
       * "gather into the hub" and "deal out of the builder" tweens toward
       * and away from zero instead of hand-offs between two coordinate
       * systems. The offsets carry `--mk-dir`, so the arc and the cascade
       * both lean the way the page reads.
       */}
      <div className="mk-hero-stage">
        <div className="mk-hero-head mk-seq-load">
          <Display as={as} id={id} size="hero">
            <span className="mk-bidi">
              <Words load>{copy.headline}</Words>
            </span>
            {/*
             * A hard break, not a wrap.
             *
             * §3.2 wants each line to animate on its own, and the deck's two
             * lines are the slogan's two halves — «الاستوديو يبنيها،» and
             * «والشركة تحييها.» The break is what pairs each line with the
             * card floating beside it, so it cannot be left to the measure.
             *
             * Each line is its own `.mk-bidi`, which is also what lets the
             * two resolve their direction separately. The deck's own markup
             * note says "inline-block span"; that is the one thing this
             * cannot copy — an inline-block is atomic to the plaintext scan
             * and would send every Arabic headline to the wrong edge. See
             * the note on `.mk-words` in globals.css.
             */}
            {copy.headlineAccent ? (
              <>
                <br />
                <Accent load at={wordCount(copy.headline)}>
                  <span className="mk-bidi">{copy.headlineAccent}</span>
                </Accent>
              </>
            ) : null}
          </Display>

          <p className="mk-hero-sub mk-bidi mk-load-move">{copy.subheadline}</p>

          <Doors ask={ask} locale={locale} />

          <p className="mk-hero-micro mk-bidi">{ask.microcopy}</p>
        </div>

        {/*
         * The scene: the window, and everything that moves in and out of it.
         *
         * This container exists so the coordinate system is real rather than
         * approximate. The chips and the covers are positioned from *its*
         * centre, and the only thing in its flow is the window — so its
         * centre is the window's centre, and "gather into the hub" and "deal
         * out of the builder" are both tweens toward and away from zero,
         * with no second set of magic numbers to keep in step. The chips
         * rest far above it, which is why they overflow it upward and why
         * nothing here clips.
         */}
        <div className="mk-hero-scene">
          {scene ? (
            /*
             * Act one: the brand's elements, as names, fanned in an arc.
             *
             * `aria-hidden`, and so is the deck below: both are a picture of
             * what the window does, and what they say the headline and the
             * sub already say in sentences. The caption under the covers is
             * the exception — it is a claim, not a label on a picture, so it
             * is the one string here a screen reader is read.
             */
            <ul className="mk-hero-fan" aria-hidden="true">
              {scene.elements.map((name, i) => (
                <li key={name} className="mk-hero-chip" style={chipAt(i, scene.elements.length)}>
                  <span className="mk-bidi">{name}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {/*
           * Act two: the window, peeking up from the bottom edge, and the
           * cross-fade inside it.
           *
           * Two panes in one grid cell. The hub is the brand's centre, which
           * is where the names are going; the builder is what you open once
           * they are all in. Both are rendered as markup rather than
           * captured as images — which is what lets "real product only, no
           * invented UI" hold without a screenshot pipeline.
           */}
          <div className="mk-hero-window" aria-hidden="true">
            <div className="mk-hero-pane mk-hero-pane-hub">
              <BrandHub locale={locale} />
            </div>
            <div className="mk-hero-pane mk-hero-pane-builder">
              <GuidelinesBuilder locale={locale} />
            </div>
          </div>

          {scene ? (
            /* Act three: the builder deals out the templates it ships with. */
            <div className="mk-hero-deck">
              <ul aria-hidden="true">
                {TEMPLATES.map((t, i) => (
                  <li key={t.kind} className="mk-hero-cover" style={coverAt(i)}>
                    <Cover kind={t.kind} locale={locale} />
                  </li>
                ))}
              </ul>
              <p className="mk-hero-deck-label mk-bidi">{scene.templatesLabel}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/*
 * Where a chip rests, and when it leaves.
 *
 * Two columns, one down each side of the headline — which is where the
 * floating cards were before this, and where they are asked to be again.
 * The list alternates into them, so the names read down the page in pairs
 * rather than all of one column then all of the other.
 *
 * Computed here rather than written as seven CSS rules because every value
 * is a function of the chip's place in its column, and the columns are as
 * long as the locale's list — a language that names six elements should get
 * two columns of three, not six of a seven-chip layout with a hole in it.
 *
 * Only the factors live here. The column's distance from the centre, its
 * height on the page and the gap between its rows are all `clamp()`s in the
 * stylesheet, because all three have to narrow with the headline and only
 * the stylesheet knows how wide the headline is.
 */
function chipAt(i: number, n: number): CSSProperties {
  /* Even to the start flank, odd to the end flank. With seven names that is
     four and three, and the odd one out is on the reading-edge side. */
  const side = i % 2 === 0 ? -1 : 1;
  const rank = Math.floor(i / 2);
  const count = side === -1 ? Math.ceil(n / 2) : Math.floor(n / 2);
  /* The row's offset from the middle of its own column: -1.5 … 1.5 for four,
     -1 … 1 for three. A column of either length stays centred on the
     headline. */
  const k = rank - (count - 1) / 2;

  return {
    "--mk-f": side,
    /* Every other chip sits a little further out, so the column reads as
       scattered rather than as a list box with the labels stripped off. */
    "--mk-b": rank % 2,
    "--mk-k": k,
    "--mk-r": `${(side * (5 + rank * 1.2)).toFixed(1)}deg`,
    /* Top of the column leaves first, so the two columns drain downward into
       the hub in pairs. One unitless step for the entrance, the same step as
       a length for the gather. */
    "--mk-s": rank,
    "--mk-in": `${rank * 40}px`,
  } as CSSProperties;
}

/*
 * Where a cover lands, and when it is dealt.
 *
 * Three covers, so these are written out: a cascade is a composition and not
 * a formula, and the last one is placed to run off the window's bottom edge
 * on purpose — the clip is what says there are more pages behind it.
 *
 * Unlike the chips these are plain lengths. The cascade sits over the window,
 * the window is a fixed 1000px at its widest, and below 810px the whole
 * scroll story is off.
 */
function coverAt(i: number): CSSProperties {
  const deck = [
    { x: -228, y: -90, r: -8, in: 640 },
    { x: -34, y: 40, r: 0, in: 680 },
    { x: 160, y: 170, r: 8, in: 720 },
  ][i];

  return {
    "--mk-x": `${deck.x}px`,
    "--mk-y": `${deck.y}px`,
    "--mk-r": `${deck.r}deg`,
    "--mk-in": `${deck.in}px`,
  } as CSSProperties;
}

/*
 * The closing ask.
 *
 * ── Why the page now ends on an object ────────────────────────────────────
 *
 * It ended on `.mk-horizon`: a 900px ellipse, white at its crown, fading into
 * the ground, lit from below in blue. The intent was that the page end on
 * light rather than on the footer rule. What it did was end the page by
 * dissolving it — a wash the same colour as the ground, arriving at exactly
 * the moment the visitor is asked to decide. The decision was set on nothing.
 *
 * So the ask is an object: the one panel on a paper-white site where the ink
 * inverts, which is what makes the last thing on the page the loudest thing on
 * it. Everything that makes it a panel rather than a box is in `.mk-deep` —
 * the two blue stops solved for white text, the light across the far side, the
 * two lens shapes, and how each of those mirrors in Arabic.
 *
 * ── What sits in it ───────────────────────────────────────────────────────
 *
 * The copy packs to the reading edge rather than centring, because the far
 * side is where the light is: a centred block would sit in it, and the lens
 * shapes would read as something gone wrong behind the text rather than as a
 * surface catching the light.
 *
 * The mark and the eyebrow share the first line. The mark because the page
 * ought to close on it, and `copy.eyebrow` because it was already written —
 * «ابدأ اليوم» has sat in content/ar/overrides.ts unrendered since the copy
 * deck was built, the hero having never had a slot for it. There was a 28px
 * rule between them; it went when dashes came off the page.
 */
function FinalCta({
  copy,
  locale,
  as,
  id,
}: {
  copy: HeroCopy;
  locale: Locale;
  as: "h1" | "h2";
  id?: string;
}) {
  const ask = liveAsk(copy);

  return (
    <section
      id="cta"
      aria-labelledby={id}
      style={{ padding: "clamp(72px,9vw,120px) 24px clamp(104px,12vw,160px)" }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div className="mk-pop mk-deep">
          <span aria-hidden="true" className="mk-deep-wave mk-deep-wave-a" />
          <span aria-hidden="true" className="mk-deep-wave mk-deep-wave-b" />

          <div style={{ position: "relative", maxWidth: 680 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBlockEnd: 26,
              }}
            >
              <Mark size={30} colour="#fff" />
              {copy.eyebrow ? (
                /*
                 * No rule between the mark and the eyebrow.
                 *
                 * It was a 28px drawn line rather than an em dash typed into
                 * the string, so it could not be read aloud or stranded at a
                 * wrap. It was still a dash to look at, and dashes came out
                 * of this page's content on 6 Nov 2026 — so the gap does the
                 * separating now, which is what the gap was already for.
                 */
                <span className="mk-eyebrow mk-bidi" style={{ color: "var(--mk-on-deep-soft)" }}>
                  {copy.eyebrow}
                </span>
              ) : null}
            </div>

            <Display as={as} id={id} size="h2lg">
              <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
              {/*
               * The accent clause, if a closing headline ever carries one.
               *
               * Not `<Accent>`: that paints #0077FF→#0055FF through
               * `background-clip: text`, and #0055FF is this panel's own
               * ground. Neither closing headline splits today, so this branch
               * is insurance — against the clause arriving later, and arriving
               * invisible.
               */}
              {copy.headlineAccent ? (
                <>
                  {" "}
                  <span className="mk-bidi" style={{ color: "var(--mk-on-deep-soft)" }}>
                    <Words offset={wordCount(copy.headline)}>{copy.headlineAccent}</Words>
                  </span>
                </>
              ) : null}
            </Display>

            <p
              className="mk-bidi"
              style={{
                margin: "22px 0 0",
                maxWidth: 560,
                fontSize: 18,
                lineHeight: 1.8,
                color: "var(--mk-on-deep-soft)",
                textWrap: "pretty",
              }}
            >
              {copy.subheadline}
            </p>

            <Doors ask={ask} locale={locale} tone="light" style={{ marginBlockStart: 36 }} />

            <p
              className="mk-bidi"
              style={{ margin: "16px 0 0", fontSize: 14, color: "var(--mk-on-deep-soft)" }}
            >
              {ask.microcopy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * The two doors, as one object.
 *
 * They were two shrink-to-fit pills side by side, which made them 215px and
 * 183px wide — the Arabic labels are two words and three — and a 32px
 * difference between two buttons of deliberately equal weight reads as one of
 * them being the lesser ask. That is the opposite of what this pair is for, so
 * `.mk-doors` sizes both to the wider label and stacks them full-width on a
 * phone. See globals.css.
 */
function Doors({
  ask,
  locale,
  tone = "solid",
  style,
}: {
  ask: Pick<HeroCopy, "studioCta" | "companyCta">;
  locale: Locale;
  tone?: "solid" | "light";
  style?: CSSProperties;
}) {
  return (
    <div className="mk-doors" style={style}>
      <Cta locale={locale} href={ask.studioCta.href} tone={tone}>
        {ask.studioCta.label}
      </Cta>
      <Cta locale={locale} href={ask.companyCta.href} tone={tone}>
        {ask.companyCta.label}
      </Cta>
    </div>
  );
}
