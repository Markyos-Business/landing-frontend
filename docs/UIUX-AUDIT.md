# Interface and experience audit — homepage

Measured on the running build at 1440px and at 375px with touch emulation,
in Arabic first. Numbers come from the rendered page, not from reading the
source: a token that never reaches an element looks correct in the code and
wrong on the screen, and that turned out to be the largest finding here.

Scripts used are throwaway and live in the session scratchpad; what they
proved is written down below so nothing depends on them.

---

## Fixed

### 1. The phone menu could be opened but not closed — serious

`MobileNav` renders inside the header, so its panel is the toggle's own
sibling. The panel was positioned and the toggle was not, so the panel
painted in front of the one control that dismisses it. Its top edge was a
hard-coded 56px commented as "the header's own height"; the header is 64px
and sits below an announcement bar, so on an unscrolled page the panel began
about 100px too high and lay across the header.

With no Escape key on a phone, the only way out of the menu was to follow a
link somewhere you had not chosen to go.

Fixed by measuring the header's own box when the menu opens, and by giving
the toggle `relative z-50` so it can never be buried again. The toggle is now
44px on a coarse pointer, per §10.

`check:nav` now covers the phone menu, which nothing tested before — which is
exactly why this shipped. It asks what is topmost at the middle of the button
and then taps that point; checking `isVisible` would have passed against the
broken build, because the button was visible the whole time, just underneath.

### 2. The lead size never reached the page — site-wide

`text-[var(--fs-lead)]` renders nothing. Tailwind cannot tell whether an
arbitrary value in `text-[…]` is a size or a colour, so a bare custom
property needs the `length:` hint. Without it the declaration is dropped and
the element keeps the inherited 16px.

Seven places were written that way. The hero's standfirst, the founder note
and the closing call to action were all at 16px while `--fs-lead` said 18px.
Nothing looked broken; the page was just quieter than the design system
specified.

`check:design` gained a rule. Only `--fs-*` counts as a size, so
`text-[var(--text-muted)]` — a colour, correct as written — does not trip it.

### 3. The FAQ was unreadably wide, at the wrong size

Answers were set at `text-[0.875rem]` — 14px, which §6 reserves for labels,
nav and buttons — and ran the full 44rem of their container: about 50em a
line, one of them 139 characters without a break. Comfortable reading is
roughly 30–40em.

Both question and answer are 15px now via `--fs-body`, and the answer is
capped at 34rem (about 36em). The question keeps full width: it is one short
line you scan a list of.

Measured in em, not characters, on purpose. The familiar 45–75 character rule
is calibrated on Latin; Arabic sets far more characters into the same width,
so by character count these lines still read long while the physical measure
is now correct. Longest line on the page: 139 characters before, 98 after.

### 4. One section heading was off the scale

`theme.css` calls `--fs-h2` "one h2 size in the system". The founder note
overrode it with a bespoke 28→34px clamp found nowhere else, so the one
section in the founder's voice was also the only one whose heading came in
smaller than its neighbours. All seven section headings now measure 44px at
1440 and 28px at 375.

---

## Checked and found not to be problems

Both of these looked like defects in a first pass. Recording them so nobody
spends the afternoon again.

### Contrast — no failures

A first measurement reported a 1.96:1 failure on an avatar initial. That was
an error in the measuring script, not the page: it composited a translucent
layer and then treated the result as opaque, so a 10% white row over black
resolved to near-white. With source-over alpha carried properly, **nothing on
the page fails WCAG AA**.

Ten nodes sit between 6.36:1 and 6.95:1 — just under the 7:1 that the comment
in `theme.css` claims as a small-type floor. That claim is true of 60% white
on `#111`; it is not quite true on `--surface-2` (`#1A1A1A`), where the same
ink gives 6.93:1. A comment to correct, not a colour to change.

### Tap targets — no failures

27 tappable elements are under 24×24 on a phone, 20 of them in the footer.
That is not automatically a defect: WCAG 2.5.8 passes an undersized target if
a 24px circle centred on it does not intersect another target's circle.
Tested against that clause, **every one of them passes** — the footer's 31px
pitch is what saves it.

They remain small for a phone, and Fitts's law has an opinion even where the
standard does not. Worth revisiting as a comfort improvement; not a
conformance problem, and not fixed here on those grounds.

---

## Open, and why they were left

### `$0` is set at up to 80px

`PlatformGrid`'s unlimited-viewers cell uses `clamp(3.5rem,7vw,5rem)`, which
tops out at 80px. The display scale stops at 54px, and §7 says a hand-set
display size goes back to the nearest token. But the cell's own comment
argues it is making a commercial point, and a price rendered at 54px makes it
less well. A design call: shrink it to the token, or carve it out explicitly
the way the client palettes are carved out.

### Direction C is set at weight 700

`AiAlongside` sets `weight: 700` on one exploration card, reaching the DOM
through a variable, so `check:design` cannot see it. §7 says 500 is the
heaviest weight anywhere, mocks included. It is arguably the same carve-out
the hex palettes beside it already have — a customer's brand shown as content,
and the direction being explored is literally "Bold". Drop it to 500, or
extend the carve-out to weight and write it into the exemption table.

### Twelve elements have a 2px radius

Not in the scale (4/6/8/15/20/25). No source match for a 2px radius, so it is
arriving computed from somewhere. Small, but worth tracing.

### The hero's start side is empty at desktop

The v2 design specifies a product frame beside the hero copy that was never
built, so at 1440px the composition is weighted to one side with nothing
opposite it. Not a defect in what exists — a piece that is missing.

### The navigation still carries 18 destinations

One mega panel, two-line descriptions. Flagged repeatedly and still true.
Hick's law applies: this is more choice than the moment deserves. A
restructure needs a content decision first, not a code change.

---

# Whole-site sweep — all 96 pages, both editions

Driven in a real browser at 1440px and at 375px with touch emulation. Covers
what `npm run check:live` deliberately does not: link integrity, accessible
names, heading order, contrast, physical alignment, WCAG 2.5.8 target sizing
including its spacing clause, line measure, focus visibility and duplicate
ids.

| | before | after |
| :--- | ---: | ---: |
| pages returning something other than 200 | 0 | 0 |
| JavaScript errors | 0 | 0 |
| dead or empty `href` | 0 | 0 |
| controls with no accessible name | 0 | 0 |
| duplicate element ids | 0 | 0 |
| contrast failures (WCAG AA) | 0 | 0 |
| physical `text-align` in a mirrored layout | 0 | 0 |
| Arabic laid out left to right | 0 | 0 |
| WCAG 2.5.8 target failures | 0 | 0 |
| controls with no visible focus ring | 0 | 0 |
| **Arabic painted in the wrong typeface** | **~350** | **1** |
| **gaps in the heading outline** | **4** | **0** |
| **paragraphs over 46em** | **36** | **0** |

## Fixed in this pass

### Arabic was being set in Arial, nearly everywhere

