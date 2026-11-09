/*
 * A top-level page section, and the heading block that opens one.
 *
 * Exists so the page's vertical rhythm is set in one place and so every
 * section that has a heading is announced as a landmark with that heading as
 * its name — which is how a screen-reader user skims a page this long.
 *
 * `id` is not optional for a section the page links to: the hero's "see how it
 * works" and the nav's in-page jumps depend on them.
 */

import type { ReactNode } from "react";
import { Words } from "../primitives/Words";

export function Section({
  id,
  labelledBy,
  children,
  className = "",
  rule = false,
  white = false,
}: {
  id?: string;
  /** The id of the heading that names this section. */
  labelledBy?: string;
  children: ReactNode;
  className?: string;
  /**
   * A line across the top of the section.
   *
   * Superseded by `white`, and kept only for a caller that wants a hairline
   * *inside* one band. The black site separated its chapters with eight rules;
   * the light page separates every section by alternating ground and white,
   * which says the same thing at a glance and does not ask a reader to notice
   * a 1px line 200px above the heading it belongs to.
   *
   * Drawn on the container's own border-box, which is what makes it 28px
   * wider than the content on each side — see the note in .mk-container.
   */
  rule?: boolean;
  /**
   * The white band.
   *
   * Every other section, counting from the first one after the hero, which is
   * how the homepage alternates for all fourteen of its sections. See
   * `.mk-band` in tailwind/ for why the alternation is doing the work the
   * rules used to.
   */
  white?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`mk-section${white ? " mk-band" : ""} ${className}`}
    >
      <div className={`mk-container${rule ? " mk-rule pt-[clamp(3.5rem,8vw,7rem)]" : ""}`}>
        {children}
      </div>
    </section>
  );
}

/**
 * The small label above a section headline.
 *
 * Not a heading element: it labels the heading below it rather than
 * introducing a level of its own, and promoting it to an <h3> above an <h2>
 * would put the document outline out of order.
 *
 * Two forms, both from the reference. `accent` is the sentence-case amber
 * label that opens a section ("For studios"). The default is the uppercase,
 * tracked-out grey one used inside a card ("STEP 2 · ANALYZE").
 */
export function Eyebrow({
  children,
  accent = true,
  bracket = false,
  className = "",
}: {
  children: ReactNode;
  accent?: boolean;
  /**
   * Close the label off with brackets — `[ الحلول ]`.
   *
   * What the reference puts over a centred section heading, and what the
   * `showcase` block uses. Two words of grey above a heading read as the
   * heading's own first line; the same two words bracketed read as a tab.
   * The punctuation is drawn by CSS, not typed into the string — see
   * `.mk-eyebrow-bracket`.
   */
  bracket?: boolean;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      className={`mk-bidi mk-eyebrow${accent ? " mk-eyebrow-accent" : ""}${
        bracket ? " mk-eyebrow-bracket" : ""
      } ${className}`}
    >
      {children}
    </p>
  );
}

