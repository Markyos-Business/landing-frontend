# The design, and where it lives in the code

**Written for whoever picks this up next — a developer or a designer.**

The homepage was built to `UI-UX Design Reference/`, twenty-one section
mockups named 1:1 with `components/sections/`. This file says which file
renders which mockup, where the design language is defined, and — the part
worth reading — the five places the build deliberately departs from the
reference and why.

> **The homepage was rebuilt to a new design file on 3 Nov 2026, and the
> site is now light.** `Landing Copy/Markyos Landing AR (readable).html` is
> the source: a #F7F8FA page with #0B0B0F ink, white cards lifted on long
> blue-grey shadows, 22–28px radii, pill CTAs, and a blue gradient inside the
> second clause of each headline. `MARKYOS-DESIGN-SYSTEM.md` still describes
> a black site and **no longer describes this one** — see the note at the top
> of `app/theme.css`, which now carries the light palette directly instead of
> mapping onto `app/markyos-ds.css`.
>
> The homepage sections under `components/sections/` are a *literal trace* of
> that file and carry its values as inline styles;
> `components/sections/landing.tsx` holds the ones it repeats. Everything
> else — the chrome, the blog, every page under `content/pages/` — still
> reads tokens and turned light from `theme.css` alone.
> `scripts/check-design-rules.mjs` exempts `components/sections/` from
> `raw-hex` and `inline-svg`, with the reasons in its own table; the other
> seven rules still pass everywhere, and the type floor is still 12px.
>
> Three places the trace deliberately does not copy the design file, each
> because the file is internally inconsistent on an RTL page: the ecosystem
> funnel's tiles are mirrored so each line attaches to the tile above it
> (the export crosses all six), the handoff loop's three stations are a grid
> rather than `right:%` plus a physical `translate` (which put the third one
> outside the frame), and the hero's long arrow is the right-pointing glyph
> plus `.mk-arrow` so it is correct on /en too. Each is commented at its
> site.

> **The problem section's table became a dial on 4 Nov 2026.** «علامة واحدة.
> سبع أدوات. ولا واحدة تعرف الأخرى.» carried a seven-row, three-column table
> of the journey — stage, usual tool, what actually happens. It is a `<dl>`
> drawn as a vertical dial now: the seven stages as display words with one at
> full ink and the rest ghosted, its tool and its breakage beside it, and a
> fine tick rail down each edge. `components/sections/StationDial.tsx` and
> `.mk-dial` in globals.css.
>
> The table's own note argued it had to be a table, and the part of that
> argument which is true is kept. What the section needs is the order and the
> pairing of a stage with its breakage, and a definition list says both —
> stage, then tool, then consequence — which is what a two-value table is. The
> parts that were not true any more: it carried a 680px minimum width, so the
> whole thing scrolled sideways on a phone, and it set the seven stage names,
> the argument of the section, in its narrowest column at 16px.
>
> Two things the reference the design came from does that this does not.
>
> It **pins the section and drives the list from scroll** — the page stops,
> the list slides so the lit word stays on a centre line, and it resumes when
> the list runs out. That is roughly seven viewport heights of scroll on the
> one page that was just cut from 17,700px, and taking the page's scroll away
> is charming once and infuriating on the second visit. So the list does not
> move and the page never stops. What moves is the light, and it still moves
> with the scroll: the lit stop is whichever one is crossing the middle of the
> viewport, via an observer whose root margin collapses the viewport to a line
> (`-50% 0px -50% 0px`). Same rhythm, no pinning, no scroll listener. A
> pointer or a keyboard takes over from it.
>
> Its **ghosted words sit near 15% ink**, which on this ground measures about
> 1.2:1. They are the seven stages, not decoration, so they are held to WCAG's
> 3:1 for large text: the ground is #F7F8FA at L=0.930, so the ink may be no
> lighter than L=0.277, which is #0B0B0F at 44%. 46% is used and measures
> 3.20:1. The drama survives it — what carries the effect is the distance
> between lit and unlit, and lit is 18.49:1.
>
> Three details worth keeping. Each stage is a `<button>`, because everything
> a stop says is in the document either way — a screen reader walks all seven
> — but a sighted keyboard user would otherwise have had six stops they could
> never read. The descriptions are absolutely positioned and centred on their
> own row, so no row changes height when the light moves; below 48rem they go
> static and open under the lit word instead, since there is no second column
> to put them in. And the tick marking a stop sits in the gutter rather than
> inline before the word — see the audit for why.

> **The primary CTA was lit on 4 Nov 2026.** A specular highlight rides inside
> the filled pill under the pointer and the edge it is nearest lights up, both
> driven by one spring, so the light lags the cursor and overshoots when it
> stops. `components/ui/Spark.tsx` is the mechanism and `.mk-spark*` in
> `globals.css` is what it paints. It wraps the solid variant only — in
> `components/ui/Button.tsx`, in `landing.tsx`'s `Cta`, and on the header and
> phone-menu "Start free" — because it marks the one ask per section, and an
> effect that marks everything marks nothing.
>
> This is a departure, and from a rule written in this repo rather than one
> inherited. `landing.tsx` says of the CTA: "The press state is `:active`
> scaling in the design file. That is a hover lift by another name, so it is
> left out: states, not choreography." This is choreography and it was asked
> for. The distinction worth keeping is that a lift moves the control, so the
> thing you are aiming at is somewhere else by the time you click it. Nothing
> here moves: the pill's box, its label and its hit area are identical at every
> frame, and what changes is light falling on a surface that stays put.
>
> The spring constants, the ±12px overshoot past the pill, the 0.5 exponent on
> the glow's rise and the 32ms step cap are the reference implementation's,
> unchanged. The palette is not. The reference is warm orange — rgba(255,137,
> 100,.2) into #CD3100 on the wide ring, a white hot spot at 92% of the crisp
> one — which is the one palette `check:design` fails outright, and this site
> has a single accent defined as light. Each stop moves to its opposite number
> on the #0099FF → #0055FF ramp and nothing else changes, so the hot spot and
> the falloff land where the reference put them.
>
> Four things it does that the reference does not.
>
> It **rests at 0.42, not at 1**. The reference rests fully lit and can afford
> to: it is one button on a dark page. This ground is #F7F8FA and the homepage
> has ten of these, so ten saturated halos at rest is not a resting state. The
> gleam stays — it is the look — and the cursor brings it up.
>
> It **rests on the end edge, which is the start edge in Arabic**. The
> reference parks the light at the physical right, where its arrow points. This
> site's arrow flips, so the resting gleam reads the element's own computed
> direction and parks under the arrow either way. The light *in motion* stays
> physical, because a reflection follows the hand and does not know which way
> the page reads.
>
> It **does nothing on a coarse pointer**. No listeners at all: there is no
> cursor to follow, and a `pointermove` from a tap would make the light jump.
> The resting gleam still paints, because it is CSS, so the control looks the
> same and simply never moves. Same for `prefers-reduced-motion`.
>
> It **publishes four custom properties on one element** instead of writing
> `style.opacity` and `style.filter` onto four refs per frame — which is also
> why the resting state is right before any script runs. The specular is two
> radial gradients whose own `at` coordinate is the light's position, so moving
> it repaints one element and there is no layout in the loop.
>
> And its **interior light is dark, and behind the label**, which is the one
> place the port had to argue with the reference rather than transpose it. The
> reference's light is near-white at the core and that is right there: its pill
> is light grey with #5A250A type, so brightening the ground under dark ink
> raises the contrast. This pill is the inverse. Measured, the first version
> put the label's ground at rgb(253,254,254) with the cursor resting mid-pill —
> white on white, 1.01:1, on the exact spot a reader aiming at the label puts
> the pointer. So the light moved behind the type as a pseudo-element of the
> pill rather than a blended overlay, lost its blend mode, and capped at the
> deep end of the ramp: white needs a ground no lighter than L=0.183 at this
> size, which rules out #0099FF (L=0.26) and allows #0055FF (L=0.137). It is
> also sized as a proportion of the pill rather than in rem, because the
> reference's 121px light is 60% of its button and writing that as a
> measurement washed the header's 92px pill corner to corner. The header still
> takes 58% of the shared value on top of that — see `.mk-btn-sm` in
> globals.css. Lowest measured ratio across 58 CTA labels: 5.75:1.
>
> On the white pill inside `.mk-deep` there is no interior light at all, for
> the same reason pointing the other way: there, the label is near-black and
> nothing would clamp it. The ring's two soft layers are #99D6FF rather than
> white. A white bloom around a white pill on blue reads as fog — no hue
> between the glow and the thing glowing, so the pill's edge dissolves into it
> — and only the 1px filament stays white, which is what gives the edge back.
>
> Two things it broke on the way in. The plan cards sized their CTA with
> `className="w-full"`, and the wrapper shrink-wraps, so `w-full` quietly came
> to mean "as wide as the label"; `Button` has a `block` prop now that puts the
> width on both. And the pricing teaser said "quiet" by overriding `background`
> to transparent on a solid pill, which stopped being harmless the moment the
> solid pill grew a lit edge — it says `tone="quiet"` now, and its 22px margin
> moved to a wrapper, because a margin inside the spark put empty space inside
> the box the ring is drawn around.

> **The closing ask became an object on 4 Nov 2026.** Every page ended on
> `.mk-horizon` — a 900px ellipse, white at the crown, fading into the ground,
> lit from below in blue. The intent was that a page end on light rather than
> on the footer rule. What it did was end the page by dissolving it: a wash the
> same colour as the ground, arriving at exactly the moment the visitor is
> asked to decide. The decision was set on nothing.
>
> It is now `.mk-deep`: one panel of brand blue, inset on the ground, copy
> packed to the reading edge, and the light moving *inside* it — a broad lift
> across the far half and two soft lens shapes, tip to tip along the diagonal.
> It is the one place on a paper-white site where the ink inverts, which is
> what makes the last thing on the page the loudest thing on it. The homepage's
> final CTA and the `cta` block on nine pages are the same object now.
>
> Both blue stops are solved for white text rather than picked: #0099FF is
> 2.9:1 against white and #0055FF is 5.6:1 — enough for a display line, under
> AA for the 17px lead beneath it — so the ground behind the copy stops at
> #0040E0 (7.5:1) and deepens to #0A1F8C (13.2:1) at the reading edge, and the
> brighter blues appear only in the light on the far side where no copy goes.
> The figures are in `--mk-deep-near`'s note in `theme.css`. Measured on the
> rendered pixels rather than the declarations, because a gradient under two
> blurred shapes has no computed background colour to check: the worst ground
> any text meets is rgb(34,73,193) and the worst ratio on the page is 6.07:1.
>
> Nothing in it is drawn. The lens is a box with two opposite corners rounded
> to 100%, rotated off the diagonal and blurred — §13 forbids hand-drawn SVG
> shapes, and a shape that can be a `border-radius` should be one. Everything
> in it mirrors: a diagonal gradient has no logical form, so `115deg` would be
> 115deg in both locales, and the same is true of a radial's `at 100%` and of a
> rotation. The Arabic values are the declared ones and `[dir="ltr"]` overrides
> them, as `.mk-accent-clause` already did; the corner radii are written
> logically and the rotations carry `--mk-dir`.
>
> Three things the panel turned up. The site's focus ring is `--accent`, which
> is #0055FF, which is this panel's own far stop — a keyboard visitor would
> have tabbed onto the closing CTA and seen nothing, so `.mk-deep
> :focus-visible` rings in white. `.mk-outline`'s dark press scrim had never
> applied: `.mk-outline::after` and `.mk-btn::after` are both one class plus a
> pseudo-element, in the same layer, and `.mk-btn::after` is declared later, so
> the white scrim won and the secondary CTA on nine pages had no visible press
> state. Both overrides are qualified with `.mk-btn` now rather than depending
> on a line number. And `Button` gained a `tone`, because `.mk-deep-link` could
> not have worked as an override at all — it would be a component rule against
> `text-[var(--accent-text)]`, a utility, and `@layer utilities` beats
> `@layer components` whatever the specificity. One class per (variant, tone)
> instead.
>
> On a phone the lens shapes are hidden. They are a wide-canvas device: they
> work because the copy stops at a measure and the light has the rest of the
> panel to move across, and at 350px every line of the headline reaches the far
> edge, so the shapes end up behind the text — both the one place light must
> not go and the one place a hard edge is visible as a shape. The phone keeps
> the bloom alone, in the top far corner, above the headline and opposite the
> mark.
>
> The homepage's `Hero` and its closing CTA are two components now. They were
> one, parameterised, because they say the same thing; they no longer look like
> the same thing, and the parameterised version had reached eight `final ?`
> ternaries with the alignment about to be the ninth. The eyebrow the panel
> carries is not new copy — «ابدأ اليوم» had been sitting in
> `content/ar/overrides.ts` unrendered since the copy deck was built, the hero
> having never had a slot for it. The English `finalCta.eyebrow` is `""`, so
> /en closes on the mark alone.

> **Two audiences became a switch on 4 Nov 2026.** `/pricing` was 10,700px and
> four of its eleven sections were the same thing twice — a ladder of plans for
> studios, an eleven-row comparison of those plans, then a ladder for companies
> and an eleven-row comparison of those. Nobody is both audiences, so every
> reader scrolled a page and a half of somebody else's prices to reach the FAQ.
> `/platform` had the shape across its two tool tables, nineteen rows between
> them. `/pricing` is now 6,700px and `/platform` 5,700px.
>
> The vocabulary gained one block, `audience`, which holds named options and a
> list of blocks each — so the two runs stay in one content file and the switch
> is a data shape, not a component per page. `components/page/AudienceTabs.tsx`
> renders it.
>
> `content/pages/ar/pricing.ts` carried a long comment arguing *against* exactly
> this, on the grounds that a toggle hides half the page from a crawler and from
> anyone who arrived searching the other half's plan name. The objection was to
> *dropping* a panel. Both panels are rendered into the static HTML and one is
> `hidden`, so every plan name is still in the document; the panels are server
> components passed to the client component as props, so none of that content
> reaches the bundle; and without JavaScript the first option shows, which is the
> page the site had before minus one audience's half. The source document asked
> for `?for=studios` / `?for=companies`, and `#studios` / `#companies` now do
> what the parameter was for — they select the panel *and* scroll to it, which
> an anchor into a hidden panel cannot.
>
> Three smaller things came with it. `plans` and `table` gained `align`, because
> a centred switch above a start-aligned heading reads as two unrelated objects —
> the homepage centres its own pricing head over its toggle for the same reason.
> A heading-less, copy-less `prose` block — six pages use one as a row of links
> out of the section above — no longer spends a band or 200px of padding on a
> single 20px line; `signpost` in `blocks.tsx` and the counter in `PageView`
> both know about it. And the two option labels are the page's existing
> eyebrows, so the only new string is the switch's accessible name.

> **The rest of the site followed the homepage on 4 Nov 2026.** The light
> rebuild turned every page light from `theme.css`, but only the homepage was
> given the design's *language*; the thirty-one data-driven pages were a flat
> #F7F8FA field from the breadcrumb to the footer, separated by a 1px rule with
> about 200px of nothing above it. Seven shared changes brought them across, all
> of them in `components/page/blocks/`, `components/ui/` and the token layer,
> so no content file changed:
>
> - **The band rhythm.** Sections alternate ground and white, counted in
>   `PageView` and painted by `.mk-band`, starting white immediately under the
>   hero. The homepage alternates for all fourteen of its sections, and that
>   alternation is what makes a 120px gap read as a chapter break rather than a
>   hole. `Section`'s `rule` prop survives for a hairline *inside* one band and
>   nothing uses it.
> - **The light is painted.** Four callers — the hero on every page, the closing
>   CTA on every page, the editorial header and the 404 — passed `.mk-glow` a
>   width and no height, so the pool was 0px tall and had never once rendered.
>   `.mk-glow` now carries a default ratio and the landing design's own soft
>   radial; the old value was a 32%-blue disc under a 40px blur, which was a
>   light source on black and a stain on near-white.
> - **The horizon.** Every page now ends on the homepage's lit arc
>   (`.mk-horizon`), placed in a zero-height box *after* the content, because
>   the crown's position is measured from the last line of copy. Measured from
>   the section box it either fell below the clip or rose through the headline.
> - **The accent clause.** A page's `<h1>` sets its closing sentence in the blue
>   gradient, split on a sentence terminator and never on a comma, so a headline
>   with no terminator renders unchanged. `.mk-accent-clause` is now what the
>   homepage's `Accent` renders too.
> - **The table shell.** A white card lifted off the ground with 10px of its own
>   padding and alternating row tints, instead of a 1px box with rules.
> - **`--mk-blue-ink`.** The design file's gradient starts at #0099FF, which is
>   2.82:1 on this ground — under the 3:1 AA asks of display text, on the one
>   element the design uses blue as ink for. The gradient now runs #0077FF →
>   #0055FF (3.89:1 → 5.28:1). Fills and glows keep the core blue.
> - **`.mk-outline` inverted.** "The fill is the affordance" was true when
>   `--surface-2` was #1A1A1A on #000. Re-pointed light it is #F4F6FA on
>   #F7F8FA, a 1.01:1 step, and every secondary CTA on the site had become a
>   floating label. The edge is the affordance now and the fill is white, which
>   also reads on the white band.
>
> Two general hazards came out of it and are worth knowing before writing
> another RTL block. `unicode-bidi: plaintext` resolves **each element
> separately**, which is right for a standalone string and wrong for a column of
> them — `.mk-page-dir` opts a cell back into the page's direction, and the rule
> says when not to use it. And a lone icon at the head of a plaintext block
> resolves that block from the glyph, which is a Latin-direction character, so
> the block flips and the glyph lands on the end edge; place such an icon with
> flex or grid rather than trusting `text-align: start`.

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

