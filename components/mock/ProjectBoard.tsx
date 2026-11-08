import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";

/*
 * The studio board: four client projects, each at a different stage.
 *
 * /solutions/client-projects spends two thousand words on one claim — that
 * you can see where every project stands without opening any of them — and
 * had no picture of it. This is that claim as a screen: four rows, four
 * stages, and a "waiting on" column, which is the one thing a studio owner
 * actually scans for on a Monday morning.
 *
 * The last row is a handed-over project, deliberately. It is still on the
 * board, it is waiting on nobody, and it no longer counts against the plan —
 * which is the argument /solutions/client-handoff makes next door, visible
 * here without a word being spent on it.
 *
 * Markup rather than a screenshot — see BrandHub.tsx.
 */

/*
 * The dot's hue per stage, from the state tokens.
 *
 * Mapped here rather than in `content/mocks.ts` because a colour is not copy:
 * a transcreator has nothing to decide about it and one more chance to break
 * it. `waiting` is the expiring amber rather than a grey, because a project
 * stuck on the client is the one state on this board that costs money.
 */
const TONES = {
  live: "var(--mk-state-info)",
  review: "var(--mk-state-review)",
  waiting: "var(--mk-state-expiring)",
  done: "var(--mk-state-approved)",
} as const;

export function ProjectBoard({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const b = t.board;

  return (
    /*
     * The direction is the product's, not this page's — the same reasoning
     * as ToneResult: this card is the product's own screen rather than a
     * window with furniture around it, so it runs the way the product runs.
     * Client names that are Arabic inside an English board state their own
     * `lang`, which is what a real board would do.
     */
    <div dir={dir} lang={lang} className="mk-card text-start">
      <div className="mk-card-pad flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-4">
        <p className="text-[length:var(--fs-ui)] font-medium text-[var(--text)]">{b.heading}</p>
        <p className="rounded-[var(--mk-r-status)] bg-[var(--surface-2)] px-2.5 py-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          {b.filter}
        </p>
      </div>

      {/*
       * A table, because it is one: four records and four fields, with a
       * header row that names them. A grid of divs would look the same and
       * tell a screen reader nothing about which column a cell is in.
       */}
      <table className="w-full border-collapse text-start">
        <thead>
          <tr>
            {[b.columns.client, b.columns.stage, b.columns.waiting, b.columns.moved].map(
              (head, i) => (
                <th
                  key={head}
                  scope="col"
                  className={`px-5 pt-4 pb-2 text-start text-[length:var(--fs-eyebrow)] font-normal text-[var(--text-muted)] ${
                    i > 1 ? "hidden sm:table-cell" : ""
                  }`}
                >
                  {head}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {b.rows.map((row) => (
            <tr key={row.client} className="border-t border-[var(--hairline)]">
              <th
                scope="row"
                lang={row.clientAr ? "ar" : "en"}
                className="px-5 py-3 text-start text-[0.875rem] font-medium text-[var(--text)]"
              >
                {row.client}
              </th>
              <td className="px-5 py-3 text-[0.875rem] text-[var(--text-muted)]">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-1.5 flex-none rounded-full"
                    style={{ background: TONES[row.tone] }}
                  />
                  {row.stage}
                </span>
              </td>
              <td className="hidden px-5 py-3 text-[0.875rem] text-[var(--text-muted)] sm:table-cell">
                {row.waiting}
              </td>
              <td className="hidden px-5 py-3 text-[length:var(--fs-eyebrow)] text-[var(--text-faint)] sm:table-cell">
                {row.moved}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
