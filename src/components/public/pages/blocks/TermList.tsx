import type { TermItem } from "@/content/pages/types";
import { Button, Chip } from "@/components/ui";
import type { Ctx } from "./shared";

/* ── terms ────────────────────────────────────────────────────────────────── */

export function TermList({ items, ctx, cols = 2 }: { items: TermItem[]; ctx: Ctx; cols?: 1 | 2 | 3 }) {
  const grid =
    cols === 1
      ? "mk-measure"
      : cols === 3
        ? "grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
        : "grid gap-x-12 gap-y-8 md:grid-cols-2";

  return (
    <dl className={`mk-seq ${grid}`}>
      {items.map((item) => (
        <div key={item.term} className={cols === 1 ? "mt-6 first:mt-0" : undefined}>
          <dt className="mk-bidi flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9375rem] font-medium leading-[1.45] text-[var(--text)]">
            <span className="mk-bidi">{item.term}</span>
            {item.feature ? <Chip feature={item.feature} chips={ctx.chips} /> : null}
          </dt>
          {item.body ? (
            <dd className="mk-bidi mt-2 text-[0.9375rem] leading-[1.65] text-[var(--text-muted)]">
              {item.body}
            </dd>
          ) : null}
          {item.cta ? (
            <dd className="mt-3">
              <Button cta={item.cta} locale={ctx.locale} variant="link" />
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
