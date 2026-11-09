# Open decisions

> **Updated 17 Oct 2026 (second pass).** Item 4 is resolved — analytics is
> built, first-party and cookieless. A new item 6 is the biggest open question
> on the project: the Arabic-first copy document puts Arabic at the root, which
> this site does not currently do.
>
> **Updated 17 Oct 2026, after the design reference landed.** The 21 mockups in
> `UI-UX Design Reference/` settle items 1 and 3 below, and raise a new one
> (item 5) that matters more than either. Items 2 and 4 are unchanged.
>
> **Updated 17 Oct 2026, after the page was built to the reference.** Item 5 is
> built — see it for what was decided and the two parts of it that are still
> your call. Items 2 and 6 are the only things left that block work.
>
> **Updated 17 Oct 2026, after `markyos_solutions_menu.md` landed.** Item 1 is
> now built as well: the Solutions mega menu, a Resources dropdown, a phone
> menu, fourteen new routes and the redirects off the old ones.
>
> **Updated 17 Oct 2026, after the four page-copy documents landed.** Item 6 is
> resolved and built: **Arabic is now the site**, served from the root, with
> English under `/en`. Twenty-seven pages are written, the Arabic homepage copy
> is complete (127 of 127), and a new item 7 records what happens to the
> English edition of those pages.

**One thing still needs your call** — item 2. Nothing here is urgent today: the
site builds, runs and is styled without it answered.

See `docs/DESIGN.md` for how the reference maps onto the code, and for the
four places the build deliberately departs from it.

---

## 1. Which information architecture? — RESOLVED and BUILT

**There are two site maps in the repo and they disagree.**

`markyos_site_architecture_and_copy.md` (8 Sep 2026) is organised by *problem*:

```
/platform · /solutions ▾ · /resources ▾ · /pricing

/solutions/bilingual-brand-guidelines
/solutions/digital-asset-management
/solutions/brand-governance
/solutions/client-delivery-agencies
/solutions/brand-strategy-hub
```

`markyos_landing_page_copy.md` (16 Oct 2026, built on roadmap Rev 3.2) is
organised by *audience*:

```
/studios · /companies · /platform · /pricing · /resources
```

These are not cosmetically different. The first is five pages each aimed at a
buyer problem, written for five different Google searches. The second is two
pages each aimed at a person, which is also how the sign-up fork works and how
the homepage's entire argument is structured.

**The homepage is built to the newer, audience-first map**, on the grounds that
it is five weeks newer, it is explicitly built on roadmap Rev 3.2, and it is the
document you handed over. The nav, the footer and the placeholder routes all
follow it.

**What is blocked:** the copy for `/studios`, `/companies` and `/platform`
exists only in the older doc, written against `/solutions`. Those pages are
placeholders (`noindex`, honest text, no invented content) until this is
settled, because porting `/solutions/digital-asset-management` copy into a
`/companies` page would mean rewriting its argument, not moving it.

**The design settles this.** `00-header.png` shows the nav as:

```
Markyos   For studios ▾   For companies ▾   Platform ▾   Pricing ▾   Resources ▾        العربية   Log in   [Start free]
```

Audience-first, as built. The nav in `content/en/index.ts` matches it already.

**Settled, and built.** `markyos_solutions_menu.md` answered the remaining
question — what goes inside the dropdowns — and it answered it by merging the
two site maps rather than picking one. Audience-first at the top level,
problem-first underneath: one tree, two levels, which is what the chevrons in
the mockup implied.

The header is now four items plus a button:

```
Markyos   Solutions ▾   Platform   Pricing   Resources ▾        العربية   Log in   [Start free]
```

"For studios" and "For companies" stopped being top-level links and became two
of the three columns inside Solutions — the third being freelance designers,
who sign up as a Studio workspace but buy for a different reason and had
nowhere to be named before (menu spec §3.4).

**What that changed in the build:**

- Fourteen new routes, all `noindex` placeholders: `/solutions`, the three
  audience pages, nine solution pages, and `/platform/arabic` from the menu's
  bottom strip. Each one's note is the line the menu itself gives that page,
  so nothing there is invented copy.
