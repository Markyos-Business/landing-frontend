# Site copy v5 — the migration

**Source:** `docs/copy/markyos_site_copy_v5_ar.md` (master) and
`markyos_site_copy_v5_en.md` (generated from it). Dated 26 November 2026.
Where the two disagree, the Arabic master wins; where the master and Notion
disagree, Notion wins.

This file is the running checklist. Tick a stage only when `npm run check`
and `npm run check:live` are both green and the page has been looked at in
both editions at 1440px and 375px.

---

## Why this is not a copy edit

v5 changes the catalogue, the page set and the order of the homepage. Four
things make it structural rather than textual:

1. **Eleven plans become four.** v4.3 sold Free, Solo, Pro, Studio, Agency,
   Starter, Brand, Team, Business and Enterprise across three audience tabs.
   v5 sells **Free · Freelancer $12 · Studio $29 · Company $19 per brand**.
   Every limit, every table row and every price sentence on the site changes,
   and `content/current-pricing.ts` (1,848 lines) is the generator for all of
   it.
2. **The pricing model changes shape.** A 14 day trial with no card replaces
   the old entry path; the launch offer drops from 50% to **30% off three
   months**; a shared credit pool becomes **one monthly limit per AI tool**;
   the Project Pass and the prepaid client year are gone; the partner reward
   is **20% everywhere** (the 25% Agency rate dies with Agency).
3. **Brand Brain becomes the spine.** It gains a top-level nav item, the
   hero's sub-line, the **fourth** section of the homepage with a map of the
   seven features it works inside, its own page at `/platform/brand-brain`,
   and a line on every feature and audience page.
4. **Nine `/solutions/*` detail pages become thirteen `/platform/*` feature
   pages**, with 301s from the old URLs.

---

## The page set

### Keep, rewrite in place

| Path | What changes |
| :--- | :--- |
| `/` (homepage) | Eleven sections in a new order; Brand Brain moves to 4th; five tool stops instead of seven; twelve questions in both editions |
| `/solutions` | Hub copy only |
| `/solutions/studios` | New four-card shape, new pricing strip, Brand Brain block |
| `/solutions/freelancers` | Same |
| `/solutions/companies` | Same |
| `/platform` | Rebuilt as three columns (Create · Deliver · Run) with the Brand Brain block above them |
| `/platform/arabic` | Six proofs; "English today" section on the English edition only |
| `/pricing` | Rebuilt from scratch on the v5 catalogue |
| `/roadmap` | Two columns, new contents |
| `/security` | Railway + OpenAI + PayPal lines |
| `/about` · `/contact` · `/whats-new` · `/resources` | Light edits |
| `/privacy` · `/terms` · `/cookies` | Summary boxes gain the trial and AI Connector lines |

### New

`/platform/brand-brain` — the page that sells the engine. Anchors
`#every-part`, `#agents`, `#versus`.

### Thirteen feature pages, replacing nine solution pages

| New path | Replaces |
| :--- | :--- |
| `/platform/discovery-forms` | `/solutions/discovery` |
| `/platform/brief-analysis` | part of `/solutions/discovery` |
| `/platform/strategy-hub` | new |
| `/platform/moodboards` | new, chipped |
| `/platform/asset-library` | `/solutions/brand-hub` |
| `/platform/guideline-sites` | `/solutions/guideline-sites` |
| `/platform/studio-board` | `/solutions/client-projects` |
| `/platform/handoff` | `/solutions/client-handoff` |
| `/platform/brand-voice` | `/solutions/brand-voice` |
| `/platform/tone-checker` | `/solutions/tone-checker` |
| `/platform/leadership-alignment` | `/solutions/leadership-alignment` |
| `/platform/team-and-sharing` | `/solutions/company-rollout` |
| `/platform/mockups` | new |

Every retired path needs a 301 in `next.config.ts`, and `check:live` must
still find no 404 in either edition.

---

## Stages

Each stage is one commit, green on both gates before the next one starts.

