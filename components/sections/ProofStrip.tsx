import type { ProofStripCopy } from "@/content/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BLUE_DEEP } from "./landing";

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
 *
 * The strip sits between two hairlines rather than inside a card — it is a
 * caption for the hero above it, not a section of its own, so it gets no
 * vertical rhythm of its own either.
 */

const ICONS: [IconName, IconName, IconName, IconName] = [
  "layers", // 7 tools in one platform
  "languages", // Arabic and English from line one
  "magic", // a guideline site that builds itself
  "gift", // the first AI analysis, free
];

export function ProofStrip({ copy }: { copy: ProofStripCopy }) {
  return (
    <section style={{ padding: "0 24px" }}>
      <ul
        className="mk-seq"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "22px 0",
          listStyle: "none",
          boxShadow: "0 -1px 0 rgba(11,11,15,.07),0 1px 0 rgba(11,11,15,.07)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
          gap: "14px 24px",
        }}
      >
        {copy.facts.map((fact, i) => (
          <li key={fact} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name={ICONS[i]} size={22} style={{ color: BLUE_DEEP }} />
            {/* `mk-bidi`: a fact that leads with a digit — "7 tools in one
                platform" — otherwise moves its digit to the wrong end of an
                Arabic line. */}
            <span className="mk-bidi" style={{ fontSize: 15, fontWeight: 500 }}>
              {fact}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
