"use client";

import { useState } from "react";
import type { PageBlock } from "@/content/pages/types";
import { Button, Eyebrow, Section } from "@/components/ui";
import { Countdown } from "@/components/features/offer/Countdown";
import type { Ctx } from "./shared";

/* ── offer ────────────────────────────────────────────────────────────────── */

/*
 * A dated offer on /pricing.
 *
 * The only block renderer that is a client component, and only because the
 * clock inside it has to be — see the header of Countdown.tsx. Everything
 * else here is static markup that happens to live under the same "use
 * client" as the timer; it is all rendered on the server too, so the offer,
 * its three rows and its terms are in the HTML a crawler reads.
 *
 * ── Why the whole block disappears when the window closes ────────────────
 *
 * Because a page that has gone stale should say nothing rather than
 * something wrong. These pages are statically generated, so an expired offer
 * would otherwise sit on /pricing with its discounted column intact until
 * somebody redeployed. The countdown tells us the moment the reader's own
 * clock passes the close, and the block collapses to one line saying the
 * offer has ended, above prices that were always the real ones.
 *
 * ── Why the discounted figures sit in a table and not on the cards ───────
 *
 * The plan cards carry the list price, which check:pricing holds against
 * billing.py and accountTypes.ts. Writing a temporary figure onto them would
 * mean either loosening that check or teaching it about a date, and the
 * first rebuild after the offer ends would leave half the cards wrong. Three
 * rows here, derived from the same prices, change nothing the check guards.
 */
export function OfferBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "offer" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const [ended, setEnded] = useState(false);

  /*
   * Ended: one line, and not a section's worth of it.
   *
   * The homepage strip removes itself outright, and this nearly did too. It
   * keeps a line because this is where an emailed or bookmarked "50% off"
   * link lands, and a reader who arrives on a promise deserves to be told it
   * closed rather than to find full prices and no explanation.
   *
   * It does not keep the section, though. `Section` pays 60-100px of block
   * padding at both ends, which around a single muted sentence is most of a
   * phone viewport of nothing. This is a slim band, the same object as the
   * homepage strip, and it exists only for the gap between the close date
   * and whoever takes LAUNCH_OFFER out of the content file.
   */
  if (ended) {
    return (
      <div className="px-6 py-8">
        <div className="mk-offer-strip mx-auto w-fit">
          <p className="mk-bidi" style={{ margin: 0 }}>
            {block.countdown.after}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Section id={block.id} labelledBy={headingId} white={white}>
      <div className="mk-pop mk-pop-soft mk-card mk-card-pad mk-offer">
        {block.eyebrow ? <Eyebrow className="mb-4">{block.eyebrow}</Eyebrow> : null}
        <h2 id={headingId} className="mk-h2 mk-bidi">
          {block.title}
        </h2>
        {block.lead ? (
          <p className="mk-lead mk-bidi mk-measure mt-4">{block.lead}</p>
        ) : null}

        <div className="mt-7">
          <Countdown
            opens={block.opens}
            closes={block.closes}
            copy={block.countdown}
            fallback={block.window}
            onEnded={() => setEnded(true)}
          />
        </div>

        {block.rows?.length ? (
          <dl className="mk-offer-rows mt-8">
            {block.rowHead ? (
              <div className="mk-offer-row mk-offer-row-head" aria-hidden="true">
                <span className="mk-bidi">{block.rowHead[0]}</span>
                <span className="mk-bidi">{block.rowHead[1]}</span>
                <span className="mk-bidi">{block.rowHead[2]}</span>
              </div>
            ) : null}
            {block.rows.map((row) => (
              <div key={row.label} className="mk-offer-row">
                <dt className="mk-bidi">{row.label}</dt>
                {/* The list price, struck through, is the one place on this
                    site a price is shown as superseded. `<s>` and not a
                    class: the fact that it no longer applies is the content,
                    so it survives a stylesheet that does not load. */}
                <dd className="mk-bidi mk-offer-was">
                  <s dir="ltr">{row.was}</s>
                </dd>
                <dd className="mk-bidi mk-offer-now" dir="ltr">
                  {row.now}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {block.terms?.length ? (
          <ul className="mk-offer-terms mt-7">
            {block.terms.map((term) => (
              <li key={term} className="mk-bidi">
                {term}
              </li>
            ))}
          </ul>
        ) : null}

        {block.cta ? (
          <div className="mt-7">
            <Button cta={block.cta} locale={ctx.locale} variant="solid" size="sm" />
          </div>
        ) : null}
      </div>
    </Section>
  );
}
