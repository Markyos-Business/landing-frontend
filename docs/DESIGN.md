# The design, and where it lives in the code

**Written for whoever picks this up next — a developer or a designer.**

The homepage was built to `UI-UX Design Reference/`, twenty-one section
mockups named 1:1 with `components/sections/`. This file says which file
renders which mockup, where the design language is defined, and — the part
worth reading — the five places the build deliberately departs from the
reference and why.

> **The reference folder was replaced on 21 Oct 2026.** The twenty-one
> section mockups are gone. In their place are thirty-nine captures of
> framer.com — home (13–28), updates (29–31), blog (32–38) and Instagram
> (39–51) — which is the identity the brand is being steered toward. They are
> *patterns*, not mockups of our sections: nothing in them is named after a
> component here, and the mapping table below still refers to the files that
> were replaced. Read the new set for composition — section headline on the
> start edge with its CTA pinned to the end edge, bento cells labelled at the
> floor, indexes as rows inside one ring, the final CTA centred — and keep
> taking colour, type and shape from `MARKYOS-DESIGN-SYSTEM.md`, which
> outranks both (§0).

> **The homepage was cut on 21 Oct 2026.** It was 2,746 words and 17,714px
> — about fourteen minutes of reading before anyone reached the price. It is
> now 1,256 words and 12,512px, of which 909 are prose and the rest are
> product-mock labels and button text.
>
> Nothing was deleted. Three sections stopped rendering here and are still
> at the pages built for them (`the-shift`, `ReplaceStack` → /platform,
> `FounderNote` → /about), and five sections stopped rendering part of their
> copy: StudioPath's eight steps became a bento of the three that had a
> picture, CompanyRun's three parts became its two mocks, ToneChecker's
> feature lists went, and Problem, Bilingual, Pillars and the roadmap each
> dropped an explaining block that the thing beside it already showed.
> Every string is still in `content/`, still transcreated, and
> `npm run check:locales` is still at 100%.

> **The RTL alignment bug, 21 Oct 2026.** 250 blocks across the site held
> Arabic and laid themselves out left-to-right — every footer link, every
> CMS-rendered heading, most cells of the comparison tables.
>
> `unicode-bidi: plaintext` reads characters, and an isolated child is not a
> character to it: it sees one neutral object replacement character, finds no
> strong character, and UAX9 falls back to left-to-right. Any block whose
> whole content was a `.mk-bidi` inline child, or an `inline-flex` wrapper,
> was invisible to its own direction heuristic. The Arabic inside still read
> correctly, which is why it looked like a styling slip rather than a bidi
> one, and why nothing caught it: the markup is right, `text-align: start` is
> right, and the defect only exists after the cascade and the bidi algorithm
> have both run.
>
> Two rules under `.mk-bidi` in `app/globals.css` fix it, and
> `npm run check:bidi` keeps it fixed.

> **The admin was branded on 24 Oct 2026.** `/admin` shipped in Payload's
> default light theme. It is now dark and on the Markyos palette:
> `app/(payload)/custom.css` re-points Payload's ~30 theme variables the way
> `app/theme.css` re-points the site's own, so no Payload component had to
> be restyled and their next release cannot break a selector we wrote.
>
> The admin follows the **platform app's** palette, not the website's. It
> maps Payload's variables onto `app/tokens.generated.css` — the file
> `sync:tokens` copies out of the platform and `check:tokens` guards — so
> the skin holds no colour literals at all and tracks the platform when it
> moves. That matters because the two sit side by side in one person's day:
> the website is #000 with #111 cards at 15px, the platform is #060607 with
> #16161a cards at 16px and a brighter text ramp, and the website's palette
> next to the platform reads as a different product. Structure still follows
> §9 and §10 — blue as the one light, no glow, beam or pattern, because it
> is a tool somebody uses for an hour at a time.
>
> Four Payload internals are touched and no more: the four custom properties
> on `.btn--style-primary`, so the primary action is blue. Before that,
> "Publish changes" and "Save Draft" were two greys a few percent apart.

