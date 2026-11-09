# Markyos landing page — handoff

**For whoever picks this up next, including a fresh Claude Code session.**
Paste or attach this file. `SESSION-HISTORY.md` beside it is the full record
— 11 instructions, 397 replies, 1031 tool calls, 192 KB. This file is the
brief, and is the one to read first.

```
A:\abdulla saeed\Markyos\System\Platform Code\Landing Page
```

Not a git repository. The product app is the sibling `markyosmvp`, and two
things here depend on that path: the design-token sync and the browser checks.

---

## Read this first

`AGENTS.md` in the project root, which `next dev` rewrites on every run:

> **This is NOT the Next.js you know.** This version has breaking changes —
> APIs, conventions, and file structure may all differ from your training
> data. Read the relevant guide in `node_modules/next/dist/docs/` before
> writing any code. Heed deprecation notices.

Next **16.4.2**, App Router, Turbopack. Concretely: `middleware.ts` is now
`src/proxy.ts`, and that rename is not cosmetic — see the file.

Then `README.md` for the layout, `docs/PAGES.md` for how a page is built, and
`docs/DESIGN.md` for the design vocabulary and the rule against one-off
styling.

---

## Where it stands

Verified on 2026-10-19, and re-verifiable in two commands:

```bash
npm run check                               # tsc · eslint · token drift · Arabic parity
npm run build && npx next start -p 3210
npm run check:live                          # every article answers · every page drives clean
```

- **101 prerendered routes** — 28 registry pages, 3 editorial indexes, the
  articles, both homepages.
- **Arabic is complete**: 127 of 127 copy items.
- **70 pages × 3 viewports** drive with no console error, no failed request,
  no sideways overflow, exactly one `h1`, correct `dir`.
- **27 sitemap URLs**, exactly one of them `/en` (the English homepage).
- 3 legal pages `noindex`; **31 seeded editorial articles**, all marked
  provisional and `noindex`, plus one real post in the CMS (see launch-gate
  item 27).

---

## The five decisions that explain the codebase

**1. Arabic is the site, not a translation of it.** `/` and `/pricing` are
Arabic; English lives under `/en`. `x-default` points at Arabic and `/ar/...`
301s to the clean URL. Two files own this — `src/lib/i18n/href.ts` and `src/proxy.ts`
— and `docs/OPEN-DECISIONS.md` §6 records why `Accept-Language` negotiation
was deliberately removed.

**2. Pages are data, not components.** The 28 content pages are block lists in
`content/pages/ar/`, rendered by `src/components/public/pages/blocks/` against the
contract in `content/pages/types.ts`. Twelve block kinds. Adding a page means
editing one data file. If a page needs something the vocabulary cannot say,
**add a block** — do not reach for a one-off class.

**3. One registry drives routing, the sitemap, hreflang and the 404.**
`src/lib/pages/registry.ts`. A page cannot be live and missing from the sitemap,
or indexable and `noindex`, because both come off the same record.

**4. Editorial content has one source: the CMS, across five sections.**
`src/lib/content/` reads Payload and nothing else, for `/blog`, `/guides`,
`/help`, `/compare` and `/whats-new` — one interface, one template
(`src/components/public/editorial/`), one pair of methods. It used to merge
Payload with a placeholder seed per slug, which left thirty-one of thirty-two
articles outside the admin panel; both the seed and the merge are gone, and so
is the placeholder content.

Forty real pieces are in, in both languages, with their own covers per
language. An index de-indexes itself while *every* item on it is marked
**Placeholder content** — a condition about the content, not a flag anyone
must remember — and a section with nothing in it renders its empty state.

**5. An untranslated page is a notice, not a 404.** The language switch sits in
the header of every page, so a 404 there would read as a broken site.
`src/components/public/pages/NotTranslated.tsx`, always `noindex`, hreflang Arabic only.

Status chips come from `src/lib/status.ts` by feature id, never a hard-coded label,
so a chip disappears when the feature ships.

---

## Gotchas that cost real time

**Freeing the port.** `pkill -f "next start"` silently fails in Git Bash on
Windows, so the old process keeps holding port 3210 *and* a lock on `.next`.
The rebuild then dies partway and the server keeps serving the previous build —
which looks exactly like an edit that had no effect. Before every build:

