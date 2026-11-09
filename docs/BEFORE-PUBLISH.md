# Before you publish

The gate. Nothing goes live until every item here is closed.

Items 1–9 are the copy doc's own pre-publish list (§8), with where each one
lives in the code. Items 10–14 were found while building and are not in that
list.

---

## From the copy doc §8

### 1. Confirm "No card needed" on the free plans
If a card **is** required, the line becomes "Free plan. Cancel anytime."

Three places, all in `content/en/index.ts`: `home.hero.microcopy`,
`home.finalCta.microcopy`, and the Arabic
`content/ar/overrides.ts` → `home.hero.microcopy` ("دون بطاقة"). They must say
the same thing — the Arabic is a separate string and will not follow the
English automatically.

### 2. Update the status chips
`src/lib/status.ts`. On launch day, flip every `status: "mvp"` to `"current"` for
anything that actually shipped. The chips disappear on their own — `chipFor()`
returns null for `current`, and for `mvp` once the phase is `public`.

Re-run this each time a phase ships, not only at launch.

### 3. Lock the prices
After the beta pricing test closes **1 Feb 2027**.
`content/en/index.ts` → `home.pricingTeaser`. Every price there is a hypothesis.
The `CONFIRM` comment sits directly above the block.

### 4. Fill or hide the social proof section
Currently **hidden**, which is the correct state. There is no component for it
and nothing renders. When the beta produces real quotes, it goes between
`FounderNote` and `Faq` in `src/app/[lang]/page.tsx`.

