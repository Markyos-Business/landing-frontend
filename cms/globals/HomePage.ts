import type { GlobalConfig } from "payload";
import { revalidateSite } from "../hooks/revalidate";
import { isAdmin } from "../access";

/*
 * The homepage, editable.
 *
 * ── How this works, and why it works this way ───────────────────────────────
 *
 * Every field here is **optional and empty by default**. The homepage ships
 * with its approved copy in `content/en/index.ts`, and this global *overrides*
 * it field by field: fill a field and the site uses it; leave it empty and the
 * git copy renders. See `lib/content/pageCopy.ts`.
 *
 * Three things that buys, all of which matter more than they sound:
 *
 *   1. **The site cannot break by being empty.** A fresh database, a failed
 *      query, a reverted migration — the homepage still renders its approved
 *      copy. A CMS that owns the homepage outright turns any database problem
 *      into a blank marketing site.
 *
 *   2. **An edit is visible as an edit.** Anything filled in here is, by
 *      definition, a deliberate departure from the copy that went through
 *      strategy. That is a useful thing to be able to see at a glance.
 *
 *   3. **The Arabic fallback still works.** Untranslated Arabic falls through
 *      to English exactly as before, because the override layer sits on top of
 *      a dictionary that already does that.
 *
 * ── Before editing ──────────────────────────────────────────────────────────
 *
 * This copy is not arbitrary. Every line traces to a decision in
 * `markyos_landing_page_copy.md` — the headline is three verbs because they
 * are the three jobs; the two CTAs carry equal weight because making one
 * primary would tell half the audience they are the wrong half. The voice
 * rules are short sentences, "you" over "we", real nouns over adjectives, no
 * exclamation marks, and none of "revolutionary / seamless / leverage /
 * unlock".
 *
 * Changing a headline here is a positioning decision, not a typo fix.
 */

/** A section's standard text block: eyebrow, headline, body. */
const sectionText = (
  name: string,
  label: string,
  opts: { eyebrow?: boolean; subheadline?: boolean; body?: boolean } = {},
) => ({
  name,
  type: "group" as const,
  label,
  hooks: { afterChange: [revalidateSite] },
  fields: [
    ...(opts.eyebrow
      ? [{ name: "eyebrow", type: "text" as const, localized: true }]
      : []),
    { name: "headline", type: "text" as const, localized: true },
    ...(opts.subheadline
      ? [{ name: "subheadline", type: "textarea" as const, localized: true }]
      : []),
    ...(opts.body
      ? [
          {
            name: "body",
            type: "array" as const,
            label: "Body paragraphs",
            localized: true,
            fields: [{ name: "text", type: "textarea" as const, required: true }],
          },
        ]
      : []),
  ],
});

