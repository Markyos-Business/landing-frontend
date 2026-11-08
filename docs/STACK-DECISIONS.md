# markyos.com — stack decisions

**Written 17 October 2026.** For whoever builds and maintains the marketing site.

This answers the three questions asked before development starts: what language,
what CMS, and what the first steps are. Each decision records why, because the
reason is what tells you when the decision stops being right.

---

## 1. The short version

| | Decision |
| :--- | :--- |
| **Language** | TypeScript, strict. React 19.2.8 |
| **Framework** | Next.js 16.4.2, App Router, Turbopack |
| **Styling** | Tailwind CSS v4, consuming the platform's design tokens |
| **CMS** | Payload 3.91, self-hosted — **in this app**, not the platform app. **Installed and running** |
| **Bilingual** | Route-based `app/[lang]` with `en` and `ar`. No i18n library |
| **Database** | Postgres in production; SQLite locally so the admin runs with no setup |
| **Media** | Cloudflare R2, same bucket as brand assets, separate key prefix |
| **Hosting** | Vercel or Cloudflare Pages. Static by default |
| **Repo** | Separate from the platform app, with a token-sync gate against drift |

All of it is running. `npm run dev` serves the bilingual homepage and the
admin panel at `/admin`.

---

## 2. Language and framework

**TypeScript and Next.js 16, matching the platform app exactly.**

This is not a fresh choice — it is the same stack the platform already runs, and
the version numbers were taken from `markyosmvp/package.json` rather than picked.
The benefit is that a person moving between the two repos does not change
mental model, and anything learned about Next 16's conventions in one applies to
the other.

Two things about Next 16 worth knowing before writing code, because both differ
from older Next and from most of what is written online:

- **`proxy.ts`, not `middleware.ts`.** The middleware convention is deprecated
  and renamed. The locale redirect lives in `proxy.ts` at the repo root.
- **`params` is a Promise**, and the locale is reachable from any Server
  Component via `next/root-params` without being threaded through props. See
  `lib/i18n/dictionary.ts`.

The platform app carries a generated `AGENTS.md` that says to read
`node_modules/next/dist/docs/` before writing code. That advice holds here, and
`next dev` writes the same file into this repo.

### One deliberate divergence: the Next version

The platform app pins **16.3.4**. This app runs **16.4.2**, because 16.3.4
carries a critical advisory and several high ones, including:

- cache poisoning of SSG and ISR pages in self-hosted apps
- server-side request forgery in image optimization
- information disclosure in App Router metadata image routes

A marketing site is almost entirely SSG, so the first of those is squarely
about this app. Matching a vulnerable version for consistency's sake is the
wrong trade.

> **The platform app should be bumped to 16.4.2 as well.** It is exposed to the
> same advisories. That is a change to the other repo, so it has not been made
> here — but it should not wait.

`npm audit` still reports 5 high findings, all one chain: `braces` →
`micromatch` → `fast-glob` → `@next/eslint-plugin-next`. It is a dev-only
dependency used at lint time on our own glob patterns, and npm's suggested
"fix" is a downgrade to `eslint-config-next@14`, which would mean abandoning
Next 16 lint rules. Left as is, deliberately. Re-check when the plugin updates.

### Node version

Node 22.12 works. ESLint 9.39 wants `^22.13` and warns on install — harmless
today, but **Node 22.13+ or 24 LTS is the version to standardise on**, including
in CI.

---

## 3. The CMS: Payload 3, and a correction to where it lives

**The decision to use Payload stands.** `markyos_cms_architecture.md` makes the
case well and nothing here contradicts it: Payload runs inside a Next.js app
rather than beside it, stores content in the Postgres already budgeted for,
writes media to the R2 bucket already provisioned, has field-level localization
that maps onto the AR/EN requirement, and costs nothing per seat or per record.
For a two-founder team that is the right shape, and the alternatives
(Sanity, Storyblok) add a vendor and a recurring bill to buy visual editing that
Payload's Live Preview substantially covers.

