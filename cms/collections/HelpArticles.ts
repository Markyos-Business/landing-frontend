import type { CollectionConfig } from "payload";
import { revalidateDoc } from "../hooks/revalidate";
import { hideUnlessSection, publishAccess, sectionAccess } from "../access";
import { richText, seoFields, slugField } from "../fields";

/*
 * Help centre → /resources/help
 *
 * No author, no hero image, no publication date. A help article is
 * maintenance documentation, not writing with a byline — and every field that
 * does not earn its place is a field someone has to skip past on every edit.
 */

export const HelpArticles: CollectionConfig = {
  slug: "helpArticles",
  labels: { singular: "Help article", plural: "Help centre" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "_status"],
    group: "Content",
    description: "How the product works, answered one question at a time.",
    hidden: hideUnlessSection("helpArticles"),
    preview: (doc) => (doc?.slug ? `/en/resources/help/${doc.slug}?draft=true` : null),
  },
  // Section-scoped: see cms/access.ts. Enforced here as well as in
  // `admin.hidden` above, because hiding alone is cosmetic.
  access: sectionAccess("helpArticles"),
  hooks: { afterChange: [revalidateDoc("/resources/help")] },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    slugField("title"),
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      admin: {
        position: "sidebar",
        description: "Getting started, Billing, RTL setup, and so on.",
      },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      editor: richText(),
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
