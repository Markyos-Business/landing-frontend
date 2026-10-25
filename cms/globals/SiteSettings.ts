import type { GlobalConfig } from "payload";
import { revalidateSite } from "../hooks/revalidate";
import { isAdmin } from "../access";

/*
 * Site-wide metadata.
 *
 * The title and description that appear in a search result and on a shared
 * link. Separated from the homepage global because they are not page copy —
 * they are what the site is called, and they belong with the social image
 * rather than with the hero.
 */

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  label: "Site settings",
  admin: {
    group: "Settings",
    description: "Search and social metadata. Leave empty to use the built-in values.",
  },
  access: { read: isAdmin, update: isAdmin },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: "metaTitle",
      type: "text",
      localized: true,
      maxLength: 70,
      admin: { description: "Aim for 60 characters. Shown in the browser tab and search results." },
    },
    {
      name: "metaDescription",
      type: "textarea",
      localized: true,
      maxLength: 180,
      admin: { description: "Aim for 155 characters. The grey line under the search result." },
    },
    {
      name: "ogTitle",
      type: "text",
      localized: true,
      admin: { description: "The headline on a shared link. May differ from the page title." },
    },
    {
      name: "ogDescription",
      type: "textarea",
      localized: true,
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      localized: true,
      admin: {
        description:
          "1200x630. Localized, because the card should be in the reader's language. Without one, every share of this link renders a blank card.",
      },
    },
  ],
};
