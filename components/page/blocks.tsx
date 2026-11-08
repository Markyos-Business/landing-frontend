import { Words, wordCount } from "@/components/ui/Words";
import type { CSSProperties, ReactNode } from "react";
import type { SiteCopy } from "@/content/types";
import type { Cell, PageBlock, TermItem } from "@/content/pages/types";
import type { Locale } from "@/lib/i18n/locales";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Glow, Section, SectionHead } from "@/components/ui/Section";
import { Mark } from "@/components/brand/Logo";
import { MOCKS } from "@/components/mock/registry";
import { AudienceTabs } from "./AudienceTabs";
import { SolutionExplorer } from "./SolutionExplorer";
import { BillingSwitch } from "./BillingSwitch";
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
 *   - **Rhythm.** Sections alternate ground and white rather than carrying
 *     their own margins, so a page reads as a sequence instead of a stack of
 *     unrelated boxes. Which section is which is decided once, in PageView.
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
  tone = "page",
}: {
  buttons?: { label: string; href: string }[];
  links?: { label: string; href: string }[];
  locale: Locale;
  /*
   * Passed straight through to each button. The variants are unchanged on the
   * closing panel — first loudest, second equal, the rest signposts — and only
   * the fills invert; see the tone table in `components/ui/Button.tsx`.
   */
  tone?: "page" | "deep";
  align?: "start" | "center";
}) {
  if (!buttons?.length && !links?.length) return null;

  /*
   * Two buttons and nothing else is the studio/company fork — the same choice
   * the homepage opens and closes on — so it gets the same object: one pair,
   * both pills sized to the wider label. See `.mk-doors`. Any other shape
   * (one button, a button plus signposts) stays a wrapping row.
   */
  const doors = buttons?.length === 2 && !links?.length;

  return (
    <div
      className={
        doors
          ? "mk-doors"
          : `flex flex-wrap items-center gap-x-5 gap-y-3 ${
              align === "center" ? "justify-center" : ""
            }`
      }
    >
      {buttons?.map((cta, i) => (
        <Button
          key={cta.href + cta.label}
          cta={cta}
          locale={locale}
          // The first button is the page's one job. A second button of equal
          // weight is the studio/company fork, which genuinely is two equal
          // jobs — anything after that is a signpost and is set as one.
          // In a door pair both are solid: the homepage makes that choice for
          // the same reason, that marking one primary tells half the audience
          // they are the wrong half.
          variant={doors ? "solid" : i === 0 ? "solid" : i === 1 ? "outline" : "link"}
          tone={tone}
        />
      ))}
      {links?.map((cta) => (
        <Button key={cta.href + cta.label} cta={cta} locale={locale} variant="link" tone={tone} />
      ))}
    </div>
  );
}

/*
 * A page headline's closing clause, in blue.
 *
 * The homepage opens on "Your whole brand in one place. / From the first
 * question to the last post." — the subject in ink, the claim in blue — and it
 * is the thing a visitor recognises when they land on any other page. These
 * pages' headlines are written the same way, as two sentences where the second
 * is the payoff: "Built in Arabic. Not translated into it.", "Start free. And
 * pay when you see the result."
 *
 * Split on a sentence terminator with text after it, and only on one: a comma
 * inside a single sentence is a clause boundary too, but accenting from there
 * cuts a sentence in half, and a third of these headlines are one sentence
 * with commas in it. A headline with no terminator — every legal page, "Ten
 * projects, ten clients, one place." — renders unchanged, so there is no
 * headline this can break, only ones it declines to touch.
 */
/*
 * ── The words resolve, which they did not until now ──────────────────────
 *
 * `.mk-words` is this site's kinetic heading and it was on the homepage
 * only. Thirty data-driven pages opened on a headline that was the one
 * thing on the screen which never moved — and that is most of what "the
 * page looks plain" means when the first thing a reader meets is a wall of
 * static type.
 *
 * The accent clause does *not* resolve word by word, and that is forced
 * rather than chosen: `.mk-accent-clause` paints its blue through
 * `background-clip: text` with a transparent colour, so the glyphs
 * themselves paint nothing and fading the words inside it fades nothing at
 * all. It arrives as one phrase instead, placed after the words above it by
 * `--i`, which is what `.mk-word-at` exists for. The same pair the
 * homepage's `Words` and `Accent` have always used.
 */
