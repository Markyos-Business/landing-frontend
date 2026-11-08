import type { AiRulesCopy } from "@/content/types";
import { CardTitle } from "@/components/ui/Card";
import { Section, SectionHead } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";

/*
 * What the AI is and is not allowed to do.
 *
 * Four promises, each one narrow enough to be checkable. This section exists
 * because "AI-powered" is the least trustworthy phrase in software right now,
 * and the only way past that is to say exactly where the line is: drafts not
 * decisions, no generated artwork, no stored text, no silent charges.
 *
 * Laid out as a single-column head over a four-up row rather than the page's
 * usual split, so the promises get the full width — they are the point, and
 * the paragraph above them is only the setup.
 */

const ICONS: IconName[] = ["penSquare", "palette", "scan", "check"];

export function AiRules({ copy }: { copy: AiRulesCopy }) {
  return (
    <Section id="ai" labelledBy="ai-heading" rule>
      <SectionHead id="ai-heading" title={copy.headline} lead={copy.body} align="start" />

      <ul className="mk-pop mk-bento mt-12 sm:grid-cols-2 lg:grid-cols-4">
        {copy.promises.map((promise, i) => (
          <li key={promise.term} className="flex min-h-[12rem] flex-col justify-between gap-8">
            <div>
              <CardTitle className="text-[length:var(--fs-lead)]">{promise.term}</CardTitle>
              <p className="mk-body mk-bidi mt-3">{promise.line}</p>
            </div>
            <Icon name={ICONS[i] ?? "check"} size={16} className="text-[var(--text-muted)]" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