The largest finding on the site, and invisible to every check that reads the
source. `[dir="rtl"]` sets `--font-arabic` on `<html>`, but `body`
re-declares `font-family`, and a declaration on `body` beats what its
descendants inherit from `<html>`. The body stack is
`var(--font-inter), var(--font-thmanya), …`, and next/font expands
`--font-inter` to `Inter, "Inter Fallback"` — where "Inter Fallback" is a
metric-adjusted local face (Arial on Windows) that *does* carry Arabic
glyphs. Inter has none, so the browser stopped at Arial, one position short
of Thmanya.

Only headings escaped, because a later rule names the Arabic face for them.
Everything else — nav, footer, body copy, buttons, article headings — was
Arial. The computed `font-family` said Thmanya the whole time; the engine was
asked directly with `CSS.getPlatformFontsForNode`.

Fixed with `:lang(ar)`, keyed on language rather than direction, which also
catches an Arabic island inside an English page. `check:design` gained an
`arabic-face` rule.

### The heading outline had a hole on four pages

/compare, /resources, /solutions and /whats-new open straight into a card
grid or numbered list with no section heading between the `<h1>` and the
items, and both blocks hard-coded `<h3>`. Navigating by heading skipped a
level that was never there. The level now follows whether the block has its
own title; the size does not change.

### Prose had no measure

`.mk-body` paragraphs and several footnotes filled the full 1100px container
— 71 to 76em a line, against a comfortable 30–40em. The repo already had
`.mk-measure` at 62ch for this.

## Known residual

One Arabic fragment still paints in Arial: `Key term: «قهوة نخلة»` in an
English product mock, where the Arabic sits inside an English label with no
element of its own to carry `lang`. Fixing it means splitting the string in
`content/mocks.ts`, which is a content change rather than a style one.

## Outside this repository

Every "start" call to action on the site redirects, correctly, to
`app.markyos.com/start` — and **that URL returns 404**. `app.markyos.com/login`
returns 200, so the host is up and it is this one route that is missing. The
redirect here is right; the destination is not there yet. Nothing in this
repo can fix it, and it is the single most expensive broken thing a visitor
can hit.

---

# Light rebuild — 4 Nov 2026

The homepage was rebuilt to `Landing Copy/Markyos Landing AR (readable).html`
and the site turned light (see docs/DESIGN.md). Everything below was measured
on the rebuilt page at 1440px, 1024px, 768px and at 375px with touch
emulation, in both editions.

The headline finding is that **a theme flip invalidates every contrast
measurement**. The previous audit's table reads "contrast failures: 0", and
that remained true of the code — it stopped being true of the page the moment
the ground went from black to near-white, because the same opacity reads
differently in each direction. 80 failures appeared without a single colour
being chosen badly.

| | found | after |
| :--- | ---: | ---: |
| horizontal overflow (page scrolls sideways) | 4 of 4 widths | 0 |
| contrast failures (WCAG AA) | 80 | 0 |
| WCAG 2.5.8 target failures | 6 | 0 |
| paragraphs over 46em | 4 | 0 |
| gaps in the heading outline | 1 | 0 |
| cross-origin prefetch failures in console | 6 per page | 0 |
| text rendering below the 12px floor | 12 | 0 |
| JS errors · dead hrefs · duplicate ids · unnamed controls | 0 | 0 |
| Arabic painted in the wrong typeface | 0 | 0 |

## Fixed

### The page scrolled sideways at every width

`Bilingual`'s light pool is `inset: -40px`, so it reached 40px past its
section on all four sides and added 16px to the document's scroll width. The
section had no `overflow: hidden`. A decoration must never be able to do
that, so the section now clips.

### Three composition bugs from one CSS gap

`inset-inline-start` flips with the locale; `translateX()` never does, and
CSS has no logical translate. Pairing them put the pricing toggle's knob, the
handoff loop's three stations and the ecosystem funnel's six tiles in the
wrong place in Arabic — the loop's third station fell outside its frame and
the funnel's tiles sat a full tile-width off and were clipped at every
viewport. `--mk-dir` (+1 / −1) now carries the sign, in one place, and every
such transform multiplies by it.

The funnel had a second problem underneath that one: the design file pairs
tile 1 at `left: 92%` with its curve at `x: 80`, which are opposite ends of
an RTL page, so all six lines crossed. Each pair is now mirrored.

### Every page fired six failed cross-origin requests

`/start` and `/login` redirect to `app.markyos.com`, so Next prefetching them
logs a CORS failure and caches nothing. `lib/i18n/href.ts` has had
`isAppHandoff` for exactly this since the last time it happened; the new CTA
components simply did not call it. They do now.

### The quiet greys were below AA

The design file's 55%, 50% and 45% inks measure 4.34:1, 3.9:1 and 3.5:1 on
this ground, and all three carry real copy. Darkened to 62% / 62% / 58%. The
state hues had the same problem more severely — amber `#FFBB00` on a 14%
amber tint is 1.6:1 — and are re-pointed in `theme.css` to the darker values
the design file itself uses in its light mocks (`#C2004E`, `#00799A`,
`#6A3BE0`). Fills stay bright; only ink darkened.

### Touch targets

Seventeen arrow links were 24px tall, the footer's column links 19px, its
legal row 16px. `.mk-tap` now carries a 44px hit area on a coarse pointer via
an `::after`, so nothing moves; the footer's columns get real padding instead,
because a 44px target on a 33px pitch would overlap its neighbour and send a
tap to the wrong link. Verified by hit-testing 8px outside each link's text
box, not by measuring the box.

### The funnel was unreadable on a phone

Six 68px tiles placed at 8%–92% overlap each other below ~640px. The arc is
now tablet-and-up; a phone gets the same six tools as a chip row.

### Smaller

The English header overflowed at exactly 768px — four nav items plus three
controls in English words — so the desktop nav moves to `lg`. A product-mock
label was an `<h4>` under an `<h2>`, putting a hole in the outline. The
problem mock's "old logo" tag sat on the slide caption below 1100px. Tool
labels rendered at 10.24px, under the floor, from a `clamp()` the design-rule
script cannot see.

## Checked, no finding

Copy was diffed against `markyos_landing_page_copy_ar.md` v2.0: 20 headline,
CTA and footnote strings all render verbatim and all exist verbatim in the
deck. No emoji, no Arabic-Indic digits, no banned vocabulary, Western
numerals, guillemets throughout. The one exclamation mark on the page is
inside the tone checker's sample text, which is deliberately off-brand copy
being checked.

## Known residual, carried forward

The `app.markyos.com/start` 404 below is unchanged and still the most
expensive thing a visitor can hit.

`public/brand/` holds four superseded files — `markyos-wordmark.svg`,
`markyos-wordmark-white.svg`, `markyos-mark-white.svg`,
`markyos-lockup-white.svg`. Nothing references them; the masking approach in
`components/brand/Logo.tsx` needs no white variants. They are previous
artwork and should be deleted so nobody reaches for one.


---

# The flagged sections, and the rest of the site — 4 Nov 2026

Six screenshots of the Arabic homepage came back marked up, and the brief was
"check the alignment, check the overlaps, check the copy, then follow the
homepage on every other page". Everything below was measured on the production
build at 320–1920px in both editions, never read off the source.