**The rest of the site** — twenty-seven pages under the homepage — is built
from the same vocabulary, as data rather than components. See
`docs/PAGES.md`; the short version is that a page is a list of blocks, the
blocks compose what is defined below, and there is nowhere for a thirtieth
page to invent a card radius.

---

## Where the design language is defined

Four files, and nothing else should be inventing values.

| File | Holds |
| :--- | :--- |
| `MARKYOS-DESIGN-SYSTEM.md` | **The source of truth for every visual value** — colour, type, weight, size, radius, border, light, motion, icons. Exported from the Markyos Design System project. |
| `app/tokens.generated.css` | The **product's** tokens, copied from the platform app. Never edited here; `npm run check:tokens` fails if it drifts. |
| `app/markyos-ds.css` | The design system's marketing identity layer (`--mk-*`). Values come from the file above and are not decided here. |
| `app/theme.css` | The **marketing site's** own token names, re-pointed onto `--mk-*`. A mapping, not a palette — which is what lets the whole site change look from one file. |
| `app/globals.css` | The vocabulary built from those tokens — `.mk-card`, `.mk-btn`, `.mk-display`, the grid and the light. |

**What the reference PNGs still decide:** layout, section order, composition
and content structure. They no longer decide colour, type or shape — the
design system does, and where the two disagree the design system wins.

**The rule:** a section composes that vocabulary, it does not redefine it. If a
section needs a card two pixels rounder, that is a design question, not a
licence to write a one-off class.

Everything in `globals.css` is inside a cascade layer (`base` or `components`),
and that is load-bearing rather than tidy — an unlayered rule beats every
Tailwind utility regardless of specificity. There is a note in the file about
the morning that cost.

---

## The reference's composition grammar

`UI-UX Design Reference/` holds captures of the site the layout is drawn from.
Three of its compositions repeat often enough to be rules rather than
instances, and all three are now in the vocabulary rather than hand-rolled per
section.

**The header is a row, not a stack** (`13`, `15`, `23`, `25`, `26`). The
headline sits at the start edge and one action sits at the end edge, on the
floor of the same row — "Shipped with Framer / See Framer sites". There is no
eyebrow-heading-paragraph stack above a grid, and there is never a lone button
under one. `SectionHead` takes an `action` for this.

Why it matters beyond tidiness: a button below a grid of cards is read as
belonging to the last card. On the heading's row it is read as belonging to
the section, which is what it actually does.

**The words go under the picture** (`17`, `18`). Where a section leads with a
product visual, the explanation is beneath it — a short white title, two or
three muted lines, and the link out on the far edge of the same row. A
paragraph above a screenshot is read as instructions for something you have
not seen yet and is mostly skipped; the same paragraph below is read as the
caption for something you just looked at. `SectionFoot` is that row.

**A cell is a window, not a thumbnail** (`20`, `21`). Every cell in the
reference's platform grid holds a fragment of the product at full size, cropped
by the cell's own edges, with the cell's name on the floor: "Performance →",
"CMS →". `.mk-cell` / `.mk-cell-art` / `.mk-cell-foot` build it.

The crop is the whole trick, and it has a threshold. A screenshot scaled down
to fit its box reads as a picture of software; the same screenshot overflowing
and cut off reads as software that continues past the frame. But a *gentle*
crop reads as neither — at 132% the cut landed near the panel's own rounded
corner, so the cell showed three corners and one hard edge and looked like a
rendering fault. The reference cuts much harder than feels comfortable; its CMS
cell loses nearly half the table. 160% is where the far corner disappears
entirely and the panel starts reading as a surface instead of a broken card.

**And what the reference does *not* do everywhere:** detached cards with gaps
are reserved for things that are separate destinations, each going somewhere of
its own (`25`, the story cards). Facets of one idea are drawn flush, divided by
1px rules, as a single surface (`20`, `21`) — which is what `.mk-bento` is for.
Three symptoms of one decay are facets, not destinations.

> **Note on the reference set.** The "Mockup → component" table below lists
> `00-header.png` … `20-footer.png`. Those files are no longer in the folder —
> it now holds the `13`–`51` JPG captures instead. The table still records
> which component owns which section, which is the part worth keeping, but the
> filenames will not resolve.

