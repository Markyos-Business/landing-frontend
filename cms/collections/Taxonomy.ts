import type { CollectionConfig } from "payload";
import { supportingAccess, taxonomyAccess } from "../access";
import { slugField } from "../fields";

/*
 * Authors, categories and tags.
 *
 * Small, shared, and grouped into one file because they are one idea: the
 * things a post points at. Splitting them across three files would mean three
 * places to look for a field that is the same in all of them.
 *
 * Labels are localized; slugs are not, for the same reason as everywhere else
 * — one URL per concept, in both languages.
 */

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
    group: "Taxonomy",
    defaultColumns: ["name", "role"],
  },
  access: supportingAccess,
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "text",
      localized: true,
      admin: { description: "Shown under the byline. For example: Co-founder." },
    },
    { name: "bio", type: "textarea", localized: true },
    { name: "avatar", type: "upload", relationTo: "media" },
  ],
};

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "label",
    group: "Taxonomy",
    description: "Shared by blog posts and help articles.",
  },
  access: taxonomyAccess,
  fields: [
    { name: "label", type: "text", required: true, localized: true },
    slugField("label"),
  ],
};

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: { useAsTitle: "label", group: "Taxonomy" },
  access: taxonomyAccess,
  fields: [
    { name: "label", type: "text", required: true, localized: true },
    slugField("label"),
  ],
};
