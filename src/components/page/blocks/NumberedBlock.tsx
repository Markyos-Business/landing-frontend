import { Words } from "@/components/ui/Words";
import type { PageBlock } from "@/content/pages/types";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Section, SectionHead } from "@/components/ui/Section";
import { T, type Ctx } from "./shared";

/* ── numbered ─────────────────────────────────────────────────────────────── */

export function NumberedBlock({
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
