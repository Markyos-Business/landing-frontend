import type { CollectionConfig } from "payload";
import { revalidateDoc } from "../hooks/revalidate";
import { hideUnlessSection, publishAccess, sectionAccess } from "../access";
import { publishedAtField, richText, seoFields, slugField } from "../fields";

/*
 * Guides and templates → /resources/guides
 *
 * Posts, plus a downloadable file. The file is the point of a guide — the
 * voice-matrix template, the handoff checklist — so it is the one thing on
 * this collection that is not shared with Posts.
 */

export const Guides: CollectionConfig = {
  slug: "guides",
  labels: { singular: "Guide", plural: "Guides and templates" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "guideType", "publishedAt", "_status"],
    group: "Content",
    description: "Downloadable checklists, templates and worksheets.",
    hidden: hideUnlessSection("guides"),
    preview: (doc) => (doc?.slug ? `/en/resources/guides/${doc.slug}?draft=true` : null),
  },
  // Section-scoped: see cms/access.ts. Enforced here as well as in
  // `admin.hidden` above, because hiding alone is cosmetic.
  access: sectionAccess("guides"),
  hooks: { afterChange: [revalidateDoc("/resources/guides")] },
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
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: { position: "sidebar" },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      editor: richText(),
    },
    publishedAtField,
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
