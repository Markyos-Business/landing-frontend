import type { PageBlock } from "@/content/pages/types";
import { Chip } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import type { Ctx } from "./shared";

/* ── faq ──────────────────────────────────────────────────────────────────── */

export function FaqBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "faq" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={headingId} white={white}>
      <div className="grid gap-y-10 md:grid-cols-[0.8fr_1.4fr] md:gap-x-16">
        <h2 id={headingId} className="mk-rise mk-h2 mk-bidi md:sticky md:top-24 md:self-start">
          {block.title ?? ""}
        </h2>

        {/*
          Native <details>, so every answer is in the DOM for a crawler and
          every question opens before any JavaScript arrives. `list-none` and
          the marker rule in globals.css remove the browser's triangle, which
          cannot be positioned sensibly in a mirrored layout.
        */}
        <div className="mk-seq divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {block.items.map((item) => (
            <details key={item.q} className="group">
              {/* The row answers the pointer before it is pressed: a question
                  that only reacts on click gives the reader nothing to tell
                  them it is a control. Ground and ink, no movement — this is
                  a row of text, not a card. */}
              <summary className="mk-faq-summary flex cursor-pointer list-none items-start justify-between gap-6 py-5">
                <span className="mk-bidi text-[0.9375rem] font-medium leading-[1.55] text-[var(--text)]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="relative mt-[0.45rem] grid size-4 shrink-0 place-items-center text-[var(--text-muted)] transition-colors group-hover:text-[var(--mk-blue-deep)] group-open:text-[var(--mk-blue-deep)]"
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span className="absolute h-3.5 w-px bg-current transition-transform group-open:scale-y-0" />
                </span>
              </summary>
              <div className="pb-6 pe-10">
                {item.feature ? (
                  <Chip feature={item.feature} chips={ctx.chips} className="mb-3" />
                ) : null}
                <p className="mk-body mk-bidi mk-measure">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