| | found | after |
| :--- | ---: | ---: |
| table columns aligning on more than one edge | 3 | 0 |
| icons parked on the wrong edge of their block | 3 | 0 |
| decorative glyphs painted across copy | 1 | 0 |
| unequal widths in a deliberately equal CTA pair | 2 of 2 | 0 |
| light pools rendering 0px tall | 4 | 0 |
| WCAG 2.5.8 target failures across the 31 inner pages | ~55 | 0 |
| horizontal overflow (320–1920, both editions) | 2 widths | 0 |
| elements overflowing their own card | 1 | 0 |
| contrast failures, inner pages | 0 | 0 |
| JS errors · dead hrefs · duplicate ids · unnamed controls | 0 | 0 |

## The homepage, as marked up

### One CSS declaration caused three of the six

`unicode-bidi: plaintext` is set on every block element on the Arabic page, and
it is right: Arabic falls back to English by design, so a Latin line on this
page is a normal state and each string should lay out in its own direction. The
cost is that it resolves **each element separately** — and a table column is not
a set of separate elements, it is a column.

The problem table's "usual tool" column is 308px wide and its seven cells' text
ran to seven different edges: "Google Forms or Typeform" begins with a Latin
letter and went left-to-right, "a PDF or Guidelines.site" begins with Arabic and
went right-to-left. Both are correct on their own. Together they are a column
nobody aligned. The same in the comparison table's "what you use today" over
eleven rows, and in the problem table's third column, where one cell opens with
a filename and so went the other way from its six neighbours.

`.mk-page-dir` opts a cell back into the direction it inherits, which is the
page's and the one its own column header already uses. The Latin runs inside
still reorder correctly — the bidi algorithm handles them inside an RTL
paragraph, and on an Arabic line a Latin tool name is *meant* to begin at the
right. The rule says when not to reach for it: a cell that is one Latin string
ending in punctuation would have its full stop moved to the far end, which is
the case `plaintext` exists for.

A scan of all 31 data-driven pages for the same shape found none — their table
cells hold digits or Arabic, not mixed prose — but the detector is written
alignment-aware so a centred numeric column is not reported for being centred.

### And the same declaration put the icons on the wrong side

The three "what Markyos does not replace" cards had their icon at the inline
*end* while all their text sat at the start. Nothing in the markup said so:
`direction` computed `rtl` and `text-align` computed `start` on the card. The
cause is the same rule — the card's only inline content is a Line Awesome glyph,
which is a Private Use Area character and therefore strong left-to-right, so
`plaintext` resolved the whole card LTR and `start` with it. Inserting any
Arabic text next to the glyph moved it back to the right.

The lesson generalises: **do not place a lone icon with `text-align: start`.**
Those three cards now use the page's own `IconTile`, which is a grid and places
itself; a sweep of every `la-*` glyph on every page found no others, because
everywhere else the icon sits in a flex row.

### A decoration painted over the first line it decorates

The founder's note opened with a 48px quote glyph at `position: absolute`, with
the paragraphs set `position: relative` and a comment saying that cleared it.
Relative positioning does not clear anything — it decides who paints on top — so
the glyph sat across the first line of the note, which on an Arabic page is
exactly where the eye starts. It is now one line of its own above the first
paragraph, at the start edge.

While reading that component: the signature splits on `,` to separate the name
from the role, and the Arabic comma is U+060C. The split never fired on the
Arabic page, so the whole signature rendered as the name and the role never got
its quieter size.

### The two doors were not the same size

Both hero CTAs carry equal weight on purpose — making one primary would tell
half the audience they are the wrong half — and they were 215px and 183px,
because one Arabic label is three words and the other is two. Two `inline-flex`
pills cannot be equal: each sizes to its own text. `.mk-doors` is an
`inline-grid` with `1fr` auto-columns, which under an intrinsic width constraint
resolves every flexible track to the largest one, so the pair shrink-wraps to
the wider label and both come out identical. Below 30rem they stack and fill the
gutter.

## Then the other thirty-one pages

### Their light had never been painted

`.mk-glow` sets a radial background, a 50% radius and a blur. It does not set a
height, and four callers — the hero on every data-driven page, the closing CTA
on every one, the editorial header, and the 404 — passed a width and no height.
Every one of them was a 0px-tall element. These pages have been composed around
a light source that has not rendered since the light rebuild. `.mk-glow` now
carries a ratio, so a width alone is enough, and the colour is the landing
design's own soft radial rather than the blurred 32% disc that was tuned for a
black ground.

All four also paired `start-1/2` with `-translate-x-1/2`, which is the
physical-translate bug the homepage had in three places: the logical inset flips
with the locale and the physical translate does not. `.mk-center-x` carries the
sign in `--mk-dir`, as the pricing knob and the funnel tiles already do.

### 200px of nothing at every section boundary

Every inner page was one flat #F7F8FA field with a 1px rule at each boundary and
about 200px above it. The homepage is not: it alternates ground and white for
all fourteen of its sections, and that alternation is what makes the gap read as
a chapter break. The inner pages now alternate too, counted in `PageView` over
the blocks that paint a band, starting white immediately under the hero — which
is where they read worst, because the hero ended and the next heading arrived
with nothing in between to say a section had begun.

Every page also closes the way the homepage closes, on the lit arc. It sits in a
zero-height box after the content, because where its crown goes is measured from
the last line of copy: anchored to the section box instead, it either fell below
the clip on a short closing CTA or rose through the headline and cut it in half.

### About fifty-five targets under 24px

WCAG 2.5.8 at AA asks for 24×24, or 24px of clearance, and it is not about
fingers: it applies to a mouse too. Every breadcrumb crumb (21px) and every
inline "see the plans" link (20px) on all 31 pages failed it, sitting in rows
6–12px apart. None of it showed up in the homepage audit, because the homepage's
own arrow links are 24px line boxes already.

`.mk-tap` existed for this and was behind `@media (pointer: coarse)` — the right
place for §10's 44px and the wrong place for 2.5.8's 24px. The base rule now
grows the box to 24px at every pointer and the coarse rule takes it to 44px. The
breadcrumbs and the `link` button variant opted in; the text does not move.

### The English header overflowed below 356px

The lockup, the language switch, "Start free" and the menu button came to 383px
inside a 375px viewport, and the whole page scrolled sideways. Arabic fits at the
same spacing because its words are shorter — the second time a header breakpoint
set on the Arabic page has been wrong on the English one. The row's gap tightens
below `lg`, where there is no nav to separate from the logo, and below 360px the
language switch leaves the bar.

It needed somewhere to go, so the phone menu now carries it, next to "Log in",
which has been there for the same reason. 320–1920 is clean in both editions.

### The price hung out of the card

Found by `check:bidi`, of all things, which measures whether an Arabic block's
ink starts where its content box starts and reported one section 90px off. The
cause was 60px of a plan price sitting outside its card: "from 299 SAR" held
together with `white-space: nowrap` at 28px, in a five-across card with 146px of
content.

That `nowrap` was itself a fix — without it the price broke between the number
and its currency and put "a month" alongside "SAR" on the second line. Both
versions are wrong because the size was fixed and the card is not: three, four
or five across depending on how many plans a page lists. The card declares
itself a container and the price steps down when the card is narrow, which fits
on one line at every count and every width. At 1024px the same five cards have
stacked two-up and have the room back.

