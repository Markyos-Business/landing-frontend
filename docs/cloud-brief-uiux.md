Audit and fix the landing page's interface, experience and brand fidelity.

## Read first, these are binding

`CLAUDE.md`, `AGENTS.md`, `MARKYOS-DESIGN-SYSTEM.md`, `docs/DESIGN.md`,
`docs/CLOUD-TASKS.md`. `MARKYOS-DESIGN-SYSTEM.md` is the specification, not
advice: it fixes every colour, weight, size, radius, border, light treatment
and icon on this site, and §0 says it overrides any comment in the code that
disagrees with it. Where you think the design system is wrong, say so in your
report — do not quietly deviate.

The product is Arabic-first. `/` is Arabic and unprefixed; `/en` is English.
Arabic is transcreated, never translated. Judge every screen in Arabic first.

## Work in three passes, committing each separately

### Pass 1 — audit, change nothing

Walk every section of the homepage and every page template. For each, record
in `docs/UIUX-AUDIT.md`: what it is for, what a visitor is meant to do next,
and every defect you find, each tagged with the §ref it breaks or the
usability principle it violates. Cover:

- **Brand fidelity.** Colour, type scale, weight, radius, border, spacing,
  light treatment and icon system against §1–§10. The repo has a gate for the
  mechanical rules — `npm run check:design` — so spend your attention on what
  a grep cannot see: light used as a fill rather than as light, more than one
  light source in a composition, radii that do not encode size, surfaces at
  the wrong level in the hierarchy, Arabic set smaller than the Latin beside
  it, tracking left on Arabic.
- **Visual hierarchy.** Does each section have one clear focal point? Is the
  eye led to the action, or does the action lose to decoration? Are the three
  text opacities (100/80/60) carrying the hierarchy they are meant to?
- **Interaction cost.** Hick's and Fitts's laws on the navigation and the
  CTAs — the mega menu currently holds 18 destinations, which is a known
  problem. Target sizes on coarse pointers. Anything that takes more
  decisions than it deserves.
- **Scanning and flow.** Section order and rhythm down the page. In Arabic
  the scan is right-to-left, so check that the composition actually mirrors
  rather than merely reversing text inside a Latin layout.
- **Copy.** Against §11: sentence case, no exclamation marks, no hype words,
  one idea per sentence, buttons one to three words verb-first, dates and
  currency in the stated formats. Flag anything that reads as translated
  rather than transcreated.
- **Accessibility.** Contrast against the 7:1 small-type floor the theme
  claims, focus order, focus visibility, accessible names, heading structure,
  and whether anything conveys meaning by colour alone.

Rank every finding: **breaks a rule** (cite the §), **hurts the experience**
(cite the principle), or **taste**. Be honest about which is which — a
preference presented as a violation wastes the reviewer's time.

### Pass 2 — fix the first two ranks

Fix everything ranked "breaks a rule" or "hurts the experience". Leave the
"taste" findings in the audit as proposals; do not act on them.

Commit in small, themed commits — one per section or per class of defect —
so each can be reviewed or reverted alone. A single commit containing the
whole pass is a failed deliverable.

### Pass 3 — prove it

`npm run check`, `npm run build`, and `npm run check:live` must all pass.
For the last one, start the server first:

    npm run build && npx next start -p 3210 &

`check:live` renders 70 pages at three viewports, verifies no Arabic is laid
out left-to-right, and drives every dropdown with a mouse. It works in a cloud
session: Playwright is a dev dependency and the launcher falls back to bundled
Chromium.

Then look at what you changed. Screenshot `/` and `/en` at 375px and 1440px,
before and after, and put them in your report. A check passing is not evidence
that a layout improved.

## Do not

- Edit `app/tokens.generated.css`. It is generated from the platform app.
- Rewrite the approved copy lines in §11. They are fixed, in both languages.
- Change the navigation's disclosure pattern or hover timings. They fix a real
  bug and `npm run check:nav` guards them. Restructuring *what is in* the menu
  is in scope; changing *how it opens* is not.
- Use physical properties, weights above 500, type below 12px, drop shadows on
  cards, hover lifts, entrance animations, emoji, or hand-drawn SVG icons.
- Add imagery. This site has none by design; its visuals are built from tokens.
- Invent Arabic. Any Arabic string you add must be flagged in your report for
  human review, not presented as final.
- Silence `npm run check:tokens`. In a cloud session it reports that the
  platform stylesheet is missing and skips. That is correct and expected.

## Deliver

A pull request containing `docs/UIUX-AUDIT.md` and the Pass 2 commits. In the
description: the count of findings by rank, what you fixed, what you left and
why, every Arabic string needing review, and anything you believe the design
system itself gets wrong.

If the audit turns out larger than one pull request can carry responsibly, fix
the rule-breaks, open that PR, and list the rest in the audit as a queue.
Shipping half the work and saying so is better than an unreviewable diff.
