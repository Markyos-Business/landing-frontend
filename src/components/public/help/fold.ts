/*
 * Search normalisation, the website's half (C5).
 *
 * The same rules as the platform's `apps/helpcenter/search.py`: lower case,
 * no tashkeel or tatweel, أ/إ/آ/ٱ → ا, ة → ه, ى → ي, Arabic-Indic digits →
 * 0-9. The platform uses them to match; this uses them to highlight, so a
 * match is marked in the text as it is written, tashkeel and all.
 */

const TASHKEEL = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/;
const LETTERS: Record<string, string> = { "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ة": "ه", "ى": "ي" };

function foldChar(ch: string): string {
  if (TASHKEEL.test(ch)) return "";
  const lower = ch.toLowerCase();
  if (LETTERS[lower]) return LETTERS[lower];
  const code = lower.charCodeAt(0);
  if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);
  if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0);
  return lower;
}

export function normalise(text: string): string {
  return [...text]
    .map(foldChar)
    .join("")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** The query's words, normalised, as the platform splits them. */
export const terms = (query: string): string[] => normalise(query).split(" ").filter(Boolean).slice(0, 8);

export type Part = { text: string; hit: boolean };

/** `text` cut into plain and matched parts, for <mark>. */
export function highlight(text: string, words: string[]): Part[] {
  if (!text || words.length === 0) return [{ text, hit: false }];
  // The folded text, and for each folded character the index it came from.
  let folded = "";
  const from: number[] = [];
  let offset = 0;
  for (const ch of text) {
    for (const c of foldChar(ch)) {
      folded += c;
      from.push(offset);
    }
    offset += ch.length;
  }
  const hits: [number, number][] = [];
  for (const word of [...words].sort((a, b) => b.length - a.length)) {
    for (let at = folded.indexOf(word); at >= 0; at = folded.indexOf(word, at + word.length)) {
      const start = from[at];
      const lastIndex = at + word.length - 1;
      const endChar = from[lastIndex];
      // Extend over any tashkeel right after the match.
      let end = endChar + 1;
      while (end < text.length && TASHKEEL.test(text[end])) end += 1;
      if (!hits.some(([s, e]) => start < e && end > s)) hits.push([start, end]);
    }
  }
  if (hits.length === 0) return [{ text, hit: false }];
  hits.sort((a, b) => a[0] - b[0]);
  const parts: Part[] = [];
  let cursor = 0;
  for (const [s, e] of hits) {
    if (s > cursor) parts.push({ text: text.slice(cursor, s), hit: false });
    parts.push({ text: text.slice(s, e), hit: true });
    cursor = e;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });
  return parts;
}