### Four smaller ones

The secondary CTA had stopped being a button: `.mk-outline` fills with
`--surface-2`, which was #1A1A1A on #000 and is #F4F6FA on #F7F8FA — a 1.01:1
step. The edge is the affordance now, and its press scrim runs dark instead of
white. The breadcrumb separators were drawn in `--hairline-strong`, a line
colour at 1.1:1, so the trail was crumbs with nothing between them. The
editorial notice used `.mk-inset`, which is a panel recessed into a card: it
carries no padding, so its glyph sat on the border, and it fills with the canvas
colour, which on the canvas is nothing. And the homepage's own gradient headline
clause starts at #0099FF, which is 2.82:1 here — the design system defines that
blue as light, never ink, and the arithmetic is why; the gradient now starts at
#0077FF, and `.mk-accent-clause` is what both the homepage and the inner-page
headlines render.

## Two audiences, one switch — same day

`/pricing` was 10,700px. Four of its eleven sections were the same thing twice:
a ladder of plans for studios, an eleven-row comparison of those plans, then a
ladder for companies and an eleven-row comparison of those. Nobody is both
audiences, so every reader scrolled a page and a half of somebody else's prices
to reach the FAQ. `/platform` had the shape across its two tool tables.

| | before | after |
| :--- | ---: | ---: |
| /pricing | 10,688px | 6,724px |
| /platform | 7,423px | 5,691px |

They are one `audience` block now — a segmented switch with the two runs as
panels. Both panels are rendered into the static HTML and one is `hidden`, so
every plan name is still in the document: a check of the served page finds both
«الوكالة» and «المؤسسات», and both full comparison tables. The panels are server
components passed to the client component as props, so none of that content is
in the client bundle, and without JavaScript the first option shows — the page
the site had before, minus one audience's half.

The pricing content file argued against exactly this, in a comment, on the
grounds that a toggle hides half the page from a crawler and from anyone who
arrived searching the other half's plan name. That objection was to *dropping* a
panel, which is not what this does; the comment now says so.

### Three things it turned up

**Both panels shipped the same heading ids.** The nested blocks took
`index * 100 + i`, which is the same arithmetic for every option, so /pricing
served two `#blk-101`s and /platform two `#blk-501`s. An id is a page-wide name
and `aria-labelledby` resolves to the first match — which, half the time, was the
heading in the hidden panel. Caught by the duplicate-id check, which had been
clean on these pages for every pass before this one.

**A centred switch over a start-aligned heading reads as two unrelated
objects.** `plans` and `table` gained `align`, and the panels centre their heads,
which is what the homepage's pricing section does over its own toggle.

**Six pages spent a whole section on one line.** `{ kind: "prose", body: [],
links: [...] }` is a row of links out of the section above it, and it was
rendering as an ordinary section: 200px of padding around a single 20px line,
and on /platform 235px of empty band between a table and the new switch. It
keeps the band of the section above it now and loses its top padding, because
that is what it belongs to.

### And one that was only visible when measured

The switch's two Arabic labels want 427px together. Below about 470px the grid
compresses its tracks and «للاستوديوهات والمستقلين» ran past its own button —
invisible in a screenshot at 375px, obvious when the button's width is compared
to its text's. The track fills the measure below that width, the padding
tightens, the label drops to the UI size, and wrapping is allowed as a last
resort: the knob is anchored top and bottom, so a two-line label at 320px grows
the control instead of breaking it. Verified 320–1920.

## Checked, no finding

Copy on the homepage still matches `markyos_landing_page_copy_ar.md` line for
line; nothing in this pass touched a string. No emoji, no Arabic-Indic digits,
guillemets throughout. The `/contact` and `/resources` signup field reported as
unnamed and is not: it has a visually-hidden `<label for>`, which the checker did
not look for. Nine pages reported paragraphs over 46em and none has one: a
numbered-list `<li>` is a two-column grid whose own box spans the measure twice
while every paragraph inside it is capped at 62ch. Fifteen English routes
reported Arabic in the wrong typeface, all of them `<title>`, which is never
painted. All three corrections are in the checker.


## The closing ask — same day

The brief was a reference image: a wide rounded panel in a saturated gradient,
soft light ribbons on the trailing side, an overline behind a short rule, a
large headline, and a white pill. What shipped is that composition in the
brand's own terms — blue rather than the reference's violet, because violet is
not in this palette at all and #8A58FF is a product state hue, and both blue
stops solved for white text rather than taken from the picture.

### What it replaced, and why that was a bug and not a style

`.mk-horizon`: a 900px ellipse, white at the crown, fading into the ground, lit
from below in blue, sitting behind the last thing on every page. The note in
the CSS said it was there so a page would "end on the light rather than on the
footer rule", and it did. The effect, measured rather than described, is a wash
within 1.02:1 of the canvas it sits on. The page ends by dissolving — at the
moment the visitor is being asked to choose between two doors. Ten closing
CTAs were set on nothing.

### Three findings, none of them in the brief

**The focus ring inside the panel was invisible.** The site rings focus in
`--accent`, #0055FF, "because focus is light". The panel's far gradient stop is
#0055FF. A keyboard visitor tabbing onto the closing CTA of any page would have
seen a blue ring on a blue ground — the ring was not low-contrast, it was the
same value. `.mk-deep :focus-visible` rings in white; the 2px offset keeps a
band of blue between the ring and the white pill, so it still reads as a ring.

**`.mk-outline`'s press scrim had never applied.** The shared hover state is
one white scrim from `.mk-btn::after`, and the secondary CTA's override to a
dark scrim — added in an earlier pass precisely because white over a white
button is nothing — is `.mk-outline::after`. Both are one class plus a
pseudo-element, both are in `@layer components`, and `.mk-btn::after` is
declared 259 lines later. The later rule wins a specificity tie, so the
secondary CTA on nine pages and the plan buttons on /pricing have had no
visible press state. Both overrides are qualified with `.mk-btn` now, which
wins on specificity instead of on position: a variant override that depends on
its line number is a rule waiting to be silently undone by the next insertion.

**A `className` override could not have set the panel's link colour.**
`.mk-deep-link` was the obvious way to re-ink the signpost links inside the
panel, and it cannot work: it is a component rule, `text-[var(--accent-text)]`
on the link variant is a utility, and `@layer utilities` beats
`@layer components` whatever the specificity. The only way past a layer is
`!important`, and a variant that needs `!important` to state its own colour
should have been declared instead of patched — so `Button` gained a `tone` and
a class per (variant, tone).

### How the contrast was checked

Not by computed style. A gradient under two blurred shapes has no background
colour for a checker to read, and the whole point of the panel is that the
ground under the copy varies. The check renders each panel twice — once as it
ships, once with `color: transparent` on everything, which leaves the layout
and so every text box unchanged — and takes the lightest ground pixel under
each box as the worst case that reader meets.

Across 25 routes at 1440px and 390px: no failures. The lightest ground any text
sits on is rgb(34,73,193) and the lowest ratio is 6.07:1 against a 4.5:1
requirement. The light never reaches the copy, which is the arrangement the
panel is built around rather than a coincidence.

