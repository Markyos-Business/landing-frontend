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
 * What's new → /whats-new
 *
 * The release notes: what shipped, when, and what it means for the person
 * reading. One entry per release, dated, newest first.
 *
 * ── Why it is a collection and not a page ─────────────────────────────────
 *
 * `/whats-new` was one of the six things the site's own `/resources` page
 * listed with nothing behind it, and the obvious cheap answer — a page under
 * `content/pages/` with the updates stacked on it — is wrong for this one.
 * A release note is written on the day it ships, by whoever shipped it, and
 * it never stops being written. That is the definition of the content the
 * CMS exists for, and the opposite of the page copy that lives in the repo
 * because it changes with the design.
 *
 * ── Why it reuses the article template ────────────────────────────────────
 *
 * An update is an article with a date on it: a title, a lead, a body of
 * headings and lists, and a cover. `components/page/editorial/` already
 * renders exactly that for the blog, the guides and the help centre, so this
 * collection is deliberately shaped like Posts rather than inventing fields
 * for itself. The one thing it does not have is an author — a release note
 * is the company talking, not a byline.
 *
 * `publishedAt` is the release date and it is the whole ordering of the
 * section, so unlike the help centre this one prints it.
 */

export const Updates: CollectionConfig = {
  slug: "updates",
  labels: { singular: "Update", plural: "What's new" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "_status"],
    group: "Resources",
    description: "Release notes: what shipped, when, and what it means.",
    hidden: hideUnlessSection("updates"),
    preview: (doc) => (doc?.slug ? `/en/whats-new/${doc.slug}?draft=true` : null),
  },
  access: sectionAccess("updates"),
  hooks: { afterChange: [revalidateDoc("/whats-new")] },
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
          "One or two sentences. Shown on the What's new index and used as the search description when no SEO override is set.",
      },
    },
    heroImageField,
    ogImageField,
    {
      name: "body",
      type: "richText",
      localized: true,
      editor: richText(),
      admin: {
        description: "The note. Headings start at H2 — the page supplies the H1.",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      admin: {
        position: "sidebar",
        description: "Optional. The release, or the area it touches.",
      },
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
