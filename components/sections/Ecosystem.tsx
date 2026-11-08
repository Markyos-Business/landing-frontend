import type { Locale } from "@/lib/i18n/locales";
import { Words, wordCount } from "@/components/ui/Words";
import type { EcosystemCopy } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import {
  Accent,
  BLUE_DEEP,
  TextLink,
  Display,
  INK,
  INK_45,
  INK_55,
  Lead,
  LIFT_CARD,
  Mark,
  Pool,
  SELECTED,
} from "./landing";

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
 * `scripts/check-design-rules.mjs` exempts this file from the `inline-svg`
 * rule on those grounds, alongside the chart in PlatformGrid. §6's rule is
 * against hand-drawn *icons*, and this is a drawn diagram.
 *
 * The whole graphic is aria-hidden. Everything it says is said by the
 * headline and the stage cards beneath it, and a screen-reader user gets a
 * clean path through the section instead of eighteen unlabelled nodes.
 */

/*
 * Where each tool tile sits.
 *
 * `at` is the percentage along the inline axis from the *start* edge — the
 * right on an Arabic page — so the six tools read in order from where the
 * reader starts. `x` is the matching coordinate in the SVG's own space,
 * which is always measured from the left because SVG user space does not
 * mirror with `dir`.
 *
 * ── Why these are not the design file's numbers verbatim ─────────────────
 *
 * The design file places tile 1 at `left: 92%` and starts its curve at
 * `x: 80`. On its own right-to-left page those are opposite ends: the tile
 * lands at the far right and the line it owns leaves from the far left, so
 * all six lines cross. It is the one place the export is internally
 * inconsistent, and tracing it literally would have drawn a cat's cradle.
 *
 * So each pair is mirrored — `at = 100 − left`, `x = 1000 − x` — which puts
 * every tile exactly where the design file shows it on an RTL page and
 * attaches each line to the tile above it. `top` is unchanged, since the
 * arc is a function of horizontal position.
 */
const NODES = [
  { at: "8%", top: 140, x: 920 },
  { at: "25%", top: 70, x: 750 },
  { at: "42%", top: 20, x: 580 },
  { at: "58%", top: 0, x: 420 },
  { at: "75%", top: 48, x: 250 },
  { at: "92%", top: 120, x: 80 },
] as const;

/* The three line colours, cycled. */
const STROKES = ["hg1", "hg2", "hg3", "hg1", "hg2", "hg3"] as const;

/* Durations and offsets straight from the design file — deliberately coprime
   so the six pulses never fall into step. */
