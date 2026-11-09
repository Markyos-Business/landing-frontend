import type { Locale } from "@/lib/i18n/locales";
import { Words, Chip } from "@/components/ui";
import type { ReplaceStackCopy, SiteCopy } from "@/content/types";
import {
  Band,
  Display,
  IconTile,
  INK_50,
  INK_55,
  INK_62,
  Lead,
  LIFT,
  RING_6,
  BLUE_DEEP,
  TextLink,
} from "./landing";

/*
 * What you use today, and what replaces it.
 *
 * ── The fourth column is the section ─────────────────────────────────────
 *
 * Three columns would be a feature comparison, and a visitor can already do
 * one of those. The copy deck is explicit that the fourth column — "what
 * actually changes" — is what sells: "not fewer logins, but one brand that
 * flows". So the Markyos column is tinted and the change column is given the
 * most room, and neither is the narrow afterthought a four-column table
 * usually makes of its last cell.
 *
 * A real <table> with a row header per row, for the same reason as the
 * problem section's: eleven rows of four cells is exactly the content that
 * becomes unreadable the moment the column it belongs to is not announced.
 *
 * ── And then the block that makes it credible ────────────────────────────
 *
 * "What Markyos does not replace" is not an aside or a disclaimer. A
 * comparison table that claims everything reads as a sales sheet; naming the
 * three things we are not is what lets a reader believe the eleven above.
 * Which is why it is in the same section rather than tucked into the FAQ.
 */