> **9 Nov 2026:** `PlatformGrid.tsx` and the other ten unrendered homepage
> sections were deleted, so the chart described below no longer ships. The
> note stays as the reasoning to reuse if a chart comes back. The classes
> nothing rendered after that went too: `.mk-bento`, `.mk-cell`,
> `.mk-cell-art`, `.mk-cell-foot`, `.mk-feature`, `.mk-beam`, `.mk-pattern`
> and `.mk-deep-rule`. Mentions of them elsewhere in this file are history.

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
| `02-proof-strip.png` | — (deleted 9 Nov 2026; in git history) |
| `03-product-glimpse.png` | `mock/DraftsPanel.tsx` (via the page registry); the section — (deleted 9 Nov 2026; in git history) |
| `04-problem.png` | `components/sections/Problem.tsx` |
| `05-the-shift.png` | — (deleted 9 Nov 2026; in git history) |
| `06-choose-path.png` | `components/sections/ChoosePath.tsx` |
| `07-for-studios.png` | — (deleted 9 Nov 2026; in git history) |
| `08-handoff-loop.png` | — (deleted 9 Nov 2026; in git history) |
| `09-for-companies.png` | `mock/LeadershipMock.tsx` + `mock/VoiceMock.tsx` (via the page registry); the section — (deleted 9 Nov 2026; in git history) |
| `10-tone-checker.png` | `mock/ToneResult.tsx` (via the page registry); the section — (deleted 9 Nov 2026; in git history) |
| `11-source-of-truth.png` | — (deleted 9 Nov 2026; in git history) |
| `12-bilingual.png` | `components/sections/Bilingual.tsx` |
| `13-ai-drafts.png` | — (deleted 9 Nov 2026; in git history) |
| `14-replace-stack.png` | `components/sections/ReplaceStack.tsx` |
| `15-roadmap.png` | — (deleted 9 Nov 2026; in git history) |
| `16-pricing.png` | `components/sections/PricingTeaser.tsx` |
| `17-founder-note.png` | — (deleted 9 Nov 2026; in git history) |
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
so every feature that has not shipped carries an "Arriving soon" chip,
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


## The site moves as you read it (4 Nov 2026)

Asked for directly: the pages were static and read as static. Three things
were added, and together they are one idea — the page responds to the
scroll and to the navigation, and never to itself.

**Sections reveal as they arrive.** `.mk-rise` reveals the element it is on;
`.mk-seq` reveals its direct children, staggered three deep. Twenty pixels of
rise and a fade, nothing else: no scale, no blur, no lift on hover, nothing
that moves a control you are aiming at. The vocabulary is in `app/globals.css`
and the classes are placed by hand, section by section, because what a section
*is* already names the right units — a heading block, a picture, a grid, the
row that closes it.

**It is CSS, with no JavaScript at all.** The obvious build is an
IntersectionObserver that adds a class, and it has one failure mode that
outweighs everything it buys: the hidden state has to live in the stylesheet,
so a chunk that 404s or a hydration error leaves a header above a blank page.
A scroll-driven animation cannot fail that way — where `animation-timeline` is
unsupported, the `@supports` block is dropped whole and the page renders as it
did before. It is also the more honest reading of "interactive": the animation
is *driven* by the scroll rather than triggered by it, so it follows the
reader's hand in both directions.

**The header's bottom rule filled in as you read.** `.mk-progress` was a 2px
blue line along the line the header already draws, the one piece of new
chrome in the motion layer and the only motion kept under
`prefers-reduced-motion`. It was removed on 5 Nov 2026, by request — see the
end of this document.

**Pages are pushed back and replaced on navigation.** (This paragraph
describes the first version, a crossfade with a 16px lift; the depth push
that replaced it is at the end of this document.) React's `<ViewTransition>` over the
browser's View Transitions API, which is what the Next docs shipped in
`node_modules` prescribe for this version. One file —
`app/[lang]/template.tsx` — not nine `page.tsx` wrappers: the guide says to
avoid a layout because a layout persists and so its enter and exit never fire,
and a template is the third thing, rendered between layout and page and keyed
per route. It carries the reasoning, including why it is keyed on the pathname
(nine of this site's destinations are the *same* `[...slug]` page with
different params, which React would otherwise treat as an update rather than
an exit and an enter) and why the motion is on the block axis rather than the
guide's forward/back slide (this nav is flat, so there is no forward to
encode; and a slide is physical, and `::view-transition-*` pseudo-elements
cannot be written logically).

This needed react and react-dom at 19.3.1, up from 19.2.8: `ViewTransition`
does not exist before 19.3, not even behind an `unstable_` name. Nothing else
in the bump is used.

**What this departs from.** MARKYOS-DESIGN-SYSTEM.md §13 forbids "entrance
animations, parallax or scroll effects". §13 is one of the sections that
file's own header marks as superseded for the website, and this was asked for.
What is kept is the part of the rule that was never about taste: nothing moves
a control you are aiming at, nothing changes layout, nothing is animated that
a reader is already reading, and every piece of it is removed under
`prefers-reduced-motion` except the one that reports position.

**Where the reveal classes may not go.** Not on a `.mk-bento` cell — a bento's
1px gaps are the hairline ground showing through, so a cell revealing on its
own fades up out of a coloured slot; the grid arrives as one object instead.
Not on a `position: sticky` element — a scroll-driven range measures the
element's own position, and a stuck element stops moving, which parks its
reveal part-finished. And not inside an `overflow: hidden` ancestor, for the
reason in the audit.


### Kinetic headings and facing columns (5 Nov 2026)

A second pass, asked for: the first one revealed blocks, and the page still
read as blocks arriving. Two more ideas, both from where the market is rather
than from preference — scroll-driven reveals and kinetic type are the two
motion patterns 2026 writing agrees on, and the advice that comes with them is
restraint: animate the message hierarchy, not every character.

**Headlines resolve word by word.** `<Words>` in `components/ui/Words.tsx`
splits a display line on whitespace and gives each word its own slice of the
scroll range — 1.4% of `cover` apart, about 14px of scroll, so a line arrives
in reading order rather than all at once. It is on display headings and
nowhere near body copy: a paragraph that assembles itself while you read it is
a paragraph you read twice.

Two things about it are forced rather than chosen, both by Arabic. It splits
on whitespace and never inside a word, because Arabic letters join and six
boxes would render six isolated forms. And its spans stay `display: inline`,
so the words fade and sharpen but do not move: every split-text library makes
them `inline-block` for the translate, and an `inline-block` is atomic to the
`unicode-bidi: plaintext` scan that every heading block on this site uses to
find its direction — it would have found a row of object replacement
characters and sent every Arabic headline to the wrong edge. The movement
belongs to the block instead, which is the better reading anyway: the sentence
arrives, then the words land.

**Facing columns arrive from their own edges.** `.mk-slide-start` and
`.mk-slide-end` on the two halves of a split — the section head, the Arabic
section, the handoff loop, the module tablist and its panel, the problem
section's head. Start-side content begins displaced toward the start edge,
which is the left in English and the right in Arabic, and the end-side column
lands fractionally later so the pair reads as opening. The distance is
clamped, 10px at 320px and 24px once there is room: this is the one piece of
motion here that can reach past the page edge.

**The hero resolves on a clock, not on scroll.** It is the one exception, and
it exists because the rest of the system cannot cover the first screen: a
`cover` range completes before the page has been scrolled, so the first thing
a visitor saw was the only thing that never moved. 55ms a word, 520ms each.
It costs 12ms of LCP, measured.

**A block whose heading carries `.mk-words` moves but does not fade.** Two
opacity animations multiply, and a headline painted at 0.69 on a near-white
ground reads as washed rather than arriving. One property each: the block
carries the movement, the words carry the fade.

**The accent clause arrives as one phrase.** `.mk-accent-clause` paints its
blue through `background-clip: text` with transparent glyphs, so what is
visible is the wrapper's background through a text-shaped clip and fading the
words inside it fades nothing at all. `<Accent at={…}>` puts the animation on
the element that owns the gradient, and the clause arrives after the line it
follows. Per-word clipping would work and would restart the brand ramp once
per word, which is not this component's decision to make.


### Everything arrives, and in order (5 Nov 2026)

A third pass, asked for: coverage rather than new ideas. Instead of guessing
what had been missed, a probe walks every page and reports the shallowest
block that neither is animated nor contains anything animated. It found the
hero's lead, doors, microcopy and tools row; the head of every content page
and every collection index; the footer; the audience switch; the closing note
under five block types; the breadcrumb; the FAQ heading; and the help centre's
eight category headings. **All twelve routes now report zero.**

Two vocabularies were added to do it.

**`.mk-load` and `.mk-seq-load`** — one element, or a container's children one
after another, arriving on a clock rather than on the scroll. Above the fold
there is no scroll to be driven by: a `cover` range is already complete when
the page opens, so everything on the first screen was reaching the reader
finished. 80ms apart, 420ms each, capped at the sixth child — a seventh
arriving 560ms in is a queue, not a cascade.

**`.mk-rise-end` and `.mk-seq-end`** — `entry` ranges for the end of the
document. The footer has nothing below it to scroll through, so a `cover`
range can never complete there; `entry` is the right unit for exactly the
reason it was the wrong one everywhere else, because its length is the
element's own height and that is the scroll a bottom-flush element is
guaranteed to have.

**`.mk-load-move`** marks whatever the browser will pick as the Largest
Contentful Paint — the hero lead, the page title, the index lead. Those rise
without fading, because an element at opacity 0 is not counted as painted and
a faded LCP element pushes the metric out by its whole delay plus duration.
With it, the cascade costs nothing measurable. Without it, 496ms.

The general rule behind all of this, now stated once in the stylesheet: **a
container that passes the reveal down to its children moves but does not
fade**, because two opacity animations multiply and the result reads as washed
rather than as arriving. `:has(.mk-words, .mk-seq, .mk-rise)` says it for the
scroll-driven classes and for the load cascade alike.

Page transitions were already in place from the first pass and are unchanged
in mechanism: `app/[lang]/template.tsx`, React's `<ViewTransition>`, keyed on
the pathname, crossfading upward. The lift went from 10px to 16px and the
enter from 220ms to 240ms, because at the original values the transition was
doing its job and nobody could tell.

### Motion that does not stop, and a transition with a direction (5 Nov 2026)

Three passes had added *arrivals*: fourteen sections each of which finished
moving before the reader had finished scrolling past it, which is fourteen
static sections with an entrance. The page was covered and still read as
static. What was missing was not more reveals.

**`.mk-drift` is the one keyframe here that is not an arrival.** It runs
across the element's *whole* crossing rather than its first third, so the
travel is symmetric about the settled position and the middle of the viewport
is the only place the layer is where the layout put it. It is parallax, which
the design system's §13 forbids and its own header marks superseded for the
website; the part of that rule that was never about taste still holds, so the
list of things allowed to drift is three selectors long and lives in the rule
itself — light pools, the closing panel's two lens shapes, and the art inside
a cropped cell. Nothing a reader is reading ever moves continuously.

**`.mk-pop` is arrival with depth**, for the heavy objects: the closing panel,
the comparison table, the sign-up card, the three bentos, the featured
article. A 1120px panel cannot travel far enough on the block axis to read as
arriving without the page looking loose — that compromise is what
`.mk-rise-soft` exists to admit. Scale does not have the problem: 3.5% of a
wide panel is 40px of edge travel while its centre barely moves. It is the one
keyframe here that is not free, because `scale` resamples the text inside it
while it runs, which is why it is on panels and never on a heading.

**`.mk-draw`** is a rule that draws itself from its start edge, and the one
piece of motion here that is not a reveal of the element it is on — it *is*
the element, so it is the one that must not have a resting from-state, and it
has none: `backwards` fills the undrawn state only before the range. A browser
without `animation-timeline` draws the whole rule.

**Cards stopped being scroll containers.** `.mk-card`, `.mk-bento`,
`.mk-cell-art`, `.mk-deep` and the comparison table all clipped with
`overflow: hidden`, which makes an element a scroll container, which is what
`animation-timeline: view()` resolves against — so every reveal inside every
card on the site was measured against a box that never scrolls. They clip with
`overflow: clip` now, and the first thing that bought is a stagger one level
deeper: the bullets inside a card arrive after the card does.

**Pointer states, which the design system's §1 and §5 had deleted.** Three
rules, all of them answers rather than ornament: a link's arrow leans the way
it points, a CTA presses, and a card that is a link rises toward the pointer.
Each is on something the reader is already aiming at, which is the one place
motion cannot be in the way, and each is inside `(hover: hover) and (pointer:
fine)` so a touchscreen — where `:hover` sticks after a tap — gets none of it.
The travel is gated on `prefers-reduced-motion` and the shadow is not, because
a state change is information and only the movement is the part somebody may
not want.

The card lift is `filter: drop-shadow` rather than `box-shadow`, for a reason
specific to this site: most of these cards set their lift as an inline
`boxShadow` from the design file's own values, and an inline style beats any
rule in any layer — so a `box-shadow` hover would need `!important` on every
card for ever.

**And selecting a module now produces motion.** The platform section's tab
panel swapped its text in place; `key={open}` remounts the subtree on every
selection, which restarts the clock-driven cascade, so the stage, the name,
what it replaces, the promise, the sub-features and the link arrive one after
another. Clock-driven and not scroll-driven for the reason `.mk-load` exists:
the panel is already in view when you click.

### The page transition

The first version was a crossfade with a 16px lift, and the complaint it
earned was fair. A crossfade between two pages that share a header, a footer
and a background colour is a transition you have to be told is there: nothing
in it said which way the pages went, and 16px over 420ms is 38px a second,
below the speed at which motion registers as motion rather than as a page
settling.

What replaces it is a depth push, which is the one direction this site does
have. The page you left recedes — fades, shrinks 1.5%, blurs 2px, gone in
150ms. The page you asked for arrives from in front of you, 24px low, 1.2%
over size and 5px soft, and resolves over 500ms. The two halves are separate
keyframes rather than one run in reverse, because receding and arriving are
not the same move backwards: both pages get *smaller*, toward the new page's
own size, so the pair reads as one surface being replaced from the front.

The chrome is deliberately **not** given a `view-transition-name`, although
the tidy-up is obvious. A named element is a containing block for its fixed
positioned descendants, the phone menu's panel is `position: fixed` inside the
header, and that panel was last seen collapsed to nothing because
`backdrop-filter` had done exactly this to it. It also buys nothing: once the
page is named, root holds only chrome, every page's chrome is identical, and a
crossfade between two identical images is invisible.

### The scroll-progress bar is gone

`.mk-progress` — the accent line along the header's bottom rule, filling as
the page was read — is deleted, by request. The information it carried is the
scrollbar's, which is why it was `aria-hidden` and not a `progressbar` in the
first place.

## The header's menus are one card (5 Nov 2026)

Asked for, from a reference recording of the Littlebird nav: a mega menu with
a tinted intro rail down one side, link rows beside it, and a panel that
resizes between menus instead of being swapped for another one.

**What was there.** Each menu was its own full-container white slab, 1060px
wide whatever it held, appearing and disappearing. Open Solutions, close it,
open Platform, and the page had shown two unrelated rectangles with nothing to
say they were the same piece of furniture. The Resources list — four links —
got the same 1060px treatment's shadow token and hung under its own trigger
with no relationship to the other two.

**One frame, three sets of contents.** `.mk-nav-frame` is a single decorative
element that draws the card, the radius and the lift; the panels paint no
background at all. `Nav.tsx` measures whichever panel is open and hands the
frame its width, height and offset in pixels, so moving between menus resizes
and slides the card already on screen. The contents cross-fade over it with
`transition-behavior: allow-discrete`, which is what lets a panel being closed
stay painted while it goes to zero rather than vanishing the instant `hidden`
lands on it.

There is measurement here because there is no CSS alternative:
`inline-size: max-content` has no value to interpolate from. The arithmetic is
in one function with one job, and `--mk-nav-x` is a physical `translate` in a
file that is otherwise logical throughout — it is the sum of two numbers that
`getBoundingClientRect` only reports in physical pixels, and resolving the
direction once where the numbers are read is more honest than carrying two
sign conventions through the rest of it.

**The frame is a picture of the panel, never the panel.** `aria-hidden`,
`pointer-events: none`, no content, no `z-index` — it is first in the DOM and
the panels paint over it by document order. If the measurement never ran the
menus would still work; they would be unlit. That is the property that made it
safe to put a measured, animated element in the header at all.

**A panel starts under its own trigger and is then pulled back** until it
clears the page gutter. Both mega panels are wide enough to end up clamped
against the same edge, so they sit in the same place and the frame travels
only the difference in their widths — while the Resources list, which needs no
shift, stays under Resources instead of being dragged across the header.

**The rail** carries an approved key line (MARKYOS-DESIGN-SYSTEM.md §11) used
verbatim and the section's overview link, and nothing written for it. The two
lines were not chosen for fit alone: "Build the brand. Hand it over. Keep it
alive." names the three columns under it in order, and "Your brand deserves a
better home than a PDF." is the argument the nine modules make. It is
`--surface-3` and not `--surface-2` because a tint on a white card starts with
2% less to work with than the same token has against the page's ground; at
`--surface-2` it read as a rendering artefact. Below 80rem the rail is gone —
three columns and a rail want about 1080px and the container gives 984 at the
1024px where this nav first appears, which takes the columns to 181px.

**A rule under each column head**, because a heading and a row title are both
15px/500 in the page's own ink — a column head quieter than its rows stops
being a heading — so the separation cannot be weight or colour. Without it the
first solution in each column read as a fourth audience.

**Platform's overview link moved from `strip` to the rail**, and is rendered
in the phone menu too. It was the one link in that strip that opened the whole
menu rather than a side door, and `MobileNav` renders `strip` — without the
addition, «المنصة» on a phone would have listed nine modules and no way to
reach `/platform`. Its strip now leads with the claim, which is how position
0 has always been styled.

**What was kept.** The disclosure pattern, `aria-controls` pointing at the
panel itself, `hidden` rather than conditional rendering, Escape returning
focus to the trigger, the hover and close delays, and the pointer journey
`scripts/check-nav.mjs` walks. The frame's geometry is the only thing that
animates, and all of it is off under `prefers-reduced-motion`.

### Three things taken back out (5 Nov 2026)

Marked up on a screenshot and cut the same day, all three from the desktop
mega panel: **the line under each column heading**, **the arrow on every
overview link**, and **the strip of three links along the floor**.

