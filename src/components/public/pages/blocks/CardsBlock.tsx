import { Words, Button, Card, CardTitle, Chip, Icon, Section, SectionHead } from "@/components/ui";
import type { PageBlock } from "@/content/pages/types";
import { T, Note, type Ctx } from "./shared";

/* ── cards ────────────────────────────────────────────────────────────────── */

export function CardsBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "cards" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const cols = block.cols ?? 3;
  const grid =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

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

      {/* `mk-seq-pop`, so a grid of cards arrives with depth rather than
          sliding up flat — and `mk-pop-soft`, which is a custom property and
          therefore inherits from here down to each card: these grids run to
          nine dense cards, where the full 3.5% scale reads as a wobble.
          `mk-reach` only where a card leads somewhere, so what answers the
          pointer is always something you can actually press. */}
      <ul className={`${block.title ? "mt-11" : ""} mk-seq-pop mk-pop-soft mk-grid grid ${grid}`}>
        {block.items.map((item) => (
          <Card
            key={item.title}
            as="li"
            className={`flex flex-col${item.cta ? " mk-reach" : ""}`}
          >
            {item.icon ? (
              <span className="mk-card-icon" aria-hidden="true">
                <Icon name={item.icon} size={19} />
              </span>
            ) : null}
            {item.feature ? (
              <Chip feature={item.feature} chips={ctx.chips} className="mb-4 self-start" />
            ) : null}
            {/*
             * Same reasoning as the numbered block above: when this grid
             * carries its own title that title is the <h2>, and when it does
             * not — /compare, /resources, /solutions, /whats-new all open
             * straight into a grid — these cards are the first level under
             * the page's <h1>, so <h3> would leave a gap in the outline.
             */}
            <CardTitle as={block.title ? "h3" : "h2"}>{item.title}</CardTitle>
            {item.body ? (
              <p className="mk-body mk-bidi mt-3">{item.body}</p>
            ) : null}

            {/* `mk-seq` one level down: the bullets inside a card arrive
                after the card does, rather than with it. Only possible since
                `.mk-card` became `overflow: clip` — as a scroll container it
                was the nearest one for everything inside it, so every reveal
                in every card resolved against a box that never scrolls. */}
            {item.bullets?.length ? (
              <ul className="mk-seq mt-4 space-y-2.5">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] size-1 shrink-0 rounded-full bg-[var(--accent)]"
                    />
                    <span className="mk-bidi text-[0.875rem] leading-[1.6] text-[var(--text-muted)]">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {item.note ? (
              <p className="mk-bidi mt-4 border-t border-[var(--hairline)] pt-3.5 text-[length:var(--fs-eyebrow)] leading-[1.55] text-[var(--text-muted)]">
                {item.note}
              </p>
            ) : null}

            {item.cta ? (
              <div className="mt-auto pt-5">
                <Button cta={item.cta} locale={ctx.locale} variant="outline" size="sm" />
              </div>
            ) : null}
          </Card>
        ))}
      </ul>

      {block.note ? <Note className="mk-rise mt-7">{block.note}</Note> : null}
    </Section>
  );
}
