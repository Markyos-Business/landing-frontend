import path from "path";
import { mkdirSync } from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { s3Storage } from "@payloadcms/storage-s3";
import { ar } from "@payloadcms/translations/languages/ar";
import { en } from "@payloadcms/translations/languages/en";
import { richText } from "./cms/fields";

import { Users } from "./cms/collections/Users";
import { Media } from "./cms/collections/Media";
import { Posts } from "./cms/collections/Posts";
import { Guides } from "./cms/collections/Guides";
import { HelpArticles } from "./cms/collections/HelpArticles";
import { Comparisons } from "./cms/collections/Comparisons";
import { Updates } from "./cms/collections/Updates";
import { Authors, Categories, Tags } from "./cms/collections/Taxonomy";
import { Redirects } from "./cms/collections/Redirects";
import { Pageviews } from "./cms/collections/Pageviews";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * Payload configuration
 *
 * Runs inside this Next.js app rather than beside it, so the marketing site
 * reads content through the Local API — in process, no network hop, no second
 * service to keep up. That is the specific reason Payload was chosen over a
 * hosted CMS, and it only holds if the CMS lives in the app that renders the
 * content. Every collection here renders on a marketing route; none is read by
 * the product.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/*
 * The database.
 *
 * Postgres in production — the same Neon/Supabase instance the platform app
 * uses, in its own schema, which is what the CMS architecture commits to.
 *
 * SQLite locally, so the admin runs with no setup at all: clone, install, open
 * /admin. There is no provisioned Postgres yet, and an admin panel that cannot
 * be opened until someone creates a cloud database is an admin panel nobody
 * reviews.
 *
 * The cost of that convenience is dev/prod parity, and it is real: Postgres
 * and SQLite differ on column types and on how migrations are generated. So
 * the rule is — **develop schema changes against Postgres before shipping
 * them.** Point DATABASE_URI at a Neon branch as soon as there is one, and
 * treat SQLite as the "look at the admin" mode rather than the "change the
 * schema" mode.
 */
const databaseURI = process.env.DATABASE_URI ?? "";
const usePostgres = /^postgres(ql)?:\/\//.test(databaseURI);

const db = usePostgres
  ? postgresAdapter({
      pool: { connectionString: databaseURI },
      // Its own schema inside the shared instance, so CMS tables never collide
      // with the product's and either can be dumped without the other.
      schemaName: "cms",
    })
  : sqliteAdapter({
      client: {
        url: process.env.SQLITE_URL ?? `file:${sqliteFile()}`,
      },
    });

/**
 * The local database file, with its directory guaranteed to exist.
 *
 * Two things this gets right that are easy to get wrong:
 *
 * **It creates the directory.** libSQL creates the database file but not the
 * folder holding it, and the error when the folder is missing is
 * `ConnectionFailed(... : 14)` — which says nothing about directories.
 *
 * **It lives under node_modules/.cache, not in the project tree.** Turbopack
 * watches the project for changes and rebuilds when it sees them. SQLite
 * writes to its file on every request, including the ones the dev server
 * makes to render a page, so a database inside the tree puts the dev server
 * in a loop: render, write, detect a change, rebuild, render. Next 16's
 * `watchOptions` has no ignore list, so the fix is to put the file somewhere
 * nothing watches.
 *
 * The cost is that `rm -rf node_modules` takes local CMS content with it.
 * That is acceptable for a scratch database — real content lives in Postgres,
 * and anything worth keeping locally should be seeded by a script.
 */
function sqliteFile(): string {
  const dir = path.resolve(dirname, "node_modules/.cache/payload");
  mkdirSync(dir, { recursive: true });
  return path.join(dir, "cms.db");
}

/*
 * Media storage.
 *
 * Cloudflare R2 through the S3-compatible adapter — the same bucket already
 * provisioned for brand assets, under its own key prefix, so there is no
 * second storage vendor and no second bill.
 *
 * Only enabled when the credentials exist. Without them uploads go to local
 * disk, which is what a developer wants anyway.
 */
const r2Configured = Boolean(
  process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY,
);