They have one thing in common, which is why they went together. None of them
was a destination. The column line restated the heading, the arrow decorated a
link that was already blue and already underlined on hover, and the strip was
a second, quieter menu along the bottom of the first one. What is left is the
answer to the two questions a menu is asked: where can I go, and what will I
find there.

It is also the shape the reference recording had all along — rail, headings,
rows, nothing else — which the first pass had kept our own furniture on top of.

The panel lost about 90px of height in Arabic and 94 in English, and the rule
under each column head now does the whole job of separating a heading from
rows set in the same size, weight and ink.

**What was kept, and where.** The strip's three links are still in `content/`
and still rendered by the phone menu — a surface that was not part of this
review, and the only place «كيف يعمل التسليم؟» and «محتار؟ ساعدني أختار» now
appear in the chrome. `NavGroup.line` is rendered nowhere; it is nine strings
of approved, transcreated copy for the three audiences, kept against the
audience pages wanting it and flagged in `content/types.ts` to be deleted if
they do not.

### Platform's columns lost their heads, Solutions kept theirs (5 Nov 2026)

«اصنع / سلّم / أدِر» are gone from the Platform panel. Solutions still says
«للاستوديوهات والوكالات / للمصممين المستقلين / للشركات», and the asymmetry is
deliberate.

A stage is not a destination. The three Platform groups name the order the
work happens in; they point at no page — which is why `NavGroup.more` is
optional in the first place — and they ask the visitor to choose nothing. The
nine modules read perfectly well as three columns of modules.

An audience is a destination, and in the Solutions menu the heading is doing
load-bearing work: `/solutions/guideline-sites` and
`/solutions/client-handoff` are each listed **twice**, under different names,
because a studio and a freelancer buy the same page for different reasons.
Take the headings away and those two pairs read as duplicated links rather
than as the same answer given to two different people.

**The distinction lives in the content, not the component**, as
`NavItemCopy.grouping: "audience" | "stage"`. A flag in `Nav.tsx` would have
to be read as "Platform is special" by everyone who met it afterwards; naming
what the groups *are* says why the panel treats them differently, and the
phone menu can go on using `heading` for its accordion summaries either way —
a stage is a reasonable thing to fold nine modules behind on a screen that
cannot show them at once.

The rule under a column head is scoped to `[data-labelled="true"]` with it. An
unattached hairline across the top of a column with no heading above it is a
lid, not a division.

Platform's panel is now 423px tall in Arabic and 489 in English, from 585 and
629 before the three cuts started.

## The hero is the first frame of the product (5 Nov 2026)

Rebuilt to copy deck v3 §3, which adapts the reference recording the brief
analysed. The words sit on top, the demo brand's published hub peeks up from
the bottom edge, and two cards float beside the two headline lines: the
studio's logo file beside «الاستوديو يبنيها،», the company's scored post
beside «والشركة تحييها.» Before reading the sub, a visitor has seen files go
in and a brand come out.

**The copy is v3 §2.1.** The headline is the slogan from §0.2, two lines, and
line 2 takes the blue gradient the site already gives a headline's second
clause. The sub, microcopy and the two doors come with it. The hero's
"replaces" strip is gone — v3 carries that argument in §2.6 as a table, and
saying it twice on one page was always the weaker version.

**One stage, one origin.** §3.3: the cards and the window are siblings in one
container and the cards are positioned from its *centre*, so "resting beside
the headline" is an offset. Dropping a card into the window later in the
scroll story is then a tween of two numbers toward zero rather than a
hand-off between coordinate systems that needs re-measuring every time the
copy rewraps.

**Two things the measurement pass caught, both invisible in English.**
`inset-inline-start: 50%` is `left` in English and `right` in Arabic, so the
anchored edge swaps while `translate` stays physical — a fixed `- 50%`
half-width correction was right in one language and wrong by a whole card
width in the other, which put the studio's file on top of the first headline
line on the Arabic page only. And fixed pixel offsets that cleared the
headline at 1440 ran through it at 1100 and off the screen at 900, because
the headline is `clamp(38px, 6vw, 76px)` and its width is a function of the
window. Both offsets now track the viewport, floored on the English
headline, which is the wider of the two.

**Where this departs from the deck, and why.**

§3.2 specifies a near-black canvas and a translucent dark window, copied from
the reference. The site has shipped light since 3 November and `theme.css`
keeps exactly one dark object on it, so the page has something to close on. A
dark hero would make two and the page would open and close on the same note.
The composition is the deck's; the ground is the site's.

§3.4 names Framer Motion, because the reference uses it. The entrance is
built from this stylesheet's own load vocabulary instead, for the reason
already written above `@keyframes mk-rise`: the hidden state has to live in
the stylesheet, and a page whose first screen is invisible until a script
runs is a page that fails to a blank. The five steps are the deck's, timed
off `.mk-seq-load`'s existing 80ms stagger — cards at 520ms, tags at 900ms,
window at 1040ms — and all of it is inside the same
`@supports (animation-timeline: view())` as the rest, so a browser without it
gets the settled composition. Which is also what §3.5 asks for under reduced
motion, and what `@media print` now gets too.

**The window is `components/mock/BrandHub.tsx`**, which has been in the repo
unrendered since it was written; its own first line calls it "the product
shot in the hero". That is what lets §3.5's "real product only, no invented
UI" hold without a screenshot pipeline — it is markup, so it is text, in the
right language, and it cannot go quietly out of date the way a PNG does.

**The name tags are labels, not cursors.** §3.5 is explicit that simultaneous
editing must not be mimed until the real-time board ships in spring 2027.
They say who did the thing. Their two warm colours are solved for white at
13px — `#9A6000` is 4.6:1 and `#A33E00` is 5.5:1 — because a tag has to read
as somebody else's mark on the work, and the page's one blue would read as
part of the interface.

**Still open:** the deck gives no body text for the post card, so there is
none; the score and its verdict are the card. «استوديو نقش» carries the
deck's own [CONFIRM] — check it is not a real studio in the Gulf before
launch.

### The homepage is ten sections (5 Nov 2026)

Copy deck v3 §2 opens "Ten sections. Everything else lives on the solutions
and feature pages." The homepage rendered fifteen. Five left it — the proof
strip, the platform grid, the handoff loop, what's coming next and the
founder's note — and the FAQ stopped being a section of its own.

Their components and their copy are still in the repo and still compile.
Nothing imports them. That is the known cost of taking the cut before Parts
B to E exist to receive them, and it was taken deliberately: the alternative
was a homepage that disagreed with the deck for as long as the rest of the
site took to build.

The order is now the deck's, and every section headline is v3's. The English
side needed more than a translation in two places: §2.4's «هنا مكانها، وفي
كل مكانٍ بيانها» rhymes, and the English carries the same idea as a double
meaning instead — "Right here. Right everywhere." — which is the deck's own
line, not a paraphrase of the Arabic. Same for §2.8.

**§2.2, the scroll story, is not built.** It wants seven views of the real
product and the repo has five mocks. §3.5's first rule is "real product only,
no invented UI", so the section waits for the other two rather than shipping
a drawing of them. It is the one gap between this page and the deck's ten.

### The hero's two text bugs, and the scroll story's first move (5 Nov 2026)

**Arabic headlines were losing their descenders, everywhere.**
`.mk-accent-clause` paints the brand gradient through
`background-clip: text` with `color: transparent`, so the glyphs paint
nothing themselves — what you see is the element's background showing
through a text-shaped clip. An inline box's background painting area is its
line box, so ink reaching past the font's ascent or descent is outside the
thing being clipped and does not exist. In Inter that never showed. In
Thmanya Sans at 76px it cut the tails off و, ش and ي, on the hero and on
every other Arabic headline carrying a clause — which is most of them. It
read exactly like a font that had failed to load half its glyphs.

`padding-block: 0.22em` on the clause extends the background painting area
without touching the line box: the descenders come back and nothing moves.

**And the hero's leading was Latin-only.** `Display` sets `line-height`
inline at 1.22, which is right for Inter and far too tight for Thmanya Sans —
and because it is an inline style, the `[dir="rtl"] :where(h1, h2, h3)` rule
that exists to correct exactly this could never win. The value itself now
knows the direction: `--mk-lh-hero`, 1.22 in English and 1.38 in Arabic.

**The cards drop into the window as you scroll.** §3.3's point, arriving.
The cards rest at an offset from the window's centre, so dropping one in is
a tween of that offset toward zero — and the offset is the only thing that
says where a card is, so there is no second position to keep in step. That
required the scene: a container holding nothing but the window, so its
centre *is* the window's centre instead of approximately being it.

`scroll(root block)` and not `view()`, which is the first time this
stylesheet has needed the distinction. `view()` measures an element's own
crossing, which is right for the fourteen sections below the fold and wrong
for the one above it: the hero is already on screen at load, so its `cover`
range starts near 44% progress before anybody has scrolled and the drop
would be half-finished on arrival. `scroll()` measures the page's own scroll
from zero, which is the axis the reader is moving.

It is also the first keyframe here with a `to` and `forwards` rather than a
`from` and `backwards`. Everything else is an arrival and ends where the
layout put it; this one ends somewhere else and stays, so the resting state
is the element's own `translate` and the keyframe names only the
destination.

The hub pans inside its frame on the same timeline, which is what makes the
window a window rather than a picture. Both are off under reduced motion, on
paper, and below 810px — where the cards leave the floating layout for
normal flow and have no centre to fall toward.


## The hero became the product's sequence (6 Nov 2026)

The two floating cards — a file the studio uploaded, a scored post the
company wrote — are gone. They restated the headline rather than showing
anything the product does, and a card that says what the sentence above it
already says is decoration.

What replaced them is the product's own sequence, in three acts on one
scroll axis, built from `Markyos Screens/Discovery (Brand Hub).png` and
`Markyos Screens/Guidelines Builder.png`:

1. The brand's elements arrive as names — الشعار، الألوان، الخطوط، النبرة،
   لوحة الإلهام، الاستراتيجية، الأيقونات — in two columns down the sides of
   the headline, four on the start flank and three on the end. They are the
   hub's own sidebar vocabulary, deliberately: the words a visitor watches
   gather into the window are the words they find inside it.
2. They travel the whole height of the hero and gather into the hub, which
   is the brand's centre.
3. The hub goes, and the window hands over to the guidelines builder.
4. The builder deals out the three templates a guideline site can be built
   from — Vault, Docs, Studio — as a descending cascade, the last one
   hanging below the window's bottom edge.
5. The covers are pulled down past the window into the run-out below it and
   fade out.

The motion is adapted from the gallery reference the brief supplied: a
scatter that collapses to a point and re-deals as a cascade. What it is a
scatter *of* is the departure — the reference uses photographs, and this
site has no imagery by design, so it scatters the names and deals the
covers the product actually ships.

**The acts do not overlap.** Each finishes before the next begins, because a
reader cannot be asked to watch two of them at once and because every pair
of them shares the same 1000x420 frame. The budget is set by where that
frame is, not by taste: it sits at page 853 in a 900px viewport, so it is
well placed between about 450 and 880 of scroll and has left the top of the
screen by 1100. The first pass at this dealt the covers at 950, to a window
that was already halfway off the top.

    0 –  430   the names travel down into the hub
  430 –  530   the hub goes
  530 –  640   the builder arrives
  640 –  880   it deals the three covers out
  880 – 1090   the covers are pulled down past it and fade

The sink moves a cover 340px against 210px of scroll, so it gains on the
page rather than merely keeping up with it, and on screen it travels
downward into the hero's block-end run-out. Its fade finishes at 72% of the
range so the hero's clip never cuts a cover in half at full opacity, which
reads as a crop and not as a departure. That sink is a second animation on
the same element, with a range that does not overlap the deal's: they can
share the element because they touch different properties — the deal owns
`translate`, which is where a cover rests, and the sink owns `transform`,
which composes after it. Writing the sink as `translate` too would mean
restating the resting offset inside a keyframe.

The frame's own bottom edge now fades into the ground. It used to run off
the bottom of the section, so the clip was the fold; with 200px of run-out
under it a hard-cropped card floating in white read as a mistake.

**One stage, one origin.** Every chip and every cover is an offset from
`.mk-hero-scene`'s centre, and the scene holds nothing in its flow but the
window — so its centre *is* the window's centre, and "gather into the hub"
and "deal out of the builder" are tweens toward and away from zero with no
second coordinate system to keep in step. Deleting that one
`position: relative` during an edit re-anchored everything to
`.mk-hero-stage`, whose centre is 300px higher because the headline is in
it, and the arc landed across the subheadline.

**Three things that cost a debugging pass, all worth writing down.**

The `animation` shorthand resets `animation-timeline` to `auto`. A shared
`animation-timeline: scroll(root block)` rule declared *above* the rules
that use it therefore lasts until the next line: every animation fell back
to a 0s clock animation and, being `forwards`, painted its own last keyframe
at scroll 0. The whole story was over before the page opened — chips gone,
covers dealt, builder up — and nothing in the computed styles mentioned a
timeline. `animation-timeline` goes after the shorthand, in every rule.

A property named only in `from` interpolates back to the element's own value
by the end of the range. The covers rest at `opacity: 0` so that a browser
with no scroll timelines is served the opening frame; `mk-hero-deal`
therefore has to name `opacity: 1` in its last keyframe, or the covers deal
out and then vanish.

`calc(520ms + var(--mk-in) * 1.4)` is not a time when `--mk-in` is a length.
The declaration is invalid and every chip arrives at once. The entrance
stagger and the gather stagger now come from one unitless `--mk-s`.

**The hand-off is not a cross-fade.** Both panes are dense product UI, and
fifty per cent of each on top of the other reads as a rendering fault rather
than as one screen becoming another. The hub is gone by 330px of scroll and
the builder starts at 310.

**What a reader who asked for no motion gets.** Every animation here is
`forwards`, so the declared values are the opening frame: chips out, hub up,
builder and covers at `opacity: 0`. Without scroll timelines, and under
`prefers-reduced-motion`, that is the whole hero — complete and honest,
rather than three acts stacked on each other. Below 810px the stage becomes
a column: the chips wrap into a row above the window and the cascade is cut,
because three 168px covers cannot be a cascade across a 342px measure and
shrinking them would render the cover type at a size it was not designed at.
The caption survives there as a caption, which is the part of the deck that
was a claim rather than a picture.

## Three removals that came with it (6 Nov 2026)

**The announcement bar.** `AnnouncementBar.tsx` is deleted and the layout no
longer renders it. `copy.announcement`, its type and its CMS global stay —
they are editable content, and deleting a Payload global to remove a strip
of chrome is a migration, not a design change. `MobileNav` measures the
header's real bottom edge rather than naming a number, so the panel still
opens in the right place with the bar gone.

**Every arrow.** `Arrow` is gone from `Icon.tsx`, `.mk-arrow` from
`globals.css`, the `arrow` prop from `Button`, the glyph from `Cta`, and
`ArrowLink` is now `TextLink`. A label that says where it goes does not need
a picture saying "forward", and on an RTL page the flip was one more thing
that could be wrong — `[dir="rtl"] .mk-arrow` matched on *any* RTL ancestor,
which is why there was a second rule undoing it inside the LTR product mocks
and a third undoing the hover nudge. Three rules to make one decoration
point the right way. The one arrow that was carrying meaning, "English term
becomes Arabic term" in the voice mock, is a 16px rule now; it reads as
"becomes" without claiming a direction the Arabic edition reverses.

**A lot of white.** `Band` went from a 120px top end to 168px and
`.mk-section` from 100px to 136px, and the heading-to-content gap inside
each homepage section went up about 40% — 44 to 64, 48 to 68, 32 to 48. The
page had grown denser than the design file it traces and its sections had
stopped reading as separate things. The floors moved with the ceilings,
because the complaint was about the narrow widths too.


## The resources section was rebuilt (6 Nov 2026)

Against three references the brief supplied — a magazine index, an article
page and a support centre — adapted to this ground.

**Three indexes now, not one.** `ArticleIndex` used to render one shape for
all three collections, on the argument that they are the same two pages with
different words. That was right while all three were lists of titles and
wrong once they had content in them: a reader arrives at each with a
different question.

- `/blog` — the newest piece at full height with the four after it listed
  beside it, then the rest as a card grid. Answers "what's new?" and "what
  else is there?" in that order.
- `/guides` — a shelf. Two columns, every item equal, nothing featured.
- `/help` — search first, then categories, then everything.

What they still share, and what keeps this one file rather than three, is the
card, the cover, the meta line, the reading-time plural and the whole article
template. The shapes differ; the vocabulary does not.

**Covers, with no photographs.** All three references are photographic and
this site has no imagery: `heroImage` is optional in the content model and
nothing published sets one. So a cover is typeset rather than shot — the
piece's own category, large, on one of four grounds. Two of the four are dark
and two are paper, which is what keeps an index of twelve from reading as one
long blue rectangle; all four are mixed from the site's single blue and its
ink, so the variety costs no new hue. `Cover` renders a real picture the day
a piece has one, and nothing else changes.

The ground is hashed from the *category*, not the slug, so every piece in a
category shares one and the index reads as sections of a magazine rather than
a bag of colours. The first post published through the CMS turned out to have
no category at all and came out as an empty gradient with a mark in the
corner — so a cover falls back to the collection's own name, which is always
true and always present.

**The article.** Three labelled facts under hairlines across the top, the
title, the standfirst, the byline, the cover full width, then the body on a
62ch measure with the share rail beside it. Each part of the meta row answers
a question a reader asks before committing to read, and they are labelled
rather than run together as "Strategy · 2 Oct · 6 min" — the label is what
makes the date a *publication* date rather than a number on the page.

The body grid has three columns, not two: the rail, the measure, and an empty
column the same width as the rail. With two, the pair would be centred and
the prose would sit off-centre by the width of the rail — the kind of
wrongness nobody can name and everybody sees.

The share rail is three plain links and no JavaScript, each a share intent
the platform answers with its own composer. WhatsApp is the third rather than
Facebook because this site's first audience is in the Gulf, where it is where
a link actually gets passed on.

