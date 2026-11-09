import type { CSSProperties, ReactNode } from "react";

/*
 * A headline whose words resolve one after another as it arrives.
 *
 * `.mk-words` in globals.css is the paint and carries the reasoning; the two
 * things worth knowing at a call site are here.
 *
 * ── It splits on whitespace and never inside a word ────────────────────────
 *
 * Not a style choice. Arabic letters join, and the shape of a letter depends
 * on its neighbours — splitting «العلامة» into six boxes would break every
 * join in it and render six isolated forms, which is a different word in the
 * way that «ابنِ» and «ا ب ن ِ» are different. Whitespace is the only cut
 * that is safe in both scripts, and it is also the unit the effect wants.
 *
 * ── The spans stay inline, so nothing here moves ───────────────────────────
 *
 * Every split-text library makes its words `inline-block` so they can be
 * translated. On this site that would send every Arabic heading to the wrong
 * edge: the heading block is `unicode-bidi: plaintext`, which picks its
 * direction from the first strong character it can see, and an `inline-block`
 * is atomic to that scan — it would find a row of object replacement
 * characters and fall back to left-to-right. The long version is in
 * globals.css beside `.mk-words`. So the words only fade and sharpen, and the
 * movement belongs to the block around them.
 *
 * ── The whitespace stays outside the spans ─────────────────────────────────
 *
 * A trailing space inside an inline box is collapsible, so putting the
 * separator inside the word's span risks the words running together and
 * takes the line-break opportunity with it. Splitting with a capturing group
 * keeps the original separators as their own text nodes, so the browser
 * breaks lines exactly where it did before this wrapper existed — including
 * the double space or non-breaking space somebody may have typed in the CMS.
 */
export function Words({
  children,
  offset = 0,
  load = false,
}: {
  children: string;
  /*
   * Resolve on load rather than on scroll.
   *
   * For the hero, and only the hero. Everything else here is driven by the
   * scroll position, which means a headline already on screen when the page
   * opens has nothing left to animate — correct for the fourteen sections
   * below the fold, and the reason the first thing anybody saw was the one
   * thing that never moved. A clock-driven timeline is the exception that
   * covers the first screen. See `.mk-words-load` for the timing and what it
   * costs.
   */
  load?: boolean;
  /*
   * Where this run's count starts.
   *
   * A headline that carries an accent clause is two strings in two spans —
   * the second is painted through `background-clip: text` and cannot be
   * inside the first. Without this the accent would restart at word zero and
   * land before the tail of the line above it, so the wave would run twice
   * and overlap itself. `wordCount` of the first part is what goes here.
   */
  offset?: number;
}): ReactNode {
  /*
   * The numbering is done here and not inside the map.
   *
   * A counter incremented inside the render callback is a reassignment the
   * React Compiler rejects outright — "cannot reassign variable after render
   * completes" — because the callback is not guaranteed to run when this
   * function does. A plain loop finishes before anything is returned.
   */
  const pieces: { text: string; index: number | null }[] = [];
  let next = offset;
  for (const part of children.split(/(\s+)/)) {
    if (part === "") continue;
    if (/^\s+$/.test(part)) {
      pieces.push({ text: part, index: null });
      continue;
    }
    pieces.push({ text: part, index: next });
    next += 1;
  }

  return (
    <span className={load ? "mk-words mk-words-load" : "mk-words"}>
      {pieces.map((piece, key) =>
        piece.index === null ? (
          piece.text
        ) : (
          <span key={key} style={{ "--i": piece.index } as CSSProperties}>
            {piece.text}
          </span>
        ),
      )}
    </span>
  );
}

/** How many words `Words` would make of a string — for the `offset` above. */
export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
