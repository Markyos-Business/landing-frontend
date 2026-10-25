import type { CollectionConfig } from "payload";
import { hideUnlessAdmin, isAdmin } from "../access";

/*
 * Page views.
 *
 * ── Why first-party, and why no cookies ─────────────────────────────────────
 *
 * This site tells visitors, on the page, that their text is checked and not
 * kept. Loading a third-party analytics script that follows them around the
 * web would contradict that in the one place it is hardest to defend. It would
 * also mean a cookie banner on the hero, which costs more conversions than the
 * data is worth.
 *
 * So views are counted here, in the same database as everything else, with no
 * cookie and no stored IP address.
 *
 * ── How a repeat visit is recognised without a cookie ───────────────────────
 *
 * `visitor` is a hash of the IP address, the user agent and a salt that
 * changes every day. That makes a visitor recognisable *within* a day, so
 * "visits" and "visitors" can differ, and unrecognisable the next — the salt
 * that would be needed to link the two is gone. It is not reversible to an IP,
 * and it cannot be used to follow anybody anywhere else.
 *
 * ── On volume ───────────────────────────────────────────────────────────────
 *
 * One row per view, aggregated by query. That is the right shape at this
 * scale and the wrong one eventually: past roughly a million rows the
 * dashboard's counts want a nightly rollup into a daily-totals table rather
 * than a scan. The fields below are chosen so that rollup is a straight
 * GROUP BY when it is needed.
 */

export const Pageviews: CollectionConfig = {
  slug: "pageviews",
  labels: { singular: "Page view", plural: "Page views" },
  admin: {
    group: "Settings",
    // The dashboard is how these are read. The raw list is 50,000 rows of
    // machine data and would only ever be opened by accident.
    hidden: hideUnlessAdmin,
    useAsTitle: "path",
    defaultColumns: ["path", "locale", "device", "createdAt"],
  },
  access: {
    // Written by the tracking endpoint via the Local API, which bypasses
    // access control. Nothing authenticated should be able to forge a view,
    // so create is closed here.
    create: () => false,
    read: isAdmin,
    update: () => false,
    delete: isAdmin,
  },
  // No drafts, no versions: an event is written once and never edited.
  timestamps: true,
  fields: [
    {
      name: "path",
      type: "text",
      required: true,
      index: true,
      admin: { description: "Path without the locale prefix, e.g. /pricing" },
    },
    {
      name: "locale",
      type: "select",
      options: ["ar", "en"],
      index: true,
    },
    {
      name: "device",
      type: "select",
      options: ["mobile", "tablet", "desktop"],
      index: true,
    },
    {
      name: "referrerHost",
      type: "text",
      index: true,
      admin: {
        description:
          "The host that linked here, never the full URL — a full referrer can carry someone's search terms or a private document title.",
      },
    },
    {
      name: "visitor",
      type: "text",
      index: true,
      admin: { description: "Daily-rotating hash. Not an identity, and not reversible." },
    },
    {
      name: "country",
      type: "text",
      index: true,
      admin: { description: "From the CDN's geo header when one is present." },
    },
  ],
};
