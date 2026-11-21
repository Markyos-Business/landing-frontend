export const heroStyles = [
  /*
   * The shader's host.
   *
   * Same box the gradient aurora occupied: the whole hero, behind everything.
   * The mask is on the host rather than inside the shader because the shader
   * has no idea how tall the section it is lighting is.
   *
   * ── Top to bottom, 19 Nov 2026 ──────────────────────────────────────────
   *
   * The mask held `#000 58%` and the light sat at 80% of the frame with a
   * narrow spread, so the field was a band low in the hero and the top two
   * thirds were flat canvas. Asked for the full height. The mask now holds
   * to 84% and only feathers the last sixth -- enough to stop the field
   * ending on a line where the hero meets the section below it, which is the
   * same seam `.mk-aurora` and `.mk-hero-wash` were both fixed for.
   */
  { ".mk-hero-shader": {
    "position": "absolute",
    "inset": "0",
    "pointer-events": "none",
    "z-index": "0",
    "mask-image": "linear-gradient(to bottom, #000 0%, #000 84%, transparent 100%)",
    "opacity": "0.8",
  } },
  /*
   * A scrim over the shader, under the copy.
   *
   * The ribbon is beautiful and it is also light directly behind text. The
   * headline survives at 88px/700; the 17px subtitle and the 13px microcopy
   * do not. This darkens the band the copy occupies -- strongest through the
   * middle, gone at the edges -- so the composition still reads as lit while
   * the words keep their contrast.
   */
  { ".mk-hero-shader::after": {
    "content": "\"\"",
    "position": "absolute",
    "inset": "0",
    /*
     * Widened and deepened with the light, 19 Nov 2026.
     *
     * It was `64% 40% at 50% 40%` ending at 80% canvas, which was enough when
     * the lit band sat at 80% of the frame and the copy had the top two
     * thirds to itself. With the light across the whole height the copy is
     * *in* it, so the scrim has to do the work the placement used to: 74% x
     * 50% centred on the copy block, 90% canvas at its core.
     *
     * Still a radial and still gone by 88%, so the flanks stay lit. The
     * ribbon reads at the edges of the frame and the words sit on ground.
     *
     * 58% tall, not 50%, and centred at 38% rather than 36%: the copy block
     * is a fixed stack of elements and the hero is not, so the lower the
     * viewport width the further down the hero the microcopy falls. At 1024
     * it sits at 63% of the section against an ellipse that ended at 61%,
     * and English -- a longer line across more of the frame -- measured
     * 4.45:1 there against the 4.5 it needs. The ellipse reaches 67% now.
     */
    "background": "radial-gradient(76% 58% at 50% 38%, color-mix(in oklab, var(--canvas) 90%, transparent) 0%, color-mix(in oklab, var(--canvas) 54%, transparent) 54%, transparent 88%)",
  } },
  /* The hero stage. Registered by tailwind.config.js, in order. */
  /* ── The hero stage ──────────────────────────────────────────────────────
   *
   * Copy deck v3 §3. The hero is the first frame of the product story rather
   * than a headline over a picture: the words sit on top, the demo brand's
   * published hub peeks up from the bottom edge, and two cards float beside
   * the two headline lines. Before reading a word, a visitor has seen files go
   * in and a brand come out.
   *
   * ── One stage, one origin ────────────────────────────────────────────────
   *
   * §3.3: the cards and the window are siblings in the same container, and the
   * cards are positioned from that container's *centre* rather than from an
   * edge. "Resting beside the headline" is then an offset, so dropping a card
   * into the window later in the scroll story is a tween of two numbers toward
   * zero — not a hand-off between two coordinate systems, which is the version
   * that needs a measurement pass every time the copy rewraps.
   *
   * `--mk-dir` carries the locale's sign, so the studio's file stays on the
   * start side in both editions: beside the first headline line, which is the
   * line about studios. The window and the hub inside it do not mirror.
   *
   * ── What is deliberately not here ────────────────────────────────────────
   *
   * The deck specifies a near-black canvas and a translucent dark window,
   * copied from the reference it adapts. This site has shipped light since
   * 3 November, and `tailwind/tokens.js` keeps exactly one dark object on it — the
   * closing panel, so the page has something to close on. A dark hero would
   * make two and the page would open and close on the same note. So the
   * composition is the deck's and the ground is the site's: white window on
   * paper, lifted on the same soft blue-grey shadow every card here uses.
   */
  { ".mk-hero": {
    "position": "relative",
    "overflow": "clip",
    /*
     * The block end is not decoration: it is the run-out the covers are
     * pulled down into at the end of the scroll story, and the clip at the
     * bottom of it is what finally takes them.
     *
     * Both ends came down with the headline on 19 Nov 2026 -- they were
     * `clamp(96px, 11vw, 150px) clamp(130px, 13vw, 200px)`, so a 1440px
     * desktop spent 337px of a 900px viewport on padding before anything was
     * drawn. The run-out keeps the larger share, because that is the part
     * doing a job.
     */
    /*
     * The block end came down again when the covers went.
     *
     * It was never decoration: it was the run-out the three covers were
     * pulled down into at the end of the scroll story, and the clip at the
     * bottom of it was what finally took them. With one act and nothing
     * leaving the frame, that run-out is empty page under the product
     * window — on a phone it was most of a viewport of nothing between the
     * hero and the section after it. Ordinary section padding now, and the
     * same at both ends.
     */
    "padding-block": "clamp(72px, 7.5vw, 104px)",
    "padding-inline": "24px",
    /* On the section, not on an inner div: `text-align: start` left here makes
     the Arabic look left-aligned to anything measuring it, check:bidi
     included. */
    "text-align": "center",
  } },
  { ".mk-hero-stage": {
    "position": "relative",
    "max-inline-size": "1080px",
    "margin-inline": "auto",
  } },
  { ".mk-hero-head": {
    "position": "relative",
    /* Above the cards, so a card drifting under the measure never lands on a
     word or swallows a click meant for a door. */
    "z-index": "2",
    /*
     * 52rem, up from 40rem on 18 Nov 2026.
     *
     * The brief puts the hero headline at clamp(44px, 6vw, 88px) and says it
     * is two lines. At 40rem it was not: 640px of measure at 88px took
     * "Studios build it. Companies live it." to three lines, with the second
     * sentence breaking mid-clause. The Arabic fitted in two because its
     * headline is shorter set than the English one, which is exactly the
     * class of fault this codebase keeps finding -- a measure tuned against
     * one language's word lengths.
     *
     * 52rem is measured, not guessed: /pricing's two-line h1 renders 832px
     * wide at the same size, so the tier needs that much room. It stays
     * inside the brief's 1152px container with the gutters intact.
     *
     * 19 Nov 2026: the headline dropped from 88px to 68px, so the same two
     * lines now need 832 x 68/88 = 643px. 44rem (704px) holds them with room
     * over, and a narrower measure is the other half of the scale-down -- a
     * 68px headline across 832px reads as a wide banner rather than as a
     * block of display type.
     */
    "max-inline-size": "44rem",
    "margin-inline": "auto",
    "display": "flex",
    "flex-direction": "column",
    "align-items": "center",
  } },
  /*
   * The sub.
   *
   * §3.2 asks for about 0.45× the headline, which is the reference's ratio
   * (62/27). At this site's hero size that lands near 34px, which is a second
   * headline rather than a sub — the reference's headline is one short word and
   * ours is a two-line slogan. This keeps the direction of the change without
   * the arithmetic: noticeably larger than the site's 17–20px lead, still
   * clearly subordinate to the line above it.
   */
  { ".mk-hero-sub": {
    /*
     * Measured off docs/21st-reference/screenshots/01-hero.jpg, which is at
     * 1:1 with a 1150px desktop: the reference subtitle is one quiet grey
     * line of about 17px sitting ~26px under the headline, and it is narrow
     * enough that the eye reads it as a caption rather than as a paragraph.
     *
     * This was clamp(18, 1.9vw, 25) in a 34rem measure -- up to 25px, which
     * is section-lead size, not caption size, and it wrapped our longer
     * sentence onto three lines. 17px in a 40rem measure puts it on two,
     * which is as close as copy this long gets to the reference's one.
     */
    "margin-block-start": "22px",
    "max-inline-size": "40rem",
    "font-size": "clamp(16px, 1.3vw, 17px)",
    "line-height": "1.6",
    "color": "var(--text-muted)",
    "text-wrap": "pretty",
  } },
  /*
   * …and narrower in the band where the columns are at their floor.
   *
   * The note above `--mk-side-x` records this collision once already: the
   * columns stop closing in at a floor, the sub does not stop widening until
   * its measure, so between about 810px and 1200px the two meet. Spreading
   * the chips down the flanks brought the "Moodboard" chip level with the sub
   * and it met it again — measured on /en, 45px of overlap at 960 and 11px
   * at 1024, 1100 and 1152, with Arabic clear at all four because its words
   * are shorter. Third time this file has found a length tuned against one
   * language.
   *
   * The sub gives way rather than the columns, because the columns cannot:
   * at 810 — the last width before the scene switches off — pushing them far
   * enough out to clear a 40rem sub puts the widest chip past the viewport
   * edge.
   *
   * Two steps, because the columns have two floors and so does this. Solved
   * from the measurements rather than guessed: the sub's half-width has to
   * stay 12px clear of the nearest chip's left edge, which gives 36.4rem at
   * 1152, 36.1rem at 1280 and 31rem at 810. One step below 64rem where the
   * columns sit at 316px, one between 64 and 84 where they sit at 350, and
   * the full measure above that where there is room for it.
   *
   * The narrower rule is declared second so it wins the overlap by source
   * order, which is this file's standing convention.
   */
  { "@media (width < 84rem)": {
    ".mk-hero-sub": {
      "max-inline-size": "36rem",
    },
  } },
  { "@media (width < 64rem)": {
    ".mk-hero-sub": {
      "max-inline-size": "30rem",
    },
  } },
  { ".mk-hero-head .mk-doors": {
    "margin-block-start": "36px",
  } },
  { ".mk-hero-micro": {
    "margin-block-start": "20px",
    "font-size": "var(--fs-ui)",
    "color": "var(--text-faint)",
  } },
  /*
   * The scene is the stage's coordinate system, and the only thing in its flow
   * is the window — so its centre is the window's centre, which is what the
   * chips gather into and what the covers come out of. Without this one line
   * the fan and the deck anchor to `.mk-hero-stage` instead, whose centre is
   * 300px higher because the headline is in it, and the arc lands across the
   * subheadline.
   */
  { ".mk-hero-scene": {
    "position": "relative",
  } },
  /*
   * ── The hero headline's size, per script ────────────────────────────────
   *
   * One value served both languages — `clamp(38px, 6vw, 76px)` — and 76px is
   * an Arabic size. Copy deck v3 Part A §3 sets the Latin display at "about
   * 62px" and says the Arabic may be "the same size or one step larger",
   * which is the usual relationship between the two: Thmanya's letterforms
   * carry more ink per em than Inter's, and an Arabic line of the same
   * measure is shorter.
   *
   * At 76px the English headline — "Companies live it." — was 630px wide and
   * ran straight through the element chips beside it between 1024 and 1440.
   * The Arabic line is 490px at the same size and never touched them. So this
   * is not only a type-scale correction; it is what the collision was.
   *
   * The slope stays gentler than the Arabic's 6vw so the English cap holds
   * further down the viewport range instead of the line jumping a size.
   */
  /*
   * ── Scaled down for the desktop, 19 Nov 2026 ────────────────────────────
   *
   * This was `clamp(44px, 6vw, 88px)`, which is the brief's figure, and on a
   * 1440px desktop it resolves to 86.4px. Measured there: the Arabic headline
   * took three lines of 119px each, the hero section came to 1363px against a
   * 900px viewport, and nothing but the first line and a half of the headline
   * was above the fold. The owner's words were "too zoomed in and too big",
   * which is what a display size looks like when it was chosen against the
   * viewport width and then met a real sentence.
   *
   * 4.6vw with a 68px cap is still the oversized tight headline the brief
   * asks for -- it is larger than every other type size on the page by more
   * than three times -- and it is close to what the reference actually shows:
   * screenshots/01-hero.jpg is 1:1 at 1150px and its headline measures about
   * 66px. The floor comes down with it so the phone is not left relatively
   * larger than the desktop, and the slope is gentler so the cap holds across
   * more of the range instead of the line jumping a size at every breakpoint.
   *
   * Both editions take the same value, as they did before: the per-`lang`
   * split is kept because the two scripts have needed different sizes twice
   * and the line-height still differs (--mk-lh-hero, foundation.js).
   */
  { ":root": {
    "--mk-fs-hero": "clamp(38px, 4.6vw, 68px)",
  } },
  { "html[lang=\"en\"]": {
    "--mk-fs-hero": "clamp(38px, 4.6vw, 68px)",
  } },
  /* ── Act one: the brand's elements ───────────────────────────────────────
   *
   * Seven names, in two columns down the sides of the headline. Names and
   * nothing else: the hub's own sidebar vocabulary, so the thing a visitor
   * watches gather into the window is labelled with the words they will find
   * inside it.
   *
   * They flank the headline rather than sitting in an arc below it because
   * that is where the hero's floating objects have always been, and because
   * it is the longest travel available — from beside the first line all the
   * way down into the window, which is the whole of act one.
   *
   * ── The anchor is zero-sized on purpose ──────────────────────────────────
   *
   * Both the fan and the deck are a 0×0 box pinned at the scene's centre,
   * which makes every child's offset a vector from that one point. The
   * alternative — an inset-0 overlay with percentage positions — re-derives
   * the centre in every child and stops being the same centre the moment the
   * window's aspect changes.
   */
  { ".mk-hero-fan": {
    "margin": "0",
    "padding": "0",
    "list-style": "none",
  } },
  { ".mk-hero-fan": {
    "position": "absolute",
    "inset-inline-start": "50%",
    "inset-block-start": "50%",
    "inline-size": "0",
    "block-size": "0",
    /* Behind the headline, which is z-index 2, and over the window it is
     travelling into. */
    "z-index": "1",
  } },
  /*
   * One formula for everything on this stage.
   *
   * `- 50% * var(--mk-dir)` and not `- 50%`: `inset-inline-start: 0` against a
   * zero-width anchor puts the child's *start* edge on the centre point, and
   * which physical edge that is swaps with the locale while `translate` stays
   * physical. A fixed `- 50%` therefore centres correctly in English and
   * pushes the element a whole width sideways in Arabic — which is the bug
   * that put the old hero's file card on top of the Arabic headline.
   *
   * `rotate` carries the sign too, so the arc leans the way the page reads.
   */
  { ".mk-hero-chip": {
    "position": "absolute",
    "inset-block-start": "0",
    "inset-inline-start": "0",
    "translate": "calc(var(--mk-x) * var(--mk-dir) - 50% * var(--mk-dir)) calc(var(--mk-y) - 50%)",
    "rotate": "calc(var(--mk-r) * var(--mk-dir))",
  } },
  /*
   * A chip.
   *
   * `--mk-f` is the chip's share of the fan's half-width, set per chip in
   * `Hero.tsx`; the half-width itself is here, because it has to narrow with
   * the window like everything else in this hero and only the stylesheet knows
   * how wide the window is.
   */
  { ".mk-hero-chip": {
    /* How far out the column sits, how high above the window's centre it is,
     and how far apart its rows are. All three track the viewport: the
     headline is `clamp(38px, 6vw, 76px)`, so the gap it leaves at its sides
     and the height of the block above the window are both functions of the
     window, and a fixed column that clears the headline at 1440 runs
     through it at 1100. */
    /*
     * The floor matters more than the ceiling.
     *
     * 25vw shrinks the columns faster than the text between them shrinks: the
     * subheadline stops narrowing at its measure, so below about 1250px the
     * columns walked into it — "الاستراتيجية" sat on the Arabic sub at 1280
     * and 1200, and the English one from 1440 down. A floor holds the columns
     * still once the viewport is too narrow for them to keep closing in.
     *
     * Two floors, because one cannot be right at both ends: 350px clears the
     * subheadline's measure, and at 820px — the last width before the scene
     * is switched off — a 350px column would put the widest chip past the
     * viewport edge. 1024px is where the sub gets narrower and lets the
     * columns come back in.
     */
    "--mk-side-x": "clamp(316px, 28vw, 420px)",
    /*
     * ── The column spans the flank, 19 Nov 2026 ─────────────────────────
     *
     * This was `--mk-col-y: clamp(640px, 52vw, 800px)` with a fixed
     * `--mk-row-y: clamp(54px, 4.6vw, 70px)` pitch: a column 198px tall,
     * sitting 749px above the scene's centre at 1440. Measured there, the
     * seven chips occupied y -40 to 156 of a 1036px hero -- two tight
     * clusters jammed against the top edge, with the first of each column
     * clipped off it, and at 1920 the top chip was 92px above the section.
     *
     * The owner asked for them spread down the right and left sides. So the
     * pitch is gone and the column has a *height*: `--mk-span`, shared by
     * both flanks, with each chip at a fraction of it (see `chipAt` in
     * Hero.tsx). The two columns now start and end level even though one
     * holds four names and the other three.
     *
     * The span stops above the product window rather than running the hero's
     * full height, and that is a collision, not taste: the frame is 920px
     * wide inside a 1440px viewport, so it reaches x 260-1180 and the chips
     * sit at 252-360 and 1066-1187. They overlap it horizontally at every
     * width, and the only thing keeping them off it is being above it. The
     * numbers are solved for that: at 1440 the column runs y 88 to 620
     * against a window whose top edge is at 662.
     */
    /*
     * The cap is set by the header, and it is a measurement, not a feel.
     *
     * The column grows upward from a foot pinned near the window, so the
     * taller it is the higher its head reaches -- and the header is sticky
     * at y 0 with a 64px box, which is also where `.mk-hero` begins and
     * where its `overflow: clip` starts taking things.
     *
     * This read `clamp(380px, 34vw, 500px)`, and the note above it claimed
     * "500 leaves 38px of clearance at 1920 and 43px at 1440, measured".
     * Both figures were real; neither was a clearance. 38 was the top
     * chip's *absolute* y, so the chip began 26px above the hero -- its
     * crown sliced off by the clip, and the rest of the pill sitting in
     * the nav's band. Measured across eight widths in both editions, that
     * was six of the eight: the top chip of each column landed at y 30-54
     * at 820, 900, 1024, 1440, 1600 and 1920. Only 1150 and 1280 cleared,
     * which is why it survived a review -- those are the two widths a
     * laptop is most often read at.
     *
     * -- Why a slope and not a smaller flat cap --------------------------
     *
     * The head's distance above the scene's centre is `--mk-span + 211px`
     * by construction, and the scene's centre is wherever the headline and
     * the sub leave it: measured, 640px down the page at 820 and 772px at
     * 1920, because the display type grows with the viewport. So the room
     * over the column is itself a function of the width, and one flat cap
     * has to be the narrowest width's cap everywhere -- 320px of column
     * across a 1920px desktop with room for 450.
     *
     * `220px + 12vw` is that room, fitted to the eight measurements and
     * clamped at both ends. It leaves the top chip at y 90-146 across the
     * range in both editions: 26px under the header at the tightest width,
     * and never above it.
     *
     * The foot does not move, and that is algebra rather than luck:
     * `--mk-col-y` is `211px + span / 2`, so the bottom chip lands at
     * `span / 2 - col-y`, the span cancels, and the foot stays 211px above
     * the scene's centre whatever this length becomes. Measured after the
     * change, the column still clears the product window by 20-27px at
     * every width in both editions -- unchanged, because it cannot change.
     * That is the other constraint this one length has to satisfy, and the
     * one that has broken twice.
     */
    "--mk-span": "clamp(320px, calc(220px + 12vw), 450px)",
    /*
     * Derived from the span, not clamped beside it.
     *
     * Both were independent clamps for one build, and the two curves crossed:
     * at 1280 the column's foot landed at y 632 against a window whose top
     * edge is at 627, so two chips sat on the product frame. A second clamp
     * cannot be made to track the first at every width -- they are different
     * functions of the viewport, and the widths where they disagree are the
     * ones nobody looks at.
     *
     * So there is one length. The column's foot is pinned 211px above the
     * scene's centre, which is 44px above the window's top edge (the frame
     * renders 334px tall, so its top is 167px up), and the column grows
     * *upward* from there. The clearance is then the same 44px at every
     * width by construction rather than by three clamps agreeing.
     */
    "--mk-col-y": "calc(211px + var(--mk-span) / 2)",
    /* Every other chip sits a little further out, so a column reads as
     scattered rather than as a list box with the labels stripped off. 34px
     now the column is tall enough for the scatter to be visible. */
    "--mk-x": "calc((var(--mk-side-x) + var(--mk-b) * 34px) * var(--mk-f))",
    "--mk-y": "calc(var(--mk-k) * var(--mk-span) - var(--mk-col-y))",
    "border-radius": "var(--radius-pill)",
    "padding-block": "9px",
    "padding-inline": "16px",
    "background": "var(--surface-0)",
    "box-shadow": "var(--lift-card)",
    "font-size": "var(--fs-ui)",
    "font-weight": "500",
    "line-height": "1.2",
    "color": "var(--text)",
    "white-space": "nowrap",
  } },
  { "@media (width >= 64rem)": {
    ".mk-hero-chip": {
      "--mk-side-x": "clamp(350px, 28vw, 420px)",
    },
  } },
  /* ── Act two: the window ─────────────────────────────────────────────────
   *
   * It peeks: each pane is rendered at its own size and the frame clips it, so
   * what shows is the top of a real product rather than a shrunk picture of
   * one. The radius is the card radius on the two top corners only, because
   * the bottom two are off-screen.
   *
   * The gap above it is the hero's breathing room and nothing else now — the
   * chips moved out of it and up beside the headline on 6 Nov 2026.
   */
  { ".mk-hero-window": {
    "position": "relative",
    "z-index": "0",
    "display": "grid",
    /*
     * ~75px under the buttons, measured off screenshots/01-hero.jpg where the
     * frame's top edge breaks the fold just below them. It was clamp(140,
     * 12vw, 180), which left a dead band of empty page between the ask and
     * the product -- the one place the reference is deliberately tight -- and
     * then clamp(72, 7vw, 100), which came down again with the headline.
     *
     * The frame came down with it. At 1000x440 inside a 1080px stage it was
     * all but edge to edge, so the product window read as the page rather
     * than as an object on it; 920x400 leaves a margin either side and is
     * still the largest thing in the composition by a wide margin.
     */
    "margin-block-start": "clamp(56px, 5.5vw, 76px)",
    "margin-inline": "auto",
    "max-inline-size": "920px",
    "max-block-size": "400px",
    "overflow": "clip",
    /*
     * The outer frame of the brief's section 4.2: "outer frame radius ~28px,
     * hairline border, faint white fill, with a darker app window inset ~36px
     * inside it".
     *
     * Until now this element was the window itself -- panes sitting straight
     * on the page behind a top radius. In the reference
     * (screenshots/01-hero.jpg) there are plainly two boxes: a large pale
     * frame, and a darker product window floating inside it with a visible
     * margin all round. That inner/outer pair is most of what makes the
     * preview read as a *device* showing software rather than as a screenshot
     * pasted onto the page.
     *
     * So this is the frame now, and `.mk-hero-pane` below is the window. The
     * padding is the inset; it is clamped rather than the reference's flat
     * 36px because this frame is 1000px at most and shrinks to a phone.
     */
    "background": "var(--ghost-fill)",
    "box-shadow": "var(--lift-ring)",
    "padding": "clamp(10px, 1.6vw, 20px)",
    "padding-block-end": "0",
    "border-start-start-radius": "var(--radius-frame)",
    "border-start-end-radius": "var(--radius-frame)",
    /*
     * The bottom edge fades into the ground rather than ending.
     *
     * The frame used to run off the bottom of the section, so the clip was
     * the fold and read as "there is more of this below the screen". Now
     * there is 200px of run-out under it for the covers to be pulled down
     * into, and a hard-cropped card floating in white reads as a mistake.
     * This is the design system's own answer for product imagery (§8,
     * `--mk-fade-bottom`), re-stated here because that token is the black
     * site's and fades to #000.
     *
     * On the frame, not on the panes: the covers are the frame's siblings, so
     * they pass in front of the fade instead of dissolving with it.
     */
    "mask-image": "linear-gradient(to bottom, #000 72%, transparent 100%)",
  } },
  /*
   * The two panes, in one grid cell.
   *
   * The hub is the brand's centre, which is where the names are going. The
   * builder is what you open once they are all in — so it starts invisible and
   * the scroll layer below hands the window over to it. Stacked in a grid cell
   * rather than absolutely, so the frame is still sized by its contents.
   *
   * A hand-off and not a cross-fade: the two ranges barely overlap, because
   * both panes are dense product UI and fifty per cent of each on top of the
   * other does not read as one screen becoming another — it reads as a
   * rendering fault. The hub is gone at 330px of scroll and the builder starts
   * at 310.
   */
  { ".mk-hero-pane": {
    "grid-area": "1 / 1",
  } },
  /*
   * Below 810px the stage stops being a stage.
   *
   * The chips become a wrapped row above the window and the cascade is cut:
   * three 168px covers cannot be a cascade across a 342px measure, and
   * shrinking them to fit would render the cover type at a size the covers
   * were not designed at. The caption survives as a caption, which is the part
   * that was a claim rather than a picture.
   */
  { "@media (width < 50.625rem)": {
    ".mk-hero-fan": {
      "position": "static",
      "inline-size": "auto",
      "block-size": "auto",
      "display": "flex",
      "flex-wrap": "wrap",
      "justify-content": "center",
      "gap": "8px",
      "margin-block-start": "44px",
    },
    ".mk-hero-chip": {
      "position": "static",
      "translate": "none",
      "rotate": "none",
    },
    ".mk-hero-window": {
      "margin-block-start": "40px",
      "max-block-size": "300px",
    },
  } },
  /*
   * The entrance.
   *
   * Built from this stylesheet's own load vocabulary rather than from a
   * JavaScript animation library, for the reason written above
   * `@keyframes mk-rise`: the hidden state has to live in the stylesheet, and
   * a page whose first screen is invisible until a script runs is a page that
   * fails to a blank.
   *
   * Steps 1 and 2 are `.mk-seq-load` on the head, which already staggers its
   * children 80ms apart. The head's fourth child begins at 240ms and runs
   * 420ms, so the chips arriving at 520ms follow the words rather than racing
   * them, and the window follows the chips.
   */
  { "@media (prefers-reduced-motion: no-preference)": {
    "@supports (animation-timeline: view())": {
      /* The chips fade in from slightly blurred and dim. No translate and no
       rotate — those are the chip's position on the stage, and a keyframe
       touching either would animate it away from where it goes. */
      ".mk-hero-chip": {
        "animation": "mk-hero-arrive 780ms var(--mk-ease) backwards",
        "animation-timeline": "auto",
        /* Staggered along the arc by `--mk-s`, the same 0-to-3 step that sets
         `--mk-in` below: a chip that arrives late also leaves late. It is a
         separate unitless custom property because `--mk-in` is a length, and
         `calc(520ms + 60px * 1.4)` is not a time — the whole declaration is
         invalid and every chip arrives at once. */
        "animation-delay": "calc(780ms + var(--mk-s) * 135ms)",
      },
      ".mk-hero-window": {
        "--mk-rise-y": "72px",
        "animation": "mk-rise 930ms var(--mk-ease) backwards",
        "animation-timeline": "auto",
        "animation-delay": "1140ms",
      },
    },
  } },
  /*
   * The scroll story.
   *
   * Three acts on one axis: the elements gather into the hub, the hub becomes
   * the guidelines builder, and the builder deals out the three templates. It
   * is the product's actual sequence, which is the only reason it is worth a
   * reader's scroll.
   *
   * ── Why `scroll()` and not `view()` ──────────────────────────────────────
   *
   * Every other scroll-driven rule here uses `view()`, which measures an
   * element's own crossing of the viewport. That is right for the sections
   * below the fold and wrong for this one: the hero is already on screen when
   * the page opens, so its `cover` range starts at about 44% progress before
   * anybody has scrolled, and act one would be half over on arrival.
   * `scroll(root block)` measures the page's own scroll from zero, which is
   * the axis the reader is actually moving.
   *
   * ── Fill modes, and why the resting state is the opening frame ───────────
   *
   * The one animation here is `forwards`, so before its range each chip shows
   * its own declared values and after it holds the last keyframe. The declared
   * values are the opening frame — chips out, hub up — which means a browser
   * with no scroll timelines, and a reader who asked for no motion, both get a
   * complete and honest hero rather than a stage mid-story.
   */
  { "@media (prefers-reduced-motion: no-preference)": {
    "@supports (animation-timeline: view())": {
      /*
       * `animation-timeline` after the shorthand, in every rule, never hoisted
       * into a shared one above them.
       *
       * The `animation` shorthand resets `animation-timeline` to `auto` along
       * with everything else it does not name. A grouped
       * `animation-timeline: scroll(root block)` declared before these rules
       * therefore lasts until the next line: every animation here fell back to
       * a 0s clock animation and, being `forwards`, painted its own last
       * keyframe at scroll 0. The whole story was over before the page opened —
       * chips gone, covers dealt, builder up — and nothing in the computed
       * styles said "timeline" anywhere.
       */
      /*
       * One act, since 19 Nov 2026.
       *
       * There were four, and they did not overlap because a reader cannot be
       * asked to watch two at once:
       *
       *     0 –  430   the names travel down into the hub
       *   430 –  530   the hub goes
       *   530 –  640   the builder arrives
       *   640 –  880   it deals the three covers out
       *   880 – 1090   the covers are pulled down past it and fade
       *
       * The owner asked for the first line and nothing else: the tags travel
       * down into the hub, the hub stays, no second screen. So the budget is
       * the first act's alone, and the three that followed it are gone from
       * this file and from `Hero.tsx`.
       *
       * Which also removes the constraint the retiming was solving for. The
       * acts had to be packed into 0–1090 because the window leaves the top
       * of the screen by about 1100, and an act timed past that plays to an
       * empty stage. One act ending at ~700 has the frame to itself for the
       * whole of its travel, so the chips can take longer over it: 420px of
       * scroll rather than 310, which is the difference between names being
       * drawn in and names being pulled.
       */
      ".mk-hero-chip": {
        "animation": "mk-hero-gather linear forwards",
        "animation-timeline": "scroll(root block)",
        "animation-range": "var(--mk-in) calc(var(--mk-in) + 630px)",
      },
      /*
       * The hub has no exit any more.
       *
       * It used to fade at 430–530 to hand the window to the builder. With
       * nothing to hand it to, that fade was the product screen disappearing
       * for no reason — so that keyframe is gone with it and the pane
       * simply stays, which is the thing the chips were arriving at all along.
       */
      /*
       * No scroll story below 810px, where the stage is a column: the
       * keyframes animate toward an offset from a centre these elements no
       * longer have, so they would simply slide off their own row.
       */
      "@media (width < 50.625rem)": {
        ".mk-hero-chip": {
          "animation": "none",
        },
      },
    },
  } },
  { "@keyframes mk-hero-gather": {
    /* Opaque until it is nearly at the window. Fading evenly across the whole
     travel made a chip disappear in open space halfway down, which reads as
     a bug rather than as a name going somewhere. */
    "70%": {
      "opacity": "1",
    },
    "to": {
      "translate": "calc(-50% * var(--mk-dir)) -50%",
      "rotate": "0deg",
      "scale": "0.45",
      "opacity": "0",
    },
  } },
  { "@keyframes mk-hero-arrive": {
    "from": {
      "opacity": "0",
      "filter": "blur(8px)",
      "scale": "0.96",
    },
  } },
  /*
   * The floating overlays are a desktop device.
   *
   * The brief's section 6 is explicit: below 768px "the dock and floating
   * overlays are hidden". On this hero that is the chip fan, which at 390px
   * had its boxes overlapping the headline by 187px -- harmless to read,
   * because the measure sits at z-index 2 and the probe confirms nothing
   * paints over the words, but it is four decorative cards stacked behind two
   * lines of type in a space with room for neither.
   *
   * `display: none` rather than `visibility`, so they cost no layout and no
   * composite layer on the viewport that can least afford either.
   *
   * **Last in the file, and that is load-bearing.** Every rule here is
   * registered with `addBase`, so the whole module sits in one layer at one
   * specificity and a tie is broken by source order. Declared at the top of
   * this array -- where it was first written -- this lost to `.mk-hero-fan`'s
   * own `display` further down and did nothing at all: the probe still
   * measured the chips at full size. Equal specificity, later wins.
   */
  { "@media (width < 48rem)": {
    ".mk-hero-fan": {
      "display": "none",
    },
  } },
  /*
   * The inner window, inset in the frame above.
   *
   * A darker surface than the frame, its own smaller radius, and its own
   * edge -- the three things that make it read as a screen inside a bezel.
   * Last in the file deliberately: `.mk-hero-pane` is declared earlier for
   * the cross-fade, and at equal specificity the later rule is the one that
   * wins. That is the same tie this file lost once already.
   */
  { ".mk-hero-pane": {
    "background": "var(--surface-1)",
    "border-radius": "var(--radius-widget)",
    "box-shadow": "var(--lift-ring)",
    "overflow": "clip",
  } },
];