Never invent a quote, a logo or a number. Collect, in priority order:
two or three studio quotes about the handoff moment ("What did your client say
when they saw the hub?"), one marketing-manager quote about the Arabic tone
checker, one real usage number, then logos.

### 5. Rewrite the founder note
`content/en/index.ts` → `home.founderNote`. The drafted version is a
placeholder with a real shape, and the regions need correcting to match your
actual client history. In your own words.

### 6. Review the Arabic, and confirm the brand name's spelling
`content/ar/overrides.ts`. Everything in it is transcribed from copy doc §5,
which is itself marked draft.

Run `npm run check:locales` for the brief — **14 of 121 items have Arabic**
today. The remaining 107 inherit English, which means an Arabic reader
currently gets a mostly-English page.

Once it is complete, turn the gate on: add `--strict` to the `check:locales`
script so a missing Arabic string fails the build.

Confirm **ماركيوس** is the right spelling of the brand name before it is set in
121 strings.

### 7. Check the stakeholder workshop ships with v2.0
`src/lib/status.ts` → `stakeholder-workshop`. If it slips into the first two weeks
after launch it needs a `Coming March 2027` chip, which means adding that key
to `ChipKey`, to `chips` in both locales, and setting the feature's status to
`coming`.

### 8. Check the Arabic register claims
The tone checker's dialect and register detection is tested on real Gulf,
Egyptian, Levantine and MSA content in the December buffer.

**If that test does not pass, three places must change**, because all three
make the claim:
- `home.toneChecker.outputs` — the "Arabic register mismatches" line
- `home.bilingual.points` — the "Register-aware" point
- `home.faq` — the "How good is the Arabic, really?" answer

### 9. Run the five-second test
Five studio owners, five marketing managers. Can each say who the page is for
and what it does after five seconds? If not, try headline B or C from the copy
doc's alternatives table.

This needs real people. Analytics will not answer it.

---

## Found while building

### 10. Mid-page CTAs still promise "free" during the beta
Copy doc §6.3 specifies beta versions for the hero and the final CTA, and both
are wired — `isBeta` swaps them automatically.

It does **not** specify beta versions for the mid-page CTAs, and three of them
promise something that is not available before launch:

| Where | Current label |
| :--- | :--- |
| End of the studio path | Start your first project free |
| End of the company section | Set up your brand free |
| Tone checker | Run your first tone check free |

These need either beta labels (copy you have to write — it is marketing copy,
so it is your call, not a default I should invent) or an accepted decision that
they stay as they are because they lead to the beta application anyway.

Add them to `beta` blocks in `content/en/index.ts` the same way the hero's are
done, and the swap is automatic.

### 11a. The tab icon is provisional

`src/app/icon.svg` is the brand mark on the canvas colour, generated so the site
stops 404ing a favicon on every page load. It is a stand-in, not a designed
icon — a mark drawn for a 1027px lockup is not automatically right at 16px.
Replace it in the design pass.

### 11. The OG image does not exist
`src/lib/seo.ts` points at `/brand/og-en.png` and `/brand/og-ar.png`. Neither file
is in `public/brand/`.

Every share of this link currently renders a broken card. Two images, 1200×630,
one per locale.

### 12. `NEXT_PUBLIC_SITE_URL` must be set in production
It defaults to `http://localhost:3000`, and that default ends up in the
canonical tag, every `hreflang`, the sitemap and every Open Graph URL. Shipping
without it tells Google the canonical home of every page is localhost.

### 13. No mobile navigation — DONE
Built with the Solutions menu. `src/components/navbar/MobileNav.tsx`: a hamburger
and a full-height panel, with native `<details>` accordions nested one level,
so Solutions opens to three audiences and each opens to its four solutions.
They work before hydration.

It stopped being optional the moment the information architecture moved into a
dropdown: the footer no longer covers the same links, so without it twelve
solution pages would be desktop-only.

### 14. Port the physical-property gate
The platform repo has `scripts/no-physical-props.mjs`, which fails the build on
`left`/`right` in CSS across 242 files. This repo has the same requirement and
no gate.

One `left` that slips in is one place the Arabic layout is quietly wrong, and
it will be found by a reader rather than by a build.

### 15. The CMS needs real infrastructure before launch

The admin runs locally on SQLite with uploads on disk. None of that is a
production setup.

| | |
| :--- | :--- |
| `PAYLOAD_SECRET` | Required. Generate with `openssl rand -base64 32`. Changing it logs everyone out |
| `DATABASE_URI` | Postgres. Without it, production silently runs on a SQLite file that every deploy throws away |
| R2 credentials | Without them, uploaded images live on the server's disk and vanish on redeploy |
| Email adapter | Without one, a password reset prints to the server console and the person waiting never gets it |
| `cms.markyos.com` | Point it at `/admin`. Keeps the admin surface separate from the marketing site and off the public link graph |

Also: create the real admin accounts and **delete any test account**. The first
account created on a fresh database is an Admin.

### 16. ~~Check the homepage globals are empty before launch~~ — gone

Closed on 8 Nov 2026 by removing the thing it guarded. The `homepage`,
`navigation`, `announcement` and `siteSettings` globals let the panel override
the approved copy, which meant a demo value left in one of them was what the
world saw. They are no longer registered: the marketing copy is the
codebase's, and the admin is the resources CMS.

### 17. The privacy policy must describe the analytics

The site counts page views itself. That is deliberately the least invasive
version — no cookie, no third-party script, no stored IP, a daily-rotating
hash discarded overnight — but it is still processing, and the privacy page is
currently a placeholder.

It should say, in plain words: what is counted, that no cookie is set, that no
IP address is kept, that the visitor hash cannot be reversed or linked across
days, and that Do-Not-Track is honoured. Written plainly, this is a selling
point on a site whose own copy promises "your text is checked, not kept".

### 18. Decide how long page views are kept

Nothing deletes them today, so they accumulate forever. Pick a window — twelve
months is usual — and add a scheduled delete. Keeping raw events indefinitely
is both a growing table and a growing obligation.

### 19. Re-run the bidi check whenever Arabic copy lands

Running the Arabic page turned up a class of bug no type check or build can
see: Latin text inside an RTL container is laid out as part of the Arabic
paragraph, so its leading digits and trailing punctuation move to the wrong
end. The proof strip rendered "guideline sections that build themselves 16",
and the hero microcopy read ".studio spots and 15 company spots … 12 months 25".

Fixed with `unicode-bidi: plaintext` on text elements under `[dir="rtl"]`, plus
an `.mk-bidi` class for standalone strings in generic wrappers.

It will come back, because the causes are permanent: copy that is still
falling back to English, and terms that stay Latin on purpose — PDF, Figma,
Stripe, `final_FINAL_v3.pdf`, "24 دولاراً شهرياً". So after any Arabic copy
change, **open /ar and read it**, and port the platform repo's `bidi` sweep as
the Arabic document's own checklist (item 4) asks.

---

## From the four page-copy documents

The twenty-seven pages under the homepage are transcribed from
`docs/copy/pages_ar_1..4`. Where those documents left a `[CONFIRM]` or a
`[PLACEHOLDER]`, the page does **not** invent an answer — it either omits the
claim or says where the answer is coming from. Each one below is a sentence
that is missing on purpose and has to be written before launch.

### 20. Facts the security page does not yet claim

`/security` carries a standing instruction from its source: every statement on
it must be checked with the technical co-founder, and only what the server
enforces on launch day may be claimed. Two facts are therefore absent rather
than approximate:

- **The hosting region.** The page names Cloudflare R2 and a managed Postgres
  and does not say where either lives. An IT reviewer will ask.
- **The AI provider and its data terms** — specifically whether API inputs are
  used for training. The page says what Markyos does with your text; it says
  nothing about the provider, because nothing has been confirmed.

Nothing on that page may be written from memory. Re-read it line by line with
the person who built the server.

### 21. The pricing conflict between four pages

The roadmap gives **voice by channel and department** to Team and above. The
homepage, `/solutions/brand-voice` and `/platform/arabic` describe per-channel
Arabic register as available to everyone. Both cannot be true.

The comparison table on `/pricing` follows the roadmap; the three other pages
follow the homepage. Decide which is true, then align all four. The note is
recorded on the pricing table itself so whoever edits it sees it.

### 22. Addresses, reply times and the refund policy

- **`/contact`** lists six topics and no email addresses, because the source
  has `[PLACEHOLDER: sales@]` and so on, and no reply times. The page says
  reply times will be published before launch. Publish them, or remove the
  sentence.
- **`/security`** points vulnerability reports at the contact form rather than
  a `security@` address. Give it a real one.
- **`/pricing`** answers "do you refund?" with "the policy is published before
  launch". Decide the policy.

### 23. The missing co-founder, and the beta numbers

- **`/about`** names one founder and describes the other by role only, because
  the source has `[PLACEHOLDER: name]`. An about page with an anonymous
  co-founder is worse than one with two names. Add it, with the location line
  the source also leaves open.
- **`/whats-new`** omits the beta cohort sizes (`[PLACEHOLDER: X]` studios and
  companies in the source). The launch post reads fine without them; if they
  go in, they have to be the real numbers.

### 24. The per-seat writing tool price

`/solutions/company-rollout` makes a cost argument against a per-seat writing
tool — "more than $145 a month for five people". That figure is the whole
argument, and competitor pricing moves. **Re-check it the week the page
publishes**, and again whenever the page is edited, or drop the comparison.

### 25. ~~Placeholder editorial content must go or be replaced~~ — replaced

**Closed 8 Nov 2026.** The thirty-one placeholder pieces were deleted and the
real writing imported in their place: forty pieces in both languages — ten
blog posts, ten guides, ten comparison pages and nine release notes — from
`Website/Resources`. Nothing on the site is placeholder prose any more, and
the files the placeholders came from are gone with them.

**Two things replace this item, and both are open.**

**25a. Ninety-one unverified notes, on published pages.** The import removed
every square-bracket instruction from the text and listed all of them in
`docs/copy/RESOURCES-TODO.md` with the piece each came from. Most are
`[CONFIRM: …]` — competitor pricing, ship dates, plan names, whether a
feature exists at launch. These pages are live, so each one is a claim
currently being made. Read that file before the domain is public.

**25b. No guide has a download file.** All ten promise a template, a
checklist or a worksheet. The source folders carry the article, a Word copy
and the images, and no PDF. Upload one to each guide's `downloadFile`, or
drop the promise — "Download the template" with nothing behind it is the
kind of thing a visitor remembers.

The mechanism this item described is worth keeping either way: any document
can be ticked **Placeholder content** in the panel, and while it is, the page
carries a notice and its index stays out of search as long as every piece on
it is ticked.

### 26. The Arabic register claim appears on three more pages

Item 8 above covers the dialect claim on the homepage. The same claim is now
on `/platform/arabic` (proof 5), `/solutions/companies` (FAQ) and
`/solutions/tone-checker`. If the December Arabic test does not pass, all four
come out together.

### 27. ~~A test post is live in the CMS, under an Arabic slug~~ — gone

Payload had a published blog post titled `السلام عليكم ورحمة الله وبركاته`
with the slug `السلام`. It was somebody's test record, and because it was
*published* it appeared on `/blog` ahead of the placeholder articles.

**It is no longer in the database (8 Nov 2026), and not by anyone's
decision** — see "Dev schema push can empty a table" in `docs/DESIGN.md`. The
record is kept here because both things it taught are still true and both are
still load-bearing:

- Its URL returned **404** while the index linked to it, because a dynamic
  route param arrives percent-encoded while `generateStaticParams` returns
  the slug decoded. `src/lib/pages/params.ts` now decodes it in all three article
  routes. Arabic slugs work, which they must — the CMS will slugify an Arabic
  title this way again whether or not anybody intends it.
- `docs/OPEN-DECISIONS.md` §0.5 says slugs stay English in both languages.
  Nothing enforces that, and this record is the proof. If it matters, it
  belongs in the Payload collection config as a validation rule, not in a
  document.

### 28. A malformed URL answers 500, and it cannot be fixed here

```
/%zz          → 500
/pricing%zz   → 500
/blog/السلام  → 500   (raw UTF-8 bytes, not percent-encoded)
```

Any path that is not valid percent-encoding, or that carries raw non-ASCII
bytes, gets a **500** instead of a 400. `/nope` still 404s correctly, so this
is specifically about parsing, not routing.

It is Next 16.4.2 behaviour, not ours. The throw happens while the request URL
is parsed, **before** `src/proxy.ts` is called — a `try`/`catch` around
`request.nextUrl` was tried and never fires, so it was reverted rather than
left in as dead code with a confident comment on it.

Browsers always percent-encode, so a visitor clicking a link will not see
this. Crawlers, scanners and tools that paste un-encoded Arabic URLs do send
these.

**Before launch:** reject malformed paths with a 400 at the edge (Vercel, a
CDN rule, or nginx in front), and check whether it is still reproducible on
the Next version being deployed. Left alone it is an uptime-monitor false
alarm and a stream of 5xx in the crawl stats, neither of which is caused by
anything being wrong with the site.

### 29. Two CMS locale settings are left from when English was primary

Both are decisions, not bugs, and neither affects what a visitor sees today.

**`defaultLocale: "en"` in `payload.config.ts`.** It now only decides which
locale the admin opens in and which one `fallback: true` copies from. The
public site passes `fallbackLocale: false` on every editorial read, so it is
unaffected. Changing it to `"ar"` would match how the site is actually
written and would mean an editor opens a new post in Arabic by default. Worth
deciding with whoever writes, not unilaterally.

**Comparisons still read with fallback on.** `listComparisons` and
`getComparison` in `src/lib/content/payload.ts` were left as they were. The three
articles collections were changed because a real post proved the bug there;
the comparison pages are seeded and had nothing to prove it with. If a
comparison is ever published in one language only, it will show the same blank
fields the blog did — apply `fallbackLocale: NO_FALLBACK` and the `translated`
filter to those two reads at that point. They sit directly below the article
reads, with the reasoning.

---

## The launch-day switch

When everything above is closed:

```bash
NEXT_PUBLIC_LAUNCH_PHASE=public
NEXT_PUBLIC_SITE_URL=https://markyos.com
NEXT_PUBLIC_APP_URL=https://app.markyos.com
```

That one phase change swaps the announcement bar to "Markyos is open", swaps
the hero and final CTAs back to the free-plan versions, drops
`Arriving soon` from every MVP feature, and opens `robots.txt` to
crawlers with the sitemap attached.

Verify after deploying: `curl https://markyos.com/robots.txt` should allow, and
`/en` should show the free-plan CTAs with no beta chips.

### 30. The admin login is switched off locally

`.env.local` sets `PAYLOAD_DEV_AUTOLOGIN=1`, which makes `/admin` skip its
login screen and sign the session as `abdullah@markyos.com`. It was added on
23 Oct 2026 because the plaintext password for that account was never recorded
and the login could not be got past.

**Nothing has to be done before launch**, and that is the point of how it is
guarded rather than a reason to stop reading:

- `.env.local` is gitignored, so the flag is not in the repo and cannot be
  deployed by accident.
- `payload.config.ts` also requires `DATABASE_URI` to be unset. Production
  runs on Postgres — item 15 on this list — so the flag is inert there even if
  somebody sets it.

What to check anyway, because "inert by construction" is worth one command:

```bash
# On the deployed site, this must be the login form, not the dashboard.
curl -s https://markyos.com/admin | grep -ci "password"
```

To restore the login screen locally, delete the two `PAYLOAD_DEV_*` lines from
`.env.local`. To get a password back instead, reset it from the admin's own
account screen once you are inside, or with Payload's forgot-password flow
once an email adapter exists (item 15).

### 30. The English edition's own open items (8 Nov 2026)

`/en` is a whole site now: twenty-five hand-written pages from Site Copy v3
(English), plus the forty CMS pieces, all indexable with a full hreflang
pair. What is *not* settled is what the deck itself marks, and none of it
is a code change — these are decisions and facts.

From the deck's own "open items" table, the ones that reach the English
pages as published text:

| Where | What is unresolved |
| :--- | :--- |
| `/en/contact` | Every address and reply time is a `[PLACEHOLDER]`. The page lists six topics and promises a reply; it names no inbox. |
| `/en/security` | The storage region, the AI provider and the training line are all `[CONFIRM]`. The page claims what the server will enforce, and nobody has checked it against the server. |
| `/en/about` | The founder's story is a draft in somebody else's voice, marked for Abdullah to rewrite. The second team member is a `[PLACEHOLDER: name]`. |
| `/en/pricing` | Every figure is a hypothesis until 1 Feb 2027, and the refund policy is a `[PLACEHOLDER]` that is simply absent from the page. |
| `/en/platform/arabic` | The dialect claims depend on the December Arabic test. |
| Hero, both editions | "No card needed" is unconfirmed, and the demo brand "Nakhla" / "Naqsh Studio" needs checking against real studios in the Gulf. |

Two the deck asks you to pick, which the site has answered one way and can
be changed in one edit each:

- **The AI Connector's URL.** The deck offers `/platform/ai-connector` or
  `/solutions/ai-connector`. Neither page exists here; every mention is an
  unlinked line with a status chip, which is the honest state until one is
  built.
- **The hero's button wording.** The deck's homepage says "I make brands
  for clients"; its What's new entry says "I design identities for
  clients". The site uses the first, in both languages, and the sign-up
  fork has to match it word for word.

Also carried: `/en/whats-new`'s entries and `/en/help` are CMS sections, so
the help centre is still empty in both editions — ten articles are planned
in the source README and none is written.
