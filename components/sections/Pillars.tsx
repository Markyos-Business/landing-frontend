import type { PillarsCopy } from "@/content/types";
import { CardTitle } from "@/components/ui/Card";
import { Section, SectionHead } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";

/*
 * One source of truth.
 *
 * Three pillars — assets, guidelines, strategy — and the claim above them is
 * that there is one of each rather than a copy per place. The cards are
 * deliberately plain: this section is the architecture, and the page has
 * already spent its pictures on the features that need them.
 */

const ICONS: IconName[] = ["package", "layers", "grid"];

export function Pillars({ copy }: { copy: PillarsCopy }) {
  return (
    <Section id="source-of-truth" labelledBy="source-of-truth-heading" rule>
      {/* The explaining paragraph is not rendered here: the three cells below
          are the three things it listed, and listing them twice is how this
          page got to fourteen minutes. Still in `content/`, still on
          /platform. */}
      <SectionHead id="source-of-truth-heading" title={copy.headline} />

      {/*
       * The cell anatomy is the reference's: the substance fills the cell and
       * the label sits on the floor of it, so a row of cells shares one
       * baseline however unevenly their copy runs. `justify-between` plus a
       * min height does that without a fixed cell height to fight at 375px.
       */}
      <ul className="mk-pop mk-bento mt-12 md:grid-cols-3">
        {copy.pillars.map((pillar, i) => (
          <li key={pillar.name} className="flex min-h-[13rem] flex-col justify-between gap-8">
            <div>
              <CardTitle className="text-[length:var(--fs-d3)]">{pillar.headline}</CardTitle>
              <p className="mk-body mk-bidi mt-3 max-w-[34ch]">{pillar.line}</p>
            </div>
            <p className="flex items-center gap-2 text-[var(--text-muted)]">
              <Icon name={ICONS[i] ?? "package"} size={16} className="flex-none" />
              <span className="mk-bidi text-[length:var(--fs-ui)] font-medium">{pillar.name}</span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
