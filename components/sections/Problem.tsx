import { Words } from "@/components/ui/Words";
import type { ProblemCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
import { Icon } from "@/components/ui/Icon";
import {
  Band,
  Display,
  DOTS,
  INK,
  INK_45,
  INK_64,
  RING,
  BLUE_DEEP,
} from "./landing";
import { StationDial } from "./StationDial";

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

function PainCard({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure
      style={{
        /*
         * A column, so the frame below can take the height the grid gives
         * this card. The three cards are grid items and stretch to the
         * tallest of them; the frame used to be a fixed 200px inside that,
         * so a picture taller than 200 was simply clipped — the English
         * question queue lost its third row, and the sales slide lost its
         * top and bottom edge at 1024.
         */
        display: "flex",
        flexDirection: "column",
        margin: 0,
        background: "#fff",
        borderRadius: 28,
        boxShadow: RING,
        overflow: "clip",
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          minBlockSize: 200,
          margin: 10,
          borderRadius: 20,
          background: DOTS,
          overflow: "clip",
        }}
      >
        {children}
      </div>
      <figcaption
        className="mk-bidi"
        style={{ margin: 0, padding: "12px 26px 26px", fontSize: 16, fontWeight: 500 }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

/* Sales is still using the old logo. */
function OldLogoSlide({ label, locale }: { label: string; locale: Locale }) {
  const { oldLogo } = mockCopy(locale).t.problem;
  return (
    <div
      className="mk-pain-art"
      style={{ display: "grid", placeItems: "center", blockSize: "100%" }}
    >
      <div
        style={{
          inlineSize: "74%",
          aspectRatio: "16/10",
          /*
           * 74% of the frame's *width* is a height too, through the ratio,
           * and at 1024 the single-column grid makes the frame 458px wide
           * — a 212px slide in a 200px box. The cap lets the ratio shrink
           * the width instead of the box clipping the slide.
           */
          maxBlockSize: "calc(100% - 56px)",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 0 0 1px rgba(11,11,15,.06),0 16px 30px -18px rgba(11,20,60,.3)",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: "rotate(2deg)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mk-bidi" style={{ fontSize: 12, color: INK_45 }}>
            {label}
          </span>
          <span
            style={{
              inlineSize: 46,
              blockSize: 14,
              borderRadius: 3,
              background:
                "repeating-linear-gradient(45deg,rgba(11,11,15,.12) 0 4px,rgba(11,11,15,.04) 4px 8px)",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ blockSize: 10, inlineSize: "70%", borderRadius: 4, background: "rgba(11,11,15,.1)" }} />
          <span style={{ blockSize: 10, inlineSize: "46%", borderRadius: 4, background: "rgba(11,11,15,.06)" }} />
        </div>
      </div>
      {/*
       * The tag sits at the foot of the frame, not its head.
       *
       * The design file puts it at `top: 16`, which clears the slide at
       * 1440 because the card is centred and narrow there. Below about
       * 1100 the card's edge moves under it and the tag lands on top of
       * "Sales deck · slide 4" — caught by measuring rendered boxes, not by
       * looking, because at a glance it reads as a deliberate overlap.
       */}
      <span
        style={{
          position: "absolute",
          insetInlineStart: 16,
          bottom: 16,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          blockSize: 28,
          padding: "0 10px",
          borderRadius: 999,
          background: "#fff",
          boxShadow: "0 0 0 1px rgba(255,0,102,.18)",
          fontSize: 12,
          color: "#C2004E",
        }}
      >
        <Icon name="history" size={15} />
        <span className="mk-bidi">{oldLogo}</span>
      </span>
    </div>
  );
}

/*
 * The Arabic says something the English never did.
 *
 * Both rows keep an explicit `dir` and do not mirror: the claim of the
 * picture is that these two locales disagree, and that is only visible if
 * each one is laid out the way its own reader sees it. Locales appear as
 * codes, never as flags.
 */
function DriftingLocales({ line, locale }: { line: string; locale: Locale }) {
  const { drift } = mockCopy(locale).t.problem;
  const other = locale === "ar" ? "en" : "ar";
  const [before, accent, after] = splitOn(drift.other.text, drift.other.accent);

  return (
    <div
      className="mk-pain-art"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
        padding: "20px",
        blockSize: "100%",
      }}
    >
      {/* The page's own language, carrying the card's line. */}
      <Row code={drift.code} dir={locale === "ar" ? "rtl" : "ltr"} lang={locale} ring={DRIFT_RING}>
        {line}
      </Row>

      {/* The other language, saying something else. */}
      <Row
        code={drift.other.code}
        dir={other === "ar" ? "rtl" : "ltr"}
        lang={other}
        ring={RING}
      >
        {before}
        <b style={{ fontWeight: 500, color: BLUE_DEEP }}>{accent}</b>
        {after}
      </Row>
    </div>
  );
}

const DRIFT_RING = "0 0 0 1px rgba(255,0,102,.22)";

/** Split a line around the one phrase that should be set in full ink. */
function splitOn(text: string, phrase: string): [string, string, string] {
  const at = text.indexOf(phrase);
  if (at === -1) return [text, "", ""];
  return [text.slice(0, at), phrase, text.slice(at + phrase.length)];
}

/*
 * One locale's row.
 *
 * `min-block-size`, not `block-size`: the line inside is real copy and its
 * length is not this component's to decide. At 46px fixed, the English
 * line wrapped to two lines inside a one-line box and ran over the locale
 * code beside it.
 */
function Row({
  code,
  dir,
  lang,
  ring,
  children,
}: {
  code: string;
  dir: "rtl" | "ltr";
  lang: string;
  ring: string;
  children: React.ReactNode;
}) {
  return (
    <div
      dir={dir}
      lang={lang}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        minBlockSize: 46,
        padding: "8px 14px",
        borderRadius: 14,
        background: "#fff",
        boxShadow: ring,
      }}
    >
      <span
        dir="ltr"
        style={{
          flex: "none",
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          color: INK_45,
        }}
      >
        {code}
      </span>
      <span
        style={{
          fontSize: 14,
          lineHeight: 1.45,
          fontFamily: lang === "ar" ? undefined : "Inter, sans-serif",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* Every brand question lands on one desk. */
function QuestionQueue({ first, locale }: { first: string; locale: Locale }) {
  const p = mockCopy(locale).t.problem;
  /*
   * The look of each row is this component's; the words are the
   * dictionary's. The two were one list until 8 Nov 2026, which is how the
   * English homepage came to show an Arabic chat under an English heading.
   */
  const style = [
    { tint: "rgba(0,153,255,.1)", ink: BLUE_DEEP, indent: 0, fade: 1 },
    { tint: "rgba(0,204,255,.12)", ink: "#00799A", indent: 14, fade: 0.85 },
    { tint: "rgba(138,88,255,.12)", ink: "#6A3BE0", indent: 28, fade: 0.7 },
  ];
  const rows = [
    { who: p.firstWho, q: first, when: p.firstWhen, ...style[0] },
    { ...p.queue[0], ...style[1] },
    { ...p.queue[1], ...style[2] },
  ];

  return (
    <div
      className="mk-pain-art mk-pain-art-b"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
        /* Vertical padding, so the first and last bubble do not sit on the
           frame's edge when the queue is at its tallest. */
        padding: "16px 20px",
        blockSize: "100%",
      }}
    >
      {rows.map((row) => (
        <div
          key={row.who}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 14,
            background: "#fff",
            boxShadow: RING,
            opacity: row.fade,
            marginInlineStart: row.indent,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              flex: "none",
              inlineSize: 28,
              blockSize: 28,
              borderRadius: "50%",
              background: row.tint,
              color: row.ink,
              fontSize: 13,
              fontWeight: 500,
              display: "grid",
              placeItems: "center",
            }}
          >
            {row.who}
          </span>
          <span className="mk-bidi" style={{ flex: 1, minInlineSize: 0, fontSize: 14 }}>
            {row.q}
          </span>
          <span style={{ fontSize: 12, color: INK_45 }}>{row.when}</span>
        </div>
      ))}
    </div>
  );
}
