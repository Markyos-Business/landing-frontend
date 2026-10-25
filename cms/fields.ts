import type { Field } from "payload";
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";

/*
 * Field helpers shared across collections.
 *
 * Everything here exists because the same four or five decisions recur in
 * every collection, and making them once is what keeps a blog post and a help
 * article behaving the same way.
 */

/**
 * The slug.
 *
 * **Not localized, on purpose.** One slug per document means `/en/blog/x` and
 * `/ar/blog/x` are the same article in two languages, which is what the
 * hreflang pair on every page claims. Localizing it would produce two URLs
 * that no crawler could pair up, and a language switcher that could only ever
 * return the reader to the index.
 */
export const slugField = (source = "title"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description:
      "The URL segment. Shared across both languages. Changing it on a published page breaks every existing link — add a redirect if you do.",
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        // Only auto-fill an empty slug. Once a document is published its slug
        // is a URL other people have linked to, and silently regenerating it
        // from an edited title would break those links.
        if (typeof value === "string" && value.length > 0) return value;

        const raw = (data?.[source] as string | undefined) ?? "";
        return (
          raw
            .toLowerCase()
            .trim()
            // Keep Arabic letters: a post titled in Arabic should get a
            // readable Arabic slug rather than an empty one.
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80) || undefined
        );
      },
    ],
  },
});

/**
 * The rich text editor.
 *
 * This is the "professional text editor": Lexical, with a fixed toolbar across
 * the top (so the controls are always visible rather than appearing on
 * selection), an inline toolbar on selection, headings h2–h4, links that can
 * point at other documents in the CMS rather than only at raw URLs, inline
 * image uploads, and horizontal rules.
 *
 * Headings start at h2 because the page template owns the h1. Offering h1 here
 * means every article eventually ships with two of them, which is a real
 * accessibility and SEO problem that is invisible to the person writing.
 *
 * RTL is handled by Lexical per block: an Arabic paragraph shapes and aligns
 * correctly inline, without the writer toggling anything.
 */
export const richText = () =>
  lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
      HorizontalRuleFeature(),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: "caption",
                type: "text",
                localized: true,
                label: "Caption",
              },
            ],
          },
        },
      }),
      LinkFeature({
        enabledCollections: ["posts", "guides", "helpArticles", "comparisons"],
      }),
      BlocksFeature({ blocks: [] }),
    ],
  });

/**
 * SEO overrides.
 *
 * Localized, because a title that fits 60 characters in English rarely fits in
 * Arabic — and the Arabic page is competing in a different search result with
 * different terms.
 *
 * Both are optional: empty means the page falls back to its own title and
 * excerpt, which is right most of the time. A field that must be filled to
 * publish is a field that gets filled with a copy of the title.
 */
export const seoFields: Field = {
  type: "collapsible",
  label: "SEO",
  admin: { initCollapsed: true },
  fields: [
    {
      name: "seoTitle",
      type: "text",
      localized: true,
      maxLength: 70,
      admin: {
        description:
          "Overrides the browser tab and search result title. Aim for 60 characters. Leave empty to use the title above.",
      },
    },
    {
      name: "seoDescription",
      type: "textarea",
      localized: true,
      maxLength: 180,
      admin: {
        description:
          "The grey line under the search result. Aim for 155 characters. Leave empty to use the excerpt.",
      },
    },
  ],
};

/**
 * The publication date.
 *
 * In the sidebar and not localized: an article is published once, whatever
 * language it is read in.
 */
export const publishedAtField: Field = {
  name: "publishedAt",
  type: "date",
  admin: {
    position: "sidebar",
    date: { pickerAppearance: "dayAndTime" },
    description: "Used for ordering and shown on the article.",
  },
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        // Stamp it on first publish so nobody has to remember. An explicitly
        // set date is always kept — backdating an article is legitimate.
        if (value) return value;
        if (siblingData?._status === "published") return new Date();
        return value;
      },
    ],
  },
};
