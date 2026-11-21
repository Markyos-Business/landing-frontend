import type { PageBlock } from "@/content/pages/types";
import { Mark } from "@/components/ui";
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
  /*
   * A panel with nothing in it is not a closing ask.
   *
   * `.mk-deep` is a 240px inverted panel built to carry a line, a lead and a
   * decision. Six Arabic pages reached it with `{ kind: "cta", buttons: [...] }`
   * and nothing else -- every one of them had a closing line in English, and
   * `/` is the Arabic edition, so the default site shipped a blue box holding
   * a mark and an orphan button on /platform, /roadmap, /whats-new and three
   * solutions pages. The copy is written now; this is so the shape cannot come
   * back silently.
   *
   * It degrades to the buttons on the page's own ground rather than to
   * nothing: the ask is still the ask, it just stops pretending to be a panel.
   */
  const bare = !block.title && !block.lead;

  if (bare) {
    return (
      <section id={block.id} className="pt-[clamp(2rem,4vw,3rem)] pb-[clamp(4.5rem,10vw,7.5rem)]">
        <div className="mk-container">
          <Buttons
            buttons={block.buttons}
            links={block.links}
            locale={ctx.locale}
            tone="page"
          />
          {block.note ? <Note className="mt-7">{block.note}</Note> : null}
        </div>
      </section>
    );
  }

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
