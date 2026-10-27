import type { ReactNode } from "react";
import type { SiteCopy } from "@/content/types";
import type { Cell, PageBlock, TermItem } from "@/content/pages/types";
import type { Locale } from "@/lib/i18n/locales";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow, Glow, Section, SectionHead } from "@/components/ui/Section";
import { SignupForm } from "./SignupForm";

/*
 * The block renderers.
 *
 * Every one of these composes the vocabulary in `app/globals.css` and the
 * primitives in `components/ui` — none of them invents a value. That is the
 * rule in `docs/DESIGN.md` and it is what keeps thirty-odd data-driven pages
 * looking like one site rather than like a template.
 *
 * Three things are handled once here so no content file has to think about
 * them:
 *
 *   - **Direction.** Every string is wrapped in `.mk-bidi`
 *     (`unicode-bidi: plaintext`), so an English product name inside an
 *     Arabic sentence sits the right way round and the reverse works too. All
 *     spacing is logical (`ps-`, `me-`, `start-`), never physical, so the
 *     whole page mirrors from the one `dir` on <html>.
 *   - **Status chips.** A block names a feature id; the chip label is
 *     resolved per locale from `lib/status.ts`. No page can hard-code
 *     "coming spring 2027" and then go on saying it after it ships.
 *   - **Rhythm.** Sections alternate a hairline rule rather than carrying
 *     their own margins, so a page reads as a sequence instead of a stack of
 *     unrelated boxes.
 */

type Ctx = {
  locale: Locale;
  chips: SiteCopy["chips"];
};

/** A string from the copy, in its own resolved direction. */
function T({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`mk-bidi ${className}`}>{children}</span>;
}

function Buttons({
  buttons,
  links,
  locale,
  align = "start",
}: {
  buttons?: { label: string; href: string }[];
  links?: { label: string; href: string }[];
  locale: Locale;
  align?: "start" | "center";
}) {
  if (!buttons?.length && !links?.length) return null;
  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {buttons?.map((cta, i) => (
        <Button
          key={cta.href + cta.label}
          cta={cta}
          locale={locale}
          // The first button is the page's one job. A second button of equal
          // weight is the studio/company fork, which genuinely is two equal
          // jobs — anything after that is a signpost and is set as one.
          variant={i === 0 ? "solid" : i === 1 ? "outline" : "link"}
        />
      ))}
      {links?.map((cta) => (
        <Button key={cta.href + cta.label} cta={cta} locale={locale} variant="link" />
      ))}
    </div>
  );
}

/* ── hero ─────────────────────────────────────────────────────────────────── */