---

## The homepage is `Markyos Homepage v2.dc.html`

The homepage's section order, grid and composition now come from that file in
the Claude Design project *Markyos homepage landing page*
(`b0269180-1bd7-4ce5-972d-3f2b4fb39d3b`), read through the design MCP. Its
`uploads/` folder holds the same `13`–`51` Framer captures this repo has in
`UI-UX Design Reference/`, so v2 and the composition grammar above agree:
v2's section headers are header rows, its feature cards are picture-then-words,
and its platform grid is a flush 1px bento. Those were already built here as
`SectionHead action`, `SectionFoot` and `.mk-bento`, so v2 composed them rather
than needing new vocabulary.

**What v2 changed structurally.** Ten sections, not sixteen. It leads with the
product rather than the problem, and shows what the AI does before promising
what it will not do. `app/[lang]/page.tsx` lists what stopped rendering on the
homepage and where each piece still reads — none of it was deleted, and
`npm run check:locales` still counts all of it.

**Two sections came back.** `ReplaceStack` and `FounderNote` were orphaned:
the components existed, the copy was transcreated, and nothing rendered either
one. v2 puts both on the homepage.

**Both editions are complete.** `home.aiAlongside` and `home.platformGrid`
shipped English-only at first, and the two sections also held about seventy
English string literals inside their artwork — which put 95 English strings on
the Arabic homepage, in the two sections arguing hardest that Arabic is not an
afterthought. Both are fixed: the marketing copy is transcreated in
`content/ar/overrides.ts`, and every word inside the pictures moved to
`content/mocks.ts`, whose `AR` is now filled rather than null.

The Arabic for the product chrome is **the platform app's own**, taken from the
`label` / `arLabel` pairs in `../markyosmvp/components/workspace/*`. "Discovery
brief" is «موجز التعريف» because that is what the real screen says. A mock that
names a screen differently from the screen will drift the first time either
changes.

