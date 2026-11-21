# Brief for Claude Code: rebuild my site in the 21st.dev visual style

Copy this whole `21st-reference/` folder into my project at `docs/21st-reference/`, then tell Claude Code: *"Follow docs/21st-reference/BRIEF.md."*

The folder has 23 screenshots of the real 21st.dev homepage in `screenshots/`, top to bottom, captured at a 1150×666 viewport. **They are your visual spec.** Section 4 tells you which screenshot goes with which section.

### How to use the screenshots

- **Before you build each section, open its screenshots with your Read tool and look at them.** Don't build from the text alone. The text gives you exact values; the screenshots show proportions, spacing, how dense things are, and how layers overlap.
- Measure from them: the screenshots are at roughly 1:1 with a 1150px-wide desktop, so pixel distances (gutters, card padding, gaps between title and subtitle) translate almost directly into CSS.
- **When you finish a section, screenshot your own version at the same width (1150px) and the same scroll position, put the two side by side, and list the differences** (spacing, font weight, border brightness, glow strength, radius). Fix them before moving on.
- They're **reference only**. Never ship them, never import them into the site, and never copy the 21st logo, text, customer logos or demo content you see in them. Recreate the *pattern* with my content.
- Some screenshots are frozen mid-animation (03 is blurred mid-transition, 20 shows the FAQ open). Section 5 says what moves and how.

---

## 0. What you're doing

Restyle and restructure my existing website so it feels like **21st.dev**: dark, near-black canvas, one electric-blue accent, oversized tight headlines, bento cards with live product previews, and calm, springy motion everywhere.

Copy the **design language**, not the brand. Use my logo, my copy, my product, my images. Don't reuse 21st's logo, wordmark, text, screenshots, or the third-party logos in their "used by" strip.

**Before writing code:**
1. Read the project and tell me the stack (framework, styling, component library, animation library). Adapt everything below to it. If it's React/Next, use Tailwind v4 + shadcn/ui conventions + `motion` (Framer Motion). If it's something else, port the same tokens and behaviours.
2. List my current pages and sections and map each one to the section patterns in §4. Show me the mapping before building.
3. Build in this order: tokens → type → primitives (button, card, header) → hero → sections top to bottom → motion polish → responsive pass → reduced-motion and accessibility pass.

---

## 1. Design tokens

Dark mode only (set `class="dark"` on `<html>`). All colours in OKLCH, the way 21st does it.

```css
:root, .dark {
  /* surfaces */
  --background:        oklch(0.141 0.004 285.8);  /* page, near-black with a cool tint */
  --card:              oklch(0.158 0.003 286);    /* bento cell, a hair lighter than page */
  --popover:           oklch(0.204 0 0);
  --secondary:         oklch(0.274 0.005 286);
  --muted:             oklch(0.21 0.006 285.9);
  --accent:            oklch(0.21 0.006 285.9);

  /* text */
  --foreground:        oklch(0.968 0.001 286.4);  /* not pure white */
  --card-foreground:   oklch(0.985 0 0);
  --muted-foreground:  oklch(0.654 0.014 286);    /* subtitles, captions */

  /* the one accent */
  --primary:           oklch(0.485 0.291 264.1);  /* electric blue, approx #0a3cff */
  --primary-foreground:oklch(1 0 0);
  --ring:              var(--primary);

  /* lines */
  --border:            oklch(0.274 0.005 286);
  --hairline:          oklch(0.975 0.002 286 / 0.075); /* card borders: white at ~7% */
  --ghost-fill:        oklch(0.975 0.002 286 / 0.08);  /* secondary button fill */

  --radius:            0.5rem;
  --radius-btn:        10px;
  --radius-card:       20px;
  --radius-frame:      28px;  /* big outer frames around product previews */
}

::selection { background: var(--primary); color: white; }
```

Rules:
- Blue is the **only** saturated colour in the chrome. It appears on primary buttons, the selection colour, underlines on key numbers, and the glowing light blobs. Everything else is greys.
- Colour inside cards comes from the *content previews* (an orange shader, a warm photo, a coloured theme demo), never from the card itself.
- Borders are hairlines (0.8px, white at ~7%). No drop shadows on cards.

---

## 2. Typography

- **Font:** General Sans (free from Fontshare, self-host the woff2 files: 400, 500, 600, 700). Fallback stack: `system-ui, -apple-system, "Segoe UI", sans-serif`. Mono: `ui-monospace, "SF Mono", "Cascadia Code", Consolas, monospace` for code and terminal snippets.
- Body base size 18px on desktop, `antialiased`, `scrollbar-gutter: stable`.

