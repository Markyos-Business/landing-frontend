import type { StatementCopy } from "@/content/types";
import { ScrollCta } from "@/components/ui/Button";
import { Eyebrow, Glow, Section, SectionHead } from "@/components/ui/Section";
import { DraftsPanel } from "@/components/mock/DraftsPanel";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The page's two hinge points.
 *
 * Both are a single idea stated plainly, and both are `StatementCopy`, but
 * they are laid out oppositely on purpose:
 *
 *   "One brand. Every place it needs to live." is the product glimpse. It
 *   argues, so it gets the page's wide two-column treatment and a picture of
 *   the thing it is describing.
 *
 *   "A brand isn't a document. It's a place." is the turn. It does not argue,
 *   it asserts — so it is centred on a narrow measure with nothing beside it,
 *   which is the only way a page this dense can signal "stop and read this
 *   one". A sentence in the middle of a wide column is just another sentence.
 */

const FLOW_ICONS: IconName[] = ["form", "check", "layers", "phone"];

export function Statement({
  copy,
  locale,
  id,
  layout = "center",
}: {
  copy: StatementCopy;
  locale: Locale;
  id: string;
  layout?: "split" | "center";
}) {
  const headingId = `${id}-heading`;

  if (layout === "split") {
    return (
      <Section id={id} labelledBy={headingId}>
        {/*
         * The explaining column is not rendered here any more.
         *
         * This section's job is to show the product once, early, before the
         * page asks anyone to believe anything — the panel below does that.
         * The paragraphs beside the headline were the page's first three
         * hundred words and they arrived before the picture. Still in
         * `content/`, still on /platform.
         */}
        <SectionHead id={headingId} eyebrow={copy.eyebrow} title={copy.headline} />

        <div className="mk-seq mt-14 grid items-start gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12">
          {copy.flow?.length ? (
            <ol className="space-y-1">
              {copy.flow.map((stage, i) => (
                <li
                  key={stage.name}
                  /*
                   * The second stage is marked.
                   *
                   * Not a selected state anyone can change — it is the
                   * reference showing the flow mid-run, so the panel beside it
                   * has something to be showing. It carries no aria-current
                   * for that reason: nothing here is current, it is a picture.
                   */
                  className={
                    "flex items-start gap-3 rounded-[var(--radius-widget)] px-3 py-2.5 " +
                    (i === 1
                      ? "border border-[var(--hairline-strong)] bg-[var(--surface-1)]"
                      : "border border-transparent")
                  }
                >
                  <Icon
                    name={FLOW_ICONS[i] ?? "check"}
                    size={15}
                    className={
                      "mt-0.5 flex-none " +
                      (i === 1 ? "text-[var(--accent-text)]" : "text-[var(--text-muted)]")
                    }
                  />
                  <span>
                    <span className="mk-bidi block text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
                      {stage.name}
                    </span>
                    <span className="mk-bidi block text-[0.75rem] leading-[1.5] text-[var(--text-muted)]">
                      {stage.line}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          ) : null}

          <DraftsPanel locale={locale} />
        </div>
      </Section>
    );
  }

  /*
   * The turn.
   *
   * The last paragraph — "That place is Markyos. A studio builds it. A
   * company runs it." — is set in white under the grey lead, because it is
   * the sentence the whole section exists to deliver.
   */
  const [lead, ...rest] = copy.body;

  return (
    <Section id={id} labelledBy={headingId} className="relative overflow-clip">
      {/*
       * The light pool.
       *
       * §8 puts one behind the single object a section is about. Everywhere
       * else on the page that object is a product shot; here the section has
       * no product in it — the thing it is about *is* the sentence, which is
       * why this block was the only one on the page with neither a picture
       * nor a light. Low and behind the start edge, so it lands under the
       * headline rather than ringing it.
       *
       * Positioned with `start`/`end` alone and no transform. A translate
       * moves along the physical X axis, which does not flip with direction,
       * so the usual `-translate-x-* rtl:translate-x-*` pair has to be
       * written and reasoned about twice — and got it backwards here the
       * first time, putting the pool on the opposite side of the page from
       * the sentence it was meant to be behind. A negative inline offset
       * flips on its own.
       *
       * `overflow-clip` on the section: the pool reaches past the gutter
       * and a 390px phone would otherwise scroll sideways.
       */}
      <Glow className="start-[-10rem] top-[-3rem] h-[22rem] w-[min(38rem,100%)] opacity-70" />

      <div className="relative flex flex-col items-start text-start">
        {copy.eyebrow ? <Eyebrow className="mb-4">{copy.eyebrow}</Eyebrow> : null}

        <h2 id={headingId} className="mk-h2-lg max-w-[20ch]">
          {copy.headline}
        </h2>

        {lead ? (
          <p className="mk-bidi mt-6 max-w-[37.5rem] text-[length:var(--fs-lead)] leading-[1.6] text-[var(--text-muted)]">
            {lead}
          </p>
        ) : null}

        {rest.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="mk-bidi mt-6 max-w-[37.5rem] text-[length:var(--fs-lead)] font-medium leading-[1.6] text-[var(--text)]"
          >
            {paragraph}
          </p>
        ))}

        {copy.cta ? (
          <div className="mt-9">
            <ScrollCta cta={copy.cta} locale={locale} />
          </div>
        ) : null}
      </div>
    </Section>
  );
}
