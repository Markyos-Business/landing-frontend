import type { ReactNode } from "react";
import type { StudioPathCopy } from "@/content/types";
import { mockCopy, type MockCopy } from "@/content/mocks";
import { Button } from "@/components/ui/Button";
import { Inset } from "@/components/ui/Card";
import { Glow, Section, SectionFoot, SectionHead } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The studio path: eight steps, as a bento.
 *
 * The grid is the argument. Steps 1–6 are paired across two columns because
 * they are a sequence of comparable moves; step 7 goes full width because its
 * point is that the site assembles itself and it needs the room to show eight
 * templates doing it; step 8 goes full width and loud because it is the
 * promise the whole section was built toward — "hand it over like it's worth
 * what they paid" is the line a studio owner came to this page for.
 *
 * ── Why the layout is indexed ─────────────────────────────────────────────
 *
 * STEP_LAYOUT below keys off position, which is normally a smell. It is safe
 * here for one specific reason: StudioPathCopy fixes the steps as an ordered
 * sequence where each one feeds the next, and the copy doc numbers them. Step
 * 7 is "Build" in every locale and in every revision, because reordering them
 * would not be a layout change, it would be a different product.
 *
 * What it buys is that the copy stays pure copy: content/ holds eight steps
 * and no presentation flags, and a translator never meets a `wide: true`.
 */

export function StudioPath({
  copy,
  locale,
}: {
  copy: StudioPathCopy;
  locale: Locale;
}) {
  const { t, dir, lang } = mockCopy(locale);

  return (
    <Section id="studios" labelledBy="studios-heading" rule>
      {/* The lead is not here. It moved to the floor of the section, under
          the pictures, which is where the reference puts the words that
          explain a product visual — see SectionFoot. */}
      <SectionHead
        id="studios-heading"
        eyebrow={copy.eyebrow}
        title={copy.headline}
        align="start"
      />

      {/*
       * Eight steps became three pictures.
       *
       * Written out, this section was 598 words and 2,401px — the single
       * heaviest thing on the page, and more than twice what the whole
       * homepage should be. Every one of those eight steps is already written
       * at /solutions/studios, which is where a studio owner who wants the
       * detail goes; nobody deciding whether to care reads eight steps first.
       *
       * What survives is the three steps that had something to look at, in a
       * bento with the step's own name on the floor — the reference's cell
       * (UI-UX Design Reference/20, 21). The copy is untouched in `content/`;
       * this section stopped rendering most of it.
       */}
      {/*
       * Each cell is a window, not a thumbnail.
       *
       * The art is laid out wider than the column and the cell crops it, so
       * what you see is a corner of the real thing running off the edge
       * rather than a shrunk-down picture of it — the reference's grid, where
       * every cell is a fragment at full size (20, 21).
       *
       * 160%, and the number matters. At 132% the cut landed about 70px from
       * the panel's own rounded corner, so the cell showed three corners and
       * one hard edge and read as a rendering fault rather than as a crop.
       * The reference cuts far harder than feels comfortable — its CMS cell
       * loses nearly half the table — and that is exactly what stops the
       * frame reading as a frame. Past about 150% the far corner is gone
       * entirely and the panel reads as a surface continuing past the edge.
       */}
      <ol className="mk-pop mk-bento mt-14 sm:grid-cols-3">
        {VISUAL_STEPS.map(({ at, visual }) => {
          const step = copy.steps[at];
          if (!step) return null;

          return (
            <li key={at} className="mk-cell min-h-[17rem]">
              <div className="mk-cell-art [--mk-cell-art-w:160%]" dir={dir} lang={lang}>
                {visual(t)}
              </div>
              <p className="mk-cell-foot mk-bidi text-[length:var(--fs-lead)] font-medium text-[var(--text)]">
                {step.name}
              </p>
            </li>
          );
        })}
      </ol>

      {/*
       * The section's one light, on the promise.
       *
       * `min(...,100%)` and not a bare 24rem: it used to live inside a card
       * with `overflow-clip`, and out here a fixed width ran 404px wide on
       * a 390px phone and gave the whole page a sideways scrollbar. Every
       * other bloom on the site is capped the same way.
       */}
      <div className="relative">
        <Glow className="-bottom-24 start-0 h-[18rem] w-[min(24rem,100%)]" />
        <SectionFoot
          body={copy.subheadline}
          action={<Button cta={copy.cta} locale={locale} variant="solid" size="sm" />}
        />
      </div>
    </Section>
  );
}