- [ ] **1 · The catalogue.** `content/current-pricing.ts` rebuilt on v5:
      four plans, per-tool limits, the trial, the 30% offer, add-ons, the
      20% reward. `scripts/check-pricing.mjs` rewritten to assert v5 and to
      fail on every retired v4.3 figure. The homepage teaser and
      `content/types.ts` follow.
- [ ] **2 · `/pricing`.** The sixteen blocks the deck lists, in its order.
- [ ] **3 · The homepage.** Eleven sections, Brand Brain fourth.
- [ ] **4 · Global elements.** Announcement bar, nav with Brand Brain,
      Platform mega-menu in three columns, new footer.
- [ ] **5 · `/platform/brand-brain`** and the rebuilt `/platform` hub.
- [ ] **6 · The thirteen feature pages**, plus the 301s.
- [ ] **7 · The four Solutions pages.**
- [ ] **8 · Part D and E leftovers**: roadmap, security, about, contact,
      resources, legal summaries, 404.
- [ ] **9 · Docs.** `docs/DESIGN.md`, `docs/OPEN-DECISIONS.md` and
      `docs/PAGES.md` updated; the v5 open items recorded.

---

## Rules that hold through all of it

- **The visual system does not change.** `docs/design-brief.md` governs:
  near-black canvas, one electric blue, 700 display weight, hairline bento
  cards, motion with a `prefers-reduced-motion` escape. v5 is a copy and
  structure change, so every new block reuses the existing `.mk-*`
  vocabulary in `tailwind/components/` rather than inventing styling.
- **Arabic leads.** `/` is Arabic. Write the Arabic first; the English is a
  native rewrite, never a translation. `npm run check:locales` must stay at
  100%.
- **Nothing takes money.** None of the four plans exists in billing. Every
  plan CTA creates a free account at `/start`; `check:pricing` asserts it.
  Delete that assertion the day the plans are real, not before.
- **Chips, not dates.** Anything not live at launch carries «قريباً» /
  "Coming soon" with no date: moodboards, art direction, department
  playbooks, the Chrome extension, old-PDF conversion, brand health,
  download tracking, reviews and approvals, design checks, Enterprise.
- **No invented proof.** The proof slot stays empty until the beta gives
  real names with permission.
- **[CONFIRM] and [PLACEHOLDER] never ship.** A line the deck has not
  settled stays off the site. The open items below say which.

---

## Open items the deck leaves (and the site must not pre-empt)

The master's own list, condensed. None of these may appear on a page until
it is answered:

1. Launch offer end date; monthly only; one use per workspace; PayPal
   sandbox test. The «عرض أول 100 عضو مؤسس» post still says 50%.
2. Trial reminders on day 10 and 13, and the move to free on day 15.
3. The free badge's destination URL, and whether a handed-off client hub on
   the free plan shows it.
4. PayPal card checkout without an account in Saudi Arabia and Malaysia —
   otherwise «أو ببطاقتك» / "or your card" comes out everywhere.
5. Partner reward recorded on PayPal, applied as credit once billing moves
   to Stripe.
6. Tax and VAT on receipts; the refund policy; contact emails and reply
   times.
7. Prices are hypotheses until 1 February 2027.
8. Ask the Brand, AI Connector, strategy assistant and section copy are
   expected in the beta. If any slips it goes back to «قريباً» everywhere,
   including the pricing cards.
9. The mockup builder's Arabic name and template list.
10. Guideline looks per plan, and voice per channel.
11. The viewer daily AI limit on the Company plan.
12. The sample hub URL («نخلة» / Nakhla) for the hero link.
13. Dialect and register claims wait on the December Arabic test.
14. OpenAI API data terms before any line about training; the Railway
    storage region.
15. Real beta names for the proof slot, with permission.
16. Notion's Website tracker still lists `/solutions/discovery` and
    `/solutions/client-handoff`. This file uses `/platform/...`; align one
    to the other.