**The help centre's search is the one client component in this tree.** The
whole collection is already on the page — fourteen titles and their excerpts
that the server rendered anyway — so filtering them is a string comparison,
not a query, and a search box that waits for the network is slower than
scrolling past the thing you were looking for. It degrades honestly: without
JavaScript the field is inert and every article is still listed.

Matching folds both sides first. Arabic is written with and without its short
vowels and with four shapes of alif, and someone typing «استبيان» has to find
«الاستبيان» — verified both ways in the browser, two results each. The
category tiles filter in place and toggle off rather than linking to an
anchor, so a reader never has to work out what happened to the page.

**Three things that were nearly shipped wrong.**

A function cannot cross from a server component to a client one; it has to
serialise. The pluralised "N results" started as a callback and is now an
array indexed by the count, which can only ever run from zero to however many
articles there are.

The help index's second heading said «الأكثر قراءة» — "most read". Nothing
here measures reads and the list was all of them, in no particular order. It
says «كل المقالات» now. A label that claims a measurement we do not take is
the one kind of placeholder that survives into production.

`check:bidi` found all eight cover words at once: a *box* centred by the grid
starts 88px in from the start edge, which is indistinguishable from Arabic
laid out left-to-right. A centred *line* inside a full-width block starts at
zero and looks identical.

**Icons on a card grid, and only on a directory.** `CardItem` gained an
optional `icon`, set on /resources and nowhere else. Most card grids here are
prose — a claim and a paragraph — and an icon over a claim is decoration. It
earns its place on a grid that is a directory: six destinations are scanned
faster as six shapes. It is the same tile as the help centre's category tile,
deliberately, so crossing from one page to the other does not mean learning a
second shape for "a destination".

**Brand marks are a second icon family.** `las` is the solid interface set
and a logo is not in it. §6 already sanctions `lab` for integration marks, so
`Icon` now picks the family from a named set rather than hard-coding `las` —
listed by name, so adding a solid glyph can never silently pick the wrong
family.


## Four things that made the page feel static, and the dashes (6 Nov 2026)

**Every disclosure opens and closes now.** The FAQ was the clearest place the
page read as dead: a question either had its answer under it or did not, with
no moment in between, so nothing told the reader their click had landed. It is
still `<details>` — an FAQ built from `useState` is invisible to the search
engine it exists to feed, is not findable with the browser's own find, and
does not open before a script loads. `::details-content` is the part of the
platform that makes the native element animatable, and
`interpolate-size: allow-keywords` is what lets a height of `auto` be a
transition endpoint. `content-visibility` has to transition too, with
`allow-discrete`, or the answer vanishes on the first frame and leaves an
empty box to animate.

Measured opening and closing in the browser: 68 → 90 → 132 → 148 → 151px, and
back down. Guarded on `prefers-reduced-motion` and on `@supports`, so a
browser without it gets the instant open it has today, which is still a
working disclosure. It applies to every `<details>` on the site: the homepage
FAQ, the FAQ on the data-driven pages, and the two accordions in the phone
menu.

**The bilingual section's swap is a mirror, not a dissolve.** It always had a
real control — a segmented switch with a sliding knob — and it was being read
as decoration, for two reasons. Its label lived in `aria-label` where nobody
could see it; it is rendered above the switch now, and the words were already
written. And the two panels cross-faded *in place*, which is the worst
possible way to show that a layout turns around: the section's whole claim is
that the thing flips direction, and dissolving one into the other showed
nothing flipping. Each panel now leaves toward its own reading edge and
arrives from it. 22px, which is small enough to stay a hand-off and large
enough to be a direction. Physical pixels and not a logical property,
deliberately — each panel carries its own `dir`, and which way it goes is the
point.

**No button moves any more.** `.mk-btn` rose 2px toward the pointer and
dropped back on `:active`, so the press was the motion. That is gone, which
puts this file back on §1 line 9 of MARKYOS-DESIGN-SYSTEM.md: a hover scrim
and nothing else, no lift, no nudge, no choreography. The colour still
changes, because a state change is information — only the movement was
decoration, and a control that moves under the finger reads as unsteady
rather than as responsive. Verified at rest, on hover and held down: the
computed `translate` is `none` in all three, and the only transitioned
properties are `background-color` and `color`.

**The close earns its place.** It was "Built. Shared. Alive." — three passive
verbs with no subject and nobody addressed, in the last thing a visitor reads
before they decide. It is the approved line from §11 verbatim now, «ابنِ
الهوية. سلّمها. وأبقِها حيّة.» / "Build the brand. Hand it over. Keep it
alive.": the brand's own sentence, an instruction rather than a description,
and the same line the Solutions menu opens with in the header — so the page
closes on what it opened with. The line under it no longer repeats "start
free", which is already said twice below it in the microcopy and on the two
buttons; it names the enemy the whole page is built against, and it is
neutral between the two doors, because the decision immediately after it is
which door.

**No dashes and no arrows in the copy.** Fifty-one strings, in four shapes:

- An em dash as a pause in prose, in twelve places across both languages. Each
  one became the punctuation the sentence actually wanted: a comma, a colon or
  a full stop. Three of them read better for it, because an em dash is what
  you reach for when you have not decided whether the clause is an aside or a
  second sentence.
- An em dash as a separator in a label, in the six moodboard directions:
  "Direction A — Heritage" is "Direction A: Heritage".
- An em dash as "not included" in twenty-eight comparison-table cells, against
  «نعم» in every other cell of the same column. They say «لا» now, which is
  the answer to the question the column asks and can be read aloud.
- One arrow, in a pricing headline: «الاستوديو يبني ← العميل يملك ← الاستوديو
  يكسب» is three clauses joined by «و».

The 28px rule in the closing panel went with them. It was drawn rather than
typed precisely so it could not be read aloud or stranded at a wrap, which
was the right call against an em dash in the string and is not a reason to
keep a dash on the page when dashes are off it. The gap does the separating,
which is what the gap was already for.

## Motion in every section, and a check that it finishes (6 Nov 2026)

Asked for directly: animation in every section, and the other pages made more
engaging. The page already had four passes of reveals on it, so the first job
was to find out what was actually still static rather than add a fifth. A
walk of every section on every page, counting the motion classes inside each,
answered it in one table — and what it showed was not missing reveals. Almost
every section had one. It was that the reveals were all the *same* reveal,
that six of the largest objects on the site arrived as single slabs, and that
outside the navigation **nothing on this site answered the pointer at all**.

**The comparison tables fill in row by row.** These are the largest single
objects here — the homepage's is 1858px of section, /pricing's is 1449px —
and each arrived as one block: eleven rows of a close argument all reaching
full opacity together, in a section tall enough that the reveal was over
before the reader had finished the second row. Row by row is also the honest
reading of what a comparison table is. Each row is one claim and they are
taken in order.

Two things had to be true first, and both were interesting.

A `<tr>` cannot be translated. The row is laid out by the table's own
algorithm rather than by its own box, so `mk-rise` on a row fades correctly
and never moves, which reads as a flicker. `@keyframes mk-fade` is the one
keyframe in this stylesheet that is a restriction rather than a choice.

And `.mk-seq-rows` has no stagger offsets, unlike every other container in
the motion block. The `nth-child` shifts exist because the children of one
grid *row* share a scroll progress — they cross the viewport edge together,
so without a shift they arrive as a slab. Table rows never share a progress:
they are stacked, so each one's range begins at its own position and the
cascade is already there. Offsets on top would *un*-stagger it, by pushing
every third row later than the row beneath it.

**The tables were scroll containers, and that is why the rows did nothing.**
The first build of this was correct and completely inert: the eleven rows sat
at a fixed opacity each, 0.81, 0.60, 0.31, and never changed with the scroll.
The shell sets `overflow-x: auto` so a 860px table can be swiped on a phone,
and CSS then computes the *other* axis from `visible` to `auto`, because
`visible` is not a possible computed value beside a scrolling axis. So the
shell became a scroll container on the block axis too, and every
`animation-timeline: view()` inside it resolved against a box that never
scrolls and sat at 100% progress for ever.

`overflow-y: clip` is the fix, in both shells — the stylesheet's
`.mk-table-shell` and ReplaceStack's inline one. `clip` clips without being
scrollable and is a legal pair beside `auto`, so the table still swipes
sideways, nothing scrolls vertically, and the rows' timeline resolves against
the document. This is the third time this trap has been paid for here: it is
why `.mk-card` is `clip` and not `hidden`, and why the ecosystem section is.

**Cards arrive with depth, and the ones that lead somewhere answer the
pointer.** Every card grid on the site moved from `.mk-seq` to `.mk-seq-pop`,
which is the same range and a different texture — the card comes forward as
well as up. `.mk-pop-soft` goes on the dense sub-page grids, and it is worth
saying why that works from the container: it sets a custom property, and
custom properties inherit, so one class on a grid tunes every card in it.

The pointer half is the larger change, and it has a rule. `.mk-reach` existed
in this stylesheet, with a comment explaining that a card which is a link
rises toward the pointer — and a census found it applied in exactly one
place, the blog index. So: a surface that leads somewhere now answers the
pointer, and a surface that does not, does not. The audience cards, the plan
cards and the sub-page cards that carry a CTA rise 3px and take a drop
shadow; the "what we do not replace" cards, the seam cards and the three
decay figures get no hover at all, because a card that rises under the cursor
and then does nothing when you press it is a promise the page does not keep.
Buttons still do not move, which is the 6 Nov rule and unaffected: the lift
is on the card, and the button inside it stays where it is.

**The three decay illustrations drift.** They were the last pictures on the
homepage that never moved, and they are the three the page can least afford
to have still: an old logo on a slide somebody is still presenting, the same
line drifting apart in two languages, the same question asked three times. A
static drawing of drift is a drawing of something that has already finished
happening. They qualify under the constraint `@keyframes mk-drift` sets —
nobody reads them, they are figures with captions underneath, and each sits
in a clipped frame whose dotted ground stays put while the art moves inside
it. The third goes the other way, so three cards in a row are not one object
breathing.

**The default section head now cascades.** `SectionHead`'s `split` layout —
the page's default, and what gives it its two-column feel — had the heading
column sliding in from one edge and the explaining paragraphs arriving as one
block from the other. The paragraph column is `.mk-seq` now, so the heading
slides and the paragraphs land one after another inside it. One line, and it
reaches every section of every data-driven page.

**The FAQ answers the pointer before it is pressed.** The disclosure animates
and the plus turns, and both of those are answers to a *click* — so a reader
running an eye down nine questions still had nothing telling them the rows
were controls. The row now takes a trace of the brand's blue as the pointer
crosses it, and the plus goes blue with it. Ground and ink, no movement: a
card may rise because it is an object, and a row of text is not one.

**Two dashes left in a render path.** The data-driven tables printed an
`aria-hidden` em dash in any empty cell, which is why the 6 Nov sweep of the
content files did not find them — they were in `blocks.tsx`, not in a string.
The accessible rendering was already nothing, so the fix is to make the
visual one agree: an empty cell is empty.

### `npm run check:motion`

New, and it is the check this change needed rather than a tidy-up. It asserts
that every revealed element reaches **its own** settled state, which is not
the same as asserting opacity 1: the help centre's hero glyph rests at 0.12
and centres itself with `translate: 0 -50%`, and a reveal that returns it
there is correct. So the check disables every animation, records what each
element's own styles produce, puts them back, walks the page, and compares.
The assertion is "the animation left no trace", which is the real contract —
`backwards` fills only before the range, so past it the element must be what
it would be with no motion in the stylesheet at all.

It covers three failures that look identical from the outside and have
nothing else looking for them. A reveal too near the foot of the document
runs out of range and stops part-faded, which is what `.mk-rise-end` exists
for and what the footer's closing bar did on every page. An above-the-fold
element given a scroll-driven reveal never starts. And an animation on
`translate` applied to something that *positions* itself with `translate`
lands it somewhere other than where the layout put it.

It found the third one on its first run: the help centre's hero glyph is a
direct child of a `.mk-seq-load`, so the cascade was travelling it from 20px
below the line up to its own `-50%` centring offset — half its own height
rather than 20px. Same trap as the centred light pools, which `--mk-drift-x`
exists to solve; here the element is decorative and sits at 0.12 opacity, so
it takes `.mk-still` and stays put. 1423 revealed elements across 70 pages
now pass.

Writing it also caught the check itself lying twice, both worth recording.
Removing the override that disables the animations *restarts* every
clock-driven one from zero, so the first version read `.mk-load` as stranded
mid-reveal on every page that has a hero. Sleeping past it was not enough
either: a fixed 1400ms wait passed alone and failed with `npm run check`
compiling in the next terminal, which is the kind of flake that gets a check
deleted rather than fixed. It asks the animations instead — poll
`document.getAnimations()` until everything on the *document* timeline is
finished, skipping the scroll-driven ones, which are never finished by
definition, and the infinite ones, which would never let the wait end. And
three abandoned `next start`
servers from earlier in the day were still answering on 3212, 3213 and 3215 —
`check:bidi` ran green against a stale build and was believed for about four
minutes. Every live check here defaults to `localhost:3210`; when more than
one build can answer, the only safe move is to fetch a class that only exists
in the new code before trusting a single result.

## The soon chips lost their dates (7 Nov 2026)

Asked for directly. The three chips read `Coming spring 2027`, `Coming 2027`
and `Arriving February 2027`; they now read `Coming soon` and `Arriving soon`,
and «قريباً» and «يصل قريباً» on `/ar`.

The reason it is the right change and not just a shorter one: a chip that
names a quarter is a promise with a deadline attached, and the one thing
certain about a five-release roadmap is that some of it moves. When it moves,
every chip on the site is wrong on the same day — forty-odd of them, across
the homepage, the platform grid, the comparison tables, the solution pages and
the pricing matrix — and the honesty layer `lib/status.ts` exists to be is
doing the exact opposite of its job. "Coming soon" cannot go stale.

The dates were never only in the chip, which is why nothing is lost. Each
feature's `shipsIn` still carries its release (`v3.0 (Feb to May 2027)`), the
homepage's roadmap section still names its three phases in order with the
first one lit, and the roadmap page still dates them. Somebody who wants to
know *when* still finds out, on the page built to tell them rather than in a
22px pill beside a feature name.

Two things followed from it in code. `ChipKey` was three keys named after
dates — a name that would have been a lie about its own value the moment the
strings changed — so it is now `comingSoon | arrivingSoon`. And with both
"coming" chips collapsed into one, `chip:` on each of the twenty-three coming
features held the same value in every row, so the field is gone from
`Feature`; `chipFor` returns the key from the status. Nothing outside
`lib/status.ts` read that field, and `Chip.tsx`, the sections and the content
files are untouched apart from the two dictionaries.

## Six fixes across the sub-pages (7 Nov 2026)

All six asked for directly, three of them with a screenshot.

### The date sat on the wrong edge of its own cell

`.mk-article-meta` prints three labelled facts across the top of every
article, and the date's value was indented from the start edge while the
category and the reading time beside it were flush. Measured: the cell ran
911..1170 and the `<time>` inside it ran 911..998 — hard against the *end*.

It is the isolate trap, in the one shape nothing had looked for. `time` is in
the plaintext list in `globals.css`, so a `<dd>` whose only child is a
`<time>` scans for a strong character, finds a single object replacement
character, and UAX9 P3 falls back to left-to-right; `text-align: start` then
resolves to the left. The Arabic inside still reads correctly, which is what
makes it look like a margin somebody got wrong.

The fix is `.mk-bidi` on the `<time>` — which looks backwards and is the
documented cure: an inline `.mk-bidi` inside a block that is already
plaintext *stops* isolating, and the resolution moves up to the `<dd>` that
owns the alignment. The time now runs 1084..1170, flush with its label.

**`check:bidi` now reads one article per collection out of the build**, which
is why this shipped in the first place: the check's page list was eight pages
kept by hand, the article template was never on it, and so the defect was on
all thirty-two articles from the day that meta row was written. Same
manifest-derived list as check-pages and check-motion.

### The help centre's search suggests as it is typed

Typing already filtered, but the list it filters is 900px down the page and
below fourteen category tiles — so on a laptop the field appeared to do
nothing and the reader scrolled down to find out whether it had worked.

The six best matches now appear under the field, as the ARIA combobox
pattern: the input keeps focus and carries `aria-activedescendant`, arrow
keys move the highlight, Enter follows it, the first Escape closes the panel
and a second clears the field. The list below still filters, because the
panel holds six and a broad query matches more.

Three things were not obvious while building it.

Each suggestion is a real `<a>` carrying `role="option"`, not a div the
keyboard handler navigates for: middle-click, cmd-click and "copy link
address" are worth more here than role purity, and this is the one place on
the site a role overrides an element's own.

`.mk-help-hero` had `overflow: clip` to keep its 230px question-mark
watermark inside the card's radius, and the field sits 24px off the bottom of
that box — so the first build of the panel rendered as a 24px sliver. The
clipping moved to the watermark, which is the only child that needed it.

And `type="search"` clears itself on Escape in Chrome, so the first press did
both halves of the two-step and looked like it had done neither.
`preventDefault` on that branch.

### Monthly or yearly, over the plans

Every paid plan carried a line under its price reading "19 دولاراً شهرياً
بالاشتراك السنوي" — which tells a reader the discount exists and then leaves
them to compare four cards' worth of two figures in their head, which is the
one piece of arithmetic a pricing page is for.

`PlanCard.annual` is `{ price, note }` now rather than prose, every card
renders both amounts, and the switch sets one `data-billing` attribute on the
wrapper around the head and the grid. Two rules in `globals.css` do the rest.
Nothing re-renders, no card leaves the server, both sets of figures are in
the HTML for the crawler, and without JavaScript the page is the monthly
page. The same trade AudienceTabs makes, for the same reason.

The switch appears only when a plan in the block actually has an annual rate:
a control that redraws nothing reads as broken.

### Notes are an object now

Seven blocks carry a `note` — the caveat under a table, a grid or a ladder of
plans — and each rendered as a muted paragraph with its own hand-set margin,
four different margins between them. A reader could not tell a note from the
last line of the thing above it.

