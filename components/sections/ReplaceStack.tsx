import type { ReplaceStackCopy } from "@/content/types";
import { Section } from "@/components/ui/Section";

/*
 * What Markyos replaces.
 *
 * A real <table>, not a grid of divs. It has a header row, row headers and
 * cells that only mean anything in relation to both — "a PDF that gets opened
 * once" is an answer to "guidelines", and a screen reader can only say so if
 * the markup says so. `scope` on every header is what makes that work.
 *
 * The table is the only element on the page that has to survive a phone
 * without becoming something else, because three columns of prose cannot
 * stack. It scrolls sideways instead, with the job column wide enough to keep
 * its row readable.
 */

export function ReplaceStack({ copy }: { copy: ReplaceStackCopy }) {
  return (
    <Section id="replace-stack" labelledBy="replace-stack-heading">
      <h2 id="replace-stack-heading" className="mk-h2 max-w-[20ch]">
        {copy.headline}
      </h2>

      {/*
       * A scrollable region, not just a div with overflow.
       *
       * Three columns of prose cannot stack, so on a phone this scrolls
       * sideways — which means the third column, the one that says what
       * Markyos does instead, starts off-screen. Scrolling it with a pointer
       * is obvious; scrolling it with a keyboard is not, unless the region is
       * focusable and named. `tabindex={0}` plus a role and a label is what
       * makes WCAG 2.1.1 hold for content that can only be reached by
       * scrolling (and what stops a screen reader announcing an unlabelled
       * scroll container).
       */}
      <div
        role="region"
        aria-labelledby="replace-stack-heading"
        tabIndex={0}
        className="mk-card mt-12 overflow-x-auto"
      >
        <table className="w-full min-w-[42rem] border-collapse text-start">
          <thead>
            {/*
             * The third column is lit.
             *
             * A comparison table drawn in one grey says "here are three
             * columns"; this one is making an argument, and the argument is
             * the third column. A 14% blue tint and a lit start edge is how
             * the rest of the page marks the one object a section is about
             * (§8), and it costs no copy to say it — the table already says
             * it in words, this just stops the reader having to find out by
             * reading all nine cells.
             *
             * The edge is `border-inline-start`, so in Arabic it draws on the
             * column's right and the light stays on the leading edge.
             */}
            <tr className="bg-[var(--surface-2)]">
              {[copy.columns.job, copy.columns.usually, copy.columns.markyos].map(
                (heading, i) => (
                  <th
                    key={heading}
                    scope="col"
                    className={`mk-bidi mk-eyebrow px-6 py-3.5 text-start font-medium ${
                      i === 2
                        ? "border-s border-s-[var(--mk-blue)] bg-[var(--accent-soft)] text-[var(--text)]"
                        : ""
                    }`}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hairline)]">
            {copy.rows.map((row) => (
              <tr key={row.job} className="border-t border-[var(--hairline)]">
                <th
                  scope="row"
                  className="mk-bidi px-6 py-4 text-start align-top text-[length:var(--fs-ui)] font-medium text-[var(--text)]"
                >
                  {row.job}
                </th>
                <td className="mk-bidi px-6 py-4 align-top text-[length:var(--fs-ui)] leading-[1.5] text-[var(--text-muted)]">
                  {row.usually}
                </td>
                <td className="mk-bidi border-s border-s-[var(--mk-blue)] bg-[var(--accent-soft)] px-6 py-4 align-top text-[length:var(--fs-ui)] leading-[1.5] text-[var(--text)]">
                  {row.markyos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mk-bidi mt-10 text-[length:var(--fs-lead)] font-medium text-[var(--text)]">
        {copy.line}
      </p>
    </Section>
  );
}
