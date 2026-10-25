# Markyos Design System — build rules for markyos.com

> **For Claude Code / VS Code.** Put this file in the repo root next to `AGENTS.md`, then make `CLAUDE.md` read:
>
> ```
> @AGENTS.md
> @MARKYOS-DESIGN-SYSTEM.md
> ```
>
> GitHub Copilot in VS Code: copy this file to `.github/copilot-instructions.md`.
>
> Exported from the Markyos Design System project, 20 Oct 2026. The fonts and logos it references ship beside it in `fonts/` and `brand/`.

---

## 0. Precedence

1. **This file** decides every visual value: colour, type, weight, size, radius, border, light, motion, icons.
2. **`UI-UX Design Reference/*.png`** still decides layout, section order, composition and content structure. It no longer decides colour, type or shape.
3. **Comments in `app/theme.css`, `app/globals.css`, `app/fonts.ts`, `components/ui/Icon.tsx`, `docs/DESIGN.md`** that argue for the warm orange accent, gradient cards, gradient buttons, weight 600, pill CTAs, IBM Plex Arabic as the Arabic face or hand-drawn SVG icons are superseded. Rewrite those comments when you change the code they describe.
4. **`AGENTS.md`** (Next.js 16 rules) applies to all code.

Still binding, do not undo:
- `app/tokens.generated.css` is never edited. The site re-points tokens in `app/theme.css`.
- Everything in `globals.css` stays inside `@layer base` or `@layer components`.
- Logical properties only (`margin-inline-start`, `inset-inline-end`, `text-align: start`). No `left`/`right`.
- CTAs are `<Link>`s, never `<button>`s that navigate.
- `.mk-bidi` on every standalone string that may be either language.
- Product mocks keep their explicit `dir`; they do not mirror on `/ar`.
- Launch-status chips from `lib/status.ts` stay.
- New tokens use the `--mk-` prefix. Never rename, remove or redefine a product token name except by re-pointing it in `theme.css`.

---

## 1. The system in ten lines

1. **Black is the brand. Light is the colour.** ~90% true black, ~8% white and grey type, ~2% blue light.
2. Canvas `#000000`. Panels `#111111` → `#1A1A1A` → `#242424` (hover/pressed only). Never navy, charcoal or zinc as a base.
3. Text hierarchy by **white opacity, never hue**: 100% headlines · 80% prose · 60% descriptions, labels, body in cards · 40% disabled or decorative only.
4. Blue `#0099FF` core → `#0055FF` falloff is **light only**: glow, neon edge, focus ring, selection, progress and chart fills. Never a section fill, never heading, eyebrow or link ink.
5. Latin = **Inter 400 / 500 only** (no 600, 700 on the website), `font-feature-settings: "cv01","cv05","cv09","cv11"`. Arabic = **Thmanya Sans**, weight-matched, **never tracked**, line-height 1.3 display / 1.6 text, never smaller than the Latin beside it.
6. Display 500 at −0.04em: **54 / 44 / 28** desktop, **36 / 28** mobile. Text 400: **18** lead · **15** caption/card body · **14** UI · **12** meta. Nothing below 12px.
7. Radius encodes size: **4** checkbox · **6** status chip · **8** buttons, inputs, tags, nav items · **15** UI cards, dropdowns · **20** blog cards · **25** feature cards, bento · **full** filter pills, avatars, dots. Nested radius = outer − padding.
8. Depth from surface lift and 1px rings, never drop shadows. Rings are white at **20%** chips · **10%** cards, rows, header rule · **5%** inner dividers, inputs. The one raised shadow is for menus/overlays.
9. Hover and press = **one 35% black scrim** over the resting fill. Rows hover to `#242424`. No lift, shrink, nudge, bounce, parallax or entrance animation. 120ms colour/opacity/shadow, 180ms knobs and progress, `cubic-bezier(.4,0,.2,1)`.
10. **One icon system: Line Awesome 1.3.0.** No hand-drawn SVG icons, PNG icons, emoji or Unicode symbols as icons.

---

## 2. Files and fonts

Copy from this package:

