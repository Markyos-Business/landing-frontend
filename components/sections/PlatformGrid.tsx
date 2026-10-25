import type { ReactNode } from "react";
import Link from "next/link";
import type { PlatformGridCopy } from "@/content/types";
import { mockCopy, type MockCopy } from "@/content/mocks";
import { Button } from "@/components/ui/Button";
import { Section, SectionHead } from "@/components/ui/Section";
import { Arrow, Icon } from "@/components/ui/Icon";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The platform, as seven windows onto it.
 *
 * `Markyos Homepage v2.dc.html` §04, and the section the whole v2 page is
 * built around. It replaces `Pillars` on the homepage — three paragraphs
 * describing assets, guidelines and strategy — with seven cells that each
 * show one, name it, and say one sentence about it.
 *
 * The three pillars are not deleted. They still read at /platform, where
 * there is room to argue; what the homepage needed was the thing itself.
 *
 * ── Where the words in the pictures come from ─────────────────────────────
 *
 * `content/mocks.ts`, in both languages — not from string literals here.
 *
 * They were literals, and that was wrong: on the Arabic homepage this
 * section rendered 49 English strings, which on a page whose claim is «بُنيت
 * بالعربية. لا تُرجمت إليها» is the claim being contradicted by the
 * illustration beside it. "An Arabic reader should see the same artefact"
 * was the reasoning, and it does not survive contact with the product —
 * the real screen has an Arabic interface, so a picture of it in English is
 * a picture of a different product.
 *
 * The cell's own name and sentence are marketing copy and come from
 * `content/`, as before.
 */