`.mk-note` is a tint, a 2px start rule and the `info` glyph. A tint rather
than a card because a note is subordinate: a card here is a white surface
lifted off the ground, and a lifted surface reads as a peer of the cards
beside it, which would put a condition at the same weight as the plan it
qualifies.

Every property is logical, so the rule and the glyph sit on the reading edge
in both editions with no `[dir="rtl"]` override — verified by flipping the
root `dir` in the browser: the rule moves from right to left and the glyph's
16px inset moves with it. The glyph is a *sibling* of the paragraph rather
than inside it, which is also direction: an `inline-flex` box inside a `<p>`
is atomic, and a paragraph whose only content is atomic has no strong
character to resolve itself from. That is the same trap as the date above,
and this one was avoided by construction instead of found later.

The closing CTA's note sits on `.mk-deep`, where the accent tint and the
accent rule both disappear into the ground, so it borrows the panel's two
inverted tokens instead of inventing a third pair.

### The cross-links say what happens

`LINK` in `content/pages/ar/_shared.ts` held the destination's own name, and
the pages using it put the link directly under a card whose heading was that
same name. On /solutions/companies five cards in a row read «بيت واحد
لعلامتك» as the heading and «بيت واحد لعلامتك» again as the link; on
/solutions/studios, four. The only thing the link added was that it was blue.

Seventeen labels are actions now — verb first, two or three words, and
different from any heading they sit under. The names that are genuinely
destinations (the help centre, the legal pages, "من نحن") stay names, because
naming the place is the useful thing there.

The affordance changed with them. A CTA inside a card or a numbered row is
the `outline` variant now, not `link` — which is what that variant's own note
in `Button.tsx` has always said it was for, and what a plain blue line of
text under four lines of body could never be: it read as the last sentence of
the paragraph. No arrows; that rule from 6 Nov stands.

/security was one of four pages that ended on a paragraph with no way
forward, and it closes on an ask now like every other marketing page. The
three legal pages keep their quiet ending — a deep blue panel asking somebody
to sign up at the foot of the privacy policy is the wrong object — but the
two that ended on a bare row of three blue links under nothing have a heading
and a line introducing them.

### Less air between a thing and its sub-text

Tightened one step throughout, wherever the gap was 20px or more: a heading
and its lead (20 → 16), a head and the grid it introduces (56 → 44), a note
and what it qualifies (32 → 28), the article's title, standfirst and byline,
the meta row's label and value, and the comparison tables' rows (16 → 12 of
padding each side, which is most of what the ask was about).

Nothing under 16px moved. The card title and its body were already at 12 and
the step title and its line at 6; tightening those does not reduce air, it
removes the distinction between two levels.

### One thing fixed on the way past

Both segmented switches read their arrow keys physically — `ArrowRight` meant
`i + 1`. The track is mirrored on /ar, so the focus ring went the opposite way
from the key under the finger. `--mk-dir` already existed for the knob's
travel for exactly this reason; both switches do the keyboard half of it now.

## The solution pages show the product (7 Nov 2026)

Asked for directly, with a reference design attached: every solution page
should carry an example of how the thing looks in the system, and the pages
should be laid out the way the reference lays its sections out. The words
stay as they are.

### What was wrong

Twelve pages under /solutions, five to eight thousand pixels each, arguing
for one feature apiece — and not one picture of that feature on any of them.
/solutions/tone-checker was 7,009px of headings, tables and prose about a
screen the reader never saw.

The galling part is that six pictures of the product already existed. They
were built for the homepage, where each feature gets a paragraph, and they
were never used anywhere else — so the page with a paragraph about the tone
checker showed it, and the page with two thousand words about the tone
checker did not.

### The showcase block

A new block kind. Centred bracketed label, centred two-tone heading, the
product in a lifted frame over a pool of the brand's light, a caption.

It is built out of parts this site already had, not imported from the
reference: the label is `Eyebrow`, the two-tone heading is `AccentedTitle`
(the same split-on-first-full-stop the heroes use), the light is `Glow`, the
frame is `.mk-showcase`, and the picture is a component that was already
written. The reference supplied the rhythm; none of the values are its.

Content names a view rather than importing one — `mock: "tone"` — resolved
through `components/mock/registry.tsx`. A content file is data; this is the
same indirection `Icon.tsx` uses for glyphs, for the same reason.

Twelve pages carry one now: the nine feature pages and the three audience
pages.

### Three new product views

Six existed. Three pages had nothing to point at, so:

**`projects`** — the studio board. Four clients, four stages, and a "waiting
on" column, which is the one thing a studio owner actually scans for. The
last row is a handed-over project that is still on the board, waiting on
nobody, and no longer counting against the plan — which is the argument the
next page makes, visible here without a word spent on it.

**`handoff`** — the moment of handover as a receipt. The first draft put an
arrow between the old owner and the new one and that was wrong twice: arrows
came off this site on 6 Nov, and an arrow is the thing that points the wrong
way in Arabic. The transfer is drawn instead — the studio struck through at
the ink's faintest step, the client in a tinted pill at full weight.

**`seats`** — six editors, 248 viewers, one bill. /solutions/company-rollout
makes a claim that sounds like a catch, and the only convincing way to make
it is to show the screen where 248 people cost nothing. A sentence saying so
reads as marketing; a seat count reads as a fact.

All three follow the rules the other six set: markup and not a screenshot,
the product's own direction inside, nothing below 12px, and every word of
interface in `content/mocks.ts` in both editions.

### Centred heads, on these pages only

`PageDoc.heads` — one line per page, twelve pages. These are the longest
pages on the site and every section of them opened the same way, at the same
edge, in the same size, so a reader scrolling could not tell where one
section ended and the next began. A centred head is a full stop.

It moves the heading and nothing else. Prose keeps its two-column split,
which is the site's signature and whose body would have centred with it —
centred body copy at sixty characters gets harder to read with every line —
and the FAQ keeps its own sticky head. The other thirty pages are untouched:
the field defaults to `start`.

### Two things found on the way

**The brackets put a NUL byte in `globals.css`.** `content: "[\\00a0"` is
valid CSS — four hex digits and a terminator — but the four-digit form went
through a tool that read `\\0` as the octal escape it is in most other
languages, and `grep` started calling the stylesheet a binary file. The gap
between the bracket and the label is a margin now, which needs no escape and
is the right instrument anyway: it is spacing, and spacing belongs in the
box model.

**Two buttons in the brief-analysis mock were still English.** "Accept" and
"Dismiss", as string literals in the component — the one thing the note at
the top of `content/mocks.ts` exists to stop. They got away with it while
that mock was a 300px card halfway down the English homepage. Putting it
full width on an Arabic solution page made them the first thing you see.

## /solutions: the table became a control (7 Nov 2026)

Asked for directly, against the same reference: the hub should be more
engaging and more interactive, with an example of each solution the reader
can try rather than read about.

### What the page was

Four blocks. A hero, three audience cards, a nine-row table — name, line,
who it is for — and a callout. The table was the problem, and not because
the content was wrong: those nine rows are exactly the right nine facts.

A table is for comparing things you have already chosen between. A reader
arriving at /solutions has chosen nothing; they are at the top of the funnel
trying to work out which of nine things is theirs, and a table is the one
object that cannot help with that. It also left the hub as the only page in
this set showing nothing of the product, a day after the twelve pages under
it all gained a picture.

### The explorer

Same nine rows, as a control. The name and the audience are a tab; the line
and the real product screen are its panel. Pick one and its screen appears
beside it — the same `components/mock/` views the nine detail pages use, so
the hub now shows what the product looks like before asking anybody to click
into it.

The layout is the reference's shape for this kind of section: a column of
things to choose from on the reading side, and the one you chose, large,
beside it. One markup, two grids — below 64rem the list is two columns of
compact tiles above the stage, because nine stacked rows would be a screen
and a half of scrolling before a phone reader reached the thing the list
controls.

**Tabs, not a radio group**, which is the opposite call from the two switches
on /pricing. Those are each one question with two mutually exclusive answers
— "which of these am I" — and a radio group is what that is. These nine are
not answers about the reader; they are nine things to look at, each with its
own panel. "Tab, 3 of 9" tells a screen-reader user something that "radio
button, 3 of 9" does not.

Every panel is server-rendered and eight are `hidden` — the trade
AudienceTabs makes, for the same two reasons: the hub stays crawlable as
nine solutions rather than one, and with JavaScript off it is the first
solution plus nine working links rather than a control that does nothing.
None of the mock markup reaches the client bundle; the panels are server
components passed in as a prop.

Two details that came out of watching it run. The tab list was capped at
34rem with `overflow-y: auto`, which clipped the ninth tile mid-row and read
as a rendering fault rather than as a scroller — the nine fit, so the cap is
gone. And the stage now has a floor of 32rem on wide screens: the tallest
panel is nearly twice the shortest, so switching moved everything below the
section and, at the bottom of the list, moved the tab out from under the
pointer that had just clicked it.

### And a bug in the two switches' comments

Both segmented switches were corrected yesterday so `ArrowRight` does not
mean `i + 1` on a mirrored track. The code was right and **the comment
explaining it was backwards** on all three controls, including the new one:
it claimed `ArrowRight` means "next", when what the code does — correctly —
is move the focus ring to the right of the *screen*, which in a mirrored
list is the previous item.

Worth recording because the tests did not catch it: both switches have two
options, so `i - 1` and `i + 1` wrap to the same place and every assertion
passed either way. The explorer has nine, which is the first time the two
readings produce different answers; `End` then `ArrowRight` goes 8 → 7, and
that is the right answer.

## /solutions, hero to CTA (7 Nov 2026)

The explorer went in and the page still read as plain. Asked again, with
three more references and a specific brief: the whole page, and animate it.
What was missing was not another component — it was that nothing on the page
moved until a third of the way down it, and the two ends of it said nothing.

### The heroes were the one thing that never moved

`.mk-words` — the kinetic heading, words resolving one after another — has
been in this stylesheet since the homepage was built, and it was on the
homepage only. Thirty data-driven pages opened on a wall of static display
type, which is most of what "looks plain" means when it is the first thing
on the screen.

`AccentedTitle` now splits into `Words` plus the accent clause, and the hero
passes `load` because a scroll-driven range above the fold has already run
out before anybody sees it. Measured on /solutions: six words going
`0.07 → 0.46,0.19,0.04 → 0.83,0.69,0.46,0.19,0.04 → …`.

The accent clause does *not* resolve word by word and cannot: it paints its
blue through `background-clip: text` with a transparent colour, so the
glyphs paint nothing and fading the words inside it fades nothing at all —
the trap `Accent`'s note on the homepage already records. It arrives as one
phrase, placed after the words above it by `--i`.

This reaches every data-driven page, not just this one. That is the right
scope: the device existed, these pages were simply never given it.

### A picture in the hero

Three audience pills, a rule, the mark at the waist, nine solution chips.
The `web` block.

Boxes, not a drawing. The homepage's ecosystem funnel is inline SVG and had
to be — bezier curves that leave one node vertically and arrive at another
vertically cannot be built from boxes, which is the exemption that file
carries. This diagram is three straight runs and a row of stubs, so it needs
no curve, no exemption and no second way of drawing things here.

Each tile and chip carries its own stub, so the connectors are children of
the things they connect rather than absolutely positioned against them —
the diagram re-flows on a phone instead of coming apart, and there is no
coordinate anywhere to go stale when a label gets longer.

It is `aria-hidden`, because everything in it is said again immediately
below: the three are the three cards, the nine are the explorer's nine tabs.

The motion is three existing classes. The tiles arrive with depth, the two
rail segments draw themselves outwards from the mark as the section crosses
(`.mk-draw` grows from the start edge, so on /ar they open rightwards
first), and the nine chips cascade.

### The panel changes rather than cuts

No JavaScript and no key on the element. An animation does not run while its
element is `display: none` and starts fresh the moment it is displayed —
which is exactly what `hidden` flipping off does. So eight hidden panels
each hold a cocked animation and whichever is shown next plays it. Measured:
`0.00/10px → 0.21 → 0.64 → 0.89 → 0.98 → 1.00/none`.

The explorer's nine tiles also stagger in now, and the stage holds a floor
of 32rem so switching does not walk the page about.

### The page ended on an empty slab

`{ kind: "cta", buttons: [CTA.startFree] }` — the mark and one button on a
full-width panel of blue, with nothing said, on the page the whole set
funnels into. It carries the approved line now, which §11 lists to be used
verbatim and which happens to be the right one here: «ابنِ الهوية.
سلّمها. وأبقِها حيّة.» is the three audiences the page has just asked the
reader to choose between, in order.

### A NUL byte, twice, and now a rule

The bracket rule's non-breaking space put a literal NUL in `app/globals.css`
on 7 Nov. It was fixed, and the comment written to explain the fix put a
second one in — in the sentence describing the trap. A CSS unicode escape
written with four hex digits reads as an octal escape for zero in most other
languages, including the ones these files get edited through.

Nothing complains. The stylesheet compiles, the page renders, and the only
outward sign is `grep` quietly reclassifying the file as binary and refusing
to search it — which is how the second one survived a full green check run
and was found by accident.

`check:design` has a tenth rule now. Three things about it are worth
recording, because all three were wrong first:

- It is **the one rule that reads comments.** Everything else here strips
  them, for the reason the header gives — the physical-properties rule was
  matching the prose of the comments explaining the rule. This is the
  opposite case, and both real bytes were inside a comment.
- It scans by **code point, not regex.** The regex form was written twice
  and arrived with literal control characters inside its own character
  class both times, because a unicode escape is precisely the thing that
  gets eaten on the way into a file. The check was failing on its own
  source. Comparing numbers cannot be mangled.
- It was **verified by planting a byte in each position** — inside a
  comment and outside one. The first version passed the in-comment test by
  not being able to see it, which is the failure mode a check like this is
  for.

## Every section on the right edge (7 Nov 2026)

Asked for directly, after the centred heads went in: make sure every section
has its elements aligned to the right, in the right way.

Nothing on the site was laid out backwards. A probe over all 35 Arabic
routes at two widths found no `text-align: left`, no `float`, no
`justify-content: left`, no Arabic in an LTR box, and no row that kept its
English order. The three `translateX` hits were the centred light pools,
positive in RTL because `--mk-dir` carries the sign, which is correct.

What was wrong was the rule, not any one element.

### The centred heads were the thing that broke it

`PageDoc.heads` went onto twelve pages the day before, to give the longest
pages a full stop between sections. Measured, it did something else: it
centres the head of the five block kinds whose head sits over a grid, a
table or a ladder — and the content of all five is start-aligned. So it
centred heads over exactly the content that is not centred, by construction.

Scrolling `/solutions/brand-hub` the headings went right, centre, centre,
right, centre, centre, right. There is no rule in that a reader can infer,
and on a right-to-left page it reads as a page somebody forgot to align.

Across the site, **51 section heads were centred over start-aligned content**
and 59 agreed with theirs.

So the field is gone rather than unset. A switch whose every reachable case
is the wrong one is not a switch to leave lying about: any future use of it
reproduces this. The per-block `align` stays on `table` and `plans`, which
is a choice about one block made where the block is, and seven declarations
of it came out too — two tool tables on `/platform`, two plan grids and two
comparison tables on `/pricing`, and one `prose` block, all of them heads
centred over start-aligned content. That last one is stated as `align:
"start"` rather than dropped, because dropping it would default `prose` to
`split`, the two-column signature, which is a different layout.

Count afterwards: 90 agree, and the 20 that remain are the hero, the
showcase, and numeric tables.

### Two shapes earn a centred head, and both are measured

Not named. `check:align` asks the browser:

- **A head block whose every child centres with it** — the hero. It needs no
  clause: a title card holds nothing but its own centred block, so the
  search for start-aligned content below it finds nothing to disagree with.
- **A centred frame** — content sitting with equal gaps either side of its
  container and leaving at least a tenth of the container's width as air.
  The showcase's product shot is one: 865px inside 1100, 118px a side.

That last clause is the whole rule and the first version did not have it.
"Narrower than its container, centred in it" also describes the comparison
table's shell — 1044px inside 1100, 28px of symmetric margin — which is a
full-width block with an inset and reads as one. It exempted the very
section a planted test had just centred the head of. A tenth separates them
with room to spare: 21% of the container for the frame, 5% for the shell.

A head block that centres as a whole was tried as a third exemption and
withdrawn: that is also true of a centred head over a start-aligned table,
which is the one real finding the check was written for.

### The homepage got the same rule, not an exemption

It started with an allow-list. The homepage is composed section by section
from the design reference, which §0 of the design system gives authority over
layout, so its five centred heads looked like a decision to record rather
than a drift to fail.

Measuring them said otherwise. Four sit over something genuinely centred and
the rule clears them on their own measurements, without being told which page
they are on. The fifth — `AiAlongside` — sat over an effect table whose every
row starts at the start edge, and no reference image maps to it. Its head and
the 680px body column under it were both centred, so the section opened in
the middle of the page and then stepped back to the edge; the closing link
centred too. All three are start-aligned now, which also ends three
paragraphs of centred Arabic body copy — the argument `prose` is already
built around.

The allow-list would have hidden the one real finding behind four false ones.
There is none.

### What widening check:bidi found

Two things, and both had been shipping.

**The route list was still hand-kept.** Eight pages by name plus one article
per collection — and the hand-kept half is why the article date shipped
misaligned on thirty-two pages. Extending it by three names the day before
fixed that one page shape and left the next to be forgotten the same way. It
comes out of the prerender manifest now, 14 pages to 35, the way
check-pages, check-motion and check-align all get theirs.

The first run of the widened list found **two live misalignments** on pages
the old list never visited: a `dd` holding one link variant, 400px off the
start edge on `/solutions/leadership-alignment` and 216px on
`/solutions/brand-voice`.

That is the atomic-flex case this check's own header documents. Every
`Button` variant is an `inline-flex` box, and such a box is atomic to the
bidi algorithm whatever its `unicode-bidi` says — the block around it sees
one object replacement character and nothing inside, finds no strong
character, and falls back to left-to-right. The `mk-bidi` on the label
cannot help: that governs the string *inside* the box, and the box is what
the parent cannot see into. `mk-atomic` on the shared class fixes every
variant at once, and is inert anywhere else — its rule only fires on a
parent that is itself a text element, so a button in the usual flex row is
unaffected.

