import React from "react";

/*
 * Styles for the dashboard.
 *
 * Inline rather than a stylesheet import, because this component is resolved
 * through Payload's import map and a sibling `.css` file would need the SCSS
 * pipeline wired to reach it. One `<style>` tag in one view is a smaller
 * dependency than that.
 *
 * ── Which tokens, and why they changed ────────────────────────────────────
 *
 * Every value here was a Payload theme variable — `--theme-elevation-50` for
 * a card, `--theme-success-500` for the blue. That was right while the admin
 * borrowed Payload's palette, and it is one level of indirection too many
 * now that `app/(payload)/custom.css` points those variables at
 * `app/theme.css` anyway. The dashboard is a Markyos screen, not a Payload
 * one, so it reads the site's own tokens directly: `--surface-0`,
 * `--text-muted`, `--lift-card`, `--radius-card`. Nothing in here resolves
 * through a CMS vocabulary to arrive at a brand value.
 *
 * The art direction is the website's, in one line: paper ground, white cards
 * lifted on a long soft shadow, one ink at four steps, and blue used as light
 * rather than as a fill — the pool behind the figures the screen is about,
 * the wash under a ranked bar, the sparkline. Nothing is coloured in it.
 *
 * ── Two standing rules this file keeps ────────────────────────────────────
 *
 * Nothing moves on hover or press. A hover changes a fill or an ink and that
 * is all: no lift, no nudge, no scale.
 *
 * Logical properties throughout — the admin runs in Arabic, and Payload
 * mirrors the whole panel when it does.
 *
 * The class prefix is `mkd-`, not the site's `mk-`. `.mk-card` and `.mk-note`
 * already mean something specific in `app/globals.css`; the admin is a
 * separate root layout so they never meet at runtime, but two different
 * definitions of `.mk-card` in one repository is a trap to walk into later.
 */

export function DashboardStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
.mkd {
  max-inline-size: 1180px;
  margin-inline: auto;
  padding-block: calc(var(--base) * 1.2) calc(var(--base) * 2.5);
  padding-inline: var(--base);
}

/* ── Masthead ─────────────────────────────────────────────────────────── */

.mkd-head { margin-block-end: calc(var(--base) * 1.6); }

.mkd-eyebrow {
  display: block;
  font-size: var(--mkd-fs-meta);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-block-end: 10px;
}

.mkd-title {
  margin: 0;
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text);
}

/*
 * The one blue clause.
 *
 * The site's headlines end in the brand blue, and this is the admin's one
 * headline. --mk-blue-ink rather than --accent-edge: #0099FF is 2.8:1 on
 * this ground and is defined as light, never as ink — the same reason
 * theme.css carries a separate ink blue at all.
 */
.mkd-title-accent { color: var(--mk-blue-ink); }

.mkd-lead {
  margin: 9px 0 0;
  max-inline-size: 70ch;
  font-size: var(--mkd-fs-ui);
  line-height: 1.6;
  color: var(--text-muted);
}

/* ── Cards ────────────────────────────────────────────────────────────── */

.mkd-card {
  position: relative;
  background: var(--surface-0);
  border-radius: var(--radius-card);
  box-shadow: var(--lift-card);
  padding: calc(var(--base) * 1.1);
  margin-block-end: var(--base);
}

.mkd-card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-block-end: 16px;
}

/*
 * A bare section: a heading on the paper, then cards on the paper.
 *
 * The tiles used to sit inside a card of their own, which on a dark panel
 * drew a container around them and on this one draws nothing — a white tile
 * on a white card is a hairline and an empty frame. The landing page never
 * nests a surface inside a surface for grouping; it puts a heading above the
 * ground and lets the cards do the grouping by being cards. Same here.
 */
.mkd-section { margin-block-end: calc(var(--base) * 1.4); }

.mkd-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-block-end: 14px;
  padding-inline: 4px;
}

/* A heading's companion line is a caption, not a column: capped so it wraps
   beside the heading instead of running to the far edge of the screen. */
.mkd-section-head .mkd-meta { max-inline-size: 46ch; line-height: 1.6; }

.mkd-h2 {
  margin: 0;
  font-size: var(--mkd-fs-h2);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--text);
}

.mkd-meta  { font-size: var(--mkd-fs-meta); color: var(--text-faint); }
.mkd-note  { margin: 0 0 16px; max-inline-size: 60ch; font-size: var(--mkd-fs-meta); line-height: 1.6; color: var(--text-muted); }
.mkd-empty { margin: 0; max-inline-size: 60ch; font-size: var(--mkd-fs-ui); line-height: 1.6; color: var(--text-muted); }

