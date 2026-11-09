import type { Locale } from "@/lib/i18n/locales";
import { Words, wordCount } from "@/components/ui";
import type { EcosystemCopy } from "@/content/types";
import { Accent, TextLink, Display, Lead, Pool } from "../landing";
import { Funnel } from "./Funnel";
import { ToolChips } from "./ToolChips";
import { IntoMark, IntoStages } from "./Connectors";
import { BrandMark } from "./BrandMark";
import { StageCards } from "./StageCards";
import { Brain, Closing } from "./emphasis";

/*
 * The ecosystem — the problem's picture, reversed.
 *
 * ── The composition ──────────────────────────────────────────────────────
 *
 * Six tool tiles across the top, thin lit lines running down from each and
 * converging on the Markyos mark at the waist, then three stage cards fanning
 * out below it. It is the same seven stops the problem section just listed,
 * read in the other direction, which is the whole argument of the section:
 * nothing new is added, the pieces are simply connected.
 *
 * ── Why this one is inline SVG ───────────────────────────────────────────
 *
 * The connectors are not icons. They are a diagram: six bezier curves whose
 * geometry is the content, and whose gradients fade each line out as it
 * leaves its tile so that the convergence reads as flow rather than as a
 * bundle of wires. Line Awesome has no glyph for this, and it cannot be
 * built from boxes — a `border-radius` corner is a quarter circle, not a
 * curve that leaves vertically and arrives vertically.
 *
 * `scripts/check-design-rules.mjs` exempts this folder from the `inline-svg`
 * rule on those grounds (the SVG is in `Funnel.tsx` and `Connectors.tsx`). §6's rule is
 * against hand-drawn *icons*, and this is a drawn diagram.
 *
 * The whole graphic is aria-hidden. Everything it says is said by the
 * headline and the stage cards beneath it, and a screen-reader user gets a
 * clean path through the section instead of eighteen unlabelled nodes.
 */

export function Ecosystem({ copy, locale }: {
  locale: Locale; copy: EcosystemCopy }) {
  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-heading"
      style={{
        position: "relative",
        /* clip, not hidden: `overflow: hidden` makes a scroll container, and
           a scroll-driven `view()` timeline resolves against the nearest one
           — so every reveal inside this section was pinned at full progress
           and silently did nothing. `clip` clips the same pixels without
           being scrollable, which is also closer to what this was for. */
        overflow: "clip",
        padding: "40px 24px clamp(72px,10vw,120px)",
        background: "#fff",
        boxShadow: "0 0 0 1px rgba(11,11,15,.04)",
        /* The section's own text is centred — the heading, the lead and the
           closing line. The stage cards below opt back out. */
        textAlign: "center",
      }}
    >
      <Pool
        style={{
          insetInlineStart: "50%",
          top: 380,
          inlineSize: 1000,
          blockSize: 600,
          transform: "translateX(calc(-50% * var(--mk-dir)))",
          background:
            "radial-gradient(50% 50% at 50% 50%,rgba(0,153,255,.09),rgba(0,153,255,0) 70%)",
        }}
      />

      <div className="mk-seq" style={{ position: "relative", maxWidth: 1040, margin: "0 auto" }}>
        <Funnel tools={copy.tools} />
        <ToolChips tools={copy.tools} />

        {/* What the funnel means. */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Display id="ecosystem-heading" size="h2lg">
            <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>{" "}
            <Accent at={wordCount(copy.headline)}>
              <span className="mk-bidi">{copy.headlineAccent}</span>
            </Accent>
          </Display>
          <Lead style={{ marginBlockStart: 18, maxWidth: 640 }}>
            <Brain text={copy.body} label={copy.brainLabel} />
          </Lead>
        </div>

        <IntoMark />
        <BrandMark label={copy.brainLabel} />
        <IntoStages />
        <StageCards stages={copy.stages} />

        <p
          className="mk-bidi"
          style={{
            margin: "60px auto 0",
            maxWidth: 720,
            textAlign: "center",
            fontSize: 17,
            lineHeight: 1.9,
            color: "rgba(11,11,15,.64)",
            textWrap: "pretty",
          }}
        >
          <Closing text={copy.closing} />
        </p>

        {/* v3 §2.4 ends the section by pointing at the feature pages. */}
        {copy.link ? (
          <p style={{ margin: "28px 0 0" }}>
            <span className="mk-atomic">
              <TextLink locale={locale} href={copy.link.href}>{copy.link.label}</TextLink>
            </span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