### The phone

The lens shapes are hidden below 48rem. They are a wide-canvas device: they
read because the copy stops at a measure and the light has the rest of the
panel to move across. At 350px the panel is all measure — every headline line
reaches the far edge — so the shapes end up behind the text, which is both the
one place light must not go and the one place a hard edge becomes visible as a
shape. The phone keeps the broad bloom alone, moved into the top far corner:
above the headline, opposite the mark, no edge to collide with a wrapped line.
Still one light source, which is what §8 asks for either way.

### Verified

`npm run check` clean, nine design rules across 631 file reads. Pixel contrast
clean on every route that has a panel, both viewports. No horizontal overflow
320–1920 on 25 routes. `check:bidi` 8 pages, `check:nav` 2 editions,
`check:articles` 32 articles / 64 URLs, all pass on a fresh production build.
Focus ring and the two press states photographed on that build.

### For the copy desk

`finalCta.eyebrow` is `""` in `content/en/index.ts`. The Arabic is «ابدأ
اليوم» and the panel now renders it; /en closes on the mark alone, which is
correct but is a gap rather than a decision.



## The primary CTA was lit — same day

A reference implementation was handed over: a pill whose edge lights on the
side the cursor is nearest, with a specular riding inside it, both on one
spring. It shipped, on the solid variant only — `Button`, `landing.tsx`'s
`Cta`, and the header and phone-menu "Start free". Not the outline variant,
which is deliberately the quieter half of a pair, and not the link variant,
which is a signpost out of a section.

Three things in the reference could not ship as written, and one thing it
assumes was not true here.

**The palette was the one palette the gate fails.** Warm orange: #CD3100,
#FF7950, #E98463, a white hot spot. `check:design`'s "No warm orange, no zinc"
rule exists precisely for this, and the site has one accent which §8 defines as
light. Every stop moved to its opposite number on the #0099FF → #0055FF ramp,
positions unchanged, so the filament and the falloff land where the reference
put them.

**It was a `<button>` with an inline `<svg>`.** Both are forbidden here for a
CTA and for good reasons that predate this: a `<button>` that navigates breaks
middle-click, cmd-click and "copy link address", and Line Awesome is the one
icon system. The pill stays the site's `<Link>` and its own `Arrow`, which also
means the arrow still flips in Arabic.

**It assumed one button on a dark page.** The reference rests at full
intensity. The homepage has ten of these on #F7F8FA, and ten saturated blue
halos at rest is not a resting state. The gain rests at 0.42 and the cursor
brings it to 1, which keeps the resting gleam — it is the look — without the
page shouting at itself.

**And it has no direction to worry about.** The reference parks the resting
light at the physical right because that is where its arrow points. This site's
arrow flips, so the gleam reads the element's own computed direction and parks
under the arrow in both locales. The light *in motion* stays physical: a
reflection follows the hand, not the reading order. The two glow variables are
named `--mk-spark-plus` / `--mk-spark-minus` for the same reason — they are
signs on the screen's x-axis, and naming them after the two ends of that axis
would have tripped the physical-properties rule that exists to catch exactly
the mistake they are not making.

### What it cost, and what it does not cost

Nothing on a phone. `Spark` attaches no listener under `(pointer: coarse)` or
`prefers-reduced-motion`, so there is no loop, no `ResizeObserver` callback and
no `pointermove` handler on the devices least able to carry them — and a tap
cannot make the light jump. The resting gleam still paints, because it is CSS
with its defaults declared in `.mk-spark`, so the control looks the same and
simply never moves. The same declarations are why a CTA is lit in the server
HTML before any script runs.

On a desktop, one `requestAnimationFrame` per CTA *being pointed at*, stopping
dead when the spring settles. The reference's loop already did this; what
changed is that the frame writes four custom properties on one element instead
of `style.opacity` and `style.filter` on four refs, and that the specular is
two radial gradients whose own `at` coordinate is the light's position — so
there is no layout read and no layout write anywhere in the loop.

### The measurement that overruled the port

The specular's effect on the label's ground is in no computed property, and the
worst case is not the resting state: it is the light parked dead centre, under
the type, at full gain — which is also where a reader aiming at the label puts
the pointer. So the check forces that state on every CTA at once, captures each
pill twice — as it ships, and with the ink transparent, which leaves every box
where it was — and takes the lightest ground pixel under the glyphs.

The first port failed it, badly. The reasoning that had satisfied me was that
`plus-lighter` clamps at white, so a white label cannot be brightened past the
colour it already is. True, and beside the point: the blend lifts the *ground*
under the label, and white on near-white is 1.01:1. Four CTAs failed outright.

Three changes came out of that, none of them cosmetic.

**The light moved behind the label.** It is a pseudo-element of the pill now,
between the pill's fill and its type, rather than a layer blended over both. At
this alpha an overlay tints the type as well as its ground.

**It lost its blend mode and capped at the deep end of the ramp.** White needs
4.5:1 at 16px, which is a ground no lighter than L=0.183 — so #0099FF (L=0.26)
is out and #0055FF (L=0.137) is in. §8 calls #0055FF the falloff; on a
near-black fill it is the whole range there is. `plus-lighter` went with it: the
sum of two colours is hard to hold in mind, and that is exactly how the first
version got past review in my head. The stops now are the colours that land.

**It became a proportion of the pill instead of a measurement.** The
reference's 121px light sits on a ~200px button — 60% of it — and transposing
that as 61px of radius washed the header's 92×40 pill corner to corner while
leaving the 215px hero pills fine. 2.91:1. The header still takes 58% of the
shared value on top of the proportion, because at the shared value it measured
4.56:1 against a 4.5:1 requirement: passing, with nothing in hand, on the one
CTA that appears on every page of the site.

Final: 58 CTA labels across eight routes at 1440px and 390px, no failures,
lowest 5.75:1.

This is also why the white pill inside `.mk-deep` has no interior light at all.
There the label is near-black and there is nothing to clamp it.

### The checker was wrong three times before the page was

Worth recording, because each failure looked exactly like a page bug.

It measured **the element rect rather than the glyphs**. The landing design's
pill has no wrapper span around its label, so the fallback was the whole pill —
and the bounding box of a 999px-radius pill has four corners that are outside
the pill. Four reported failures were the page showing through those corners,
one of them the resting edge glow doing its job.

It **captured the full page by resizing the viewport to the document height**,
which reflows the page, so rects measured before the capture no longer
described the image taken after it. Two CTAs came back white-on-canvas at 390px
and only at 390px; a probe found both painted #0B0B0F with white type.

It **read the ink inside its own hidden state**, reporting `rgba(0,0,0,0)` for
two labels and computing a ratio against transparent. And it **read the rect in
the same call as the scroll**, so one run disagreed with the one before it on
the same markup — which is what a race looks like.

A measurement that disagrees with the thing it measured is the measurement's
bug, and the rule that got all four: when a check reports a failure, reproduce
it by looking at the pixel before changing the page.

### Two regressions, caught before they shipped

The plan cards on /pricing sized their CTA with `className="w-full"`. The
wrapper shrink-wraps the pill, so after wrapping, `w-full` resolved against the
wrapper and quietly came to mean "as wide as the label" — the plan buttons
would have stopped filling their cards, on the page where the button is the
product. `Button` has a `block` prop now that puts the width on the wrapper and
the pill both.