export const HomePage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  admin: {
    group: "Website content",
    description:
      "Overrides the homepage copy. Every field is optional — leave one empty and the approved copy from the codebase is used. Fill one and it replaces it.",
    preview: () => "/en?draft=true",
  },
  // The website's own copy is admin-only. A section gives someone the blog,
  // not the homepage.
  access: { read: isAdmin, update: isAdmin },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          description:
            "The first screen. The headline is three verbs on purpose: the studio's job, the moment of value, and the company's job.",
          fields: [
            sectionText("hero", "Hero", { eyebrow: true, subheadline: true }),
            {
              name: "heroCtas",
              type: "group",
              label: "Hero buttons",
              admin: {
                description:
                  "Two doors, equal weight. The labels match the sign-up fork, so clicking feels like continuing a decision rather than starting one.",
              },
              fields: [
                { name: "studioLabel", type: "text", localized: true },
                { name: "companyLabel", type: "text", localized: true },
                {
                  name: "microcopy",
                  type: "textarea",
                  localized: true,
                  admin: {
                    description:
                      'The line under the buttons. If a card IS required on the free plan, this must say "Free plan. Cancel anytime." — see docs/BEFORE-PUBLISH.md item 1.',
                  },
                },
              ],
            },
            {
              name: "proofStrip",
              type: "array",
              label: "Proof strip",
              localized: true,
              maxRows: 4,
              admin: {
                description:
                  "Four short facts, each one checkable against the product as it is today. Concrete numbers read as true; adjectives read as marketing. Do not add a fifth.",
              },
              fields: [{ name: "fact", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Problem & shift",
          fields: [
            sectionText("productGlimpse", "Product glimpse", { body: true }),
            sectionText("problem", "The problem — brand decay", {
              eyebrow: true,
              body: true,
            }),
            {
              name: "problemCards",
              type: "array",
              label: "Pain cards",
              localized: true,
              maxRows: 3,
              admin: {
                description:
                  "Exactly three. Each is a scene the reader has lived through — the old logo in the sales deck, not 'inconsistent brand assets'.",
              },
              fields: [
                { name: "headline", type: "text", required: true },
                { name: "line", type: "textarea", required: true },
              ],
            },
            {
              name: "problemTransition",
              type: "text",
              localized: true,
              label: "Transition line",
              admin: {
                description:
                  "Reframes the problem so the solution can only be a place. Load-bearing — the next section depends on it.",
              },
            },
            sectionText("shift", "A brand is a place", { body: true }),
          ],
        },
        {
          label: "Paths",
          fields: [
            sectionText("choosePath", "Choose your path"),
            sectionText("studioPath", "For studios", {
              eyebrow: true,
              subheadline: true,
            }),
            {
              name: "studioSteps",
              type: "array",
              label: "Studio steps",
              localized: true,
              admin: {
                description:
                  "Numbers are generated from the order here, so reordering or removing a step renumbers the rest automatically.",
              },
              fields: [
                { name: "name", type: "text", required: true },
                { name: "headline", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
                { name: "smallPrint", type: "text" },
              ],
            },
            sectionText("handoffLoop", "The handoff loop", { body: true }),
            sectionText("company", "For companies", {
              eyebrow: true,
              subheadline: true,
            }),
          ],
        },
        {
          label: "Tone checker",
          fields: [
            sectionText("toneChecker", "Tone checker", { eyebrow: true }),
            {
              name: "toneCheckerBody",
              type: "textarea",
              localized: true,
              label: "Intro",
            },
            {
              name: "toneCheckerOutputs",
              type: "array",
              label: "What you get back",
              localized: true,
              admin: {
                description:
                  "This list mirrors the product's actual output, field for field. The Arabic register line is the proof of difference on the whole page — keep it.",
              },
              fields: [
                { name: "term", type: "text", required: true },
                { name: "line", type: "text", required: true },
              ],
            },
            {
              name: "toneCheckerPrivacy",
              type: "textarea",
              localized: true,
              label: "Privacy line",
              admin: {
                description:
                  "Answers the question a careful buyer asks before pasting their unreleased copy into someone else's text box. It must stay accurate to what the product does.",
              },
            },
          ],
        },
        {
          label: "Proof & difference",
          fields: [
            sectionText("pillars", "One source of truth"),
            {
              name: "pillarsBody",
              type: "textarea",
              localized: true,
              label: "Intro",
            },
            {
              name: "pillarItems",
              type: "array",
              label: "The three pillars",
              localized: true,
              maxRows: 3,
              fields: [
                { name: "name", type: "text", required: true },
                { name: "headline", type: "text", required: true },
                { name: "line", type: "textarea", required: true },
              ],
            },
            sectionText("bilingual", "Bilingual by design", { eyebrow: true }),
            {
              name: "bilingualBody",
              type: "textarea",
              localized: true,
              label: "Intro",
            },
            {
              name: "bilingualPoints",
              type: "array",
              label: "Proof points",
              localized: true,
              fields: [
                { name: "term", type: "text", required: true },
                { name: "line", type: "text", required: true },
              ],
            },
            sectionText("aiRules", "AI that drafts"),
            {
              name: "aiRulesBody",
              type: "textarea",
              localized: true,
              label: "Intro",
            },
            {
              name: "aiPromises",
              type: "array",
              label: "The four promises",
              localized: true,
              admin: {
                description:
                  "Every one of these is something the product actually enforces. Do not add a fifth that it does not keep.",
              },
              fields: [
                { name: "term", type: "text", required: true },
                { name: "line", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Stack, roadmap & pricing",
          fields: [
            sectionText("replaceStack", "Replace the stack"),
            {
              name: "replaceStackRows",
              type: "array",
              label: "Rows",
              localized: true,
              admin: {
                description:
                  "Competitors are never named here. Name them on a /resources/compare page, where there is room to be fair.",
              },
              fields: [
                { name: "job", type: "text", required: true },
                { name: "usually", type: "text", required: true },
                { name: "markyos", type: "text", required: true },
              ],
            },
            {
              name: "replaceStackLine",
              type: "text",
              localized: true,
              label: "Line under the table",
            },
            sectionText("comingNext", "What's coming next", { subheadline: true }),
            {
              name: "roadmapPhases",
              type: "array",
              label: "Roadmap phases",
              localized: true,
              admin: {
                description:
                  "Seasons, never dates. If a phase slips, 'spring 2027' is still true and '12 March' is a broken promise on a page about not breaking promises.",
              },
              fields: [
                { name: "season", type: "text", required: true },
                { name: "theme", type: "text", required: true },
                {
                  name: "items",
                  type: "array",
                  fields: [{ name: "text", type: "text", required: true }],
                },
              ],
            },
            sectionText("pricingTeaser", "Pricing teaser"),
            {
              name: "pricingNotes",
              type: "group",
              label: "Pricing notes",
              admin: {
                description:
                  "Prices themselves stay in the codebase until the beta pricing test closes on 1 Feb 2027 — see docs/BEFORE-PUBLISH.md item 3.",
              },
              fields: [
                { name: "studioNote", type: "textarea", localized: true },
                { name: "companyNote", type: "textarea", localized: true },
                { name: "underBoth", type: "textarea", localized: true },
              ],
            },
          ],
        },
        {
          label: "Founder, FAQ & close",
          fields: [
            sectionText("founderNote", "Founder note", { body: true }),
            {
              name: "founderSignature",
              type: "text",
              localized: true,
              label: "Signature",
            },
            sectionText("faq", "FAQ"),
            {
              name: "faqItems",
              type: "array",
              label: "Questions",
              localized: true,
              admin: {
                description:
                  "If an answer mentions something that has not shipped yet, say so in the answer — the FAQ must not become the one place on the site that over-promises.",
              },
              fields: [
                { name: "question", type: "text", required: true },
                { name: "answer", type: "textarea", required: true },
              ],
            },
            sectionText("finalCta", "Final CTA", { subheadline: true }),
            {
              name: "finalCtaButtons",
              type: "group",
              label: "Final CTA buttons",
              fields: [
                { name: "studioLabel", type: "text", localized: true },
                { name: "companyLabel", type: "text", localized: true },
                { name: "microcopy", type: "textarea", localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
