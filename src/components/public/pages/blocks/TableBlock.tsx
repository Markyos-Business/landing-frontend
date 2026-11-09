import { Words, Chip, Section, SectionHead } from "@/components/ui";
import type { Cell, PageBlock } from "@/content/pages/types";
import { T, Note, type Ctx } from "./shared";

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

export function TableBlock({
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