function HeroBlock({
  block,
  ctx,
  headingId,
}: {
  block: Extract<PageBlock, { kind: "hero" }>;
  ctx: Ctx;
  headingId: string;
}) {
  return (
    <section
      aria-labelledby={headingId}
      // `overflow-hidden` clips the bloom. Without it the glow is wider than
      // the viewport on a phone and the whole document scrolls sideways by
      // about 20px — which reads as a broken page, not as a soft light.
      className="relative overflow-hidden pt-[clamp(3rem,7vw,5.5rem)] pb-[clamp(3rem,7vw,5rem)]"
    >
      <Glow className="start-1/2 top-0 w-[min(56rem,100%)] -translate-x-1/2 opacity-70" />
      <div className="mk-container relative flex flex-col items-center text-center">
        {block.eyebrow ? <Eyebrow className="mb-5">{block.eyebrow}</Eyebrow> : null}
        {block.feature ? (
          <Chip feature={block.feature} chips={ctx.chips} className="mb-5" />
        ) : null}

        <h1 id={headingId} className="mk-display max-w-[52rem]">
          <T>{block.title}</T>
        </h1>

        {block.lead ? (
          <p className="mk-lead mk-bidi mt-6 max-w-[44rem]">{block.lead}</p>
        ) : null}

        {block.buttons?.length || block.links?.length ? (
          <div className="mt-9">
            <Buttons
              buttons={block.buttons}
              links={block.links}
              locale={ctx.locale}
              align="center"
            />
          </div>
        ) : null}

        {block.note ? (
          <p className="mk-bidi mt-5 max-w-[32rem] text-[length:var(--fs-ui)] leading-[1.6] text-[var(--text-muted)]">
            {block.note}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ── prose ────────────────────────────────────────────────────────────────── */

function ProseBlock({
  block,
  ctx,
  headingId,
  rule,
}: {
  block: Extract<PageBlock, { kind: "prose" }>;
  ctx: Ctx;
  headingId: string;
  rule: boolean;
}) {
  const align = block.align ?? "split";
  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} rule={rule}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={<T>{block.title}</T>}
          body={align === "split" ? block.body : undefined}
          lead={align !== "split" ? block.body?.[0] : undefined}
          align={align}
          emphasiseLast={block.emphasiseLast}
        >
          {align !== "split" && block.body && block.body.length > 1 ? (
            <div className={`space-y-4 ${align === "center" ? "text-center" : ""}`}>
              {block.body.slice(1).map((p) => (
                <p key={p} className="mk-body mk-bidi mk-measure">
                  {p}
                </p>
              ))}
            </div>
          ) : null}
          {block.cta || block.links?.length ? (
            <div className="mt-7">
              <Buttons
                links={[...(block.cta ? [block.cta] : []), ...(block.links ?? [])]}
                locale={ctx.locale}
                align={align === "center" ? "center" : "start"}
              />
            </div>
          ) : null}
        </SectionHead>
      ) : (
        <div className="mk-measure space-y-4">
          {block.body?.map((p) => (
            <p key={p} className="mk-body mk-bidi mk-measure">
              {p}
            </p>
          ))}
          {block.cta || block.links?.length ? (
            <div className="pt-3">
              <Buttons
                links={[...(block.cta ? [block.cta] : []), ...(block.links ?? [])]}
                locale={ctx.locale}
              />
            </div>
          ) : null}
        </div>
      )}
    </Section>
  );
}

/* ── numbered ─────────────────────────────────────────────────────────────── */