- `/studios` and `/companies` **301** to `/solutions/studios` and
  `/solutions/companies`. They were linked from every page's header and
  footer for the whole of the site's life so far.
- The footer's "For" column now points at the solution pages, and
  "Freelance designers" has a page of its own rather than sharing the studios
  one.
- The menu spec supplies its Arabic as the primary version rather than as a
  translation, so the whole header is now transcreated. Arabic coverage went
  from 14 of 126 copy items to 19 of 127.

**Still a placeholder, and still blocked on the older document:** the body
copy for all fourteen pages. The menu spec gives each page one line, which is
enough for a nav entry and a placeholder note and is not a page. The
`markyos_site_architecture_and_copy.md` copy written against the old
`/solutions/digital-asset-management`-style URLs now has somewhere to go —
the URL map in the menu spec §4 is close to it — so this is a porting job
rather than an open question.

**Also affected:** the CMS doc's `Comparisons` collection assumes
`/resources/compare/[slug]`, which survives the change. No change needed.

---

## 2. Where does a beta signup go?

`/api/waitlist` validates the submission, catches bots with a honeypot, and
returns **501** rather than storing anything.

That is deliberate. A silent 200 that drops the email is the one failure mode
worth engineering against — the form would look like it worked, and the 25
studio spots would fill with people nobody can reach.

The options, roughly in order of how much they cost to build:

| Option | Why | Cost |
| :--- | :--- | :--- |
| A table in the platform's Postgres | It is already there, already budgeted, and the beta cohort is product data you will want to query | A Prisma model and a connection string |
| An email tool (Resend, Loops, Mailchimp) | You need to *email* these people — a confirmation now, an invite later — and a database row does not do that | An API key, no schema |
| Both | The table is the record; the email tool is the channel | Both of the above |

**Recommendation:** the email tool first, because the thing you actually have
to do with a beta signup is email them, and a row in Postgres that nobody has
built a mailer for is a list you cannot use. Add the table when the beta
cohort becomes something you want to segment.

**Also needs deciding:** whether the form is on the homepage or on `/start` in
the platform app. Today every CTA redirects to `NEXT_PUBLIC_APP_URL/start`,
which means the platform app currently owns beta signup and this endpoint is
unused. If the marketing site should capture the email instead — which is
usually right pre-launch, because it is one field instead of an account — the
hero CTAs should open a dialog here rather than redirecting away.

---

## 3. Light theme, dark theme, or both? — CLOSED by the design system

> **Closed 20 Oct 2026.** The Markyos Design System settles it: the art
> direction is dark, full stop. "Black is the brand. Light is the colour" —
> ~90% true black, ~8% white and grey type, ~2% blue light. There is no light
> edition of the marketing site and no toggle to build. See
> `MARKYOS-DESIGN-SYSTEM.md` §1.

The synced tokens still carry both, because they are the *product's* tokens
and the product has a light theme. The marketing site simply never selects it:
nothing sets `data-theme`.

The original question, kept for the record:
Three options:

- **Dark only.** Distinctive, matches the product's default, one set of
  decisions to make. Dark marketing sites convert fine.
- **Light only.** Conventional for SaaS marketing; often better for long-form
  reading and for the `/resources` content that is coming.
- **Both, following the system, with a toggle.** The product does this. It
  doubles the design review — every section has to be checked twice — and the
  platform repo's `contrast-audit.mjs` exists because that is where the bugs
  live.

**Dark only.** Every one of the 21 mockups is dark, on a near-black ground,
and the site already renders that way. Nothing to do.

If a light theme is ever wanted for the `/resources` long-form content, the
tokens for it are already synced and the platform's `THEME_INIT_SCRIPT` pattern
is what to port — it stamps `data-theme` before first paint, which is what
stops the page flipping visibly on hydration.

---

## 4. Analytics — RESOLVED (built)

Two small things that are really one question: **what, if anything, do we track?**

The copy doc says the pricing teaser "defaults to the path the visitor picked"
in the hero. It currently defaults to studios, because nothing records that
choice. Making it work means storing which CTA was clicked — which is a
decision about tracking, not about pricing, so it has not been invented.

