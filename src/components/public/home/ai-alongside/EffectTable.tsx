import type { AiAlongsideCopy } from "@/content/types";
import { BLUE_DEEP, INK, INK_62, LIFT } from "../landing";

type Effect = NonNullable<AiAlongsideCopy["effect"]>;

/* What it does to the result, for a new brand and an existing one. */
export function EffectTable({ effect }: { effect: Effect }) {
  return (
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
             query. See `.mk-effect-row` in tailwind/. */
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
  );
}

/*
 * One cell of the effect table, carrying its own column name.
 *
 * The name is shown on a phone and hidden from 42rem up, where the row above
 * carries it — `.mk-effect-head` in tailwind/, because a media query cannot
 * be written as an inline style. Hidden with `display: none` rather than
 * visually-hidden: on a wide screen the column heading is the real one and
 * repeating it in every cell would make a screen reader read it eight times.
 */
function Cell({ head, body }: { head: string; body: string }) {
  return (
    <span style={{ display: "block", minInlineSize: 0 }}>
      {/* No `display` here. It was `block` inline, which beat the media
          query in tailwind/ that hides this from 42rem up — so every cell
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
