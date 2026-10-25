import type { ProofStripCopy } from "@/content/types";
import { Icon, type IconName } from "@/components/ui/Icon";

/*
 * The proof strip.
 *
 * Four facts, each one checkable against the product as it is today. Before
 * there are customer logos this is the strongest proof available: concrete
 * numbers read as true, adjectives read as marketing.
 *
 * A list, not four divs, because that is what it is — and a reader using a
 * screen reader gets told there are four of them.
 *
 * The icons are positional, which is only safe because the type fixes the
 * facts at exactly four, in order (see ProofStripCopy). They are decoration
 * beside a visible label and announce nothing; a fact that loses its icon
 * loses nothing a reader needed.
 */

const ICONS: [IconName, IconName, IconName, IconName] = [
  "languages", // Arabic and English, built in from line one
  "palette", // 8 guideline looks
  "layers", // 16 guideline sections
  "scan", // your first AI brief analysis
];

export function ProofStrip({ copy }: { copy: ProofStripCopy }) {
  return (
    <div className="mk-container mk-rule py-7">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {copy.facts.map((fact, i) => (
          <li key={fact} className="flex items-start gap-3">
            <Icon name={ICONS[i]} size={18} className="mt-0.5 flex-none text-[var(--accent-text)]" />
            {/* `mk-bidi`: these are English strings until the Arabic lands,
                and an English sentence laid out inside an Arabic paragraph
                moves its leading digits to the wrong end — "16 guideline
                sections" rendered as "guideline sections 16". */}
            <span className="mk-bidi text-[length:var(--fs-ui)] font-medium leading-[1.45] text-[var(--text)]">
              {fact}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
