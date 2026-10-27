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
