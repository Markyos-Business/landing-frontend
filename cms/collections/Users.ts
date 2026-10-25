import type { CollectionConfig } from "payload";
import {
  SECTIONS,
  SECTION_LABELS,
  hideUnlessAdmin,
  isAdminFieldLevel,
  isAdminUser,
} from "../access";

/*
 * Admin accounts.
 *
 * Payload's own email-and-password auth, swappable for SSO later without
 * touching anything else — which matches the roadmap's note that SSO is a
 * v5.0, deal-justified addition rather than a day-one need.
 *
 * The two permission fields are `role` and `sections`. See cms/access.ts for
 * what each one does and why there are two.
 */

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  hooks: {
    beforeChange: [
      /*
       * The first account is always an admin.
       *
       * The role field defaults to "editor", which is right for every account
       * created afterwards and a trap for the first one: Payload's
       * create-first-user screen shows that default, and accepting it would
       * produce a system whose only account cannot publish, cannot edit the
       * website copy, and cannot promote anybody — including itself, because
       * the role field is admin-only. The database would have to be opened by
       * hand to recover.
       *
       * So the first user is forced regardless of what the form said. Every
       * later account honours the chosen role.
       */
      async ({ req, data, operation }) => {
        if (operation !== "create") return data;
        const existing = await req.payload.count({ collection: "users" });
        if (existing.totalDocs === 0) {
          return { ...data, role: "admin" };
        }
        return data;
      },
    ],
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role", "sections"],
    group: "Settings",
    description: "Who can sign in, and what each person can open.",
    // Nobody but an admin needs to know who else has an account.
    hidden: hideUnlessAdmin,
  },
  access: {
    create: ({ req }) => isAdminUser(req.user),
    delete: ({ req }) => isAdminUser(req.user),
    update: ({ req, id }) => {
      if (isAdminUser(req.user)) return true;
      // Everyone may edit their own profile — name, password — and nobody
      // else's. The `role` and `sections` fields are locked separately below,
      // so this cannot be used to grant yourself anything.
      return req.user?.id === id;
    },
    read: ({ req }) => {
      if (isAdminUser(req.user)) return true;
      return { id: { equals: req.user?.id } };
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin — everything, including publishing and these settings", value: "admin" },
        { label: "Editor — writes and edits drafts, cannot publish", value: "editor" },
        { label: "Viewer — reads drafts for review, changes nothing", value: "viewer" },
      ],
      access: {
        // Without this, the self-edit rule above would let an editor open
        // their own profile and promote themselves to admin.
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        description:
          "How much this person can do. Only an admin can change it. The very first account is always an admin, whatever this says.",
      },
    },
    {
      name: "sections",
      type: "select",
      hasMany: true,
      options: SECTIONS.map((section) => ({
        label: SECTION_LABELS[section],
        value: section,
      })),
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        description:
          "What this person can open. Anything not ticked is hidden from their sidebar and refused if they reach for it directly. Leave empty and they see no content at all. Admins ignore this and see everything.",
        // Pointless noise on an admin, who is not governed by it.
        condition: (data) => data?.role !== "admin",
      },
    },
    {
      name: "notes",
      type: "textarea",
      access: { read: isAdminFieldLevel, update: isAdminFieldLevel },
      admin: {
        description:
          "Private. Why this person has access and who arranged it — useful a year later when nobody remembers who the freelancer was.",
        condition: (_data, _sibling, { user }) => isAdminUser(user),
      },
    },
  ],
};
