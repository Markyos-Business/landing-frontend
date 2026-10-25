import type { CollectionConfig } from "payload";
import { revalidateDoc } from "../hooks/revalidate";
import { hideUnlessSection, publishAccess, sectionAccess } from "../access";
import { richText, seoFields, slugField } from "../fields";

/*
 * Comparison pages → /resources/compare/[slug]
 *
 * The one collection that benefits from structured fields rather than free
 * rich text. The comparison table has to render identically on every page, and
 * a hand-built HTML table inside a rich text field would be rebuilt slightly
 * differently every time — different column counts, a missing header, a row
 * that does not wrap on a phone.
 *
 * As structured rows, the table is data, the template owns the rendering, and
 * a fairness review can read the rows rather than the markup.
 *
 * Copy doc §4.14: competitors are never named on the homepage. They are named
 * here, where there is room to be fair and specific.
 */

export const Comparisons: CollectionConfig = {
  slug: "comparisons",
  labels: { singular: "Comparison", plural: "Comparisons" },
  admin: {
    useAsTitle: "competitorName",
    defaultColumns: ["competitorName", "slug", "_status"],
    group: "Content",
    description: "Markyos versus the tools studios use today.",
    hidden: hideUnlessSection("comparisons"),
    preview: (doc) => (doc?.slug ? `/en/resources/compare/${doc.slug}?draft=true` : null),
  },
  // Section-scoped: see cms/access.ts. Enforced here as well as in
  // `admin.hidden` above, because hiding alone is cosmetic.
  access: sectionAccess("comparisons"),
  hooks: { afterChange: [revalidateDoc("/resources/compare")] },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    {
      name: "competitorName",
      type: "text",
      required: true,
      admin: { description: "Not localized — a product name is a product name." },
    },
    slugField("competitorName"),
    {
      name: "intro",
      type: "richText",
      localized: true,
      editor: richText(),
      admin: { description: "The positioning copy above the table." },
    },
    {
      name: "comparisonRows",
      type: "array",
      localized: true,
      labels: { singular: "Row", plural: "Rows" },
      admin: {
        description:
          "One row per capability. State their side accurately — a comparison that overstates is the kind of thing that gets quoted back at you.",
      },
      fields: [
        { name: "feature", type: "text", required: true },
        { name: "competitor", type: "text", required: true },
        { name: "markyos", type: "text", required: true },
      ],
    },
    {
      name: "objectionHandling",
      type: "array",
      localized: true,
      labels: { singular: "Objection", plural: "Objections" },
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "richText", editor: richText() },
      ],
    },
    {
      name: "_status",
      type: "select",
      hidden: true,
      options: ["draft", "published"],
      access: { update: publishAccess },
    },
    seoFields,
  ],
};
