import type { CollectionConfig } from "payload";
import { revalidateDoc } from "../hooks/revalidate";
import { hideUnlessSection, publishAccess, sectionAccess } from "../access";
import { publishedAtField, richText, seoFields, slugField } from "../fields";

/*
 * Blog posts → /resources/blog
 *
 * The shape every editorial collection follows, and the one to copy when
 * adding another.
 *
 * **One document holds both languages.** Title, excerpt and body are
 * `localized: true`, so an editor switches locale with the toggle at the top
 * of the editor rather than opening a second document. Two documents would
 * drift — different hero images, one updated and the other not — which is the
 * same failure this product exists to prevent, in our own CMS.
 */

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Blog post", plural: "Blog posts" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    group: "Content",
    description: "Writing about brand strategy, bilingual identity and running a studio.",
    hidden: hideUnlessSection("posts"),
    preview: (doc) =>
      doc?.slug ? `/en/resources/blog/${doc.slug}?draft=true` : null,
  },
  // Section-scoped: see cms/access.ts. Enforced here as well as in
  // `admin.hidden` above, because hiding alone is cosmetic.
  access: sectionAccess("posts"),
  hooks: { afterChange: [revalidateDoc("/resources/blog")] },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    slugField("title"),
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      maxLength: 300,
      admin: {
        description:
          "One or two sentences. Shown on the blog index and used as the search description when no SEO override is set.",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Shared across both languages. Its alt text is localized on the image itself.",
      },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      editor: richText(),
      admin: {
        description: "The article. Headings start at H2 — the page supplies the H1.",
      },
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
      admin: { position: "sidebar" },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      admin: { position: "sidebar" },
    },
    publishedAtField,
    {
      name: "_status",
      type: "select",
      // Payload manages drafts itself; this field exists only to carry the
      // field-level access rule that stops an editor publishing. Hidden,
      // because the Publish button is the real control.
      hidden: true,
      options: ["draft", "published"],
      access: { update: publishAccess },
    },
    seoFields,
  ],
};
