"use client";

import { useId, useState } from "react";
import type { PlanCopy, PricingTeaserCopy } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The pricing teaser.
 *
 * "Start free. Pay when it's working." is risk reversal in five words, and the
 * one explanatory line under each side answers the question that actually
 * stalls a decision: what counts as a project for a studio, and who counts as
 * a seat for a company.
 *
 * One recommended plan per side is lifted — the warm wash across the top of
 * the card and the only solid button in the row (Von Restorff). Exactly one:
 * two recommendations are none.
 *
 * ── Two notes for whoever finishes this ─────────────────────────────────────
 *
 * 1. Every price here is a hypothesis until the beta pricing test closes on
 *    1 Feb 2027. Do not publish without updating content/en/index.ts from the
 *    final pricing page. See docs/BEFORE-PUBLISH.md.
 *
 * 2. The copy doc says this toggle "defaults to the path the visitor picked"
 *    earlier on the page. It defaults to studios today, because nothing yet
 *    records that choice. Wiring it means remembering the hero click — which
 *    is a decision about tracking, not about pricing, so it is deliberately
 *    not invented here. See docs/NEXT-STEPS.md.
 */

const PLAN_ICONS: IconName[] = ["user", "users", "rocket"];

export function PricingTeaser({
  copy,
  locale,
}: {
  copy: PricingTeaserCopy;
  locale: Locale;
}) {
  const [side, setSide] = useState<"studio" | "company">("studio");
  const panelId = useId();

  const plans = side === "studio" ? copy.studioPlans : copy.companyPlans;
  const note = side === "studio" ? copy.studioNote : copy.companyNote;

  const tab = (value: "studio" | "company", label: string) => (
    <button
      key={value}
      type="button"
      role="tab"
      aria-selected={side === value}
      aria-controls={panelId}
      onClick={() => setSide(value)}
      className={
        "mk-bidi min-h-[34px] rounded-[var(--radius-pill)] px-4 text-[length:var(--fs-ui)] font-medium transition-colors " +
        (side === value
          ? "border border-[var(--hairline-strong)] bg-[var(--surface-2)] text-[var(--text)]"
          : "border border-transparent text-[var(--text-muted)] hover:text-[var(--text)]")
      }
    >
      {label}
    </button>
  );

  return (
    <Section id="pricing" labelledBy="pricing-heading" rule>
      <h2 id="pricing-heading" className="mk-h2">
        {copy.headline}
      </h2>

      <div className="mt-8 flex justify-center">
        <div
          role="tablist"
          aria-label={copy.headline}
          className="inline-flex gap-1 rounded-[var(--radius-pill)] border border-[var(--hairline)] p-1"
        >
          {tab("studio", copy.studioToggle)}
          {tab("company", copy.companyToggle)}
        </div>
      </div>

      <div id={panelId} role="tabpanel" className="mt-10">
        <div className="mk-grid md:grid-cols-3">
          {plans.map((plan, i) => (
            <PlanCard
              key={`${side}-${plan.name}`}
              plan={plan}
              locale={locale}
              icon={PLAN_ICONS[i] ?? "user"}
              recommendedLabel={copy.recommendedLabel}
            />
          ))}
        </div>

        <p className="mk-bidi mt-10 max-w-[34rem] text-[length:var(--fs-body)] font-medium text-[var(--text)]">
          {note}
        </p>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 text-start">
        <p className="mk-bidi max-w-[40rem] text-[length:var(--fs-ui)] text-[var(--text-muted)]">
          {copy.underBoth}
        </p>
        <Button cta={copy.link} locale={locale} variant="link" />
      </div>
    </Section>
  );
}

function PlanCard({
  plan,
  locale,
  icon,
  recommendedLabel,
}: {
  plan: PlanCopy;
  locale: Locale;
  icon: IconName;
  recommendedLabel: string;
}) {
  /*
   * "$24/month" is one approved string, and the reference sets the amount
   * large with the period small beside it. Splitting on the slash gets that
   * without asking content/ to hold the price twice — and a price with no
   * slash ("$0") simply renders whole.
   */
  const [amount, period] = plan.price.split("/");

  return (
    <div
      className={`mk-card mk-card-pad relative flex flex-col${
        plan.recommended ? " mk-neon" : ""
      }`}
    >

      <p className="flex items-center gap-2">
        <Icon name={icon} size={16} className="flex-none text-[var(--text-muted)]" />
        <span className="mk-bidi text-[length:var(--fs-lead)] font-medium text-[var(--text)]">
          {plan.name}
        </span>
      </p>

      <p className="mk-bidi mt-2 text-[length:var(--fs-ui)] leading-[1.5] text-[var(--text-muted)]">
        {plan.line}
      </p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="mk-bidi text-[length:var(--fs-d3)] font-medium leading-none tracking-[-0.04em] text-[var(--text)]">
          {amount}
        </span>
        {period ? (
          <span className="mk-bidi text-[length:var(--fs-ui)] text-[var(--text-muted)]">/{period}</span>
        ) : null}
      </p>

      {/* Reserved whether or not it is filled, so the three cards' buttons sit
          on one line instead of the recommended one dropping a row. The tag
          itself matches the one the `plans` block renders on the pricing page
          — same concept, same ghost treatment. */}
      <p className="mt-1.5 flex h-5 items-start">
        {plan.recommended ? (
          <span className="mk-bidi rounded-[var(--mk-r-status)] bg-[var(--accent-soft)] px-2 py-0.5 text-[length:var(--fs-eyebrow)] font-medium leading-none text-[var(--accent-on-soft)]">
            {recommendedLabel}
          </span>
        ) : null}
      </p>

      <div className="mt-5">
        <Button
          cta={plan.cta}
          locale={locale}
          variant={plan.recommended ? "solid" : "outline"}
          size="sm"
          arrow={false}
          className="w-full"
        />
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-[var(--hairline)] pt-5">
        {plan.rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="mk-bidi flex items-center gap-2 text-[length:var(--fs-ui)] text-[var(--text-muted)]">
              <Icon name="check" size={13} className="flex-none text-[var(--accent-text)]" />
              {row.label}
            </dt>
            <dd className="mk-bidi text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