/* ── Section tiles: what is published, what is waiting ────────────────── */

/*
 * auto-fit, not auto-fill.
 *
 * With auto-fill the grid keeps the empty tracks it had room for and each
 * one still takes its 1fr, so four sections in a container wide enough for
 * five left a quarter of the card blank and the tiles stopped short of their
 * own edge. auto-fit collapses the empty track and the four share the row.
 */
.mkd-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(208px, 1fr));
  gap: 14px;
}

.mkd-tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  block-size: 100%;
  padding: 18px 20px;
  border-radius: var(--radius-widget);
  background: var(--surface-0);
  /* A card on the ground, lifted the way the site lifts one. The ring alone
     was right when these sat inside a card; on the paper they need the
     shadow, which is the whole of the elevation signal on a light page. */
  box-shadow: var(--lift-card);
  text-decoration: none;
  color: inherit;
  transition: background-color var(--mkd-dur) var(--mkd-ease), box-shadow var(--mkd-dur) var(--mkd-ease);
}

/*
 * The type scale, in pixels, and why it is not in rem.
 *
 * Payload sets html { font-size: 13px } — 12px under its small breakpoint —
 * so a rem here is not the rem app/theme.css is written against. Reading
 * --fs-eyebrow (0.8125rem) through this root produced **10.56px**, under the
 * 12px floor §1.6 sets, and every size on the screen landed 19% small.
 *
 * Nothing is lost by stating them: the panel's root is a hard-coded pixel
 * value, so rem in the admin already does not follow a reader's browser font
 * size the way it does on the site. These are the site's own sizes — 13 meta,
 * 15 UI, 22 card heading — at the size the design draws them.
 */
.mkd {
  --mkd-fs-meta: 13px;
  --mkd-fs-ui: 15px;
  --mkd-fs-h2: 22px;
  --mkd-dur: 120ms;
  --mkd-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

/* A fill change and nothing else — the card does not move under the cursor. */
a.mkd-tile:hover,
a.mkd-tile:focus-visible { background: var(--surface-2); }

.mkd-tile-name {
  font-size: var(--mkd-fs-ui);
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
}
.mkd-tile-name:hover { text-decoration: underline; text-underline-offset: 0.2em; }

.mkd-tile-value {
  font-size: 32px;
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}

.mkd-tile-sub { font-size: var(--mkd-fs-meta); color: var(--text-faint); }

/* ── The language split inside a resource card ────────────────────────── */

/*
 * A row per configured locale. The widths are fixed so the three columns line
 * up down the card and between cards: a ragged set of bars is unreadable as a
 * comparison, which is the only thing these are for.
 */
.mkd-locales {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-block-start: 14px;
}

.mkd-locale {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-block: 2px;
  font-size: var(--mkd-fs-meta);
  color: var(--text-muted);
  text-decoration: none;
}
.mkd-locale:hover .mkd-locale-name,
.mkd-locale:focus-visible .mkd-locale-name {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.mkd-locale-name {
  flex: none;
  min-inline-size: 60px;
  color: var(--text-secondary);
}

.mkd-locale-track {
  flex: 1;
  min-inline-size: 0;
  block-size: 6px;
  border-radius: var(--radius-pill);
  background: var(--track);
  overflow: hidden;
}

/*
 * Blue as a fill, which is the one place §1.4 allows it: a progress or data
 * bar is light measuring something, not a colour applied to a surface.
 */
.mkd-locale-fill {
  display: block;
  block-size: 100%;
  border-radius: var(--radius-pill);
  background: var(--accent-edge);
}

.mkd-locale-count {
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--text-faint);
}

/* Written in every document there is. Stated in the ink rather than with a
   tick, so the row still reads in one pass down the column. */
.mkd-locale-count-done { color: var(--text-secondary); }

/* Resource cards carry three columns of language row, so they need more room
   than a plain link tile. */
.mkd-tiles-wide { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }

/*
 * The tile's floor: what is waiting, and the way to add more.
 *
 * margin-block-start: auto pins it to the bottom of whichever tile is
 * tallest, so a row of tiles shares one baseline however long their labels
 * run — the same anatomy the website's bento cells use.
 */
.mkd-tile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-block-start: auto;
  padding-block-start: 14px;
  border-block-start: 1px solid var(--hairline);
  font-size: var(--mkd-fs-meta);
}

/* Amber, because a draft is waiting rather than wrong (§3 state hues). */
.mkd-drafts {
  font-weight: 500;
  color: var(--mk-state-expiring);
  text-decoration: none;
}
.mkd-drafts:hover { text-decoration: underline; text-underline-offset: 0.2em; }

