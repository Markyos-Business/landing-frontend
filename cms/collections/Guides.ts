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
 * Guides and templates → /guides
 *
 * Posts, plus a downloadable file. The file is the point of a guide — the
 * voice-matrix template, the handoff checklist — so it is the one thing on
 * this collection that is not shared with Posts.
 *
 * It had neither an author nor a category, which the template did not agree
 * with: a guide page renders a byline and the guide cards are typeset from a
 * category the same way the blog cards are. Without them every cover fell
 * back to its placeholder word, no pill rendered, and the byline was missing
 * from writing that has one. Both are here now, and both are the same fields
 * Posts uses — the guides are categorised by audience rather than subject
 * (who the checklist is for) and share the `categories` collection.
 *
 * That gap was invisible while the guides were placeholder objects in code,
 * which supplied a byline the schema had no room for. Importing them is what
 * surfaced it.
 */

export const Guides: CollectionConfig = {
  slug: "guides",
  labels: { singular: "Guide", plural: "Guides and templates" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "guideType", "publishedAt", "_status"],
    group: "Resources",
    description: "Downloadable checklists, templates and worksheets.",
    hidden: hideUnlessSection("guides"),
    preview: (doc) => (doc?.slug ? `/en/guides/${doc.slug}?draft=true` : null),
  },
  // Section-scoped: see cms/access.ts. Enforced here as well as in
  // `admin.hidden` above, because hiding alone is cosmetic.
  access: sectionAccess("guides"),
  hooks: { afterChange: [revalidateDoc("/guides")] },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    slugField("title"),
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      maxLength: 300,
      admin: { description: "Shown on the guides index." },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      admin: { position: "sidebar" },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      admin: {
        position: "sidebar",
        description:
          "Who the guide is for. Shown as the cover word and the pill on the index, the same as on a blog post.",
      },
    },
    {
      name: "guideType",
      type: "select",
      options: [
        { label: "Checklist", value: "checklist" },
        { label: "Template", value: "template" },
        { label: "Worksheet", value: "worksheet" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "downloadFile",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "The PDF or template the reader came for.",
      },
    },
    heroImageField,
    ogImageField,
    {
      name: "body",
      type: "richText",
      localized: true,
      editor: richText(),
    },
    publishedAtField,
    provisionalField,
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
