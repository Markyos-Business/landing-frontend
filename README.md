# markyos.com

The Markyos marketing site. **Arabic-first**, bilingual, statically rendered,
separate deploy from the platform app.

```bash
npm install
npm run dev        # site at / (Arabic), /en (English), admin at /admin
                   # the platform app may already hold :3000 — check the log for the port
```

Arabic has no locale segment: `/pricing` is Arabic and `/en/pricing` is
English. That is `docs/OPEN-DECISIONS.md` §6, and two files implement it —
`src/lib/i18n/href.ts` and `src/proxy.ts`.

The admin panel needs no database to run: with `DATABASE_URI` unset it uses a
local SQLite file. Open `/admin` and create the first account.

`npm run check` must pass before a commit.

---

## What this is

A Next.js 16 app serving the homepage, the audience and product pages, and
(later) the `/resources` hub backed by Payload. It is **not** part of
`../markyosmvp`: separate repo, separate deploy, so a copy tweak does not
rebuild the product and a broken product build does not block a landing-page
fix.

The homepage is built from `markyos_landing_page_copy.md` v1.0, section by
section, in the order that document sets.

## Start here

| Read this | For |
| :--- | :--- |
| **`docs/STACK-DECISIONS.md`** | Language, framework, CMS, bilingual approach, hosting — and why each |
| **`docs/OPEN-DECISIONS.md`** | What was decided and why. One item is still open |
| **`docs/PAGES.md`** | The three kinds of page, and how to add one |
| **`docs/copy/`** | The approved source copy every page is transcribed from |
| **`docs/NEXT-STEPS.md`** | The build order from here |
| **`docs/BEFORE-PUBLISH.md`** | The launch gate. Nothing goes live until it is closed |
| **`docs/CMS-GUIDE.md`** | For whoever writes — using the admin, no code |

Regression setup for public forms and CMS permissions is documented in
[Testing](docs/TESTING.md).

## Commands

```bash
npm run dev            # dev server
npm run build          # 147 static pages — every route, both locales
npm run check          # tsc · eslint · token drift · design rules · Arabic parity
npm run cms:types      # regenerate CMS types after a schema change
npm run cms:import -- <dir>   # load the written resources into the CMS;
                       # matched on slug, never overwrites, --replace to redo
npm run cms:importmap  # regenerate the admin import map
npm run sync:tokens    # pull brand tokens from the platform app
npm run check:design   # the design system’s §14 rules — add --list for the
                       #   rules and why each exemption exists
npm run check:locales  # what still needs Arabic (the transcreation brief)
```

`npm run check` is the fast gate and runs on every change. The browser checks
need a built site on a running server, so they are separate:

```bash
npm run build && npx next start -p 3210
npm run check:live     # every article answers, every page drives clean
```

`check:articles` asks for every article the five index pages link to, in
both languages. `check:pages` drives all 106 routes at desktop, tablet and phone
widths and fails on a console error, a failed request, sideways overflow, a
missing or duplicated `<h1>`, or the wrong `dir`. Four bugs reached review
with `npm run check` green and were caught here — see the header of
`scripts/check-pages.mjs`. `BASE_URL=…` points them at a deploy.

## Layout

```
src/app/[lang]/        every route, under the locale. Root layout sets lang + dir
src/app/(payload)/     the admin panel and its API (generated — do not hand-edit)
cms/               Payload: collections, globals, access control, fields,
                   the dashboard view, and analytics aggregation
components/
  chrome/          header, nav, phone menu, footer, announcement, lang switch
  sections/        17 homepage sections, one per copy-doc block
  page/            the block renderers every other page is built from
  ui/              button, card, chip, section, icon
content/
  types.ts         the homepage copy contract — both locales satisfy it
  en/ · ar/        homepage copy. Arabic is primary; English is the fallback
  pages/           27 subpages as data. See docs/PAGES.md
  editorial/       PLACEHOLDER blog, guides and help articles — delete on launch
lib/
  i18n/            locales, dictionary, href helpers, merge
  pages/           the page registry: routes, sitemap and hreflang from one list
  content/         the CMS boundary. Swap the source, not the pages
  status.ts        what ships when, and which chip each feature carries
  launch.ts        beta vs public — one env var drives the whole site
  seo.ts           canonicals, hreflang, Open Graph
scripts/           token sync + drift gate, design-rule gate, Arabic parity
src/proxy.ts           Arabic at the root, /en prefixed (Next 16: middleware → proxy)
```

