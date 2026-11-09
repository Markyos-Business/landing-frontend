import { Words } from "@/components/ui/Words";
import type { PageBlock } from "@/content/pages/types";
import { Section, SectionHead } from "@/components/ui/Section";
import { T, Note } from "./shared";

/* ── steps ────────────────────────────────────────────────────────────────── */

export function StepsBlock({
  block,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "steps" }>;
  headingId: string;
  white: boolean;
}) {
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

      <ol className={`${block.title ? "mt-10" : ""} mk-seq mk-measure`}>
        {block.items.map((item, i) => (
          <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
            {/* The rail. Drawn on the item rather than behind the list so the
                last step has no tail hanging off the end of it. */}
            {i < block.items.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-9 bottom-0 start-[0.9375rem] w-px bg-[var(--hairline-strong)]"
              />
            ) : null}
            <span
              aria-hidden="true"
              className="relative z-10 grid size-[1.875rem] shrink-0 place-items-center rounded-full border border-[var(--hairline-strong)] bg-[var(--surface-2)] text-[0.75rem] font-medium tabular-nums text-[var(--accent-text)]"
            >
              {i + 1}
            </span>
            <div className="pt-[0.3rem]">
              {item.title ? (
                <p className="mk-bidi text-[0.9375rem] font-medium leading-[1.5] text-[var(--text)]">
                  {item.title}
                </p>
              ) : null}
              <p className={`mk-body mk-bidi ${item.title ? "mt-1.5" : ""}`}>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {block.note ? <Note className="mk-rise mt-7">{block.note}</Note> : null}
    </Section>
  );
}
