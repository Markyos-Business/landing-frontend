import type { GlobalConfig } from "payload";
import { revalidateSite } from "../hooks/revalidate";
import { isAdmin } from "../access";

/*
 * The announcement bar.
 *
 * Two versions exist and exactly one is true at a time. Which one shows is
 * decided by NEXT_PUBLIC_LAUNCH_PHASE, not here — so this edits the words
 * while the environment decides the moment.
 *
 * The beta numbers must stay the real beta sizes. Scarcity that is true
 * creates urgency; scarcity that is invented is the one thing on this page
 * that could cost you a studio's trust permanently.
 */

export const Announcement: GlobalConfig = {
  slug: "announcement",
  label: "Announcement bar",
  admin: {
    group: "Website content",
    description:
      "The strip above the header. Leave empty to use the built-in copy. Which version shows is set by the launch phase, not here.",
  },
  access: { read: isAdmin, update: isAdmin },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Uncheck to hide the bar entirely." },
    },
    {
      name: "beta",
      type: "group",
      label: "Before launch (beta)",
      fields: [
        { name: "text", type: "textarea", localized: true },
        { name: "ctaLabel", type: "text", localized: true },
        { name: "ctaHref", type: "text" },
      ],
    },
    {
      name: "live",
      type: "group",
      label: "After launch (public)",
      fields: [
        { name: "text", type: "textarea", localized: true },
        { name: "ctaLabel", type: "text", localized: true },
        { name: "ctaHref", type: "text" },
      ],
    },
  ],
};
