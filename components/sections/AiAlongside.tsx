import type { Locale } from "@/lib/i18n/locales";
import type { AiAlongsideCopy } from "@/content/types";
import type { SiteCopy } from "@/content/types";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import {
  Accent,
  TextLink,
  Band,
  BLUE_DEEP,
  Display,
  INK,
  INK_62,
  LIFT,
  PANEL,
  RING_6,
} from "./landing";

/*
 * The brand brain — §1.7, at copy v2.1.
 *
 * ── What this section answers ────────────────────────────────────────────
 *
 * The question a buyer has about AI in a brand tool is not "what can it
 * generate?" but "will my brand come out better?". v2.0's section answered
 * the first: a claim, the list of sources the brain reads, and three
 * articles showing the reading turn into work. The copy deck's note on the
 * rewrite says the capabilities, the costs and the full explanation belong
 * on `/platform/brand-brain`, and that the homepage should answer the second
 * question instead — which it can only do twice, because there are two
 * starting points and they are two different answers.
 *
 * So the shape of the section *is* the argument:
 *
 *   the parts a brand is made of, and that nobody sees them together
 *     → what it does to the result, in two columns
 *     → the six seams where the parts come apart
 *     → what it will not do
 *
 * ── The two columns are a table, and are built as one ────────────────────
 *
 * Four rows against two headed columns is tabular data — "starts from",
 * "shows you", "suggests", "so you end up with", each said once for a new
 * brand and once for an existing one. A pair of card lists would lose the
 * row pairing, which is the whole comparison: the value of the second column
 * is that it sits beside the first.
 *
 * It collapses on a phone the way the comparison table does, into one block
 * per row with the column name above each cell, because four columns of
 * Arabic at 390px is not a table anybody reads.
 *
 * ── The ChatGPT line ─────────────────────────────────────────────────────
 *
 * It is a body paragraph now rather than the headline, but it still opens
 * with a Latin product name inside an Arabic sentence, so it still needs the
 * explicit `dir` — the bidi algorithm would otherwise drag the Arabic verb
 * to the wrong side of the name, in the section claiming the product does
 * not do that. `LatinLead` is what `HeadlineWithLatin` was.
 */

