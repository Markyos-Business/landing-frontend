# Running this repo in a cloud session

Work queued up for Claude Code cloud sessions, with the prompts written out so
they can be pasted without editing.

## Start one

1. Go to **claude.ai/code** and pick the repository
   `Markyos-Business/landing-frontend`.
2. Paste one task from below.
3. It opens a pull request when it finishes. Merge it on GitHub.

One task per session. They all touch `package.json`, so two at once will
conflict.

## What a cloud session can and cannot verify

A cloud session gets this repo and nothing else. That matters in two places,
and both are now handled rather than hidden:

- **The browser checks work.** `npm run check:live` renders 70 pages at three
  viewports, verifies no Arabic is laid out left-to-right, and drives every
  dropdown with a mouse. Playwright is a dev dependency and
  `scripts/browser-lib.mjs` falls back to bundled Chromium, so this runs on a
  bare runner. It is also enforced by `.github/workflows/checks.yml` on every
  pull request, so a cloud session cannot merge past it.
- **Token drift is not checked.** `npm run check:tokens` compares
  `src/app/tokens.generated.css` against the platform app, which lives in a
  separate repo that is not checked out in a cloud session. It prints a
  warning and passes. That is expected. CI emits a notice saying so. If a task
  touches design tokens, verify it on a machine that has both repos.

Tell a cloud session not to "fix" that warning. There is nothing to fix, and a
stub stylesheet written to silence it would make the check lie.

---

## Task 1 — retire the sections the v2 homepage left behind

> The v2 homepage rewrite left seven section components rendering nowhere:
> `Bilingual`, `ComingNext`, `HandoffLoop`, `Problem`, `Statement`,
> `StudioPath` and `ToneChecker`, all in `src/components/public/home/`. Confirm that
> list yourself rather than trusting it — grep for each name across `app/`,
> `components/` and `lib/` and report anything that is actually still
> referenced.
>
> For each genuinely orphaned one, decide between deleting it and re-homing it
> on a page where it still earns its place, and say why for each. Read
> `docs/copy/` and the section's own comments first: some of these carry
> approved copy lines from `MARKYOS-DESIGN-SYSTEM.md` §11 that should survive
> even if the component does not.
>
> Deleting a section removes its copy from `content/`, which moves the
> denominator in `npm run check:locales` — currently 134/134. Report the
> before and after numbers and confirm the percentage is still 100%.
>
> Read `CLAUDE.md`, `AGENTS.md` and `MARKYOS-DESIGN-SYSTEM.md` first; they are
> binding. Never edit `tailwind/tokens.generated.js`. `npm run check`, `npm run
> build` and `npm run check:live` must all pass — start the server with
> `npx next start -p 3210 &` before the last one. Open a pull request.

## Task 2 — the navigation is carrying too much

> The header mega menu holds 18 destinations with two-line descriptions, which
> is more than a visitor can scan. Audit it: read `src/components/navbar/nav/`
> and the `nav` section of `content/en/index.ts`, list every destination, and
> work out which are genuinely top-level, which belong one level down, and
> which are duplicates of each other.
>
> Produce the restructure as a written proposal in `docs/` **and** implement
> the content side in `content/` — but change `Nav.tsx` only where the
> structure requires it. Keep the W3C APG disclosure pattern and the hover
> timings exactly as they are; they were built to fix a real bug and
> `npm run check:nav` guards them.
>
> Arabic is transcreated, never translated. Any Arabic you add must be flagged
> in your report for human review rather than presented as final.
>
> Read `CLAUDE.md`, `AGENTS.md` and `MARKYOS-DESIGN-SYSTEM.md` first. `npm run
> check`, `npm run build` and `npm run check:live` must pass — start the
> server with `npx next start -p 3210 &` first. Open a pull request.

## Task 3 — line endings

> This repo has no `.gitattributes`, and about 120 files produced CRLF
> warnings when they were first committed from Windows. Add one with
> `* text=auto eol=lf`, plus explicit `binary` for the fonts in `src/app/fonts/`
> and the images under `public/` and `UI-UX Design Reference/`.
>
> Then renormalise the tree in its own commit (`git add --renormalize .`) so
> the change lands once instead of polluting every future diff. Keep the
> `.gitattributes` commit and the renormalise commit separate.
>
> `npm run check` and `npm run build` must still pass afterwards. Open a pull
> request, and say in it how many files the renormalise touched.

---

## One decision still open

`components/sections/AiAlongside.tsx` sets `weight: 700` on Direction C in the
exploration mock. §7 of the design system says 500 is the heaviest weight
anywhere on the site, mocks included, so by the letter this is a breach.

It is arguably the same carve-out the hex palettes beside it already have — a
customer's brand shown as content, and the direction being explored is
literally "Bold". `npm run check:design` does not catch it, because the weight
arrives through a variable.

Two ways to settle it: drop C to 500, which keeps its distinction through
palette and tracking; or extend the content carve-out to cover weight and add
it to the exemption table in `scripts/check-design-rules.mjs`. It is a design
call, not a lint one, so it is recorded here rather than decided.
