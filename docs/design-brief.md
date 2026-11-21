# The design brief markyos.com is built to

**Adopted 18 Nov 2026.** Source: `21st-style-brief.md`, supplied by the owner.
This file is the governing description of the site's visual language. Where it
and `MARKYOS-DESIGN-SYSTEM.md` disagree, this file wins — see that file's
header, which now says so.

The brief asks for the **design language** of 21st.dev: a dark, near-black
canvas, one electric-blue accent, oversized tight headlines, bento cards with
live product previews, and calm springy motion. The brand is ours — our logo,
our copy, our product, our mocks. Nothing is reused from 21st.dev.

---

## What was decided, and by whom

Four questions were put to the owner before any code was written, because each
one changed what got built. The answers:

| Question | Answer |
| :--- | :--- |
| The repo caps weight at 500, bans entrance/scroll/hover/press motion, and ships a light canvas. The brief wants 600/700, motion throughout, near-black. Which wins? | **The brief wins fully.** Amend the design system and relax the weight gate. |
| Arabic is the default edition and General Sans has no Arabic glyphs. | **Keep the current two fonts** — Inter for Latin, Thmanya Sans for Arabic. |
| The brief's stat, logo strip and dev-tool demos have no truthful equivalent here. | **Substitute real mocks, and leave labelled placeholders** for the stat and logo strip. |
| Re-pointing the tokens turns all 51 pages dark. How wide? | **Tokens and chrome site-wide, homepage rebuilt.** |

The first answer is a deliberate reversal of two standing rules: the design
system's §13 ("Don't add hover lifts, nudges, entrance animations, parallax or
scroll effects") and a direct instruction of the owner's, *"no animations while
pressing on any button."* Buttons now scale to 0.97 on press because the brief
asks for it and was adopted knowing that. If that one is ever pulled back out,
the rule lives in `tailwind/components/buttons.js` under `.mk-btn:active`.

---

## 1. Tokens

Dark only. OKLCH. Declared in `tailwind/tokens.js` under `:root, .dark`; the
site's existing token *names* are kept and re-pointed, which is why the chrome,
the blog and every page under `content/pages/` followed from one file.

```
--background / --canvas   oklch(0.141 0.004 285.8)   page, near-black, cool tint
--card / --surface-1      oklch(0.158 0.003 286)     bento cell, a hair lighter
--surface-2 / --muted     oklch(0.21  0.006 285.9)   inputs, secondary fills
--surface-3 / --secondary oklch(0.274 0.005 286)     hover, selected
--foreground / --text     oklch(0.968 0.001 286.4)   not pure white
--text-muted              oklch(0.654 0.014 286)     subtitles, captions
--primary / --accent      oklch(0.485 0.291 264.1)   the one blue
--hairline-strong         oklch(0.975 0.002 286 / 0.075)
--ghost-fill              oklch(0.975 0.002 286 / 0.08)
--radius-btn 10px   --radius-card 20px   --radius-frame 28px
```

**Blue is never ink.** `--primary` measures about **2.2:1** on this canvas — it
fails as text at any size. The brief only ever asks for it as a fill, a
selection, an underline and a glow, and that is all it does. Where a blue label
is needed, `--accent-on-soft` and `--mk-blue-ink` carry
`oklch(0.76 0.14 255)`, about 8.4:1.

`--text-muted` is about **6.9:1**, which clears AA for body copy as §7 asks.

Cards carry a hairline and **no drop shadow**. `--lift-card` and `--lift-ring`
kept their names and now describe a 1px edge rather than a shadow, so the
forty-two components that read them needed no change.

## 2. Typography

**The fonts are the one place this departs from the brief outright.** The brief
asks for General Sans. `/` is the Arabic edition and General Sans ships no
Arabic glyphs, so adopting it would have left the default edition unset. Inter
keeps the Latin, Thmanya Sans keeps the Arabic. Everything else in §2 applies.