**One thing changes: Payload belongs in this repo, not in the platform app.**

The CMS architecture doc assumes one Next.js app, because when it was written
there was one. It lists the collections Payload would hold — `BlogPosts`,
`Guides`, `Comparisons`, `HelpArticles`, `Authors`, `Categories`, `Redirects`,
`Navigation` — and every one of them renders on a marketing route
(`/resources/*`). None of them is read by the product.

So putting Payload in the platform app would mean the content lives in the app
that never reads it, and the app that does read it fetches over the network —
giving up the Local API, which is the specific reason the doc chose Payload
over a hosted CMS. Putting it here keeps that benefit intact. The doc's other
commitments are unaffected: same Postgres instance, same R2 bucket, admin on
`cms.markyos.com`, one deploy.

Nothing in the doc's content model, localization config, draft/version workflow
or rollout phases needs to change. Read it as written; only the host app differs.

### Next 16 support: verified

This was the open risk, and it is closed. `@payloadcms/next@3.91.0` declares
`next: ">=16.3.3 <17.0.0"`. We run 16.4.2, which is inside that range, and the
admin builds and runs.

The content boundary in `lib/content/adapter.ts` stayed anyway. `index.ts`
chooses the source in one line, and `local.ts` is kept as the reference
implementation and as a way to run the site with no database at all. That is
what made swapping the stub for Payload a one-line change, and it is what
would make swapping Payload out one too.

### Two things the install changed

**`"type": "module"` in package.json.** The Payload CLI transforms the config
to run it, and under CommonJS that path pulls in `undici` in a way that throws
`Illegal constructor` on Node 22. Payload's own templates set this; our `.mjs`
scripts were already ESM, so nothing else moved.

**The local database lives in `node_modules/.cache/payload`.** SQLite writes on
every request, Turbopack watches the project tree and rebuilds on changes, and
a database inside the tree puts the dev server in a render-write-rebuild loop.
Next 16's `watchOptions` has no ignore list, so the file goes where nothing
watches. See `sqliteFile()` in `payload.config.ts`.

### Page copy: editable, but layered

Page copy was originally git-only, on the grounds that a positioning line
deserves a code review. It is now editable from the admin as well — that was
asked for directly, and it is the right call for a two-person team who should
not need a deploy to fix a headline.

It is layered rather than moved, which keeps what the git version was good for:

```
content/en/index.ts           approved copy, in git, complete
      ↓  Arabic overrides     content/ar/overrides.ts
the locale dictionary         complete in both languages
      ↓  CMS overrides        the `homepage` / `navigation` globals
what the page renders
```

Every CMS field is optional and empty by default. Fill one and it wins; leave
it and the approved copy renders. Three things that buys:

- **No state of the database produces a blank page.** A fresh deploy, a failed
  query, a migration mid-flight — the homepage still renders. Every CMS read
  goes through `safeRead`, which logs and falls back.
- **An edit is visible as an edit**, because anything non-empty is by
  definition a deliberate departure from the copy that went through strategy.
- **`npm run check:locales` still works**, because the git layer is still
  typed and still complete.

**One bug worth recording, found while testing this.** Payload is configured
with `fallback: true`, so an empty Arabic field returns the English one. For an
article that is right. For page copy it was actively wrong: editing the English
headline in the admin replaced the *approved Arabic transcreation* on the
Arabic page with an English line in Latin script — on the page whose argument
is that Arabic is not an afterthought. `getSiteCopy` read the page-copy
globals with `fallbackLocale: false` after that, so the layering was
`CMS Arabic → git Arabic → git English`. Article reads keep the fallback,
where it is the behaviour you want.

**The page-copy layer was removed on 8 Nov 2026** and with it this whole class
of bug: the globals are unregistered, `getSiteCopy` is gone, and the two pages
that called it read the dictionary directly. Marketing copy is the codebase's.
The note stays because the trap it describes is a property of `fallback: true`
and still applies to anything localized that is edited in the panel.

