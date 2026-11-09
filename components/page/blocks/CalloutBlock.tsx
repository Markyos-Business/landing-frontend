import type { PageBlock } from "@/content/pages/types";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import type { Ctx } from "./shared";

/* ── callout ──────────────────────────────────────────────────────────────── */

export function CalloutBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "callout" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
      {/* Marked on the reading side rather than filled: it is an aside, not
          a second page. The mark used to be a flat 2px accent rule, which is
          the one thing §1.4 says blue is not — it is light here, so the edge
          falls off down its own length and pools into the corner behind it.
          See `.mk-callout`. */}
      <div className="mk-pop mk-pop-soft mk-card mk-card-pad mk-callout">
        {block.feature ? (
          <Chip feature={block.feature} chips={ctx.chips} className="mb-4" />
        ) : null}
        {block.title ? (
          <h2 id={headingId} className="mk-h3 mk-bidi">
            {block.title}
          </h2>
        ) : null}
        <div className={`space-y-4 ${block.title ? "mt-3" : ""}`}>
          {block.body.map((p) => (
            <p key={p} className="mk-body mk-bidi mk-measure">
              {p}
            </p>
          ))}
        </div>
        {block.cta ? (
          <div className="mt-6">
            <Button cta={block.cta} locale={ctx.locale} variant="outline" size="sm" />
          </div>
        ) : null}
      </div>
    </Section>
  );
}