const Findings = (f: MockCopy["studio"]["findings"]) => (
  <Inset className="divide-y divide-[var(--hairline)]">
    {f.map(({ label, line }, i) => (
      <div key={label} className="p-3.5">
        <p
          className={`text-[length:var(--fs-eyebrow)] font-medium ${
            i < 2 ? "text-[var(--text)]" : "text-[var(--text-muted)]"
          }`}
        >
          {label}
        </p>
        <p className="mt-1 text-[length:var(--fs-ui)] leading-[1.45] text-[var(--text)]">{line}</p>
      </div>
    ))}
  </Inset>
);

/* What the zip turns into: a count, the roles it guessed, and one confirm. */
const ZipResult = (z: MockCopy["studio"]["zip"]) => (
  <Inset className="p-4">
    <p className="text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
      {z.summary}
    </p>
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {z.roles.map((role) => (
        <span
          key={role}
          className="rounded-[var(--mk-r-status)] bg-[var(--surface-2)] px-2 py-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]"
        >
          {role}
        </span>
      ))}
      <span className="flex items-center gap-1.5 rounded-[var(--mk-r-status)] bg-[var(--surface-2)] px-2 py-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
        {z.scripts.map((script) => (
          <span key={script} className="flex items-center gap-1">
            {script}
            <Icon name="check" size={11} className="text-[var(--mk-state-approved)]" />
          </span>
        ))}
      </span>
    </div>
    {/* Inert: a picture of the product's confirm step, not a control here. */}
    <div aria-hidden="true" className="mt-4 flex justify-end">
      <span className="mk-btn mk-btn-sm mk-solid">{z.confirm}</span>
    </div>
  </Inset>
);

/*
 * The eight looks, as eight wireframes.
 *
 * Abstract on purpose. A grid of eight real template thumbnails at this size
 * is eight illegible screenshots; eight wireframes say "these are different
 * layouts" at a glance, which is the only thing the step is claiming.
 */
const TemplateGrid = (
  <ul aria-hidden="true" className="grid grid-cols-4 gap-2.5">
    {Array.from({ length: 8 }, (_, i) => {
      const picked = i === 2;
      return (
        <li
          key={i}
          className={
            "aspect-[4/3] overflow-clip rounded-[var(--mk-r-button)] border p-2 " +
            (picked
              ? "border-[var(--accent)] bg-[var(--accent)]"
              : "border-[var(--hairline-strong)] bg-[var(--surface-1)]")
          }
        >
          <span
            className={
              "block h-1 w-1/2 rounded-full " +
              (picked ? "bg-[rgba(9,9,11,0.35)]" : "bg-[var(--surface-3)]")
            }
          />
          <span
            className={
              "mt-1.5 block h-[60%] rounded-[var(--mk-r-chip)] " +
              (picked ? "bg-[rgba(9,9,11,0.18)]" : "bg-[var(--track)]")
            }
          />
        </li>
      );
    })}
  </ul>
);

/*
 * Which steps have a picture, and where each one sits in `copy.steps`.
 *
 * Keyed on position, not on the step's name: `name` is translated copy,
 * so a name key would miss on the Arabic page and every picture would
 * vanish. CompanyCopy and StudioPathCopy both fix their items as an
 * ordered sequence, so position is the same in both languages.
 */
const VISUAL_STEPS: { at: number; visual: (t: MockCopy) => ReactNode }[] = [
  { at: 1, visual: (t) => Findings(t.studio.findings) }, // Analyze
  { at: 5, visual: (t) => ZipResult(t.studio.zip) }, // Receive the files
  { at: 6, visual: () => TemplateGrid }, // Build
];