const storagePlugins = r2Configured
  ? [
      s3Storage({
        collections: {
          media: { prefix: "marketing" },
        },
        bucket: process.env.R2_BUCKET as string,
        config: {
          endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          // R2 ignores the region but the S3 client insists on one.
          region: "auto",
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
          },
        },
      }),
    ]
  : [];

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · Markyos CMS",
    },
    /*
     * Light only.
     *
     * markyos.com is a light page — paper ground, white cards, near-black
     * ink — and the admin is the surface a person reaches from it, usually in
     * the next tab. The skin in app/(payload)/custom.css re-points Payload's
     * theme variables onto that one palette, so there is no second set of
     * values to keep in step and nothing for a theme switch to switch to:
     * leaving it on would offer a theme that does not exist.
     *
     * This was "dark" until 8 Nov 2026, which was correct while the site was
     * black. The skin states the palette under the dark selector too, so a
     * stored preference from before the flip cannot strand anyone on a theme
     * whose values were deleted.
     */
    theme: "light",
    /*
     * Walk straight into the admin with no login screen.
     *
     * Payload's own mechanism for this. It signs the session as an existing
     * user, so nothing about access control changes: every collection's
     * `access` function still runs, and still runs against a real account
     * with a real role. It is a skipped login, not an open door — which is
     * the difference between this and loosening `access.admin`, and the
     * reason to prefer it.
     *
     * ── The two guards, and why they are the ones that matter ─────────────
     *
     * `PAYLOAD_DEV_AUTOLOGIN` lives in `.env.local`, which is gitignored and
     * never deployed. A deploy would have to set it on purpose.
     *
     * `!usePostgres` is the guard that actually cannot be got around by
     * accident. Production runs on Postgres — `DATABASE_URI` is a launch-gate
     * requirement (docs/BEFORE-PUBLISH.md §15) precisely because without it
     * the CMS silently runs on a throwaway SQLite file. So the one
     * environment this can switch itself on in is an environment that is
     * already not production by definition.
     *
     * A NODE_ENV check would have been the obvious third guard and is the
     * wrong one here: this site is usually run locally with `next start` off
     * a production build, so NODE_ENV is "production" on the very machine
     * this is for.
     *
     * The account is the one already in the local database. Nothing is
     * created, and no password is involved — which is the point, since the
     * password for it is a bcrypt hash nobody has the plaintext of.
     */
    autoLogin:
      process.env.PAYLOAD_DEV_AUTOLOGIN === "1" && !usePostgres
        ? { email: process.env.PAYLOAD_DEV_EMAIL ?? "abdullah@markyos.com" }
        : false,
    components: {
      /*
       * Inter and Thmanya Sans, the website's two faces. The admin is a
       * separate root layout, so `app/fonts.ts` does not reach it and every
       * Arabic string in the panel rendered in a system fallback — see
       * cms/views/AdminFonts.tsx.
       */
      providers: ["/cms/views/AdminFonts#AdminFonts"],
      /*
       * The real brand files, not Payload's mark. `Logo` is the login
       * screen's, `Icon` the sidebar's — see cms/views/BrandLogo.tsx.
       */
      graphics: {
        Logo: "/cms/views/BrandLogo#BrandLogo",
        Icon: "/cms/views/BrandLogo#BrandIcon",
      },
      views: {
        /*
         * Replaces Payload's default dashboard — a grid of collection cards
         * that is useful once. Ours answers what someone actually opens the
         * admin to find out: what is waiting to be published, how the site is
         * doing, and where to go next. It scopes itself to the viewer's
         * sections and shows traffic to admins only.
         */
        dashboard: {
          Component: "/cms/views/Dashboard#Dashboard",
        },
      },
    },
    // Live Preview: the admin renders the real page template with the
    // in-progress draft in an iframe beside the editor. This is the
    // "Framer CMS" feel — seeing the post on the actual page rather than
    // guessing from a text field.
    livePreview: {
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      collections: ["posts", "guides", "helpArticles", "comparisons", "updates"],
      breakpoints: [
        { label: "Phone", name: "phone", width: 390, height: 844 },
        { label: "Tablet", name: "tablet", width: 834, height: 1112 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },

  /*
   * The two editions, and what happens where one of them is missing.
   *
   * `fallback: true` fills an untranslated field from the default locale.
   * That is for the **admin**, where somebody translating a piece wants the
   * source text in front of them instead of an empty box.
   *
   * It is deliberately **not** how the public site reads. Every editorial
   * read in `lib/content/payload.ts` passes `fallbackLocale: false`, because
   * with Arabic primary a fallback is wrong in both directions: it would
   * print English body copy under an Arabic URL, and the other way round it
   * leaves a blank page rather than an absent one. Off, a piece exists in
   * exactly the languages it is written in, and the rest renders the same
   * "not translated yet" notice the other twenty-seven subpages use.
   *
   * `defaultLocale` is still "en" from when the two were equals. It now only
   * decides the admin default and the fallback source, neither of which the
   * public site uses — see docs/BEFORE-PUBLISH.md item 29.
   */
  localization: {
    /*
     * Arabic first, because the site is.
     *
     * The order here is the order of the locale switcher in the panel and of
     * the language rows on the dashboard. It was English first from when the
     * two were equals, which put the primary language second in every list
     * somebody reads. Order is not `defaultLocale` and does not change it.
     */
    locales: [
      { label: "العربية", code: "ar" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "en",
    fallback: true,
  },

  /*
   * The admin panel speaks Arabic.
   *
   * Not decoration: the Arabic homepage copy answers "is the admin itself in
   * Arabic?" with yes, and a product whose entire argument is that Arabic is
   * not an afterthought cannot ship an English-only back office. Payload
   * mirrors the whole panel to RTL when Arabic is selected, and each person
   * picks their own interface language independently of the language they are
   * writing in.
   */
  i18n: {
    supportedLanguages: { ar, en },
    fallbackLanguage: "en",
  },

  collections: [
    Posts,
    Guides,
    HelpArticles,
    Comparisons,
    Updates,
    Media,
    Authors,
    Categories,
    Tags,
    Redirects,
    Pageviews,
    Users,
  ],

  /*
   * No globals.
   *
   * There were four — homepage, navigation, announcement bar, site settings —
   * and they let an editor override the website's own copy from the panel.
   * That is out of scope as of 8 Nov 2026: the admin is the resources CMS and
   * the numbers, and the marketing copy is the codebase's, where it is
   * reviewed in a diff and transcreated against `npm run check:locales`.
   *
   * The schemas are in git (`git show HEAD~1 -- cms/globals/`) and the read
   * path that merged them over the dictionary was `lib/content/pageCopy.ts`.
   * Bringing them back means restoring both and re-registering them here.
   */

  editor: richText(),

  db,
  plugins: storagePlugins,

  secret: process.env.PAYLOAD_SECRET ?? "",

  typescript: {
    outputFile: path.resolve(dirname, "cms/payload-types.ts"),
  },

  // The marketing site reads content in-process through the Local API, so the
  // REST and GraphQL surfaces exist only for the admin panel itself.
  graphQL: {
    disable: false,
  },

  // Static import, not `await import(...)`: the Payload CLI transforms this
  // file to CJS, where a top-level await is a build error.
  sharp,
});
