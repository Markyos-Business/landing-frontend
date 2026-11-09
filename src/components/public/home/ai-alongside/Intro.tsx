import type { AiAlongsideCopy } from "@/content/types";
import { Accent, BLUE_DEEP, Display, INK, INK_62 } from "../landing";

/* The section's head: eyebrow, headline and the three body paragraphs. */
export function Intro({ copy }: { copy: AiAlongsideCopy }) {
  return (
    <>
      {/*
       * Start-aligned, with the rest of the page.
       *
       * This head was centred and the 680px body column under it centred
       * with it, over an effect table whose every row starts at the start
       * edge — so the section opened in the middle of the page and then
       * stepped back to the edge. Two further reasons it is the head that
       * moves rather than the table: centred body copy at this measure
       * gets harder to read with every line, which is the argument the
       * `prose` block is already built around, and three paragraphs of
       * Arabic is the longest run of body copy in any section here.
       *
       * `alignItems` is the cross axis of a column, which is the inline
       * axis — `start` resolves to the right edge on the Arabic page and
       * the left on the English one, which is why it is not `flex-start`
       * spelled physically.
       */}
      <div
        style={{
          textAlign: "start",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          marginBlockEnd: 64,
        }}
      >
        {copy.eyebrow ? (
          <p
            className="mk-bidi"
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              fontWeight: 500,
              color: BLUE_DEEP,
            }}
          >
            {copy.eyebrow}
          </p>
        ) : null}

        <Display id="brain-heading" style={{ maxWidth: 860 }}>
          <span className="mk-bidi">{copy.headline}</span>{" "}
          {copy.headlineAccent ? (
            <Accent>
              <span className="mk-bidi">{copy.headlineAccent}</span>
            </Accent>
          ) : null}
        </Display>

        <div style={{ maxWidth: 680, marginBlockStart: 18 }}>
          {copy.body.map((para, i) => (
            <p
              key={para}
              className="mk-bidi"
              style={{
                margin: i ? "14px 0 0" : 0,
                fontSize: 17,
                lineHeight: 1.9,
                /* The last paragraph is the section's sharpest line — the
                   one that was the headline at v2.0 — so it is set in the
                   ink the rest of the body is not. */
                color: i === copy.body.length - 1 ? INK : INK_62,
                fontWeight: i === copy.body.length - 1 ? 500 : 400,
              }}
            >
              <LatinLead text={para} />
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

/*
 * A paragraph whose first word is a Latin product name.
 *
 * Splits on a leading run of Latin characters and sets it `dir="ltr"` in
 * Inter. Without this, "ChatGPT يعرف كل شيء" renders with the verb on the
 * wrong side of the name in an RTL paragraph — the exact bug the section it
 * sits in claims the product does not have.
 */
function LatinLead({ text }: { text: string }) {
  const match = text.match(/^([A-Za-z][A-Za-z0-9.+-]*)\s*/);
  if (!match) return <>{text}</>;

  return (
    <>
      <span dir="ltr" style={{ fontFamily: "Inter, sans-serif" }}>
        {match[1]}
      </span>{" "}
      {text.slice(match[0].length)}
    </>
  );
}
