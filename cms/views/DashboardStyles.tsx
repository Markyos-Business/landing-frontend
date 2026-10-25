import React from "react";

/*
 * Styles for the dashboard.
 *
 * Inline rather than a stylesheet import, because this component is resolved
 * through Payload's import map and a sibling `.css` file would need the SCSS
 * pipeline wired to reach it. One `<style>` tag in one view is a smaller
 * dependency than that.
 *
 * Every colour is a Payload admin theme variable, never a literal. The admin
 * ships light and dark themes and the user picks; a hardcoded background is a
 * dashboard that is unreadable for half the people who open it.
 *
 * Logical properties throughout — the admin runs in Arabic, and Payload
 * mirrors the whole panel when it does.
 */

export function DashboardStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
.mk-dash {
  padding: var(--base);
  max-inline-size: 1200px;
  margin-inline: auto;
}

.mk-dash-head { margin-block-end: calc(var(--base) * 1.5); }
.mk-dash-head h1 { margin: 0 0 .35rem; }
.mk-dash-head p { margin: 0; color: var(--theme-elevation-600); }

.mk-card {
  background: var(--theme-elevation-50);
  border: 1px solid var(--theme-elevation-150);
  border-radius: var(--style-radius-l, 16px);
  padding: calc(var(--base) * .9);
  margin-block-end: var(--base);
}

.mk-card h2 { margin: 0 0 .75rem; font-size: 1.05rem; }

.mk-card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-block-end: .75rem;
}
.mk-card-head h2 { margin: 0; }

.mk-muted { color: var(--theme-elevation-500); font-size: .85rem; }
.mk-note  { color: var(--theme-elevation-600); font-size: .85rem; margin: 0 0 .9rem; }
.mk-empty { color: var(--theme-elevation-500); margin: 0; }

/* Headline figures */
.mk-figures { display: flex; flex-wrap: wrap; gap: calc(var(--base) * 1.5); margin-block-end: 1rem; }
.mk-figures > div { display: flex; flex-direction: column; }
.mk-figure { font-size: 1.75rem; font-weight: 500; line-height: 1.1; letter-spacing: -0.04em; }
.mk-figure-label { color: var(--theme-elevation-600); font-size: .85rem; margin-block-start: .2rem; }

.mk-delta { font-weight: 500; margin-inline-start: .35rem; }
/* Green and red carry the meaning, so the sign is always printed too — the
   colours alone would say nothing to a red-green colourblind reader. */
.mk-delta--up   { color: var(--theme-success-500); }
.mk-delta--down { color: var(--theme-error-500); }
.mk-delta--flat { color: var(--theme-elevation-500); }

/* Daily sparkline */
.mk-spark {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  block-size: 64px;
  inline-size: 100%;
}
.mk-spark-col {
  flex: 1;
  /* Blue because it is light, not because the number is good:
     a view count has no sentiment, and green claimed one. */
  background: var(--theme-success-500);
  border-radius: 2px 2px 0 0;
  min-block-size: 1px;
  opacity: .75;
}

/* Tiles */
.mk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: .75rem;
}
.mk-tile {
  display: flex;
  flex-direction: column;
  gap: .15rem;
  block-size: 100%;
  padding: .85rem;
  border: 1px solid var(--theme-elevation-150);
  border-radius: var(--style-radius-m, 10px);
  background: var(--theme-input-bg, var(--theme-elevation-0));
  text-decoration: none;
  color: inherit;
  transition: border-color .15s ease;
}
.mk-tile:hover { background: var(--theme-elevation-200); }
.mk-tile-label { font-weight: 500; }
.mk-tile-value { font-size: 1.75rem; font-weight: 500; line-height: 1.15; letter-spacing: -0.04em; }
.mk-tile-sub   { color: var(--theme-elevation-500); font-size: .8rem; }

/*
 * The tile's floor: what is waiting, and the way to add more.
 *
 * A top margin of auto pins it to the bottom of whichever tile is
 * tallest, so a row of tiles shares one baseline however long their labels
 * run — the same anatomy the website's bento cells use.
 */
.mk-tile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  margin-block-start: auto;
  padding-block-start: .7rem;
  font-size: .8rem;
}

.mk-tile-label { color: var(--theme-text); text-decoration: none; }
.mk-tile-label:hover { text-decoration: underline; }

/* Amber, because a draft is waiting rather than wrong (§3 state hues). */
.mk-tile-drafts { color: var(--theme-warning-500); text-decoration: none; }
.mk-tile-drafts:hover { text-decoration: underline; }

.mk-tile-clear { color: var(--theme-elevation-400); }

.mk-tile-new {
  color: var(--theme-elevation-500);
  text-decoration: none;
  border: 1px solid var(--theme-elevation-150);
  border-radius: var(--style-radius-m, 10px);
  padding: .2rem .55rem;
  transition: background-color .12s cubic-bezier(.4,0,.2,1), color .12s cubic-bezier(.4,0,.2,1);
}
.mk-tile-new:hover {
  background: var(--theme-elevation-200);
  color: var(--theme-text);
}

/* Ranked bars */
.mk-bars { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.mk-bars li {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: .45rem .6rem;
  border-radius: var(--style-radius-m, 10px);
  overflow: hidden;
}
.mk-bar {
  position: absolute;
  inset-block: 0;
  /* Logical, not left: the bar must grow from the reading edge, which is the
     right-hand side when the admin is in Arabic. */
  inset-inline-start: 0;
  background: var(--theme-elevation-100);
  border-radius: var(--style-radius-m, 10px);
}
.mk-bar-label {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mk-bar-value { position: relative; font-variant-numeric: tabular-nums; color: var(--theme-elevation-600); }

.mk-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--base);
}
.mk-columns .mk-card { margin-block-end: 0; }
`,
      }}
    />
  );
}
