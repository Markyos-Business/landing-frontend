import type { AiAlongsideCopy } from "@/content/types";
import { mockCopy, type MockCopy } from "@/content/mocks";
import { Button } from "@/components/ui/Button";
import { Section, SectionFoot, SectionHead } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n/locales";

/*
 * What the AI actually does — shown first, explained second.
 *
 * `Markyos Homepage v2.dc.html` §03. Three articles, each one a picture of
 * the product with a short title and two muted lines beneath it, and the way
 * out on the far edge of that same row. That is the reference's own figure /
 * caption arrangement (UI-UX Design Reference/17, 18), which this repo
 * already has as `SectionFoot` — so these articles compose it rather than
 * rebuilding it.
 *
 * ── Why this replaced AiRules on the homepage ─────────────────────────────
 *
 * `AiRules` is the stance: four promises about what the AI will never do.
 * It is the more important section and it is still in `content/`, rendered
 * at /platform. But a promise is unreadable before you know what the thing
 * is — "it won't draw your logo" means nothing to somebody who has not yet
 * been told the AI reads briefs. v2 shows the three capabilities here and
 * keeps the four promises where somebody who now cares can find them.
 *
 * The words inside the pictures come from `content/mocks.ts`, in both
 * languages. They used to be English literals here, which put 46 English
 * strings on the Arabic homepage — a section arguing that the AI reads
 * Arabic, illustrated by an interface that does not.
 *
 * The Arabic *content* inside them stays Arabic in both editions: the sample
 * caption, and the key term being corrected. Those are the example, not the
 * interface.
 */