export function AiAlongside({
  copy,
  chips, locale }: {
  locale: Locale;
  copy: AiAlongsideCopy;
  chips: SiteCopy["chips"];
}) {
  const effect = copy.effect;

  return (
    <Band id="brain" labelledBy="brain-heading">
      <div
        className="mk-seq"
        style={{ position: "relative", maxWidth: 1040, margin: "0 auto" }}
      >
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

        {/* What it does to the result. */}
        {effect ? (
          <div
            className="mk-pop"
            style={{
              background: "#fff",
              borderRadius: 28,
              boxShadow: LIFT,
              padding: "clamp(20px,3vw,34px)",
            }}
          >
            <h3
              className="mk-bidi"
              style={{ margin: 0, fontWeight: 500, fontSize: 20, lineHeight: 1.4 }}
            >
              {effect.headline}
            </h3>

            <ul
              className="mk-seq"
              style={{
                display: "grid",
                gap: 2,
                margin: "20px 0 0",
                padding: 0,
                listStyle: "none",
              }}
            >
              {/*
               * The column names, once, for the width at which the row is a
               * row. Below it the row stacks and each cell carries its own
               * name instead — see `.mk-effect-head`. `aria-hidden`, because
               * this is a presentation list rather than a real table and a
               * screen reader has no way to associate a heading `<li>` with
               * the cells below it; the per-cell names are the accessible
               * version and they are in the DOM at every width.
               */}
              <li
                aria-hidden="true"
                className="mk-effect-row mk-effect-head-row mk-still"
              >
                <span />
                <span className="mk-bidi mk-effect-col">{effect.newBrand}</span>
                <span className="mk-bidi mk-effect-col">{effect.existingBrand}</span>
              </li>

              {effect.rows.map((row) => (
                /* The row's layout is a class and not an inline style: it
                   changes at 42rem, and an inline style cannot carry a media
                   query. See `.mk-effect-row` in globals.css. */
                <li key={row.label} className="mk-effect-row">
                  <span
                    className="mk-bidi mk-effect-label"
                    style={{ fontSize: 14, fontWeight: 500, color: INK }}
                  >
                    {row.label}
                  </span>
                  <Cell head={effect.newBrand} body={row.newBrand} />
                  <Cell head={effect.existingBrand} body={row.existingBrand} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* The seams. */}
        {copy.seams?.length ? (
          <div style={{ marginBlockStart: 64 }}>
            {copy.seamsHeadline ? (
              <h3
                className="mk-bidi"
                style={{
                  margin: "0 0 20px",
                  fontWeight: 500,
                  fontSize: "clamp(20px,2.4vw,26px)",
                  lineHeight: 1.45,
                  textWrap: "pretty",
                }}
              >
                {copy.seamsHeadline}
              </h3>
            ) : null}

            <ul
              className="mk-seq-pop"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
                gap: 14,
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {copy.seams.map((seam) => (
                <li
                  key={seam.title}
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    background: "#fff",
                    boxShadow: RING_6,
                  }}
                >
                  <div
                    style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}
                  >
                    <Icon name="exchange" size={16} style={{ color: BLUE_DEEP }} />
                    {seam.chip ? <Chip feature={seam.chip} chips={chips} /> : null}
                  </div>
                  <p
                    className="mk-bidi"
                    style={{
                      margin: "10px 0 0",
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: 1.5,
                      textWrap: "pretty",
                    }}
                  >
                    {seam.title}
                  </p>
                  <p
                    className="mk-bidi"
                    style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.75, color: INK_62 }}
                  >
                    {seam.line}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* And what it will not do. */}
        {copy.limits?.length || copy.connector ? (
          <div
            className="mk-rise"
            style={{
              marginBlockStart: 44,
              padding: "clamp(18px,2.6vw,28px)",
              borderRadius: 24,
              background: PANEL,
            }}
          >
            {copy.limitsHeadline ? (
              <h3
                className="mk-bidi"
                style={{ margin: 0, fontWeight: 500, fontSize: 17, lineHeight: 1.4 }}
              >
                {copy.limitsHeadline}
              </h3>
            ) : null}

            {copy.limits?.map((line) => (
              <p
                key={line}
                className="mk-bidi"
                style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.85, color: INK_62 }}
              >
                {line}
              </p>
            ))}

            {copy.connector ? (
              <p
                className="mk-bidi"
                style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.85, color: INK_62 }}
              >
                <span style={{ marginInlineEnd: 8, display: "inline-block" }}>
                  <Chip feature={copy.connector.chip} chips={chips} />
                </span>
                {copy.connector.line}
              </p>
            ) : null}
          </div>
        ) : null}

        <div style={{ marginBlockStart: 40 }}>
          <TextLink locale={locale} href={copy.cta.href}>{copy.cta.label}</TextLink>
        </div>
      </div>
    </Band>
  );
}

/*
 * One cell of the effect table, carrying its own column name.
 *
 * The name is shown on a phone and hidden from 42rem up, where the row above
 * carries it — `.mk-effect-head` in globals.css, because a media query cannot
 * be written as an inline style. Hidden with `display: none` rather than
 * visually-hidden: on a wide screen the column heading is the real one and
 * repeating it in every cell would make a screen reader read it eight times.
 */
function Cell({ head, body }: { head: string; body: string }) {
  return (
    <span style={{ display: "block", minInlineSize: 0 }}>
      {/* No `display` here. It was `block` inline, which beat the media
          query in globals.css that hides this from 42rem up — so every cell
          on a desktop repeated its column's name, eight times, under a table
          that had no column headings at all. */}
      <span
        className="mk-bidi mk-effect-head"
        style={{ fontSize: 12, fontWeight: 500, color: BLUE_DEEP, marginBlockEnd: 2 }}
      >
        {head}
      </span>
      <span
        className="mk-bidi"
        style={{ display: "block", fontSize: 14.5, lineHeight: 1.7, color: INK_62 }}
      >
        {body}
      </span>
    </span>
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
