import { INK, INK_55 } from "../landing";

export function Toggle({
  label,
  checked,
  onSelect,
  onMove,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
  /*
   * Which way an arrow key moves.
   *
   * With two options every arrow key meant the same thing — "the other one" —
   * and this just called `onSelect`. Three options need a direction, and the
   * direction follows the key under the finger rather than the reading order:
   * on /ar the track is mirrored, so ArrowRight is the previous option. Same
   * rule as the audience switch on /pricing and the solutions explorer.
   */
  onMove?: (delta: number) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      tabIndex={checked ? 0 : -1}
      onClick={onSelect}
      onKeyDown={(event) => {
        const rtl = typeof document !== "undefined" && document.dir === "rtl";
        const deltas: Record<string, number> = {
          ArrowRight: rtl ? -1 : 1,
          ArrowDown: 1,
          ArrowLeft: rtl ? 1 : -1,
          ArrowUp: -1,
        };
        if (!(event.key in deltas)) return;
        event.preventDefault();
        if (onMove) onMove(deltas[event.key]);
        else onSelect();
      }}
      className="mk-bidi"
      style={{
        position: "relative",
        /*
         * Three labels, and a phone.
         *
         * This was `blockSize: 44` with `nowrap` and 20px either side, which
         * fits two labels on a 320px screen and does not fit three: measured
         * at 390px, "Studios and agencies" alone wanted 194px of a 327px
         * track, so all three ran out of their own columns and the section's
         * `overflow: clip` took the ends off them.
         *
         * Same answer as `.mk-switch`, which met this with two Arabic labels
         * and solved it in a media query: the padding and the type tighten as
         * the screen narrows, and wrapping is allowed as the last resort. The
         * knob is anchored top and bottom rather than given a height, so a
         * two-line label grows the control instead of breaking it. `clamp`
         * rather than a query because these are inline styles — the homepage
         * sections are a literal trace of the design file and carry their own
         * values, which is the trade documented in docs/DESIGN.md.
         */
        minBlockSize: 44,
        paddingInline: "clamp(0.5rem, 2.4vw, 1.25rem)",
        whiteSpace: "normal",
        /*
         * A `1fr` column will not shrink below its item's min-content width,
         * and «الاستوديوهات» is one unbreakable word — so at 320px the three
         * columns still wanted 267px of a 257px track and sat over its rounded
         * edge. `min-inline-size: 0` lets the column be the third of the track
         * it is supposed to be.
         */
        minInlineSize: 0,
        border: 0,
        background: "transparent",
        borderRadius: 999,
        cursor: "pointer",
        fontSize: "clamp(0.8125rem, 2.6vw, 0.9375rem)",
        lineHeight: 1.3,
        fontWeight: 500,
        color: checked ? INK : INK_55,
        transition: "color 200ms",
      }}
    >
      {label}
    </button>
  );
}