| From | To |
| :--- | :--- |
| `fonts/thmanyahsans-Light.otf`, `-Regular`, `-Medium`, `-Bold`, `-Black` | `app/fonts/` |
| `brand/markyos-lockup.svg`, `-mark`, `-wordmark` and their `-white` versions | `public/brand/` (replace existing) |
| `brand/markyos-pattern-white.png` | `public/brand/` |

```bash
npm i line-awesome@1.3.0
```

### 2.1 `app/fonts.ts`

Add Thmanya Sans. Keep IBM Plex Sans Arabic loaded: it is the design system's last-resort fallback and `tokens.generated.css` still references `--font-plex-arabic`.

```ts
import localFont from "next/font/local";

export const thmanya = localFont({
  src: [
    { path: "./fonts/thmanyahsans-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/thmanyahsans-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/thmanyahsans-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/thmanyahsans-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-thmanya",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${thmanya.variable} ${plexArabic.variable}`;
```

Then replace every `var(--font-plex-arabic), var(--font-inter), sans-serif` Arabic stack in `globals.css` with `var(--font-arabic)` (defined in §4).

Bricolage Grotesque is the **wordmark's** typeface. It is never set as live text on the site; the wordmark is always the SVG.

### 2.2 Line Awesome

In `app/[lang]/layout.tsx`:

```ts
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";
```

(Confirm the path in `node_modules/line-awesome/dist/`.)

---

## 3. Token layer — new file `app/markyos-ds.css`

Import order in `app/globals.css`:

```css
@import "tailwindcss";
@import "./tokens.generated.css";
@import "./markyos-ds.css";   /* the design system — new */
@import "./theme.css";        /* maps the site's token names onto it */
```

`app/markyos-ds.css` (values are the design system's; edit only when the design system changes):

```css
/* Markyos Design System — marketing identity tokens ("Markyos Light").
   Source of truth: the Markyos Design System project. Do not invent values here. */