| Role | Size | Weight | Tracking | Line height |
| :--- | :--- | :--- | :--- | :--- |
| Hero display | `clamp(44px, 6vw, 88px)` | 700 | −0.05em | 1.0 |
| Section title | `clamp(28px, 3.6vw, 44px)` | 500 | −0.022em | 1.1 |
| Card title | 18px | 600 | −0.01em | 1.3 |
| Card subtitle | 16px | 400, muted | 0 | 1.4 |
| Body | 18px | 400 | 0 | 1.55 |

Three section sizes (56/52/44) were collapsed onto one, which is most of why
the page now reads as one rhythm rather than three.

**Arabic takes none of the tracking.** Negative tracking on a joined script is
a broken word, not a tighter line. `[dir="rtl"]` and `:lang(ar)` zero it for all
four heading classes, and the Arabic face needs more leading (1.3 display,
1.6 text), so the line-height tokens stay per-script. The hero's own
`--mk-lh-hero` is per-`lang` for the same reason.

## 3. Motion

Scroll reveals, the aurora, hover scales and the press scale are all in.
`prefers-reduced-motion` turns off the aurora, the media scale, the arrow nudge
and the press scale, and keeps the fades.

**The brief's timings were not taken, and this is an improvement rather than a
compromise.** It specifies 600–800ms on `--ease-out-expo` with a 60–80ms
stagger, through Framer Motion. These reveals are *scroll-driven*:
`animation-timeline: view()`, with no time axis for a duration or an easing to
act on — the reader's own scrolling is the clock, and an ease on top of it reads
as lag. `linear` is correct there, the stagger is a shifted range, and 4% of
`cover` already works out at about the offset the brief wants. Nothing is
measured on the main thread, and `check:motion` walks every page asserting each
revealed element reaches its settled state — 2,409 of them.

What the brief did add was the **blur-to-sharp**: `filter: blur(6px) → 0` on the
`mk-rise` keyframe. It is scoped to that one keyframe, which only `.mk-rise`
and `.mk-seq > *` use — section and card arrivals, the brief's own scope — and
deliberately not on the word-level reveals, because a blur re-rasterises the
element every frame.

**The hero background is CSS, not WebGL.** The brief allows this where WebGL
would be overkill, and it is: the hero is above the fold on a page whose §7
asks for Lighthouse ≥ 90 on mobile, and a GL context costs a shader compile, a
composite layer and a rAF loop before the headline paints. `.mk-aurora` is
three radial gradients on one element drifting on a 32s loop, masked out at the
bottom. No script, no canvas.

## 4. What is built, and what is not

Built: the token layer, the type scale, buttons, the bento cell, the framed
preview, the section seam, the hero aurora, the transparent fading header, and
the conversion of the whole traced homepage off its hardcoded light values.

**Not yet built**, from §4 and §8:

- The centred hero's **framed product preview** with a floating card or dock
  over it. The hero is already centred and its measure now fits 88px type in
  two lines, but the product window below it is the existing scene, not the
  brief's outer frame.
- The **showcase cell** with Instagram-style segmented progress bars.
- The **code viewer** with line numbers, a filename tab and a Code/Preview
  toggle with a typing caret.
- The **count-up stat** and the **word-by-word scroll-linked highlight** on the
  social-proof sentence, and the **logo strip** — all three are the blocks with
  no truthful content yet. The stat and strip are to ship as labelled
  placeholders; the numbers and client logos are owed by the owner.
- The **dot-matrix logo** band in the footer. Declined as drawn: §12 of the
  design system is explicit that the logo is its files, never redrawn or
  recoloured. It can be a typographic or pattern band instead, using
  `markyos-pattern-white.png`, which already ships.
- The header's **search trigger with a ⌘K chip**. There is no search on this
  site, and a control that does nothing is worse than an absent one.

## 5. The gates

`npm run check` and `npm run check:live` both pass. Two gates were changed:

- **`WEIGHT_CEILING` in `scripts/check-design-rules.mjs` went from 500 to
  700.** The rule still exists and still fails 800 and 900 — the ceiling moved,
  not the check.
- Nothing else was relaxed. The 12px type floor, logical-properties-only, the
  raw-hex ban, the Arabic-face rule, the one-icon-system rule and the no-emoji
  rule all still pass as written.