export function PlatformGrid({
  copy,
  locale,
}: {
  copy: PlatformGridCopy;
  locale: Locale;
}) {
  const { t, dir, lang } = mockCopy(locale);
  const visuals = buildVisuals(t);

  return (
    <Section id="platform" labelledBy="platform-heading" rule>
      <SectionHead
        id="platform-heading"
        title={copy.headline}
        align="start"
        action={<Button cta={copy.cta} locale={locale} variant="outline" size="sm" />}
      />

      {/*
       * Two columns at desktop, one on a phone, and the last cell spans both.
       *
       * `minmax(min(100%,29rem),1fr)` rather than a breakpoint: the cells hold
       * product fragments with a natural minimum width, and auto-fit lets the
       * grid drop to one column when that minimum stops fitting instead of at
       * a width somebody guessed.
       */}
      <ul className="mk-bento mt-12 [grid-template-columns:repeat(auto-fit,minmax(min(100%,29rem),1fr))]">
        {copy.cells.map((cell, i) => (
          <li
            key={cell.name}
            /*
             * `overflow-hidden` per cell, not just on the grid: the viewers
             * cell draws its horizon as an oversized ellipse hanging below
             * the floor, and unclipped it renders as a complete ring across
             * the middle of the cell rather than as a curve coming up from
             * under it.
             */
            className={`relative flex min-h-[22.5rem] flex-col justify-between gap-7 overflow-hidden${
              i === visuals.length - 1 ? " [grid-column:1/-1]" : ""
            }`}
          >
            {/*
             * The picture. `self-center` with a max width, which is what keeps
             * a fragment reading as a fragment: it sits in the middle of the
             * cell's air rather than being stretched to fill it.
             */}
            {/*
             * `dir`/`lang` from the mock, not from the page. This is the
             * product's own interface, and on the Arabic edition it is an
             * Arabic interface — so it mirrors, and its Arabic is announced
             * as Arabic. §9's "mocks do not mirror" is about the window
             * around the product, not the page inside it.
             */}
            <div className="w-full self-center" dir={dir} lang={lang}>
              {visuals[i]}
            </div>

            <div>
              {/*
               * The cell's name *is* the link — "Discovery →", the reference's
               * own cell footer. Not a `Button`: none of its three variants is
               * this, and forcing one with `!important` would leave the next
               * person reading overrides instead of a rule.
               */}
              <Link
                href={localeHref(locale, cell.href)}
                className="mk-bidi inline-flex items-center gap-2 text-[1.25rem] font-medium tracking-[-0.03em] text-[var(--text)] hover:text-[var(--accent-text)]"
              >
                {cell.name}
                <Arrow />
              </Link>
              {cell.line ? (
                <p className="mk-body mk-bidi mt-1.5 max-w-[34ch]">{cell.line}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── The seven pictures ──────────────────────────────────────────────────── */

/*
 * `dir="ltr"` on values that are a *sequence*, and this is not belt-and-braces.
 *
 * These are short Latin strings sitting inside an RTL page, and the ones that
 * are a sequence reorder when the paragraph direction is RTL: `18 / 24`
 * rendered as `24 / 18`, and `5 editors` as `editors 5`. The first reverses a
 * ratio and the second reads as a different sentence.
 *
 * `check:bidi` does not catch this. That script looks for Arabic laid out
 * left-to-right; this is the mirror case, Latin reordered right-to-left, and
 * it is invisible to anyone reading the English page. `isLatin` keeps the
 * override off Arabic values, which must not be forced to LTR.
 */
const isLatin = (v: string) => !/[؀-ۿ]/.test(v);

const Row = ({ k, v, tone }: { k: string; v: string; tone?: string }) => (
  <div className="flex items-center justify-between gap-3 text-[length:var(--fs-eyebrow)]">
    <span className="text-[var(--text-muted)]">{k}</span>
    <span dir={isLatin(v) ? "ltr" : undefined} className={tone ?? "text-[var(--text)]"}>
      {v}
    </span>
  </div>
);

/* 1 · Discovery — a brief that is still being answered. */
const Discovery = (t: MockCopy) => {
  const d = t.platform.discovery;
  return (
    <div className="mx-auto flex w-full max-w-[18.75rem] flex-col gap-3.5 pt-6">
      <div className="flex items-center justify-between gap-3 text-[length:var(--fs-ui)]">
        <span className="font-medium text-[var(--text)]">{d.title}</span>
        <span className="rounded-[var(--mk-r-chip)] border border-[color-mix(in_srgb,var(--mk-state-approved)_50%,transparent)] px-1.5 py-0.5 text-[length:var(--fs-eyebrow)] tracking-[0.04em] text-[var(--mk-state-approved)]">
          {d.live}
        </span>
      </div>
      <Row k={d.answered} v={d.answeredValue} tone="text-[var(--mk-blue-edge)]" />
      {/* The one lit object in this cell. §8: blue is light, and a progress
          fill is the canonical place for it. */}
      <div className="h-2.5 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--surface-2)]">
        <div className="h-full w-[75%] rounded-[var(--radius-pill)] bg-[var(--accent)] shadow-[var(--mk-glow-soft)]" />
      </div>
      <Row k={d.language} v={d.languageValue} />
      <Row k={d.account} v={d.accountValue} />
    </div>
  );
};

/* 2 · Asset library — the tree, fading out rather than ending. */
const TreeRow = ({
  label,
  count,
  depth = 0,
  icon,
  selected,
  dim,
}: {
  label: string;
  count?: string;
  depth?: number;
  icon: "folder" | "folderOpen" | "database";
  selected?: boolean;
  dim?: boolean;
}) => (
  <span
    className={`flex items-center gap-2.5 rounded-[var(--mk-r-button)] px-2.5 py-2 text-[length:var(--fs-eyebrow)] ${
      selected
        ? "bg-[var(--mk-fill-2)] text-[var(--text)]"
        : dim
          ? "text-[var(--text-muted)]"
          : "text-[var(--text-secondary)]"
    }`}
    style={{ paddingInlineStart: `${0.625 + depth * 1.25}rem` }}
  >
    <Icon name={icon} size={14} className="flex-none" />
    {label}
    {count ? <span className="ms-auto text-[var(--text-faint)]">{count}</span> : null}
  </span>
);

/*
 * The tree's shape is layout, not copy, so it stays here: which rows are
 * folders, which are nested, which one is open and which is selected. Only
 * the words come from `content/mocks.ts`, in the same order.
 */
const TREE_SHAPE: {
  icon: "folder" | "folderOpen" | "database";
  depth?: number;
  selected?: boolean;
  dim?: boolean;
}[] = [
  { icon: "folder", dim: true },
  { icon: "folderOpen" },
  { icon: "database", depth: 1 },
  { icon: "database", depth: 1, selected: true },
  { icon: "database", depth: 1 },
  { icon: "folder", dim: true },
  { icon: "folder", dim: true },
];

const AssetLibrary = (t: MockCopy) => (
  <div className="mx-auto flex w-full max-w-[20rem] flex-col gap-0.5 pt-2 [mask-image:linear-gradient(#000_70%,transparent)] [-webkit-mask-image:linear-gradient(#000_70%,transparent)]">
    {t.platform.assets.map((row, i) => (
      <TreeRow
        key={row.label}
        label={row.label}
        count={row.count}
        {...(TREE_SHAPE[i] ?? { icon: "folder" as const })}
      />
    ))}
  </div>
);

/* 3 · Guideline site — a published hub, one look of eight chosen. */
const GuidelineSite = (t: MockCopy) => (
  <div className="mx-auto flex w-full max-w-[22.5rem] flex-col gap-3 pt-6">
    {/* `dir="ltr"`: a web address is a web address in both languages and
        must never mirror. */}
    <div
      dir="ltr"
      className="flex h-11 items-center gap-3 rounded-[var(--radius-widget)] border border-[var(--hairline)] bg-[var(--surface-1)] px-3 text-[length:var(--fs-eyebrow)] text-[var(--text-faint)]"
    >
      <Icon name="lock" size={14} className="flex-none" />
      <span className="text-[var(--text)]">nakhla.markyos.site</span>
      <span className="ms-auto">{t.platform.guidelines.path}</span>
    </div>
    <div className="grid grid-cols-4 gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-[3.375rem] rounded-[var(--mk-r-status)] bg-[var(--surface-1)] ${
            i === 0
              ? "border border-[var(--accent)] shadow-[var(--mk-glow-soft)]"
              : "border border-[var(--hairline)]"
          }`}
        />
      ))}
    </div>
    <span className="text-[length:var(--fs-eyebrow)] text-[var(--text-faint)]">
      {t.platform.guidelines.caption}
    </span>
  </div>
);

/* 4 · Handoff — who owns what, after the studio is gone. */
const Handoff = (t: MockCopy) => {
  const h = t.platform.handoff;
  return (
    <div className="mx-auto flex w-full max-w-[18.75rem] flex-col gap-1 pt-6">
      <div className="flex items-center justify-between pb-2 text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
        {h.heading}
        <Icon name="plus" size={14} />
      </div>
      {h.rows.map((row, i) => {
        const owner = i === 1;
        const nested = !row.initial;
        return (
          <span
            key={row.name}
            className={`flex items-center gap-2.5 py-2 pe-2.5 text-[length:var(--fs-eyebrow)] ${
              owner
                ? "rounded-[var(--mk-r-button)] bg-[var(--mk-fill-2)] text-[var(--text)]"
                : i === 3
                  ? "text-[var(--text-faint)]"
                  : "text-[var(--text-muted)]"
            } ${nested ? "ps-[2.125rem]" : "ps-2.5"}`}
          >
            {/*
             * The avatar initial is one character at the 12px floor inside a
             * 20px square, not the 10px it shipped at. It reads as an avatar
             * because of the fill and the 4px radius, not because the letter
             * is small — and it now matches the row it sits in, which is
             * `--fs-eyebrow` too. §9: nothing in a mock goes under 12px.
             */}
            {row.initial ? (
              <span
                className={`grid size-5 flex-none place-items-center rounded-[var(--mk-r-chip)] text-[length:var(--fs-eyebrow)] ${
                  owner
                    ? "bg-[var(--accent-soft)] text-[var(--mk-blue-edge)]"
                    : "bg-[var(--surface-2)]"
                }`}
              >
                {row.initial}
              </span>
            ) : null}
            {row.name}
            <span
              dir={isLatin(row.role) ? "ltr" : undefined}
              className={`ms-auto ${i === 3 ? "" : "text-[var(--text-faint)]"}`}
            >
              {row.role}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/*
 * 5 · Unlimited viewers — the price, as the picture.
 *
 * The only cell whose art is type. The horizon under it is the design
 * system's raised edge rather than a glow: this cell is making a commercial
 * point, not showing a lit object, and §8 allows one light per section — the
 * discovery bar already has it.
 */
const UnlimitedViewers = (t: MockCopy) => (
  <div className="relative flex flex-col items-center pt-10 text-center">
    {/* The figure is a price and stays Latin in both editions. */}
    <span
      dir="ltr"
      className="text-[clamp(3.5rem,7vw,5rem)] font-medium leading-[0.95] tracking-[-0.05em] text-[var(--text)]"
    >
      $0
    </span>
    <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--text-faint)]">
      {t.platform.viewers.perViewer}
    </span>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[-10%] -bottom-28 h-56 rounded-[50%] border-t border-[var(--mk-line-strong)] shadow-[0_-2px_24px_var(--mk-fill-2)]"
    />
  </div>
);

/* 6 · Rights and expiry — a licence window running out. */
const RightsExpiry = (t: MockCopy) => {
  const r = t.platform.rights;
  return (
    <div className="mx-auto flex w-full max-w-[20rem] flex-col gap-3 pt-6">
      <span className="text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
        {r.licence}
      </span>
      <span className="text-[1.375rem] font-medium tracking-[-0.03em] text-[var(--text)]">
        {r.expires}
      </span>
      {/* The design system's data bar: blue core falling off to black (§3). */}
      <div className="h-[4.5rem] rounded-[var(--radius-widget)] bg-[image:var(--mk-data-bar)]" />
      <div className="flex justify-between text-[length:var(--fs-eyebrow)] text-[var(--text-faint)]">
        <span dir={isLatin(r.from) ? "ltr" : undefined}>{r.from}</span>
        <span dir={isLatin(r.to) ? "ltr" : undefined}>{r.to}</span>
      </div>
    </div>
  );
};

/*
 * 7 · Brand health — the full-width cell.
 *
 * Masked to the end edge rather than fitted: this is a dashboard and the
 * point is that it continues, so the crop dissolves instead of stopping.
 *
 * The mask is declared twice because a CSS gradient angle is physical and
 * does not mirror. At `90deg` the Arabic page faded the *start* edge — the
 * panel's title and its first figure went to nothing while the empty end of
 * the chart stayed solid, which reads as a rendering fault rather than as a
 * crop. `rtl:` flips it to 270deg. There is no logical gradient keyword to
 * use instead; this is the fix.
 */
const Stat = ({ k, v, lit }: { k: string; v: string; lit?: boolean }) => (
  <div className="flex flex-col gap-1">
    <span className="flex items-center gap-1.5 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
      {k}
      {lit ? (
        <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
      ) : null}
    </span>
    <span dir="ltr" className="text-[1.375rem] font-medium text-[var(--text)]">
      {v}
    </span>
  </div>
);

const BrandHealth = (t: MockCopy) => (
  <div className="w-full max-w-[45rem] rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface-1)] p-7 [mask-image:linear-gradient(90deg,#000_60%,transparent)] [-webkit-mask-image:linear-gradient(90deg,#000_60%,transparent)] rtl:[mask-image:linear-gradient(270deg,#000_60%,transparent)] rtl:[-webkit-mask-image:linear-gradient(270deg,#000_60%,transparent)]">
    <span className="block border-b border-[var(--hairline)] pb-[1.125rem] text-[length:var(--fs-lead)] font-medium text-[var(--text)]">
      {t.platform.health.heading}
    </span>
    <div className="mt-5 grid grid-cols-4 gap-4">
      {t.platform.health.stats.map((stat, i) => (
        <Stat key={stat.label} k={stat.label} v={stat.value} lit={i === 0} />
      ))}
    </div>
    {/*
     * Two series, drawn rather than imported. A chart, not an icon — §8
     * sanctions chart fills, and this is the one `<svg>` in `components/`
     * outside `components/brand/`. `preserveAspectRatio="none"` lets it
     * stretch to the panel, and `vector-effect` keeps the stroke 1.5px at
     * every width.
     *
     * §6 and §13 forbid hand-drawn SVG, and they mean icons: the rule exists
     * so nobody draws a magnifying glass when `las la-search` is sitting
     * there. Line Awesome has no glyph for a chart carrying real values, and
     * a glyph could not carry them if it did. `npm run check:design` enforces
     * the rule and exempts this file (`inline-svg`) with that reasoning; if
     * the chart moves, the exemption moves with it, and a second `<svg>`
     * appearing in here would fail the build rather than ride along on the
     * exemption this one earned.
     */}
    <svg
      viewBox="0 0 600 120"
      preserveAspectRatio="none"
      className="mt-5 h-[7.5rem] w-full"
      aria-hidden="true"
    >
      <polyline
        points="0,90 50,70 100,78 150,60 200,74 250,52 300,62 350,40 400,46 450,30 500,44 550,26 600,34"
        fill="none"
        stroke="var(--mk-state-review)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        style={{
          filter: "drop-shadow(0 0 4px color-mix(in srgb, var(--mk-state-review) 70%, transparent))",
        }}
      />
      <polyline
        points="0,110 50,96 100,104 150,92 200,100 250,84 300,94 350,72 400,86 450,64 500,80 550,60 600,70"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        style={{
          filter: "drop-shadow(0 0 4px color-mix(in srgb, var(--accent) 80%, transparent))",
        }}
      />
    </svg>
  </div>
);

function buildVisuals(t: MockCopy): ReactNode[] {
  return [
    Discovery(t),
    AssetLibrary(t),
    GuidelineSite(t),
    Handoff(t),
    UnlimitedViewers(t),
    RightsExpiry(t),
    BrandHealth(t),
  ];
}
