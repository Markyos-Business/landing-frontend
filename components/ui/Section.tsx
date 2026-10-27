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

export function Section({
  id,
  labelledBy,
  children,
  className = "",
  rule = false,
}: {
  id?: string;
  /** The id of the heading that names this section. */
  labelledBy?: string;
  children: ReactNode;
  className?: string;
  /**
   * A line across the top of the section.
   *
   * In the reference these are not decoration and they are not on every
   * section — they fall at exactly eight places, and each one opens a new
   * chapter of the argument: the problem, the studio path, the company path,
   * what holds it together, the AI stance, the roadmap, the price, the
   * founder. Everything between two rules is one movement. Adding a ninth
   * would not make the page tidier, it would tell the reader a new chapter
   * had started where one has not.
   *
   * Drawn on the container's own border-box, which is what makes it 28px
   * wider than the content on each side — see the note in .mk-container.
   */
  rule?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`mk-section ${className}`}>
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
  className = "",
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      className={`mk-bidi mk-eyebrow${accent ? " mk-eyebrow-accent" : ""} ${className}`}
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
      {title}
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
      <div className="flex flex-col items-center text-center">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        {heading}
        {lead ? (
          <p className="mk-lead mk-bidi mt-5 max-w-[37.5rem]">{lead}</p>
        ) : null}
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    );
  }

  if (align === "start") {
    return (
      <>
        {row(
          <>
            {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
            {heading}
            {lead ? <p className="mk-lead mk-bidi mt-5 max-w-[33rem]">{lead}</p> : null}
          </>,
        )}
        {children ? <div className="mt-7">{children}</div> : null}
      </>
    );
  }

  return (
    <div className="grid gap-y-8 md:grid-cols-2 md:gap-x-16">
      <div className="flex flex-col">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        {heading}
        {/* In the two-column head the action goes on the floor of the heading
            column rather than beside it: the facing column is already the
            end edge, and a button out there would land under a paragraph. */}
        {action ? <div className="mt-7 md:mt-auto md:pt-7">{action}</div> : null}
      </div>

      {body?.length ? (
        <div className="space-y-4 self-start md:pt-1.5">
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
 * The row that closes a section, under the picture.
 *
 * The reference's other half of the header row, and the half this site did
 * not have (UI-UX Design Reference/17, 18). Where a section leads with a
 * product visual, the explanation does not sit above it — it sits beneath,
 * as a short title in white, two or three muted lines under that, and the
 * link out on the far edge of the same row: "Run your CMS with an agent …
 * Start with Agents →".
 *
 * The order is the argument. A paragraph above a screenshot is read as
 * instructions for what you are about to see, and most readers skip it to
 * get to the picture; the same paragraph below is read as the caption for
 * something they have already looked at, and they read it. That is why this
 * exists rather than another `lead` on the heading.
 *
 * It also retires the lone button. Three sections ended with a CTA floating
 * in its own 32px row under the grid, which is where a button goes when
 * nobody decided where it went.
 */
export function SectionFoot({
  title,
  body,
  action,
  className = "",
}: {
  title?: ReactNode;
  body?: ReactNode;
  /** The link or button, on the end edge of the row. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10 ${className}`}
    >
      <div className="min-w-0 max-w-[38rem]">
        {title ? (
          <p className="mk-bidi text-[length:var(--fs-lead)] font-medium text-[var(--text)]">
            {title}
          </p>
        ) : null}
        {body ? (
          <p
            className={`mk-bidi text-[length:var(--fs-body)] leading-[1.6] text-[var(--text-muted)]${
              title ? " mt-3" : ""
            }`}
          >
            {body}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * The bloom.
 *
 * Purely decorative, so it is aria-hidden and carries no content. Four places
 * in the reference use it; the sizing and placement differ each time, so they
 * are the caller's, and only the colour and the blur are shared.
 */
export function Glow({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`mk-glow ${className}`} />;
}