---

## 4. Bilingual: route-based locales, no library

**`app/[lang]/` with `en` and `ar`, and no i18n package.**

The site has two locales and a finite, known set of pages. What an i18n library
adds over that — ICU plurals, date and number formatting, locale negotiation
helpers — is either unused here or twelve lines of code. What it costs is a
dependency in the critical path of every page, on a framework whose major
version it may lag.

`next-intl` and the others are the right answer for an app with forty locales
and runtime-formatted content. They are not the right answer for this.

What is implemented:

| Concern | Where |
| :--- | :--- |
| Locale list, direction, labels | `lib/i18n/locales.ts` — plain data, importable from the edge |
| Negotiation and redirect | `proxy.ts` — cookie first, then `Accept-Language`, 307 never 308 |
| Copy loading | `lib/i18n/dictionary.ts` — dynamic import per locale, server-only |
| Locale-aware links | `lib/i18n/href.ts` |
| Arabic fallback to English | `lib/i18n/merge.ts` |
| `hreflang` and canonicals | `lib/seo.ts` |

Two details that are easy to get wrong and are already handled:

**`dir` is on `<html>`, set on the server.** This is why the root layout lives
at `app/[lang]/layout.tsx` rather than `app/layout.tsx`. If direction were set
on the client, the Arabic page would load left-to-right and visibly flip — on
the page claiming Arabic is not an afterthought.

**Arabic falls back to English, never to blank.** Only the §5 drafts are
transcreated so far; everything else inherits the English. This is the same
`fallback: true` rule the CMS doc sets for Payload, applied to page copy for
the same reason. `npm run check:locales` prints exactly what is still waiting —
currently 14 of 121 items have Arabic — and that output is the transcreation
brief.

### The rule that keeps it working

**Logical CSS properties only.** `padding-inline`, `margin-inline-start`,
`start`/`end` — never `left`/`right`. A physical property is the one thing that
will not flip when `dir` does. The platform repo gates this with
`scripts/no-physical-props.mjs` across 242 files; the same discipline is far
cheaper to keep than to retrofit, and porting that gate here is on the
next-steps list.

---

## 5. Separate repo, and the drift problem it creates

The marketing site is a separate app from the product. The reasons are ordinary
and good: a copy tweak should not rebuild the product, a broken product build
should not block a landing-page fix, the marketing site needs no auth or Prisma
or Stripe in its bundle, and the two ship on completely different cadences —
this one needs to be live for the beta while the product is still being built.

That creates one genuine risk, and it is the one this company least wants:
**two deploys whose blue is not the same blue.** A marketing site that drifts
from the product is brand decay, on the site about brand decay.

So the tokens are generated, never authored here:

```
markyosmvp/app/globals.css          ← the only place a brand value is decided
          │
          │  npm run sync:tokens
          ▼
Landing Page/app/tokens.generated.css   ← generated, committed, never edited
```

`scripts/sync-tokens.mjs` lifts the three token blocks — the dark theme, the
light theme, and the Tailwind v4 `@theme inline` mapping — out of the platform's
stylesheet. 89 declarations today. `npm run check:tokens` fails the build if the
committed copy is stale, so a token change in the platform that nobody pulled
across becomes a failed build here rather than a slightly-wrong colour on the
homepage.

The platform's `docs/token-contract.md` applies to this app in full. The two
clauses that matter most: consume a token and never hardcode a hex, a radius or
a type size; and a token may be added but never renamed, removed or redefined.

**One caveat, raised by the design reference.** The mockups use a warm amber
accent and white primary buttons, where the product uses blue. The grounds,
the text ramp and the hairlines are shared and stay synced; the accent family
appears to be marketing-specific. That is the one part of the brand this rule
does not cleanly cover, and it needs a decision before styling starts —
`docs/OPEN-DECISIONS.md` §5.