/**
 * The heading block that opens a section.
 *
 * Three layouts, and the choice between them is the reference's, not a
 * preference:
 *
 *   split   heading on one side, the explaining paragraphs on the other.
 *           The page's default, and what gives it its wide, two-column feel.
 *   start   heading and a single short lead stacked at the start edge. Used
 *           where a long run of cards follows and a second column above them
 *           would fight the grid.
 *   center  heading and lead centred on a narrow measure. Reserved for the
 *           four moments the page stops arguing and states something.
 *
 * All three carry `.mk-rise`, so every section on every data-driven page
 * opens with its heading block arriving — one class here instead of one per
 * caller. The grids and lists *below* a head are marked where they are built
 * (`page/blocks/`, the section components); see the motion block in
 * tailwind/ for the two classes and where they may not go.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  body,
  lead,
  align = "split",
  size = "md",
  emphasiseLast = false,
  as: Tag = "h2",
  children,
  action,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  /** One paragraph per entry. Used by `split`. */
  body?: string[];
  /** A single short paragraph under the heading. Used by `start` and `center`. */
  lead?: ReactNode;
  align?: "split" | "start" | "center";
  size?: "md" | "lg";
  /**
   * Set the closing paragraph in full white.
   *
   * The reference does this wherever a body block ends on the line the
   * section is actually making — "Nobody did anything wrong. The brand just
   * had nowhere to live." It is the argument's landing, so it is given the
   * emphasis level the rest of the paragraph does not have.
   */
  emphasiseLast?: boolean;
  as?: "h1" | "h2";
  /** A CTA or control that belongs to the heading block. */
  children?: ReactNode;
  /**
   * The section's action, on the heading's own row at the far edge.
   *
   * The reference's section header is a row, not a stack: the headline sits
   * at the start edge and one button sits at the end edge, sharing a
   * baseline (UI-UX Design Reference/15, 23, 25, 26 — "Agents that work
   * alongside you" / Start with agents, "Shipped with Framer" / See Framer
   * sites). It never puts a lone button under the grid.
   *
   * That is not only tidier. A button below a grid of cards is read as
   * belonging to the last card; on the heading's row it is read as belonging
   * to the section, which is what it does. `children` still stacks beneath
   * the heading, for the controls that genuinely are part of it — the
   * pricing toggle.
   */
  action?: ReactNode;
}) {
  const heading = (
    <Tag id={id} className={size === "lg" ? "mk-h2-lg" : "mk-h2"}>
      {/* A plain string gets its words resolved one at a time as the heading
          arrives. Anything else — a <T>, a split clause, markup — is left
          alone: <Words> splits text and cannot split an element. */}
      {typeof title === "string" ? <Words>{title}</Words> : title}
    </Tag>
  );

  /*
   * `items-end` rather than a baseline: the heading runs to two or three
   * lines and the action is one line, so aligning their baselines would hang
   * the button off the headline's *first* line, a third of the way up the
   * block. Sitting both on the floor of the row is what the reference does
   * and the only alignment that survives a heading growing a line in Arabic.
   */
  const row = (content: ReactNode) =>
    action ? (
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="min-w-0">{content}</div>
        <div className="shrink-0">{action}</div>
      </div>
    ) : (
      content
    );

  if (align === "center") {
    return (
      <div className="mk-rise flex flex-col items-center text-center">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        {heading}
        {lead ? (
          <p className="mk-lead mk-bidi mt-4 max-w-[37.5rem]">{lead}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    );
  }

  if (align === "start") {
    return (
      <div className="mk-rise">
        {row(
          <>
            {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
            {heading}
            {lead ? <p className="mk-lead mk-bidi mt-4 max-w-[33rem]">{lead}</p> : null}
          </>,
        )}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    );
  }

  return (
    <div className="mk-seq grid gap-y-6 md:grid-cols-2 md:gap-x-16">
      <div className="mk-slide-start flex flex-col">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        {heading}
        {/* In the two-column head the action goes on the floor of the heading
            column rather than beside it: the facing column is already the
            end edge, and a button out there would land under a paragraph. */}
        {action ? <div className="mt-6 md:mt-auto md:pt-6">{action}</div> : null}
      </div>

      {body?.length ? (
        /* `mk-seq`: the explaining paragraphs arrive one after another as the
           column slides in from its own edge, rather than the whole block
           appearing at once. This is the page's default head layout, so it is
           the single highest-leverage place on the site to put a cascade —
           and the `:has()` rules in tailwind/ mean the column then carries
           only the movement while the paragraphs carry the fade. */
        <div className="mk-slide-end mk-seq space-y-4 self-start md:pt-1.5">
          {body.map((paragraph, i) => {
            const last = emphasiseLast && i === body.length - 1;
            return (
              <p
                key={paragraph}
                className={`mk-bidi text-[length:var(--fs-lead)] leading-[1.6] ${
                  last ? "font-medium text-[var(--text)]" : "text-[var(--text-muted)]"
                }`}
              >
                {paragraph}
              </p>
            );
          })}
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * The bloom.
 *
 * Purely decorative, so it is aria-hidden and carries no content. The sizing
 * and placement differ at each use, so they are the caller's, and only the
 * light itself is shared — see `.mk-glow`, which now also carries a default
 * ratio, because four callers passed a width and no height and so painted a
 * 0px-tall pool on every data-driven page since the light rebuild.
 *
 * To centre one on the inline axis, use `.mk-center-x` rather than
 * `start-1/2 -translate-x-1/2`: the second half of that pair is physical and
 * does not flip with the locale.
 */
export function Glow({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`mk-glow ${className}`} />;
}