There is no analytics in the repo at all. Before adding any, worth deciding:

- Is there a **cookie banner** obligation? The audience is the Gulf and
  Southeast Asia, but also Europe by accident. A cookieless tool (Plausible,
  Fathom, Vercel Analytics) avoids the banner entirely, and a banner on the
  hero costs more conversions than the data is worth.
- The **five-second test** in the copy doc's pre-publish list (item 9) needs
  real people, not analytics. Do not let a dashboard stand in for it.

**Built, first-party, no vendor.** Page views are counted by this app and
stored in the same database as the content, with no cookie, no third-party
script and no stored IP address. A visitor is recognised within a day by a
salted hash that is discarded overnight, so views and visitors can differ
without anybody being followed across days. Do-Not-Track and Global Privacy
Control are honoured, and obvious bots are dropped.

That means **no cookie banner**, which on a hero with two CTAs is worth more
than the extra detail a hosted tool would give. It also keeps the promise the
tone-checker section makes on the page — telling visitors their text is not
kept while loading a tracker that follows them elsewhere would be the one
contradiction hardest to defend.

The numbers appear on the admin dashboard: views and visitors for 30 days with
the change against the previous 30, a daily chart, top pages, referrers, and
the split by language, device and country.

**Still open, and smaller:** the pricing toggle remembering the hero choice
needs a click event, which the tracking endpoint does not yet record. One
field on `pageviews` and a call from the hero would do it. Left undone because
it is a behaviour decision, not a plumbing one.

---

## 5. The marketing accent is not the product accent — SUPERSEDED

> **Superseded 20 Oct 2026.** The Markyos Design System decides the accent,
> and it is neither the warm one measured off the reference nor the product's:
> blue `#0099FF` core falling off to `#0055FF`, used **as light only** — glow,
> neon edge, focus ring, selection, progress and chart fills. Never a section
> fill, and never heading, eyebrow or link ink. Text hierarchy is white
> opacity, never hue.
>
> `tailwind/tokens.js` is still the whole of it, but it is now a *mapping* onto
> `tailwind/tokens.js` rather than a set of measured values. See
> `MARKYOS-DESIGN-SYSTEM.md` §4.
>
> The original entry, kept for the record:
>
> **Built 17 Oct 2026.** The page is now styled to the reference, so this was
> answered the way the recommendation below suggested. It is still worth your
> sign-off, because it is a brand decision rather than a technical one — but
> it is no longer blocking anything, and reversing it is one file.
>
> `tailwind/tokens.js` holds the whole of it: the marketing site's grounds, ink,
> hairlines and accent, laid over the synced product tokens the way the
> generated file's own light theme lays over its dark one. Every value in it
> was measured out of the reference PNGs rather than picked by eye, and the
> file says which. `tailwind/tokens.generated.js` is untouched and
> `npm run check:tokens` still passes.

The product's accent is blue — `--accent: #0099ff` — and this repo currently
consumes it for every primary button, chip and link, synced from the platform
app under the "never author a brand value here" rule.

**The design does not use it.** From `16-pricing.png` and `01-hero.png`:

| Element | Design | Current code |
| :--- | :--- | :--- |
| Primary button | White fill, near-black text | Blue fill (`--accent`) |
| Recommended plan card | Warm bronze/amber gradient | Blue-tinted edge (`--accent-edge`) |
| Text link ("Compare all plans →") | Amber | Blue (`--accent-text`) |
| Ground | Near-black | Near-black ✓ matches |
| Text ramp | White → grey | ✓ matches |

So the surface, text and hairline ramps are shared with the product, but the
**accent family is marketing-specific and warm**.

That is a legitimate design choice — a marketing site is allowed its own
voice — but it needs a deliberate answer, because it is the one place the
token-sync rule does not cover:

- **Option A — add the warm accent to the platform's `globals.css`** as a
  second, named family (`--marketing-accent-*`) and sync it like everything
  else. Keeps one source of truth. Slightly odd: the product gains tokens it
  never renders.
- **Option B — a small, explicitly-owned local token file** here, for the
  accent family only, with everything else still synced and gated. Honest
  about the split. Costs a second place where a brand value is decided.
