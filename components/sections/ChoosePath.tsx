import type { ChoosePathCopy, PathCardCopy } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The fork.
 *
 * Two doors, side by side, built from one component and styled identically —
 * same card, same type sizes, same button weight. The copy doc is explicit
 * that neither may be made the obvious choice, and a grid of two with no
 * "recommended" badge is the only honest way to say that. Whichever one the
 * visitor is, the page has already stopped talking to the other.
 *
 * `id="choose-path"` is a link target: the hero's "See how it works for you"
 * scrolls here, so the id is part of the contract, not a label.
 */

export function ChoosePath({ copy, locale }: { copy: ChoosePathCopy; locale: Locale }) {
  return (
    <Section id="choose-path" labelledBy="choose-path-heading">
      <h2 id="choose-path-heading" className="mk-h2">
        {copy.headline}
      </h2>

      <div className="mk-grid mt-12 md:grid-cols-2">
        <PathCard copy={copy.studio} locale={locale} icon="penSquare" label={copy.youGetLabel} />
        <PathCard copy={copy.company} locale={locale} icon="users" label={copy.youGetLabel} />
      </div>
    </Section>
  );
}

function PathCard({
  copy,
  locale,
  icon,
  label,
}: {
  copy: PathCardCopy;
  locale: Locale;
  icon: IconName;
  label: string;
}) {
  // A feature card: the two paths are the largest decision on the page, so
  // they take the 25px radius rather than the 15px of an ordinary card.
  return (
    <Card className="mk-feature flex flex-col">
      <p className="mb-3 flex items-center gap-2 text-[var(--accent-text)]">
        <Icon name={icon} size={16} className="flex-none" />
        <span className="mk-bidi text-[length:var(--fs-ui)] font-medium">{copy.label}</span>
      </p>

      <p className="mk-bidi text-[length:var(--fs-ui)] leading-[1.5] text-[var(--text-muted)]">
        {copy.who}
      </p>

      <CardTitle className="mt-5">{copy.headline}</CardTitle>

      <div className="mt-6 border-t border-[var(--hairline)] pt-5">
        <Eyebrow accent={false}>{label}</Eyebrow>
        <p className="mk-body mk-bidi mt-2">{copy.youGet}</p>
      </div>

      {/* `mt-auto` so the two cards' buttons line up even when one card's
          copy runs a line longer than the other's — which it does, and a
          fork with one door lower than the other is a fork with a default. */}
      <div className="mt-auto border-t border-[var(--hairline)] pt-5">
        <Button cta={copy.cta} locale={locale} variant="outline" size="sm" />
      </div>
    </Card>
  );
}
