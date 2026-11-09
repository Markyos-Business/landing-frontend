# The pages, and how to add one

**Written for whoever picks this up next — a developer, or a writer with a
text editor.**

The site has three kinds of page and they are built three different ways. The
first thing to work out is which kind you are touching.

| Kind | Example | Lives in | Changing it means |
| :--- | :--- | :--- | :--- |
| **The homepage** | `/` | `content/{locale}/` + `components/sections/` | Editing copy data, or a component |
| **Everything else that is page copy** | `/pricing`, `/solutions/studios`, `/security` | `content/pages/ar/` | Editing a data file. No components. |
| **Editorial content** | `/blog`, `/guides`, `/help` | The CMS, with a placeholder fallback | Publishing, not deploying |

---

## Where each URL comes from

```
app/[lang]/page.tsx            →  the homepage
app/[lang]/[...slug]/page.tsx  →  every page in content/pages/ar/
app/[lang]/blog|guides|help    →  editorial content from lib/content
app/[lang]/not-found.tsx       →  404
```

Next resolves static segments before a catch-all, so `/blog` wins over
`[...slug]` without anything being configured. Anything not in the registry
404s at build time (`dynamicParams = false`).

**Arabic has no locale segment.** `/pricing` is Arabic and `/en/pricing` is
English — see `docs/OPEN-DECISIONS.md` §6, and `lib/i18n/href.ts`, which is
the only place that knows it.

---

## Adding a page

1. Write it in the right file under `content/pages/ar/` — or a new one, added
   to `content/pages/ar/index.ts`.
2. That is the whole job.

The registry (`lib/pages/registry.ts`) turns the list into the route, the
sitemap entry, the `hreflang` set and the 404 for everything else. There is no
second place to remember, which is the point: a page cannot be live and
missing from the sitemap, or indexable and `noindex`, because both come off
the same record.

```ts
{
  path: "/solutions/thing",      // route below the locale segment
  shortTitle: "الشيء",            // breadcrumb and share card
  title: "…",                    // <title>, from the doc's "SEO title" row
  description: "…",              // <meta description>
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,                 // sitemap
  blocks: [ … ],
}
```

Set `noindex: true` and it leaves the sitemap in the same edit.

---

## The blocks

A page is a list of blocks. `content/pages/types.ts` is the full contract;
`components/page/blocks/` renders them. The vocabulary is deliberately
small:

| Block | For |
| :--- | :--- |
| `hero` | The opener. One per page, first. |
| `prose` | A heading and paragraphs. The workhorse. |
| `numbered` | "The solutions, in the order that matters to you" |
| `terms` | `**term:** line` — the source documents use it constantly |
| `cards` | A grid of cards |
| `table` | A real table, in a labelled scroll region |
| `steps` | A numbered rail |
| `callout` | One statement set apart |
| `faq` | `<details>` accordions, plus FAQ structured data |
| `plans` | Pricing cards |
| `signup` | Email capture |
| `cta` | The closing call. One per page, last. |

**If a page needs something this cannot express, add a block.** Do not reach
for a one-off class — that is the same rule `docs/DESIGN.md` sets for the
design vocabulary, for the same reason. Thirty pages that each style
themselves is thirty pages that drift.

### Status chips

A block names a **feature id** from `lib/status.ts`, never a chip label:

```ts
{ kind: "callout", body: ["…"], feature: "whiteboard" }
```

The label is resolved per locale, and the chip disappears on its own when the
feature ships. A hard-coded "قريباً" would still be there in 2028.

### Direction

Nothing in a content file thinks about direction. Every string is wrapped in
`.mk-bidi` by the renderer, and all spacing is logical, so the page mirrors
from the one `dir` on `<html>`.

---

## Editorial content

`/blog`, `/guides` and `/help` read from `lib/content`, which composes two
sources:

1. **Payload** — the real one.
2. **`lib/content/seed.ts`** — placeholder articles, so the designs could be
   reviewed with real-length Arabic in them.

The composition is **per slug**: publishing one real post replaces that one
placeholder and leaves the rest standing, so the section migrates an article
at a time. Nobody flips a flag and nothing has to be deleted on a deadline.

A document ticked **Placeholder content** in the panel renders a notice on
the page and stays out of the index. The index pages de-index themselves too,
while *every* item on them is ticked — the condition is about the content, not
a flag somebody has to remember.

**The real writing landed on 8 Nov 2026.** Forty pieces in both languages —
ten blog posts, ten guides, ten comparison pages and nine release notes — are
in the CMS and published. `/compare` and `/whats-new` became CMS sections
with their own routes in the same change: `/compare` had been two
hand-written pages under `content/pages/ar/`, and `/whats-new` had nothing at
all. The help centre is the one section still empty.

---

## What is deliberately not here

- **`/start`**, the sign-up fork. It belongs to the product app, and
  `next.config.ts` redirects to it. A second fork here would be a page
  shadowed by a redirect and two flows to keep in step.
- **Named competitor comparisons.** The source forbids publishing one until
  every fact has been checked on the competitor's own site, with the date
  shown on the page.
- **Legal text.** `/privacy`, `/terms` and `/cookies` carry their
  plain-language summary and the section outline a lawyer will fill, and
  nothing that reads as a term. All three are `noindex`. A plausible-looking
  policy is worse than an obviously unfinished one: the unfinished page makes
  a careful buyer ask, and the plausible one gets relied on.

---

## Checking a page actually works

```bash
npm run build && npx next start -p 3210
npm run check:live
```

`npm run check` type-checks and lints; it cannot see a page. `check:live`
drives all 71 routes at three widths and asks for every article in both
languages, and that is where this site’s real bugs have turned up — an
off-site prefetch on every page, a language switch that 404’d on every
article, an Arabic plural reading `1 دقائق`, and a published post whose
Arabic slug 404’d while the index linked to it.

**After adding a page, run it.** A page can type-check, build, prerender and
still be broken at its own URL — the slug bug did exactly that, and left a
file in `.next` to prove it had worked.
