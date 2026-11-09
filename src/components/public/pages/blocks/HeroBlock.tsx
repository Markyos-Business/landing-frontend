import type { PageBlock } from "@/content/pages/types";
import { Chip, Eyebrow, Glow } from "@/components/ui";
import { T, Buttons, AccentedTitle, Note, type Ctx } from "./shared";

/* ── hero ─────────────────────────────────────────────────────────────────── */

export function HeroBlock({
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