What is still Latin on the Arabic page is Latin on purpose, and there are eight
of them: the language switcher ("English" — a switcher names its target in the
target's language), two web addresses, a URL path, the locale codes `ar-SA` and
`en-US` (§11: codes, never flags), and the brand word "Nakhla", which in the
tone checker *is* the thing being flagged as needing to be «قهوة نخلة».

**Two departures worth knowing.**

`components/sections/PlatformGrid.tsx` contains the repo's only `<svg>`
outside `components/brand/`, which trips the §14 "definition of done" rule.
It is a two-series line chart, not an icon or an illustration — §8 sanctions
chart fills, and v2 draws it the same way. §6 and §13 ban hand-drawn SVG so
that nobody draws a magnifying glass when `las la-search` exists; Line Awesome
has no glyph for a chart carrying real values, and a glyph could not carry
them if it did.

That used to be the whole note, because the §14 greps were a manual checklist
and nothing failed. They are a script now — `npm run check:design`, inside
`npm run check` — so the departure had to become a decision somebody wrote
down rather than a line in this file. It is the `inline-svg` entry in the
EXEMPTIONS table at the top of `scripts/check-design-rules.mjs`, with that
reasoning, beside the two hex exemptions (`mock/BrandHub.tsx` and
`sections/AiAlongside.tsx` — both showing a customer's brand as content).
**That table is where an exemption is recorded; this file explains it.** If
the chart moves, move the exemption with it, and note that the exemption is
per file: a *second* `<svg>` appearing in `PlatformGrid.tsx` would not fail
the build, which is the one blunt edge of file-level exemptions and the reason
the table is kept as short as it is.

The Brand health panel declares its mask twice, for `ltr` and `rtl`. A CSS
gradient angle is physical and does not mirror, so at `90deg` the Arabic page
faded the panel's *start* edge — title and first figure gone, empty chart
solid. There is no logical gradient keyword; two declarations is the fix.

> **A bug class `check:bidi` does not cover.** That script finds Arabic laid
> out left-to-right. The mirror case — Latin reordered right-to-left — is
> invisible to it and to anyone reading the English page. The platform grid hit
> it twice: `18 / 24` rendered as `24 / 18`, and `5 editors` as `editors 5`.
> The fix is `dir="ltr"` on any Latin value that is a *sequence*, which
> `isLatin()` in that file applies without forcing Arabic values to LTR.

> **`check:bidi` now measures the content box.** Filling the Arabic made it
> report nine failures that were not failures: the platform grid's file tree
> and the stakeholder list indent their rows with `padding-inline-start`, and
> the script compared the text against the *border* box, so 32px of deliberate
> indentation read as 32px of misalignment. It subtracts the inline padding
> now. The loosening was checked rather than assumed — reintroducing the
> plaintext-isolate trap still trips it on 290 blocks.

---

## Mockup → component

| Reference | Renders from |
| :--- | :--- |
| `00-header.png` | `components/chrome/Header.tsx`, with `Nav.tsx` (the two dropdowns) and `MobileNav.tsx` (the phone menu) |
| `01-hero.png` | `components/sections/Hero.tsx` + `components/mock/BrandHub.tsx` |
| `02-proof-strip.png` | `components/sections/ProofStrip.tsx` |
| `03-product-glimpse.png` | `components/sections/Statement.tsx` (`layout="split"`) + `mock/DraftsPanel.tsx` |
| `04-problem.png` | `components/sections/Problem.tsx` |
| `05-the-shift.png` | `components/sections/Statement.tsx` (`layout="center"`) |
| `06-choose-path.png` | `components/sections/ChoosePath.tsx` |
| `07-for-studios.png` | `components/sections/StudioPath.tsx` |
| `08-handoff-loop.png` | `components/sections/HandoffLoop.tsx` |
| `09-for-companies.png` | `components/sections/CompanyRun.tsx` + `mock/LeadershipMock.tsx` + `mock/VoiceMock.tsx` |
| `10-tone-checker.png` | `components/sections/ToneChecker.tsx` + `mock/ToneResult.tsx` |
| `11-source-of-truth.png` | `components/sections/Pillars.tsx` |
| `12-bilingual.png` | `components/sections/Bilingual.tsx` |
| `13-ai-drafts.png` | `components/sections/AiRules.tsx` |
| `14-replace-stack.png` | `components/sections/ReplaceStack.tsx` |
| `15-roadmap.png` | `components/sections/ComingNext.tsx` |
| `16-pricing.png` | `components/sections/PricingTeaser.tsx` |
| `17-founder-note.png` | `components/sections/FounderNote.tsx` |
| `18-faq.png` | `components/sections/Faq.tsx` |
| `19-final-cta.png` | `components/sections/Hero.tsx` (`variant="final"`) |
| `20-footer.png` | `components/chrome/Footer.tsx` |

The announcement bar above the header is not in the reference. It is launch-phase
copy that disappears on 15 Feb 2027; it is styled to match and sits above the
header so the reference's first element is still the first thing designed.

---

## The deliberate departures

Four of these are still departures from the reference PNGs. The second is
kept as a record: the design system resolved it, and in the same direction.

### 1. The nav is four items, not five

`00-header.png` draws five items — For studios, For companies, Platform,
Pricing, Resources — each with a disclosure chevron.

`markyos_solutions_menu.md` supersedes that. The two audience links became two
of the three columns inside a **Solutions** mega menu, which left room for
freelance designers; Pricing lost the chevron it had in the mockup, because
there is nothing to put under it. The header is now Solutions ▾, Platform,
Pricing, Resources ▾.

The header is also opaque where the build previously had it translucent with a
`backdrop-blur`. That was an invention — the reference measures a flat
`#09090b` — and it had a second cost: `backdrop-filter` makes an element the
containing block for its `position: fixed` descendants, which collapsed the
phone menu panel to zero height.

### 2. The display face is Inter — RESOLVED, and no longer a departure

This used to argue from the reference crops that the display face should be
Inter rather than Bricolage Grotesque. The design system now settles it, and
agrees: **Latin is Inter at 400/500** with `cv01 cv05 cv09 cv11` always on,
and **Bricolage Grotesque is the wordmark's typeface only** — never set as
live text anywhere on the site, because the wordmark is always one of the
SVGs in `public/brand/`.

Two things did change with it. Display is **500 at -0.04em**, not 600 at
-0.035em: no weight above 500 appears anywhere on this site. And Arabic is
**Thmanya Sans**, not IBM Plex Sans Arabic — Plex stays loaded only as the
last-resort fallback in the stacks, because `tokens.generated.css` still
references it.

### 3. The hero's brand-line pill has no arrow

`01-hero.png` draws a small arrow after "Every asset. Every instruction. Both
directions." There is nothing for it to link to — `eyebrow` is one string in
the copy contract with no destination — and an arrow that is not a link costs
a click to disprove. Give the eyebrow an href and the arrow goes back.

### 4. Status chips appear where the reference has none

The reference shows the post-launch page. The site is in `LAUNCH_PHASE=beta`,
so every feature that has not shipped carries an "Arriving February 2027" chip,
generated from `lib/status.ts`. They disappear on their own when each phase
ships — that is the whole point of the honesty layer, and suppressing them to
match the mockups would make the page claim things the product cannot do.

### 5. Plan feature rows read as specs, not sentences

`16-pricing.png` writes each plan row as "1 active project". The copy holds it
as `{ label: "Active projects", value: "1" }`, and turning that into the
reference's phrasing needs lowercasing and singularising — which works in
English and does not work in Arabic. The rows render as label-and-value
instead. Same information, one less thing to break in translation.

---

## Things that look like bugs and are not

- **The product mocks do not mirror on `/ar`.** They carry an explicit `dir`.
  A mock is a picture of the product running a project in one language; a
  photograph of a screen does not flip because the page around it did. The
  hero's hub is Arabic in *both* locales for the same reason — it is a Gulf
  client's brand hub, and translating it would delete the claim.
- **English text on the Arabic page is laid out left-to-right.** `.mk-bidi`
  (`unicode-bidi: plaintext`) resolves each string's direction from its own
  first strong character. Without it, "16 guideline sections" renders as
  "guideline sections 16". Only 14 of 126 copy items have Arabic so far, so
  this is the normal state, not a gap to design around.
- **The comparison table scrolls sideways on a phone.** Three columns of prose
  cannot stack. It is a labelled, focusable region so a keyboard can reach it.
- **The Solutions dropdown is a disclosure, not a `role="menu"`.** The menu
  spec §2.4 asks for arrow keys between columns, which is the menubar
  pattern. `role="menu"` announces an application menu of *commands* and stops
  the links inside being announced as links; for site navigation the W3C APG
  recommends the disclosure pattern, which is what is built — a button with
  `aria-expanded`, ordinary links, Tab to move, Escape to close. Everything
  else in §2.4 is there: hover-to-open after 150ms for a mouse, click for
  everything else, click-outside, and focus leaving the nav.
- **On a phone the dropdowns become nested accordions**, built from native
  `<details>` so they work before hydration. Two levels, as the spec asks:
  Solutions opens to three audiences, each closed, each holding its four
  solutions. Fifteen links unfolded at once is a scroll nobody reads.
- **The Arabic pages have no locale segment in their URL.** `/pricing` is
  Arabic; `/en/pricing` is English. Arabic is the site, not one of two equal
  editions — `docs/OPEN-DECISIONS.md` §6. One helper knows this
  (`lib/i18n/href.ts`) and one file maps it onto the routes (`proxy.ts`).
- **`/en` on any page below the homepage is a short notice, not the page.**
  Those twenty-seven pages are written in Arabic and not yet translated. A
  404 would be one click from the header of every page, and Arabic under an
  English URL is what `hreflang` exists to prevent. See `docs/PAGES.md`.
- **The blog, the guides and the help centre are full of placeholder prose.**
  It is marked as such on every piece, it is `noindex`, and the CMS replaces
  it one slug at a time. It exists so those three designs could be reviewed
  with real-length Arabic in them rather than against an empty state.
