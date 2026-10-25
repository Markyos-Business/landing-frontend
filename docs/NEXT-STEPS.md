# Next steps

The build order from here. Each step is sized to be finishable, and the
sequence is chosen so that nothing is built twice.

---

## Step 0 — Now (you, not code)

Two things unblock everything else, and both are decisions rather than work:

1. **Confirm the information architecture.** Audience-first (`/studios`,
   `/companies`) or problem-first (`/solutions/*`). See
   `docs/OPEN-DECISIONS.md` §1. Until this is settled, writing the secondary
   pages risks writing them twice.
2. **Answer the accent question** (`docs/OPEN-DECISIONS.md` §5). The design
   uses a warm amber accent and white primary buttons, not the product's blue.
   It affects every section, so it is cheaper to settle than to restyle.

   ~~Send the design files.~~ **Done** — 21 mockups are in
   `UI-UX Design Reference/`, named 1:1 with the components in
   `components/sections/`. They confirm the dark theme and the audience-first
   nav, and they match the built structure closely: the pricing mockup has the
   same toggle, three cards, lifted recommendation, note and compare link that
   `PricingTeaser.tsx` already renders.

Worth doing in parallel, because it has a long lead time:

3. **Start the Arabic transcreation.** Run `npm run check:locales` — the output
   is the brief, in page order. 107 items are waiting. This is the longest-lead
   item on the whole project and it does not depend on design or IA.

---

## Step 1 — Design integration

The mockups are in `UI-UX Design Reference/`, one per section, numbered in
page order. `components/sections/` is already in that order and already
receives typed copy, so styling a section should not require touching its data.

- Settle the accent family first (`docs/OPEN-DECISIONS.md` §5). Styling 17
  sections against the wrong accent is the most expensive mistake available
  at this step.
- The theme question is answered: dark only.
- Build the five nav dropdowns once their contents are confirmed
  (`docs/OPEN-DECISIONS.md` §1). The header mockup shows a chevron on all
  five items; the current header has none.
- The language switcher is a text link reading العربية in the design, not the
  EN/ع pill currently in `components/chrome/LangSwitch.tsx`. The swap-the-path
  logic stays; only the presentation changes.
- Add any brand value the design needs **to the platform app's
  `globals.css`**, then `npm run sync:tokens`. Never add a hex here. A token
  that only the marketing site knows about is how two deploys stop matching.
- Port `scripts/no-physical-props.mjs` from the platform repo and add it to
  `npm run check` (`docs/BEFORE-PUBLISH.md` item 14). Do this *before* writing
  a lot of CSS, so it catches mistakes as they are made rather than in a sweep.
- Build the mobile nav.
- Make the two OG images.

**Check in both directions as you go, not at the end.** `/en` and `/ar`
side by side. RTL bugs found at the end of a styling pass are a rewrite of the
styling pass.

---

## Step 2 — Ship the beta site

The smallest thing that is worth being live.

- Close the beta signup decision (`docs/OPEN-DECISIONS.md` §2) and finish
  `/api/waitlist`, or move signup to the platform app and delete the route.
- Write beta labels for the three mid-page CTAs, or accept them as they are
  (`docs/BEFORE-PUBLISH.md` item 10).
- Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_APP_URL` in the host.
- Keep `NEXT_PUBLIC_LAUNCH_PHASE=beta`, which keeps `robots.txt` closed. The
  beta site deliberately earns no SEO — a thin page ranking for "bilingual
  brand guidelines" for four months trains the index on the wrong content.
- Deploy. Point `markyos.com` at it.

At this point the homepage is live, bilingual, honest about what exists, and
collecting beta applications. Everything after this is addition.

---

## Step 3 — The secondary pages

Once the IA is confirmed.

Write `/studios`, `/companies`, `/platform` and `/pricing` properly. Each one
currently returns a `noindex` placeholder, and each becomes a real page by
replacing that file — the route, the metadata helper and the locale handling
are already in place.

`/pricing` should wait for the beta pricing test to close (1 Feb 2027) rather
than being written twice.

As each page becomes real: drop the `noindex`, and add it to
`PUBLISHED_ROUTES` in `app/sitemap.ts`. Those two go together — a page in the
sitemap that is also `noindex` sends a crawler two contradictory instructions.

---

## Step 4 — Payload — DONE

Installed and running. `npm run dev`, then `/admin`.

What exists: ten collections (posts, guides, help articles, comparisons,
media, authors, categories, tags, redirects, users), four globals (homepage,
navigation, announcement, site settings), AR/EN localization on every text
field, the Lexical editor with a fixed toolbar, drafts and 20 versions per
document, Live Preview at three breakpoints, three roles with editors unable
to publish, and on-demand revalidation so a publish appears on the live site
in seconds without a redeploy.

The blog is wired end to end: `/resources/blog` and
`/resources/blog/[slug]` render from the CMS in both languages, from one
document per post.

**What is left on the CMS:**

- Provision Postgres and set `DATABASE_URI`. Local development uses SQLite;
  **develop schema changes against Postgres before shipping them**, because
  the two differ on column types and migrations.
- Set `PAYLOAD_SECRET` in production. Nothing works without it.
- Point `cms.markyos.com` at `/admin`.
- Add the R2 credentials so uploads leave local disk.
- Add an email adapter, or password resets only ever print to the server
  console.
- Build `/resources/guides`, `/resources/help` and `/resources/compare`
  against the adapter — it already returns the right shapes, and the blog
  pages are the pattern to copy.

Hand `docs/CMS-GUIDE.md` to whoever writes.

---

## Step 5 — Launch, 15 Feb 2027

Work through `docs/BEFORE-PUBLISH.md` top to bottom. Every item, including the
five-second test with real people.

Then flip `NEXT_PUBLIC_LAUNCH_PHASE=public` and redeploy. That one variable
swaps the announcement bar, the hero and final CTAs, every MVP chip, and opens
`robots.txt`.

Verify after: `robots.txt` allows, `/en` shows free-plan CTAs, no
`Arriving February 2027` anywhere, and `/ar` is fully Arabic.

---

## Standing rules

Worth keeping to, because each one is cheap now and expensive later.

| Rule | Why |
| :--- | :--- |
| `npm run check` before every commit | tsc, lint, token drift and Arabic parity in one command |
| Never author a brand value here | Add it to the platform's `globals.css` and sync. Two deploys that disagree on a colour is the problem this company exists to solve |
| Logical properties only | `start`/`end`, never `left`/`right`. A physical property is the one thing that will not flip with `dir` |
| A new feature mention gets a `lib/status.ts` entry | The registry throws on an unknown id, which is the point — it is what stops the page promising something that has not shipped |
| Check `/ar` whenever you change `/en` | Not at the end of the project |
| Never invent proof | No quotes, no logos, no usage numbers until they are real |