export function AiAlongside({
  copy,
  locale,
}: {
  copy: AiAlongsideCopy;
  locale: Locale;
}) {
  const { t, dir, lang } = mockCopy(locale);
  const visuals = [Explorations(t), BriefAnalysis(t, dir), ToneCheck(t)];

  return (
    <Section id="ai" labelledBy="ai-heading" rule>
      <SectionHead
        id="ai-heading"
        title={copy.headline}
        align="start"
        action={<Button cta={copy.cta} locale={locale} variant="outline" size="sm" />}
      />

      <div className="mt-12 flex flex-col gap-5">
        {copy.articles.map((article, i) => (
          <article
            key={article.title}
            className="mk-feature overflow-hidden shadow-[0_0_0_1px_var(--hairline-strong)]"
          >
            {/* The product's own direction, not the page's — on the Arabic
                edition this is an Arabic interface, so it mirrors. */}
            <div dir={dir} lang={lang}>
              {visuals[i]}
            </div>

            {/*
             * `mt-0`: SectionFoot's own top margin is for the gap between a
             * section's grid and its floor. Inside a card the picture already
             * ends where its own padding says it does.
             */}
            <SectionFoot
              className="!mt-0 px-5 pb-7 sm:px-7"
              title={article.title}
              body={article.line}
              action={<Button cta={article.cta} locale={locale} variant="link" />}
            />
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ── 1 · Three directions, side by side ──────────────────────────────────── */

type Direction = {
  letter: string;
  lit: boolean;
  bg: string;
  ink: string;
  font: string;
  weight: number;
  track: string;
  swatches: string[];
};

/*
 * The client's palette, shown as the client's palette.
 *
 * Only what is *design* lives here — the colour, the face, the weight. The
 * direction's name and the sentence under it are words on the page and come
 * from `content/mocks.ts`, matched by position.
 *
 * These hexes are content, not chrome — the same exemption
 * `components/mock/BrandHub.tsx` already holds (§7): a customer's brand
 * colours cannot come from our tokens, because the whole point of the
 * picture is that they are theirs. Tokenising them would make the mock
 * render our palette while claiming to show the client's, which is the one
 * thing this picture must not do.
 *
 * `npm run check:design` enforces the no-raw-hex rule, and this file is in
 * its EXEMPTIONS table (`raw-hex`) with that reasoning written out. If the
 * exploration mock ever moves, move the exemption with it — the table in
 * `scripts/check-design-rules.mjs` is the only place the carve-out is
 * recorded as a decision rather than a gap.
 */
const DIRECTIONS: Direction[] = [
  {
    letter: "A",
    lit: true,
    bg: "#F3E7C9",
    ink: "#3F3D56",
    font: "Georgia, serif",
    weight: 500,
    track: "0",
    swatches: ["#3F3D56", "#F3E7C9", "#C8963E", "#6B4E3D"],
  },
  {
    letter: "B",
    lit: false,
    bg: "#1B51E5",
    ink: "#FFFFFF",
    font: "var(--font-inter), sans-serif",
    weight: 500,
    track: "-0.04em",
    swatches: ["#1B51E5", "#FFFFFF", "#7CE7AC", "#111111"],
  },
  {
    letter: "C",
    lit: false,
    bg: "#111111",
    ink: "#F4BE5E",
    font: "var(--font-inter), sans-serif",
    weight: 700,
    track: "-0.05em",
    swatches: ["#111111", "#F4BE5E", "#FF808B", "#FFFFFF"],
  },
];

const Explorations = (t: MockCopy) => (
  <div className="grid gap-6 bg-[var(--surface-1)] p-5 sm:p-10 lg:p-[4.5rem] lg:pb-14 [grid-template-columns:repeat(auto-fit,minmax(13.75rem,1fr))]">
    {DIRECTIONS.map((d, i) => (
      <div key={d.letter} className="flex flex-col gap-3">
        <span
          className={`text-[length:var(--fs-h3)] font-medium tracking-[-0.02em] ${
            d.lit ? "text-[var(--mk-blue-edge)]" : "text-[var(--text-muted)]"
          }`}
        >
          {t.ai.directions[i]?.title}
        </span>
        {/*
         * The chosen direction carries the neon edge — §8's "one selected
         * object per composition". The other two sit on a 35% version of the
         * same edge so the row still reads as three of a kind.
         */}
        <div
          className={`flex aspect-[4/5] flex-col gap-3.5 bg-[var(--canvas)] p-4.5 ${
            d.lit
              ? "border border-[var(--accent)] shadow-[var(--mk-glow-soft)]"
              : "border border-[color-mix(in_srgb,var(--accent)_35%,transparent)]"
          }`}
        >
          {/*
           * Both labels in this card — the header row here and the note under
           * the swatches — are at the 12px floor, not below it.
           *
           * They were 9px and 10px, which is how tight artwork gets built if
           * nobody is checking: the card is a 4:5 box in a 13.75rem column, so
           * every extra pixel of type has to come from somewhere, and shrinking
           * the type is the move that costs nothing until somebody tries to
           * read it. §13 has no exception for mock artwork and §9 says the same
           * thing again — "nothing under 12px" — because a picture of the
           * product is a picture of type people will have to read.
           *
           * Nothing had to be re-laid-out to pay for it. The header row holds
           * "Nakhla" plus an 11-character tag, which is ~100px of the ~184px
           * this column gives at its narrowest, and the preview block below is
           * `flex-1`, so the few pixels the note gained come out of its
           * whitespace rather than out of the frame.
           */}
          <div
            dir="ltr"
            className="flex justify-between text-[length:var(--fs-eyebrow)] text-[var(--text-faint)]"
          >
            <span>Nakhla</span>
            <span>{t.ai.directions[i]?.tag}</span>
          </div>
          <div
            className="flex flex-1 flex-col items-center justify-center gap-1 rounded-[var(--mk-r-chip)]"
            style={{ background: d.bg, color: d.ink }}
          >
            <span
              style={{
                fontFamily: d.font,
                fontWeight: d.weight,
                letterSpacing: d.track,
                fontSize: "1.875rem",
              }}
            >
              Nakhla
            </span>
            <span
              lang="ar"
              dir="rtl"
              style={{
                fontFamily: "var(--font-arabic)",
                fontWeight: d.weight,
                fontSize: "1.625rem",
              }}
            >
              نخلة
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {d.swatches.map((hex, i) => (
              <span
                key={`${hex}-${i}`}
                className="h-[1.125rem] rounded-[0.125rem]"
                style={{ background: hex }}
              />
            ))}
          </div>
          <span className="text-[length:var(--fs-eyebrow)] leading-[1.5] text-[var(--text-muted)]">
            {t.ai.directions[i]?.note}
          </span>
        </div>
      </div>
    ))}
  </div>
);

/* ── 2 · The brief, read across four stakeholders ────────────────────────── */

/* Which row is selected is layout; the words come from the mock copy. */
const SELECTED_STAKEHOLDER = 1;
const SELECTED_ANSWER = 0;

const COLS = "[grid-template-columns:minmax(0,2.4fr)_4.375rem_minmax(0,1fr)]";

/*
 * The panel takes the product's direction, not a fixed one.
 *
 * It used to be hard-coded `dir="ltr"`, on the reasoning that §9 says a mock
 * does not mirror. That read the rule too widely: §9 is about the *window* —
 * the browser chrome, the traffic lights — which stays where the operating
 * system puts it. The page inside the window is the product, and the product
 * has an Arabic edition. Pinning it to LTR meant the Arabic homepage showed
 * an English-only screen in the middle of a section claiming the AI reads
 * Arabic.
 *
 * Each answer still carries its own direction, because the table really is
 * mixed — that is the situation the screen is in.
 */
const BriefAnalysis = (t: MockCopy, dir: "rtl" | "ltr") => (
  <div
    dir={dir}
    className="grid h-[22.5rem] overflow-hidden px-5 pt-10 sm:px-10 lg:px-[4.5rem] [grid-template-columns:minmax(11.25rem,16.25rem)_minmax(0,1fr)] [mask-image:linear-gradient(#000_60%,transparent)] [-webkit-mask-image:linear-gradient(#000_60%,transparent)]"
  >
    <div className="flex flex-col gap-0.5 border-e border-[var(--hairline-strong)] pe-4 text-[length:var(--fs-ui)]">
      <span className="px-2.5 py-2 text-[var(--text-muted)]">{t.ai.brief.group}</span>
      {t.ai.brief.stakeholders.map((person, i) => (
        <span
          key={person.name}
          className={`flex items-center gap-2.5 rounded-[var(--mk-r-button)] py-2 pe-2.5 ps-8 ${
            i === SELECTED_STAKEHOLDER
              ? "bg-[var(--mk-fill-2)] text-[var(--text)]"
              : "text-[var(--text-secondary)]"
          }`}
        >
          {person.name}
          <span className="ms-auto text-[length:var(--fs-eyebrow)] text-[var(--text-faint)]">
            {person.count}
          </span>
        </span>
      ))}
      <span className="px-2.5 py-2 text-[var(--text-faint)]">{t.ai.brief.invite}</span>
    </div>

    <div className="flex min-w-0 flex-col text-[length:var(--fs-ui)]">
      <div
        className={`grid gap-4 border-b border-[var(--hairline-strong)] px-5 py-2.5 text-[length:var(--fs-eyebrow)] text-[var(--text-faint)] ${COLS}`}
      >
        <span>{t.ai.brief.columns.answer}</span>
        <span>{t.ai.brief.columns.lang}</span>
        <span>{t.ai.brief.columns.signal}</span>
      </div>
      {t.ai.brief.answers.map((a, i) => (
        <div
          key={a.text}
          className={`grid items-center gap-4 border-b border-[var(--hairline)] px-5 py-3.5 ${COLS} ${
            i === SELECTED_ANSWER
              ? "bg-[var(--accent-soft)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_70%,transparent),inset_0_0_24px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
              : ""
          }`}
        >
          <span
            dir={a.ar ? "rtl" : "ltr"}
            lang={a.ar ? "ar" : undefined}
            className="truncate"
            style={a.ar ? { fontFamily: "var(--font-arabic)" } : undefined}
          >
            {a.text}
          </span>
          {/* A locale code is always Latin and always reads left to right. */}
          <span
            dir="ltr"
            className="text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]"
          >
            {a.lang}
          </span>
          <span className="truncate text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
            {a.signal}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ── 3 · One caption, checked ────────────────────────────────────────────── */

/* The hue per check is a verdict, not a word, so it stays here. */
const CHECK_DOTS = [
  "var(--mk-state-approved)",
  "var(--mk-state-approved)",
  "var(--mk-state-review)",
  "var(--mk-state-rejected)",
];

const ToneCheck = (t: MockCopy) => (
  <div className="px-5 pt-10 sm:px-10 lg:px-[4.5rem]">
    <div className="relative grid gap-8 border border-[color-mix(in_srgb,var(--mk-state-review)_55%,transparent)] bg-[image:radial-gradient(50%_60%_at_30%_50%,var(--accent-soft),transparent_70%)] p-6 sm:p-8 lg:p-12 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18.75rem),1fr))]">
      <div className="flex flex-col gap-3">
        <span className="text-[length:var(--fs-eyebrow)] text-[var(--text-faint)]">
          {t.ai.tone.channel}
        </span>
        <p
          dir="rtl"
          lang="ar"
          className="m-0 text-[clamp(1.25rem,2.4vw,1.625rem)] leading-[1.6] text-[var(--text-secondary)]"
          style={{ fontFamily: "var(--font-arabic)" }}
        >
          صباحك أحلى مع{" "}
          {/* The key term that should have been Arabic — marked as light,
              because the fix is a suggestion rather than an error. */}
          <span className="border-b-2 border-[var(--accent)] text-[var(--text)] shadow-[0_6px_12px_-6px_color-mix(in_srgb,var(--accent)_80%,transparent)]">
            Nakhla
          </span>
          . قهوتنا الجديدة وصلت، جرّبها اليوم من أقرب فرع
          {/* The second exclamation mark — flagged, not lit (§7). */}
          <span className="border-b-2 border-[var(--mk-state-rejected)] text-[var(--text)]">
            !!
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {t.ai.tone.checks.map((c, i) => (
          <div
            key={c.label}
            className="flex items-center gap-3 rounded-[var(--radius-widget)] border border-[var(--hairline)] bg-[var(--surface-1)] px-3.5 py-3 text-[length:var(--fs-eyebrow)]"
          >
            <span
              className="size-2 flex-none rounded-full"
              style={{ background: CHECK_DOTS[i] }}
            />
            <span className="min-w-0">{c.label}</span>
            <span className="ms-auto flex-none text-[var(--text-faint)]">{c.state}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