## Three things to know before editing

**Brand values are never authored here.** `tailwind/tokens.generated.js` is
generated from the platform app by `npm run sync:tokens`, and
`npm run check:tokens` fails the build if it is stale. If you need a colour, a
radius or a type size that does not exist, add it to the platform's
`tailwind/` and sync. A token only the marketing site knows about is how two
deploys stop matching — which is the exact problem this product sells against.

**Logical CSS properties only.** `padding-inline`, `margin-inline-start`,
`start`/`end` — never `left`/`right`. The site ships in Arabic, `dir` is set on
`<html>` by the locale layout, and a physical property is the one thing that
will not flip with it.

That rule and six others — nothing above weight 500, nothing below 12px, no
raw hex in a component, one icon system, no emoji, and the retired orange and
zinc palettes — are `MARKYOS-DESIGN-SYSTEM.md` §14’s "definition of done", and
`npm run check:design` fails the build on any of them. It began as six greps
in a markdown file, which is how a 9px label shipped. Exemptions live in one
commented table at the top of `scripts/check-design-rules.mjs`, never as an
ignore comment in the source: `npm run check:design --list` prints each one
and the reason it exists.

**A feature mention needs a `src/lib/status.ts` entry.** Sections name a feature id
and ask for its chip; they never write a label. Naming an id that is not in the
registry throws at render, on purpose — it is what stops the page promising
something that has not shipped.

## Status

**Every page in the site map is built.** The homepage, twenty-seven pages of
page copy, and the blog, guides and help centre. 106 static routes.

**Arabic is complete** — `npm run check:locales` reports 127 of 127 copy items.
The homepage, the nav, the footer and all twenty-seven subpages are written in
Arabic as the primary edition, transcribed from the approved documents in
`docs/copy/`.

**English is the homepage only, for now.** The subpages have not been
translated yet; `/en/<any of them>` serves a short `noindex` notice linking to
the Arabic page, and `hreflang` on those pages declares Arabic alone. When the
translation is written it is a content file, not a build — see `docs/PAGES.md`.

**The resources are written, in both languages.** Ten blog posts, ten guides,
ten comparison pages and nine release notes — forty pieces, each written twice
rather than translated, with their own covers. All of it is in the CMS
(`npm run cms:import`), published, and rendered by one template across five
sections: `/blog`, `/guides`, `/compare`, `/whats-new` and `/help`.

**The help centre is the one section still empty.** Its ten articles are
planned and not written.

Two things to read before trusting the pages: `docs/copy/RESOURCES-TODO.md`
lists the ninety-one unresolved notes the import took out of the text — mostly
facts nobody has verified yet, on pages that are live — and no guide has a
download file behind its "Download the template" promise.

Anything published can be marked **Placeholder content** in the panel, which
renders a notice on the page and keeps the index out of search while every
piece on it is ticked.

**The admin dashboard is built.** Traffic and content stats on the home
screen, per-section permissions (a writer can be scoped to the blog alone and
sees nothing else), first-party cookieless analytics, and an admin panel that
runs in Arabic with the whole layout mirrored.

**Payload CMS is installed and working.** Ten collections, four globals, a
Lexical editor, AR/EN on every field, drafts and versions, Live Preview, roles,
and on-demand revalidation.

The design reference is in `UI-UX Design Reference/`. It was swapped on
21 Oct 2026: the 21 per-section mockups were replaced by 39 captures of
framer.com, which are layout patterns rather than mockups of our sections.
See the note at the top of `docs/DESIGN.md`.

Waiting on: where a beta signup goes (`docs/OPEN-DECISIONS.md` §2), the brand
sign-off in §5, and the `[CONFIRM]` list in `docs/BEFORE-PUBLISH.md` — which
includes every price on the site.

## Website → platform authentication

Set `NEXT_PUBLIC_APP_URL=https://app.markyos.com` on the website deployment.
Sign in links to `/login`; registration CTAs link to `/signup`. The shared
`localeHref` helper preserves `lang=ar|en` and account-type selections such as
`type=company`, `studio` or `freelancer`. Authentication and account creation
remain in the platform. No separate website account is created.

Use the staging platform origin for Preview deployments, then rebuild the site
when changing this public environment variable. Old website `/start`, `/signup`,
`/register` and `/login` URLs redirect to the corresponding platform form.

Run `npm run check:auth-links` to verify both languages, account-type parameters,
legacy routes and deployment origin configuration.