/*
 * Where the headline hands over to its blue clause.
 *
 * A sentence break first, which is how most of these are written: "ابدأ
 * مجاناً. | وادفع حين ترى النتيجة."
 *
 * Then a comma, which is the case this missed. Eleven of the twenty-five
 * hero titles have no internal sentence break, and three of those are plainly
 * two clauses joined by one — including /solutions' own "من يصنع العلامة،
 * ومن يعيش معها." So the page the brand's most recognisable device was most
 * wanted on rendered its headline in flat ink.
 *
 * The *last* comma, so the blue is the closing phrase rather than everything
 * after the first pause in a three-part line. `c > 0` keeps a leading comma
 * from producing an empty head, and the tail has to be worth colouring.
 *
 * The Latin comma is deliberately not in the set. No English hero exists yet
 * — `/en` for these pages serves the untranslated notice — and when one does,
 * an English enumeration would hand its last item to the accent. A sentence
 * break still works there; this fallback stays Arabic until there is a line
 * to test it against.
 */
function splitTitle(title: string): [string, string] | null {
  const at = title.search(/[.؟?!](?=\s*\S)/u);
  if (at !== -1) return [title.slice(0, at + 1), title.slice(at + 1).trimStart()];

  const c = title.lastIndexOf("،");
  if (c > 0 && c < title.length - 2) {
    return [title.slice(0, c + 1), title.slice(c + 1).trimStart()];
  }
  return null;
}

function AccentedTitle({ title, load = false }: { title: string; load?: boolean }) {
  const split = splitTitle(title);
  if (!split) return <Words load={load}>{title}</Words>;

  const [head, tail] = split;
  return (
    <>
      <Words load={load}>{head}</Words>{" "}
      <span
        className={`mk-accent-clause mk-word-at${load ? " mk-word-at-load" : ""}`}
        style={{ "--i": wordCount(head) } as CSSProperties}
      >
        {tail}
      </span>
    </>
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
      // `overflow-clip` clips the bloom. Without it the glow is wider than
      // the viewport on a phone and the whole document scrolls sideways by
      // about 20px — which reads as a broken page, not as a soft light.
      className="relative overflow-clip pt-[clamp(3rem,7vw,5.5rem)] pb-[clamp(3rem,7vw,5rem)]"
    >
      {/* `.mk-center-x` rather than `start-1/2 -translate-x-1/2`, and no `h-`
          needed now that `.mk-glow` carries a ratio — this pool was 0px tall
          and painting nothing on every one of these pages. */}
      <Glow className="mk-center-x -top-40 w-[min(62rem,110%)]" />
      <div className="mk-seq-load mk-container relative flex flex-col items-center text-center">
        {block.eyebrow ? <Eyebrow className="mb-5">{block.eyebrow}</Eyebrow> : null}
        {block.feature ? (
          <Chip feature={block.feature} chips={ctx.chips} className="mb-5" />
        ) : null}

        <h1 id={headingId} className="mk-load-move mk-display max-w-[52rem]">
          <T>
            {/* `load`: the hero is above the fold, where a scroll-driven
                range has already run out before anybody sees it. */}
            <AccentedTitle title={block.title} load />
          </T>
        </h1>

        {block.lead ? (
          <p className="mk-load-move mk-lead mk-bidi mt-5 max-w-[44rem]">{block.lead}</p>
        ) : null}

        {block.buttons?.length || block.links?.length ? (
          <div className="mt-8">
            <Buttons
              buttons={block.buttons}
              links={block.links}
              locale={ctx.locale}
              align="center"
            />
          </div>
        ) : null}

        {block.note ? <Note className="mt-7">{block.note}</Note> : null}
      </div>
    </section>
  );
}

/*
 * The caveat under a section.
 *
 * Seven blocks carry a `note` and each used to render it as a muted
 * paragraph with its own hand-set margin — four different margins between
 * them, which is how a shared vocabulary drifts. It is one object now; the
 * design is `.mk-note` in globals.css and the reasoning for it is there.
 *
 * The glyph is a sibling of the paragraph rather than a child of it, for the
 * bidi reason given beside the CSS: an inline-flex box inside a <p> is
 * atomic, and a paragraph whose only content is atomic has no strong
 * character to resolve its own direction from.
 */