```powershell
Get-NetTCPConnection -LocalPort 3210 -State Listen -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Then confirm `.next/BUILD_ID` exists rather than trusting the build's exit.

**`npm run check` cannot see a page.** Five bugs reached review with tsc and
ESLint green: every page prefetching an off-site redirect; a language switch
that 404'd on every article; an Arabic plural reading `1 دقائق` with a count of
one; a published post whose Arabic slug 404'd while the index linked to it; and
that same post rendering a blank English page with an empty `<h1>`. The last
two were found only by asking for *every* article on a cold server. Run
`npm run check:live` after anything touching routing, links, locales or Arabic
strings.

**Route params arrive percent-encoded** while `generateStaticParams` returns
slugs decoded — see `src/lib/pages/params.ts`. Non-obvious, and invisible until a
non-ASCII slug exists.

**Payload returns a record for any locale**, with only the *localized fields*
varying, so an untranslated piece came back as a blank-titled article. Public
reads pass `fallbackLocale: false` and treat a missing title as absent
(`src/lib/content/payload.ts`). Fallback stays on in the admin.

**Next normalises metadata URLs** and strips trailing slashes; it is not
configurable. An attempt to give the Arabic root a trailing slash was reverted
so the sitemap and the canonical agree — reasoning is in `src/lib/seo.ts`.

**Playwright is not a dependency here.** `scripts/browser-lib.mjs` resolves it
from the sibling `markyosmvp`; `scripts/check-pages.mjs` launches it with
`channel: "chrome"`, so no browser is downloaded into this repo.

---

## What is open

**`docs/BEFORE-PUBLISH.md` — items 1 to 29** (plus an 11a), the launch gate.
Item 13 is marked DONE. Items 20–29 are the
ones that need a human decision rather than code: facts the security page does
not claim, a real pricing conflict across four pages, contact addresses and
reply times, the missing co-founder name, placeholder editorial content, a test
post live in the CMS, a framework-level 500 on malformed URLs, and two CMS
locale settings left from when English was primary.

A deliberate pattern throughout: where the source documents leave a fact open,
**the page leaves it open too.** No invented hosting regions, emails, reply
times or legal terms. A plausible-looking privacy policy is worse than an
obviously unfinished one, because the unfinished one makes a careful buyer ask.
Do not "finish" these by filling them in.

**`docs/OPEN-DECISIONS.md` §2** — where a beta signup goes — is the one
remaining open decision. Everything else there is marked RESOLVED and BUILT.

---

## The task that was in flight

**Importing the design system at
`https://claude.ai/design/p/93001f6d-a0e3-4d26-87f2-01be59cb8668`.**

Blocked: `DesignSync` needs design-system authorization and `/design-login`
cannot run in a non-interactive session. **Run `/design-login` once from an
interactive Claude Code session on this machine** — headless and SDK runs then
reuse it. Alternatively Claude Design's "Send to Claude Code Web" seeds the
project into the workspace.

Partially imported already: `BricolageGrotesque-Medium.ttf` and `-SemiBold.ttf`
in `public/fonts/`, and three of the four brand SVGs in `public/brand/`.
Missing: `markyos-pattern.svg`, five Bricolage weights, all five Thmanyah Sans
weights, and every component file.

Two collisions to settle before implementing:

1. **It reverses a documented font decision.** `src/app/fonts.ts` explains at
   length why Bricolage Grotesque was *dropped* as the display face in favour
   of Inter, judged against the reference crops. The kit ships seven Bricolage
   weights and five of Thmanyah Sans, an Arabic face that would displace IBM
   Plex Sans Arabic across the whole Arabic site. The brand kit plausibly
   overrules that note, but it is a reversal, not a gap.

2. **Tokens here are generated, not authored.** `scripts/sync-tokens.mjs` lifts
   them from the sibling platform app into `src/app/tokens.generated.css`, and
   `npm run check` fails on drift — deliberately, so the marketing site's blue
   cannot quietly stop being the product's blue. If the kit's tokens differ,
   either the kit becomes the platform app's source too, or that gate changes.
   That is an architecture call, not a detail.

On scope: the file list is a full product component library — charts, donut
graphs, table widgets, switches, radios, and forty-odd `kit-aliases` covering
individual button states. A marketing site uses a fraction of it. Read
`_ds_manifest.json` and `SKILL.md` first, then propose a subset — fonts,
tokens, brand assets, and the components the pages actually use.

---

## The source documents

Six approved copy documents, checked in at full length under `docs/copy/`: the
Arabic and English homepage copy, and four page-copy documents covering
solutions, platform and pricing, resources and company, and signup and legal.
These are the authority for wording. The 28 content pages are transcriptions of
them, not paraphrases.

Other documents: `docs/STACK-DECISIONS.md`, `docs/CMS-GUIDE.md` (for whoever
writes, no code), `docs/NEXT-STEPS.md`.
