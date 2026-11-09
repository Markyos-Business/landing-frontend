import { Words } from "@/components/ui/Words";
import type { ProblemCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { Band, Display, INK, INK_64 } from "../landing";
import { StationDial } from "../StationDial";
import { PainCard } from "./PainCard";
import { OldLogoSlide } from "./OldLogoSlide";
import { DriftingLocales } from "./DriftingLocales";
import { QuestionQueue } from "./QuestionQueue";

/*
 * The problem: one brand, seven tools, none of them aware of the others.
 *
 * ── The argument, and why it is a list of terms ───────────────────────────
 *
 * The copy deck's note on this section is that the agitation is the visitor's
 * own toolchain, named — "a studio owner reads the table and recognises their
 * last project, row by row". The same seven facts as prose would be a
 * paragraph nobody finishes, and as seven cards they would read as seven
 * separate problems rather than one journey with seven stops.
 *
 * It was a seven-row, three-column <table> for that reason, and it is now a
 * <dl> drawn as a dial — see `StationDial`. What the argument actually needs
 * is the order and the pairing of a stage with its breakage, and a definition
 * list carries both: stage, then its tool, then what happens to it. What it
 * does not carry is a 680px minimum width, which is what made the table
 * scroll sideways on a phone, or a layout that set the seven stage names —
 * the argument of the section — in its narrowest column at 16px.
 *
 * ── Then three pictures ───────────────────────────────────────────────────
 *
 * The three cards under the table are the three consequences from the body
 * copy, each drawn as a fragment of the thing going wrong: a deck slide with
 * the old logo, two locale rows that disagree, a thread of unanswered
 * questions. They are mocks, so they keep an explicit `dir` and do not
 * mirror — a picture of a product is a picture, not a layout.
 */

export function Problem({ copy, locale }: { copy: ProblemCopy; locale: Locale }) {
  return (
    <Band id="problem" labelledBy="problem-heading">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "24px 48px",
          marginBlockEnd: 64,
        }}
      >
        <div className="mk-slide-start" style={{ maxWidth: 640 }}>
          <Display id="problem-heading">
            <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
          </Display>
        </div>
        {copy.lead ? (
          <p
            className="mk-bidi mk-slide-end"
            style={{ margin: 0, maxWidth: 360, fontSize: 17, color: INK_64 }}
          >
            {copy.lead}
          </p>
        ) : null}
      </div>

      {/* The journey. */}
      {copy.stations?.length && copy.stationColumns ? (
        <StationDial stations={copy.stations} labels={copy.stationColumns} />
      ) : null}

      {/* The three consequences, drawn. */}
      <div
        className="mk-still mk-seq-pop"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          gap: 20,
          /* The table was a card and ended on its own edge; the dial ends on
             a line of type, which needs the room a card's padding used to
             give it. */
          marginBlockStart: 80,
        }}
      >
        <PainCard caption={copy.cards[0].headline}>
          <OldLogoSlide label={copy.cards[0].line} locale={locale} />
        </PainCard>
        <PainCard caption={copy.cards[1].headline}>
          <DriftingLocales line={copy.cards[1].line} locale={locale} />
        </PainCard>
        <PainCard caption={copy.cards[2].headline}>
          <QuestionQueue first={copy.cards[2].line} locale={locale} />
        </PainCard>
      </div>

      {/* Where the argument lands. The two paragraphs arrive one after the
          other rather than together: the second is the line the section is
          making, and it should land after the reader has had the first. */}
      <div
        className="mk-seq"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
          gap: "24px 56px",
          marginBlockStart: 68,
          fontSize: 18,
          lineHeight: 1.85,
        }}
      >
        {copy.body.map((paragraph, i) => (
          <p
            key={paragraph}
            className="mk-bidi"
            style={{
              margin: 0,
              color: INK_64,
              textWrap: "pretty",
            }}
          >
            {/* The last paragraph names the enemy, so "brand decay" is the
                one phrase in it set in full ink. */}
            {i === copy.body.length - 1 ? <Named text={paragraph} /> : paragraph}
          </p>
        ))}
      </div>
    </Band>
  );
}

/*
 * The closing paragraph, with its last clause promoted.
 *
 * The enemy has a name and the copy deck says to use it; this sets the words
 * after the last "و" in full ink without the copy having to carry markup.
 * If the phrase is not found the paragraph renders unchanged, so a rewrite
 * cannot break the section.
 */
function Named({ text }: { text: string }) {
  const marker = "تآكل العلامة";
  const at = text.indexOf(marker);
  if (at === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <b style={{ fontWeight: 500, color: INK }}>{marker}</b>
      {text.slice(at + marker.length)}
    </>
  );
}
