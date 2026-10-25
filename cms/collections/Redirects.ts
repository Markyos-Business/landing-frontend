import type { CollectionConfig } from "payload";
import { adminOnly, hideUnlessAdmin } from "../access";

/*
 * Redirects.
 *
 * This collection operationalizes the site-architecture rule that every
 * changed URL needs a redirect. Without it, that rule depends on someone
 * remembering to open a pull request at the exact moment they rename a slug —
 * which is the moment they are thinking about the slug, not about the twelve
 * places the old one is linked from.
 *
 * Read by proxy.ts on a 404, so an editor can fix a broken link without a
 * deploy.
 */

export const Redirects: CollectionConfig = {
  slug: "redirects",
  admin: {
    useAsTitle: "from",
    defaultColumns: ["from", "to", "type"],
    group: "Settings",
    description: "Send an old URL to a new one. Add one whenever you change a slug.",
    hidden: hideUnlessAdmin,
  },
  // Read stays open: proxy.ts resolves redirects for anonymous visitors.
  access: { ...adminOnly, read: () => true },
  fields: [
    {
      name: "from",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "The old path, without the language. For example /resources/blog/old-name",
      },
    },
    {
      name: "to",
      type: "text",
      required: true,
      admin: { description: "Where it should go. Same format, or a full URL." },
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "301",
      options: [
        { label: "301 — permanent (the page moved for good)", value: "301" },
        { label: "302 — temporary (it will come back)", value: "302" },
      ],
      admin: {
        description:
          "Use 301 unless you genuinely mean to move it back. Browsers cache a 301 hard, and undoing one is difficult.",
      },
    },
  ],
};