const PULSE = [
  { dur: "3.4s", begin: "0s" },
  { dur: "3.8s", begin: "0.9s" },
  { dur: "3.1s", begin: "1.6s" },
  { dur: "3.6s", begin: "0.4s" },
  { dur: "3.3s", begin: "2.1s" },
  { dur: "3.9s", begin: "1.2s" },
] as const;

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
        {/* The funnel: tiles, and the lines leaving them. Tablet and up —
            see `.mk-funnel-wide` in globals.css for why a phone gets the
            chip row below instead. */}
        <div
          aria-hidden="true"
          className="mk-funnel-wide"
          style={{ position: "relative", blockSize: 340, marginBlockStart: 56 }}
        >
          <svg
            viewBox="0 0 1000 340"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, inlineSize: "100%", blockSize: "100%", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="hg1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="340">
                <stop offset="0" stopColor="#0099FF" stopOpacity=".75" />
                <stop offset="1" stopColor="#0099FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hg2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="340">
                <stop offset="0" stopColor="#0055FF" stopOpacity=".6" />
                <stop offset="1" stopColor="#0055FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hg3" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="340">
                <stop offset="0" stopColor="#00CCFF" stopOpacity=".8" />
                <stop offset="1" stopColor="#00CCFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g fill="none" strokeWidth="1.4">
              {NODES.map((node, i) => (
                <path
                  key={node.x}
                  d={`M${node.x} ${node.top + 35} C${node.x} ${node.top + 175} 500 190 500 340`}
                  stroke={`url(#${STROKES[i]})`}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
            {/*
             * The travelling pulses — the design file's `motion` variant,
             * which defaults on. A 7%-long dash running the length of each
             * curve on its own duration and offset, so the six never beat
             * together.
             *
             * This is the one moving thing on the page, and it is the
             * section's argument rather than decoration: the claim is that
             * the parts feed each other, and a still diagram of six lines
             * says they are merely adjacent. `.mk-pulse` is hidden under
             * `prefers-reduced-motion`, so a reader who has asked for no
             * motion gets the static diagram above and loses nothing.
             */}
            <g className="mk-pulse" fill="none" strokeWidth="2.5" strokeLinecap="round">
              {NODES.map((node, i) => (
                <path
                  key={node.x}
                  d={`M${node.x} ${node.top + 35} C${node.x} ${node.top + 175} 500 190 500 340`}
                  pathLength={100}
                  stroke={`url(#${STROKES[i]})`}
                  strokeDasharray="7 93"
                  vectorEffect="non-scaling-stroke"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-100"
                    dur={PULSE[i].dur}
                    begin={PULSE[i].begin}
                    repeatCount="indefinite"
                  />
                </path>
              ))}
            </g>
          </svg>

          {copy.tools.map((tool, i) => (
            <div
              key={tool.label}
              style={{
                position: "absolute",
                insetInlineStart: NODES[i].at,
                top: NODES[i].top,
                /* Centred on its anchor in both directions — see `--mk-dir`
                   in globals.css. A bare `translateX(-50%)` moves the tile
                   the wrong way in RTL and puts it a tile-width off. */
                transform: "translateX(calc(-50% * var(--mk-dir)))",
                inlineSize: "clamp(68px,10.5vw,116px)",
                aspectRatio: 1,
                borderRadius: "clamp(16px,2vw,24px)",
                background: "#fff",
                boxShadow: "0 0 0 1px rgba(11,11,15,.05),0 14px 34px -12px rgba(11,20,60,.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Icon
                name={tool.icon}
                size={28}
                style={{ fontSize: "clamp(22px,3vw,34px)", color: INK_45 }}
              />
              {/* 12px is the floor, so the clamp starts there. The design
                  file sets 11px here and 9px on the line below, which the
                  rendered-size sweep caught at 10.24px on a laptop — below
                  the floor §1.6 sets, in the smallest type on the page. */}
              <span style={{ fontSize: "clamp(12px,1.3vw,14px)", fontWeight: 500 }}>
                {tool.label}
              </span>
              <span
                dir="ltr"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(12px,1vw,12px)",
                  color: INK_45,
                }}
              >
                {tool.tool}
              </span>
            </div>
          ))}
        </div>

        {/*
         * The same six tools on a phone, as a wrapped row.
         *
         * A real list, because that is what it is, and the one the arc above
         * is `aria-hidden` in favour of — so a screen reader gets these once
         * at every width rather than twice on a tablet and never on a phone.
         */}
        <ul
          className="mk-funnel-narrow"
          style={{
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            margin: "8px 0 56px",
            padding: 0,
            listStyle: "none",
          }}
        >
          {copy.tools.map((tool) => (
            <li key={tool.label} style={{ display: "flex" }}>
              <span
                style={{
                  minBlockSize: 34,
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "#fff",
                  boxShadow: "0 0 0 1px rgba(11,11,15,.06)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: INK_45,
                }}
              >
                <Icon name={tool.icon} size={15} />
                <span className="mk-bidi" style={{ color: INK }}>
                  {tool.label}
                </span>
                <span dir="ltr" style={{ fontFamily: "Inter, sans-serif", fontSize: 12 }}>
                  {tool.tool}
                </span>
              </span>
            </li>
          ))}
        </ul>

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

        {/* Into the mark. */}
        <div aria-hidden="true" style={{ position: "relative", blockSize: 130, marginBlockStart: 8 }}>
          <svg
            viewBox="0 0 1000 130"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, inlineSize: "100%", blockSize: "100%" }}
          >
            <defs>
              <linearGradient id="bg1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="130">
                <stop offset="0" stopColor="#0099FF" stopOpacity="0" />
                <stop offset="1" stopColor="#0099FF" stopOpacity=".9" />
              </linearGradient>
              <linearGradient id="bg2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="130">
                <stop offset="0" stopColor="#0055FF" stopOpacity="0" />
                <stop offset="1" stopColor="#0055FF" stopOpacity=".8" />
              </linearGradient>
              <linearGradient id="bg3" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="130">
                <stop offset="0" stopColor="#00CCFF" stopOpacity="0" />
                <stop offset="1" stopColor="#00CCFF" stopOpacity=".9" />
              </linearGradient>
            </defs>
            <g fill="none" strokeWidth="1.4">
              {[360, 415, 470, 530, 585, 640].map((x, i) => (
                <path
                  key={x}
                  d={`M${x} 0 C${x} 70 500 60 500 130`}
                  stroke={`url(#bg${(i % 3) + 1})`}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </svg>
        </div>

        {/* The brand brain, lit. The one light pool of the section. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <div
            style={{
              inlineSize: 128,
              blockSize: 128,
              borderRadius: 32,
              background: "#fff",
              boxShadow:
                "0 0 0 1px rgba(11,11,15,.04),0 24px 60px -12px rgba(0,153,255,.5),0 0 48px rgba(0,153,255,.22)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Mark size={64} />
          </div>
          <span className="mk-bidi" style={{ marginBlockStart: 18, fontSize: 22, fontWeight: 500 }}>
            {copy.brainLabel}
          </span>
        </div>

        {/* And out into the three stages. */}
        <div aria-hidden="true" style={{ position: "relative", blockSize: 110 }}>
          <svg
            viewBox="0 0 1000 110"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, inlineSize: "100%", blockSize: "100%" }}
          >
            <g fill="none" stroke="rgba(0,85,255,.35)" strokeWidth="1.2">
              <path d="M500 0 C500 60 833 50 833 110" vectorEffect="non-scaling-stroke" />
              <path d="M500 0 L500 110" vectorEffect="non-scaling-stroke" />
              <path d="M500 0 C500 60 167 50 167 110" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
        </div>

        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
            gap: 16,
            margin: 0,
            padding: 0,
            listStyle: "none",
            textAlign: "start",
          }}
        >
          {copy.stages.map((stage, i) => (
            <li
              key={stage.name}
              style={{
                background: "#fff",
                borderRadius: 24,
                /* The third stage — Manage — is the one the page is heading
                   towards, so it takes the lit ring. One per composition. */
                boxShadow: i === 2 ? `${SELECTED},0 24px 50px -30px rgba(0,85,255,.45)` : LIFT_CARD,
                padding: 26,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  aria-hidden="true"
                  style={{
                    inlineSize: 36,
                    blockSize: 36,
                    borderRadius: 11,
                    background: i === 2 ? BLUE_DEEP : INK,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name={stage.icon} size={19} />
                </span>
                <span className="mk-bidi" style={{ fontSize: 24, fontWeight: 500 }}>
                  {stage.name}
                </span>
              </div>
              <p
                className="mk-bidi"
                style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.8 }}
              >
                {stage.what}
              </p>
              <p className="mk-bidi" style={{ margin: "8px 0 0", fontSize: 14, color: INK_55 }}>
                {stage.who}
              </p>
            </li>
          ))}
        </ul>

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

/*
 * Promote the two named things in a paragraph to full ink.
 *
 * The copy carries the phrases as plain text — it has to, because the same
 * strings are checked by `check:locales` and read by the CMS — so the
 * emphasis is applied here by finding them. A phrase that is not present
 * renders unchanged, so rewriting the copy cannot break the paragraph.
 */
function emphasise(text: string, phrases: string[]) {
  const parts: React.ReactNode[] = [];
  let rest = text;

  while (rest.length) {
    const hit = phrases
      .map((phrase) => ({ phrase, at: rest.indexOf(phrase) }))
      .filter((h) => h.at !== -1)
      .sort((a, b) => a.at - b.at)[0];

    if (!hit) {
      parts.push(rest);
      break;
    }

    if (hit.at) parts.push(rest.slice(0, hit.at));
    parts.push(
      <b key={parts.length} style={{ fontWeight: 500, color: INK }}>
        {hit.phrase}
      </b>,
    );
    rest = rest.slice(hit.at + hit.phrase.length);
  }

  return parts;
}

function Brain({ text, label }: { text: string; label: string }) {
  return <>{emphasise(text, [label])}</>;
}

function Closing({ text }: { text: string }) {
  return <>{emphasise(text, ["مصدر واحد للحقيقة", "عقل العلامة"])}</>;
}
