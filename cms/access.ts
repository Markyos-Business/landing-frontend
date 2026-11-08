import type { Access, CollectionConfig, FieldAccess } from "payload";

/*
 * Who can do what.
 *
 * ── Two dials, not one ──────────────────────────────────────────────────────
 *
 * A role alone could not express the thing actually needed here: "a copywriter
 * who works on the blog, and cannot see anything else". A role says how much
 * power someone has; it does not say what they have it over. So permission is
 * two fields on a user:
 *
 *   role      — how much: admin, editor (writes drafts), viewer (reads only)
 *   sections  — what over: which content collections they can open at all
 *
 * An admin ignores `sections` and sees everything, including the website's own
 * copy, the analytics and the user list. Everyone else sees only the sections
 * they were given, and the rest is **hidden from the sidebar entirely** rather
 * than shown and refused — a menu full of things you cannot open is a worse
 * experience than a short menu, and it leaks what exists.
 *
 * ── The rule that makes it safe ─────────────────────────────────────────────
 *
 * Hiding a collection from the nav is cosmetic. Every restriction here is
 * therefore enforced twice: once in `admin.hidden` so it is not shown, and
 * once in `access` so it is refused even if someone types the URL. Hiding
 * without the second half is the classic way to ship a permission system that
 * does not actually hold.
 */

export type Role = "admin" | "editor" | "viewer";

/**
 * The content areas a non-admin can be given.
 *
 * Collection slugs, so a section maps to exactly one thing in the sidebar and
 * there is no second list to keep in step.
 */
export const SECTIONS = [
  "posts",
  "guides",
  "helpArticles",
  "comparisons",
  "updates",
] as const;

export type Section = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<Section, string> = {
  posts: "Blog posts",
  guides: "Guides and templates",
  helpArticles: "Help centre",
  comparisons: "Comparisons",
  updates: "What's new",
};

type MaybeUser =
  | {
      role?: Role;
      sections?: Section[] | null;
    }
  | null
  | undefined;

const asUser = (user: unknown): MaybeUser => user as MaybeUser;

export const roleOf = (user: unknown): Role | null => asUser(user)?.role ?? null;

export const isAdminUser = (user: unknown): boolean => roleOf(user) === "admin";

/** The sections a user may open. Admins get all of them. */
export function sectionsOf(user: unknown): Section[] {
  if (isAdminUser(user)) return [...SECTIONS];
  const list = asUser(user)?.sections;
  return Array.isArray(list) ? list.filter((s): s is Section => SECTIONS.includes(s)) : [];
}

export const canOpenSection = (user: unknown, section: Section): boolean =>
  sectionsOf(user).includes(section);

/** True once a user has been given anything at all to work on. */
export const hasAnySection = (user: unknown): boolean => sectionsOf(user).length > 0;

// ── Collection-level access ─────────────────────────────────────────────────

export const isAdmin: Access = ({ req }) => isAdminUser(req.user);

export const isAdminFieldLevel: FieldAccess = ({ req }) => isAdminUser(req.user);

export const isSignedIn: Access = ({ req }) => Boolean(req.user);

/**
 * What the public may read.
 *
 * Returns a *query constraint* rather than `false` for anonymous readers, so
 * drafts are filtered out of a result set instead of the request failing. A
 * blog index must not 500 because one post in it is unpublished.
 */
export const publishedOrSignedIn: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};

/**
 * The access block for a content section.
 *
 * Read is public-but-published, as every one of these renders on the website.
 * Everything else requires the section, and deleting requires an admin —
 * a writer who can delete the help centre is a writer who eventually does.
 */
export function sectionAccess(section: Section): CollectionConfig["access"] {
  return {
    read: ({ req }) => {
      if (!req.user) return { _status: { equals: "published" } };
      if (isAdminUser(req.user)) return true;
      // A signed-in user without this section still reads the published
      // version, because relationships and link fields elsewhere resolve
      // against it. They simply cannot open it in the sidebar or edit it.
      return canOpenSection(req.user, section) ? true : { _status: { equals: "published" } };
    },
    create: ({ req }) =>
      roleOf(req.user) !== "viewer" && canOpenSection(req.user, section),
    update: ({ req }) =>
      roleOf(req.user) !== "viewer" && canOpenSection(req.user, section),
    delete: ({ req }) => isAdminUser(req.user),
  };
}

/** Hide a section from the sidebar for anyone who was not given it. */
export const hideUnlessSection =
  (section: Section) =>
  ({ user }: { user: unknown }): boolean =>
    !canOpenSection(user, section);

/** Hide a collection from everyone but an admin. */
export const hideUnlessAdmin = ({ user }: { user: unknown }): boolean =>
  !isAdminUser(user);

/**
 * Supporting collections — media, authors, categories, tags.
 *
 * Anyone with a section can read these and upload media, because an article
 * without an image or a category is not a finished article. Creating a new
 * *category* is a taxonomy decision rather than a writing one, so that stays
 * with admins: left open, a four-category blog becomes a nineteen-category
 * blog within a month.
 */
export const supportingAccess: CollectionConfig["access"] = {
  read: () => true,
  create: ({ req }) => roleOf(req.user) !== "viewer" && hasAnySection(req.user),
  update: ({ req }) => roleOf(req.user) !== "viewer" && hasAnySection(req.user),
  delete: ({ req }) => isAdminUser(req.user),
};

export const taxonomyAccess: CollectionConfig["access"] = {
  read: () => true,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
};

/**
 * Only an admin may publish.
 *
 * This is what makes the Editor role mean anything. Without it, "editors write
 * drafts, they do not publish" is a sentence in a document rather than a rule
 * the system keeps — an editor would simply press Publish.
 */
export const publishAccess: FieldAccess = ({ req }) => isAdminUser(req.user);

/** The website's own copy, the nav, the analytics: admin only. */
export const adminOnly = {
  read: isAdmin,
  update: isAdmin,
  create: isAdmin,
  delete: isAdmin,
} satisfies CollectionConfig["access"];