The homepage's pricing teaser said "quiet" by overriding `background` to
transparent on a solid pill. That was harmless until the solid pill grew a lit
edge, at which point it meant a glowing ring around a transparent button —
announcing itself as the ask when the whole point of it is that it is not. It
says `tone="quiet"` now. Its 22px top margin moved to a wrapper at the same
time: `Spark` draws its ring 4.5px outside its own box, and a margin on the
pill inside that box put 22px of empty space inside the ring.



## The journey became a dial — same day

The brief was a reference video: a vertical stack of display words, one at full
ink and the rest ghosted, its copy beside it, tick rails down both edges. It
maps onto the problem section's seven stations exactly — the word is the stage,
the copy is the tool and what goes wrong — so that is where it went.

### What the table was costing

The seven stations were a three-column `<table>` with `min-inline-size: 680px`
inside an `overflow-x: auto` card. On a 390px phone that is a region 290px
wider than the screen, scrolled sideways, carrying the section's whole
argument. And the stage names — the thing the section is actually about — were
its narrowest column at 16px, while the tool names beside them got the same
size and more room.

A `<dl>` says what the table said: a term, then its description. The old note
above it argued the table was load-bearing because "a studio owner reads the
table and recognises their last project, row by row" — which is an argument
about order and about pairing a stage with its breakage, and a definition list
carries both. The 680px was not part of it.

### Two things taken from the reference, and two refused

Taken: the stack of display words with one lit, and the copy attached to the
lit one rather than listed under it.

Refused, **the pinning**. The reference holds the section still and drives the
list from scroll — the page stops, the list slides so the lit word stays on a
centre line, and scrolling resumes when the list runs out. That is about seven
viewport heights on the one page that was cut from 17,700px two passes ago, and
a page that takes your scroll away is charming once. Here the list does not
move and the page never stops; the light still advances with the scroll,
because the lit stop is whichever one is crossing the middle of the viewport.
An `IntersectionObserver` with `rootMargin: "-50% 0px -50% 0px"` collapses the
viewport to a line, so a stop is "intersecting" exactly while it crosses the
centre — one at a time, no arithmetic, no scroll listener.

Refused, **the ghost grey**. The reference's unlit words are near 15% ink,
about 1.2:1 on this ground. They are the seven stages, not decoration. Solving
for WCAG's 3:1 at this size: the ground is #F7F8FA at L=0.930, so the ink may
be no lighter than L=0.277, a blended channel of 143, which is #0B0B0F at 44%.
46% ships and measures 3.20:1 against a lit 18.49:1.

### Two findings

