import { Words, Eyebrow, Section, SectionHead } from "@/components/ui";
import type { PageBlock } from "@/content/pages/types";
import { AudienceTabs } from "../AudienceTabs";
import { Chooser } from "../Chooser";
import { SignupForm } from "@/components/features/waitlist";
import { ContactForm } from "@/components/features/contact";
import { T, Note, type Ctx } from "./shared";
import { TermList } from "./TermList";
import { HeroBlock } from "./HeroBlock";
import { ProseBlock } from "./ProseBlock";
import { NumberedBlock } from "./NumberedBlock";
import { CardsBlock } from "./CardsBlock";
import { TableBlock } from "./TableBlock";
import { StepsBlock } from "./StepsBlock";
import { CalloutBlock } from "./CalloutBlock";
import { ShowcaseBlock } from "./ShowcaseBlock";
import { WebBlock } from "./WebBlock";
import { ExplorerBlock } from "./ExplorerBlock";
import { FaqBlock } from "./FaqBlock";
import { PlansBlock } from "./PlansBlock";
import { CtaBlock } from "./CtaBlock";
import { OfferBlock } from "./OfferBlock";

/*
 * The block renderers — one file per `PageBlock` kind, dispatched here.
 *
 * Shared helpers (T, Buttons, AccentedTitle, Note, Ctx) are in `./shared`.
 *
 * Every one of these composes the vocabulary in `tailwind/` and the
 * primitives in `src/components/ui/` — none of them invents a value. That is the
 * rule in `docs/DESIGN.md` and it is what keeps thirty-odd data-driven pages
 * looking like one site rather than like a template.
 *
 * Three things are handled once here so no content file has to think about
 * them:
 *
 *   - **Direction.** Every string is wrapped in `.mk-bidi`
 *     (`unicode-bidi: plaintext`), so an English product name inside an
 *     Arabic sentence sits the right way round and the reverse works too. All
 *     spacing is logical (`ps-`, `me-`, `start-`), never physical, so the
 *     whole page mirrors from the one `dir` on <html>.
 *   - **Status chips.** A block names a feature id; the chip label is
 *     resolved per locale from `src/lib/status.ts`. No page can hard-code
 *     "coming spring 2027" and then go on saying it after it ships.
 *   - **Rhythm.** Sections alternate ground and white rather than carrying
 *     their own margins, so a page reads as a sequence instead of a stack of
 *     unrelated boxes. Which section is which is decided once, in PageView.
 */

/* ── dispatch ─────────────────────────────────────────────────────────────── */