**The check could not see the defect it was extended to catch.** It asked
`ARABIC.test(text[0])`, and UAX9 P2 scans for the first character of type L,
R or AL — digits are weak, spaces and punctuation neutral, all skipped on the
way to the decision. Testing only the first character therefore excluded
precisely the strings most likely to be laid out backwards: the ones with no
strong character at the front, whose direction rests entirely on what comes
after.

"8 سبتمبر 2026" is one. Planting the date defect again, after the route
extension: the date sat 164px off the start edge while the two cells beside
it sat on it, and the check passed. With the first-strong-character scan it
reports all three article templates.

### And the finding that was not one

`check:bidi` had carried one finding on `/` for three weeks — an `li` 232px
off the start edge. It was a false positive, and the measurement says so
plainly: the effect table's header row has three grid tracks, 220px of label
and two cases of 356px, and the label track is **deliberately empty** in the
header, because the label belongs to each data row. In RTL that empty track
is the rightmost 213px, so the row's ink began 232px in. Both headings end
exactly at the start edge of their own column.

The check compared an element's ink box to its own box, which is the right
question for a block of text and a meaningless one for a row of tracks: the
ink box spans the cells that *have* text, so an empty leading cell is
arithmetically identical to the whole row having drifted. A row of tracks
answers for its cells now, and nothing is lost — every cell is an element in
the same sweep, so a row whose cells really have drifted is still caught,
once per cell, and named at the cell that did it. Planting a drift inside a
cell proves it: 145px, reported at the `span`.

### check:align

Three rules, 35 Arabic routes, two viewports, in `check:live`.

1. **Physical properties, resolved.** `check:design` greps the source for the
   forms it knows; this asks the browser for the computed value, which is the
   only way to catch one that arrived through a Tailwind arbitrary value, an
   inline style or a shorthand.
2. **A row that kept its English order.** In a right-to-left row the first
   child sits rightmost. The text inside each cell still reads correctly when
   it does not, so nothing looks broken up close — the icon is simply on the
   wrong side of its label.
3. **A head that does not sit where its own content sits**, by the rule above.

Each was proven by planting a violation and watching it fail, which is worth
the trouble twice over: the first rule-2 plant set `flex-direction:
row-reverse` on `.mk-doors`, which is a **grid** and ignores it, so the plant
did nothing and the silence meant nothing. And the first rule-3 plant was
swallowed by the frame threshold described above. A check that passes on its
first run has told you nothing yet.

## Blue is light, not fill (7 Nov 2026)

Two asks, one cause. A screenshot of the note — a full-bleed bar of pale
blue with an ⓘ in it — and "change these rectangles into something related
to our art direction"; and /solutions still looking plain.

### The note was the one place blue was a fill

`.mk-note` was `background: var(--accent-soft)` with a hard 2px accent rule
down its reading edge, stretched to `inline-size: 100%`. §1.4 and §13 both
say what blue is here — glow, neon edge, focus ring, selection, progress —
and what it is not: a section fill, a card fill, a panel. The note was the
exception, and at full width it read as a form-validation strip rather than
as an aside.

It is built from the three things every other surface on this page is built
from now: a white ground, a hairline and a lift, with the blue carried by an
icon tile at the §6 recipe — a glyph on its hue at ~14%, the same object the
cards already use. `fit-content` rather than `100%`, because an aside is as
wide as what it says; the 46rem cap still catches the long ones.

The lift is its own value rather than `--lift-card`: that one is tuned for a
400px card and throws a 70px shadow, which under a 44px note is a smudge.

**The callout was the same shape one size up** — a 1100px card whose body is
capped at 62ch by `.mk-measure`, so its last 40% was empty, with the same
flat 2px rule down its edge. The rule is light now: a bar that falls off
down its own length, and a pool bleeding into the corner behind it. Both
gradients are direction-safe by construction, and that is why they are
shaped this way — the bar runs *down*, and a vertical gradient has no side
to get wrong; the pool is a radial centred on itself. The one form that
would have needed `.mk-web-line`'s four-rule RTL flip is a horizontal fade,
for an effect the eye cannot tell from this one.

### /solutions had no light in it

Measured against §8 — one light source per section, behind the one object
the section is about — the page had exactly one, in the hero, and the
closing CTA panel. Between them: white cards on a near-white ground with the
brand's blue appearing as 16px icon tiles and 4px bullet dots. That is what
"plain" was.

Three things, all of them the system's own vocabulary rather than new
decoration:

- **A light pool behind the explorer stage.** That panel is the one object
  those nine tabs exist to drive, which is §8's definition of where a pool
  goes, and the explorer shipped without one.
- **The selected tab's glyph inverts into the brand blue.** Nine identical
  8%-blue tiles in a column give the list no focal point; the 1.5px ring was
  marking the selection on its own. Filling the chosen tile is the §10
  selected-object move and it is visible from across the page.
- **A card's icon tile lights when the card is reached for.** At rest it
  stays the §6 recipe, because nine tiles down a page should not each be
  shouting. Only `.mk-reach` and `a.mk-card` — the cards that lead somewhere
  — since lighting a tile on a card that cannot be pressed promises
  something that does not happen. Nothing moves: the standing rule is that a
  control must not shift under the finger, and this is a colour change on a
  card's decoration.

