import type { CollectionConfig } from "payload";
import { supportingAccess } from "../access";

/*
 * The media library.
 *
 * Local disk in development; Cloudflare R2 in production via the S3 storage
 * adapter wired in payload.config.ts — the same bucket as brand assets with
 * its own key prefix, so there is no second storage vendor.
 *
 * The sizes below are generated on upload. They exist so an article's hero
 * image is not a 4MB PNG served to a phone on a Gulf mobile network, which is
 * most of what performance on this site will come down to.
 */

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    /*
     * Its own group, not "Resources".
     *
     * The four things in Resources each render as a page on the site and each
     * map to one card on the dashboard. Media renders inside them. Filed
     * together, the sidebar read as five peers and the one that is not a
     * resource sat in the middle of them.
     */
    group: "Library",
    description: "Images and files used across the site.",
  },
  // Anyone with a section can upload: an article without an image is not a
  // finished article. Deleting stays with admins.
  access: supportingAccess,
  upload: {
    mimeTypes: ["image/*", "application/pdf", "font/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "hero", width: 1600, height: 900, position: "centre" },
      // 1200×630 is the Open Graph card. Generating it here means a social
      // image can be picked from the library rather than exported by hand.
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    focalPoint: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description:
          "What the image shows, for screen readers and for when it fails to load. Localized — describe it in each language. If the image is purely decorative, write a single space.",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: {
        description: "Photographer or source, where one is required.",
      },
    },
  ],
};
