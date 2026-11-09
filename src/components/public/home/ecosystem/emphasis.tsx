import { INK } from "../landing";

/*
 * Promote the two named things in a paragraph to full ink.
 *
 * The copy carries the phrases as plain text — it has to, because the same
 * strings are checked by `check:locales` and read by the CMS — so the
 * emphasis is applied here by finding them. A phrase that is not present
 * renders unchanged, so rewriting the copy cannot break the paragraph.
 */
function emphasise(text: string, phrases: string[]) {
  const parts: React.ReactNode[] = [];
  let rest = text;

  while (rest.length) {
    const hit = phrases
      .map((phrase) => ({ phrase, at: rest.indexOf(phrase) }))
      .filter((h) => h.at !== -1)
      .sort((a, b) => a.at - b.at)[0];

    if (!hit) {
      parts.push(rest);
      break;
    }

    if (hit.at) parts.push(rest.slice(0, hit.at));
    parts.push(
      <b key={parts.length} style={{ fontWeight: 500, color: INK }}>
        {hit.phrase}
      </b>,
    );
    rest = rest.slice(hit.at + hit.phrase.length);
  }

  return parts;
}

export function Brain({ text, label }: { text: string; label: string }) {
  return <>{emphasise(text, [label])}</>;
}

export function Closing({ text }: { text: string }) {
  return <>{emphasise(text, ["مصدر واحد للحقيقة", "عقل العلامة"])}</>;
}