**The tick marker was pushing the word off its own edge.** Each stop is marked
with a small bar that grows and turns blue when lit, and it began as a flex
item inside the `<dt>`, before the word — 10px of marker plus 24px of gap.
`check:bidi` reported all seven stops as "Arabic laid out from the left", 34px
off the start edge. It was not wrong: the text genuinely did not start where
its own content box started, and the check already subtracts *padding* for
exactly this reason — a marker that occupies inline space is the same bug by
another route. The tick moved into the gutter (`inset-inline-end: 100%` puts it
just outside the row's start edge in either direction), and the words now line
up on one edge instead of each being indented past its own marker.

**A growing row could have fought the observer.** Below 48rem the description
opens under its word rather than beside it, so the lit row gets ~110px taller
and everything below it shifts down — the classic setup for an open/shift/close
oscillation against a scroll-driven trigger. It does not oscillate, and the
reason is geometric: the centre line enters a row at its top, and a row growing
downward cannot move its own top, so the row that just opened still contains
the line. Verified by stepping the scroll in 22px increments through the whole
dial at 1440, 768, 390 and 320: the lit stop goes 0→1→2→3→4→5→6 monotonically
at every width, and never more than one description is visible once settled.

### Verified

`npm run check` clean. `check:bidi` clean across 8 pages — it was the thing
that caught the marker. `check:nav`, `check:articles` pass. No horizontal
overflow 320–1920 on 12 routes, which the table could not have said. Contrast
measured on the rendered page: unlit stop 3.20:1 (needs 3), lit 18.49:1, column
labels 5.47:1, tool names 5.47:1, consequences 5.87:1. Keyboard focus lights a
stop and reveals its description; scroll advances through all seven.



## Motion: four findings, three of them invisible on screen (4 Nov 2026)

Scroll reveals, a reading-progress bar and page transitions went in together.
Everything below was found by measuring the rendered page, and none of it was
visible by looking at one.

**`overflow: hidden` silently switched the reveals off, in four places.**
`animation-timeline: view()` resolves against the *nearest ancestor scroll
container*, and `overflow: hidden` makes one. Inside one, the element is
always fully within its scrollport, so entry progress is pinned at 100%, the
fill-forwards end state applies, and the reveal never runs. It fails visible,
which is the safe direction and the reason nothing looked wrong: 66 reveals
across `section#ecosystem`, `section#pricing`, `section#arabic` and the
article list shared by the blog, the guides and the help centre were simply
inert. `overflow: clip` clips the same pixels without being a scroll
container, and is closer to what three of those four rules were for anyway —
`hidden` leaves a box programmatically scrollable, which is its own bug class.

**`entry` was the wrong range unit, and the error scaled with the element.**
An `entry` range spans the element crossing the viewport's trailing edge, so
its length *in scrolled pixels is the element's own height*. An 81px article
row revealed over 27px of scroll — one frame at a normal wheel speed, so the
row did not appear to animate, it appeared to appear — while a 600px grid in
the same stylesheet took 200px. `cover` spans the whole crossing, so its
length is the viewport height plus the element's: 981px and 1500px on a 900px
screen, and 36% of each is 343px and 525px. The same number now works for a
page built out of elements of every size.

**Printing the site produced a mostly blank document.** This is the failure
the CSS comment claimed a scroll-driven reveal could not have, and the claim
was wrong. Print is not a browser that lacks `animation-timeline`; it is the
same browser with the same stylesheet and a timeline parked wherever the
reader left it. Printing the homepage from the top put **69 of its 77 revealed
elements below full opacity** — most of the site, faded or gone, on paper and
in any "save as PDF". Found by emulating print media and counting, which is
the only way to see it, because on screen it is all correct. `@media print`
now cancels the reveal and hides the progress bar.

**The Arabic progress bar looked broken and was not.** It measured 0-wide at
half the page and full at the end — exactly the shape of a wrong
`transform-origin` in RTL. Reversing the order of the two locales in the check
moved the bad sample with the *loop position* rather than with the locale: a
scroll-driven animation commits on the frame after the scroll, and the read
was landing between the two. Two `requestAnimationFrame`s instead of a
timeout, and the bar measures 320px at 25% and 640px at 50%, anchored to the
right edge, in Arabic. Third time a check of mine has been the thing that was
broken; the tell each time was a measurement disagreeing with the thing it
measured.

**Two probe bugs of my own, before any of that.** The first asked for the
lowest opacity seen while an element's top was already above the middle of the
screen — which is the point the range is tuned to *finish* at, so it found 1.0
everywhere and reported the CSS as inert on ten pages. The second narrowed to
a band near the bottom edge, which was right in principle and, under the old
`entry` range, was a 27px window a 160px scroll step stepped straight over.

### What was verified

`npm run check` clean (9 design rules, 654 file reads, Arabic 100%). Across
eleven routes at 1440 and 390: **0 revealed elements fail to reach full
opacity**, and all but the handful above the fold at load are caught
mid-reveal. No horizontal overflow 320–1920 on twelve routes. `check:bidi`
clean on 8 pages, `check:nav` on 2 editions, `check:articles` 32 articles / 64
URLs. 42 CTA labels clean, lowest 6.46:1. The dial still advances 0→6
monotonically at every width with exactly one description visible, and its
contrast is unchanged. Under `prefers-reduced-motion` nothing is faded and
view transitions run at 0s. Navigation fires one `startViewTransition` with
`mk-page-fade` and `mk-page-lift` both running — which also proves
`var(--mk-ease)` resolves on a view-transition pseudo-element, since an
invalid shorthand would have produced no animation rather than a wrong one.


## Kinetic type: four findings, two of them in claims I had written (5 Nov 2026)

**`fill-mode: both` left a filter and a translate on every settled element,
and the stylesheet said otherwise.** The first motion pass carried a comment
asserting that `from`-only keyframes leave a settled element computing
`translate: none`, and used that as the reason a `to { translate: 0 0 }` would
have been a bug. Measured, the assertion is false: a settled `.mk-slide-end`
reports `translate: 0px` and a settled word reports `filter: blur(0px)`.
Neither is `none`, so every revealed block was a containing block and a
stacking context for its absolutely positioned descendants — which is what
every `.mk-glow` pool and `.mk-spark` glint is painted against — and
eighty-three inline spans on the homepage were carrying a no-op blur, which is
real compositing work, permanently. `animation-fill-mode: backwards` fills
only *before* the range, so below the fold still hides and a settled element
is left with its own styles. Verified: 26 settled words carry no filter, 25
settled blocks carry no translate.

**The accent clause could not be faded, and the screenshot is what said so.**
The hero's blue second line measured 0.08, 0.01, 0, 0, 0, 0 across its words
and was fully, brightly visible in the capture taken at the same instant.
`.mk-accent-clause` sets `color: transparent` and paints a gradient through
`background-clip: text`, so the visible colour is the *wrapper's* background
showing through a text-shaped clip and the glyphs paint nothing — fading them
fades nothing. The animation moved onto the element that owns the gradient.
Worth keeping as a rule: an opacity animation on a `background-clip: text`
element's children is a no-op, and the only way to see it is to look at the
pixels rather than the computed values.

**Headlines were double-fading.** A block at 0.8 holding words at 0.86 paints
them at 0.69. Caught by stepping the scroll across the ecosystem headline: the
word ramp was correct, 0.86 down to 0.51, and the line still looked grey.
A block whose heading carries `.mk-words` now moves without fading.

**An `inline-block` word would have broken every Arabic heading.** Not found
by measurement — found by reading `globals.css` before writing the component.
Every split-text implementation makes its words `inline-block` so they can be
translated, and an `inline-block` is atomic to the `unicode-bidi: plaintext`
scan each heading block here uses to pick its direction: it would have seen
object replacement characters, found no strong character, and fallen back to
left-to-right. That is the same failure that already cost 250 blocks on this
site, arriving a third way. The words stay inline and the block does the
moving. `check:bidi` is clean on 8 pages, which is the evidence the decision
was right rather than merely cautious.

### And one more check of mine that was the broken thing

The motion walk reported six hero words on three pages as "never reaching full
opacity". They reach it about 700ms after the walk had scrolled past them: the
hero is the one clock-driven reveal on the site, and the check began its walk
immediately after load and never looked back. It now awaits every
`DocumentTimeline` animation before it starts. That is four checks in this
work whose first result was a bug in the check — the tell each time was a
measurement disagreeing with the thing it measured.

### What was verified

`npm run check` clean (9 rules, 663 file reads, Arabic 100%). Across eleven
routes at 1440 and 390: **150 animated elements on the homepage and 0 that
fail to reach full opacity**, with all but the above-the-fold handful caught
mid-reveal. `check:bidi` clean on 8 pages — the one that matters for word
splitting. `check:nav` 2 editions, `check:articles` 32/64. No horizontal
overflow 320–1920 on twelve routes, measured at scroll 0 where every
below-the-fold element is still at its start offset, which is the worst case
for the inline-axis slide. Print: 0 of 150 below full opacity, sampled from
mid-page rather than the top, because print keeps whatever scroll state the
reader left. 34 CTA labels clean, lowest 6.46:1. The dial still advances 0→6
at every width. Reduced motion fades nothing. LCP with the hero reveal on
versus off: 348ms against 336ms median of five loads each — a 12ms delta
inside the run-to-run noise, because the first word starts fading at t=0 so
LCP lands on it rather than on the last.


## Full coverage: three bugs shipped into the work, two checks that hid them (5 Nov 2026)

**The footer could never finish arriving.** A `cover` range is the viewport
plus the element, and the scroll available to an element at the bottom of the
document is only what sits below it — for the footer's closing bar, its own
height, about 6% of its cover range. It stopped at 0.45 opacity and stayed
there, on every page. The stylesheet had named this as the cost of `cover`
and said the page walk was what would catch it; it did, on /resources, the
shortest page on the site, where the footer is nearest the fold. `.mk-rise-end`
and `.mk-seq-end` use `entry` ranges, whose length is the element's own height
and therefore always within reach.

**Then the fix silently switched the footer off.** `.mk-seq-end` re-points the
*range*; the animation still comes from `.mk-seq > *`. Replacing one class
with the other left five footer columns with `animation-name: none` on every
page — and every assertion passed, because an element with no animation sits
at full opacity for ever, which is indistinguishable from one that animated
and finished. The walk now asks the question directly: for each probed
element, is an animation attached at all, `.mk-still` excepted. That assertion
is the only reason this is in the past tense.

**The check had also stopped looking at the footer entirely.** Its selector
listed the classes that existed when it was written, so introducing
`.mk-seq-end` removed five elements per page from the check without removing
them from the page. The count dropping from 17 to 12 on /resources is what
gave it away. Both probes now share the full selector list.

**The hero cascade cost 496ms of LCP.** Largest Contentful Paint ignores an
element at opacity 0, so it lands on the moment that element's fade *ends*:
with the cascade on, 836ms against a 340ms control, and the LCP element was a
single paragraph waiting its turn. Three arms, five loads each: off entirely
340ms, as shipped 836ms, and "the largest text rises but does not fade" 340ms
— the same as the control, to the millisecond. `.mk-load-move` now marks the
hero lead, the page title and the index lead, and the five-load median with
the whole cascade on is 332ms against 356ms off, which is no cost at all.

**And the contrast check reported white on white.** The hero's CTAs now arrive
on a clock, the last 660ms in, and that check sampled at a fixed 400ms — so it
caught a pill at part opacity, measured the page canvas showing through it,
and reported 1.00:1. It waits for the clock-driven animations now, as the page
walk already did. Fifth time in this work that a check was the broken thing;
the tell every time was a measurement disagreeing with the thing it measured.

### What was verified

`npm run check` clean (9 rules, 663 file reads, Arabic 100%). **Zero
unannounced blocks across twelve routes** — the coverage probe's whole output.
Across eleven routes at 1440 and 390: 0 elements fail to reach full opacity
and 0 carry no animation. `check:bidi` clean on 8 pages, `check:nav` on 2
editions, `check:articles` 32/64. No horizontal overflow 320–1920 on twelve
routes. Print: 0 faded of 164 on the homepage, sampled from mid-page. 42 CTA
labels clean, lowest 5.61:1. The dial still advances 0→6. Reduced motion fades
nothing. LCP: 332ms with everything on against 356ms with the above-the-fold
motion disabled, five loads each.

## Known residual, carried forward

`app.markyos.com/start` still 404s, and it is still the most expensive thing a
visitor can hit. `npm run check:pages` still times out on `networkidle` and
still does so on an untouched checkout. `public/brand/` still holds four
superseded files.

The English header overflows by 6px at 300px and 2px at 304px. The narrowest
viewport in use is 320px, which is clean.

## Copy v2.2, continuous motion, and four bugs the checks had been passing over (5 Nov 2026)

### The copy

`Landing Copy/markyos_landing_page_copy_ar.md` moved to v2.2. The Arabic
homepage was already on v2.0, so the diff is narrower than the version jump
suggests — but one section of it is a rewrite.

**§1.7, the brand brain, is a different section.** v2.0 led with "ChatGPT
knows everything about the world, the brand brain knows your brand", listed
the sources it reads and showed three articles. The deck's reason for
replacing it is that buyers ask whether the AI makes the brand *better*, not
what it generates — so the capabilities, the costs and the full explanation
move to `/platform/brand-brain`, and the homepage answers the real question
twice: once for somebody starting a brand and once for somebody who has one.
That is a two-column table with four rows, and the pairing of the rows is the
comparison, so it is built as a table and not as two lists. Under it, six
*seams* — the places two parts of a brand drift apart, each naming what
watches it — which is what turns "consistency" from an adjective into
something a reader can picture. The ChatGPT line survives as the third
paragraph of the body.

**Nine module cards now link to nine feature pages** under `/platform/`, the
header has a second dropdown to reach them by, and the footer's «المنصة»
became «كل المزايا» with «عقل العلامة» beside it. The Platform menu's own
spec is in `markyos_pages_ar_6_features.md`, which is not in this repo, so it
is built from the one source that is — §1.6 — three columns for the three
stages, nine items in their numbered order, each line that module's "replaces".

**The English homepage was still arguing v1.0.** Its station table, ecosystem,
comparison and nine modules were already v2.0, but its hero, proof strip and
problem prose were not: /en opened with "Build the brand. Hand it over. Keep
it alive." and then made the seven-tools argument from the third section down.
Those three are transcreated from the Arabic now. §4.7 of the deck lists this
as a before-publish item; it is done for the sections v2.2 touches, and the
rest of the English page was already current.

**Eleven links did not resolve, two of them before today.** The nine feature
pages do not exist yet, and `/platform/brand-brain` and `/platform/bilingual`
were *already* 404ing — the first written at copy v2.0 against a page that
was never built, the second pointing at `/platform/bilingual` where the page
is `/platform/arabic`. Neither had been caught, because `check:nav` walks the
header and the footer and both were in section copy. All eleven redirect to
the page that covers that feature today, `permanent: false` deliberately: a
308 is cached by every intermediary, so shipping one would mean readers still
being sent to `/platform` weeks after the real page existed.

### Four bugs, and the checks that had been passing over them

**Print was putting 51 blocks out of position, on six routes.** The print
block cancels every animation in the motion layer, and it used to rely on
source order to do it — a media query adds no specificity, so an identical
selector further down the file wins. That stopped being true the moment the
`:has()` rules were written: a `:has()` takes the specificity of its argument,
so `.mk-rise:has(.mk-words, …)` is (0,2,0) against the print rule's (0,1,0)
and beats it outright. Because those rules set only `animation-name`, and set
it to a *translate-only* keyframe, the elements they covered were not faded on
paper — only displaced by 20px. Which is why the print check passed for as
long as it did: it counted faded elements, and nothing was looking for the
other three ways an animation can leave a mark. `!important` now, which is
the right tool for a rule whose job is "whatever else this stylesheet says,
not on paper", and the same reason the reduced-motion block uses it.

**Every reveal inside every card was inert.** `.mk-card`, `.mk-bento`,
`.mk-cell-art`, `.mk-deep` and the comparison table clipped with `overflow:
hidden`, which makes an element a scroll container, which is what
`animation-timeline: view()` resolves against. This is the third time the same
trap has been hit here and the first time it was found by looking rather than
by a symptom: there was no symptom, because nothing had yet been animated
inside a card.

**The effect table printed its column names eight times.** The per-cell
column name is meant to show only while the row is stacked and to be hidden
from 42rem up, where the heading row carries it. Its `display: block` was an
inline style, and an inline style beats a media query — so on a desktop every
cell repeated its column's name under a table that had no column headings at
all. Caught in the first screenshot of the section.

**And `.mk-drift` sent every centred light pool half its own width sideways.**
`.mk-center-x` centres a pool with `translate: calc(-50% * var(--mk-dir)) 0`,
and an animation on `translate` replaces the whole property. There is no
additive `translate` in CSS, so the keyframes carry an inline component from
`--mk-drift-x` and the centring rule sets it. The motion check now reads both
axes at two scroll positions and asserts the block axis moved and the inline
axis did not.

Two of the checks were themselves wrong, again. The print check was measuring
the *result* — opacity, blur, scale — and reported three elements that were
correct, because `.mk-deep-wave` carries a 12px blur as its own design and
`.mk-deep-rule` carries opacity 0.55 as its own; both had no animation
attached, which is to say the print rule had worked and the check was reading
the stylesheet back as a failure. It asserts the direct thing now. And the
drift check assumed `getComputedStyle().translate` resolves percentages to
px, read "50%" as 50, compared it to half of a 992px pool and reported a
centring bug that was not there.

### What was verified

`npm run check` clean — 9 design rules across 663 file reads, Arabic 181/181.
**Zero unannounced blocks across twelve routes.** Across twelve routes at 1440
and 390: 0 elements fail to reach full opacity, 0 carry no animation. The
drift moves on the block axis and stays centred on the inline axis, in both
directions. `check:bidi` 8 pages, `check:nav` 2 editions, `check:articles`
32/64. **All 116 internal links resolve** — the only 404s are the eight
`/start` variants, which redirect off-site to the product app. No horizontal
overflow 320–1920 on twelve routes. Print: 0 of 581 sampled elements still
animated, across six routes, emulated from mid-page. 46 CTA labels clean,
lowest 6.77:1. Reduced motion fades nothing. LCP, five loads each: the Arabic
homepage 400ms with the above-the-fold cascade on against 368ms with it off,
/en 396 against 304, /platform 236 against 232.