:root {
  /* canvas + panels */
  --mk-canvas: #000000;
  --mk-panel-1: #111111;
  --mk-panel-2: #1A1A1A;
  --mk-panel-3: #242424; /* hover / pressed only */

  /* text — hierarchy by opacity, never by colour */
  --mk-text-1: #FFFFFF;
  --mk-text-2: rgba(255,255,255,0.80);
  --mk-text-3: rgba(255,255,255,0.60);
  --mk-text-4: rgba(255,255,255,0.40); /* disabled / decorative only */

  /* lines + fills */
  --mk-line-strong: rgba(255,255,255,0.20);
  --mk-line: rgba(255,255,255,0.10);
  --mk-line-subtle: rgba(255,255,255,0.05);
  --mk-fill-2: rgba(255,255,255,0.10);
  --mk-fill-2-hover: rgba(255,255,255,0.16);
  --mk-scrim: rgba(0,0,0,0.35);
  --mk-glass: rgba(255,255,255,0.16); /* + backdrop-filter: blur(12px); floating pills only */

  /* signature light — blue core, deep-blue falloff */
  --mk-blue: #0099FF;
  --mk-blue-deep: #0055FF;
  --mk-blue-edge: #33B5FF;
  --mk-blue-soft: rgba(0,153,255,0.14);
  --mk-glow: 0 0 6px #0099FF, 0 0 24px rgba(0,153,255,0.65), 0 0 64px rgba(0,85,255,0.40);
  --mk-glow-soft: 0 0 18px rgba(0,153,255,0.35);
  --mk-glow-inset: inset 0 0 12px rgba(0,153,255,0.50);
  --mk-glow-text: 0 0 8px rgba(0,153,255,0.9), 0 0 28px rgba(0,85,255,0.6);
  --mk-light-pool: radial-gradient(45% 45% at 50% 50%, rgba(0,85,255,0.32) 0%, rgba(0,0,0,0) 70%);
  --mk-beam: 0 0 12px #0099FF, 0 0 40px #0055FF;
  --mk-data-bar: linear-gradient(90deg, #0099FF, #0055FF 45%, #000);

  /* UI-state accents — status dots, tags, chart series, product mocks. Never layout chrome. */
  --mk-state-approved: #00DE68;
  --mk-state-review: #8A58FF;
  --mk-state-expiring: #FFBB00;
  --mk-state-rejected: #FF0066;
  --mk-state-info: #00CCFF;
  --mk-state-approved-soft: rgba(0,222,104,0.14);
  --mk-state-review-soft: rgba(138,88,255,0.16);
  --mk-state-expiring-soft: rgba(255,187,0,0.14);
  --mk-state-rejected-soft: rgba(255,0,102,0.14);
  --mk-state-info-soft: rgba(0,204,255,0.14);

  /* type */
  --mk-features: "cv01", "cv05", "cv09", "cv11";
  --mk-weight-display: 500;
  --mk-weight-text: 400;
  --mk-track-display: -0.04em;
  --mk-lh-display: 1.0;
  --mk-lh-display-2: 1.1;
  --mk-lh-display-ar: 1.3;
  --mk-lh-text-ar: 1.6;
  --mk-d1: 54px; --mk-d2: 44px; --mk-d3: 28px;
  --mk-d1-mobile: 36px; --mk-d2-mobile: 28px;
  --mk-t-lead: 18px; --mk-t-caption: 15px; --mk-t-ui: 14px; --mk-t-meta: 12px;

  /* shape */
  --mk-r-chip: 4px;
  --mk-r-status: 6px;
  --mk-r-button: 8px;
  --mk-r-ui: 15px;
  --mk-r-blog: 20px;
  --mk-r-feature: 25px;
  --mk-r-pill: 999px;
  --mk-shadow-raised: 0 0 0 1px rgba(255,255,255,0.10), 0 20px 40px rgba(0,0,0,0.6);

  /* layout */
  --mk-container: 1100px;
  --mk-gutter: 20px;
  --mk-section-y: 100px;
  --mk-stack: 60px;
  --mk-card-pad: 25px;
  --mk-header-h: 64px;

  /* motion */
  --mk-ease: cubic-bezier(0.4, 0, 0.2, 1);
  --mk-dur-fast: 120ms;
  --mk-dur-base: 180ms;

  /* fades into the canvas — for product imagery */
  --mk-fade-bottom: linear-gradient(#000 55%, transparent 100%);
  --mk-fade-band: linear-gradient(transparent 0%, #000 25% 72%, transparent 100%);
  --mk-fade-end: linear-gradient(90deg, #000 60%, transparent 100%);
}
```

---

## 4. `app/theme.css` — re-point the site's tokens

Same names, new values, so every component that reads `var(--text-muted)` keeps working. Replace the whole `:root` block with this and rewrite the header comment to say the values come from the Markyos Design System.

```css
:root {
  /* ground + surfaces */
  --canvas: var(--mk-canvas);         /* #000 */
  --surface-0: var(--mk-panel-1);     /* #111 */
  --surface-1: var(--mk-panel-1);     /* #111 — cards */
  --surface-2: var(--mk-panel-2);     /* #1A1A1A — inputs, secondary buttons, table heads, segmented controls */
  --surface-3: var(--mk-panel-3);     /* #242424 — hover / selected row only */
  --card-top: var(--mk-panel-1);      /* flat: the gradient is retired */
  --card-bottom: var(--mk-panel-1);

  /* lines */
  --hairline: var(--mk-line-subtle);      /* 5% — dividers inside a card */
  --hairline-strong: var(--mk-line);      /* 10% — card edges, rows, header rule */

  /* text */
  --text: var(--mk-text-1);
  --text-secondary: var(--mk-text-2);     /* long-form prose */
  --text-muted: var(--mk-text-3);         /* 60% — 7.2:1 on #111, keeps the 7:1 small-type floor */
  --text-faint: var(--mk-text-3);         /* 40% fails 7:1; use --mk-text-4 only for disabled/decorative */

  /* accent = light */
  --accent: var(--mk-blue);               /* FILLS: progress, data bars, selected tile edge, focus */
  --accent-text: var(--mk-text-1);        /* INK: links, eyebrows, numerals are white, not blue */
  --accent-soft: var(--mk-blue-soft);
  --accent-on-soft: #85CAFF;              /* product token value: blue label on its 14% tint, solved for contrast */
  --accent-ink: #000000;
  --accent-edge: var(--mk-blue);

  /* primary CTA — flat white, black label */
  --solid: #FFFFFF;
  --solid-from: #FFFFFF;
  --solid-to: #FFFFFF;
  --solid-ink: #000000;

  --track: var(--mk-panel-2);
  --glow: rgba(0, 85, 255, 0.32);         /* the light pool's core */

  /* type */
  --font-display: var(--font-inter), "Inter", var(--font-thmanya), var(--font-plex-arabic), system-ui, sans-serif;
  --font-arabic: var(--font-thmanya), var(--font-plex-arabic), system-ui, sans-serif;
  --fs-display: clamp(2.25rem, 4.2vw, 3.375rem);  /* 36 → 54 */
  --fs-h2-lg: clamp(1.75rem, 3.4vw, 2.75rem);     /* 28 → 44 — one h2 size in the system */
  --fs-h2: clamp(1.75rem, 3.4vw, 2.75rem);        /* 28 → 44 */
  --fs-d3: 1.75rem;                               /* 28 — feature-card headlines */
  --fs-h3: 1.125rem;                              /* 18 — card titles */
  --fs-lead: 1.125rem;                            /* 18 */
  --fs-body: 0.9375rem;                           /* 15 */
  --fs-ui: 0.875rem;                              /* 14 */
  --fs-eyebrow: 0.75rem;                          /* 12 — the floor */
  --g-hero-tracking: var(--mk-track-display);     /* -0.04em */

  /* shape */
  --radius-card: var(--mk-r-ui);          /* 15 */
  --radius-widget: var(--mk-r-button);    /* 8 — insets, inputs, nav items */
  --radius-pill: var(--mk-r-pill);
}
```

---

## 5. `app/globals.css` — vocabulary changes

Keep every rule in its layer. Change only what is listed.

**Base layer**

```css
body {
  font-family: var(--font-inter), var(--font-thmanya), system-ui, sans-serif;
  font-feature-settings: var(--mk-features);   /* drop ss03, ss07 */
}
[dir="rtl"] { font-family: var(--font-arabic); line-height: var(--mk-lh-text-ar); }
[dir="rtl"] :where(h1, h2, h3) { letter-spacing: 0; line-height: var(--mk-lh-display-ar); }

:where(a, button, input, textarea, select, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--accent);   /* blue, not --accent-text */
  outline-offset: 2px;
}
```

**Layout**

```css
.mk-container { max-inline-size: var(--mk-container); margin-inline: auto; padding-inline: var(--mk-gutter); }
/* delete the 48rem padding override */
.mk-section { padding-block: clamp(3.75rem, 8vw, 6.25rem); }  /* 60 → 100 */
```

**Card, inset, bento**

```css
.mk-card {
  position: relative; isolation: isolate; overflow: hidden;
  border: 0;
  border-radius: var(--radius-card);
  background: var(--surface-1);                     /* flat — no background-image */
  box-shadow: 0 0 0 1px var(--hairline-strong);     /* outer ring: children can't cover it, geometry doesn't shift */
}
.mk-card-pad { padding: 1.25rem; }
@media (min-width: 40rem) { .mk-card-pad { padding: var(--mk-card-pad); } }  /* 25 */

.mk-feature { border-radius: var(--mk-r-feature); }  /* large feature cards */

/* Bento: a grid of parallel cards reads as one object. 1px gaps over a 10% ground. */
.mk-bento {
  display: grid; gap: 1px;
  background: var(--hairline-strong);
  border-radius: var(--mk-r-feature); overflow: hidden;
  box-shadow: 0 0 0 1px var(--hairline-strong);
}
.mk-bento > * { background: var(--canvas); padding: var(--mk-card-pad); }

.mk-inset { /* unchanged rule; tokens now resolve to #000 + 5% line + 8px */ }
```

**Light** (see §8)

```css
.mk-glow { /* unchanged rule; --glow is now blue. One per section. */ }
.mk-neon { box-shadow: inset 0 0 0 1px var(--mk-blue-edge), var(--mk-glow); }   /* the one selected/focused object */
.mk-beam { inline-size: 2px; background: var(--mk-blue); box-shadow: var(--mk-beam); }
.mk-pattern {
  background: url("/brand/markyos-pattern-white.png") center / cover no-repeat;
  opacity: 0.08; pointer-events: none;
  mask-image: radial-gradient(closest-side, #000 40%, transparent);   /* fades out from the edges */
}
```

**Type**

```css
.mk-display, .mk-h2-lg, .mk-h2 {
  font-family: var(--font-display);
  font-weight: var(--mk-weight-display);     /* 500 */
  letter-spacing: var(--g-hero-tracking);    /* -0.04em */
  color: var(--text); text-wrap: balance;
}
.mk-display { font-size: var(--fs-display); line-height: var(--mk-lh-display); }
.mk-h2-lg, .mk-h2 { font-size: var(--fs-h2); line-height: var(--mk-lh-display-2); }
.mk-h3 { font-family: var(--font-display); font-size: var(--fs-h3); font-weight: 500; line-height: 1.35; letter-spacing: 0; color: var(--text); }

[dir="rtl"] :where(.mk-display, .mk-h2-lg, .mk-h2, .mk-h3) {
  font-family: var(--font-arabic); letter-spacing: 0; line-height: var(--mk-lh-display-ar);
}

.mk-body strong, .mk-lead strong { color: var(--text); font-weight: 500; }
.mk-eyebrow { font-size: var(--fs-eyebrow); font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
.mk-eyebrow-accent { color: var(--text); text-transform: none; letter-spacing: 0; font-size: var(--fs-ui); }
[dir="rtl"] .mk-eyebrow { letter-spacing: 0; text-transform: none; }
```

**Buttons**

```css
.mk-btn {
  position: relative; isolation: isolate;
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  border-radius: var(--mk-r-button);          /* 8 — not a pill */
  min-block-size: 2.375rem;                   /* 38 — hero, section CTAs */
  padding-inline: 1rem;
  font-size: var(--fs-ui); font-weight: 500; line-height: 1; white-space: nowrap;
  transition: background-color var(--mk-dur-fast) var(--mk-ease), color var(--mk-dur-fast) var(--mk-ease);
}
.mk-btn::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: var(--mk-scrim); opacity: 0; pointer-events: none;
  transition: opacity var(--mk-dur-fast) var(--mk-ease);
}
.mk-btn:hover::after, .mk-btn:active::after { opacity: 1; }
.mk-btn-sm { min-block-size: 2rem; padding-inline: 0.875rem; font-size: var(--fs-ui); }  /* 32 — header, in-card */
@media (pointer: coarse) { .mk-btn, .mk-btn-sm { min-block-size: 2.75rem; } }

.mk-solid { background: var(--solid); color: var(--solid-ink); }      /* delete the :hover gradient rule */
.mk-outline { background: var(--surface-2); border: 0; color: var(--text); }  /* delete the :hover rule */
```

**Arrow** — keep the RTL/LTR flip rules. Delete the `transition` on `.mk-arrow` and every `translateX(2px)` hover rule, including the reduced-motion block that only exists to undo them.

**Other**
- `.mk-sr-only:focus-visible`: `border-radius: var(--mk-r-button); font-weight: 500;`
- `.mk-prose`: `font-size: var(--fs-lead)`; `a { color: var(--text); text-decoration: underline; text-underline-offset: 0.2em; }` with `a:hover { color: var(--accent); }`; `strong { font-weight: 500; }`; `blockquote { border-inline-start: 2px solid var(--mk-line-strong); }`; `img { border-radius: var(--radius-card); }`.

---

## 6. Icons — rewrite `components/ui/Icon.tsx`

Keep the exported `IconName` type, the `Icon` and `Arrow` exports and their current props, so no call site changes. Replace the SVG paths with Line Awesome glyphs.

```tsx
const LA: Record<IconName, string> = {
  languages: "language", palette: "palette", layers: "layer-group", scan: "search",
  penSquare: "pen-square", users: "users", user: "user", package: "box",
  grid: "th-large", check: "check", form: "clipboard-list", phone: "mobile-alt",
  rocket: "rocket", arrow: "arrow-right", chevron: "angle-down", menu: "bars", close: "times",
};

// render
<i
  className={`las la-${LA[name]} ${className}`}
  style={{ fontSize: size, lineHeight: 1, inlineSize: "1em", textAlign: "center", flex: "none", display: "inline-block" }}
  aria-hidden={label ? undefined : true}
  role={label ? "img" : undefined}
  aria-label={label}
/>
```

- `Arrow` = `<Icon name="arrow" className="mk-arrow" />`; `.mk-arrow` keeps it flipping in RTL.
- Sizes: **16** tabs, chips, meta · **18** buttons, rows · **22** header controls.
- Colour: 60% white at rest, blue when active, white on filled controls, state hue for status.
- Icon tiles: glyph centred on a 32–64px rounded square (8px radius) filled with its hue at ~14%.
- Brand marks for integrations: `lab la-figma`, `la-dribbble`, `la-behance`.
- Missing glyph: ask. Do not draw one.
- `components/brand/Logo.tsx` is the logo, not an icon; it stays SVG (use the files in `public/brand/`).

---

## 7. Component sweep

Work file by file through `components/chrome`, `components/sections`, `components/page`, `components/ui`, `components/mock`.

| Find | Replace with |
| :--- | :--- |
| `font-semibold`, `font-bold` | `font-medium` (500). 500 is the heaviest weight anywhere on the site, mocks included. |
| `text-[0.625rem]`, `text-[0.6875rem]` (10–11px) | `text-[length:var(--fs-eyebrow)]` (12) |
| `text-[0.8125rem]` (13) | 14 for labels, nav, buttons; 12 for meta |
| `text-[1.0625rem]` (17) | 18 (`--fs-lead`) |
| Display sizes hand-set in a section (`text-[1.75rem]`, `text-[clamp(...)]`) | 28 (`--fs-d3`) or the nearest display token. Arabic copy gets `letter-spacing: 0`. |
| `tracking-[-0.0Xem]` on headings | `-0.04em` for display sizes ≥28px, none below |
| `rounded-[var(--radius-pill)]` on buttons, nav links, chips, segmented items | buttons, nav links → `--mk-r-button` (8); status chips → `--mk-r-status` (6); the pricing billing toggle and filter pills stay pill; avatars and dots stay `rounded-full` |
| `rounded-[6px]`, `rounded-[8px]`, `rounded-[3px]` | `--mk-r-status` / `--mk-r-button` / `--mk-r-chip` |
| `text-[var(--accent-text)]` | Now resolves to white. Check each use reads right: links → white + `Arrow`; eyebrows above a heading → `--text-muted`; numerals → `--text`. |
| `bg-[var(--accent)]` with `text-[var(--canvas)]` (badges, e.g. the plan badge in `page/blocks.tsx`) | ghost tag: `bg-[var(--accent-soft)] text-[var(--accent-on-soft)]`, 6px radius, 12px 500 |
| `bg-[var(--accent)]` on a progress fill or data bar | keep (blue as light), or `--mk-data-bar` |
| `decoration-[var(--accent)]` and other "this is wrong/drifting/approved" markers | the matching state hue (`--mk-state-rejected`, `--mk-state-expiring`, `--mk-state-approved`) |
| `hover:bg-[var(--surface-1)]` / `[--surface-2]` on rows and menu items | `hover:bg-[var(--surface-3)]` (#242424) |
| `border-[var(--accent-edge)]` focus on inputs | `box-shadow: inset 0 0 0 1px var(--mk-blue), var(--mk-glow-soft)` |
| Any hex in a component | a token. Exception: the client palette in `mock/BrandHub.tsx` is the customer's brand shown as content and stays. |

**Header** (`components/chrome/Header.tsx`): 64px tall, `#000`, bottom rule `box-shadow: inset 0 -1px 0 var(--hairline-strong)`, no `backdrop-filter`. Nav links 14px 400 at 80% white, white on hover. "Log in" = `.mk-btn .mk-btn-sm .mk-outline`; "Start free" = `.mk-btn .mk-btn-sm .mk-solid`.

**Dropdowns** (`Nav.tsx`): panel `#111`, 15px radius, `box-shadow: var(--mk-shadow-raised)`. Items 8px radius, hover `#242424`. The disclosure pattern and keyboard behaviour stay as built.

**Segmented controls and filter pills** (pricing toggle, voice-mock tabs): pill track with a 10% ring; active item `--mk-fill-2` + white label; inactive 60% white.

**Chips** (`components/ui/Chip.tsx`): 6px radius, 12px 500, `--surface-2` fill + 60% label for neutral; state chips use the state hue's soft fill + the hue as a 6px dot.

---

## 8. Light — the signature

- **One light source per composition** (per section). Light covers ~2% of a layout.
- **Light pool** (`.mk-glow` or `background: var(--mk-light-pool)`): behind the one object a section is about — the hero's product shot, the final CTA.
- **Neon edge** (`.mk-neon`): the one selected or focused object — the selected template tile, the highlighted plan, the active step.
- **Beam** (`.mk-beam`): a vertical 2px line beside the hero's product frame, ending before the bottom third.
- **Data bar** (`--mk-data-bar`): progress and score bars in the tone checker.
- **Pattern** (`.mk-pattern`): white at 6–10%, fades out from the edges, never coloured, never behind body text. Optional; at most once per page.
- Product imagery fades into the canvas with `--mk-fade-bottom` / `--mk-fade-end` instead of sitting in a hard-edged box.
- No other gradients. No textures. No drop shadows except `--mk-shadow-raised` on menus and overlays.

---

## 9. Product mocks (`components/mock/*`)

Mocks are pictures of the product, so they follow the product UI rules:
- Window `#0B0B0B`–`#111` with a 12% ring, 15px top radius; title bar 52px with `#333` dots; sidebar items 8px radius, active `#1A1A1A`.
- Inter 400/500 at 12–14px; Arabic in Thmanya Sans. Nothing under 12px.
- State hues for status only: approved `#00DE68`, in review `#8A58FF`, expiring `#FFBB00`, rejected `#FF0066`, info `#00CCFF`; soft fills at 14%.
- Primary product button = blue `#0099FF` with `--mk-glow-soft`, 8px radius.
- Locales appear as codes (`ar-SA`, `en-US`), never flags.
- Explicit `dir` stays; mocks do not mirror.

---

## 10. Component specs (from the design system's React library)

The design system's components are the spec. Rebuild them with this site's classes and tokens; do not import its `.jsx` files.

| Component | Spec |
| :--- | :--- |
| Button — marketing | `light`: white fill, black label. `secondary`: `#1A1A1A`, white label. 8px radius, Inter 500 14px, 32px (header, in-card) or 38px (hero, section), 44px on coarse pointers. Icon 18px, gap 8–10px. Hover/press = 35% black scrim. |
| Button — product (mocks) | `primary`: `#0099FF`, white label, `--mk-glow-soft`, 46px, 26px padding. `ghost`: blue at 14%, blue label. Disabled: `#1A1A1A`, 60% label. |
| Text link | White (or 60% in meta), ends with an arrow that flips in RTL. Hover → blue. |
| Tag | 36px, 8px radius, `#1A1A1A` or hue at 14%. |
| Status tag | 28px, 6px radius, 6px dot in the state hue + label. |
| Badge | 24px, pill, 12px 500. |
| Progress bar | Track `#1A1A1A`, fill blue or `--mk-data-bar`, 180ms fill transition. |
| Input | `#1A1A1A`, 8px radius, 5% inset ring; focus = 1px blue inset + `--mk-glow-soft`; placeholder 40% with a real ellipsis ("Start typing…"). |
| Switch | Knob moves at 180ms. On = blue track. |
| Card | `#111`, 15px radius, 10% ring, 25px padding (20 on phones). |
| Feature card / bento | 25px radius; bento uses 1px gaps over 10% white. |
| Blog card | 20px radius; image fades into the card. |
| Dropdown / overlay | `#111`, 15px radius, `--mk-shadow-raised`. |
| Row | Hover `#242424`; separated by 5–10% hairlines, not boxes. |

---

## 11. Copy and locale rules

Copy lives in `content/` and `docs/copy/`. Do not rewrite it unless asked; these rules apply to any string you add.

- Voice: clear, warm, confident, specific, a little bold. Never hype, technical, cute or corporate.
- Short sentences, one idea each. Say "you" and "your client" more than "we". Real nouns over adjectives.
- No exclamation marks. Never "revolutionary", "seamless", "leverage", "unlock".
- Name the enemy: brand decay.
- Arabic is transcreated, never translated; Modern Standard Arabic. Run `npm run check:locales`.
- Sentence case everywhere. Uppercase only as a style (eyebrows, overlines), never typed in caps. Arabic has no case: drop `uppercase` and tracking in RTL.
- Buttons 1–3 words, verb first.
- Dates `12 Sep`, `31 Dec 2026` (never US order). Currency `SAR 84,500`. Relative time `10m`, `2d`.
- Numbers: value 500, unit 400.
- Western numerals unless the copy specifies Arabic-Indic.
- No emoji, anywhere.

Approved key lines (use verbatim): "Build the brand. Hand it over. Keep it alive." / «ابنِ الهوية. سلّمها. وأبقِها حيّة.» · "Brands don't die. They decay." / «العلامات التجارية لا تموت. بل تتآكل.» · "Built in Arabic. Not translated into it." / «بُنيت بالعربية. لا تُرجمت إليها.» · "Change it once. It changes everywhere." · "Your brand deserves a better home than a PDF." / «علامتك تستحق بيتاً أفضل من ملف PDF.»

---

## 12. Logo rules

- Files only, from `public/brand/`. Never retype, redraw, recolour, stretch, rotate or add effects.
- On the site: the white versions on black.
- Lockup by default and on first appearance; mark for favicons and app icons (min 16px); wordmark only when the mark is already on screen. Lockup min 120px wide.
- Clear space = half the iconmark height.
- Logos and marks never mirror in RTL.

---

## 13. Don't

- Don't edit `app/tokens.generated.css`.
- Don't write rules outside a cascade layer in `globals.css`.
- Don't use the warm orange palette, zinc greys or card/button gradients.
- Don't use weights above 500 or text below 12px.
- Don't colour headings, eyebrows or body text.
- Don't use blue as a flat fill for sections, cards or headings.
- Don't add drop shadows to cards.
- Don't add hover lifts, nudges, entrance animations, parallax or scroll effects.
- Don't put `backdrop-filter` on the header (it breaks the fixed phone menu).
- Don't hand-draw SVG icons, illustrations or imagery; leave a labelled placeholder and ask.
- Don't use physical properties (`left`, `right`, `margin-left`, `padding-right`, `text-align: left`).
- Don't mirror product mocks, logos or media controls.

---

## 14. Migration order and definition of done

One commit per step. After each: `npm run check`, then look at `/` (Arabic) and `/en` at 375px and 1440px.

1. **Assets and fonts** — §2.
2. **Token layer** — add `app/markyos-ds.css`, fix the import order — §3.
3. **Theme** — replace `theme.css` `:root` — §4. Most of the page changes here.
4. **Vocabulary** — `globals.css` — §5.
5. **Icons** — `Icon.tsx` — §6.
6. **Sweep** — §7, one folder at a time.
7. **Light** — §8: hero pool + beam, one neon edge per section that has a selected state, data bars in the tone checker.
8. **Docs** — update `docs/DESIGN.md` ("Where the design language is defined" gains `app/markyos-ds.css`; departure §2 now agrees with the design system; note that the reference PNGs govern layout only) and the header comments of `theme.css`, `fonts.ts`, `Icon.tsx`.

Done when all of these return nothing (ripgrep):

```bash
rg -n "font-(semibold|bold)|font-weight:\s*(600|700|800|900)" app components
rg -n "text-\[0\.(5|6)[0-9]*rem\]" components
rg -n "#[0-9a-fA-F]{3,8}\b" components --glob '!components/mock/BrandHub.tsx' --glob '!components/brand/**'
rg -n "\b(margin|padding)-(left|right)\b|\b(left|right)\s*:|text-align:\s*(left|right)|\b(ml|mr|pl|pr)-" app components
rg -n "<svg" components --glob '!components/brand/**'
rg -n "fb923c|fdba74|251, 146, 60|09090b|a1a1aa|fafafa" app components
```

---

## Updating this file

When the design system changes, a new export of this file replaces this one. Values change in §3 (`app/markyos-ds.css`) and §4 (`app/theme.css`); components should never need to change for a token update.