export function Block({
  block,
  ctx,
  index,
  white,
}: {
  block: PageBlock;
  ctx: Ctx;
  index: number;
  /** Paint this section on the white band. See PageView's band counter. */
  white: boolean;
}) {
  const headingId = `blk-${index}`;

  switch (block.kind) {
    case "hero":
      return <HeroBlock block={block} ctx={ctx} headingId={headingId} />;
    case "prose":
      return <ProseBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "numbered":
      return <NumberedBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "cards":
      return <CardsBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "table":
      return <TableBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "steps":
      return <StepsBlock block={block} headingId={headingId} white={white} />;
    case "callout":
      return <CalloutBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "showcase":
      return <ShowcaseBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "explorer":
      return <ExplorerBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "web":
      return <WebBlock block={block} />;
    case "faq":
      return <FaqBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "plans":
      return <PlansBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    case "cta":
      return <CtaBlock block={block} ctx={ctx} headingId={headingId} />;
    case "offer":
      return <OfferBlock block={block} ctx={ctx} headingId={headingId} white={white} />;
    /*
     * The chooser sits between the switch and the cards, so it is tight at
     * both ends for the same reason the switch is: it belongs to the grid
     * below it and a full band above would float it in an empty one.
     */
    case "chooser":
      return (
        <Section
          id={block.id}
          labelledBy={headingId}
          white={white}
          className="pb-0 pt-[clamp(2rem,5vw,3.5rem)]"
        >
          <div className="mk-seq flex flex-col items-center text-center">
            <h2 id={headingId} className="mk-h2 mk-bidi">
              <T>
                <Words>{block.title}</Words>
              </T>
            </h2>
            {block.lead ? (
              <p className="mk-lead mk-bidi mt-4 max-w-[37.5rem]">{block.lead}</p>
            ) : null}
            <Chooser label={block.label} options={block.options} />
          </div>
        </Section>
      );
    case "audience":
      return (
        <AudienceTabs
          id={block.id}
          headingId={block.title ? headingId : undefined}
          label={block.label}
          white={white}
          param={block.param}
          head={
            block.title ? (
              <>
                {block.eyebrow ? <Eyebrow className="mb-4">{block.eyebrow}</Eyebrow> : null}
                <h2 id={headingId} className="mk-h2 mk-bidi">
                  <T>{block.title}</T>
                </h2>
                {block.lead ? (
                  <p className="mk-lead mk-bidi mt-4 max-w-[37.5rem]">{block.lead}</p>
                ) : null}
              </>
            ) : null
          }
          options={block.options.map((option, o) => ({
            id: option.id,
            label: option.label,
            content: option.blocks.map((inner, i) => (
              /*
               * `white` is the switch's own, for every section in every panel.
               * Alternating inside a panel would mean the page's rhythm changed
               * with whichever panel was open, and two panels of different
               * lengths would hand the section after the group a different
               * colour each way.
               *
               * The index has to separate the panels as well as the blocks:
               * `index * 100 + i` gave both panels the same numbers, so every
               * heading inside them shared an id with its opposite number and
               * /pricing shipped two `#blk-101`s. An id is a page-wide name —
               * `aria-labelledby` resolves to the first match, which here was
               * in the hidden panel.
               */
              <Block
                key={i}
                block={inner}
                ctx={ctx}
                index={(index + 1) * 1000 + o * 100 + i}
                white={white}
              />
            )),
          }))}
        />
      );
    case "terms":
      return (
        <Section
          id={block.id}
          labelledBy={block.title ? headingId : undefined}
          white={white}
        >
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
          <div className={block.title ? "mt-10" : ""}>
            <TermList items={block.items} ctx={ctx} cols={block.cols} />
          </div>
          {block.note ? (
            <Note className="mk-rise mt-7">{block.note}</Note>
          ) : null}
        </Section>
      );
    case "signup":
      return (
        <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
          <div className="mk-pop mk-card mk-card-pad grid gap-x-12 gap-y-7 md:grid-cols-2 md:items-center">
            <div>
              {block.title ? (
                <h2 id={headingId} className="mk-h3 mk-bidi">
                  {block.title}
                </h2>
              ) : null}
              {block.lead ? <p className="mk-body mk-bidi mt-2.5">{block.lead}</p> : null}
            </div>
            <SignupForm
              placeholder={block.placeholder}
              submit={block.submit}
              note={block.note}
              topic={block.topic}
              locale={ctx.locale}
            />
          </div>
        </Section>
      );
    /*
     * The message form.
     *
     * Head on top, form across the full card beneath it — not the two-column
     * card the `signup` block uses. That block is one email field beside a
     * line of text, which balances. This form is nine fields: set beside a
     * two-line heading it would run some seven hundred pixels down one half
     * of the card with the other half empty from the third row on.
     *
     * Across the full width instead, the pairs inside `.mk-form-row` fall
     * into two columns of about 500px, which is a comfortable field, and the
     * form is five rows deep rather than nine. The heading and the lead keep
     * `.mk-measure`, because they are prose and prose has a measure — the
     * card widens, the sentence does not. The same distinction the offer
     * card's ledger turns on, in the other direction.
     */
    case "contact":
      return (
        <Section id={block.id} labelledBy={block.title ? headingId : undefined} white={white}>
          <div className="mk-pop mk-card mk-card-pad">
            {block.title || block.lead ? (
              <div className="mk-measure">
                {block.title ? (
                  <h2 id={headingId} className="mk-h3 mk-bidi">
                    {block.title}
                  </h2>
                ) : null}
                {block.lead ? <p className="mk-body mk-bidi mt-2.5">{block.lead}</p> : null}
              </div>
            ) : null}
            <div className={block.title || block.lead ? "mt-8" : ""}>
              <ContactForm locale={ctx.locale} topic={block.topic} submitLabel={block.submit} />
            </div>
            {block.note ? <Note className="mt-7">{block.note}</Note> : null}
          </div>
        </Section>
      );
  }
}
