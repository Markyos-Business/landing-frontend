import type { Field } from "payload";
import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
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
 *
 * **Tables are on.** The feature carries `EXPERIMENTAL_` in Lexical's own
 * naming and it is enabled anyway, because the writing needs it: the
 * comparison pages are built around a capability table, the blog posts
 * contrast brand strategy against marketing strategy in one, and the
 * templates in the guides are tables with a column per language. The
 * alternative was a list pretending to be a table, which is worse for a
 * screen reader and worse to read. `.mk-prose` in globals.css styles them,
 * and the renderer takes them from `defaultConverters`.
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
        enabledCollections: ["posts", "guides", "helpArticles", "comparisons", "updates"],
      }),
      BlocksFeature({ blocks: [] }),
      EXPERIMENTAL_TableFeature(),
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
      /*
       * 80, not 70.
       *
       * 70 was a guardrail rather than a limit, and it turned into a limit:
       * three of the written comparison titles are 71 to 77 characters, and
       * the cap refused the save rather than warning about it. A cap that
       * blocks real writing teaches people to work around it. 60 is still
       * the aim, Google still truncates somewhere near it, and the
       * description says so.
       */
      maxLength: 80,
      admin: {
        description:
          "Overrides the browser tab and search result title. Aim for 60 characters — search results cut off past roughly 60, so a longer one is not wrong but will not be read in full. Leave empty to use the title above.",
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

/**
 * Placeholder, not finished writing.
 *
 * The blog, the guides and the help centre launched with thirty-one pieces
 * written so the designs could be reviewed against real-length Arabic rather
 * than an empty state. The titles and angles are from the copy deck; the
 * bodies have not been through the review the page copy has.
 *
 * That flag used to be a constant in a second, code-level content source, set
 * on everything that source returned, which meant the only way to promote a
 * piece to finished writing was to edit code. It is a field now, so the person who
 * rewrites the article is the person who clears it, in the same screen, on the
 * same save.
 *
 * Two things read it: the article template renders a notice, and the index
 * sets `noindex` while every piece on it is still ticked. Placeholder prose
 * that ranks is placeholder prose that gets cited.
 *
 * **Not localized**, like `slug` and `publishedAt`: it describes the piece
 * rather than one translation of it. A piece is being written or it is
 * written, and a half-ticked document would be a state nobody could act on.
 */
export const provisionalField: Field = {
  name: "provisional",
  type: "checkbox",
  defaultValue: false,
  label: "Placeholder content",
  admin: {
    position: "sidebar",
    description:
      "Tick while this is written to fill a layout. The page shows a notice and the index stays out of search. Clear it when the real piece is written.",
  },
};

/**
 * The cover image.
 *
 * **Localized**, which an image field usually should not be. The reason is
 * specific to this site: the covers carry type, and the Arabic ones are set
 * in Arabic. They are not the same picture with a different caption — they
 * are different files, and the Arabic article showing the English cover
 * would be the exact failure the whole product argues against.
 *
 * The alt text is localized on the Media document itself, so each cover
 * carries its own description in its own language and neither side has to
 * repeat it here.
 */
export const heroImageField: Field = {
  name: "heroImage",
  type: "upload",
  relationTo: "media",
  localized: true,
  admin: {
    position: "sidebar",
    description:
      "1600x900. Set one per language: the Arabic cover is typeset in Arabic, so it is a different file rather than a translation.",
  },
};

/**
 * The social card image.
 *
 * `src/lib/seo.ts` has carried a placeholder since the site was built — one
 * `/brand/og-{locale}.png` for every page — under a comment saying not to
 * ship without the real thing, because a link with no card is a link nobody
 * clicks. The written resources arrived with one per piece per language at
 * exactly 1200×630, which is what this field is for.
 *
 * Localized for the same reason the cover is: the cards carry type, and the
 * Arabic one is set in Arabic.
 *
 * Optional. Without it the page falls back to the site-wide card, which is
 * the right default for a piece nobody has made one for.
 */
export const ogImageField: Field = {
  name: "ogImage",
  type: "upload",
  relationTo: "media",
  localized: true,
  admin: {
    position: "sidebar",
    description:
      "1200x630, shown when the page is shared. Leave empty to use the site-wide card.",
  },
};