- **Option C — the design actually intends the product accent too**, and the
  warm tones in the mockups are the *client* brand shown inside the demo hub
  (the hub in the hero is نخلة, a fictional client, in its own brown palette).
  Possible for the hero; not for the amber "Compare all plans →" link, which
  is Markyos chrome.

**Recommendation: Option B**, scoped to the accent family only. The ramp that
has to match between the two deploys — grounds, ink, hairlines — stays synced
and gated. The accent, which the design deliberately differs on, is declared
once here with a comment saying why. Pretending it is the same blue would mean
building the site wrong; putting marketing colours into the product's
stylesheet would mean lying about where they belong.

**What was built.** Option B, with one honest extension: the grounds moved too.
The reference's canvas measures `#09090b` where the product's is `#060607`, and
its card is a *gradient* (`#131315` → `#0e0e10`) where the product's is a flat
fill. Those are not accent decisions, so strictly they fall outside Option B —
but matching the reference meant moving them, and splitting the file so that
half the surface values came from one place and half from another would have
been worse than moving both and saying so. The values are:

| Token | Marketing | Product |
| :--- | :--- | :--- |
| `--canvas` | `#09090b` | `#060607` |
| card fill | `#131315` → `#0e0e10` gradient | flat `--surface-0` |
| `--accent` | `#fb923c` orange-400 | `#0099ff` |
| `--accent-text` | `#fdba74` orange-300 | `#5cb9ff` |
| `--solid` | `#fafafa` → `#cbcbcb` gradient | flat `#ffffff` |
| text ramp | `#fafafa` / `#a1a1aa`, two levels | four levels |

The text ramp collapsing to two levels is the reference's decision, not an
omission: sampling every paragraph, caption and table cell in all 21 mockups
returned exactly two greys and nothing between them. `--text-faint` therefore
resolves to the same value as `--text-muted` rather than to something dimmer,
so nobody reaches for a level that does not exist. Both clear 7:1 on the
canvas.

### Still your call

1. **Is the warm accent right for the brand**, or was it the mockups borrowing
   the client brand's palette? Option C above is still technically available —
   the hero's hub is نخلة, a fictional coffee roaster, in its own browns — but
   the amber "Compare all plans →", the amber eyebrows and the orange selected
   template tile are Markyos chrome, not نخلة's, so the mockups mean it.
2. **The display typeface.** The reference is not set in Bricolage Grotesque,
   which is what the product's `--font-display` points at. Rendering all three
   candidates at widths matched to the hero crop settles it: Bricolage's
   tailed `a`, splayed `K` and angled `e` terminals are a characterful display
   face, and every headline in the reference is a neutral grotesque with a
   tailless `a` — most likely Helvetica Neue, i.e. whatever the mockups were
   rendered with, which is not a webfont this site can ship.

   The site now sets headings in **Inter at 600 with -0.035em**, which is the
   closest neutral grotesque already in the build and costs no extra download.
   Bricolage is no longer loaded (`src/app/fonts.ts`); the files stay in
   `public/fonts/`. If the brand actually wants a licensed grotesque —
   Helvetica Now, Söhne — that is one line in `tailwind/tokens.js` plus the webfont
   licence.

---

## 6. Arabic-first: does Arabic move to the root? — RESOLVED and BUILT

**Yes. Arabic is the site; English is a translation of it that has not been
written yet.**

That was the instruction, and `markyos_landing_page_copy_ar.md` §0.5 had
already specified the shape. It is now what the code does.

### What the URLs are

```
markyos.com/            Arabic homepage
markyos.com/pricing     Arabic, no locale segment
markyos.com/en          English homepage
markyos.com/en/pricing  English
```

Slugs stay English in both languages, per §0.5: they are easier to share and
to type, and Arabic slugs get percent-mangled by most apps.

### Where that lives, and nowhere else

- **`src/lib/i18n/locales.ts`** — `DEFAULT_LOCALE` is `"ar"`. Everything that
  builds a URL reads it; the default locale is by definition the unprefixed
  one.
- **`src/lib/i18n/href.ts`** — `localeHref` adds `/en` and adds nothing for
  Arabic. Every link on the site goes through it.
