import { Words } from "@/components/ui/Words";
import type { FounderNoteCopy } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { Band, BLUE_DEEP, Display, INK_55, LIFT } from "./landing";

/*
 * Why I built Markyos.
 *
 * With no customer quotes yet, the founder's own story is the only honest
 * source of authority on the page — which is why it is a signed note in the
 * first person and not a paragraph about "our mission". It is specific about
 * the years, the tools and the Arabic problem, and it repeats the argument of
 * the problem section in human terms.
 *
 * A <blockquote> with a <cite>, because it is a quotation with an author and
 * the markup may as well say so.
 *
 * ── The quote glyph is in the flow, not behind the text ──────────────────
 *
 * It used to be `position: absolute` at the card's start corner, with the
 * paragraphs set `position: relative` to "clear" it. Relative positioning
 * does not clear anything — it only decides who paints on top — so a 48px
 * glyph sat across the first line of the note, which on the Arabic page is
 * exactly where the eye starts. A decoration that has to be painted over the
 * copy it decorates is in the wrong place, so it opens the card instead: one
 * line of its own above the first paragraph, at the start edge.
 */

export function FounderNote({ copy }: { copy: FounderNoteCopy }) {
  /* The signature arrives as "— Name, role"; the dash is typography, not
     content, and the role is quieter than the name.
     The Arabic comma is U+060C, not U+002C, so a split on "," alone never
     fired on the Arabic page — the whole signature rendered as the name and
     the role never got its quieter size. Both separators, and the Arabic
     semicolon, which the deck also uses. */
  const [name, role] = copy.signature
    .replace(/^[—–-]\s*/, "")
    .split(/[,،؛]\s*/);

  return (
    <Band id="founder" labelledBy="founder-heading" width={860}>
      <Display id="founder-heading" size="h3">
        <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
      </Display>

      <blockquote
        style={{
          position: "relative",
          margin: "28px 0 0",
          maxInlineSize: "46em",
          padding: "clamp(26px,4vw,44px)",
          borderRadius: 28,
          background: "#fff",
          boxShadow: LIFT,
        }}
      >
        {/* `display: flex` places the glyph itself: a lone <i> at the head of
            a block does not reliably take the block's start edge from
            `text-align: start`, and lands on the end edge instead. */}
        <span aria-hidden="true" style={{ display: "flex", marginBlockEnd: 10 }}>
          <Icon name="quote" size={40} style={{ color: "rgba(0,153,255,.28)" }} />
        </span>

        {copy.body.map((paragraph, i) => (
          <p
            key={paragraph}
            className="mk-bidi"
            style={{
              margin: i ? "18px 0 0" : 0,
              maxWidth: "40em",
              fontSize: "clamp(17px,1.7vw,20px)",
              lineHeight: 2,
              textWrap: "pretty",
            }}
          >
            {paragraph}
          </p>
        ))}

        <footer
          style={{ display: "flex", alignItems: "center", gap: 14, marginBlockStart: 28 }}
        >
          {/*
           * An initial, not a photograph. There is no founder portrait in
           * `public/`, and the design file draws a monogram rather than
           * leaving a grey circle — see the note in HANDOFF.md about the page
           * having no imagery by design.
           */}
          <span
            aria-hidden="true"
            style={{
              inlineSize: 48,
              blockSize: 48,
              borderRadius: "50%",
              background: "rgba(0,153,255,.1)",
              color: BLUE_DEEP,
              fontSize: 20,
              fontWeight: 500,
              display: "grid",
              placeItems: "center",
            }}
          >
            {name?.trim().charAt(0)}
          </span>
          <cite style={{ fontStyle: "normal" }}>
            <span
              className="mk-bidi"
              style={{ display: "block", fontSize: 16, fontWeight: 500 }}
            >
              {name}
            </span>
            {role ? (
              <span
                className="mk-bidi"
                style={{ display: "block", fontSize: 14, color: INK_55 }}
              >
                {role}
              </span>
            ) : null}
          </cite>
        </footer>
      </blockquote>
    </Band>
  );
}