export function ReplaceStack({
  copy,
  chips, locale }: {
  locale: Locale;
  copy: ReplaceStackCopy;
  chips: SiteCopy["chips"];
}) {
  return (
    <Band id="compare" labelledBy="compare-heading">
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBlockEnd: 68,
        }}
      >
        <Display id="compare-heading">
          <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
        </Display>
        {copy.subheadline ? (
          <Lead style={{ marginBlockStart: 14, maxWidth: 600, lineHeight: 1.75 }}>
            {copy.subheadline}
          </Lead>
        ) : null}
      </div>

      <div
        className="mk-rise-soft"
        style={{
          background: "#fff",
          borderRadius: 28,
          boxShadow: LIFT,
          padding: 10,
          overflowX: "auto",
          /* And `clip` on the block axis, or CSS computes it to `auto` beside a
             scrolling inline axis and this becomes a scroll container in both
             — which pins every `view()` timeline inside it, including the
             rows'. Measured: without this the eleven rows sat at a fixed
             opacity each and never changed with the scroll. See
             `.mk-table-shell` in tailwind/, which carries the same fix and
             the long version of why. */
          overflowY: "clip",
        }}
      >
        <table
          style={{
            inlineSize: "100%",
            minInlineSize: 860,
            borderCollapse: "collapse",
            textAlign: "start",
          }}
        >
          <thead>
            <tr style={{ fontSize: 13, color: INK_50 }}>
              <th scope="col" style={{ ...TH, inlineSize: "20%" }}>
                {copy.columns.job}
              </th>
              <th scope="col" style={{ ...TH, inlineSize: "22%" }}>
                {copy.columns.usually}
              </th>
              <th
                scope="col"
                style={{ ...TH, inlineSize: "27%", color: BLUE_DEEP, fontWeight: 500 }}
              >
                {copy.columns.markyos}
              </th>
              <th scope="col" style={TH}>
                {copy.columns.change}
              </th>
            </tr>
          </thead>
          {/* Row by row, in the order the reader takes them — see
              `.mk-seq-rows`, and the note there on why a table row is the one
              thing on this site that fades without moving. */}
          <tbody className="mk-seq-rows">
            {copy.rows.map((row) => (
              <tr key={row.job} style={{ boxShadow: "0 -1px 0 rgba(11,11,15,.05)" }}>
                <th scope="row" style={{ ...TD, fontSize: 15, fontWeight: 500 }}>
                  <span className="mk-bidi">{row.job}</span>
                </th>
                {/* `.mk-page-dir` — see the note in Problem.tsx and the rule in
                    tailwind/. Per-cell direction gave this column eleven
                    different alignments inside one 202px measure. */}
                <td className="mk-page-dir" style={{ ...TD, fontSize: 14, color: INK_55 }}>
                  {row.usually}
                </td>
                {/*
                 * The Markyos cell, tinted. The tint is pulled in by a
                 * negative margin so the band sits inside the row's padding
                 * rather than adding to the row's height.
                 */}
                <td style={{ ...TD, fontSize: 14, lineHeight: 1.75 }}>
                  <span
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      margin: "-8px 0",
                      borderRadius: 12,
                      background: "rgba(0,153,255,.06)",
                    }}
                  >
                    <span className="mk-bidi" style={{ display: "block" }}>
                      {row.markyos}
                    </span>
                    {row.chip ? (
                      <ChipLine>
                        <Chip feature={row.chip} chips={chips} />
                      </ChipLine>
                    ) : null}
                  </span>
                </td>
                <td style={{ ...TD, fontSize: 14, lineHeight: 1.75 }}>
                  <span className="mk-bidi" style={{ display: "block" }}>
                    {row.change}
                  </span>
                  {row.changeChip ? (
                    <ChipLine>
                      <Chip feature={row.changeChip} chips={chips} />
                    </ChipLine>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* §0.2: the names above belong to their owners. */}
      {copy.trademarkNote ? (
        <p
          className="mk-bidi"
          style={{ margin: "14px 8px 0", maxWidth: "44em", fontSize: 13, color: INK_50 }}
        >
          {copy.trademarkNote}
        </p>
      ) : null}

      {/* v3 §2.6: the table is the short version, and this is where the long
          one lives. It sits under the footnote rather than over it, so the
          last thing read before the link is the honest caveat. */}
      {copy.link ? (
        <p style={{ margin: "18px 8px 0" }}>
          {/* .mk-atomic, because TextLink is an inline-flex box and a block
              whose only content is one of those has no text for plaintext
              to read — it falls back to left-to-right forever. */}
          <span className="mk-atomic">
            <TextLink locale={locale} href={copy.link.href}>{copy.link.label}</TextLink>
          </span>
        </p>
      ) : null}

      {copy.notReplaced?.length ? (
        <>
          <h3
            className="mk-bidi"
            style={{ margin: "88px 0 24px", fontWeight: 500, fontSize: 26 }}
          >
            {copy.notReplacedHeadline}
          </h3>
          <ul
            className="mk-seq-pop"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
              gap: 16,
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {copy.notReplaced.map((item) => (
              <li
                key={item.title}
                style={{
                  padding: 24,
                  borderRadius: 22,
                  background: "#fff",
                  boxShadow: RING_6,
                }}
              >
                <IconTile name={item.icon} size={38} />
                <h4
                  className="mk-bidi"
                  style={{ margin: "14px 0 0", fontWeight: 500, fontSize: 18 }}
                >
                  {item.title}
                </h4>
                <p
                  className="mk-bidi"
                  style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.8, color: INK_62 }}
                >
                  {item.line}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Band>
  );
}

/*
 * A status chip under a cell's sentence, rather than inside it.
 *
 * The chip used to sit in the text flow — `{chip} {sentence}` in one
 * `.mk-bidi` span. Two things went wrong with that. It is an inline-flex box,
 * so the bidi algorithm cannot see any text inside it and `plaintext` resolved
 * the whole cell from whatever came after; and a reader meets "coming spring
 * 2027" in the middle of a sentence about what the product does, which reads
 * as part of the sentence rather than as a label on it.
 *
 * A chip is an annotation on the row. It goes on its own line, after what it
 * annotates, where it is also free to wrap without ragging the prose above it.
 */
function ChipLine({ children }: { children: React.ReactNode }) {
  return <span style={{ display: "flex", marginBlockStart: 6 }}>{children}</span>;
}

const TH: React.CSSProperties = {
  padding: "16px 20px",
  textAlign: "start",
  fontWeight: 400,
};

const TD: React.CSSProperties = {
  padding: "16px 20px",
  textAlign: "start",
  fontWeight: 400,
  verticalAlign: "top",
};
