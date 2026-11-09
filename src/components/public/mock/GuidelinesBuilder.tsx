import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
import { Mark } from "@/components/ui";

/*
 * The guidelines builder, and the three covers it ships with.
 *
 * Markup, not a screenshot — the three reasons are the ones written at the top
 * of `BrandHub.tsx`, and the third is still the real one: a screenshot of
 * Arabic type is an image of text that no screen reader, translator or search
 * engine can read.
 *
 * ── What it is a picture of ───────────────────────────────────────────────
 *
 * The product's guidelines editor: the client's guideline site is built from
 * one of three templates, and the rail is where that choice is made. The
 * canvas shows the cover page of the site being built. Drawn from
 * `Markyos Screens/Guidelines Builder.png`, adapted to this site's light
 * ground the same way the hub was.
 *
 * ── It follows the page's language (8 Nov 2026) ───────────────────────────
 *
 * Pinned to Arabic until copy v3, with the same argument the hub carried
 * and the same answer: Part A §3 asks for the English window in English,
 * and a picture of the product the reader cannot read makes its point at
 * the cost of the point. Same client either way — Nakhla is a coffee
 * roaster in both editions. The strings are in `content/mocks.ts`.
 *
 * ── Why `Cover` is exported ───────────────────────────────────────────────
 *
 * The three covers appear twice: as thumbnails in the rail, where the choice
 * is made, and full size in the hero, where the scroll story deals them out of
 * this window. One component, so the thing that comes out of the builder is
 * literally the thing that was in it. `detail` is the only difference — a
 * thumbnail of a page shows bars where the page has text, which is what a
 * thumbnail is, and is also why nothing here renders type below 12px.
 */

/* The client's palette. Colours are not words and do not change with the
   language; the brand's name does, and lives in `content/mocks.ts`. */
const BRAND = {
  cream: "#f3e9dc",
  brown: "#6b3e26",
};

export type TemplateKind = "vault" | "docs" | "studio";

/*
 * The three templates, with the product's own names.
 *
 * The names are product nouns and stay in Latin in both editions, as they do
 * in the product: a studio picking a template is picking "Docs", not a
 * translation of it. `dir="ltr"` on each, so the bidi algorithm does not read
 * one as the tail of the Arabic line beside it.
 */
export const TEMPLATES: {
  kind: TemplateKind;
  name: string;
}[] = [
  { kind: "vault", name: "Vault" },
  { kind: "docs", name: "Docs" },
  { kind: "studio", name: "Studio" },
];

/*
 * A template's ground, as the template itself defines it.
 *
 * These are the three design systems the product offers, shown as content —
 * the same carve-out §7 grants the client palette in `BrandHub.tsx`, and the
 * reason this file is in the `raw-hex` exemption table. A template whose whole
 * description is "dark ground" cannot be drawn from a light site's tokens.
 */
const GROUND: Record<
  TemplateKind,
  { bg: string; ink: string; quiet: string; accent: string; onAccent: string }
> = {
  vault: {
    bg: "#121217",
    ink: "#ffffff",
    quiet: "rgba(255,255,255,.45)",
    accent: "#4da3ff",
    onAccent: "#0b0b0f",
  },
  docs: {
    bg: "#ffffff",
    ink: "#0b0b0f",
    quiet: "rgba(11,11,15,.4)",
    accent: "#0055ff",
    onAccent: "#ffffff",
  },
  studio: {
    bg: "radial-gradient(135% 100% at 50% 118%, #1f7bff 0%, #0b2f8a 38%, #090a14 78%)",
    ink: "#ffffff",
    quiet: "rgba(255,255,255,.5)",
    accent: "#7fc0ff",
    onAccent: "#0b0b0f",
  },
};

/*
 * One template's cover page.
 *
 * `detail="bars"` is the rail thumbnail: a picture of a page, so the text is
 * bars. `detail="full"` is the cover the hero deals out, where every string is
 * real text at 12px or more.
 */
export function Cover({
  locale,
  kind,
  detail = "full",
}: {
  locale: Locale;
  kind: TemplateKind;
  detail?: "bars" | "full";
}) {
  const g = GROUND[kind];
  const { t, dir, lang } = mockCopy(locale);
  const b = t.builder;

  return (
    <div
      dir={dir}
      lang={lang}
      className="flex h-full w-full flex-col justify-between overflow-clip"
      style={{ background: g.bg, color: g.ink, padding: detail === "bars" ? 8 : 14 }}
    >
      {detail === "bars" ? (
        <>
          <span
            aria-hidden="true"
            className="block h-1.5 w-7 rounded-full"
            style={{ background: g.accent }}
          />
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="block h-1.5 w-full rounded-full" style={{ background: g.quiet }} />
            <span className="block h-1.5 w-2/3 rounded-full" style={{ background: g.quiet }} />
          </span>
        </>
      ) : (
        <>
          <span className="flex items-center gap-1.5 text-[0.75rem]" style={{ color: g.quiet }}>
            <span
              aria-hidden="true"
              className="grid size-4 place-items-center rounded-full text-[0.75rem]"
              style={{ background: BRAND.brown, color: BRAND.cream }}
            >
              {b.initial}
            </span>
            {b.name}
          </span>

          <span className="text-[1.125rem] font-medium leading-tight">
            {b.coverTitle[0]}
            <br />
            {b.coverTitle[1]}
          </span>

          <span className="flex items-center justify-between gap-2">
            <span
              dir="ltr"
              className="rounded-[var(--radius-pill)] px-2 py-0.5 text-[0.75rem] font-medium"
              style={{ background: g.accent, color: g.onAccent }}
            >
              {TEMPLATES.find((t) => t.kind === kind)?.name}
            </span>
            <span aria-hidden="true" style={{ color: g.ink }}>
              <Mark size={16} />
            </span>
          </span>
        </>
      )}
    </div>
  );
}

