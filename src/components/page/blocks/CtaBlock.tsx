import type { PageBlock } from "@/content/pages/types";
import { Mark } from "@/components/brand/Logo";
import { Buttons, Note, type Ctx } from "./shared";

/* ── cta ──────────────────────────────────────────────────────────────────── */

export function CtaBlock({
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
