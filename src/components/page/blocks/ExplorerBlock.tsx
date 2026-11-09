import { Words } from "@/components/ui/Words";
import type { PageBlock } from "@/content/pages/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHead } from "@/components/ui/Section";
import { MOCKS } from "@/components/mock/registry";
import { SolutionExplorer } from "../SolutionExplorer";
import { T, type Ctx } from "./shared";

/* ── explorer ─────────────────────────────────────────────────────────────── */

/*
 * The hub's nine solutions, as a control.
 *
 * All the thinking is in `SolutionExplorer.tsx` and in the block's note in
 * `content/pages/types.ts`. What is here is the server half: the nine
 * panels are built on this side — heading, line, the product view, the way
 * out — and handed over as a prop, so none of the mock markup crosses into
 * the client bundle.
 */
export function ExplorerBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "explorer" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  return (
    <Section id={block.id} labelledBy={headingId} white={white}>
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

      <div className="mt-10">
        <SolutionExplorer
          label={block.label}
          tabs={block.items.map((item) => ({
            title: item.title,
            audience: item.audience,
            icon: <Icon name={item.icon} size={17} />,
          }))}
          panels={block.items.map((item) => {
            const Mock = MOCKS[item.mock];
            return (
              <div key={item.title} className="mk-explorer-panel">
                <p className="mk-h3 mk-bidi">{item.title}</p>
                <p className="mk-body mk-bidi mk-measure mt-2">{item.line}</p>
                {/* The picture sits on the panel's own ground rather than in
                    a second frame: every mock already is a card, and a card
                    inside a card is two edges 20px apart. */}
                <div className="mk-explorer-shot mt-6">
                  <Mock locale={ctx.locale} />
                </div>
                <div className="mt-6">
                  <Button cta={item.cta} locale={ctx.locale} variant="outline" size="sm" />
                </div>
              </div>
            );
          })}
        />
      </div>
    </Section>
  );
}