If the two apps ever become a monorepo, this script is what gets deleted and a
shared package is what replaces it. Until then it is 150 lines and no tooling.

---

## 6. Hosting

Static by default. Every page prerenders for both locales — 39 static pages
today — so the site can be served from a CDN with a near-empty origin. The only
dynamic pieces are `proxy.ts` (edge) and `/api/waitlist`.

Either Vercel or Cloudflare Pages works. Vercel is the shorter path given
`next/font`, `next/image` and proxy all being first-party there, and it is
likely where the platform app goes too.

DNS, per the CMS doc:

| Host | Serves |
| :--- | :--- |
| `markyos.com` | this app |
| `app.markyos.com` | the platform app |
| `cms.markyos.com` | Payload admin, from this app, phase 3 |

The `/start` and `/login` hand-off is already centralised: both redirect to
`NEXT_PUBLIC_APP_URL` from `next.config.ts`, so copy can link `/start?type=studio`
without knowing where the product is deployed.

---

## 7. What exists right now

```
Landing Page/
├── app/
│   ├── [lang]/              root layout (lang + dir), homepage, 16 placeholder routes
│   ├── globals.css          base layer — rhythm, measure, focus. No brand values
│   ├── tokens.generated.css GENERATED from the platform app
│   ├── fonts.ts             Inter · IBM Plex Sans Arabic · Bricolage Grotesque
│   ├── robots.ts            closed to crawlers during the beta
│   ├── sitemap.ts           published pages only, with hreflang pairs
│   └── api/waitlist/        validates; storage is an open decision
├── components/
│   ├── chrome/              header, footer, announcement bar, language switcher
│   ├── sections/            17 homepage sections, in copy-doc order
│   └── ui/                  button, chip, section, placeholder
├── content/
│   ├── types.ts             the copy contract
│   ├── en/                  full approved homepage copy
│   └── ar/                  §5 transcreations; the rest inherits English
├── lib/
│   ├── i18n/                locales, dictionary, href, merge
│   ├── content/             the CMS boundary — adapter, local stub, chooser
│   ├── status.ts            copy doc §3 as code: what ships when, which chip
│   ├── launch.ts            beta vs public, one env var
│   └── seo.ts               canonicals, hreflang, Open Graph
├── scripts/
│   ├── sync-tokens.mjs      token sync + drift gate
│   └── check-locale-parity.mjs   the Arabic transcreation brief
└── proxy.ts                 locale negotiation
```

### Commands

```bash
npm run dev            # localhost:3000 — note the platform app may already hold it
npm run build          # 39 static pages, both locales
npm run check          # tsc · eslint · token drift · Arabic parity
npm run sync:tokens    # pull brand tokens from the platform app
npm run check:locales  # what still needs Arabic
```

`npm run check` passes clean today.

---

## 8. Two pieces of infrastructure worth understanding

Both exist because the copy doc asks for something that is easy to promise and
hard to keep.

### `lib/status.ts` — the honesty layer

Copy doc §3 lists every feature the site names with its real build status, so
"the chips are right on launch day". A table in a document and a chip in a
component drift the moment either is edited, and they always drift the same
way: the page keeps promising something that slipped.

So §3 is encoded. A section names a feature id and asks for its chip; it never
writes a label. Moving a feature from `coming` to `current` is one edit, and
every mention of it across the site updates at once. Naming a feature that is
not in the registry throws at render rather than quietly rendering an
unchipped promise.

### `lib/launch.ts` — the launch-day switch

§3 also says that before 15 Feb 2027 every primary CTA swaps to the beta
version and everything marked MVP carries `Arriving February 2027`. That is a
site-wide change across a dozen places, and doing it by hand on launch morning
means finding all of them under time pressure.

