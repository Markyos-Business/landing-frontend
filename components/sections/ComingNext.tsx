import type { Locale } from "@/lib/i18n/locales";
import { Words } from "@/components/ui/Words";
import type { ComingNextCopy } from "@/content/types";
import { TextLink, Band, BLUE_DEEP, Display, INK, INK_55, RING_6, SELECTED } from "./landing";

/*
 * The ecosystem is growing, and this is what comes next.
 *
 * Three phases, dated, in the order they ship. The first card carries the
 * lit ring because it is the one that is nearly here; the other two are
 * plain. That is the whole hierarchy — a roadmap where every phase looks
 * equally imminent is a wish list.
 *
 * Each phase's items are joined with a middot in the design file rather than
 * bulleted, which keeps a six-item phase to three lines instead of six. They
 * are still a list in the markup, because that is what a screen reader needs
 * to count them; the separator is drawn by CSS between the items, so it
 * never ends up read aloud as a word.
 */

export function ComingNext({ copy, locale }: {
  locale: Locale; copy: ComingNextCopy }) {
  return (
    <Band id="roadmap" labelledBy="roadmap-heading">
      <Display id="roadmap-heading" style={{ marginBlockEnd: 44 }}>
        <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
      </Display>

      <ul
        className="mk-still mk-seq"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
          gap: 16,
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {copy.phases.map((phase, i) => (
          <li
            key={phase.season}
            style={{
              padding: 28,
              borderRadius: 26,
              background: "#fff",
              boxShadow: i === 0 ? SELECTED : RING_6,
            }}
          >
            <span
              className="mk-bidi"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: i === 0 ? BLUE_DEEP : INK_55,
              }}
            >
              {phase.season}
            </span>
            <h3
              className="mk-bidi"
              style={{ margin: "6px 0 0", fontWeight: 500, fontSize: 22 }}
            >
              {phase.theme}
            </h3>
            <ul
              style={{
                margin: "12px 0 0",
                padding: 0,
                listStyle: "none",
                fontSize: 15,
                lineHeight: 1.95,
                color: "rgba(11,11,15,.66)",
              }}
            >
              {phase.items.map((item, j) => (
                <li key={item} style={{ display: "inline" }}>
                  {/* The separator is content-free punctuation between
                      items, so it is hidden from the accessibility tree
                      rather than read out as "middle dot". */}
                  {j > 0 ? <span aria-hidden="true"> · </span> : null}
                  <span className="mk-bidi">
                    <Connector text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div style={{ marginBlockStart: 24 }}>
        <TextLink locale={locale} href={copy.link.href}>{copy.link.label}</TextLink>
      </div>
    </Band>
  );
}

/*
 * One item per phase is the headline of that phase, and the design file sets
 * it in full ink: the ChatGPT/Claude connector in mid-2027. Found rather than
 * marked up, so the copy stays plain strings for `check:locales` and the CMS.
 */
function Connector({ text }: { text: string }) {
  if (!/ChatGPT|Claude/.test(text)) return <>{text}</>;
  return <b style={{ fontWeight: 500, color: INK }}>{text}</b>;
}
