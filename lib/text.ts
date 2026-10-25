/*
 * Small text helpers for laying copy out.
 *
 * Nothing here changes what a sentence says — these only decide where a line
 * may break. Anything that would alter wording belongs in content/, where it
 * can be reviewed and transcreated.
 */

/** Sentence-ending punctuation, Latin and Arabic. */
const STOPS = ".؟!۔";

/**
 * Split a headline or paragraph into its sentences.
 *
 * The hero sets "Build the brand. Hand it over. Keep it alive." as three
 * lines, one sentence each, which is the reference's layout and is the whole
 * shape of the claim: three verbs, three jobs — build it, hand it over, keep
 * it alive. Left to wrap on its own the line breaks land mid-sentence and the
 * triplet disappears. Several card bodies use the same split the other way
 * round, to lift a closing line out of a paragraph and set it in white.
 *
 * A boundary is a stop **followed by whitespace or the end of the string**.
 * That one condition is what makes this safe on the copy it actually meets:
 * "final_FINAL_v3.pdf" keeps its extension, because the period there is
 * followed by a letter. It is not a general-purpose sentence splitter and is
 * not trying to be — "e.g." would defeat it, and no approved line has one.
 *
 * Written as a scan rather than as a regex with a lookbehind on purpose.
 * Lookbehind is a parse-time feature: a browser that does not support it
 * throws a SyntaxError for the whole module rather than failing this one
 * call. Everything using this is a Server Component today, but a helper in
 * lib/ is one `"use client"` away from being shipped to a browser, and this
 * is not worth being the thing that discovers it.
 *
 * A string with no internal boundary comes back as a single entry, which is
 * what the final CTA's one-sentence headline wants — same component, laid out
 * normally.
 */
export function sentences(text: string): string[] {
  const out: string[] = [];
  let start = 0;

  for (let i = 0; i < text.length; i++) {
    if (!STOPS.includes(text[i])) continue;

    const next = text[i + 1];
    if (next !== undefined && !/\s/.test(next)) continue;

    const part = text.slice(start, i + 1).trim();
    if (part) out.push(part);
    start = i + 1;
  }

  const tail = text.slice(start).trim();
  if (tail) out.push(tail);

  return out;
}

/**
 * Split a line into its opening clause and the rest.
 *
 * The company path's setup options are approved as single strings —
 * "Import. Drop the files in and Markyos builds the hub from them" — and the
 * reference renders the first word as a coloured heading with the rest as
 * body under it. Splitting at the first sentence boundary gets that without
 * duplicating the copy into a `lead` and a `body` field that could then
 * disagree with each other.
 *
 * Returns `[null, text]` when there is no boundary to split at, so a line
 * that is not written in that shape renders whole instead of losing its first
 * word to a heading.
 */
export function splitLead(text: string): [string | null, string] {
  const parts = sentences(text);
  if (parts.length < 2) return [null, text];

  // The lead is a label, not a sentence, so it loses its full stop.
  const lead = parts[0].replace(/[.۔]$/u, "");
  return [lead, parts.slice(1).join(" ")];
}