`NEXT_PUBLIC_LAUNCH_PHASE=beta|public` drives all of it: the announcement bar,
the hero and final-CTA buttons, every MVP chip, and whether `robots.txt` lets
crawlers in at all. Launch day is one env var and a redeploy.

---

## 9. The admin dashboard, roles and analytics

### Permission is two dials, not one

A role says *how much* power someone has. It cannot say *what over* — and the
thing actually needed here was "a copywriter who works on the blog and cannot
see anything else". So a user carries both:

```
role      admin · editor · viewer          how much
sections  posts · guides · helpArticles …  what over
```

An admin ignores `sections` and sees everything. Everyone else sees only what
they were ticked for, and the rest is **hidden from the sidebar** rather than
shown and refused.

**Hiding is cosmetic, so every rule is enforced twice** — once in
`admin.hidden` so it is not displayed, and once in `access` so it is refused
to anyone who types the URL. A permission system that only hides is one that
does not hold, and this one was tested against that: a writer scoped to the
blog is refused on create for guides, help articles and comparisons (403), is
refused the analytics (403), cannot delete, cannot
publish, and cannot promote themselves by editing their own profile — the
`role` and `sections` fields carry their own admin-only field access, which is
what closes the self-edit loophole.

Redirects, traffic, the taxonomy and the user list stay with admins in every
case.

### The dashboard

Payload's default dashboard is a grid of collection cards — useful once. The
replacement at `cms/views/Dashboard.tsx` answers what someone actually opens
the admin to find out: what is waiting to be published, how the site is doing,
and where to go next. It scopes itself to the viewer's sections and shows
traffic to admins only.

**One card per resource, split by language.** A Payload document is a single
record with a column per locale, so a section's count hides the only question
a bilingual site has: fourteen guides, but how many of them in English? Each
card carries a row per configured locale — written against total, as a bar —
and each row links into that collection's list *at that locale*, where Payload
prints `<No Title>` against anything unwritten. The locale list is read off
`payload.config.localization` rather than written out again, so a third
language would add a third row and nothing else.

It costs five count queries per section instead of two. That is the price of
the only figure on the screen that tells somebody what to do next.

### Analytics: first-party, cookieless, no vendor

Views are counted by this app into the same database as the content.

No cookie, no third-party script, and **no stored IP address**. A visitor is
recognised within a day by `sha256(daily salt + IP + user agent)`, and the salt
is regenerated at midnight and never written down — so yesterday's hashes
cannot be linked to today's even by us. That is the property that makes it
safe to run without consent, and it is why there is no cookie banner.

Do-Not-Track and Global Privacy Control are honoured; obvious bots are
dropped; the referrer is reduced to a hostname before storage, because a full
referrer can carry someone's search terms or a private document title.

One row per view, aggregated by query — correct at this scale and wrong past
roughly a million rows, at which point the fields are shaped for a nightly
rollup. The dashboard says when it is sampling rather than quietly under-counting.

**The ceiling worth knowing:** the daily salt lives in memory, so each server
instance has its own and a visitor spread across instances can count more than
once. Counting unique visitors slightly high is a much smaller problem than
persisting a key that could link somebody across days.

### Resilience, verified

Every CMS read goes through `safeRead`, which logs one readable line and falls
back to the copy in git. This was tested with a deliberately unreachable
database: **the build still succeeds, all 42 pages generate**, and the log says
`Cannot reach the database. Check DATABASE_URI.` rather than dumping several
thousand characters of generated SQL.

The marketing site does not go down because the CMS does.

---

## See also

| | |
| :--- | :--- |
| `docs/OPEN-DECISIONS.md` | four things that need a decision before the next build step |
| `docs/BEFORE-PUBLISH.md` | the gate. Nothing goes live until every item is closed |
| `docs/NEXT-STEPS.md` | the build order from here |
| `../../Website Architecture/markyos_cms_architecture.md` | the content model, collection by collection |
| `../markyosmvp/docs/token-contract.md` | the token contract this app consumes |
