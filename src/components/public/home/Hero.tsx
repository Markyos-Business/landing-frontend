import { Words, wordCount, CobaltLouvre } from "@/components/ui";
import type { CSSProperties } from "react";
import type { HeroCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { isBeta } from "@/lib/launch";
import { BrandHub } from "@/components/public/mock/BrandHub";
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
      {/*
       * The hero background: the cobalt louvre shader.
       *
       * This was `.mk-aurora` -- three blurred radial gradients on one
       * element -- chosen because `BRIEF.md` §7 asks for Lighthouse >= 90 on
       * mobile and a GL context costs a shader compile, a composite layer and
       * a rAF loop before the headline paints. The owner supplied the shader
       * and asked for it here, so the cost is paid down instead: the
       * component caps devicePixelRatio at 1.5, stops its loop entirely once
       * the hero is off screen, and draws a single static frame under
       * `prefers-reduced-motion`. See the header of CobaltLouvre.tsx.
       *
       * `.mk-aurora` is not gone -- every *other* page's hero now carries it
       * (see HeroBlock.tsx), which is what makes the two editions and the
       * fifty-one pages read as one site with a louder front door.
       *
       * The host is absolutely positioned and masked out at the bottom so the
       * hero still has no hard edge, exactly as the gradient version did.
       * `aria-hidden`: it is light, not content.
       */}
      <div className="mk-hero-shader" aria-hidden="true">
        <CobaltLouvre
          background="#0a0a0d"
          glowColor="#0a3cff"
          twists={4.4}
          ribbonWidth={44}
          speed={3.3}
          /*
           * Dimmer than the component's default, and lower in the frame.
           *
           * At the supplied intensity of 1.3 the ribbon is the brightest
           * thing on the page and the hero copy sits on top of it: measured,
           * the subtitle fell to about 1.6:1 and the microcopy under the
           * buttons vanished. This is a background, so it is lit to sit
           * behind type rather than to be looked at, and its peak is pushed
           * below the headline.
           */
          /*
           * The lit band covers the frame, rather than sitting at the foot of
           * it.
           *
           * `center` is a percentage down the frame and `spread` is the
           * envelope's half-width around it (see `u_center` / `u_spread` in
           * CobaltLouvre.tsx -- the envelope is always on the y axis, whatever
           * `orientation` does to the ribbon). This was 80/26: a narrow band
           * low in the hero, which is where it went when the supplied 51/44 at
           * intensity 1.3 measured 1.6:1 behind the subtitle.
           *
           * 52/74 lights the whole height. The contrast is held by the scrim
           * in `.mk-hero-shader::after` instead of by placement, and the
           * intensity comes down a step because far more of the frame is lit
           * now -- measured on the rebuilt page, the hero copy is absent from
           * the contrast audit and the page's failures did not move.
           */
          light={{ intensity: 0.95, center: 52, spread: 74 }}
          glass={{ slats: 10, magnify: 5, refraction: 5, groove: 4, edgeLight: 0 }}
        />
      </div>
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
          {/*
           * No badge above the headline.
           *
           * There was a glass pill here carrying `hero.eyebrow` — "the brand
           * platform, in Arabic and English" — taken from the reference, which
           * puts one quiet line above its headline. The owner asked for it to
           * go on 19 Nov 2026, so the headline is now the first thing in the
           * head and the first thing read.
           *
           * `hero.eyebrow` stays in the copy, unrendered, which is where it
           * was before the pill existed: both editions still carry it, so
           * `check:locales` parity is untouched and the line is there if it is
           * ever wanted back.
           */}
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
             * the note on `.mk-words` in tailwind/.
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
           * Act two, and now the only act: the window, peeking up from the
           * bottom edge, with the brand hub in it.
           *
           * It held two panes and crossed between them -- the hub, then the
           * guidelines builder, then three cover templates dealt out of the
           * builder and pulled down past it. The owner asked on 19 Nov 2026
           * for one screen and one movement: the tags travel down into the
           * hub, and that is the whole story. So the builder, the deck and
           * the hub's own fade-out are gone, and what is left is a single
           * product screen that arrives and stays.
           *
           * Rendered as markup rather than captured as an image, which is
           * what lets "real product only, no invented UI" hold without a
           * screenshot pipeline.
           */}
          <div className="mk-hero-window" aria-hidden="true">
            <div className="mk-hero-pane mk-hero-pane-hub">
              <BrandHub locale={locale} />
            </div>
          </div>

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
  /*
   * The row's place in its column, as a fraction of the column's own height:
   * -0.5 at the top, +0.5 at the bottom, whatever the count.
   *
   * It was `rank - (count - 1) / 2` -- a row *index* either side of the
   * middle -- which the stylesheet multiplied by a fixed row pitch. That ties
   * a column's height to how many names are in it: the four-name flank came
   * out a row taller than the three-name one, and both were sized by a pitch
   * that had to stay small enough for four. Seven chips ended up stacked in
   * the top 200px of a 1036px hero, and the first one of each column was
   * *above* it -- measured at 1440 the top chip sat at y = -40, and at 1920
   * at y = -92, clipped off by the section's own `overflow: clip`.
   *
   * A fraction instead. The stylesheet owns one length, `--mk-span`, and both
   * columns stretch across it, so they start and end level however the seven
   * divide. Spreading them down the flanks is then one number to change
   * rather than two that have to be kept in agreement.
   */
  const k = count > 1 ? rank / (count - 1) - 0.5 : 0;

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

            <Doors ask={ask} locale={locale} tone="onDeep" style={{ marginBlockStart: 36 }} />

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
 * phone. See tailwind/.
 */
function Doors({
  ask,
  locale,
  tone = "solid",
  style,
}: {
  ask: Pick<HeroCopy, "studioCta" | "companyCta">;
  locale: Locale;
  tone?: "solid" | "light" | "onDeep";
  style?: CSSProperties;
}) {
  return (
    <div className="mk-doors" style={style}>
      {/*
       * Two doors, both lit.
       *
       * These two are peers in meaning: one door for a studio, one for a
       * company, and the page does not prefer either. That is also how the
       * copy deck reads them — §1.4 has the visitor pick a side, not pick
       * the recommended option.
       *
       * They were rendered as a primary and a secondary for a while, on the
       * argument that two equal blue fills read as a mistake under the
       * brief's button model. The owner asked for both in blue on
       * 19 Nov 2026, which settles it the other way, and the original
       * objection to the ghost stands on the record: marking one primary
       * tells half the audience they are the wrong half.
       *
       * The pair still differs — `.mk-doors` sizes both to the wider label,
       * so they read as one object with two choices rather than as a button
       * and an afterthought.
       */}
      <Cta locale={locale} href={ask.studioCta.href} tone={tone}>
        {ask.studioCta.label}
      </Cta>
      <Cta locale={locale} href={ask.companyCta.href} tone={tone}>
        {ask.companyCta.label}
      </Cta>
    </div>
  );
}
