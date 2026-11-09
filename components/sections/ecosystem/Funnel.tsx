import type { EcosystemCopy } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { INK_45 } from "../landing";

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

/* The funnel: six tool tiles, and the lit lines running down from each. */
export function Funnel({ tools }: { tools: EcosystemCopy["tools"] }) {
  return (
    <>
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

        {tools.map((tool, i) => (
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
    </>
  );
}
