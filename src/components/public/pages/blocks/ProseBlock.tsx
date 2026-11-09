import { Words, Section, SectionHead } from "@/components/ui";
import type { PageBlock } from "@/content/pages/types";
import { T, Buttons, type Ctx } from "./shared";

/* ── prose ────────────────────────────────────────────────────────────────── */

export function ProseBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "prose" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const align = block.align ?? "split";

  /*
   * A signpost, not a section.
   *
   * Six pages carry `{ kind: "prose", body: [], links: [...] }` — no heading,
   * no copy, one row of links out. Rendered as an ordinary section that is
   * 200px of padding around a single 20px line, and on /platform it sat between
   * a table and the audience switch as 235px of empty band. It belongs to the
   * section above it: the link is where that section's argument goes next.
   *
   * So it loses its top padding and most of its bottom, and PageView does not
   * spend a band on it — see the counter there.
   */
  const signpost = !block.title && !block.body?.length;

  return (
    <Section
      id={block.id}
      labelledBy={block.title ? headingId : undefined}
      white={white}
      className={signpost ? "pt-0 pb-[clamp(2.5rem,5vw,4rem)]" : ""}
    >
      {block.title ? (
        <SectionHead
          id={headingId}
          eyebrow={block.eyebrow}
          title={
            <T>
              <Words>{block.title}</Words>
            </T>
          }
          body={align === "split" ? block.body : undefined}
          lead={align !== "split" ? block.body?.[0] : undefined}
          align={align}
          emphasiseLast={block.emphasiseLast}
        >
          {align !== "split" && block.body && block.body.length > 1 ? (
            /* `mk-seq`: a stacked prose section's paragraphs arrive one after
               another. This is the layout /about's story and half the
               solutions pages use, where the whole body was one reveal. */
            <div className={`mk-seq space-y-4 ${align === "center" ? "text-center" : ""}`}>
              {block.body.slice(1).map((p) => (
                <p key={p} className="mk-body mk-bidi mk-measure">
                  {p}
                </p>
              ))}
            </div>
          ) : null}
          {block.cta || block.links?.length ? (
            <div className="mt-7">
              <Buttons
                links={[...(block.cta ? [block.cta] : []), ...(block.links ?? [])]}
                locale={ctx.locale}
                align={align === "center" ? "center" : "start"}
              />
            </div>
          ) : null}
        </SectionHead>
      ) : (
        <div className="mk-rise mk-seq mk-measure space-y-4">
          {block.body?.map((p) => (
            <p key={p} className="mk-body mk-bidi mk-measure">
              {p}
            </p>
          ))}
          {block.cta || block.links?.length ? (
            <div className="pt-3">
              <Buttons
                links={[...(block.cta ? [block.cta] : []), ...(block.links ?? [])]}
                locale={ctx.locale}
              />
            </div>
          ) : null}
        </div>
      )}
    </Section>
  );
}