| Role | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Hero display (h1) | `clamp(44px, 6vw, 88px)` | 700 | **-0.05em** (very tight) | 1.0 |
| Section title (h2) | `clamp(28px, 3.6vw, 44px)` | 500 | -0.022em | 1.1 |
| Big statement line ("Used by…") | `clamp(28px, 3.6vw, 44px)` | 500 | -0.022em | 1.15 |
| Card title | 17–18px | 600 | -0.01em | 1.3 |
| Card subtitle | 15–16px | 400, muted | 0 | 1.4 |
| Nav / buttons | 13–15px | 500 | 0 | 1 |

- Hero headline is centred, two lines, ends with a full stop.
- Section titles are **left-aligned** with the subtitle under them in muted grey, max ~56ch. The section's secondary button sits on the far right of the same row.

---

## 3. Primitives

**Header**
- `position: sticky; top: 0; z-50; height: 64px`, transparent background (content scrolls under it; add a subtle top-down black gradient behind it so text stays readable).
- Left: logo. Right: search trigger with a `⌘K` keycap chip, "Log in" text link, primary button, hamburger icon.

**Buttons**
- Primary: `bg-primary`, white text, radius 10px, inset top highlight `box-shadow: inset 0 1px 0 rgba(255,255,255,.22)`.
- Secondary: fill `--ghost-fill` (white at 8%), no border, white text.
- Sizes: sm = 32px tall / 13px text, lg = 44px tall / 15px text, padding 12–20px.
- Interaction: `transition: background-color .18s, box-shadow .18s, filter .18s, scale .12s`. Hover = slight brighten (`filter: brightness(1.1)`); active = `scale: 0.97`.

**Bento cell (the main card)**
- Radius 20px, background `--card`, hairline border, `overflow: hidden`, padding 8px around an inner media panel (radius ~14px), then a footer row:
  - left: bold title ("388 shaders") + muted subtitle ("Live backgrounds, in your colours")
  - right: text link with arrow ("All shaders →"), arrow nudges 2px right on hover.
- Make cells container-query aware (`@container`) so the inner layout adapts to the cell's width, not the viewport.

**Layout**
- Content container: `max-width: 1152px; padding-inline: 24px; margin-inline: auto`.
- Section vertical padding: ~92px desktop, ~56px mobile.

---

## 4. Page structure (map my content onto this)

Each section lists its screenshots and what to look for in them. **Open them before you build that section.**

### 4.1 Header (visible in every screenshot)
- Sticky, 64px, transparent, no border. Content scrolls *under* it, and a soft black fade at the top keeps it readable (see 09, 14: the cards fade out as they pass under the header).
- Left: logo. Right, in this order: search trigger with `⌘K` keycap chip → "Log in" text link → small primary button → hamburger.

### 4.2 Hero: `01-hero.jpg`
- Full-bleed animated background: a slow, dark, swirling ribbon of blue light on near-black (a `<canvas>` shader; layered blurred radial gradients animated with CSS are an acceptable lighter fallback). It fades to `--background` toward the bottom.
- Centred h1 on two lines, very tight tracking. The words almost touch, so check this against the screenshot. One-line muted subtitle ~24px below. Two buttons side by side, ~36px below that.
- Below, the top edge of a **large framed product preview** shows above the fold: outer frame radius ~28px, hairline border, faint white fill, with a darker app window inset ~36px inside it.

### 4.3 Hero product demo: `02` → `03` → `04` → `05`
This is the most distinctive part of the page. The framed preview isn't a static image. It's a **scripted, self-playing product demo with a fake cursor**, running in a loop:
1. `02-hero-demo-hover-preview.jpg`: inside the fake app (logo, search, bookmark, avatar, then "Top today" / "New & noteworthy" rows of cards with big ghosted rank numbers 1–4), the cursor hovers a card and a **preview modal** pops over everything with a "Copy prompt" primary button.
2. `03-hero-demo-transition.jpg`: frozen mid-transition: the modal dissolves with a blur/opacity cross-fade into the next scene. Transitions between scenes are blur + fade, not slides.
3. `04-hero-demo-agent-window.jpg`: a desktop-style **app window** (macOS traffic lights, sidebar, chat with a checklist and "Creating 267 tokens…" status) slides up over the preview: the copied prompt being used.
4. `05-hero-demo-dock-to-social-proof.jpg`: a **macOS-style dock** with 4 app icons and indicator dots floats over the bottom edge of the frame, overlapping the frame boundary.

