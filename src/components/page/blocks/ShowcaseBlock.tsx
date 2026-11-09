import type { PageBlock } from "@/content/pages/types";
import { Eyebrow, Glow, Section } from "@/components/ui/Section";
import { MOCKS } from "@/components/mock/registry";
import { AccentedTitle, type Ctx } from "./shared";

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
export function ShowcaseBlock({
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
