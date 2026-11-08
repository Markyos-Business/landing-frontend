import type { Locale } from "@/lib/i18n/locales";
import { Words } from "@/components/ui/Words";
import type { HandoffLoopCopy, SiteCopy } from "@/content/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { Band, BLUE_DEEP, Cta, Display, INK, Lead } from "./landing";

/*
 * Build it free. Hand it over. Earn as your client grows.
 *
 * ── The diagram is the offer ─────────────────────────────────────────────
 *
 * Three stations on a line — you build, they own, you earn — with an arc
 * running back over the top from the third to the first, labelled with the
 * 20%. The arc is the whole point: this is a loop, not a funnel, and the
 * studio's reward is what closes it. Drawn rather than written because a
 * sentence cannot show a thing returning to its start.
 *
 * The third station carries the lit ring, because the money is the part the
 * reader is deciding about.
 *
 * The graphic is aria-hidden: the three stations are repeated as the
 * paragraph's own "1 · 2 · 3" and the arc's label is in the body copy, so
 * nothing is only in the picture.
 */

const ICONS: [IconName, IconName, IconName] = ["pencilRuler", "key", "coins"];

export function HandoffLoop({
  copy,
  chips, locale }: {
  locale: Locale;
  copy: HandoffLoopCopy;
  chips: SiteCopy["chips"];
}) {
  return (
    <Band id="loop" labelledBy="loop-heading">
      <div
        className="mk-still mk-seq"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div className="mk-slide-start">
          <Display id="loop-heading" style={{ fontSize: "clamp(30px,4.2vw,50px)" }}>
            <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
          </Display>

          {copy.feature ? (
            <div style={{ marginBlockStart: 16 }}>
              <Chip feature={copy.feature} chips={chips} />
            </div>
          ) : null}

          {copy.body.map((paragraph, i) => (
            <Lead key={paragraph} style={{ marginBlockStart: i ? 12 : 18 }}>
              {i === 0 ? <Share text={paragraph} /> : paragraph}
            </Lead>
          ))}

          <div style={{ marginBlockStart: 28 }}>
            <Cta locale={locale} href={copy.cta.href} size="md">
              {copy.cta.label}
            </Cta>
          </div>
        </div>

        {/* The loop. */}
        <div
          className="mk-slide-end"
          aria-hidden="true"
          style={{
            position: "relative",
            blockSize: 320,
            borderRadius: 28,
            overflow: "clip",
            background:
              "radial-gradient(rgba(0,85,255,.12) 1px,transparent 1.3px) 0 0/14px 14px,linear-gradient(#F2F6FD,#FAFBFE)",
            boxShadow: "0 0 0 1px rgba(11,11,15,.05)",
          }}
        >
          <svg
            viewBox="0 0 500 320"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, inlineSize: "100%", blockSize: "100%" }}
          >
            <defs>
              <linearGradient id="loopg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0055FF" />
                <stop offset="1" stopColor="#00CCFF" />
              </linearGradient>
            </defs>
            {/* The forward path: dotted, because it is the part that already
                happens in every project. */}
            <path
              d="M95 180 L405 180"
              fill="none"
              stroke="rgba(0,85,255,.25)"
              strokeWidth="1.2"
              strokeDasharray="4 5"
              vectorEffect="non-scaling-stroke"
            />
            {/* The return: solid and lit, because it is the new thing. */}
            <path
              d="M95 150 C120 60 380 60 405 150"
              fill="none"
              stroke="url(#loopg)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <span
            style={{
              position: "absolute",
              insetInlineStart: "50%",
              top: 58,
              transform: "translateX(calc(-50% * var(--mk-dir)))",
              minBlockSize: 32,
              padding: "4px 14px",
              borderRadius: 999,
              background: "#fff",
              boxShadow: "0 0 0 1px rgba(0,85,255,.15),0 8px 20px -8px rgba(0,85,255,.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 500,
              color: BLUE_DEEP,
              whiteSpace: "nowrap",
            }}
          >
            <Icon name="redo" size={15} />
            <span className="mk-bidi">20% من سنته الأولى</span>
          </span>

          {/*
           * The three stations, as a three-column grid rather than three
           * absolutely-positioned percentages.
           *
           * The design file places them with `right: 19% / 50% / 81%` plus
           * `translate(50%, -50%)`. That pair cannot be expressed logically:
           * `inset-inline-end` flips with the locale but `translate` is
           * always physical, so the two disagree in RTL and the third
           * station lands outside the frame. The columns are evenly spaced
           * at exactly those three positions, which is what a grid of three
           * already is — and it needs no transform, so it is correct in
           * both directions.
           */}
          <div
            style={{
              position: "absolute",
              insetInline: 0,
              top: 180,
              transform: "translateY(-50%)",
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
            }}
          >
            {copy.strip.map((step, i) => (
              <div
                key={step.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    inlineSize: 68,
                    blockSize: 68,
                    borderRadius: 20,
                    background: "#fff",
                    boxShadow:
                      i === 2
                        ? "0 0 0 1.5px #0099FF,0 0 24px rgba(0,153,255,.35)"
                        : "0 0 0 1px rgba(11,11,15,.05),0 12px 26px -10px rgba(0,85,255,.35)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name={ICONS[i]} size={28} style={{ color: BLUE_DEEP }} />
                </span>
                <span
                  className="mk-bidi"
                  style={{ fontSize: 15, fontWeight: 500, whiteSpace: "nowrap" }}
                >
                  {i + 1}. {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Band>
  );
}

/* The share is the number the reader is here for, so it carries the ink. */
function Share({ text }: { text: string }) {
  const marker = text.match(/20%[^،.]*/)?.[0];
  if (!marker) return <>{text}</>;
  const at = text.indexOf(marker);

  return (
    <>
      {text.slice(0, at)}
      <b style={{ fontWeight: 500, color: INK }}>{marker}</b>
      {text.slice(at + marker.length)}
    </>
  );
}