function NumberedBlock({
  block,
  ctx,
  headingId,
  rule,
}: {
  block: Extract<PageBlock, { kind: "numbered" }>;
  ctx: Ctx;
  headingId: string;
  rule: boolean;
}) {
  const ItemHeading = block.title ? "h3" : "h2";

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} rule={rule}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={<T>{block.title}</T>}
          lead={block.lead}
          align="start"
        />
      ) : null}

      {/*
        An ordered list, and really one: these are "the solutions in the order
        that matters to you", so the order is the content. A div with a styled
        number would announce nothing to a screen reader.

        Each item is a two-column split at desktop — index and title on the
        reading side, body on the other — which keeps the titles in one
        scannable column. Hairlines between items rather than cards, because
        eight cards in a column is a list wearing a costume.
      */}
      <ol className={`${block.title ? "mt-14" : ""} divide-y divide-[var(--hairline)]`}>
        {block.items.map((item, i) => (
          <li
            key={item.title}
            className="grid gap-x-12 gap-y-4 py-9 first:pt-0 md:grid-cols-[1fr_1.35fr]"
          >
            <div className="flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="shrink-0 text-[1.125rem] font-medium tabular-nums text-[var(--accent-text)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                {/*
                 * The level follows the outline, the class follows the
                 * design. When this block carries its own title that title
                 * is the <h2> and these sit under it; when it does not —
                 * which is how /compare, /resources, /solutions and
                 * /whats-new use it — there is no <h2> on the page at all,
                 * and an <h3> straight after the <h1> is a hole in the
                 * document outline that a screen-reader user navigating by
                 * heading falls through. `mk-h3` stays either way: nothing
                 * about the size changes.
                 */}
                <ItemHeading className="mk-h3 mk-bidi">{item.title}</ItemHeading>
                {item.feature ? (
                  <Chip feature={item.feature} chips={ctx.chips} className="mt-3" />
                ) : null}
              </div>
            </div>

            <div className="space-y-4 md:pt-0.5">
              {item.body.map((p) => (
                <p key={p} className="mk-body mk-bidi mk-measure">
                  {p}
                </p>
              ))}
              {item.cta ? (
                <Button cta={item.cta} locale={ctx.locale} variant="link" />
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ── terms ────────────────────────────────────────────────────────────────── */

function TermList({ items, ctx, cols = 2 }: { items: TermItem[]; ctx: Ctx; cols?: 1 | 2 | 3 }) {
  const grid =
    cols === 1
      ? "mk-measure"
      : cols === 3
        ? "grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
        : "grid gap-x-12 gap-y-8 md:grid-cols-2";

  return (
    <dl className={grid}>
      {items.map((item) => (
        <div key={item.term} className={cols === 1 ? "mt-7 first:mt-0" : undefined}>
          <dt className="mk-bidi flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9375rem] font-medium leading-[1.45] text-[var(--text)]">
            <span className="mk-bidi">{item.term}</span>
            {item.feature ? <Chip feature={item.feature} chips={ctx.chips} /> : null}
          </dt>
          {item.body ? (
            <dd className="mk-bidi mt-2 text-[0.9375rem] leading-[1.65] text-[var(--text-muted)]">
              {item.body}
            </dd>
          ) : null}
          {item.cta ? (
            <dd className="mt-3">
              <Button cta={item.cta} locale={ctx.locale} variant="link" />
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

/* ── cards ────────────────────────────────────────────────────────────────── */

function CardsBlock({
  block,
  ctx,
  headingId,
  rule,
}: {
  block: Extract<PageBlock, { kind: "cards" }>;
  ctx: Ctx;
  headingId: string;
  rule: boolean;
}) {
  const cols = block.cols ?? 3;
  const grid =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} rule={rule}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={<T>{block.title}</T>}
          lead={block.lead}
          align="start"
        />
      ) : null}

      <ul className={`${block.title ? "mt-14" : ""} mk-grid grid ${grid}`}>
        {block.items.map((item) => (
          <Card key={item.title} as="li" className="flex flex-col">
            {item.feature ? (
              <Chip feature={item.feature} chips={ctx.chips} className="mb-4 self-start" />
            ) : null}
            {/*
             * Same reasoning as the numbered block above: when this grid
             * carries its own title that title is the <h2>, and when it does
             * not — /compare, /resources, /solutions, /whats-new all open
             * straight into a grid — these cards are the first level under
             * the page's <h1>, so <h3> would leave a gap in the outline.
             */}
            <CardTitle as={block.title ? "h3" : "h2"}>{item.title}</CardTitle>
            {item.body ? (
              <p className="mk-body mk-bidi mt-3">{item.body}</p>
            ) : null}

            {item.bullets?.length ? (
              <ul className="mt-5 space-y-2.5">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] size-1 shrink-0 rounded-full bg-[var(--accent)]"
                    />
                    <span className="mk-bidi text-[0.875rem] leading-[1.6] text-[var(--text-muted)]">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {item.note ? (
              <p className="mk-bidi mt-5 border-t border-[var(--hairline)] pt-4 text-[length:var(--fs-eyebrow)] leading-[1.55] text-[var(--text-muted)]">
                {item.note}
              </p>
            ) : null}

            {item.cta ? (
              <div className="mt-6 pt-1">
                <Button cta={item.cta} locale={ctx.locale} variant="link" />
              </div>
            ) : null}
          </Card>
        ))}
      </ul>

      {block.note ? (
        <p className="mk-bidi mk-measure mt-8 text-[length:var(--fs-ui)] leading-[1.65] text-[var(--text-muted)]">
          {block.note}
        </p>
      ) : null}
    </Section>
  );
}

/* ── table ────────────────────────────────────────────────────────────────── */

function CellView({ cell, ctx }: { cell: Cell; ctx: Ctx }) {
  if (typeof cell === "string") {
    return cell ? <span className="mk-bidi">{cell}</span> : <span aria-hidden="true">—</span>;
  }
  // `mk-atomic`, not `mk-bidi`: this is an inline-flex box, which the bidi
  // algorithm cannot see inside whatever `unicode-bidi` it carries, so the
  // cell around it has to take the page's direction rather than guess at one
  // from text it will never find.
  return (
    <span className="mk-atomic inline-flex flex-wrap items-center gap-2">
      {cell.text ? (
        <span className={cell.strong ? "font-medium text-[var(--text)]" : undefined}>
          {cell.text}
        </span>
      ) : null}
      {cell.feature ? <Chip feature={cell.feature} chips={ctx.chips} /> : null}
      {!cell.text && !cell.feature ? <span aria-hidden="true">—</span> : null}
    </span>
  );
}

function TableBlock({
  block,
  ctx,
  headingId,
  rule,
}: {
  block: Extract<PageBlock, { kind: "table" }>;
  ctx: Ctx;
  headingId: string;
  rule: boolean;
}) {
  const rowHeaders = block.rowHeaders ?? true;
  const bodyAlign = block.numeric ? "text-center" : "text-start";

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} rule={rule}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={<T>{block.title}</T>}
          lead={block.lead}
          align="start"
        />
      ) : null}

      {/*
        A scroll region, labelled and focusable.

        Three columns of Arabic prose cannot stack into a phone and cannot be
        truncated without destroying the comparison, so it scrolls sideways.
        `tabIndex={0}` with a role and a name is what makes that reachable
        with a keyboard — a bare `overflow-x-auto` div is a region a keyboard
        user cannot scroll at all.
      */}
      <div
        role="region"
        aria-labelledby={block.title ? headingId : undefined}
        tabIndex={0}
        className={`${block.title ? "mt-12" : ""} overflow-x-auto overscroll-x-contain rounded-[var(--radius-card)] border border-[var(--hairline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
      >
        <table className="w-full min-w-[40rem] border-collapse text-start">
          {block.head?.length ? (
            <thead>
              <tr className="border-b border-[var(--hairline-strong)] bg-[var(--surface-1)]">
                {block.head.map((cell, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-5 py-4 align-bottom text-[length:var(--fs-ui)] font-medium leading-[1.45] text-[var(--text)] ${
                      i === 0 || !block.numeric ? "text-start" : "text-center"
                    }`}
                  >
                    <CellView cell={cell} ctx={ctx} />
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}

          <tbody>
            {block.rows.map((row, r) => (
              <tr
                key={r}
                className="border-b border-[var(--hairline)] last:border-b-0 even:bg-[color-mix(in_oklab,var(--surface-1)_45%,transparent)]"
              >
                {row.map((cell, c) =>
                  c === 0 && rowHeaders ? (
                    <th
                      key={c}
                      scope="row"
                      className="px-5 py-4 text-start align-top text-[0.875rem] font-medium leading-[1.55] text-[var(--text)]"
                    >
                      <CellView cell={cell} ctx={ctx} />
                    </th>
                  ) : (
                    <td
                      key={c}
                      className={`px-5 py-4 align-top text-[0.875rem] leading-[1.6] text-[var(--text-muted)] ${bodyAlign}`}
                    >
                      <CellView cell={cell} ctx={ctx} />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {block.note ? (
        <p className="mk-bidi mk-measure mt-6 text-[length:var(--fs-ui)] leading-[1.65] text-[var(--text-muted)]">
          {block.note}
        </p>
      ) : null}
    </Section>
  );
}

/* ── steps ────────────────────────────────────────────────────────────────── */

function StepsBlock({
  block,
  headingId,
  rule,
}: {
  block: Extract<PageBlock, { kind: "steps" }>;
  headingId: string;
  rule: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} rule={rule}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={<T>{block.title}</T>}
          lead={block.lead}
          align="start"
        />
      ) : null}

      <ol className={`${block.title ? "mt-12" : ""} mk-measure`}>
        {block.items.map((item, i) => (
          <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
            {/* The rail. Drawn on the item rather than behind the list so the
                last step has no tail hanging off the end of it. */}
            {i < block.items.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-9 bottom-0 start-[0.9375rem] w-px bg-[var(--hairline-strong)]"
              />
            ) : null}
            <span
              aria-hidden="true"
              className="relative z-10 grid size-[1.875rem] shrink-0 place-items-center rounded-full border border-[var(--hairline-strong)] bg-[var(--surface-2)] text-[0.75rem] font-medium tabular-nums text-[var(--accent-text)]"
            >
              {i + 1}
            </span>
            <div className="pt-[0.3rem]">
              {item.title ? (
                <p className="mk-bidi text-[0.9375rem] font-medium leading-[1.5] text-[var(--text)]">
                  {item.title}
                </p>
              ) : null}
              <p className={`mk-body mk-bidi ${item.title ? "mt-1.5" : ""}`}>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {block.note ? (
        <p className="mk-bidi mk-measure mt-8 text-[length:var(--fs-ui)] leading-[1.65] text-[var(--text-muted)]">
          {block.note}
        </p>
      ) : null}
    </Section>
  );
}

/* ── callout ──────────────────────────────────────────────────────────────── */

function CalloutBlock({
  block,
  ctx,
  headingId,
  rule,
}: {
  block: Extract<PageBlock, { kind: "callout" }>;
  ctx: Ctx;
  headingId: string;
  rule: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} rule={rule}>
      {/* A warm edge on the reading side rather than a filled panel: it marks
          the paragraph as an aside without turning it into a second page. */}
      <div className="mk-card mk-card-pad border-s-2 border-s-[var(--accent)]">
        {block.feature ? (
          <Chip feature={block.feature} chips={ctx.chips} className="mb-4" />
        ) : null}
        {block.title ? (
          <h2 id={headingId} className="mk-h3 mk-bidi">
            {block.title}
          </h2>
        ) : null}
        <div className={`space-y-4 ${block.title ? "mt-4" : ""}`}>
          {block.body.map((p) => (
            <p key={p} className="mk-body mk-bidi mk-measure">
              {p}
            </p>
          ))}
        </div>
        {block.cta ? (
          <div className="mt-6">
            <Button cta={block.cta} locale={ctx.locale} variant="link" />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/* ── faq ──────────────────────────────────────────────────────────────────── */

function FaqBlock({
  block,
  ctx,
  headingId,
  rule,
}: {
  block: Extract<PageBlock, { kind: "faq" }>;
  ctx: Ctx;
  headingId: string;
  rule: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={headingId} rule={rule}>
      <div className="grid gap-y-10 md:grid-cols-[0.8fr_1.4fr] md:gap-x-16">
        <h2 id={headingId} className="mk-h2 mk-bidi md:sticky md:top-24 md:self-start">
          {block.title ?? ""}
        </h2>

        {/*
          Native <details>, so every answer is in the DOM for a crawler and
          every question opens before any JavaScript arrives. `list-none` and
          the marker rule in globals.css remove the browser's triangle, which
          cannot be positioned sensibly in a mirrored layout.
        */}
        <div className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {block.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5">
                <span className="mk-bidi text-[0.9375rem] font-medium leading-[1.55] text-[var(--text)]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="relative mt-[0.45rem] grid size-4 shrink-0 place-items-center text-[var(--text-muted)]"
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span className="absolute h-3.5 w-px bg-current transition-transform group-open:scale-y-0" />
                </span>
              </summary>
              <div className="pb-6 pe-10">
                {item.feature ? (
                  <Chip feature={item.feature} chips={ctx.chips} className="mb-3" />
                ) : null}
                <p className="mk-body mk-bidi mk-measure">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ── plans ────────────────────────────────────────────────────────────────── */

function PlansBlock({
  block,
  ctx,
  headingId,
  rule,
}: {
  block: Extract<PageBlock, { kind: "plans" }>;
  ctx: Ctx;
  headingId: string;
  rule: boolean;
}) {
  const cols = block.plans.length >= 5 ? "lg:grid-cols-5" : block.plans.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} rule={rule}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={<T>{block.title}</T>}
          lead={block.lead}
          align="start"
        />
      ) : null}

      <ul className={`${block.title ? "mt-14" : ""} grid gap-5 ${cols}`}>
        {block.plans.map((plan) => (
          <Card
            key={plan.name}
            as="li"
            className={`flex flex-col ${
              plan.recommended
                ? // The one selected object in the section, marked with the
                  // neon edge rather than a scale transform: a lifted card in
                  // a row of five clips its neighbours' hover targets and
                  // shifts the row on load.
                  "mk-neon"
                : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <CardTitle as="h3">{plan.name}</CardTitle>
              {plan.recommended ? (
                <span className="mk-bidi shrink-0 rounded-[var(--mk-r-status)] bg-[var(--accent-soft)] px-2.5 py-1 text-[length:var(--fs-eyebrow)] font-medium leading-none text-[var(--accent-on-soft)]">
                  {block.recommendedLabel}
                </span>
              ) : null}
            </div>

            <p className="mk-bidi mt-4 text-[length:var(--fs-d3)] font-medium leading-none tracking-[-0.04em] text-[var(--text)]">
              {plan.price}
              {plan.period ? (
                <span className="mk-bidi ms-1.5 text-[length:var(--fs-ui)] font-medium text-[var(--text-muted)]">
                  {plan.period}
                </span>
              ) : null}
            </p>
            {plan.annual ? (
              <p className="mk-bidi mt-1.5 text-[0.75rem] text-[var(--text-muted)]">
                {plan.annual}
              </p>
            ) : null}
            {plan.who ? (
              <p className="mk-bidi mt-4 text-[length:var(--fs-ui)] leading-[1.6] text-[var(--text-muted)]">
                {plan.who}
              </p>
            ) : null}

            <dl className="mt-6 space-y-3 border-t border-[var(--hairline)] pt-5">
              {plan.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="mk-bidi text-[length:var(--fs-ui)] leading-[1.5] text-[var(--text-muted)]">
                    {row.label}
                  </dt>
                  <dd
                    className={`mk-bidi shrink-0 text-[length:var(--fs-ui)] font-medium ${
                      row.strong ? "text-[var(--accent-text)]" : "text-[var(--text)]"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto pt-7">
              {plan.feature ? (
                <Chip feature={plan.feature} chips={ctx.chips} />
              ) : plan.cta ? (
                <Button
                  cta={plan.cta}
                  locale={ctx.locale}
                  variant={plan.recommended ? "solid" : "outline"}
                  size="sm"
                  arrow={false}
                  className="w-full"
                />
              ) : null}
            </div>
          </Card>
        ))}
      </ul>

      {block.note ? (
        <p className="mk-bidi mk-measure mt-8 text-[length:var(--fs-ui)] leading-[1.65] text-[var(--text-muted)]">
          {block.note}
        </p>
      ) : null}
    </Section>
  );
}

/* ── cta ──────────────────────────────────────────────────────────────────── */

function CtaBlock({
  block,
  ctx,
  headingId,
}: {
  block: Extract<PageBlock, { kind: "cta" }>;
  ctx: Ctx;
  headingId: string;
}) {
  return (
    <section
      id={block.id}
      aria-labelledby={block.title ? headingId : undefined}
      className="relative overflow-hidden pt-[clamp(3.5rem,8vw,6.5rem)] pb-[clamp(4rem,9vw,7rem)]"
    >
      <Glow className="start-1/2 bottom-0 w-[min(60rem,100%)] -translate-x-1/2" />
      <div className="mk-container relative flex flex-col items-center text-center">
        {block.title ? (
          <h2 id={headingId} className="mk-h2 mk-bidi max-w-[40rem]">
            {block.title}
          </h2>
        ) : null}
        {block.lead ? (
          <p className="mk-lead mk-bidi mt-5 max-w-[38rem]">{block.lead}</p>
        ) : null}
        <div className="mt-9">
          <Buttons
            buttons={block.buttons}
            links={block.links}
            locale={ctx.locale}
            align="center"
          />
        </div>
        {block.note ? (
          <p className="mk-bidi mt-5 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{block.note}</p>
        ) : null}
      </div>
    </section>
  );
}

/* ── dispatch ─────────────────────────────────────────────────────────────── */

export function Block({
  block,
  ctx,
  index,
  rule,
}: {
  block: PageBlock;
  ctx: Ctx;
  index: number;
  rule: boolean;
}) {
  const headingId = `blk-${index}`;

  switch (block.kind) {
    case "hero":
      return <HeroBlock block={block} ctx={ctx} headingId={headingId} />;
    case "prose":
      return <ProseBlock block={block} ctx={ctx} headingId={headingId} rule={rule} />;
    case "numbered":
      return <NumberedBlock block={block} ctx={ctx} headingId={headingId} rule={rule} />;
    case "cards":
      return <CardsBlock block={block} ctx={ctx} headingId={headingId} rule={rule} />;
    case "table":
      return <TableBlock block={block} ctx={ctx} headingId={headingId} rule={rule} />;
    case "steps":
      return <StepsBlock block={block} headingId={headingId} rule={rule} />;
    case "callout":
      return <CalloutBlock block={block} ctx={ctx} headingId={headingId} rule={rule} />;
    case "faq":
      return <FaqBlock block={block} ctx={ctx} headingId={headingId} rule={rule} />;
    case "plans":
      return <PlansBlock block={block} ctx={ctx} headingId={headingId} rule={rule} />;
    case "cta":
      return <CtaBlock block={block} ctx={ctx} headingId={headingId} />;
    case "terms":
      return (
        <Section
          id={block.id}
          labelledBy={block.title ? headingId : undefined}
          rule={rule}
        >
          {block.title ? (
            <SectionHead
              id={headingId}
              eyebrow={block.eyebrow}
              title={<T>{block.title}</T>}
              lead={block.lead}
              align="start"
            />
          ) : null}
          <div className={block.title ? "mt-12" : ""}>
            <TermList items={block.items} ctx={ctx} cols={block.cols} />
          </div>
          {block.note ? (
            <p className="mk-bidi mk-measure mt-8 text-[length:var(--fs-ui)] leading-[1.65] text-[var(--text-muted)]">
              {block.note}
            </p>
          ) : null}
        </Section>
      );
    case "signup":
      return (
        <Section id={block.id} labelledBy={block.title ? headingId : undefined} rule={rule}>
          <div className="mk-card mk-card-pad grid gap-x-12 gap-y-7 md:grid-cols-2 md:items-center">
            <div>
              {block.title ? (
                <h2 id={headingId} className="mk-h3 mk-bidi">
                  {block.title}
                </h2>
              ) : null}
              {block.lead ? <p className="mk-body mk-bidi mt-3">{block.lead}</p> : null}
            </div>
            <SignupForm
              placeholder={block.placeholder}
              submit={block.submit}
              note={block.note}
              topic={block.topic}
              locale={ctx.locale}
            />
          </div>
        </Section>
      );
  }
}