Rebuild this pattern with **my** product's real flow: 3–4 scenes that show a user doing the core job in my product, a fake cursor that moves with easing and clicks (small scale-down on click), blur-fade between scenes, ~4–6s per scene, looping. Pause it when it's off-screen. Show a static first scene under `prefers-reduced-motion`.

### 4.4 Social proof: `05`, `06-social-proof-logos.jpg`
- One huge left-aligned sentence across the full container width. The first clause is white, the key number has a **blue underline**, the rest is muted grey (it turns white word by word as you scroll; see §5).
- Below, two logo groups side by side: left group unlabelled (big names), right group labelled "Startups:" in small muted text. Logos and names are monochrome light grey, ~18px, generous gaps. Use my clients, or drop this block if I can't show logos.
- Note the big soft blue glow blob sitting below the logos in `06`. That's a section seam (§4.12).

### 4.5 Section header pattern: `07-section-header-more-than-components.jpg`, `13-section-header-built-for-how-you-ship.jpg`
- h2 left-aligned, muted 2-line subtitle under it (narrow, ~36ch, so it wraps). Optional secondary button pinned to the far right on the same baseline as the subtitle (07). ~64px gap down to the first card.
- Lots of empty dark space above the title, with the glow seam behind it.

### 4.6 Bento: big showcase cell: `08-bento-showcase-media.jpg`, `09-bento-showcase-progress-bars.jpg`
- Full-width cell, radius 20px, ~8px inner padding around a media panel (radius ~14px) playing a video/carousel of real work. Overlaid UI inside the media is glassy (translucent dark, blurred backdrop).
- Under the media: **4 segmented progress bars** (2px, grey track, white fill on the active one, small gaps). The active bar fills over the slide's duration, then the next slide starts.
- Footer row: bold title + muted subtitle on the left, "All templates →" on the right (09).

### 4.7 Bento: interactive demo cells: `10`, `11`, `12`
- `10-bento-themes-switcher.jpg`: a mini dashboard card (big number, small stat, bar chart) whose colours change when you click the **colour swatches** under it. The selected swatch gets a ring and its name next to it ("Lime Frost"). The whole cell re-skins, including the chart and the background tint. Compare with the earlier screenshot where the same chart is orange: it auto-cycles too.
- `11-bento-shaders-and-icons.jpg`: two half-width cells. Left: a live shader with its own mini swatch dots top-right and 4 progress bars. Right: a search field with a typed query and a 5-column icon grid where icons fade from bright to dim row by row (relevance falloff).
- `12-bento-apps-wide-cell.jpg`: a full-width cell with a short, wide media strip (~250px tall) and the same footer. Use this for my most visual piece of work.
- Cell spacing is tight: ~16px gaps between cells.

### 4.8 How it works: colour cards: `14-how-it-works-color-cards.jpg`
- Three tall cards (~1:1.2), radius ~16px, **each with its own full colour background**: warm terracotta, a blue/lavender gradient, off-white with a pink haze. This is the only place the page breaks from dark greys.
- Each has a floating UI mock in the upper half (terminal in translucent dark, a white PR card with a code diff, a dark "worked for 14s" result card) and, at the bottom: tool logo + name, then a 2-line description.
- Map these to the 3 steps of how a client works with me, or my 3 core services.

### 4.9 How it works: wide code cell: `15-how-it-works-code-cell.jpg`, `16-how-it-works-code-cell-footer.jpg`
- One wide cell split by a hairline into two columns. Left: Code/Preview pill toggle, a file tab with icon + filename, a code editor with line numbers, syntax colours, and a **typing caret** at the end of a line; the editor fades out at the bottom. Right: a big stat ("25,431 installs this week") with a bookmark counter chip, then a dropdown "Saved to bookmarks" menu.
- Each column ends with a bold title + muted paragraph (16).

### 4.10 Other tools grid: `17-other-tools-grid-top.jpg`, `18-other-tools-grid-bottom.jpg`
- 2×2 grid inside one bordered container, cells divided by **hairlines, not gaps**. Each cell: a dark inset mock (a blue prompt bar over a pricing card, a design-score ring, a terminal, a full-colour shader with swatches) then "Name →" (or "↗" for external) + one muted line.

### 4.11 FAQ: `19-faq-closed.jpg`, `20-faq-open.jpg`
- Left: 2-line h2 ("Questions / before you join"). Right (starts ~45% across): accordion rows separated by hairlines, `+` on the right.
- **Open state (20):** the open item becomes a filled card (slightly lighter surface, radius ~14px, no hairline), the `+` becomes `×`, and the answer shows in muted text. Only one open at a time.
- A big blue glow arc sits behind the top of the FAQ.