.mkd-clear { color: var(--text-faint); }

.mkd-new {
  flex: none;
  padding: 4px 11px;
  border-radius: var(--radius-pill);
  background: var(--surface-2);
  color: var(--text-muted);
  text-decoration: none;
  transition: background-color var(--mkd-dur) var(--mkd-ease), color var(--mkd-dur) var(--mkd-ease);
}
.mkd-new:hover,
.mkd-new:focus-visible { background: var(--solid); color: var(--solid-ink); }

/* ── Traffic ──────────────────────────────────────────────────────────── */

/*
 * The one light pool on the screen.
 *
 * §8: one light source per composition, behind the single object the section
 * is about. On this screen that is the traffic figures, so the pool sits
 * behind them and the sparkline — not behind the cards, not behind the type.
 * z-index: -1 with the card's own stacking context keeps it under the
 * content and inside the card's radius.
 */
.mkd-traffic { isolation: isolate; overflow: hidden; }

.mkd-traffic::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset-block-start: -40%;
  inset-inline-start: -4%;
  inline-size: min(544px, 70%);
  aspect-ratio: 1;
  background: radial-gradient(closest-side, var(--glow), transparent 70%);
  pointer-events: none;
}

.mkd-figures {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-block-end: 24px;
}

.mkd-figure-value {
  display: block;
  font-size: clamp(32px, 3.4vw, 44px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}

.mkd-figure-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-block-start: 7px;
  font-size: var(--mkd-fs-meta);
  color: var(--text-faint);
}

/*
 * The change, as a chip.
 *
 * Green and red carry the meaning, so the sign is always printed too — the
 * colours alone would say nothing to a red-green colourblind reader.
 */
.mkd-delta {
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.mkd-delta--up   { color: var(--mk-state-approved); background: color-mix(in srgb, var(--mk-state-approved) 10%, transparent); }
.mkd-delta--down { color: var(--mk-state-rejected); background: color-mix(in srgb, var(--mk-state-rejected) 10%, transparent); }
.mkd-delta--flat { color: var(--text-faint); background: var(--surface-2); }

.mkd-spark {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  block-size: 96px;
  inline-size: 100%;
  border-block-end: 1px solid var(--hairline-strong);
}

.mkd-spark-col {
  flex: 1;
  min-block-size: 2px;
  border-start-start-radius: 3px;
  border-start-end-radius: 3px;
  /* Blue because it is light, not because the number is good: a view count
     has no sentiment, and the old green claimed one. */
  background: linear-gradient(to top, var(--accent), var(--accent-edge));
}

.mkd-spark-axis {
  display: flex;
  justify-content: space-between;
  margin-block-start: 9px;
  font-size: var(--mkd-fs-meta);
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

/* ── Ranked bars ──────────────────────────────────────────────────────── */

.mkd-bars {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mkd-bars li {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 11px;
  border-radius: 10px;
  overflow: hidden;
  font-size: var(--mkd-fs-meta);
}

.mkd-bar {
  position: absolute;
  inset-block: 0;
  /* The inline-start form, not the physical one: the bar grows from the
     reading edge, which changes sides when the admin runs in Arabic. */
  inset-inline-start: 0;
  border-radius: 10px;
  background: var(--accent-soft);
}

.mkd-bar-label {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-secondary);
}

.mkd-bar-value {
  position: relative;
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

/* ── Column sets ──────────────────────────────────────────────────────── */

/*
 * Two deliberate shapes instead of one auto-fit that produced whatever it
 * produced. The five breakdowns used to flow through a single track list, so
 * three landed on the first row and two sat on a second with a third of the
 * width empty beside them. They are not five of a kind: the two long lists
 * want room, the three short ones do not.
 */
.mkd-pair,
.mkd-trio {
  display: grid;
  gap: var(--base);
  margin-block-end: var(--base);
  /* Each card is as tall as its own list. Stretching them to match left the
     shorter one — one referrer against eight pages — as a mostly empty
     panel, which reads as data that failed to load. */
  align-items: start;
}
.mkd-pair > .mkd-card,
.mkd-trio > .mkd-card { margin-block-end: 0; }

@media (min-width: 48rem) {
  .mkd-pair { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .mkd-trio { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 68rem) {
  .mkd-trio { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

/* ── Links out to the globals ─────────────────────────────────────────── */

.mkd-link-sub {
  margin-block-start: 3px;
  font-size: var(--mkd-fs-meta);
  line-height: 1.5;
  color: var(--text-muted);
}
`,
      }}
    />
  );
}