**The glow overflowed the page first.** `.mk-explorer-glow` re-spelled
`.mk-center-x`'s `inset-inline-start: 50%` and `translate: calc(-50% *
var(--mk-dir))` inline and sized the pool at 120% of the stage — 70px past
it on each side, with nothing clipping, so the page gained a horizontal
scrollbar and every section shifted. That utility exists because this
pairing has now caused four bugs; the fix was to use it instead of
re-deriving it, and to cap the pool at 100% of the box it sits in.

### The hero had no blue clause

The page's first impression is "من يصنع العلامة، ومن يعيش معها." in flat
ink. The light page's most recognisable move — the first clause in ink, the
second landing in blue — was missing from the page it was most wanted on.

`AccentedTitle` infers the split from punctuation, and it only looked for a
sentence break. Eleven of the twenty-five hero titles have none, and four of
those are plainly two clauses joined by a comma. So the rule falls back to
the **last** comma, which matters: `/solutions/studios` is a three-part line,
"عشرة مشاريع، وعشرة عملاء، ومكان واحد." — the first comma would have
coloured two thirds of the headline, and the last one gives it exactly its
closing phrase.

The Latin comma is deliberately not in the set. No English hero exists yet
— `/en` for these pages serves the untranslated notice — and when one does,
an enumeration would hand its last item to the accent.

**`check:motion` went 1655 → 1647, and the eight are accounted for.** A
title that splits stops being N animated word spans and becomes (head words
+ 1) — the accent clause arrives as one phrase, which is forced rather than
chosen, since `background-clip: text` makes per-word opacity a no-op. Three
routes explained seven of the eight. The eighth was `/solutions/studios`,
which the survey that sized this change had missed: its regex wanted `title:`
on the line after `kind: "hero"`, and that file orders the keys differently.
Isolated by counting every route with the fallback on and off and diffing —
worth the two passes, because an unexplained element-count change is exactly
the shape a real regression arrives in.

## The admin panel follows the site (8 Nov 2026)

"Fix and redesign the admin dashboard with a design aligned with the website
design and our direction." The redesign and four of the five fixes turned out
to have one cause: the admin was built against a Markyos that no longer
exists.

### It was the platform's dark panel, and the site stopped being dark

`app/(payload)/custom.css` imported `app/tokens.generated.css` and pointed
Payload's thirty theme variables at the platform app's dark palette — #060607
ground, #16161a cards, a white-opacity text ramp — with a comment arguing the
case: the admin is product UI, it sits beside the platform in somebody's day,
and the website's own palette would read as a different product.

Every sentence of that was true in October. The site was rebuilt to the light
landing design on 3 Nov, and the relationship inverted: the admin is the
surface a person reaches *from* markyos.com, usually in the next tab, and it
was the near-black panel next to a paper site.

So it follows the site now, and `app/theme.css` is imported directly — the
same file the chrome, the blog and every page under `content/pages/` read.
There are no literals in the skin and no second palette to keep in step.

`tokens.generated.css` is deliberately **not** imported any more, and not only
because the admin stopped using it. It carries both platform palettes, and its
`:root[data-theme="light"]` block is specificity (0,1,1) against `theme.css`'s
plain `:root` — the moment Payload wrote `data-theme="light"` onto `<html>`,
the admin would have silently rendered the *platform's* light theme (#eeeef2
ground, #0062b8 accent) rather than the website's. The skin states its palette
on `html`, `html[data-theme="light"]` and `html[data-theme="dark"]` for the
same reason: Payload's own blocks are (0,1,1), a bare `:root` loses to them,
and naming the dark selector too means a preference stored before the flip
cannot strand anyone on a theme whose values were deleted.

### The elevation ramp had to be inverted, and one slot could not be mapped

Payload's ramp runs back-to-front: `elevation-0` furthest back,
`elevation-1000` furthest forward. On dark it climbs in lightness; on light it
falls. One departure from Payload's own light theme is the design's: there a
white page carries grey cards, here a paper page carries white ones. That
inversion is most of what makes the site look like itself.

Two slots needed arithmetic rather than a mapping, and both were found by
counting what Payload spends them on:

- **`elevation-400` is the panel's workhorse grey** — 88 of Payload's rules set
  `color` from it. Its own light value is #9a9a9a, which is **2.85:1** on white
  and fails AA at every size. It is pointed at `--text-faint` (5.55:1 on white,
  5.3:1 on the canvas), the token the site sets captions in. Twenty-odd borders
  share the slot and are firmer than Payload draws them; that is the legible
  direction to err in.
- **`elevation-200` carries borders, three hover fills and two disabled
  labels.** Mapping it to `--surface-3` (#F0F2F6) made "Save Draft" invisible
  when disabled — a near-white ink on a near-white ground. It is the ink at
  16% instead, which is what Payload means by the slot.

### The primary button is the site's button

It was the design system's product blue with a glow (§10), which was right on
a dark panel. On the site the one solid control is `--solid`, near-black, and
blue is light. It is near-black here too, so blue in this panel now means
"this is the live one" and never "press this".

What it must not lose is the separation it was introduced for: "Publish
changes" and "Save Draft" once sat side by side in two greys a few percent
apart. Near-black against a white outline is a wider gap than blue against
grey was.

### Five fixes

**1. Every Arabic string in the panel was Arial.** The admin is a separate
root layout, so `app/fonts.ts` never reached it and `custom.css` named
"Thmanya Sans" as if it were an installed family. `cms/views/AdminFonts.tsx`
declares the three font variables through `admin.components.providers` —
Payload's own extension point, since the generated layout carries a
do-not-edit banner and its one sanctioned edit was already spent on the CSS
import. A `<style>` on `:root` as well as the class, because Payload renders
drawers and toasts through portals into `<body>`, and a drawer is exactly
where somebody edits an Arabic title.

That alone did not fix it. `next/font` expands `--font-inter` to
`Inter, "Inter Fallback"`, and the fallback is a metric-adjusted *local* face —
Arial on Windows — which carries Arabic. Inter carries none, so the stack
found Arabic one position before Thmanya. Measured with
`CSS.getPlatformFontsForNode`, not read off the stack:
**`Arial x23, Inter x4`** on a post title whose computed `font-family` named
Thmanya the whole time. It is the same defect `globals.css` documents at
`:lang(ar)`, and the admin was the one surface that sweep could not reach,
because nothing imports it.

The provider therefore also publishes `--font-latin`, Inter's primary family
split off from its fallback, and the panel's stack leads with it. After:
**`thmanyah sans x27, Inter x4`**.

**2. The dashboard's type was 19% small, and under the floor.** Payload sets
`html { font-size: 13px }` — 12px under its small breakpoint — so a rem in the
admin is not the rem `theme.css` is written against. `--fs-eyebrow` (0.8125rem)
resolved to **10.56px**, below the 12px floor §1.6 sets, and every size on the
screen was short. The view's scale is stated in pixels now. Nothing is lost by
it: the panel's root is a hard-coded pixel value, so rem in the admin already
does not follow a reader's browser font size the way it does on the site.

**3. A one-line field was 1320px wide.** Payload stretches the document's
field column to the window, so an "Eyebrow" holding four words was a box the
width of the screen and a label sat a screen away from its value. Capped at
60rem. The cap is on the fields and not on the column that holds them, because
a tab bar is chrome rather than content: capping the column put the homepage's
seven tabs into a 995px strip inside a 960px box and "Founder, FAQ & close"
had to be scrolled to. Measured both ways — group 1440 → 780, input 1320 → 660.

**4. The sidebar had no edge.** Payload draws the nav with no fill and
separates it with a border taken from `elevation-100`, which here is #F4F6FA
against a #F7F8FA ground. It is white on the paper instead, which is the
arrangement the whole site is built from.

**5. `auto-fill` left a quarter of the card empty.** Four section tiles in a
grid with room for five: `auto-fill` keeps the empty track and it still takes
its `1fr`, so the tiles stopped short of their own container. `auto-fit`
collapses it. The five analytics breakdowns had the same shape one level up —
one `auto-fit` flow put three on a row and left two with a third of the width
empty beside them. They are not five of a kind: the two long lists get halves,
the three short ones get thirds.

### The dashboard is an LTR island

Payload mirrors the whole panel when the admin's language is Arabic, and this
view's copy is English — none of it goes through `i18n`. Mirrored, it did not
merely look odd: UAX9 resolved each line against an RTL base, so the chart's
axis read "Nov 7" and every sentence's full stop jumped to the front of it.
`dir="ltr"` on the one untranslated view fixes both and leaves the shell around
it mirrored. It is the carve-out the site already grants its product mocks, and
it comes off the day the view is translated — the layout inside is written in
logical properties and will mirror on its own.

### cms/ is inside the design rules now

The admin drifted into a different palette, a different weight ceiling and a
sub-floor type scale with nothing watching, because `scripts/check-design-rules.mjs`
scanned `app`, `components` and `content` and the CMS lives in none of them.
It scans `cms` too: 1026 file reads, up from 851.

Two things surfaced immediately, and one of them is about the checker rather
than the code. `AdminFonts.tsx` names `--font-plex-arabic`, which is right —
it is where the chain is declared for this layout, the same carve-out
`app/theme.css` has — so it is an exemption with that reason. The other was a
false positive of the documented kind: the script strips comments before
matching, but a CSS comment inside a template literal is a *string* to a
`.tsx` parser, so the physical-properties rule matched the prose in a comment
explaining why the property is logical. Reworded rather than exempted; the
rule is right and the sentence was avoidable.

### Not done

The panel's own chrome still reads at Payload's 13px baseline. Lifting the
root would rescale Payload's layout by 23% against px breakpoints, which is a
much larger change than this one, and the dashboard — the screen somebody
actually lands on — no longer depends on it.

The login screen needed the dev server restarted with `PAYLOAD_DEV_AUTOLOGIN`
off to be seen at all — `autoLogin` redirects `/admin/login` — and it came out
right without a rule of its own: the lockup in the ink, because the component
masks `currentColor`, white fields on the paper, and the site's near-black
pill on the one action. That is the whole argument for re-pointing variables
rather than restyling components: a screen nobody touched now looks like the
site.

## The admin became the resources CMS (8 Nov 2026)

"Organize and fix the admin dashboard. Link it directly to the resources CMS
and divided between Arabic and English… Delete the homepage and other pages
controlling management and just make it for CMS management for now and to see
the main statistics and insights."

### What came out

The panel had two jobs and did neither cleanly: it was a CMS for four
resources *and* a copy editor for the marketing site, through four globals —
`homepage` (402 lines of schema mirroring every section), `navigation`,
`announcement` and `siteSettings`.

All four are unregistered and deleted, and so is the read path that merged
them over the dictionary: `lib/content/pageCopy.ts`, 350 lines whose entire
job was mapping global fields onto `SiteCopy`. `getSiteCopy` is gone; the two
pages that called it call `getCopyFor` directly.

That last part is a small improvement in its own right. `app/[lang]/layout.tsx`
was already importing **both** — `getCopyFor` for `generateMetadata` and
`getSiteCopy` for the chrome — so the page title and the nav were reading from
two different sources and could disagree about what the site said.

`siteSettings` turned out to be read by nothing at all. It had a schema, a
place in the sidebar and a tile on the dashboard, and no consumer.

**What this costs:** nobody can change a homepage headline without a pull
request. That is the trade the instruction asks for, and the thing it buys is
that `npm run check:locales` now stands between every marketing string and
production, where a CMS override went around it.

### One card per resource, split by language

A Payload document is one record with a column per locale, so "nine guides"
can mean nine in Arabic and four in English, and a single count hides the only
question a bilingual site has. Each resource card carries a row per configured
locale: the label, a bar of written-against-total, and the pair as digits.

The denominator is every document, published or not — a draft has been
written, and the question is how much exists in each language rather than how
much is live.

Each row links into that collection's list **at that locale**, which is where
the idea pays off: Payload prints `<No Title>` against a document with nothing
written in the selected language, so one click turns "English 0/1" into the
list of exactly what needs translating. Verified end to end rather than
assumed — the card reads `English 0/1`, the link lands on
`?locale=en&depth=1&limit=10`, and the row says `<No Title>`.

Two details worth keeping:

- **The locale list is read off `payload.config.localization`**, not written
  out again, so a third language adds a third row and nothing else.
- **Arabic is first**, which meant reordering `localization.locales`. English
  led because the two were equals once, which put the primary language second
  in the locale switcher and in every row somebody reads. Order is not
  `defaultLocale` and does not change it — item 29 in BEFORE-PUBLISH still
  stands.

The one looseness is declared in the code: a resource counts as written in a
language when its locale-bearing field exists there, and for Comparisons that
field has to be `intro` rather than the title, because `competitorName` is
deliberately not localized ("a product name is a product name"). A richText
`intro` counts as present once it holds any node, so an empty paragraph
somebody saved by accident counts. The alternative is reading every document
to inspect it, and this is a dashboard figure rather than a publication gate.

### The sidebar now says what things are

`Content` held the four resources **and** Media, so the sidebar read as five
peers with the one non-peer in the middle. The four are `Resources` — they are
the four pages the site calls that, at `/blog`, `/guides`, `/help` and
`/compare` — and Media is `Library`, because it is what they are made of
rather than one of them. `Website content` is gone with its globals.

### The bug underneath: nothing was being revalidated

Every resource declared `revalidateDoc("/resources/<thing>")`, which is where
these sit in the site's information architecture and is **not** where they
render. The routes are `app/[lang]/blog`, `/guides`, `/help` and the
comparison pages under `/compare`; `/resources/blog` is a 301 to `/blog`. So
publishing a post revalidated two redirects and left the real index cached —
on a statically rendered site, that is the edit never appearing.

`next dev` re-renders on every request either way, which is most of why it
survived a year of being looked at. The hook's doc comment now says to check
`indexPath` against `app/[lang]/` rather than against the navigation.

### The motion check was reading one stop behind

`check:motion` failed on `/` straight after this work, with a `.mk-pop` figure
"left mid-reveal" at opacity 0.9667. It reproduced to the digit across three
runs, which is what made it worth chasing rather than re-running.

Nothing was stuck. The check walks the page in 700px stops and judges each
element at the first stop where its box is fully above the viewport; scrolling
*straight* to that offset and asking the animation gave `playState:
"finished"` and opacity 1. And 0.9667 is exactly what that figure reads at the
**previous** stop. A scroll-driven animation is updated off the main thread,
so the first `getComputedStyle` after a jump can still be the last stop's
value, and the fixed 60ms wait had stopped being enough. Raising it to 120ms
made the failure vanish, which is the proof and is also the wrong fix.

It now settles the values the judgement is about to read, the same way
`settleClocks` already settled the clock-driven ones: choose the elements due
at this stop by geometry, which is current the moment the scroll applies, then
sample them every two frames until nothing moves. A genuinely stranded element
is stable immediately, so it is reported on the first pass and the comparison
against the no-animation baseline is untouched.

Proved by planting `animation-range-end: cover 300%` on `.mk-pop` — reveals
that cannot finish within the scroll — and watching the check fail on several
pages, then removing it and watching 1647 elements across 70 pages come back
green. 1647 is the same count as before this work, which is the other thing
worth recording: the page-copy layer came out without changing a single
rendered element.

### Still outside the CMS

`/whats-new` and `/roadmap` are two of the six things the site's own
`/resources` page lists, and neither has a collection — they are pages under
`content/pages/`. That is consistent with where the line now falls (codebase
copy is the codebase's) but it does mean "every resource is in the admin" is
true of four of six. Worth a decision rather than a drift.

## The resource pages moved into the CMS (8 Nov 2026)

"There are some problems in loading the articles in the blog and other
resources. It shows only one article instead of all articles. Make sure that
the admin dashboard controls all CMSs and manages the Arabic and English
separately. And don't mix between them."

### One article in the panel, thirteen on the site

Both numbers were right. The blog served thirteen posts and the panel listed
one, because `lib/content/index.ts` composed two sources: Payload, and a
code-level source (`lib/content/seed.ts`) reading `content/editorial/ar.ts`,
which filled in per slug wherever the CMS had nothing. Twelve posts, five
guides and fourteen help articles — thirty-one of the site's thirty-two
editorial pieces — were code.

The intent had been to migrate a section an article at a time rather than go
from all-placeholder to one real post and an empty page. What it produced was
a panel that was not in control of the pages it was named after. Those
thirty-one could not be edited, categorised, reordered, unpublished or
translated from the admin; the dashboard's counts were honest about the CMS
and therefore wrong about the site; and deleting a post in the panel would
have silently resurrected its placeholder, because the fallback had no way to
tell "never written" from "deliberately removed".

An import script put all thirty-one into Payload, matched on slug so it could
never overwrite an edit. The compose layer is gone and
`content = payloadContent`.

The site did not change: thirteen, five, fourteen and two, the same as before.
The panel did.

### Keeping "placeholder" through the move

The thirty-one are placeholder prose, and two things depended on knowing that:
the notice on the article, and the `noindex` that keeps an index out of search
while every piece on it is provisional. Both read a flag the seed source set
as a constant, which meant promoting a piece to finished writing meant editing
code.

It is a field now — `provisionalField`, a sidebar checkbox on Posts, Guides and
HelpArticles — so the person who rewrites the article is the person who clears
it, in the same screen, on the same save. Not localized, like `slug` and
`publishedAt`: it describes the piece, not one translation of it.

### Arabic and English, separately

Everything imported is written to `ar` and nothing to `en`. That is the record
saying "not translated yet" in the only way Payload has to say it, and the
public reads already have `fallbackLocale` off, so `/en/blog` renders its empty
state instead of Arabic prose under an English URL. The dashboard reads
العربية 13/13 · English 0/13, and the English row links to the list at
`?locale=en`, where all thirteen show as `<No Title>` — the translation queue,
derived rather than kept.

Comparisons were the exception and it was a real bug: `listComparisons` and
`getComparison` were the two public reads *without* `fallbackLocale: false`,
against a config whose `defaultLocale` is `en` and whose `fallback` is `true`.
An English-only comparison requested as Arabic would have come back filled
with English. Both have the flag now, and a `comparisonTranslated` test of
their own, because a comparison has no title to ask the question of —
`competitorName` is deliberately shared across locales, so the localized
fields are `intro` and the table rows.

### Three things the import surfaced

**Help articles were being sorted by a column they did not have.**
`listArticles` asks every editorial collection for `-publishedAt`, and
HelpArticles had deliberately dropped the field ("maintenance documentation,
not writing with a byline"). Empty, the collection never showed it. They have
a date now, which orders the list and is printed nowhere, and an excerpt,
which the article prints under the heading and search uses as the description.

**Guides had no author and no category**, while the guide template renders a
byline and the guide cards are typeset from a category exactly as the blog
cards are. The placeholder objects supplied both, so the schema gap was
invisible until the import dropped them on the floor — Payload discards an
unknown field without complaining. Both fields are on the collection now, and
the five existing guides were backfilled.

Help articles kept no byline, which is the one case where the gap was the
schema being right and the placeholder being wrong.

**Reading time was a flat 200 words a minute.** The reasoning on record was
that Arabic is slower per word but uses fewer of them and the two cancel. They
do not cancel at the length this site publishes: a 271-word Arabic post is
1.36 minutes at 200 and rounds to "one minute", and so does a 90-word help
article. While most pieces came from the seed this never showed, because the
seed computed its own at 180. The moment everything came through one mapper,
the whole blog index flattened to the same label. The rate is per locale now —
180 for Arabic, 200 for English — and 180 is the figure that produced these
exact numbers before the move, so nothing published changed.

### The preview button pointed at redirects

All four collections set `admin.preview` to `/en/resources/<thing>/<slug>`.
The routes are `/blog`, `/guides`, `/help` and `/compare`; the `/resources/*`
forms are 301s. This is the second half of the bug recorded above under the
revalidation hooks, from the same cause — the information architecture read as
if it were the route table — and it had been shipping a Preview button that
took an editor through a redirect to a page that could not carry the draft
token.

### The motion count, accounted for

1647 before, 1643 after the import, 1645 once the guides had their bylines
back. The remaining two are the help centre's, which the collection does not
have and should not: `.mk-seq-load > *` counts the children of the article
header, the byline is one of them, and the check samples two help articles.
Every element that is still there still settles.


### And then they were deleted (same day)

"Delete all dummy resources and I'll attach a real one. To replace them."

The import had done its job: it made the thirty-one into documents, which is
what made them selectable, countable and — now — removable from the panel
rather than from the codebase. All thirty-one went, scoped by the
`provisional` flag rather than by a list of slugs, so the delete could only
ever take documents that said of themselves that they were placeholders.

`content/editorial/ar.ts`, `content/editorial/lexical.ts` and the import
script went with them, and `cms:import` came out of `package.json`. Keeping a
one-command way to recreate thirty-one just-deleted documents is the same
"the panel is not in control of its own pages" failure in a slower form, and
`git log -- content/editorial/` is the real archive. The remaining code —
`provisionalField`, the notice, the index-level `noindex` — stays, because it
is a working editorial feature rather than scaffolding for that content.

The taxonomy stayed too: eighteen categories and one author, all real names
from the content plan, which the real articles will want. Deleting them would
have meant retyping them.

**The resource sections are empty now**, and their empty states are what they
were always written to say. The one document left in the CMS is the test post
under the Arabic slug `السلام`, which is BEFORE-PUBLISH item 27 and somebody's
record to delete rather than mine.

### Dev schema push can empty a table, and it did

One document was left after the purge: the test post under the Arabic slug
`السلام`, BEFORE-PUBLISH item 27, which is somebody's record and not mine to
delete. The purge log says "posts: 12 deleted, 1 left" and `/blog` rendered it
afterwards. It is not in the database now, and nothing deleted it on purpose:
`posts`, `posts_locales`, `posts_rels` and both version tables are all empty,
which is a table that was recreated rather than rows that were removed.

The cause is the same drizzle behaviour that broke the import twice. SQLite
cannot add a column in the middle of a table, so `pushDevSchema` recreates the
whole table whenever the config's column order no longer matches the
database's. `provisional` landed after `_status` in `posts` and before it in
the config — `posts` already had `_status` when the field was added, while
`guides` and `help_articles` were rebuilt during the failures and came out in
config order. `posts` was the one table still mismatched, and it is the one
table that lost its rows.

**This is local only.** `push` is the SQLite development adapter; production
is Postgres and goes through `payload migrate`. The header comment on the
adapter already says to develop schema changes against Postgres and treat
SQLite as "look at the admin" mode, and this is what it costs when you do not:
a dev database under `node_modules/.cache` is scratch in a way that includes
losing a row to a field addition.

Two things follow for anyone adding a field here. Expect a push to fail
part-way and leave a half-applied schema — re-running it usually completes,
which is what happened twice during the import. And take a copy of
`node_modules/.cache/payload/cms.db` first if there is anything in it you have
not got anywhere else.

## The written resources arrived (8 Nov 2026)

"This folder has all resources in both Arabic and English. I want you to get
the content and put it into the website CMSs."

Forty pieces, each written twice: ten blog posts, ten guides, ten comparison
pages and nine release notes, plus a template for the tenth. A folder each,
holding the Markdown, a Word copy for review, and its images. The help centre
is the one section with nothing written; its README lists the ten planned
articles.

### Two of the four had nowhere to go

Blog and Guides were an import. The other two were not.

**Comparisons had a collection and no route.** Nothing on the site called
`listComparisons` or `getComparison` — the `/compare` pages a visitor saw were
hand-written page copy under `content/pages/ar/`, and two of them,
`pdf-guidelines` and `tool-stack`, are two of the ten in the folder. So the
collection was a schema nothing rendered, and the pages were copy nobody could
edit.

**What's new had neither**, while `/resources` listed it as one of six things
the site offers.

Both are CMS sections now, with the same two routes the blog has, rendered by
the same `components/page/editorial/`. Five collections read through one
pair of methods.

### The comparison schema did not survive contact with the writing

It was built around `comparisonRows` (feature / competitor / markyos) and
`objectionHandling` (question / answer), so that the table would render
identically everywhere and a fairness review could read rows rather than
markup. Good arguments, and not what ten written comparisons turned out to be:
a lead, a capability table, "when they suit you better", "when we suit you
better", how to switch, and a dated line saying when the facts were last
checked. The table is one section, and the sections around it are what make
the page fair — they are not objections with answers.

So Comparisons is shaped like Posts, and the table is a table in the body.
Nothing was lost in the change because the collection was empty. The fairness
argument moved rather than went away: every page carries its own
facts-checked date in its last line.

### Tables, which the editor did not have

Six of the ten comparisons, the template in every guide, and several blog
posts are built around a table. `EXPERIMENTAL_TableFeature` is on — Lexical's
own naming, enabled anyway, because the alternative was a list pretending to
be a table, which is worse for a screen reader and worse to read.

Rendering them needed a converter. Payload's default writes
`border:1px solid #ccc; padding:8px` **inline on every cell**: a raw hex, a
mid grey chosen for neither of the site's grounds, and inline styles that beat
anything `.mk-prose` says. `components/content/RichText.tsx` maps the three
table nodes itself, with no style attribute and a `scope` on the header cells,
and globals.css styles them in hairlines like every other table on the site.
The wrapper scrolls, because a three-column comparison is the one thing in an
article that genuinely cannot stack on a phone.

### The images are localized, which an image field usually should not be

The covers carry type, and the Arabic ones are set in Arabic — 1600×900 files
that differ between the two sides with the same filename. A shared
`heroImage` would have put the English cover on the Arabic article, which is
the exact failure the product argues against. The field is `localized: true`,
and the upload names each file for its locale so the two cannot collide in
the Media library. Ninety-two images, each with its own alt text in its own
language.

This is also the first imagery on the site at all, and it found a layout bug
immediately: `.mk-post-card` is a flex item, flex items are `min-width: auto`,
and a nowrap category pill reading "Companies and content writers" has a
460px min-content width. On a 370px grid track that pushed the card to 500px
and `/en/guides` into a horizontal scroll at every width. The card can shrink
now and the pill wraps when it must. It showed on one page of the forty,
in one language, which is what made it look like an English problem rather
than a grid one.

### Ninety-one notes came out of the text

The Markdown is full of instructions from the writer to the writer:
`[CONFIRM: check Endform's export options…]`, `[CHIP: Coming 2027]`,
`[Button: Download the template →]`, and the Arabic `[رابط:]`, `[زر:]`,
`[شارة:]`. They are about the page, not text for it, so none of them is in the
CMS — and every one is listed in `docs/copy/RESOURCES-TODO.md` with the piece
it came from, because deleting them should not be the same as losing them.
These pages are published, so each `[CONFIRM]` is a claim currently live.

The one marker kept is `[Link: Label →]` followed by a backticked path, which
is the writer's shorthand for a cross-reference and becomes a real link.
Dropping it would have lost the connection the writing depends on.

What is **not** swept is every other square bracket, and that distinction is
the whole care in that function: the guides and the blog posts are full of
fill-in-the-blank templates — "For [audience] who [need], [brand] is the
[category]…" — and those brackets are the writing.

### Two things the content decided, against the schema

**The SEO title cap went from 70 to 80.** Three written comparison titles are
71 to 77 characters, and the cap refused the save rather than warning about
it. A limit that blocks real writing teaches people to work around it; 60 is
still the aim and the field says so.

**Help articles gained a date and an excerpt**, and guides gained an author
and a category — four fields whose absence only showed when real documents
tried to use them. Payload discards an unknown field without complaining,
which is how the guides lost their bylines silently the first time.

### Dates, where there are none

Nine release notes, and eight of them have no release date: the row says
"Launch week", "Third week after launch", "Spring 2027", "Mid-2027 (v4.0)".
Only "Markyos is live" carries a real one. Nothing is invented for the rest —
they are dated today, which is true, because they are being published today.
The parser is strict for the same reason: "Spring 2027" must not become the
first of some month because a date parser was feeling generous.

The blog, the guides and the comparisons carry no date in the source at all,
and get today's for the same reason, with a second between them so each
section keeps the order its folders are numbered in.

### The social cards closed an open "do not ship without it"

`lib/seo.ts` had carried one placeholder card for the whole site since the
beginning — `/brand/og-{locale}.png` on every page — under a comment saying
not to ship without the real thing, because a link with no card is a link
nobody clicks.

The resources arrived with one per piece per language, at exactly 1200×630,
named in every file's metadata table and placed nowhere in the body. Eighty
images that would otherwise have sat unused in a folder. `ogImageField` is on
all five collections, localized for the same reason the cover is, and
`pageMetadata` takes the page's own card where there is one and falls back to
the site-wide file where there is not. The fallback is still a placeholder
for everything that is not an article, so the comment stays where it is.

That is 170 images in the Media library: a cover and a card for each of the
thirty-nine pieces in each of two languages, plus the figures inside the
articles.

### Run the live checks against `next start`, not `next dev`

The README has said `npm run build && npx next start` since the checks were
written. This is a note about what happens when you do not, because the
failure looks like a page bug and is not one.

`check:live` reads the route list out of `.next/prerender-manifest.json`,
which only a build writes, and then fetches each route from `BASE_URL`.
Pointing that at a dev server sharing the same `.next` breaks it.

Sharing one `.next` between a build and a dev server makes the dev server
read prerendered output it did not write, and it fails:

```
⨯ SyntaxError: Unexpected non-whitespace character after JSON at position 735
  page: '/ar/whats-new'
GET /compare 500 in 90ms (application-code: 3ms)
```

`application-code: 3ms` is the tell — nothing of ours ran. It moved between
pages on each build and cleared for a while after deleting `.next` entirely,
which is what made it look intermittent.

`npm run start` serves the same build the manifest came from, so the two
cannot disagree, and it is also closer to what the checks are for: the live
checks are about the site as it ships, and `next dev` is the one mode that
never ships. Build, start, check.

Two Windows notes that cost time alongside it. `next dev` and `next start`
both say "Port 3000 is in use" and quietly move to 3001, so a check run can
end up pointed at a server from twenty minutes ago; and killing the npm
wrapper leaves the `next` process holding the port, where
`Get-NetTCPConnection -State Listen` does not always list it —
`netstat -ano | Select-String ":3000"` does.

## The covers, at the size they were drawn (8 Nov 2026)

Every cover in the resources folder is 1600x900, and every social card is
1200x630. Nothing on the site was shaped to either number, because the slots
were built when a cover was a typeset gradient this stylesheet drew itself
and could be any shape at all. With real artwork in them they were bands cut
out of the middle of somebody's composition:

| Slot | Was | Ratio it gave | Now |
| :--- | :--- | :--- | :--- |
| Card in the grid | `block-size: clamp(132px, 15vw, 172px)` | 2.15:1 on a 370px track | `aspect-ratio: 16 / 9` |
| Article hero | `block-size: clamp(220px, 32vw, 400px)` | 2.75:1 at the 1100px container | `aspect-ratio: 16 / 9` |
| Thumb in "latest" | `size-16`, a 64px square | 1:1 | 64x36 |
| `<Image>` hint | `width={960} height={640}` | 3:2 | 1600x900 |

The figures inside the body were already drawn at the ratio they are shown
at, so they did not move.

### The lead card stopped being a cover with words on it

The blog's lead was a full-bleed cover with the headline, the pill and the
meta laid over its bottom, under a scrim. That is the usual shape for a
magazine lead and it was right while the cover was a gradient with one word
on it. It is wrong now: the covers are compositions with their own labels in
them — "Audience / who", "Voice / how" — and the headline landed across the
middle of them. A scrim dims a collision; it does not undo one.

So the lead is a bigger version of the cards below it: the whole cover at
16:9, the words beneath on the card. It still reads as the lead because it is
twice the size of anything else on the page. `align-self: start` keeps the
outer grid from stretching it to the height of the "latest" list beside it,
which would make the picture taller than 16:9 and crop it again.

Three things that looked simpler on the way there and were not, each found by
measuring rather than by looking:

- **`aspect-ratio` plus `min-block-size: 260px`** on the card, to keep a floor
  for the overlaid words. A ratio works in both directions: with the height
  pinned the card resolved its *width* from it, 462px, and every viewport
  under 500px scrolled sideways. A floor on a ratio box is a width in
  disguise.
- **Putting the ratio on the art and letting it be a grid item.** The card is
  itself a grid item, and a grid item's automatic minimum size is its
  min-content width. With content in flow it had one — 602px — and the page
  scrolled sideways below 640. `min-inline-size: 0`, the same line
  `.mk-post-card` already carries.
- **Leaving the art absolutely positioned and the words in flow.** A
  positioned box paints after an in-flow one whatever the source order says,
  so the headline and the pill went *under* the photograph: full opacity,
  correct position, invisible. `document.elementFromPoint` over the headline
  returned the `<img>`.

### The dot came off the category pill

`.mk-cat-dot` was a 6px disc in front of the label. It read as a bullet in a
one-item list, and the pill is already an object. Removed, with the 7px gap
that held it off the word. `.mk-cat-pill-over` — the white-on-dark variant
for a pill sitting on a cover — went with it, since no pill sits on a cover
any more.

## The English homepage, on copy v3 (8 Nov 2026)

`Landing Copy/markyos_landing_page_copy.md` arrived: **Site Copy v3, the full
site in English**, the English counterpart to the Arabic v3 file that landed
on 5 Nov. The homepage was already cut to v3's ten sections; what was still
v2.2 was the writing inside them, in both editions. This pass puts the
English on v3.

### Why this could be done without touching the Arabic

`content/ar/overrides.ts` overrides **every** leaf of `content/en/index.ts` —
204 of 204, checked by walking both objects rather than by reading them. So
the English dictionary could be rewritten freely: nothing on the Arabic page
inherits an English string.

That holds only for *values*. A new **key** is inherited, so any key v3 adds
appears on the Arabic page in English until the Arabic overrides it too.
Four keys were added, and each one got its Arabic in the same commit, taken
from the Arabic v3 file's own wording for the same element:

| Key | English | Arabic | Deck |
| :--- | :--- | :--- | :--- |
| `ecosystem.link` | All features | كل المزايا | §2.4 |
| `replaceStack.link` | The full comparison | المقارنة كاملة | §2.6 |
| `pricingTeaser.body` | A full project free for studios… | مشروع كامل مجاناً للاستوديوهات… | §2.9 |
| `faq.link` | All questions | كل الأسئلة | §2.9 |

All four are optional on the type, so a section that has not been given one
renders exactly as it did.

### What the words changed to

Section by section, against the deck: the hero's microcopy (§2.1), the
problem's body and all three cards (§2.3), the idea's body and its three
stages — Create · Deliver · Run, which were Create · Hand over · Manage
(§2.4), the three audience lines (§2.5), Brand Brain's body and its link
(§2.7), the bilingual body (§2.8), the pricing body (§2.9), and the close
(§2.10). The page title, description and share title are §2.11; the footer
line is §1.4.

Two changes worth naming:

**The FAQ went from twelve questions to three.** v3 folds the FAQ into the
pricing section and sends the rest to `/pricing#faq`, where Part D, Page 1
of the deck answers fourteen. The nine that left the homepage are not lost
copy — they are on the pricing page in the deck. Without the "All questions"
link they would have had no route at all, which is why that link is part of
the same change.

**"the brand brain" became "Brand Brain".** It is a product name in v3 and
the deck capitalises it throughout. Renamed in the English dictionary only —
the section eyebrow, the body, the CTA, the Platform menu strip and the
footer.

### The close went back to a line this file argued against

`finalCta.headline` is "Built. Shared. Alive." again. It was replaced once,
with the reasoning recorded above `finalCta` in `content/en/index.ts`: three
passive verbs addressing nobody, in the last place a visitor reads. v3 puts
it back, the Arabic closes on the same three words («تُبنى. تُشارك. تحيا.»),
and the two editions ending on the same beat is worth more than the earlier
argument.

It disagrees with `MARKYOS-DESIGN-SYSTEM.md` §11, which lists "Build the
brand. Hand it over. Keep it alive." among the lines to use verbatim. The
deck is dated 8 Nov 2026 and the design system 20 Oct: **§11 is the file
that is now out of date.** The older line is not retired — the deck keeps it
for the studios page.

### The headline was an Arabic size, and that was the collision

The hero H1 was one value for both scripts, `clamp(38px, 6vw, 76px)`. 76px
is an Arabic size. Copy deck v3 Part A §3 sets the Latin display at "about
62px" and allows the Arabic to be "the same size or one step larger", which
is the usual relationship: Thmanya carries more ink per em than Inter, and
an Arabic line of the same measure is shorter.

Measured, at 76px: "Companies live it." is 630px wide, «والشركة تحييها.» is
490px. The element chips beside the headline sit at `25vw` from the centre,
so the English line ran straight through them from 1440px down — by 55px at
1280 — while the Arabic never touched them. So this was not only a
type-scale error; it was the overlap.

`--mk-fs-hero` is now a token, set per `lang`:

```css
:root            { --mk-fs-hero: clamp(38px, 6vw, 76px); }
html[lang="en"]  { --mk-fs-hero: clamp(36px, 5.2vw, 62px); }
```

### A floor on the chip columns, because the subheadline has one

`--mk-side-x` was `clamp(296px, 25vw, 396px)`. 25vw shrinks the columns
faster than the text between them shrinks — the subheadline stops narrowing
at its measure — so below about 1250px the columns walked into it. That is
the second overlap the sweep found: «الاستراتيجية» on the Arabic sub at 1280
and 1200, which is an **Arabic** fault and had nothing to do with English.

Two floors, because one cannot be right at both ends: 350px above 1024px,
where the subheadline is at its full measure, and 316px below it, because at
820px — the last width before the scene switches off — a 350px column would
put the widest chip past the viewport edge.

Measured after, worst clearance across 1600 → 820px, both editions: **19px**,
where it had been −55px.

### Three new links, and the inline-flex bidi trap again

All three "→" links failed `check:bidi` on the Arabic page: a `<p>` holding
only a `TextLink` laid out left-to-right. `TextLink` is `display:
inline-flex`, and an inline-flex box is **atomic** to the bidi algorithm —
the parent sees one object replacement character and no text, so `plaintext`
has nothing to resolve from and falls back to LTR forever. Adding `.mk-bidi`
to the paragraph does not help, for the same reason.

`.mk-atomic` is the repo's answer and was already in `globals.css` with the
explanation. Wrapping the link in `<span className="mk-atomic">` makes the
paragraph use `unicode-bidi: isolate` and take the page's direction. This is
the second time this trap has cost a build; it is worth reading the comment
above `.mk-atomic` before adding any link into an otherwise empty block.

### Two things left alone, on purpose

**The hero's product mock stays Arabic on the English page.** The deck's §3
English notes say the window shows "the demo brand's published hub, in
English". `components/mock/BrandHub.tsx` argues the opposite at length: the
hub belongs to a fictional Gulf client, and what it shows an English-reading
studio owner is "this is what your client's brand hub looks like, and it is
not an afterthought". The deck's own §2.1 note agrees with the component —
"Card 1 keeps the Arabic logo file on the English site on purpose" — so the
two halves of the deck disagree with each other. Left as built, flagged.

**The hub mock squeezes at 480px and below.** Its grid is a 144px sidebar
plus a panel, about 391px at its narrowest, inside a window that is 342px
wide at a 390px viewport. The swatch captions end up in 44px columns four
lines deep. It is clipped rather than overlapping — `overflow: clip` on the
window hides it — and it is identical in both editions, so it is not part of
this change. The deck's §3 asks for a different phone treatment anyway
("under 810px … the scroll story becomes swipeable tabs"), which is the real
fix and a piece of work of its own.

## The English edition became a site (8 Nov 2026)

Before this, `/en` was one page. Every other English route — twenty-five of
them — served a `noindex` notice with a link to the Arabic page, because
`lib/pages/registry.ts` held the fact "only Arabic is written" as a
constant:

```ts
export function hasEdition(locale: Locale): boolean {
  return locale === DEFAULT_LOCALE;
}
```

Measured rather than assumed: crawling all 69 English routes, every
sub-page returned exactly **556 words of Latin text** — the header, the
footer and the notice, and nothing else. That number is what made it
obvious they were all the same stub.

### The registry answers per path now

Arabic still owns the path list: an English page at a path the Arabic set
does not have is a build error, because it would have no canonical, no
breadcrumb parent and no pair. What changed is that `localesFor(path)`
walks both sets and answers for that page, so the sitemap, the hreflang
block and the notice all follow from one lookup. A path with one edition
declares one locale; a path with two declares two, and the pair appears
everywhere at once.

`content/pages/en/` holds the twenty-five pages, from Site Copy v3's
English file. They are shorter than their Arabic counterparts in places and
differently shaped in others, because the Arabic set is still on the v2
documents. That is the deck's own instruction — "the English is written for
English readers, not translated line by line" — not drift.

Where v3 links to `/platform/<feature>`, a fifteen-page architecture this
site does not have, the link goes to the page that covers the same ground
under /solutions. A link to a page that would 404 is worse than a link to
the page that answers the question.

### Every English article was `noindex`, with ten of them published

`app/[lang]/blog/[slug]/page.tsx` and its two siblings asked the *page*
registry which locales existed:

```ts
available: localesFor(),          // "Arabic only"
noindex: post.provisional || !translated,
```

The page registry knows about hand-written pages and nothing about
articles. So every English blog post and guide — all twenty, written in
English, published — declared no English edition and was served
`noindex`. /compare and /whats-new were built later and already asked the
CMS through `articleLocales`; the three older routes do now too.

### Two product mocks were pinned to Arabic

The hub in the hero and the guidelines builder beside it were Arabic in
both editions, each with a comment arguing for it: the hub belongs to a
fictional Gulf client, and showing it in Arabic told an English reader
"this is not an afterthought". Copy v3 Part A §3 says the English window
shows the hub in English, and in the hero — the first picture of the
product anyone sees — a screen the reader cannot read makes its point at
the cost of the point.

Both read `content/mocks.ts` now, like the other five. Same brand either
way: Nakhla is a coffee roaster in both editions, and only the script
changes, which is the product's own claim demonstrated rather than stated.

A third leak was not a mock at all. `Problem.tsx` had three chat rows
hard-coded in Arabic — two questions, three initials and three relative
times — so the English homepage showed an Arabic conversation under an
English heading. The look stayed in the component and the words moved to
the dictionary.

The bilingual section keeps both languages, because showing them together
is the section. What changed is which one it opens on: the page's own,
rather than Arabic in both editions. The mirror is one tap away and it is
the same hub, which makes the point by invitation instead of by
confrontation.

### Seven CTAs on /en went to the Arabic site

`TextLink` and `Cta` in `components/sections/landing.tsx` rendered
`href={href}` directly. Every other link primitive on the site goes through
`localeHref`; these two did not, and nobody noticed because every button on
the homepage points at `/start`, which is an app handoff and exempt. The
moment copy v3 added "All features", "The full comparison" and "All
questions", seven links on the English homepage pointed at Arabic pages.

Both now take `locale` as a **required** prop. Required, not optional: that
turns a wrong-locale link from something a reviewer has to catch into a
type error, and TypeScript named all fourteen call sites in one pass.

### Seventeen links in the articles went nowhere

Crawling every internal href on all 143 routes found five distinct targets
that 404'd, in both editions — `/platform/brief-analysis`,
`/guides/brand-handoff-checklist` and three more. They came in with the
written resources, whose `[Link: …]` markers point at the deck's planned
architecture.

`scripts/fix-article-links.ts` repoints them in the CMS, matching on the
path with the locale prefix removed — the English sources write
`/en/platform/…` where the Arabic ones write `/platform/…`, so one table
covers both. It is idempotent, and it ran twice for that reason: the first
pass matched only the Arabic bodies, which is how the prefix difference
surfaced.

### What the crawl says now

- **0** links pointing at the other edition, across 143 pages.
- **159** distinct internal targets, every one resolving.
- **923** links and buttons across eight pages, every one with an
  accessible name. The icon-only ones — the share rail, the phone menu —
  get theirs from the `Icon` child's `aria-label`, which is why a naive
  check calls them empty and a correct one does not.

## "Brands don't die. They drift." — the three cards (8 Nov 2026)

Reported as overlapping, and it was, in three separate ways. All three come
from one root cause.

### `line` is what the picture says, not what the card says

Each of the three cards is a headline over a drawing, and `cards[].line` is
the single string *inside* that drawing: the title on the sales slide, the
marketing line in the locale row, the first question in the queue. The
Arabic has always read that way — «عرض المبيعات · الشريحة 4» is a slide
title, not a sentence.

Copy v3 §2.3 writes the English three as prose, because a copy deck
describes a card rather than filling in a mock. Rendered, that put:

| Card | What went in | What it did |
| :--- | :--- | :--- |
| 1 | "The guide is sent once, then forgotten." | a sentence where a slide title goes |
| 2 | "Two writers, two dates, two words for the same thing." | prose in a row labelled `ar-SA`, next to an English line it did not disagree with |
| 3 | "The marketing manager becomes the brand's help desk, and the bottleneck." | a three-line paragraph in a chat bubble, pushing the third message out of the frame |

The English three now match the Arabic: the same slots, filled the same
way. The deck's sentences are not lost — each says what its headline
already says, which is why the headline is the part the reader sees.

### The second card was rendering English inside an Arabic row

`DriftingLocales` hard-coded `dir="rtl" lang="ar"` on its first row, in
both editions, because the row was always Arabic. With an English line in
it the full stop jumped to the front — `.for the same thing` — the `ar-SA`
chip was squeezed onto two lines, and the text ran over it.

Each row takes its own language now: the page's own first, the other one
under it. The pair is the whole point of the picture, so it is always one
of each — **40%** in the reader's language against **30%** in the other.
Two numbers that disagree is the argument; two sentences that agree is not.

### The frames clipped whatever did not fit

`PainCard`'s art frame was a fixed `blockSize: 200` with `overflow: clip`,
so a picture taller than 200 was simply cut. Measured across five widths in
both editions:

- The **sales slide** is `74%` of the frame's *width*, which through its
  16:10 ratio is a height too. At 1024 the grid goes single-column, the
  frame becomes 458px wide, and the slide wanted 212px in a 200px box — 24
  pixels gone off the top and bottom. A `max-block-size` lets the ratio
  shrink the width instead.
- The **question queue** in English wanted 203px. The frame is `flex: 1`
  inside a flex-column figure now, with `min-block-size: 200`, so it takes
  the height the grid gives the card and the three cards in a row stay
  level.
- The rows and bubbles were fixed-height too. `min-block-size`, because the
  line inside is real copy and its length is not the component's to decide.

### Measuring this needed the animation to settle

`.mk-pain-art` drifts on a `view()` timeline, and `backwards` fill means a
card that has not been scrolled past is still holding its start transform —
1.25rem on two of them, −0.6rem on the third. A probe that scrolls to the
bottom and back reads those offsets as overflow, which is how the first
pass found "overflow" on cards that were fine and missed the width where
one really was clipped.

Each card has its own timeline, so when they stack at narrow widths they
settle one at a time. The measurement centres each card in turn and waits.
With that, every frame fits its content at 1440, 1100, 1024, 820 and 390,
in both editions.

### The station dial had the same fault, one section up

Reported after the cards were fixed, and it is the clearer example of the
same mistake: a layout number tuned against one language.

The dial lights one stop at a time and puts that stop's copy beside the
word, absolutely positioned at `inset-inline-start: 40%`. The comment above
it said exactly what the 40% was for — «الكتابة اليومية» is the widest
Arabic stop and runs about 310px at the top of the clamp, so 40% clears it.

"Everyday writing" is **448px** at the same size. Measured at eight widths:
the English lit word ran under its own copy at every one of them, from
768px up, by 52px at 1600. The Arabic cleared by 57 to 104px, which is why
nothing looked wrong until the English pages existed.

A percentage cannot know how long a word is, so the distance is a
measurement now. `StationDial` measures the widest term and hands it over
as `--mk-dial-word`; the stylesheet keeps the tuned percentage as a floor:

```css
--mk-dial-x: max(40%, calc(var(--mk-dial-word, 0px) + var(--mk-dial-gap)));
```

The Arabic layout does not move — 40% still wins there, and its numbers are
identical before and after — and the panel is pushed out only where the
words need it. English clears by 32 to 65px across the same eight widths.

It is re-measured on resize, because the type is a `clamp()` on the
viewport, and again on `document.fonts.ready`, because the first
measurement is of the fallback face and Thmanya and Inter do not set the
same words to the same width.

### What these two have in common

Three numbers in this section were chosen by looking at the Arabic page:
the dial's 40%, the card frame's 200px, and the locale row's 46px. Each one
was correct for the words it was tuned against and silently wrong for any
others. The pattern is worth naming, because the site will keep gaining
languages and copy revisions:

> A length that depends on how long a word is cannot be a constant. Either
> measure the word, or let the box grow.