function Note({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mk-note ${className}`}>
      <span className="mk-note-mark" aria-hidden="true">
        <Icon name="info" size={15} />
      </span>
      <p className="mk-bidi">{children}</p>
    </div>
  );
}

/* ── prose ────────────────────────────────────────────────────────────────── */

function ProseBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "prose" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const align = block.align ?? "split";

  /*
   * A signpost, not a section.
   *
   * Six pages carry `{ kind: "prose", body: [], links: [...] }` — no heading,
   * no copy, one row of links out. Rendered as an ordinary section that is
   * 200px of padding around a single 20px line, and on /platform it sat between
   * a table and the audience switch as 235px of empty band. It belongs to the
   * section above it: the link is where that section's argument goes next.
   *
   * So it loses its top padding and most of its bottom, and PageView does not
   * spend a band on it — see the counter there.
   */
  const signpost = !block.title && !block.body?.length;

  return (
    <Section
      id={block.id}
      labelledBy={block.title ? headingId : undefined}
      white={white}
      className={signpost ? "pt-0 pb-[clamp(2.5rem,5vw,4rem)]" : ""}
    >
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={
            <T>
              <Words>{block.title}</Words>
            </T>
          }
          body={align === "split" ? block.body : undefined}
          lead={align !== "split" ? block.body?.[0] : undefined}
          align={align}
          emphasiseLast={block.emphasiseLast}
        >
          {align !== "split" && block.body && block.body.length > 1 ? (
            /* `mk-seq`: a stacked prose section's paragraphs arrive one after
               another. This is the layout /about's story and half the
               solutions pages use, where the whole body was one reveal. */
            <div className={`mk-seq space-y-4 ${align === "center" ? "text-center" : ""}`}>
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
        <div className="mk-rise mk-seq mk-measure space-y-4">
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
  white,
}: {
  block: Extract<PageBlock, { kind: "numbered" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const ItemHeading = block.title ? "h3" : "h2";

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={
            <T>
              <Words>{block.title}</Words>
            </T>
          }
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
      <ol className={`${block.title ? "mt-11" : ""} mk-seq divide-y divide-[var(--hairline)]`}>
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
              {/* `outline` and not `link`: this is the action belonging to a
                  whole numbered row, sitting under four lines of body, and a
                  plain blue line of text there reads as the last sentence of
                  the paragraph. The variant's own note calls it "what a CTA
                  inside a card wears". */}
              {item.cta ? (
                <div className="pt-1">
                  <Button cta={item.cta} locale={ctx.locale} variant="outline" size="sm" />
                </div>
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
    <dl className={`mk-seq ${grid}`}>
      {items.map((item) => (
        <div key={item.term} className={cols === 1 ? "mt-6 first:mt-0" : undefined}>
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
  white,
}: {
  block: Extract<PageBlock, { kind: "cards" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const cols = block.cols ?? 3;
  const grid =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={
            <T>
              <Words>{block.title}</Words>
            </T>
          }
          lead={block.lead}
          align="start"
        />
      ) : null}

      {/* `mk-seq-pop`, so a grid of cards arrives with depth rather than
          sliding up flat — and `mk-pop-soft`, which is a custom property and
          therefore inherits from here down to each card: these grids run to
          nine dense cards, where the full 3.5% scale reads as a wobble.
          `mk-reach` only where a card leads somewhere, so what answers the
          pointer is always something you can actually press. */}
      <ul className={`${block.title ? "mt-11" : ""} mk-seq-pop mk-pop-soft mk-grid grid ${grid}`}>
        {block.items.map((item) => (
          <Card
            key={item.title}
            as="li"
            className={`flex flex-col${item.cta ? " mk-reach" : ""}`}
          >
            {item.icon ? (
              <span className="mk-card-icon" aria-hidden="true">
                <Icon name={item.icon} size={19} />
              </span>
            ) : null}
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

            {/* `mk-seq` one level down: the bullets inside a card arrive
                after the card does, rather than with it. Only possible since
                `.mk-card` became `overflow: clip` — as a scroll container it
                was the nearest one for everything inside it, so every reveal
                in every card resolved against a box that never scrolls. */}
            {item.bullets?.length ? (
              <ul className="mk-seq mt-4 space-y-2.5">
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
              <p className="mk-bidi mt-4 border-t border-[var(--hairline)] pt-3.5 text-[length:var(--fs-eyebrow)] leading-[1.55] text-[var(--text-muted)]">
                {item.note}
              </p>
            ) : null}

            {item.cta ? (
              <div className="mt-auto pt-5">
                <Button cta={item.cta} locale={ctx.locale} variant="outline" size="sm" />
              </div>
            ) : null}
          </Card>
        ))}
      </ul>

      {block.note ? <Note className="mk-rise mt-7">{block.note}</Note> : null}
    </Section>
  );
}

/* ── table ────────────────────────────────────────────────────────────────── */

function CellView({ cell, ctx }: { cell: Cell; ctx: Ctx }) {
  if (typeof cell === "string") {
    // An empty cell is left empty. It used to print an `aria-hidden` em dash,
    // which meant the accessible rendering was already nothing and only the
    // visual one carried a dash — and dashes came off the page on 6 Nov 2026.
    return cell ? <span className="mk-bidi">{cell}</span> : null;
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
      {/* See the string branch above: an empty cell stays empty. */}
    </span>
  );
}

function TableBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "table" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const rowHeaders = block.rowHeaders ?? true;
  const bodyAlign = block.numeric ? "text-center" : "text-start";

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={
            <T>
              <Words>{block.title}</Words>
            </T>
          }
          lead={block.lead}
          align={block.align ?? "start"}
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
        // The homepage's table shell: a white card lifted off the ground with
        // 10px of its own padding, rather than a bordered box. The rules
        // between rows go with it — the alternating tint separates them.
        className={`${block.title ? "mt-10" : ""} mk-pop mk-pop-soft mk-table-shell overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
      >
        <table className="w-full min-w-[40rem] border-collapse text-start">
          {block.head?.length ? (
            <thead>
              <tr>
                {block.head.map((cell, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-5 py-3 align-bottom text-[length:var(--fs-eyebrow)] font-normal leading-[1.45] text-[var(--text-muted)] ${
                      i === 0 || !block.numeric ? "text-start" : "text-center"
                    }`}
                  >
                    <CellView cell={cell} ctx={ctx} />
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}

          {/* The rows fill in one at a time as the table crosses — see
              `.mk-seq-rows`, and `.mk-table-shell` for the overflow that had
              to change before their timeline could resolve. */}
          <tbody className="mk-seq-rows">
            {block.rows.map((row, r) => (
              <tr
                key={r}
                className="odd:bg-[var(--canvas)]"
              >
                {row.map((cell, c) =>
                  c === 0 && rowHeaders ? (
                    <th
                      key={c}
                      scope="row"
                      className="px-5 py-3 text-start align-top text-[0.9375rem] font-medium leading-[1.55] text-[var(--text)]"
                    >
                      <CellView cell={cell} ctx={ctx} />
                    </th>
                  ) : (
                    <td
                      key={c}
                      className={`px-5 py-3 align-top text-[0.875rem] leading-[1.6] text-[var(--text-muted)] ${bodyAlign}`}
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

      {block.note ? <Note className="mk-rise mt-6">{block.note}</Note> : null}
    </Section>
  );
}

/* ── steps ────────────────────────────────────────────────────────────────── */

function StepsBlock({
  block,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "steps" }>;
  headingId: string;
  white: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={
            <T>
              <Words>{block.title}</Words>
            </T>
          }
          lead={block.lead}
          align="start"
        />
      ) : null}

      <ol className={`${block.title ? "mt-10" : ""} mk-seq mk-measure`}>
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

      {block.note ? <Note className="mk-rise mt-7">{block.note}</Note> : null}
    </Section>
  );
}

/* ── callout ──────────────────────────────────────────────────────────────── */

function CalloutBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "callout" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
      {/* Marked on the reading side rather than filled: it is an aside, not
          a second page. The mark used to be a flat 2px accent rule, which is
          the one thing §1.4 says blue is not — it is light here, so the edge
          falls off down its own length and pools into the corner behind it.
          See `.mk-callout`. */}
      <div className="mk-pop mk-pop-soft mk-card mk-card-pad mk-callout">
        {block.feature ? (
          <Chip feature={block.feature} chips={ctx.chips} className="mb-4" />
        ) : null}
        {block.title ? (
          <h2 id={headingId} className="mk-h3 mk-bidi">
            {block.title}
          </h2>
        ) : null}
        <div className={`space-y-4 ${block.title ? "mt-3" : ""}`}>
          {block.body.map((p) => (
            <p key={p} className="mk-body mk-bidi mk-measure">
              {p}
            </p>
          ))}
        </div>
        {block.cta ? (
          <div className="mt-6">
            <Button cta={block.cta} locale={ctx.locale} variant="outline" size="sm" />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/* ── showcase ─────────────────────────────────────────────────────────────── */

/*
 * The feature, as it looks in the product.
 *
 * The head is centred under a bracketed label and the picture sits in a
 * lifted frame over a pool of the brand's light — the reference's rhythm,
 * built out of this site's own parts rather than imported from it: the
 * eyebrow is `Eyebrow`, the two-tone heading is `AccentedTitle` (the same
 * split the heroes already use), the light is `Glow`, and the picture is a
 * component that was already written.
 *
 * Centred, where almost everything else on these pages is start-aligned,
 * and that is the point of it: this is the one section of a 7,000px page
 * that is a demonstration rather than an argument, and it should not look
 * like the eight sections of prose around it.
 */
function ShowcaseBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "showcase" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const Mock = MOCKS[block.mock];

  return (
    <Section id={block.id} labelledBy={headingId} white={white}>
      <div className="mk-rise flex flex-col items-center text-center">
        {block.eyebrow ? (
          <Eyebrow bracket className="mb-4">
            {block.eyebrow}
          </Eyebrow>
        ) : null}
        <h2 id={headingId} className="mk-h2 mk-bidi max-w-[26ch]">
          <AccentedTitle title={block.title} />
        </h2>
        {block.lead ? <p className="mk-lead mk-bidi mt-4 max-w-[40rem]">{block.lead}</p> : null}
      </div>

      {/* `.mk-pop` on the figure and not on the mock: the pop animates
          `scale`, and a scaled card re-rasterises every hairline inside it
          while it runs. On the figure the shadow and the pool come with it
          and the type inside stays on the pixel grid. */}
      <figure className="mk-showcase mk-showcase-measure mk-pop mt-10">
        <Glow className="mk-center-x -top-20 w-[min(44rem,112%)]" />
        <div className="relative">
          <Mock locale={ctx.locale} />
        </div>
        {block.caption ? (
          <figcaption className="mk-bidi mt-5 text-center text-[length:var(--fs-eyebrow)] leading-[1.6] text-[var(--text-muted)]">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    </Section>
  );
}

/* ── web ──────────────────────────────────────────────────────────────────── */

/*
 * The choice, as a picture. The block's note in `content/pages/types.ts`
 * says why it is boxes rather than a drawing and why it is aria-hidden.
 *
 * The motion is the page's own: the three tiles arrive with depth, the rule
 * under them draws itself from the reading edge as the section crosses, and
 * the nine chips cascade. Three classes, no JavaScript, and all of it dies
 * cleanly on a browser without `animation-timeline` — the one that matters
 * is `.mk-draw`, whose note explains why a missing divider is worse than a
 * missing reveal.
 */
function WebBlock({ block }: { block: Extract<PageBlock, { kind: "web" }> }) {
  return (
    <section id={block.id} className="mk-web-section">
      <div className="mk-container">
        <div className="mk-web" aria-hidden="true">
          <ul className="mk-web-row mk-seq-pop">
            {block.from.map((node) => (
              <li key={node.label} className="mk-web-node">
                <span className="mk-web-tile">
                  <span className="mk-web-tile-icon">
                    <Icon name={node.icon} size={16} />
                  </span>
                  {node.label}
                </span>
                <span className="mk-web-stub" />
              </li>
            ))}
          </ul>

          <div className="mk-web-rail">
            <span className="mk-web-line mk-draw" />
            <span className="mk-web-hub">
              <Mark size={18} />
            </span>
            <span className="mk-web-line mk-draw" />
          </div>

          <ul className="mk-web-row mk-web-chips mk-seq">
            {block.to.map((label) => (
              <li key={label} className="mk-web-node">
                <span className="mk-web-stub" />
                <span className="mk-web-chip">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── explorer ─────────────────────────────────────────────────────────────── */

/*
 * The hub's nine solutions, as a control.
 *
 * All the thinking is in `SolutionExplorer.tsx` and in the block's note in
 * `content/pages/types.ts`. What is here is the server half: the nine
 * panels are built on this side — heading, line, the product view, the way
 * out — and handed over as a prop, so none of the mock markup crosses into
 * the client bundle.
 */
function ExplorerBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "explorer" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={headingId} white={white}>
      <SectionHead
        id={headingId}
        eyebrow={block.eyebrow}
        title={
          <T>
            <Words>{block.title}</Words>
          </T>
        }
        lead={block.lead}
        align="start"
      />

      <div className="mt-10">
        <SolutionExplorer
          label={block.label}
          tabs={block.items.map((item) => ({
            title: item.title,
            audience: item.audience,
            icon: <Icon name={item.icon} size={17} />,
          }))}
          panels={block.items.map((item) => {
            const Mock = MOCKS[item.mock];
            return (
              <div key={item.title} className="mk-explorer-panel">
                <p className="mk-h3 mk-bidi">{item.title}</p>
                <p className="mk-body mk-bidi mk-measure mt-2">{item.line}</p>
                {/* The picture sits on the panel's own ground rather than in
                    a second frame: every mock already is a card, and a card
                    inside a card is two edges 20px apart. */}
                <div className="mk-explorer-shot mt-6">
                  <Mock locale={ctx.locale} />
                </div>
                <div className="mt-6">
                  <Button cta={item.cta} locale={ctx.locale} variant="outline" size="sm" />
                </div>
              </div>
            );
          })}
        />
      </div>
    </Section>
  );
}

/* ── faq ──────────────────────────────────────────────────────────────────── */

function FaqBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "faq" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={headingId} white={white}>
      <div className="grid gap-y-10 md:grid-cols-[0.8fr_1.4fr] md:gap-x-16">
        <h2 id={headingId} className="mk-rise mk-h2 mk-bidi md:sticky md:top-24 md:self-start">
          {block.title ?? ""}
        </h2>

        {/*
          Native <details>, so every answer is in the DOM for a crawler and
          every question opens before any JavaScript arrives. `list-none` and
          the marker rule in globals.css remove the browser's triangle, which
          cannot be positioned sensibly in a mirrored layout.
        */}
        <div className="mk-seq divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {block.items.map((item) => (
            <details key={item.q} className="group">
              {/* The row answers the pointer before it is pressed: a question
                  that only reacts on click gives the reader nothing to tell
                  them it is a control. Ground and ink, no movement — this is
                  a row of text, not a card. */}
              <summary className="mk-faq-summary flex cursor-pointer list-none items-start justify-between gap-6 py-5">
                <span className="mk-bidi text-[0.9375rem] font-medium leading-[1.55] text-[var(--text)]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="relative mt-[0.45rem] grid size-4 shrink-0 place-items-center text-[var(--text-muted)] transition-colors group-hover:text-[var(--mk-blue-deep)] group-open:text-[var(--mk-blue-deep)]"
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
  white,
}: {
  block: Extract<PageBlock, { kind: "plans" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const cols = block.plans.length >= 5 ? "lg:grid-cols-5" : block.plans.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  const align = block.align ?? "start";

  /*
   * Only offer the switch when at least one plan answers it.
   *
   * A block of free and contract plans has no yearly rate to show, and a
   * control that redraws nothing is worse than no control: it reads as
   * broken. The content file still only has to supply `billing` once.
   */
  const billing = block.billing && block.plans.some((plan) => plan.annual)
    ? block.billing
    : null;

  const head = block.title ? (
    <SectionHead
      id={headingId}
      eyebrow={block.eyebrow}
      title={
        <T>
          <Words>{block.title}</Words>
        </T>
      }
      lead={block.lead}
      /* Inside the switch the head is already in a centred column, so it
         lays itself out at the start edge of that column rather than
         centring twice — which would narrow the measure to the shorter of
         the two. */
      align={billing && align === "center" ? "start" : align}
    />
  ) : null;

  const grid = (
    <ul
      className={`${billing ? "mt-10" : block.title ? "mt-11" : ""} mk-seq-pop mk-pop-soft grid gap-5 ${cols}`}
    >
        {block.plans.map((plan) => (
          <Card
            key={plan.name}
            as="li"
            className={`flex flex-col ${plan.cta ? "mk-reach " : ""}${
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

            {/*
             * The amount never breaks, and it is sized by the card.
             *
             * Two bugs, one cause: a price is set at 28px whatever the card is
             * wide, and the grid is three, four or five cards across depending
             * on how many plans there are. At four, each card has 200px of
             * content and "149 SAR a month" is wider — so it wrapped between
             * the number and its currency and put "a month" alongside "SAR" on
             * the second line. Holding the amount together with `nowrap` fixed
             * that and replaced it with something worse: at five plans the card
             * has 146px, and "from 299 SAR" simply hung 60px out of the card
             * and 60px out of the page's measure.
             *
             * A container query is the honest instrument here, because the
             * constraint is the card's width and not the viewport's: at 1024px
             * the same five cards have stacked two-up and have room to spare.
             * The card declares itself the container and the price steps down
             * when the card is narrow, so it fits on one line at every count
             * and every width.
             */}
            {/* Both amounts render; `data-bill` says which cycle each one
                belongs to and the switch above shows one of them. A plan with
                no annual rate has no `data-bill` at all, so it is shown in
                both — see BillingSwitch, and `[data-billing]` in globals.css. */}
            <p className="@container/plan mt-4 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span
                data-bill={plan.annual ? "monthly" : undefined}
                className="mk-bidi whitespace-nowrap text-[1.25rem] font-medium leading-none tracking-[-0.04em] text-[var(--text)] @[10rem]/plan:text-[1.5rem] @[17rem]/plan:text-[length:var(--fs-d3)]"
              >
                {plan.price}
              </span>
              {plan.annual ? (
                <span
                  data-bill="annual"
                  className="mk-bidi whitespace-nowrap text-[1.25rem] font-medium leading-none tracking-[-0.04em] text-[var(--text)] @[10rem]/plan:text-[1.5rem] @[17rem]/plan:text-[length:var(--fs-d3)]"
                >
                  {plan.annual.price}
                </span>
              ) : null}
              {plan.period ? (
                <span className="mk-bidi whitespace-nowrap text-[length:var(--fs-ui)] font-medium leading-none text-[var(--text-muted)]">
                  {plan.period}
                </span>
              ) : null}
            </p>
            {plan.annual?.note ? (
              <p
                data-bill="annual"
                className="mk-bidi mt-1.5 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]"
              >
                {plan.annual.note}
              </p>
            ) : null}
            {plan.who ? (
              <p className="mk-bidi mt-3 text-[length:var(--fs-ui)] leading-[1.6] text-[var(--text-muted)]">
                {plan.who}
              </p>
            ) : null}

            <dl className="mt-5 space-y-3 border-t border-[var(--hairline)] pt-4">
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

            <div className="mt-auto pt-6">
              {plan.feature ? (
                <Chip feature={plan.feature} chips={ctx.chips} />
              ) : plan.cta ? (
                <Button
                  cta={plan.cta}
                  locale={ctx.locale}
                  variant={plan.recommended ? "solid" : "outline"}
                  size="sm"
                  block
                />
              ) : null}
            </div>
          </Card>
        ))}
    </ul>
  );

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
      {billing ? (
        <BillingSwitch
          label={billing.label}
          monthly={billing.monthly}
          annual={billing.annual}
          centred={align === "center"}
          head={head}
        >
          {grid}
        </BillingSwitch>
      ) : (
        <>
          {head}
          {grid}
        </>
      )}

      {block.note ? <Note className="mk-rise mt-7">{block.note}</Note> : null}
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
      className="pt-[clamp(3rem,7vw,5.5rem)] pb-[clamp(4.5rem,10vw,7.5rem)]"
    >
      <div className="mk-container">
        {/*
         * The closing ask, as the homepage closes: `.mk-deep`, the one panel
         * where the ink inverts. It replaces a `Glow` plus `.mk-horizon` —
         * two blue washes the colour of the ground, which is how nine pages
         * came to end by dissolving at the moment they ask for the decision.
         *
         * Start-aligned rather than centred, and that is what the panel is
         * for: the light lives on the far side of it, so centred copy would
         * sit in the middle of the light instead of beside it.
         */}
        <div className="mk-pop mk-deep">
          <span aria-hidden="true" className="mk-deep-wave mk-deep-wave-a" />
          <span aria-hidden="true" className="mk-deep-wave mk-deep-wave-b" />

          <div className="relative">
            {/* The page closes on the mark, as the homepage does. The brand
                component paints `currentColor`. */}
            <span aria-hidden="true" className="mb-6 block text-[var(--mk-on-deep)]">
              <Mark size={28} />
            </span>

            {block.title ? (
              <h2
                id={headingId}
                className="mk-h2 mk-bidi max-w-[34rem] text-[var(--mk-on-deep)]"
              >
                {block.title}
              </h2>
            ) : null}
            {block.lead ? (
              <p className="mk-lead mk-bidi mt-4 max-w-[32rem] text-[var(--mk-on-deep-soft)]">
                {block.lead}
              </p>
            ) : null}
            <div className="mt-8">
              <Buttons
                buttons={block.buttons}
                links={block.links}
                locale={ctx.locale}
                tone="deep"
              />
            </div>
            {block.note ? <Note className="mt-7">{block.note}</Note> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── dispatch ─────────────────────────────────────────────────────────────── */

export function Block({
  block,
  ctx,
  index,
  white,
}: {
  block: PageBlock;
  ctx: Ctx;
  index: number;
  /** Paint this section on the white band. See PageView's band counter. */
  white: boolean;
}) {
  const headingId = `blk-${index}`;

  switch (block.kind) {
    case "hero":
      return <HeroBlock block={block} ctx={ctx} headingId={headingId} />;
    case "prose":
      return <ProseBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "numbered":
      return <NumberedBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "cards":
      return <CardsBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "table":
      return <TableBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "steps":
      return <StepsBlock block={block} headingId={headingId} white={white} />;
    case "callout":
      return <CalloutBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "showcase":
      return <ShowcaseBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "explorer":
      return <ExplorerBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "web":
      return <WebBlock block={block} />;
    case "faq":
      return <FaqBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "plans":
      return <PlansBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "cta":
      return <CtaBlock block={block} ctx={ctx} headingId={headingId} />;
    case "audience":
      return (
        <AudienceTabs
          id={block.id}
          headingId={block.title ? headingId : undefined}
          label={block.label}
          white={white}
          head={
            block.title ? (
              <>
                {block.eyebrow ? <Eyebrow className="mb-4">{block.eyebrow}</Eyebrow> : null}
                <h2 id={headingId} className="mk-h2 mk-bidi">
                  <T>{block.title}</T>
                </h2>
                {block.lead ? (
                  <p className="mk-lead mk-bidi mt-4 max-w-[37.5rem]">{block.lead}</p>
                ) : null}
              </>
            ) : null
          }
          options={block.options.map((option, o) => ({
            id: option.id,
            label: option.label,
            content: option.blocks.map((inner, i) => (
              /*
               * `white` is the switch's own, for every section in every panel.
               * Alternating inside a panel would mean the page's rhythm changed
               * with whichever panel was open, and two panels of different
               * lengths would hand the section after the group a different
               * colour each way.
               *
               * The index has to separate the panels as well as the blocks:
               * `index * 100 + i` gave both panels the same numbers, so every
               * heading inside them shared an id with its opposite number and
               * /pricing shipped two `#blk-101`s. An id is a page-wide name —
               * `aria-labelledby` resolves to the first match, which here was
               * in the hidden panel.
               */
              <Block
                key={i}
                block={inner}
                ctx={ctx}
                index={(index + 1) * 1000 + o * 100 + i}
                white={white}
              />
            )),
          }))}
        />
      );
    case "terms":
      return (
        <Section
          id={block.id}
          labelledBy={block.title ? headingId : undefined}
          white={white}
        >
          {block.title ? (
            <SectionHead
              id={headingId}
              eyebrow={block.eyebrow}
              title={
            <T>
              <Words>{block.title}</Words>
            </T>
          }
              lead={block.lead}
              align="start"
            />
          ) : null}
          <div className={block.title ? "mt-10" : ""}>
            <TermList items={block.items} ctx={ctx} cols={block.cols} />
          </div>
          {block.note ? (
            <Note className="mk-rise mt-7">{block.note}</Note>
          ) : null}
        </Section>
      );
    case "signup":
      return (
        <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
          <div className="mk-pop mk-card mk-card-pad grid gap-x-12 gap-y-7 md:grid-cols-2 md:items-center">
            <div>
              {block.title ? (
                <h2 id={headingId} className="mk-h3 mk-bidi">
                  {block.title}
                </h2>
              ) : null}
              {block.lead ? <p className="mk-body mk-bidi mt-2.5">{block.lead}</p> : null}
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
