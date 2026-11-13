import type { CollectionConfig } from "payload";
import { revalidateDoc } from "../hooks/revalidate";
import { hideUnlessSection, publishAccess, sectionAccess } from "../access";
import {
  heroImageField,
  ogImageField,
  provisionalField,
  publishedAtField,
  richText,
  seoFields,
  slugField,
} from "../fields";

/*
 * Comparison pages → /compare/[slug]
 *
 * Markyos against the tools studios use today, one page per tool.
 *
 * Copy doc §4.14: competitors are never named on the homepage. They are
 * named here, where there is room to be fair and specific.
 *
 * ── This used to be a structured table, and the writing did not fit ───────
 *
 * The collection was built around `comparisonRows` (feature / competitor /
 * markyos) and `objectionHandling` (question / answer), on the reasoning
 * that a comparison table has to render identically on every page and that a
 * fairness review should be able to read rows rather than markup. Both are
 * good arguments and neither survived contact with the ten comparison pages
 * that were actually written.
 *
 * A real one is an article: a lead, a capability table, "when they suit you
 * better", "when we suit you better", how to switch, and a dated line saying
 * when their pricing was last checked. The table is one section of it, and
 * the sections around it are not objections with answers — they are the part
 * that makes the page fair.
 *
 * So this is shaped like Posts now, and the capability table is a table in
 * the body: `richText()` has the table feature on, which is most of why it
 * is on. Nothing was lost in the change because the collection was empty.
 *
 * The fairness argument still holds, and it moved rather than went away:
 * every page carries the date its facts were checked, in its own last line,
 * because competitor pricing moves and a comparison that quietly goes stale
 * is worse than no comparison. See BEFORE-PUBLISH item 24.
 */

export const Comparisons: CollectionConfig = {
  slug: "comparisons",
  labels: { singular: "Comparison", plural: "Comparisons" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "competitorName", "publishedAt", "_status"],
    group: "Resources",
    description: "Markyos versus the tools studios use today.",
    hidden: hideUnlessSection("comparisons"),
    preview: (doc) => (doc?.slug ? `/en/compare/${doc.slug}?draft=true` : null),
  },
  access: sectionAccess("comparisons"),
  hooks: { afterChange: [revalidateDoc("/compare")] },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: 'The page heading, for example "Markyos vs Endform".',
      },
    },
    slugField("title"),
    {
      name: "competitorName",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          "Not localized — a product name is a product name. Used in the admin list, not printed on the page.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      maxLength: 300,
      admin: { description: "Shown on the /compare index." },
    },
    heroImageField,
    ogImageField,
    {
      name: "body",
      type: "richText",
      localized: true,
      editor: richText(),
      admin: {
        description:
          "The comparison. Headings start at H2 — the page supplies the H1. The capability table is a table here.",
      },
    },
    publishedAtField,
    provisionalField,
    {
      name: "_status",
      type: "select",
      hidden: true,
      options: ["draft", "published"],
      access: { create: publishAccess, update: publishAccess },
    },
    seoFields,
  ],
};
