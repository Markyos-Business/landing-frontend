import type { GlobalConfig } from "payload";
import { revalidateSite } from "../hooks/revalidate";
import { isAdmin } from "../access";

/*
 * Header and footer links.
 *
 * Here so links can be renamed or reordered without a deploy — the thing most
 * often wanted and least often worth a pull request.
 *
 * Same override rule as the homepage: empty means the codebase's navigation
 * renders. A CMS that owns the nav outright means an empty database is a site
 * with no way to get anywhere.
 *
 * Keep the header to five items. The 4–7 item ceiling is not a style
 * preference — past it, people stop reading the nav and start hunting.
 */

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  admin: {
    group: "Website content",
    description: "Header and footer links. Leave empty to use the built-in navigation.",
  },
  access: { read: isAdmin, update: isAdmin },
  versions: { drafts: false, max: 10 },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: "header",
      type: "array",
      label: "Header links",
      localized: true,
      maxRows: 7,
      admin: {
        description:
          "Audiences first — the first question a visitor to a two-audience site has is 'is this for me?'.",
      },
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "href",
          type: "text",
          required: true,
          admin: {
            description:
              "A path without the language, like /studios. The language is added automatically.",
          },
        },
      ],
    },
    {
      name: "footerColumns",
      type: "array",
      label: "Footer columns",
      localized: true,
      fields: [
        { name: "heading", type: "text", required: true },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "footerLine",
      type: "text",
      localized: true,
      label: "Footer line",
      admin: {
        description:
          "The closing line. It repeats the hero's eyebrow on purpose, so the page ends on a claim rather than a sitemap.",
      },
    },
  ],
};
