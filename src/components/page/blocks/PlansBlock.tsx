import { Words } from "@/components/ui/Words";
import type { PageBlock } from "@/content/pages/types";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Section, SectionHead } from "@/components/ui/Section";
import { BillingSwitch } from "../BillingSwitch";
import { T, Note, type Ctx } from "./shared";

/* ── plans ────────────────────────────────────────────────────────────────── */

export function PlansBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "plans" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const cols = block.plans.length >= 5 ? "lg:grid-cols-5" : block.plans.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  const align = block.align ?? "start";

  /*
   * Only offer the switch when at least one plan answers it.
   *
   * A block of free and contract plans has no yearly rate to show, and a
   * control that redraws nothing is worse than no control: it reads as
   * broken. The content file still only has to supply `billing` once.
   */
  const billing = block.billing && block.plans.some((plan) => plan.annual)
    ? block.billing
    : null;

  const head = block.title ? (
    <SectionHead
      id={headingId}
      eyebrow={block.eyebrow}
      title={
        <T>
          <Words>{block.title}</Words>
        </T>
      }
      lead={block.lead}
      /* Inside the switch the head is already in a centred column, so it
         lays itself out at the start edge of that column rather than
         centring twice — which would narrow the measure to the shorter of
         the two. */
      align={billing && align === "center" ? "start" : align}
    />
  ) : null;

  const grid = (
    <ul
      className={`${billing ? "mt-10" : block.title ? "mt-11" : ""} mk-seq-pop mk-pop-soft grid gap-5 ${cols}`}
    >
        {block.plans.map((plan) => (
          <Card
            key={plan.name}
            as="li"
            className={`flex flex-col ${plan.cta ? "mk-reach " : ""}${
              plan.recommended
                ? // The one selected object in the section, marked with the
                  // neon edge rather than a scale transform: a lifted card in
                  // a row of five clips its neighbours' hover targets and
                  // shifts the row on load.
                  "mk-neon"
                : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <CardTitle as="h3">{plan.name}</CardTitle>
              {plan.recommended ? (
                <span className="mk-bidi shrink-0 rounded-[var(--mk-r-status)] bg-[var(--accent-soft)] px-2.5 py-1 text-[length:var(--fs-eyebrow)] font-medium leading-none text-[var(--accent-on-soft)]">
                  {block.recommendedLabel}
                </span>
              ) : null}
            </div>

            {/*
             * The amount never breaks, and it is sized by the card.
             *
             * Two bugs, one cause: a price is set at 28px whatever the card is
             * wide, and the grid is three, four or five cards across depending
             * on how many plans there are. At four, each card has 200px of
             * content and "149 SAR a month" is wider — so it wrapped between
             * the number and its currency and put "a month" alongside "SAR" on
             * the second line. Holding the amount together with `nowrap` fixed
             * that and replaced it with something worse: at five plans the card
             * has 146px, and "from 299 SAR" simply hung 60px out of the card
             * and 60px out of the page's measure.
             *
             * A container query is the honest instrument here, because the
             * constraint is the card's width and not the viewport's: at 1024px
             * the same five cards have stacked two-up and have room to spare.
             * The card declares itself the container and the price steps down
             * when the card is narrow, so it fits on one line at every count
             * and every width.
             */}
            {/* Both amounts render; `data-bill` says which cycle each one
                belongs to and the switch above shows one of them. A plan with
                no annual rate has no `data-bill` at all, so it is shown in
                both — see BillingSwitch, and `[data-billing]` in globals.css. */}
            <p className="@container/plan mt-4 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span
                data-bill={plan.annual ? "monthly" : undefined}
                className="mk-bidi whitespace-nowrap text-[1.25rem] font-medium leading-none tracking-[-0.04em] text-[var(--text)] @[10rem]/plan:text-[1.5rem] @[17rem]/plan:text-[length:var(--fs-d3)]"
              >
                {plan.price}
              </span>
              {plan.annual ? (
                <span
                  data-bill="annual"
                  className="mk-bidi whitespace-nowrap text-[1.25rem] font-medium leading-none tracking-[-0.04em] text-[var(--text)] @[10rem]/plan:text-[1.5rem] @[17rem]/plan:text-[length:var(--fs-d3)]"
                >
                  {plan.annual.price}
                </span>
              ) : null}
              {plan.period ? (
                <span className="mk-bidi whitespace-nowrap text-[length:var(--fs-ui)] font-medium leading-none text-[var(--text-muted)]">
                  {plan.period}
                </span>
              ) : null}
            </p>
            {plan.annual?.note ? (
              <p
                data-bill="annual"
                className="mk-bidi mt-1.5 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]"
              >
                {plan.annual.note}
              </p>
            ) : null}
            {plan.who ? (
              <p className="mk-bidi mt-3 text-[length:var(--fs-ui)] leading-[1.6] text-[var(--text-muted)]">
                {plan.who}
              </p>
            ) : null}

            <dl className="mt-5 space-y-3 border-t border-[var(--hairline)] pt-4">
              {plan.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="mk-bidi text-[length:var(--fs-ui)] leading-[1.5] text-[var(--text-muted)]">
                    {row.label}
                  </dt>
                  <dd
                    className={`mk-bidi shrink-0 text-[length:var(--fs-ui)] font-medium ${
                      row.strong ? "text-[var(--accent-text)]" : "text-[var(--text)]"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto pt-6">
              {plan.feature ? (
                <Chip feature={plan.feature} chips={ctx.chips} />
              ) : plan.cta ? (
                <Button
                  cta={plan.cta}
                  locale={ctx.locale}
                  variant={plan.recommended ? "solid" : "outline"}
                  size="sm"
                  block
                />
              ) : null}
            </div>
          </Card>
        ))}
    </ul>
  );

  return (
    <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
      {billing ? (
        <BillingSwitch
          label={billing.label}
          monthly={billing.monthly}
          annual={billing.annual}
          centred={align === "center"}
          head={head}
        >
          {grid}
        </BillingSwitch>
      ) : (
        <>
          {head}
          {grid}
        </>
      )}

      {block.note ? <Note className="mk-rise mt-7">{block.note}</Note> : null}
    </Section>
  );
}