### 4.12 Final CTA: `21-final-cta.jpg`
- Full-width panel, radius ~28px, deep navy-to-electric-blue tint, with a **faded collage of tilted product screenshots** behind it (low opacity, blue-tinted). Centred h1-sized headline ending in a full stop, two buttons.

### 4.13 Footer: `22-footer-columns.jpg`, `23-footer-categories-dot-logo.jpg`
- Hairline on top. Left: pixel/dot-matrix logo mark in blue, © line, a small "Backed by" badge. Then 5 columns of links: small muted column label, links in light grey.
- Below: a label and a wrapping **tag cloud** of every category as plain links.
- Bottom edge: a **giant dot-matrix version of the logo + wordmark** spanning the full width and cut off by the bottom of the page: mark in blue dots, wordmark in dim grey dots. Build it as an SVG pattern or canvas grid from my logo.

### 4.14 Glow seams (between sections): visible in 06, 13, 16, 17, 19
Soft blurred blobs and arcs of `--primary`, ~320px tall, ~85% opacity, sitting behind section boundaries and slowly drifting, so the page fills with light as you scroll. 21st renders them on small canvases; a `radial-gradient` div with `filter: blur(80px)` and a slow transform loop is fine.

---

## 5. Motion

Library: `motion` (Framer Motion) for React, otherwise CSS + IntersectionObserver.

**Easing curves (use these, not the defaults):**
```css
--ease-out-expo:  cubic-bezier(0.22, 1, 0.36, 1);   /* reveals, cards sliding in */
--ease-smooth:    cubic-bezier(0.2, 0.7, 0.2, 1);   /* hover, small UI */
--ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);   /* carousels, progress bars */
--ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);
```

**Behaviours to build:**
- **Scroll reveal:** sections and cards fade up 16–24px with a slight blur-to-sharp (`filter: blur(6px) → 0`), 600–800ms, `--ease-out-expo`, staggered 60–80ms between siblings. Trigger once at ~20% visibility.
- **Hero entrance:** headline lines rise in one after another, then subtitle, then buttons, then the preview frame scales from 0.96 → 1.
- **Hero background:** continuous slow motion (a 20–40s loop); slight parallax against scroll.
- **Text-highlight reveal:** in the big social-proof sentence, the grey words turn white word by word as you scroll through it (scroll-linked, not time-based).
- **Count-up numbers** on the stat, ~1.2s.
- **Story-style progress bars** that drive the showcase carousel.
- **Typing effect** in code/terminal mocks with a blinking caret.
- **Hover on cards:** inner media scales 1.00 → 1.02, link arrow translates x 2px, 200ms.
- **Buttons:** press scale 0.97 (120ms).
- **Dock / floating mocks:** gentle idle float (y ±4px, 6s loop) and macOS-style magnify on hover.
- **Accordion:** height animation with `--ease-in-out`, 250ms.
- Small utility keyframes 21st uses that you can reuse: `ping-slow` (pulse rings on status dots), `scale-pulse`, `spin-around` (shimmer button border).

**Respect `prefers-reduced-motion`:** turn off the shader loop, parallax, floats and typing; keep simple opacity fades.

---

## 6. Responsive

- ≥1024px: layouts as above.
- 768–1023px: 3-up rows become 2-up; framed hero preview keeps its aspect ratio and scales down.
- <768px: everything stacks to one column, hero h1 drops to ~44px, header collapses to logo + primary button + hamburger (opens a full-screen sheet), the dock and floating overlays are hidden, logo strip becomes a horizontal marquee.

---

## 7. Quality bar

- Lighthouse performance ≥ 90 on mobile: lazy-load videos and canvases below the fold, pause any canvas/video that is off-screen (IntersectionObserver), cap the hero shader to devicePixelRatio 1.5.
- Text contrast AA against the dark background (muted grey stays ≥ 4.5:1 on body text).
- All interactive mocks are keyboard-reachable or marked `aria-hidden` if purely decorative.
- No layout shift when fonts load (`font-display: swap` + size-adjusted fallback).

## 8. When you're done

Run the dev server and screenshot every section of my site at 1150px wide (matching the reference) and at 390px. For each one, open the matching file in `screenshots/` and compare them side by side. Write the comparison into `docs/21st-reference/REVIEW.md` as a table (section | reference screenshot | my screenshot | differences | fixed?). List anything that still feels off (spacing, weight, motion timing) and fix it before telling me it's finished.