export function GuidelinesBuilder({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const b = t.builder;

  return (
    /*
     * The frame is LTR and the page inside it is RTL — the same split as the
     * hub: a browser's own chrome does not mirror because the document inside
     * it does.
     */
    <div className="mk-card overflow-clip text-start" dir="ltr">
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-[var(--hairline)] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-[var(--track)]" />
          <span className="size-2 rounded-full bg-[var(--track)]" />
          <span className="size-2 rounded-full bg-[var(--track)]" />
        </div>

        <span className="mx-auto rounded-[var(--mk-r-status)] bg-[var(--surface-2)] px-3 py-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          {b.url}
        </span>

        <div
          aria-hidden="true"
          className="flex items-center gap-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-2)] p-0.5 text-[length:var(--fs-eyebrow)] font-medium"
        >
          <span className="rounded-[var(--radius-pill)] px-2 py-0.5 text-[var(--text-muted)]">
            EN
          </span>
          <span
            className="rounded-[var(--radius-pill)] bg-[var(--surface-3)] px-2 py-0.5 text-[var(--text)]"
            style={{ fontFamily: "var(--font-arabic)" }}
          >
            ع
          </span>
        </div>
      </div>

      <div dir={dir} lang={lang} className="grid grid-cols-[12.5rem_1fr] text-[0.75rem]">
        {/* The rail: where the template is chosen. */}
        <div className="border-s border-[var(--hairline)] p-4">
          <p className="font-medium text-[var(--text)]">{b.name}</p>
          <p className="mt-0.5 text-[var(--text-muted)]">{b.railLead}</p>

          <div
            aria-hidden="true"
            className="mt-3 flex gap-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-2)] p-0.5"
          >
            {b.tabs.map((tab) => (
              <span
                key={tab}
                className={
                  "flex-1 rounded-[var(--radius-pill)] px-1.5 py-1 text-center text-[0.75rem] " +
                  (tab === b.activeTab
                    ? "bg-[var(--surface-0)] font-medium text-[var(--text)]"
                    : "text-[var(--text-muted)]")
                }
              >
                {tab}
              </span>
            ))}
          </div>

          <p className="mt-3 leading-relaxed text-[var(--text-muted)]">{b.railNote}</p>

          <ul className="mt-3 space-y-2.5">
            {TEMPLATES.map((t) => (
              <li key={t.kind} className="flex items-center gap-2.5">
                <span className="h-11 w-14 flex-none overflow-clip rounded-[var(--mk-r-button)] border border-[var(--hairline)]">
                  <Cover kind={t.kind} detail="bars" locale={locale} />
                </span>
                <span>
                  <span dir="ltr" className="block font-medium text-[var(--text)]">
                    {t.name}
                  </span>
                  <span className="block leading-snug text-[var(--text-muted)]">
                    {b.notes[t.kind]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The canvas: the cover page of the site being built. */}
        <div className="bg-[var(--surface-2)] p-4">
          <p className="text-center text-[var(--text-muted)]">
            {b.canvasLabel}
            <span dir="ltr" className="ms-2">
              1200px
            </span>
          </p>

          <div className="mk-card mt-3 overflow-clip">
            <div className="flex items-center gap-2 border-b border-[var(--hairline)] px-3 py-2">
              <span className="font-medium text-[var(--text)]">{b.name}</span>
              <span className="ms-auto rounded-[var(--radius-pill)] bg-[var(--surface-2)] px-2 py-0.5 text-[var(--text-muted)]">
                {b.assets}
              </span>
              <span className="rounded-[var(--radius-pill)] bg-[var(--surface-2)] px-2 py-0.5 text-[var(--text-muted)]">
                {b.preview}
              </span>
            </div>

            {/* The cover itself, at the size the canvas shows it. */}
            <div
              className="flex flex-col justify-between p-6"
              style={{ background: "var(--mk-blue-ink)", blockSize: 212 }}
            >
              <span className="text-[2rem] font-medium leading-none text-[var(--canvas)]">
                {b.coverTitle[0]}
                <br />
                {b.coverTitle[1]}
              </span>
              <span className="flex items-center justify-between">
                <span aria-hidden="true" className="text-[var(--canvas)]">
                  <Mark size={26} />
                </span>
                <span className="text-[length:var(--fs-ui)] text-[var(--canvas)]">
                  {b.name}
                </span>
              </span>
            </div>
          </div>

          {/*
           * The publish bar reads from the start edge, with only the button
           * pushed to the end.
           *
           * It was `justify-end`, which is what the product does — the real
           * bar is a floating pill in the canvas's end corner. `check:bidi`
           * reported it 593px off the start edge, and it was right to: a row
           * of Arabic labels packed away from the reading edge is the exact
           * shape of the bug that check exists to catch, and a gate that has
           * to be argued with stops being read. `ms-auto` on the button keeps
           * the primary action at the end, which is the part of the
           * product's layout that carries meaning.
           */}
          <p className="mt-3 flex items-center gap-3 text-[var(--text-muted)]">
            <span>{b.unpublished}</span>
            <span>{b.allGood}</span>
            <span className="ms-auto rounded-[var(--radius-pill)] bg-[var(--text)] px-3 py-1 font-medium text-[var(--surface-0)]">
              {b.publish}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
