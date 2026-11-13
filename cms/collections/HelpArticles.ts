import type { CollectionConfig } from "payload";
import { revalidateDoc } from "../hooks/revalidate";
import { hideUnlessSection, publishAccess, sectionAccess } from "../access";
import {
  ogImageField,
  provisionalField,
  publishedAtField,
  richText,
  seoFields,
  slugField,
} from "../fields";

/*
 * Help centre → /help
 *
 * No author and no hero image. A help article is maintenance documentation,
 * not writing with a byline, and every field that does not earn its place is a
 * field someone has to skip past on every edit.
 *
 * It did not have a date or an excerpt either, on that reasoning, and both
 * were wrong in a way that only showed once the collection had rows in it.
 * `listArticles` asks every editorial collection for `-publishedAt`, so the
 * help centre was being sorted by a column it did not have. And the excerpt
 * is what a help article is described as everywhere it is not being read: the
 * article page prints it under the heading, and it is the search description
 * when no SEO override is set, so without it every help result in Google was
 * going to be Google's own guess at one.
 *
 * Neither is printed on the index, which lists these by category and reading
 * time. The date orders the list and nothing else.
 */

export const HelpArticles: CollectionConfig = {
  slug: "helpArticles",
  labels: { singular: "Help article", plural: "Help centre" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    group: "Resources",
    description: "How the product works, answered one question at a time.",
    hidden: hideUnlessSection("helpArticles"),
    preview: (doc) => (doc?.slug ? `/en/help/${doc.slug}?draft=true` : null),
  },
  // Section-scoped: see cms/access.ts. Enforced here as well as in
  // `admin.hidden` above, because hiding alone is cosmetic.
  access: sectionAccess("helpArticles"),
  hooks: { afterChange: [revalidateDoc("/help")] },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    slugField("title"),
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      maxLength: 300,
      admin: {
        description:
          "One or two sentences. Shown under the heading on the article, and used as the search description when no SEO override is set.",
      },
    },
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
    ogImageField,
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