- **`src/proxy.ts`** — rewrites an unprefixed path onto the `src/app/[lang]` route
  that renders it, and **301s `/ar/...` to the canonical unprefixed URL** so
  no Arabic page exists at two addresses.
- **`src/lib/seo.ts`** — `pageUrl` builds canonicals, hreflang and sitemap
  entries in that same shape, with `x-default` on Arabic.

### The one thing that was removed

`src/proxy.ts` used to negotiate `Accept-Language` and send an English-speaking
browser to `/en`. It does not any more, and that is deliberate: the two
editions are no longer equals, so negotiation would route a visitor to the
*less finished* half of the site on the strength of a header they never set.
The language switch in the header is explicit and crawlable, which is what
that choice should be.

### What else came with it

- The Arabic homepage copy is **complete** — `check:locales` reports 127 of
  127, up from 14.
- The Arabic chip wording (`قريباً · ربيع 2027`), the Arabic plan names, the
  Arabic footer, the Arabic `<title>` and share card, and the extra FAQ
  ("هل لوحة التحكم نفسها بالعربية؟") are all in.
- The language switch already read "English"; arrows already flipped.

### Still open from that document

**The hero animation** (§0.1) should open in Arabic and flip to English, the
reverse of the English page. The hero's product mock is already Arabic in both
locales — see `docs/DESIGN.md` — but it does not animate, and nothing on the
page does. That is a build item, not a decision.

---

## 7. The English edition of the subpages

**Twenty-seven pages are written in Arabic and not in English.** That is the
sequence that was asked for: finish Arabic, then translate.

Until then `/en/<any of them>` serves a short `noindex` notice naming the page
and linking to the Arabic one, and `hreflang` on those pages declares Arabic
only. The two alternatives were both worse: a 404 is one click from the header
of every page, and serving Arabic under an English URL is the one thing
hreflang exists to prevent.

**When the translation is written** it is a content file, not a build:
`content/pages/en/` with the same shape as `content/pages/ar/`, and
`localesFor()` in `src/lib/pages/registry.ts` starts returning both. Every
hreflang pair, every sitemap entry and every route appears in that one edit.

The homepage is already complete in both languages.

---

## Decisions already made, for the record

These were judgment calls made while building. Each is reversible; say so if
you disagree.

| Decision | Why | Where |
| :--- | :--- | :--- |
| Payload goes in this repo, not the platform app | Every CMS collection renders on a marketing route and none is read by the product. Keeps the Local API benefit the CMS doc chose Payload for | `docs/STACK-DECISIONS.md` §3 |
| Next 16.4.2 here vs 16.3.4 in the platform | 16.3.4 has a critical advisory including SSG cache poisoning, which is what this site is | §2 |
| No i18n library | Two locales, finite pages. The library's value is unused here | §4 |
| Page copy in git, editorial content in the CMS | Split by lifecycle. Lets `check:locales` prove Arabic parity | §3 |
| Arabic falls back to English, never blank | Same rule as the CMS doc sets for Payload | §4 |
| `robots.txt` blocks everything during the beta | A thin page ranking for the product's main term trains the index on the wrong content | `src/app/robots.ts` |
| Secondary pages are `noindex` placeholders | They are linked from every footer; a 404 reachable from everywhere is worse. Indexing an empty page is worse still | `components/ui/Placeholder.tsx` |
| Social proof section omitted entirely | Copy doc §4.18 — never invent quotes, logos or numbers | `src/app/[lang]/page.tsx` |
| Permission is a role **and** a section list | A role says how much, not what over. "A copywriter on the blog only" cannot be said with a role alone | `cms/access.ts` |
| Restricted collections are hidden, not just refused | A sidebar full of things you cannot open is worse than a short one, and it leaks what exists. Both halves are enforced | `cms/access.ts` |
| Analytics is first-party and cookieless | No banner, no vendor, and it keeps the privacy promise the page itself makes | `src/app/api/track/route.ts` |
| The admin panel speaks Arabic | The Arabic copy answers "is the admin in Arabic?" with yes; an English-only back office would make that false | `payload.config.ts` |
