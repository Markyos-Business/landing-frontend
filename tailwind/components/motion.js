export const motionStyles = [
  /* Grids and scroll motion. Imported by tailwind/, in order. */
  /* ── Grids ───────────────────────────────────────────────────────────────── */
  /*
   * The reference's gutter is 16px between cards, everywhere, in every grid.
   * That tightness is deliberate: a bento of eight step cards reads as one
   * object at 16px and as eight loose rectangles at 32px.
   */
  { ".mk-grid": {
    "display": "grid",
    "gap": "1rem",
  } },
  /* ── Motion: the page answers the scroll ─────────────────────────────────────
   *
   * Added 4 Nov 2026, asked for directly: the pages were static and read as
   * static. MARKYOS-DESIGN-SYSTEM.md §13 forbids "entrance animations,
   * parallax or scroll effects", and §13 is one of the sections that file's own
   * header marks as superseded for the website — but the part of that rule that
   * was never about taste is kept. Nothing here moves a thing you are aiming
   * at, nothing changes layout, nothing is animated that a reader is already
   * reading, and the whole vocabulary is two properties: `opacity` and
   * `translate`, both composited, neither able to reflow a page.
   *
   * ── Why there is no JavaScript in this ──────────────────────────────────────
   *
   * The obvious build is an IntersectionObserver that adds a class when an
   * element enters. It has one failure mode that outweighs everything it buys:
   * the *hidden* state has to live in this stylesheet, so if the script does
   * not run — a chunk that 404s, a hydration error, a reader with JS off, a
   * crawler that does not execute it — the page is a header above a blank. A
   * scroll-driven animation cannot fail that way. Where `animation-timeline` is
   * not supported the `@supports` block is dropped whole, every element keeps
   * its own styles, and what renders is the page as it shipped yesterday.
   *
   * It is also the more honest reading of "interactive". The animation is
   * *driven* by the scroll position rather than triggered by it, so it follows
   * the reader's hand in both directions instead of firing once and then
   * ignoring them.
   *
   * ── `backwards`, not `both`, and the keyframes have no `to` ─────────────────
   *
   * The first version of this used `animation-fill-mode: both` and a comment
   * claiming that `from`-only keyframes leave a settled element computing
   * `translate: none`. Measured, they do not: a settled `.mk-slide-end` reports
   * `translate: 0px` and a settled word reports `filter: blur(0px)`. Neither is
   * `none`, and the difference is not cosmetic — a translate of any value, zero
   * included, makes an element a containing block for its absolutely and fixed
   * positioned descendants and a stacking context for all of them, which is
   * what every `.mk-glow` pool and `.mk-spark` glint on the page is positioned
   * and painted against. A no-op `blur(0px)` is worse per element: it is real
   * compositing work, on eighty-three inline spans on the homepage, for ever.
   *
   * `backwards` fills only *before* the range. Below the fold the from-state
   * still applies, which is the whole mechanism; past the range the animation
   * stops being in effect and the element is left with its own styles —
   * `translate: none`, `filter: none`, `opacity: 1`. The settled page is then
   * byte-for-byte the page that shipped before any of this existed, which is
   * also the strongest form of the claim this block makes about failing safe.
   *
   * The `to` is still absent, and now only for the reason that it is not
   * needed: the end state is the element's own.
   */
  { "@keyframes mk-rise": {
    "from": {
      "opacity": "0",
      "translate": "0 var(--mk-rise-y, 1.25rem)",
    },
  } },
  /*
   * One row of a table, arriving.
   *
   * Opacity and nothing else, which is the one keyframe here that is a
   * restriction rather than a choice: `translate` on a `table-row` is not
   * interpolable in any engine — the row is laid out by the table's own
   * algorithm, not by its own box — so a row given `mk-rise` fades correctly
   * and never moves, which reads as a flicker rather than as an arrival.
   *
   * A table does not need the travel anyway. Rows are a vertical list, so each
   * one crosses the viewport at its own moment and the cascade is the
   * *position*, not a stagger: see `.mk-seq-rows`, which is the only container
   * here with no `nth-child` offsets at all.
   */
  { "@keyframes mk-fade": {
    "from": {
      "opacity": "0",
    },
  } },
  /* One word of a kinetic heading. No transform — see .mk-words below for the
   bidi reason, which is not a preference. */
  { "@keyframes mk-word": {
    "from": {
      "opacity": "0",
      "filter": "blur(4px)",
    },
  } },
  /* A facing column, arriving from its own edge. `--mk-slide-sign` is which
   side of the pair; `--mk-dir` is the locale. */
  { "@keyframes mk-slide": {
    "from": {
      "opacity": "0",
      "translate": "calc(var(--mk-slide-x) * var(--mk-slide-sign) * var(--mk-dir)) 0",
    },
  } },
  /* The same two moves without the fade, for a block whose words do the fading
   themselves. See the `:has(.mk-words)` rules for why they cannot both. */
  { "@keyframes mk-move": {
    "from": {
      "translate": "0 var(--mk-rise-y, 1.25rem)",
    },
  } },
  { "@keyframes mk-slide-move": {
    "from": {
      "translate": "calc(var(--mk-slide-x) * var(--mk-slide-sign) * var(--mk-dir)) 0",
    },
  } },
  /*
   * A decorative layer that keeps moving the whole time it is on screen.
   *
   * Every other keyframe here is an *arrival*: it runs across the first third
   * of the element's crossing and then the element is where the layout put it.
   * That is the right grammar for content and the wrong one for light, and it
   * is why the page could still read as static after three passes of adding
   * reveals — fourteen sections each of which finishes moving before you have
   * finished scrolling past it is fourteen static sections with an entrance.
   *
   * This runs across the *whole* crossing instead, so the travel is symmetric
   * about the settled position and the middle of the viewport is the only place
   * the layer is where the layout put it. It is parallax, which the design
   * system's §13 forbids and its own header marks as superseded for the
   * website; the part of that rule that was never about taste still holds, so
   * this is only ever on things nobody is reading — light pools, the closing
   * panel's two lens shapes, the problem section's figures.
   */
  { "@keyframes mk-drift": {
    "from": {
      "translate": "var(--mk-drift-x, 0) var(--mk-drift-y)",
    },
    "to": {
      "translate": "var(--mk-drift-x, 0) calc(-1 * var(--mk-drift-y))",
    },
  } },
  /*
   * Arrival with depth — the panel comes forward as well as up.
   *
   * For the heavy objects: the closing panel, the comparison table, the dial, a
   * product mock. A 1120px panel cannot travel far enough on the block axis to
   * read as arriving without the page looking loose, which is the compromise
   * `.mk-rise-soft` exists to admit. Scale does not have that problem: 3.5% of
   * a wide panel is 40px of edge travel while its centre barely moves.
   *
   * It is the one keyframe here that is not free. `scale` on a composited layer
   * is a GPU transform, so text inside it is resampled while it runs and lands
   * sharp — which is why this is on panels and never on a heading, where the
   * resample would be the whole of what you are looking at.
   */
  { "@keyframes mk-pop": {
    "from": {
      "opacity": "0",
      "scale": "var(--mk-pop-from, 0.965)",
      "translate": "0 var(--mk-rise-y, 0.5rem)",
    },
  } },
  /* The same depth without the fade, for a panel whose own contents fade. The
   `:has()` rules below say why the two cannot both. */
  { "@keyframes mk-pop-move": {
    "from": {
      "scale": "var(--mk-pop-from, 0.965)",
      "translate": "0 var(--mk-rise-y, 0.5rem)",
    },
  } },
  /* A rule drawing itself from its start edge. `transform-origin` is physical —
   CSS has no logical one — so `.mk-draw` is flipped for RTL below. */
  { "@keyframes mk-draw": {
    "from": {
      "scale": "0 1",
    },
  } },
  /* Which edge a self-drawing rule grows from. Physical, and therefore stated
   twice — see `.mk-draw` below. */
  { ".mk-draw": {
    "transform-origin": "0 50%",
  } },
  { "[dir=\"rtl\"] .mk-draw": {
    "transform-origin": "100% 50%",
  } },
  { "@media (prefers-reduced-motion: no-preference)": {
    "@supports (animation-timeline: view())": {
      /*
       * The two classes.
       *
       *   .mk-rise   reveal the element this is on.
       *   .mk-seq    reveal this element's direct children, staggered. It does
       *              not animate itself, so a grid of cards is one class on
       *              the grid and nothing on the cards.
       *
       * ── The range is `cover`, and it was `entry` first ────────────────────
       *
       * `entry` is the obvious choice and the wrong one. It spans the element
       * crossing the viewport's trailing edge, so its *length in scrolled
       * pixels is the element's own height* — which makes the reveal's duration
       * a function of how big the thing is. An 81px article row revealed over
       * 27px of scroll, which at a normal wheel speed is one frame: the row did
       * not appear to animate, it appeared to appear. A 600px grid in the same
       * stylesheet took 200px. Measured on /blog, /guides and /help, where the
       * check reported nothing ever caught mid-reveal and was right.
       *
       * `cover` spans the element's whole crossing of the viewport, so its
       * length is the viewport height *plus* the element's — on a 900px screen
       * that is 981px for the row and 1500px for the grid, and 36% of each is
       * 343px and 525px. Same order of magnitude for both, which is what makes
       * one number work for a page built out of elements of every size. The
       * row now finishes at 62% down the screen and the grid at 42%; a 2000px
       * section finishes as its top leaves the top edge, which is the limit of
       * what a single reveal can do and the reason tall things get `.mk-seq`
       * instead and pass the reveal to their parts.
       *
       * The cost of a longer range is that it can outrun a short page: an
       * element flush with the bottom of the document would need to be ~500px
       * tall to reach 36% before the scroll runs out, and a shorter one would
       * stop part-faded and stay there. Nothing is flush with the bottom — the
       * footer is always below — but that is a fact about this site's layout
       * and not a property of the rule, which is why the check walks every
       * page and asserts every revealed element reaches full opacity.
       */
      ".mk-rise, .mk-seq > *": {
        "animation": "mk-rise linear backwards",
        "animation-timeline": "view()",
        "animation-range": "cover 0% cover 36%",
      },
      /*
       * The stagger.
       *
       * `animation-delay` is ignored on a scroll-driven animation — there is no
       * time axis to delay along — so a stagger is a shifted range, and the
       * shift has to be small: 4% of `cover` is about 40px of scroll, which at
       * a normal wheel speed is the ~100ms offset a staggered reveal wants.
       *
       * It cycles every three children rather than ramping 1..n, because the
       * children of one grid *row* share a progress — they cross the edge
       * together — while separate rows already stagger themselves. A 1..n ramp
       * would give the eighth card of a three-column grid a 28% offset, which
       * on a row that arrives all at once reads as a card that forgot to come.
       * Three is the column count almost every grid here uses. A four-column
       * row repeats the first offset on its fourth card; at 4% that is below
       * the distance anybody sees.
       */
      ".mk-seq > :nth-child(3n + 2)": {
        "animation-range": "cover 6% cover 42%",
      },
      ".mk-seq > :nth-child(3n)": {
        "animation-range": "cover 12% cover 48%",
      },
      /*
       * A table filling in, row by row.
       *
       * The comparison tables are the largest single objects on this site — the
       * homepage's is 1858px of section and /pricing's is 1449px — and until
       * now each arrived as one slab: eleven rows of a close argument, all
       * reaching full opacity together, in a section tall enough that the
       * reveal was over before the reader had read the second row.
       *
       * Row by row is also the honest reading of what a comparison table is.
       * Each row is one claim, and the reader takes them in order.
       *
       * ── No stagger offsets, unlike every other container here ───────────
       *
       * `.mk-seq`'s `nth-child` shifts exist because the children of one grid
       * *row* share a scroll progress — they cross the viewport edge together,
       * so without a shift they arrive as a slab. Table rows never share a
       * progress: they are stacked, so each one's `cover` range begins at its
       * own position and the cascade is already there. Adding offsets on top
       * would un-stagger it, by pushing every third row later than the row
       * beneath it.
       *
       * The subject has to be the row and not the cell: a `<td>`'s `cover`
       * range is its row's, so cells would all arrive together anyway, and the
       * one property that works here cannot be applied per cell without
       * showing the row's background through the gaps.
       */
      ".mk-seq-rows > *": {
        "animation": "mk-fade linear backwards",
        "animation-timeline": "view()",
        "animation-range": "cover 0% cover 30%",
      },
      /*
       * Kinetic headings: the words resolve one after another.
       *
       * The 2026 pattern, and the one the market has settled on for editorial
       * pages — masked or staggered split text, word by word, on the display
       * line only. The advice that comes with it is to animate the message
       * hierarchy rather than every character, which is why this is on
       * headlines and nowhere near body copy: a paragraph that assembles itself
       * while you read it is a paragraph you read twice.
       *
       * ── Why the words fade and sharpen but do not move ────────────────────
       *
       * Every split-text implementation makes each word `inline-block`, because
       * `translate` does not apply to a non-replaced inline box. That is
       * unusable here, and not marginally. This page is Arabic, every heading
       * block is `unicode-bidi: plaintext`, and plaintext decides the block's
       * direction by scanning for its first strong character — an `inline-block`
       * is *atomic* to that scan whatever its `unicode-bidi` says, so the
       * algorithm would see a row of object replacement characters, find no
       * strong character at all, fall back to left-to-right, and send every
       * Arabic headline on the site to the wrong edge. That is the bug that
       * already cost 250 blocks here; see the `.mk-atomic` note above, which is
       * the same failure arriving through `inline-flex`.
       *
       * `opacity` and `filter` apply to inline boxes and change nothing about
       * bidi, so the words stay transparent to the scan and the heading keeps
       * resolving its own direction. The motion is the block's: a heading
       * carrying `.mk-words` is almost always inside a `.mk-rise` or a
       * `.mk-slide-*`, so the line moves as one thing and the words resolve
       * within it. Which is the better reading of the effect anyway — the
       * sentence arrives, then the words land.
       *
       * The blur is 4px, deliberately small. Stacked blur is the one thing the
       * trend writing is consistently negative about, on phones especially, and
       * at display sizes 4px is already the difference between a word and a
       * smudge.
       */
      ".mk-words > *, .mk-word-at": {
        "animation": "mk-word linear backwards",
        "animation-timeline": "view()",
        /*
         * `--i` is the word's index, set on the span. 1.4% of `cover` is about
         * 14px of scroll — near the bottom of the 0.08–0.14s line stagger the
         * editorial references use, which is right for words rather than lines.
         * A twelve-word headline therefore spans 17% of its own cover range,
         * well inside the 30% the last word finishes at.
         */
        "animation-range": "cover calc(6% + var(--i) * 1.4%) cover calc(30% + var(--i) * 1.4%)",
      },
      /*
       * Above the fold, where there is no scroll to be driven by.
       *
       * `.mk-load` is one element arriving on a clock; `.mk-seq-load` is a
       * container whose children arrive one after another on the same clock.
       * They exist for the same reason `.mk-words-load` does: a `cover` range
       * completes before the page has been scrolled at all, so everything on
       * the first screen — the hero's lead, its two doors, its microcopy, the
       * row of tools it replaces, and the whole head of every content page —
       * was reaching the reader already finished.
       *
       * 120ms apart, which is the middle of the 0.08–0.14s the editorial
       * references use for a line stagger, and 560ms each. The first child
       * starts at 0 rather than after a delay: the headline is the LCP element
       * on most of these pages, and an element at opacity 0 is not counted as
       * painted, so nothing in the sequence may push it later. Measured — the
       * number is in docs/UIUX-AUDIT.md.
       *
       * Capped at the sixth child. A seventh arriving 840ms after the page
       * opened is not a cascade any more, it is a queue.
       */
      ".mk-load, .mk-seq-load > *": {
        "animation": "mk-rise 420ms var(--mk-ease) backwards",
        "animation-timeline": "auto",
        "animation-delay": "0ms",
      },
      ".mk-seq-load > :nth-child(2)": {
        "animation-delay": "80ms",
      },
      ".mk-seq-load > :nth-child(3)": {
        "animation-delay": "160ms",
      },
      ".mk-seq-load > :nth-child(4)": {
        "animation-delay": "240ms",
      },
      ".mk-seq-load > :nth-child(5)": {
        "animation-delay": "320ms",
      },
      ".mk-seq-load > :nth-child(n + 6)": {
        "animation-delay": "400ms",
      },
      /*
       * Rises, but never fades.
       *
       * For the largest block of text above the fold — whichever one the
       * browser picks as the Largest Contentful Paint, which on these pages is
       * the hero lead or the page title. An element at opacity 0 is not
       * counted as painted, so LCP lands on the moment its fade ends: with the
       * cascade on it measured 836ms against a 340ms control, and the whole
       * 496ms of that was one paragraph waiting its turn. Moving it without
       * fading it puts LCP back at 340ms — measured, three arms, five loads
       * each — and costs almost nothing visually, because at this size a 20px
       * rise already reads as arrival.
       *
       * It has to sit below the rules it overrides: it is one class against
       * their one class, so it wins on source order alone.
       */
      ".mk-load-move": {
        "animation-name": "mk-move",
      },
      /*
       * The hero, which has no scroll to be driven by.
       *
       * Every other headline here resolves against its own scroll position,
       * which is exactly right for the fourteen sections below the fold and
       * useless for the one above it: a `cover` range completes before the page
       * has been scrolled at all, so the first thing a visitor saw was the only
       * thing on the page that never moved. This is the one clock-driven
       * timeline on the site, and it is scoped to that one line.
       *
       * 55ms a word and 520ms each, so a ten-word headline finishes a little
       * over a second in — inside the 0.8–1.1s the editorial references use for
       * a reveal, and with the stagger at the top of their 0.08–0.14s line
       * range because words are smaller units than lines.
       *
       * `backwards` and not `forwards`: the fill has to cover the *delay*, or
       * every word but the first flashes at full opacity before its turn. After
       * the animation ends nothing is filled, so the settled line carries no
       * filter — the same reason the scroll-driven rules use it.
       *
       * What it costs: the headline is the hero's LCP element, and an element
       * at opacity 0 is not counted as painted. The first word begins fading at
       * t=0 rather than after a delay precisely so that LCP lands on the first
       * word and not on the last. Measured before and after, and recorded in
       * docs/UIUX-AUDIT.md.
       */
      ".mk-words-load > *, .mk-word-at-load": {
        "animation": "mk-word 520ms var(--mk-ease) backwards",
        "animation-timeline": "auto",
        "animation-delay": "calc(var(--i) * 55ms)",
      },
      /*
       * Facing columns arrive from their own edges.
       *
       * The inline axis, which is the one axis on this site that has to be
       * written with a sign rather than a direction: there is no logical
       * translate in CSS, so `--mk-dir` carries the locale and `--mk-slide-sign`
       * carries which side of the pair this is. Start-side content begins
       * displaced toward the start edge — left in English, right in Arabic —
       * and the end-side column begins toward the end edge and lands fractionally
       * later, so a two-column block reads as opening rather than as two things
       * appearing.
       *
       * The distance is clamped rather than fixed because it is the one piece of
       * motion here that can reach past the page: a block inside `.mk-container`
       * sits 24px from the viewport edge at its narrowest, so a fixed 24px slide
       * would put the end-side column exactly on the edge at 320px and a
       * horizontal scrollbar is one rounding error away. 10px there, 24px once
       * there is room for it. The overflow check walks 320–1920 at scroll 0,
       * where every below-the-fold element is still at its start offset — which
       * is exactly the worst case, so that check already tests this.
       */
      ".mk-slide-start, .mk-slide-end": {
        "--mk-slide-x": "clamp(0.625rem, 1.6vw, 1.5rem)",
        "animation": "mk-slide linear backwards",
        "animation-timeline": "view()",
        "animation-range": "cover 0% cover 38%",
      },
      ".mk-slide-start": {
        "--mk-slide-sign": "-1",
      },
      /*
       * Later than its partner, and it has to re-declare the range: the
       * `animation` shorthand above resets `animation-range` to `normal`, so a
       * range set by an *earlier* rule — the `.mk-seq` stagger, for one — does
       * not survive into here. Anything that gives one of these a range has to
       * do it after the shorthand, not before.
       */
      ".mk-slide-end": {
        "--mk-slide-sign": "1",
        "animation-range": "cover 5% cover 43%",
      },
      /*
       * A block whose heading resolves word by word moves, but does not fade.
       *
       * Two opacity animations multiply. A block at 0.8 holding words at 0.86
       * paints them at 0.69, so the headline spends half again as long
       * half-there and, on a near-white ground with near-black ink, reads as
       * washed rather than arriving. Caught by stepping the scroll across the
       * ecosystem headline and reading the computed opacities: the words ramped
       * correctly, 0.86 down to 0.51, and the line still looked grey.
       *
       * So one property each — the block carries the movement, the words carry
       * the fade. That is also the restrained version of the effect, which is
       * what every piece of writing about kinetic type asks for: animate the
       * message hierarchy, not everything at once.
       *
       * `:has()` takes the specificity of its argument, so each of these is
       * (0,2,0) against the (0,1,0) of the rule it overrides and wins on
       * specificity rather than on position. Only `animation-name` changes;
       * the timeline, range and fill still come from those rules — including
       * `.mk-slide-end`'s later range, which is why this sits below it.
       */
      ".mk-rise:has(.mk-words, .mk-seq, .mk-seq-rows, .mk-rise, .mk-seq-load, .mk-seq-pop), .mk-seq > :has(.mk-words, .mk-seq, .mk-seq-rows, .mk-rise, .mk-seq-load, .mk-seq-pop), .mk-seq-load > :has(.mk-words, .mk-seq, .mk-seq-rows, .mk-rise, .mk-seq-load)": {
        "animation-name": "mk-move",
      },
      ".mk-slide-start:has(.mk-words, .mk-seq, .mk-seq-rows, .mk-rise, .mk-seq-load, .mk-seq-pop), .mk-slide-end:has(.mk-words, .mk-seq, .mk-seq-rows, .mk-rise, .mk-seq-load, .mk-seq-pop)": {
        "animation-name": "mk-slide-move",
      },
      ".mk-pop:has(.mk-words, .mk-seq, .mk-seq-rows, .mk-rise, .mk-seq-load, .mk-seq-pop), .mk-seq-pop > :has(.mk-words, .mk-seq, .mk-seq-rows, .mk-rise, .mk-seq-load)": {
        "animation-name": "mk-pop-move",
      },
      /*
       * The end of the document, where `cover` cannot finish.
       *
       * A `cover` range is the viewport plus the element, and the scroll
       * available to an element at the bottom of the page is only whatever is
       * below it. For the footer's closing bar that is its own height — about
       * 6% of its cover range — so it stopped at 0.45 opacity and stayed
       * there, on every page. The block at the top of this file names this as
       * the cost of `cover` and says the walk is what would catch it; it did,
       * on /resources, the shortest page on the site.
       *
       * `entry` is the right unit here for exactly the reason it was the wrong
       * one everywhere else: its length is the element's own height, so the
       * scroll it needs is the scroll a bottom-flush element is guaranteed to
       * have. The ceiling is 69%, comfortably inside the 100% that arriving at
       * the foot of the page provides.
       */
      ".mk-rise-end, .mk-seq-end > *": {
        "animation-range": "entry 0% entry 45%",
      },
      ".mk-seq-end > :nth-child(3n + 2)": {
        "animation-range": "entry 12% entry 57%",
      },
      ".mk-seq-end > :nth-child(3n)": {
        "animation-range": "entry 24% entry 69%",
      },
      /*
       * Less travel, for a heavy block.
       *
       * A 1120px panel or a full-width picture sliding 20px reads as the page
       * being loose rather than as the panel arriving. Same fade, a third of
       * the distance.
       */
      ".mk-rise-soft": {
        "--mk-rise-y": "0.5rem",
      },
      /*
       * Continuous motion.
       *
       * `.mk-drift` is the one class here that is not an arrival — see the
       * keyframe's note. It is applied in CSS rather than at call sites,
       * because its whole constraint is *what* it may be on: light pools, the
       * closing panel's two lens shapes, and the problem section's figures.
       * Named selectors, so the rule and the list of things allowed to drift
       * are the same line of code and cannot drift apart.
       *
       * ── The inline axis has to survive it ────────────────────────────────
       *
       * `.mk-center-x` centres a pool with `translate: calc(-50% * var(--mk-dir)) 0`,
       * and an animation on `translate` replaces the whole property — so the
       * first version of this sent every centred light pool on the site half
       * its own width off to one side, in Arabic to the other side, for the
       * entire crossing. There is no additive `translate` in CSS, so the
       * keyframes carry an inline component from `--mk-drift-x` and the
       * centring rule sets it. Anything else that positions with `translate`
       * has to do the same.
       */
      ".mk-drift, .mk-glow, .mk-deep-wave, .mk-pain-art": {
        "--mk-drift-y": "1.25rem",
        "animation": "mk-drift linear backwards",
        "animation-timeline": "view()",
        "animation-range": "cover 0% cover 100%",
      },
      /*
       * `backwards` and not `both`, for the reason the block at the top of this
       * file gives: `both` would leave a settled layer holding a real
       * `translate`, which makes it a containing block and a stacking context
       * for every `.mk-glow` and `.mk-spark` positioned against it. Here that
       * also means the snap back to `translate: none` happens at `cover 100%`
       * — the instant the element's end edge passes the viewport's start edge,
       * which is to say entirely off screen.
       */
      /* Light travels further than the thing it lights, which is what makes it
       read as being behind it. */
      ".mk-glow": {
        "--mk-drift-y": "2.5rem",
      },
      /* The two lens shapes in the closing panel drift against each other, so
       the panel breathes rather than slides. */
      ".mk-deep-wave-a": {
        "--mk-drift-y": "1.75rem",
      },
      ".mk-deep-wave-b": {
        "--mk-drift-y": "-1.75rem",
      },
      /*
       * The three decay illustrations on the problem section.
       *
       * These were the last pictures on the homepage that never moved, and
       * they are the three the page can least afford to have still: an old logo
       * on a slide somebody is still presenting, the same line drifting apart
       * in two languages, the same question asked three times. A static drawing
       * of drift is a drawing of a thing that has already finished happening.
       *
       * They qualify under the constraint the keyframe sets — nobody reads
       * these, they are figures with their own captions underneath, and each
       * sits inside a clipped 200px frame whose dotted ground stays put while
       * the art moves within it. Named here rather than given the generic `.mk-drift` at
       * the call site so that this rule stays the list of what may drift.
       *
       * The third one goes the other way, so three cards in a row are not one
       * object breathing.
       */
      ".mk-pain-art-b": {
        "--mk-drift-y": "-0.6rem",
      },
      /*
       * Depth on arrival, for the heavy objects.
       *
       * Same two classes as the rest of this file: `.mk-pop` on the thing,
       * `.mk-seq-pop` on a container whose children should each do it. The
       * range is the `.mk-rise` range — a panel and the paragraph beside it
       * should arrive together, and changing the range as well as the keyframe
       * would make this a second reveal rhythm rather than a second texture.
       */
      ".mk-pop, .mk-seq-pop > *": {
        "animation": "mk-pop linear backwards",
        "animation-timeline": "view()",
        "animation-range": "cover 0% cover 40%",
      },
      ".mk-seq-pop > :nth-child(3n + 2)": {
        "animation-range": "cover 6% cover 46%",
      },
      ".mk-seq-pop > :nth-child(3n)": {
        "animation-range": "cover 12% cover 52%",
      },
      /* Less depth, for something closer to the reader's eye than a panel. */
      ".mk-pop-soft": {
        "--mk-pop-from": "0.985",
      },
      /*
       * A rule that draws itself.
       *
       * The one piece of motion here that is not a reveal of the element it is
       * on — it *is* the element, so it is the one that must not have a resting
       * from-state. There is none: `backwards` fills `scale: 0 1` only before
       * the range, and past it the element is at its own `scale: 1 1`. A
       * browser without `animation-timeline` therefore draws the whole rule,
       * which matters more here than anywhere else in this file — a missing
       * reveal is just a page, and a missing divider is a layout that looks
       * broken.
       *
       * Only `transform-origin` is declared at rest, outside the `@supports`,
       * because it is physical: CSS has no logical `transform-origin`, so the
       * rule has to be told which edge to grow from in each direction.
       */
      ".mk-draw": {
        "animation": "mk-draw linear backwards",
        "animation-timeline": "view()",
        "animation-range": "cover 4% cover 34%",
      },
      /*
       * The opt-out, and it has to be last.
       *
       * `.mk-seq > .mk-still` and `.mk-seq > :nth-child(3n)` are both (0,2,0) —
       * a `:nth-child()` counts as a class — so this wins on source order
       * alone. That is exactly the kind of override this file has already had
       * go dead once: see the note on `.mk-btn.mk-outline::after`. Anything
       * inserted between here and the stagger above, at this specificity,
       * silently un-exempts every `.mk-still` on the site.
       */
      ".mk-still, .mk-seq > .mk-still, .mk-seq-rows > .mk-still, .mk-seq-pop > .mk-still": {
        "animation": "none",
      },
    },
  } },
  /*
   * Paper has no scroll position.
   *
   * This is the failure the comment at the top of this block says a
   * scroll-driven reveal cannot have, and it was wrong: printing is not a
   * browser that lacks `animation-timeline`, it is the same browser with the
   * same stylesheet and a timeline whose progress stays wherever the reader
   * left it. Printing the homepage from the top put 69 of its 77 revealed
   * elements on the page below full opacity — most of the site, faded out or
   * gone, on paper and in any "save as PDF".
   *
   * Found by emulating print media and counting, which is the only way to see
   * it: every on-screen check passes, because on screen it is correct.
   *
   * ── Why `!important`, which nothing else here needs ──────────────────────
   *
   * This block used to rely on source order: a media query adds no
   * specificity, so an identical selector further down the file wins. That
   * stopped being true the moment the `:has()` rules above were written. A
   * `:has()` takes the specificity of its argument, so
   * `.mk-rise:has(.mk-words, …)` is (0,2,0) against this rule's (0,1,0) and
   * beats it outright — and because those rules set only `animation-name`, to
   * a *translate-only* keyframe, the elements they cover were not faded on
   * paper, only displaced. Which is why the print check, which counted faded
   * elements, passed for as long as it did: 51 blocks across six routes were
   * printing 20px out of position and nothing was looking for that.
   *
   * Specificity is the wrong tool for a rule whose job is "whatever else this
   * stylesheet says, not on paper". `!important` is the right one, and it is
   * the same reason the reduced-motion block below uses it. Matching the
   * `:has()` selectors here instead would work until the next one is added.
   */
  { "@media print": {
    ".mk-rise, .mk-seq > *, .mk-seq-rows > *, .mk-words > *, .mk-word-at, .mk-slide-start, .mk-slide-end, .mk-load, .mk-seq-load > *, .mk-pop, .mk-seq-pop > *, .mk-drift, .mk-glow, .mk-deep-wave, .mk-draw, .mk-hero-chip, .mk-hero-cover, .mk-hero-deck-label, .mk-hero-window, .mk-hero-pane": {
      "animation": "none !important",
    },
  } },
];
