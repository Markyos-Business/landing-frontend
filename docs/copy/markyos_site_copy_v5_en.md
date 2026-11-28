# Markyos · Site Copy v5 · The Full Site in English
**Version 5.0 · 26 November 2026 · English, the site's second language**

This is the English site, every page, in one file. It's generated from the Arabic master (`markyos_landing_page_copy_ar.md`), which leads: same pages, same facts, same chips, same open items. If the two ever disagree, fix the master and regenerate this file.

## How to read this file

- **The rules and the style** are in the master's Section 0: say what it is first, one idea per section, short by default, show then say, one message written natively twice, tell each story once, no proof we don't have.
- **The facts** (plans, prices, limits, what's live) come from Notion HQ and pricing v5.1. If a number here and Notion disagree, Notion wins.
- **Plan names:** Free · Freelancer · Studio · Company.
- **British spelling:** colour, organise, licence, centre, analyse.
- **URLs** live under `/en/`, each paired with its Arabic page by `hreflang`. [CONFIRM: the `/en/` prefix in the Next.js routing]
- **Chips:** `[CHIP: Coming soon]`, with no date. No chip means live at launch, 15 February 2027.
- **Notes for the team** (tool tags, *Why it works*, [CONFIRM]) never appear on the site. Some tool notes quote the Arabic line they describe.
- **The language switch** reads «العربية». **The hero cards** are mirrored: card 1 sits on the left.
- **Tagline:** At home in both languages. **Slogan:** Studios build it. Companies live it. (homepage and launch only, never the companies page). **Product description:** Every asset. Every instruction. Both directions. (Platform page only.)

---

# Part A · Global Elements and Homepage

## 1. Global Elements

### 1.1 Header

**Announcement bar** (above the nav, on every page)

> Launch offer: 30% off your first three months →

Short version, below 810px:

> 30% off your first three months →

[CONFIRM: launch offer terms (Part D, Page 1). Remove the bar when the offer ends.]

`[DESIGN: full width, about 40px tall, centred text, links to /pricing. It sits above the floating nav and scrolls away with the page; the nav stays sticky. A close button (×, label «إغلاق» / "Close") hides it, and the choice is remembered for that visitor until the offer changes.]`

**Navigation**

| Order | Text | Type |
| :-: | :--- | :--- |
| Logo | Markyos logo + "At home in both languages." | Link home |
| 1 | Solutions ▾ | Audience menu |
| 2 | Platform ▾ | Feature menu |
| 3 | Brand Brain | Link to `/en/platform/brand-brain` |
| 4 | Pricing | Link |
| 5 | Resources | Link |
| End | Log in | Link |
| End | **Start free** | Pill button |
| End | العربية | Language switch |

`[DESIGN: floating pill nav, content-width, sticky, backdrop blur. The tagline hides below 810px.]`

### 1.2 Solutions menu

|  | Text | Link |
| :--- | :--- | :--- |
| Studios and agencies | Every project, and your team, in one place. | `/en/solutions/studios` |
| Freelance designers | Work alone. Show up as a team. | `/en/solutions/freelancers` |
| Companies | On brand. On time. In both languages. | `/en/solutions/companies` |

### 1.3 Platform menu

| Discover and think | Build and deliver | Run |
| :--- | :--- | :--- |
| Discovery forms | Asset library | Brand voice |
| AI brief analysis | Guideline site | Tone checker |
| Strategy hub | Studio board | Leadership alignment |
| Moodboards (coming soon) | Handoff | Viewers and sharing |
|  | Mockup builder |  |

**Featured card** (full height, beside the three columns): Brand Brain · The engine behind every feature.

### 1.4 Footer

| Product | For | Resources | Company | Legal |
| :--- | :--- | :--- | :--- | :--- |
| All features | Studios | Blog | About | Privacy |
| Brand Brain | Freelancers | Guides | Contact | Terms |
| Pricing | Companies | Help centre |  | Security |
| Roadmap |  | Compare |  | Cookies |

> Markyos. At home in both languages.

---

## 2. Homepage

Eleven sections, in the live site's order, rewritten with the review's fixes. The two languages carry the same sections, the same table rows and the same twelve questions.

| # | Section | Text |
| :-: | :--- | :--- |
| 1 | Hero | Studios build it. Companies live it. |
| 2 | Problem | Brands don't die. They drift. |
| 3 | One home | One home. Every piece connected. |
| 4 | Brand Brain, the engine | It reads before it writes. |
| 5 | Three ways in | Three ways in. One brand. |
| 6 | Comparison | Fewer files. A clearer brand. |
| 7 | What it doesn't replace | What Markyos doesn't replace. |
| 8 | Both languages | Right to left. Left to right. Always right. |
| 9 | Pricing | Start free. Pay as you grow. |
| 10 | Questions | Questions. Short answers. |
| 11 | Last call | Build it. Hand it over. Keep it alive. |

### 2.1 Meta

| Field | Text |
| :--- | :--- |
| Page title | Markyos · The bilingual brand hub for studios and companies |
| Description | Discovery forms, strategy, files, guidelines and brand voice in one place, in Arabic and English. Built for studios, freelancers and companies. Start free. |
| Share title | Studios build it. Companies live it. |

*Why:* the old titles led with the tagline, which neither search engines nor people can decode. These lead with the category and the audience. The slogan moves to the share title, where people see the page with its image.

### 2.2 Hero

**Eyebrow** (small, above the headline)

> The brand hub, in Arabic and English

**H1** (two lines, each its own span)

> Studios build it.
> Companies live it.

*Tool: rhyme (يبنيها / تُحْيِيها) · antithesis · repetition.*

**Sub**

> From the first question you ask a client to the last post the company writes, the whole brand lives in one place, with Brand Brain: an AI that knows it and works with you at every step. In Arabic and English, as equals.

**Buttons** (equal weight)

> **[Button: I design brands for clients]** · **[Button: I run my company's brand]**

**Under the buttons**

> Try it free for 14 days. No card needed. **[Link: Or explore a sample brand hub]**

[CONFIRM: the sample hub's URL (the demo brand «نخلة» / Nakhla), open without signing in.]

**Floating cards**

|  | Text |
| :--- | :--- |
| Card 1, beside line 1 | File `logo-ar.svg` · tag "Naqsh Studio" |
| Card 2, beside line 2 | A short post with the badge "86 · On brand" · tag "Marketing team" |

*Why it works:* The slogan stays because it is approved and memorable, and the eyebrow does the explaining, so a cold visitor knows what Markyos is before reading the slogan. The sub names one moment from each side (the studio's first question, the company's daily post), so it earns the slogan instead of repeating it, and it names the engine, Brand Brain, before the visitor scrolls. "Design" replaces "make" because it is the word designers use for themselves. The line under the buttons gives a second, low-risk door for people not ready to sign up.

**Proof slot** (below the hero, hidden at launch)

> [PLACEHOLDER: a single line of real beta studios and companies, names or logos, only with written permission. Until then, nothing here.]

### 2.3 Problem: brands drift

**H2**

> Brands don't die. They drift.

*Tool: antithesis · sound (die / drift).*

**Intro**

> Every brand project passes the same stops. Each one has its own tool, its own file and its own person.

**Five stops**

| Stop | The usual tool | What actually happens |
| :--- | :--- | :--- |
| Discovery | Google Forms · Typeform | Answers land in a spreadsheet, and you retype them somewhere else. |
| Strategy | Word · Notion · PowerPoint | Presented once, then filed away. |
| Files | Google Drive · Dropbox | "logo_final_2_new.png", and five versions nobody trusts. |
| Handoff | WeTransfer | The link expires in days. So does the relationship. |
| Everyday writing | ChatGPT · Grammarly | Confident writing, in a voice that isn't yours. |

**Symptom cards** (three, under the table)

| Text | Visual |
| :--- | :--- |
| Sales is still using the old logo. | The old logo in a sales deck |
| The Arabic says what the English never did. | Two posts side by side that disagree |
| Every brand question lands on one desk. | A stack of messages to one person |

**Closing**

> Nobody did anything wrong. The brand just never had a home. We call this brand decay.

*Why it works:* Seven stops became five; inspiration and guidelines live in the comparison table, so the tool story is told once. The closing is the page's emotional turn: it takes the blame off the reader and names the problem Markyos owns. It now runs in both languages.

[DESIGN: every mock and locale label uses en-US on both sites.]

### 2.4 One home

**H2**

> One home. Every piece connected.

*Tool: rhyme (مكانها / بيانها) in Arabic · benefit first in English. The Arabic rhyme can't travel, so the English says the idea plainly.*

**Body** (one line each)

> In Markyos, the brand doesn't move from tool to tool. It grows in one place, and Brand Brain carries it from one step to the next.
> Answers become an analysis.
> The analysis becomes a strategy.
> The strategy becomes the voice the company writes in.
> The files become a living guideline the team opens every day.
> Change a colour once, and it changes on every page that uses it.

*Tool: repetition (يصبح / becomes) · rhythm.*

**Three stages** (pinned scroll, the product window changes)

| Stage | Text | Who | Window shows |
| :--- | :--- | :--- | :--- |
| Create | Discover the brand. Build its guide. | Studios and freelancers, or the company's own team | A form answered, the analysis, files dropped in and the guide building |
| Deliver | The whole brand moves to its owner, with everything in it. | The studio and the client | The ownership chip moving from the studio to the client |
| Run | It lives in everything the company writes. | Companies | The tone checker scoring a post |

**In the middle** (the hub the three stages turn around)

> One source of truth: every logo, colour and rule has a single version that shows up wherever it's needed. Brand Brain reads from it.

> **[Link: All features]** `/en/platform`

*Why it works:* The old Arabic was one 60-word sentence; short lines let the chain land one step at a time. The colour line is the most concrete proof of "one source of truth", so both languages end on it.

### 2.5 Brand Brain: the engine

**Eyebrow**

> The engine behind every feature

**H2**

> It reads before it writes.

*Tool: antithesis.*

**Sub**

> Brand Brain is the AI inside Markyos, and it's connected to every part of it. It reads your brand, not the internet: the client's answers, the strategy, the voice, the terms and the approved files. Then it works with you at every step.

**One brain, every part**

`[DESIGN: the mirror of the problem section. There, five tools converge into Markyos; here, one Brand Brain mark sits in the centre and lines run out to every part of the platform. Each line lights up as its row scrolls into view.]`

| Where | What it does |
| :--- | :--- |
| Discovery forms | Analyses the answers, and finds contradictions and missing questions before design. |
| Leadership alignment | Compares your leaders' answers, and shows where they agree and where they don't. |
| Strategy hub | Turns the analysis into drafts, and thinks it through with you in the strategy assistant. |
| Guideline site | Writes the section copy in both languages, from your strategy and your voice. |
| Mockup builder | Makes the scene, and puts your real identity on it. |
| Tone checker | Checks every text against your voice and your terms, and rewrites or translates it. |
| Ask the Brand | Answers your team from the hub, and shows where the answer came from. |

> Whatever it learns at one step, it reads at the next. And because it always reads the current version, when you change something, it knows.

*Tool: repetition (يكتشفه / يقرؤه) · benefit first.*

**What it does for you**

|  | When you build a new brand | When you run an existing brand |
| :--- | :--- | :--- |
| Reads | The client's answers to the form | Your leaders' answers, your content and your voice |
| Shows you | Contradictions and missing questions, before you start designing | Where content drifted from your voice, and where leaders disagree |
| Suggests | Drafts for the strategy and the guide's copy | Wording closer to your voice, in both languages |

**Why not just ChatGPT?**

- You explain your brand in every chat. Brand Brain read it before you asked.
- It writes in a generic voice. Brand Brain writes in yours, in both languages.
- It sees only what you give it. Brand Brain sees the whole brand, so it sees where it splits.

*Tool: antithesis · repetition.*

**Closing line**

> ChatGPT knows everything about the world. Brand Brain knows your brand.

**Clear limits**

> It suggests. You decide. Everything it writes reaches you as a draft that shows where it came from, and nothing in your brand changes until you accept it. It never draws a logo.

> **[Button: See Brand Brain at work]** · On paid plans, your own tools like ChatGPT and Claude can read your brand through the AI Connector. Read only. `/en/platform/brand-brain`

*Why it works:* Brand Brain is the one thing no stack of tools can copy, because it only works when everything lives in one place. So it moves up to fourth, straight after "One home": the visitor learns where the brand lives, then what thinks with it. The map shows it's not one feature but the engine behind seven of them. The "why not ChatGPT" rows answer the question every visitor already has, in three short contrasts.

### 2.6 Three ways in

**H2**

> Three ways in. One brand.

*Tool: antithesis · three.*

|  | Text |
| :--- | :--- |
| **Card 1 · Studios and agencies** | **Studios and agencies** |
| Promise | Every client, every stage, one board. |
| Outcome | From the discovery form to the brand hub handoff, your team runs every client project in one place, and sees where each one stands at a glance. |
| You start with | Discovery forms, the AI brief analysis and the studio board. |
| Button | **[Button: I design brands for clients]** |
| **Card 2 · Freelancers** | **Freelancers** |
| Promise | Work alone. Show up as a team. |
| Outcome | A form a strategist wrote, an analysis that catches what you missed, and a guide built in minutes. Your client sees a full process, not a zip file. |
| You start with | The AI brief analysis, the guideline site and the handoff. |
| Button | **[Button: Start as a freelancer]** |
| **Card 3 · Companies** | **Companies** |
| Promise | One brand across the whole company, in both languages. |
| Outcome | Your team finds the right logo on their own, asks the brand instead of asking you, and writes in its voice on every channel. |
| You start with | The brand hub, the tone checker and Ask the Brand. |
| Button | **[Button: I run my company's brand]** |

[CONFIRM: Ask the Brand on the companies card stays only if it ships in the beta, as Notion's roadmap says. If it slips, swap it for «مركز الأصول» / "the asset library".]

*Why it works:* "Modules 1 to 7" and "the viewers" were internal words. Each card now gives one promise, one outcome and three named tools. All three buttons follow one pattern: the visitor picks themselves.

### 2.7 Comparison

**H2**

> Fewer files. A clearer brand.

*Tool: antithesis (أقل / أوضح) · rhythm.*

**Intro**

> An honest comparison, stop by stop. What matters isn't how many tools you drop. It's that everything left is connected.

| Task | You use today | In Markyos | What actually changes |
| :--- | :--- | :--- | :--- |
| Discovery form | Google Forms · Typeform · Tally | Bilingual brand forms, with questions a strategist wrote | Answers become an analysis and strategy drafts, with no copy and paste |
| Reading the answers | Two hours of your time, or ChatGPT with no context | The AI brief analysis: contradictions, missing questions, directions | The first one is free on every project |
| Strategy | Word · Google Docs · Notion · a deck | A strategy hub built for brands, in both languages | It flows into the guide and the voice, instead of sitting in a folder |
| Moodboards | Milanote · Pinterest · Miro | `[CHIP: Coming soon]` A moodboard that pulls colours from your real images | The board turns into decisions: colours and drafts |
| Files | Google Drive · Dropbox | An asset library that sorts your files on its own | One right version of every logo, font and colour |
| Guidelines | A PDF from InDesign · Guidelines.site | A guideline site built from the project's files, in both languages | Minutes instead of days, connected to everything before it |
| Handoff | A zip over WeTransfer and an email | Ownership of a live brand hub moves to the client | Your client owns the brand. You stay on its team, and earn when they upgrade |
| Brand voice | Grammarly · Writer · ChatGPT | A tone checker that knows your voice and your terms | It understands Arabic and its registers, priced per brand, not per person |
| Tracking projects | A spreadsheet · Trello | The studio board, by each project's stage | You see where every client stands at a glance |
| Staff questions | Endless messages to the marketing lead | Ask the Brand | Staff answer themselves from the hub |
| Your AI tools | ChatGPT and Claude, without knowing your brand | The AI Connector | They read your real brand before they write |

**Footnote** (small)

> Names are trademarks of their owners, used for description only. **[Link: All comparisons]** `/en/compare`

[CONFIRM: one legal read before launch.]

*Why it works:* This is the page's strongest proof, so it keeps every row. The handoff row now makes the same promise in both languages, and that promise is real: the partner reward pays 20% of the client's first year. The moodboard row carries its chip, because moodboards are not live at launch.

### 2.8 What Markyos doesn't replace

**H2**

> What Markyos doesn't replace.

| Item | Text |
| :--- | :--- |
| Your design tool | Design in Figma or Illustrator, as you do today. Markyos takes the final files and holds everything around the design. |
| Sales and invoicing | Proposals and invoices stay in your tools. |
| A whiteboard for everything | If you use Miro for meetings that have nothing to do with the brand, it stays where it is. |

*Why it works:* It answers the biggest objection ("do I have to move everything?") before anyone asks it, and it makes the rest of the page easier to believe. Kept as it was; only the last line about "our boards" left, because moodboards aren't live yet.

### 2.9 Built in both languages

**H2**

> Right to left. Left to right. Always right.

*Tool: rhyme (اليسار / المسار) · double meaning (EN "right") · three.*

**Body**

> You know the feeling. A great tool in English, then you type your first Arabic line: the arrows flip the wrong way, the sentence breaks, and your Arabic typeface hides behind a fallback.
> Most brand tools were built in English and learned a little Arabic later. Markyos was built on both from the first line of code. Nothing was machine translated: the questions, templates and guideline copy were written in both languages.

**Five points**

- Real mirroring of every layout, menu and arrow
- Arabic and Latin logos, each in its own slot
- Both scripts' typefaces side by side
- The right Arabic register for each channel [CONFIRM: December Arabic test]
- Terms that stay fixed in both languages

> **[Link: Built in Arabic]** `/en/platform/arabic`

*Why it works:* The "you know the feeling" paragraph is the most human moment on the site, and English-speaking buyers in the Gulf and Asia live the same pain, so it now runs in both. The "nothing machine translated" proof moved into Arabic, where it convinces most.

### 2.10 Pricing

**H2**

> Start free. Pay as you grow.

*Tool: antithesis · rhythm.*

**Sub**

> Try any paid plan for 14 days, no card needed. Then subscribe, or stay on the free plan. Nothing is deleted.

**Three cards** (each: price, the limit that matters, who it's for)

|  | Text |
| :--- | :--- |
| **Freelancer** | **$12 / month** · Up to 3 active brands · You work alone |
| Who | For one person running a few client brands. |
| **Studio** | **$29 / month** · Up to 10 active brands · 5 team members |
| Badge | For teams |
| Who | For studios running client brands with a team. Brands you hand off don't count. |
| **Company** | **$19 / month per brand** · Unlimited editors and viewers |
| Who | For a company running its own brand, with the tone checker and Ask the Brand. |
| Button, every card | **[Button: Try free for 14 days]** |

**Under the cards**

> And a free plan, always, with one brand and the "Made with Markyos" badge. Prices in US dollars, paid through PayPal. Yearly: two months free. **[Link: Every detail and limit]** `/en/pricing`

*Why it works:* The old section said "each plan covers one brand" and then "Brands: 3", and marked a plan "most popular" before launch. Now every card shows one price, the one limit that decides, and who it's for. "For teams" replaces "most popular" because it's true today. The full limits live on the pricing page.

### 2.11 Questions

**H2**

> Questions. Short answers.

*Tool: rhythm.*

| # | Text |
| :-: | :--- |
| 1 | **Can Markyos really replace Google Forms, Milanote and Drive?** For everything about the brand, yes: forms, files, guidelines and handoff, in one connected place. Moodboards are coming soon. Your other tools stay for work that has nothing to do with the brand. |
| 2 | **What is Brand Brain? Is it ChatGPT?** It's the AI inside Markyos, and it answers from your brand, not the internet. It drafts and suggests. It never draws a logo, and changes nothing without your approval. |
| 3 | **Can I connect ChatGPT or Claude to my brand?** Yes, on every paid plan. The connected tool reads your brand and can't change it, and the account owner decides who connects. |
| 4 | **My guideline is on Guidelines.site or in a PDF. Do I start from scratch?** No. Drop in your brand files, and Markyos builds the hub and the guide from them. Reading an old PDF guide and turning it into a hub is coming soon. |
| 5 | **Is Markyos a design tool?** No. Design in Figma or Illustrator; Markyos holds everything around the design. |
| 6 | **Who is Markyos for?** Studios and freelance designers who build brands for clients, and companies that run their own brand. One account holds both. |
| 7 | **What happens to my client's hub if they don't pay?** It stays theirs, live and editable on the free plan, with the "Made with Markyos" badge. When they subscribe, the badge goes, and you earn 20% of what they pay in their first year. |
| 8 | **How good is the Arabic, really?** Arabic isn't a translation layer. The interface fully mirrors, Arabic logos and type have their own slots, the tone checker tells Arabic registers apart, and the questions are written in both languages. |
| 9 | **Is my content safe?** Nothing in your workspace goes public until you publish it. Text you check isn't kept unless you choose. **[Link: Security]** |
| 10 | **How do I pay?** Through PayPal, with your PayPal account or your card, in US dollars. More ways to pay are coming soon, including Mada cards. |
| 11 | **Do I need a studio to use Markyos?** No. A company can start on its own: build its hub, write its voice and check its content. If a studio works with you, invite them at no extra cost. |
| 12 | **Does the AI design logos?** Never. It reads and drafts words. In the mockup builder, it puts your own identity on the templates. It never invents a logo. |

[CONFIRM: question 10, card checkout through PayPal without an account for subscriptions in Saudi Arabia and Malaysia. If not, drop «أو ببطاقتك» / "or your card".]

*Why it works:* Both languages now carry the same twelve questions. Question 11 matters most for company buyers, because the slogan suggests a studio is part of the deal. Question 7 changed: the hub no longer waits behind a payment to be shared; it stays live on the free plan with the badge.

### 2.12 Last call

**Eyebrow**

> Start today

**H2**

> Build it. Hand it over. Keep it alive.

*Tool: three · rhythm. Three actions the reader takes, in both languages.*

**Sub**

> Your whole brand in one place, in Arabic and English. Open it a year from now, and it's exactly as you left it. Not a copy of a copy.

> **[Button: I design brands for clients]** · **[Button: I run my company's brand]**

> Try it free for 14 days. No card needed.

*Why it works:* "Built. Shared. Alive." described a state; the Arabic gave three actions. The English now matches. The "a year from now" line is the best closing promise on the page and now runs in both languages.

---

## 3. The Interactive Hero: Spec

Stack: Next.js, Tailwind tokens from `framer-DESIGN.md`, Framer Motion. The hero is the first frame of the product story in section 2.4.

### 3.1 Layout

| Element | Spec |
| :--- | :--- |
| Canvas | The design system's near-black |
| Eyebrow | Small, muted, centred above the H1, one line on mobile |
| H1 | Two lines, each an inline-block span with a hard break, animated separately |
| H1, Latin | Display face, weight 500, about 62px, tracking about −0.025em, line height about 1.16 |
| H1, Arabic | Arabic display face, same size or one step larger, **no negative tracking**, line height about 1.3 |
| Sub | About 0.45× the headline, one line on desktop |
| Buttons | Two pills, equal size, the single accent blue |
| Stage | One relative container, about 1080px wide, holding the app window and both cards |
| App window | Translucent dark surface, radius about 27px, hairline edge, peeking up from the bottom. Shows the demo brand's hub in the page language |
| Cards and tags | Rounded, strong shadow; warm name tags under each |

### 3.2 Coordinates and motion

- Both cards sit in the **same container as the window**, anchored to its centre (`left: 50%; top: 50%`) plus an offset, so dropping a card in is a tween of `x` and `y` to 0. Arabic: card 1 on the right. English: card 1 on the left.
- **Entrance:** announcement bar → nav → eyebrow → H1 line 1 → line 2 → sub and buttons → cards (from blurred and dim) → tags → window slides up. Each element `initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}`, staggered.
- **Section 2.4** pins the window and swaps it through three stages: Create (form, report, card 1 drops in, guide builds), Deliver (ownership chip moves), Run (card 2 drops in, tone score).

### 3.3 Rules

- **Real product only.** Every screen is recorded from or rendered by the real app.
- **Name tags are never live cursors.** Markyos has no real-time co-editing; the tags only label who did what.
- **No moodboard** in the story until moodboards ship.
- **Reduced motion:** stills, chapters as tabs.
- **Below 810px:** cards above the window; chapters become swipeable tabs.
- **Performance:** loops under 8 seconds, lazy-loaded after the first frame.

---

## 4. Review · Part A

| Question | Answer |
| :--- | :--- |
| One rhymed line per section at most? | Yes. Hero, one home (Arabic), both languages |
| Reads translated? | No. Where an Arabic rhyme can't travel (section 2.4), the English says the idea plainly |
| Hype, banned words, dashes? | None |
| Both languages say the same thing? | Yes: same sections, same table rows, same handoff promise, same twelve questions |
| Every feature live or chipped? |  |
| Brand Brain | Named in the hero sub, the engine of section 2.4, its own section fourth on the page, in the comparison, and in three of the twelve questions |
| Slogan rule | Hero and share title only, under an eyebrow that names the category |
| Review fixes applied | All four main fixes and every smaller one: eyebrow, tashkeel, five stops, the closing in English, short lines in "one home", self-naming buttons, the handoff row, the Brand Brain table header, the empathy paragraph in English, one price structure, twelve questions, a three-action closing |

---

# Part B · Solutions

Pages: Solutions hub · Studios and agencies · Freelance designers · Companies.

**Shape of every audience page:** hero · four cards (the audience's top four features, each linking to its feature page) · one block on what makes the difference · a one-line pricing strip · three questions · last call. About 220 words a language.

**Slogan rule:** no slogan on these pages. On the companies page, nothing suggests a studio is needed.

---

## Page 1 · Solutions hub

| Field | Value |
| :--- | :--- |
| URL | `/en/solutions` |
| Title | Solutions · Markyos |
| Meta | For everyone who makes or runs a brand: studios, freelancers and companies. |

### Hero

> Choose your way in.

*Tool: rhythm.*

> One Markyos, three ways in. Pick the one that sounds like you.

*Why it works:* The hub has one job, sending people to their page, so the headline is the instruction.

### Three cards

|  | Text | Button |
| :--- | :--- | :--- |
| Studios and agencies | From the first question to the final handoff. | `/en/solutions/studios` |
| Freelance designers | Work alone. Show up as a team. | `/en/solutions/freelancers` |
| Companies | On brand. On time. In both languages. | `/en/solutions/companies` |

### Not sure?

> Your brand, or your client's? If it's your client's, you're a studio. If it's your company's, you're a company. One account holds both.

*Tool: antithesis.*

---

## Page 2 · Studios and agencies

| Field | Value |
| :--- | :--- |
| URL | `/en/solutions/studios` · button to `/en/start?type=studio` |
| Title | Markyos for Studios · From the First Question to the Final Handoff |
| Meta | Bilingual briefs, an AI read of every brief, guideline sites that build themselves, and a handoff that pays you back. Start free. |

### Hero

> From the first question to the final handoff.

*Tool: antithesis (الأول / الأخير) · sound (EN first / final).*

> Every project, from the client's brief to a live hub they own. And every project on one board.

> **[Button: Start your first project free]**

*Why it works:* The whole studio job in its two ends, so it promises the scope without listing features. The sub adds what a studio with ten clients needs to hear: all of them, on one board.

### Four cards

> Less admin. More design.

*Tool: antithesis · benefit first.*

| Card | Text | Link |
| :--- | :--- | :--- |
| Studio board | Every project, every stage, at a glance. | `/en/platform/studio-board` |
| Brief and analysis | Find the contradictions before you design. The first analysis is free. | `/en/platform/brief-analysis` |
| Guideline site | Days of layout, in a few clicks. | `/en/platform/guideline-sites` |
| Handoff | Your client owns the brand. You earn as they grow. | `/en/platform/handoff` |

> **[Link: Every feature]** `/en/platform`

**Brand Brain with you**

> It reads every brief before you do, and writes the first drafts of the strategy and the guideline copy. You spend your time designing, not formatting.

### What makes the difference

> Hand over a brand, not a folder.

*Tool: rhyme (حيّة / منسيّاً) · antithesis.*

> Your client gets a hub with their name on it, and you get 20% of what they pay in their first year. Eight clients on the Company plan cover your whole Studio plan.

> **[Link: How handoff works]** `/en/platform/handoff`

### Pricing strip

> One brand free. Three on your own. Ten with a team. **[Link: Compare plans]** `/en/pricing?for=studios`

> Studio is $29 a month for 10 active brands and 5 members, and brands you hand off don't count. Try it free for 14 days.

*Tool: three · repetition.*

### Questions

- **Does it replace our CRM?** No. Proposals and invoices stay in your tools.
- **What if the identity is already done?** Start at file intake.
- **Does my client see the references?** Only what you share.

### Last call

> Leave your mark. Make it last.

*Tool: double meaning (بصمة / mark: your work, and the brand's mark).*

> **[Button: Start your first project free]**

---

## Page 3 · Freelance designers

| Field | Value |
| :--- | :--- |
| URL | `/en/solutions/freelancers` · button to `/en/start?type=studio` |
| Title | Markyos for Freelance Designers · Work Alone, Show Up as a Team |
| Meta | A strategist's read on every client, guidelines without the layout hours, and a handoff that matches your work. Your first project is free. |

### Hero

> Work alone. Show up as a team.

*Tool: antithesis.*

> A strategist's read on every client, a guide without the hours of layout, and a handoff your client talks about.

> **[Button: Start your first project free]**

*Why it works:* Five words that name the fear (alone) and the promise (a team). The sub is three things a studio has and a freelancer doesn't.

### Four cards

> A whole studio, in one account.

*Tool: antithesis (كامل / واحد).*

| Card | Text | Link |
| :--- | :--- | :--- |
| AI brief analysis | A strategist beside you on every project. | `/en/platform/brief-analysis` |
| Guideline site | The unpaid hours, gone. | `/en/platform/guideline-sites` |
| Handoff | The moment your client remembers, and refers you from. | `/en/platform/handoff` |
| Mockup builder | Your client sees the identity on a business card and a sign before approving it. | `/en/platform/mockups` |

**Brand Brain with you**

> The strategist a freelancer doesn't have: it catches what you missed in the client's answers, thinks it through with you, and writes the first draft. **[Link: Brand Brain]** `/en/platform/brand-brain`

### Pricing strip

> Your first brand is free, always. The Freelancer plan is $12 a month for three active brands, and brands you hand off don't count. **[Link: Compare plans]** `/en/pricing?for=studios`

*Tool: benefit first.*

### Questions

- **A full project free, really?** Yes, brief to handoff, with a small badge.
- **Does my client need an account?** Only when they take over the hub.
- **And if I grow into a team?** Move to Studio. Your projects come with you.

### Last call

> Your next project, at studio level.

*Tool: benefit first.*

> **[Button: Start your first project free]**

---

## Page 4 · Companies

| Field | Value |
| :--- | :--- |
| URL | `/en/solutions/companies` · button to `/en/start?type=company` |
| Title | Markyos for Companies · On Brand, On Time, In Both Languages |
| Meta | One hub for your brand's files, guidelines and voice, a tone checker that knows you, and unlimited editors and viewers. Try it free for 14 days. |

### Hero

> On brand. On time. In both languages.

*Tool: three · repetition.*

> One hub for your brand's files, guidelines and voice, used by everyone. So you stop being the person who gets asked everything.

> **[Button: Set up your brand free]**

*Why it works:* Three promises, each one a pain a brand lead lives with: off-brand, late, and drifting between languages. The sub ends on the feeling.

### The problem

> "Where's the transparent logo?" "Does this sound like us?" "What's the product called in Arabic?" The same questions every week, and the content still comes out in different voices.

*Tool: three · rhythm. No headline: the quotes are the headline.*

### Four cards

> One company. One voice.

*Tool: antithesis · repetition.*

| Card | Text | Link |
| :--- | :--- | :--- |
| Asset library | One right version of every file. | `/en/platform/asset-library` |
| Tone checker | Know in seconds if it sounds like you. | `/en/platform/tone-checker` |
| The whole team | Whoever needs to edits it. Everyone uses it. One price per brand. | `/en/platform/team-and-sharing` |
| Brand voice | Arabic and English say the same thing. | `/en/platform/brand-voice` |

> Plus Ask the Brand, and the AI Connector. `[CHIP: Coming soon]` Department playbooks.

**Brand Brain with you**

> It checks every text before it goes out, answers your team instead of you, and compares your leaders' views. A brand editor working with everyone, at the same time. **[Link: Brand Brain]** `/en/platform/brand-brain`

### Start where you are

> Start where your brand is today.

*Tool: benefit first.*

- **Have brand files?** Drop them in, and the hub builds.
- **Only a logo and colours?** Start with the leadership questionnaire.
- **Work with a studio?** Invite them to set it up.

### Pricing strip

> Pay for the brand, not the people. $19 a month per brand, with unlimited editors and viewers. **[Link: Compare plans]** `/en/pricing?for=companies`

*Tool: antithesis.*

### Questions

- **Do we pay for every employee?** No. You pay per brand, and editors and viewers are unlimited.
- **What happens to the text we check?** It isn't kept, unless you choose.
- **We have more than one brand.** Each extra brand is $19 a month, with its own limits.

### Last call

> At home in both languages.

*Tool: double meaning (بيت: the hub, and where a brand belongs). The tagline closes the page instead of the slogan.*

> **[Button: Set up your brand free]**

---

## Review · Part B

| Question | Answer |
| :--- | :--- |
| One rhymed line per section at most? | Yes. Studios: the handoff block. Companies: the tagline |
| Hype, banned words, dashes? | None |
| Every feature live or chipped? | Yes |
| Slogan rule | Not used |
| Shortest it can be? | Feature tables went from 7 or 8 rows to 4 cards. The rest is a link away |

---

# Part C · Platform and Features

Pages: Platform hub · Brand Brain · Built in Arabic · 13 feature pages. Old single-solution URLs redirect (301) to the feature pages.

**Shape of every feature page (about 120 words a language):** hero (headline, one sentence, button) · how it works (three steps, one line each) · what's inside (five items at most) · one line on what it works with and which plans · the hero button again at the bottom (not rewritten below). Coming items carry their chip. Feature pages name categories, never competitors.

---

## Page 1 · Platform hub

| Field | Value |
| :--- | :--- |
| URL | `/en/platform` |
| Title | Platform · Every Markyos Feature |
| Meta | Forms, strategy, boards, files, guidelines, handoff, voice, and an AI that knows your brand. One platform, two languages. |

### Hero

**Eyebrow** (product description, this page only)

> Every asset. Every instruction. Both directions.

> Create. Deliver. Run.

*Tool: three · rhythm.*

> Everything a brand needs, in one platform, and every part feeds the next. At its heart: Brand Brain.

*Why it works:* Three verbs are the map of the page. Each one is a column below.

### Three columns

| Feature | Text | Link |
| :--- | :--- | :--- |
| **Create** |  |  |
| Discovery forms | Better questions, from one link. | `/en/platform/discovery-forms` |
| AI brief analysis | What your client said, and didn't. | `/en/platform/brief-analysis` |
| Strategy hub | Strategy you use, not file. | `/en/platform/strategy-hub` |
| Moodboards | `[CHIP: Coming soon]` From reference to decision. | `/en/platform/moodboards` |
| Asset library | One right version of every file. | `/en/platform/asset-library` |
| Guideline site | A guide people actually open. | `/en/platform/guideline-sites` |
| Mockup builder | See it before you print it. | `/en/platform/mockups` |
| **Deliver** |  |  |
| Studio board | Every project, at a glance. | `/en/platform/studio-board` |
| Handoff | A living brand, for its owner. | `/en/platform/handoff` |
| **Run** |  |  |
| Brand voice | Two languages. One voice. | `/en/platform/brand-voice` |
| Tone checker | Your brand, word for word. | `/en/platform/tone-checker` |
| Leadership alignment | Many views. One brand. | `/en/platform/leadership-alignment` |
| Viewers and sharing | A few change it. Everyone uses it. | `/en/platform/team-and-sharing` |

### Brand Brain, the engine

> The engine behind every feature.

> Brand Brain is the AI inside Markyos. It reads your whole brand, and works inside seven features on this list: the analysis, the strategy, the guideline copy, mockups, leadership alignment, the tone checker and Ask the Brand. **[Link: How Brand Brain works]** `/en/platform/brand-brain`

`[DESIGN: a small «عقل العلامة» / "Brand Brain" tag on every feature row where it works. This block sits above the three columns, not below them.]`

### Four principles

> Four principles. No exceptions.

*Tool: rhythm.*

- **Arabic isn't a translation.**
- **The AI suggests. People decide.**
- **One version of everything.**
- **Permissions live on the server, not just the screen.**

### Last call

> **[Button: I design brands for clients]** · **[Button: I run my company's brand]**

---

## Page 2 · Brand Brain

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/brand-brain` (anchors `#every-part`, `#agents`, `#versus`) |
| Title | Brand Brain · The AI That Knows Your Brand |
| Meta | An AI connected to every part of Markyos: it analyses the brief, drafts the strategy and the guideline copy, and checks every text in your brand's voice, in both languages. |

[Note: this is the page that sells the engine. Every feature page links here from its «عقل العلامة هنا» / "Brand Brain here" line.]

### Hero

**Eyebrow**

> The engine behind every feature

> It sees the whole brand. So it sees the cracks.

*Tool: antithesis (كاملة / تفترق) · repetition (EN sees / sees).*

> Brand Brain is the AI inside Markyos, and it's connected to every part of it. It reads your brand, not general knowledge, so it notices what everyone else misses, and writes in your voice in both languages.

> **[Button: Try your first analysis free]** · **[Link: Where it works]** `#every-part`

*Why it works:* It names the one thing only this AI can do: see every part at once, and so see the gaps between them. The eyebrow says it's not a feature but the engine.

### One brain, every part

`[anchor: #every-part]`

> One brain. At every step.

*Tool: antithesis (واحد / كل) · rhythm.*

`[DESIGN: the Brand Brain mark in the centre, the parts of the platform around it, a line to each. Hovering a part shows its row.]`

| Where | For | What it does |
| :--- | :--- | :--- |
| Discovery forms | Studios and freelancers | Analyses the answers in a ten-part report: contradictions, missing questions, possible directions. |
| Leadership alignment | Companies | Compares your leaders' answers, and writes the alignment report. |
| Strategy hub | Everyone | Turns the analysis into drafts, and thinks it through with you in the strategy assistant and brainstorm. |
| Guideline site | Everyone | Writes the section copy in both languages, from your strategy and your voice. |
| Mockup builder | Everyone | Makes the scene; Markyos puts your approved assets on it. |
| Tone checker | Companies | Scores every text out of 100 with the reason, and rewrites or translates it in your voice. |
| Ask the Brand | Companies | Answers your team from the hub, and names the page the answer came from. |
| Art direction | Studios | `[CHIP: Coming soon]` Reads the moodboard and the strategy, and suggests a visual direction. |
| Reading an old PDF guide | Everyone | `[CHIP: Coming soon]` Reads your old guide, and drafts the hub from it. |
| Brand health | Companies | `[CHIP: Coming soon]` Measures how close your content stays to your voice, month after month. |

> What it learns at one step, it reads at the next: the analysis becomes strategy, the strategy becomes a voice, and the voice guides every text after it.

*Tool: repetition (يصبح / becomes).*

### How it works

> It reads. It notices. It suggests.

*Tool: three · rhythm.*

- **Reads** what you've built in Markyos, always the current version. Change a colour or a word, and it knows next time.
- **Notices** where the parts don't agree: a client who contradicts themselves, leaders who don't agree, a post that drifted, an Arabic version that says something the English doesn't.
- **Suggests** a draft that shows its source, in one queue waiting for your review. You decide.

### One brain, a specialist for every task

`[anchor: #agents]`

> One brain. A specialist for every task.

*Tool: antithesis · rhythm.*

> Behind Brand Brain are AI agents, each chosen for its task: a deep one for analysis, a fast one for checks. So a check comes back in seconds, and an analysis comes back with a strategist's depth. The brain that brings them together knows your whole brand.

| Agent | Its job |
| :--- | :--- |
| Analysis agent | Thinks deeply, compares answers, writes the analysis and the alignment report. |
| Strategy agent | Talks it through with you, with your brand's context in front of it. |
| Writing agent | Writes in your voice: section copy, deep checks, rewrites, translations. |
| Check agent | Fast, for thousands of checks a month. |
| Ask the Brand agent | Searches the hub and answers. |
| Image agent | Makes the mockup scene. |

[Note: never name the models on the site; they change every few months. The agent map comes from pricing v5.1, section 4.]

### New brand, existing brand

> A new brand starts right. An existing one finds itself again.

*Tool: antithesis · repetition.*

- **New:** it reads the client's answers, finds contradictions before design, and writes the first strategy drafts.
- **Existing:** it reads your leaders' answers and your content, shows where it drifted, and rewrites it.

**Example**

[Note: label it «مثال توضيحي» on the Arabic page and "Illustrative example" on the English page.]

> A café in Riyadh calls its brand "premium", then says its audience is "university students". The report puts the contradiction in front of you, with the question that settles it.

### Versus general AI

`[anchor: #versus]`

> General AI knows the world. Brand Brain knows your brand.

*Tool: antithesis · repetition.*

| A general AI tool | Brand Brain |
| :--- | :--- |
| You explain your brand in every chat. | It read it before you asked. |
| It sees only what you give it. | It sees the whole brand, so it sees where it splits. |
| It writes in a generic voice. | It writes in your voice and your terms, in both languages. |
| It gives you text to copy. | It gives you a draft in place, showing its source. |

> Your general tools, like ChatGPT and Claude, can read your brand too, through the AI Connector on paid plans. They only read, and they don't run Brand Brain.

### Promises

- Drafts, not decisions.
- Every draft shows its source.
- It never draws a logo.
- Your text isn't kept unless you choose.
- The first analysis on every new project and the first alignment report for every brand are free on every plan.

[CONFIRM: OpenAI's API data terms before adding any line about training.]

### Limits

> Every tool has its own monthly limit on every plan, and if one runs out, the rest keep working. **[Link: The limits on every plan]** `/en/pricing#limits`

### Questions

- **Is it ChatGPT?** No. It runs on OpenAI's models, and Markyos picks the right one for each task. But it answers from your brand, not the internet.
- **Does it change my brand on its own?** Never. Everything it writes is a draft waiting for your approval.
- **Does it understand dialects?** It writes and checks in Standard Arabic, or in a dialect you set for each channel. [CONFIRM: December Arabic test]

> **[Button: Try your first analysis free]**

---

## Page 3 · Built in Arabic

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/arabic` |
| Title | An Arabic-First Brand Platform · Markyos |
| Meta | An interface that fully mirrors, logos and type in both scripts, and a voice that understands Arabic register. |

### Hero

> Both directions. One brand.

*Tool: double meaning (اتجاه: RTL and LTR, and one strategic direction) · rhyme · antithesis.*

> Markyos didn't learn Arabic later. It was built on it, alongside English, as equals.

> **[Button: Start free]**

*Why it works:* «اتجاه» carries both meanings the page needs. The sub states the claim plainly.

### Six proofs

> Six proofs. Not one promise.

*Tool: antithesis.*

- **The whole interface mirrors.**
- **An Arabic logo and a Latin one,** each in its own slot.
- **Type in both scripts,** side by side.
- **Written, not translated.**
- **Arabic by register,** set per channel. [CONFIRM]
- **Terms that stay put** across both languages.

### English today (English site only)

> English today. Arabic when you're ready. Markyos works in English alone, and the day your brand needs Arabic, nothing has to be rebuilt.

*Tool: antithesis · benefit first. For English readers in Southeast Asia and beyond: the Arabic strength costs them nothing today.*

### Last call

> Finally, a platform that doesn't treat Arabic as a guest.

*Tool: benefit first.*

> **[Button: Start free]**

---

## Page 4 · Discovery forms

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/discovery-forms` |
| Title | Bilingual Brand Discovery Forms · Markyos |

### Hero

> Better questions. Clearer answers. A faster start.

*Tool: three · repetition.*

> A bilingual brand brief your client answers from a link, no account needed. The answers become work, not a spreadsheet to copy from.

> **[Button: Send your first brief free]**

### How it works

- 1 · Pick a template, adjust it.
- 2 · Send the link. Your client answers in their language.
- 3 · Request the analysis when it's done.

### What's inside

- Five templates: new brand, rebrand, sub-brand, naming, product launch.
- A bilingual question library, written by a strategist.
- Brand questions: personality scales, ranking, image picks, file upload.
- In your studio's branding, right-to-left automatically in Arabic.
- Call notes go into the analysis.

> Feeds the analysis and the strategy. **Free and unlimited on every plan.** On the free plan, the form carries the "Made with Markyos" badge.

**Brand Brain here**

> When the form is complete, it reads every answer and turns it into an analysis and strategy drafts. **[Link: Brand Brain]**

---

## Page 5 · AI brief analysis

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/brief-analysis` |
| Title | AI Brand Brief Analysis · Markyos |

### Hero

> What your client said. And what they didn't.

*Tool: antithesis.*

> A ten-part report that reads the answers like a senior strategist. The first analysis in every project is free.

> **[Button: Try your first analysis free]**

### How it works

- 1 · The brief is answered.
- 2 · You request the analysis. It arrives in minutes.
- 3 · You add what helps to the strategy.

### What's inside

- A snapshot, goals, audience, competitors, personality.
- Contradictions: "premium", then "cheapest".
- The missing questions, ranked.
- Two or three directions the brand could take.
- A share link you can revoke, and PDF export.

> Reads the form and writes drafts into the strategy. **The first analysis on every new project is free on every plan. Re-runs: 5 a month on Freelancer, 15 on Studio.**

**Brand Brain here**

> Brand Brain writes this report, and what it finds here it reads in everything it writes next: the strategy, the guideline copy, the voice.

---

## Page 6 · Strategy hub

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/strategy-hub` |
| Title | A Bilingual Brand Strategy Hub · Markyos |

### Hero

> Strategy you use. Not strategy you file.

*Tool: antithesis · repetition.*

> The brand's foundations in both languages, where the brand lives. They flow into the guide and the voice on their own.

> **[Button: Start free]**

### How it works

- 1 · Start from the analysis drafts, or a blank page.
- 2 · Write each part in both languages.
- 3 · It appears in the guide, and grounds the voice.

### What's inside

- Vision, mission, purpose and values.
- Positioning and competitors.
- Audience personas.
- Voice traits: "we are this, not that".
- The strategy assistant and brainstorm.

> The hub is on every plan. The strategy assistant is on paid plans: 40 messages a month on Freelancer, 150 on Studio, 50 per brand on Company.

**Brand Brain here**

> It turns the analysis into section drafts, thinks it through with you in the strategy assistant, and reads your strategy whenever it writes anything after it.

---

## Page 7 · Moodboards

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/moodboards` |
| Title | Moodboards for Brand Designers · Markyos |

[Status: coming soon, no date. Show the chip on the hero and swap the button for a "notify me" signup, or hold the page until moodboards ship.]

### Hero

> `[CHIP: Coming soon]`

> From reference to decision.

*Tool: antithesis · rhythm.*

> Collect references inside the project, and let Markyos pull the colours from your real images.

> **[Button: Tell me when it's ready]**

### How it works

- 1 · Drop images in, sort them into zones.
- 2 · Pull colours from the real pixels.
- 3 · Show your client the direction.

### What's inside

- Ready-made zones keep the board readable.
- Colours from your images, as a draft palette.
- References stay private, on no public page.
- Art direction from Brand Brain.

> Limits for each plan are announced when it ships.

**Brand Brain here**

> `[CHIP: Coming soon]` Art direction: it reads your board and your strategy, and suggests a visual direction.

---

## Page 8 · Asset library

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/asset-library` |
| Title | Brand Asset Library · Markyos |

### Hero

> Change it once. It's right every time.

*Tool: repetition (مرة / مرة) · antithesis.*

> Drop in the identity folder, and Markyos sorts the logos, fonts and colours on its own.

> **[Button: Start free]**

### How it works

- 1 · Drop in the folder or zip.
- 2 · Check one screen: "6 logos, 2 font families, 9 colours".
- 3 · Confirm, and they become approved assets.

### What's inside

- Slots for the Arabic logo, the Latin logo and the symbol.
- Fonts in families, with Arabic support detected.
- Colours with contrast checks.
- Unlicensed fonts display but don't download.
- `[CHIP: Coming soon]` Reading an old PDF guide, and turning it into a hub.

> The guide builds from it, everyone downloads from it. **Storage from 2 GB free.**

**Brand Brain here**

> It reads only the approved assets, so an old logo never ends up in a mockup or a text.

---

## Page 9 · Guideline site

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/guideline-sites` |
| Title | Bilingual Brand Guideline Sites · Markyos |

### Hero

> A guide people open. Not a file they forget.

*Tool: antithesis · repetition.*

> Pick one of 8 looks, and the guide builds from the project's files, in both languages, in minutes.

> **[Button: Build your first guide free]**

### How it works

- 1 · Pick a look.
- 2 · The site builds from the project.
- 3 · Check it on three screens, publish.

### What's inside

- 8 looks, and 16 sections that build themselves.
- One guide in two languages; the reader chooses.
- Change a colour, and every page changes.
- Publish on your link or domain, or behind a password.
- Section copy from Brand Brain.

> Two looks on the free plan, with the "Made with Markyos" badge. All eight, with no badge, on paid plans. Section copy from Brand Brain: 5 a month free, 30 on Freelancer, 100 on Studio.

**Brand Brain here**

> It writes the section copy in both languages from your strategy and your voice, and you review it before you publish.

---

## Page 10 · Studio board

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/studio-board` |
| Title | Brand Project Management · Studio Board · Markyos |

### Hero

> Every project. Every stage. One view.

*Tool: three · repetition · antithesis (كل / واحدة).*

> Each project has a path from discovery to handoff, and every project sits on one board, by stage.

> **[Button: Start your first project free]**

### What's inside

- Eight steps; skip what you don't need.
- Roles for your team: owner, editor, viewer.
- Clients as guests, no account, no limit.
- Dated sign-off on the core sections.
- Not a CRM, on purpose.

> Handoff frees the brand's slot. **1 active brand free · 3 on Freelancer · 10 on Studio, plus 5 more for $10.**

**Brand Brain here**

> Brand Brain's drafts for every project wait for your review in one queue, so no suggestion gets lost.

---

## Page 11 · Handoff and partner reward

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/handoff` (anchors `#how`, `#reward`) |
| Title | Brand Handoff · A Live Hub Instead of a PDF · Markyos |

### Hero

> Hand over a brand, not a folder.

*Tool: rhyme (حيّة / منسيّاً) · antithesis.*

> Your client gets a hub with their name on it, opened by their team every day. You keep your role, and earn as they grow.

> **[Button: Start your first project free]**

### How it works

`[anchor: #how]`

- 1 · Publish the hub, press "Hand off".
- 2 · Your client claims it in their company workspace.
- 3 · You keep your role, and the slot frees up.

### Partner reward

`[anchor: #reward]`

> You handed it over. The return keeps coming.

*Tool: antithesis.*

> 20% of what your client pays in their first year, as billing credit. Handoff is always free, and the hub stays live on the client's free plan.

- Four clients on Company = $15.20 a month, more than your Freelancer plan.
- Eight clients = $30.40 a month, your whole Studio plan.

[CONFIRM: while billing runs on PayPal, rewards are recorded from the client's first payment and applied as billing credit once billing moves to Stripe. The prepaid client year is paused on PayPal and not offered at launch.]

**Brand Brain here**

> When your client takes the hub, they take everything Brand Brain reads with it: the strategy, the voice, the terms. Their team starts where you left off.

---

## Page 12 · Brand voice and term base

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/brand-voice` |
| Title | Brand Voice and Term Base, in Two Languages · Markyos |

### Hero

> Two languages. One voice.

*Tool: antithesis.*

> Write down how your brand speaks once, and Arabic and English say the same thing everywhere.

> **[Button: Set up your brand voice free]**

### How it works

- 1 · Write the traits, add examples.
- 2 · Set the register for each channel.
- 3 · Build your term base, or import it.

### What's inside

- Traits with opposites: "warm, not stiff".
- Examples that sound like you, and some that don't.
- Standard Arabic or dialect per channel, British or American English. [CONFIRM: plan gating]
- Term base: preferred, banned, never translated, approved translation. CSV import.
- `[CHIP: Coming soon]` Department playbooks: a voice for each team, from the same voice.

> Powers the tone checker. **On the company plans, free and paid.** [CONFIRM: voice per channel on the Company plan]

**Brand Brain here**

> This voice is what Brand Brain writes in, in every feature, and what it measures every text against.

---

## Page 13 · Tone checker

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/tone-checker` |
| Title | Bilingual Brand Tone Checker · Markyos |

[Note: for companies only. Runs only on Markyos's own AI. No AI Connector mention on this page, and no link to it from the studio or freelancer pages.]

### Hero

> Your brand, word for word.

*Tool: double meaning (حرفاً بحرف: exact, and the letters themselves).*

> Paste any text, and know in seconds if it sounds like your brand, and why.

> **[Button: Try your first check free]**

### How it works

- 1 · Paste the text, pick the channel.
- 2 · Get the score and the reason for each note.
- 3 · Rewrite it, or translate it, in your voice.

### What's inside

- A score out of 100: on brand, close, or off.
- A score for each voice trait, with the reason.
- Banned words, wrong terms, and Arabic register.
- Your text isn't kept, unless you save it for 30 days.
- `[CHIP: Coming soon]` A Chrome extension.

> For companies. **25 quick checks a month free · 1,000 per brand on Company.** Deep checks, rewrites and translations: 5 free, 80 per brand on Company.

**Brand Brain here**

> Every score comes from your voice traits and your terms, not general rules. Every note shows its reason.

---

## Page 14 · Leadership alignment

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/leadership-alignment` |
| Title | Leadership Questionnaire and Brand Alignment Report · Markyos |

### Hero

> Many views. One brand.

*Tool: antithesis.*

> The same questions for every leader, and a report that shows where they agree, where they don't, and what nobody knows.

> **[Button: Start the leadership questionnaire free]**

### How it works

- 1 · Choose the questions.
- 2 · Send each leader their own link.
- 3 · Request the alignment report.

### What's inside

- Where leaders agree.
- Where they don't: "premium" from the CEO, "affordable" from sales.
- What nobody could answer.
- Possible directions, as strategy drafts.

> **The first report per brand is free. Re-runs: 3 a month on Company.**

**Brand Brain here**

> It compares your leaders' answers, writes the alignment report, and turns the possible directions into strategy drafts.

---

## Page 15 · Viewers and sharing

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/team-and-sharing` |
| Title | Bring Your Whole Company Into the Brand Hub · Markyos |

### Hero

> A few change it. Everyone uses it.

*Tool: antithesis (قليلون / الجميع).*

> On the Company plan, editors and viewers are unlimited. The whole company comes in, and you pay per brand, not per person.

> **[Button: Set up your brand free]**

### What's inside

- Viewers browse, download and check their writing.
- Partner links that expire when you choose.
- Invite your studio, without it counting as an editor.
- Ask the Brand: your team asks the hub, not you.
- `[CHIP: Coming soon]` Reviews and approvals.

> Bring everyone in. Pay for the brand.

*Tool: antithesis · benefit first.*

> **[Button: Set up your brand free]**

**Brand Brain here**

> In Ask the Brand, it answers your team from the hub, and names the page the answer came from.

---

## Page 16 · Mockup builder

| Field | Value |
| :--- | :--- |
| URL | `/en/platform/mockups` |
| Title | Brand Identity Mockup Builder · Markyos |

[CONFIRM: the Arabic feature name («صانع الموك اب» or «صانع النماذج») and the template list. Limits come from pricing v5.1. Ready end of December 2026, live at launch.]

### Hero

> See it before you print it.

*Tool: antithesis (see / print) · benefit first.*

> Pick a template, and Markyos puts your identity on it: logo, colours and type, in Arabic and English.

> **[Button: Try your first mockup free]**

*Why it works:* Every client wants to see the identity in the world before they approve it. The headline names that moment; the sub shows it takes one choice.

### How it works

- 1 · Pick a template from the gallery.
- 2 · It fills itself from the approved brand assets.
- 3 · Download it, or show it to your client.

### What's inside

- A template gallery: business cards, signage, posts, stationery. [CONFIRM]
- Reads from the asset library, so you never copy a file by hand.
- The Arabic and Latin logos, each in its place.
- Colours and type exactly as approved.

> The AI makes the scene, and Markyos puts your real identity on it. It never draws a logo. **3 a month free, 15 on Freelancer, 40 on Studio, 30 per brand on Company.**

**Brand Brain here**

> Brand Brain's image agent makes the scene, and Markyos puts your approved assets on it.

---

## Review · Part C

| Question | Answer |
| :--- | :--- |
| One rhymed line per section at most? | Yes. Built in Arabic and Handoff heroes |
| Hype, banned words, dashes? | None |
| Every feature live or chipped? | Yes. Unreleased items say "coming soon" with no date; features that won't be built are gone; register gating flagged |
| Slogan rule | Not used. Platform carries the product description |
| Shortest it can be? | Feature pages: about 120 words a language, down from about 260. "What it is" paragraphs folded into the sub |

---

# Part D · Pricing and Company

Pages: Pricing · Roadmap · What's new · Security · About · Contact.

[CONFIRM: all prices are hypotheses until the beta pricing test closes on 1 February 2027. Plan names must match checkout.]

---

## Page 1 · Pricing

| Field | Value |
| :--- | :--- |
| URL | `/en/pricing` (toggle `?for=studios` / `?for=companies`, anchors `#trial`, `#compare`, `#limits`, `#add-ons`, `#reward`, `#billing`, `#faq`) |
| Title | Pricing and Plans · Markyos |
| Meta | Try any plan free for 14 days, no card needed. Freelancer $12, Studio $29, Company $19 per brand, and a free plan, always. |

[Note: every number on this page comes from pricing v5.1 in Notion (Plan Limits & Entitlements v5.1). Prices are hypotheses until the beta pricing test closes on 1 February 2027; lock them after that. Plan names must match checkout.]

**What was wrong with the old page, and what this one fixes**

| Old | Now |
| :--- | :--- |
| "Each plan covers one brand", then a card that says "Brands: 3" | Freelancer and Studio have one fixed price and a number of active brands. Only Company is priced per brand, and it says so |
| "$19 per brand" for a freelancer with three brands could mean $19 or $57 | $12 a month, up to 3 active brands. No maths |
| Studio with unlimited brands and editors cost less than a freelancer with three | Studio has clear limits (10 active brands, 5 members) and add-ons when it needs more |
| Company at $99 for one brand, with "share the guide with your client" | Company at $19 per brand, with what a company buys: the tone checker, Ask the Brand, unlimited editors and viewers |
| "Most popular" before launch | No badge that claims customers we don't have. Studio is marked "For teams" |
| One shared credit pool | Each AI tool has its own monthly limit. If one runs out, only that tool stops |

**Order of the page:** hero · trial · launch offer · toggles · three plan cards · the free plan · which plan is mine · compare every limit · how AI limits work · add-ons · the free badge · how handoff pays · enterprise · billing · questions · last call. This is the one page where detail is the point: people come here to decide.

### Hero

> Start free. Pay as you grow.

*Tool: antithesis · rhythm.*

> Freelancers and studios pay for the size of their work. Companies pay per brand, not per person.

*Why it works:* The headline answers the first two pricing questions (can I try it, what happens later). The sub explains both models in one sentence, so nobody has to guess what "per brand" means.

### 14 day trial

`[anchor: #trial]`

> Try any paid plan for 14 days. No card needed.

*Tool: benefit first.*

- Your new workspace starts on the plan that fits you: Freelancer, Studio or Company.
- We remind you on day 10 and day 13.
- If you don't subscribe, you move to the free plan on day 15. Nothing you built is deleted.
- No "Made with Markyos" badge during the trial.

[Note: one trial per account and per workspace. The trial has its own smaller AI limits (see "How AI limits work"). Monthly limits start fresh when you subscribe.]

### Launch offer

> Launch offer: 30% off your first three months on any paid monthly plan.

| Plan | Usual price | Launch price, first 3 months |
| :--- | :-: | :-: |
| Freelancer | $12 | $8.40 |
| Studio | $29 | $20.30 |
| Company (per brand) | $19 | $13.30 |

> The discount applies automatically when you subscribe monthly before [PLACEHOLDER: date]. After three months the plan returns to its usual price, and you can cancel before then.

[CONFIRM: end date · one use per workspace · monthly plans only, not yearly · not on add-ons or packs · set up in PayPal as a 3 month discounted trial period, tested in sandbox. Notion's social post «عرض أول 100 عضو مؤسس» still says 50%: update it to 30% before it's published.]

### Toggles

| Toggle | Text |
| :--- | :--- |
| Audience | For people who make brands · For people who run their company's brand |
| Billing | Monthly · Yearly (2 months free) |

[DESIGN: the audience toggle filters the comparison and the free plan. All three paid cards stay visible on both tabs, so nobody wonders where a plan went.]

### Plan cards

Each card: name, who it's for, price, yearly price, launch price, button, and every limit. No card hides a limit behind "and more".

#### Freelancer

> You work alone, with a few clients.

|  | Text |
| :--- | :--- |
| Price | $12 a month |
| Yearly | $120 a year ($10 a month) |
| Launch | $8.40 a month for the first three months |
| Button | **[Button: Try free for 14 days]** |
| Under the button | No card needed |

- **3 active brands**, and 3 new projects every 30 days
- 1 seat and 20 GB of storage
- No badge, with a password for the hub
- Handoff, ownership transfer and the partner reward
- **Brand Brain each month:** the first analysis on every new project free, 5 analysis re-runs, 30 guideline section copies, 40 strategy assistant messages, 15 mockups
- AI Connector

#### Studio

**Badge:** For teams

> A studio with a team, and many clients.

|  | Text |
| :--- | :--- |
| Price | $29 a month |
| Yearly | $290 a year (about $24 a month) |
| Launch | $20.30 a month for the first three months |
| Button | **[Button: Try free for 14 days]** |
| Under the button | No card needed |

- **10 active brands**, and 10 new projects every 30 days
- **5 team members** and 100 GB of storage
- No badge, a password, and a custom domain before handoff
- Handoff, ownership transfer and the partner reward
- **Brand Brain each month:** the first analysis on every new project free, 15 analysis re-runs, 100 guideline section copies, 150 strategy assistant messages, 40 mockups
- AI Connector

> Brands you hand off don't count. The slot frees up the moment your client takes the hub.

#### Company

> Your whole company on one brand.

|  | Text |
| :--- | :--- |
| Price | $19 a month per brand |
| Yearly | $190 a year per brand (about $16 a month) |
| Launch | $13.30 a month for the first three months |
| Button | **[Button: Try free for 14 days]** |
| Under the button | No card needed |

- **Unlimited editors and viewers**
- 1 brand; each extra brand is $19
- 25 GB of storage per brand, and 1 studio collaborator
- No badge, a password and a custom domain, and partner links with an expiry and a password
- **Brand Brain each month, per brand:** 1,000 quick tone checks, 500 Ask the Brand questions, 80 deep checks, rewrites or translations, 50 strategy assistant messages, 30 mockups, and the first alignment report free plus 3 re-runs
- Viewers check their own writing, and the AI Connector

> Pay for the brand, not the people. So bring the whole company in.

*Tool: antithesis · benefit first.*

[CONFIRM: Ask the Brand ships in the beta, as Notion's roadmap says. If it slips, remove it from this card and the comparison, and add the chip.]

### The free plan

> Free, always.

| For people who make brands | For people who run their company's brand |
| :--- | :--- |
| 1 active brand, 3 new projects every 30 days | 1 brand, 2 editors, 25 viewers |
| 1 seat, 2 GB | 1 studio collaborator, 2 GB |
| First analysis on every new project, 5 section copies and 3 mockups a month | First alignment report, 25 tone checks, 20 Ask the Brand questions, 5 writing tasks and 3 mockups a month |
| Handoff and the partner reward | View-only partner links |
| "Made with Markyos" badge on what you publish | "Made with Markyos" badge on what you publish |

> **[Button: Start free]**

### Which plan is mine?

> Which plan is yours?

*Tool: benefit first. Answers the "which one?" worry in one glance.*

- **A designer trying Markyos with one client:** Free.
- **A freelancer working alone with a few clients:** Freelancer.
- **A studio with a team, or more than 3 clients at once:** Studio.
- **A company running its own brand, whatever the size of its team:** Company.
- **A company with several brands:** Company, with each extra brand at $19.

> **[Link: Compare every limit]** `#compare`

### Compare every limit

`[anchor: #compare]`

> Every limit, plan by plan.

*Tool: repetition · rhythm.*

`[DESIGN: plan names and buttons stay sticky at the top while the visitor scrolls. Each group opens and closes; the first two start open. A tick means included, a number means the monthly limit, a blank cell means not included, and «قريباً» / "Coming soon" marks a feature that isn't live yet. Hovering a feature name shows its one-line description from the Platform hub.]`

#### For people who make brands

| Feature | Free | Freelancer · $12 | Studio · $29 |
| :--- | :-: | :-: | :-: |
| **Work** |  |  |  |
| Active brands | 1 | 3 | 10 |
| New projects every 30 days | 3 | 3 | 10 |
| Seats | 1 | 1 | 5 |
| Storage | 2 GB | 20 GB | 100 GB |
| Client guests | ∞ | ∞ | ∞ |
| **Discover and build** |  |  |  |
| Discovery forms and answers | ∞ | ∞ | ∞ |
| Bilingual strategy hub | ✓ | ✓ | ✓ |
| Asset library and file intake | ✓ | ✓ | ✓ |
| Guideline site looks | 2 | 8 | 8 |
| Studio board and project path | ✓ | ✓ | ✓ |
| Moodboards (coming soon) |  |  |  |
| **Publish and hand off** |  |  |  |
| "Made with Markyos" badge | ✓ |  |  |
| Hub password |  | ✓ | ✓ |
| Custom domain before handoff |  |  | ✓ |
| Handoff and ownership transfer | ✓ | ✓ | ✓ |
| Partner reward | 20% | 20% | 20% |
| **Brand Brain, each month** |  |  |  |
| First analysis on every new project | ✓ | ✓ | ✓ |
| Analysis re-runs |  | 5 | 15 |
| Guideline section copy | 5 | 30 | 100 |
| Strategy assistant messages |  | 40 | 150 |
| Mockups | 3 | 15 | 40 |
| AI Connector |  | ✓ | ✓ |
| **Add-ons** |  |  |  |
| Extra seat |  |  | $8 a month |
| 5 more active brands |  |  | $10 a month |
| Brand Brain pack |  | $12 | $12 |
| Mockup pack |  | $9 | $9 |

#### For people who run their company's brand

| Feature | Free | Company · $19 per brand |
| :--- | :-: | :-: |
| **Work** |  |  |
| Brands | 1 | 1, each extra $19 |
| Editors | 2 | ∞ |
| Viewers | 25 | ∞ |
| Studio collaborator | 1 | 1 |
| Storage | 2 GB | 25 GB per brand |
| **Build** |  |  |
| Asset library and file intake | ✓ | ✓ |
| Bilingual strategy hub | ✓ | ✓ |
| Brand voice and term base | ✓ | ✓ |
| Leadership questionnaire | ✓ | ✓ |
| Guideline site looks | 2 | 8 |
| Department playbooks (coming soon) |  |  |
| **Publish and share** |  |  |
| "Made with Markyos" badge | ✓ |  |
| Password and custom domain |  | ✓ |
| Partner links | View only | Expiry and password |
| Invite a studio, not counted as an editor | ✓ | ✓ |
| **Brand Brain, each month, per brand** |  |  |
| First alignment report | ✓ | ✓ |
| Alignment report re-runs |  | 3 |
| Quick tone checks | 25 | 1,000 |
| Ask the Brand | 20 | 500 |
| Deep check, rewrite, translate in your voice | 5 | 80 |
| Strategy assistant messages |  | 50 |
| Mockups | 3 | 30 |
| Viewers check their own writing |  | ✓ |
| AI Connector |  | ✓ |
| **Add-ons** |  |  |
| Extra brand |  | $19 a month |
| Brand Brain pack |  | $12 |
| Mockup pack |  | $9 |

**Coming soon, on plans to be announced** (a strip under the tables)

> Coming soon: moodboards, art direction from Brand Brain, department playbooks, a Chrome extension, and turning an old PDF guide into a hub.

[Note: the tone checker and Ask the Brand appear only in the companies table, as Notion's Website tracker asks. Don't list them as "not included" on the studio side.]

[CONFIRM: guideline looks (2 on Free, 8 on paid plans) carry over from v4; pricing v5.1 doesn't list them. Voice per channel is not listed until it's decided.]

### How AI limits work

`[anchor: #limits]`

> Every tool has its own limit. No surprise bills.

*Tool: antithesis · benefit first.*

- Every AI tool has its own monthly limit. If one runs out, only that tool stops; the rest keep working.
- The basics are free on every plan: the first analysis on every new project, and the first alignment report for every brand.
- Limits renew every month. What you don't use doesn't roll over.
- On the Company plan, limits belong to the whole brand, and each viewer has a small daily limit so no one person uses them up.
- Reading your brand from ChatGPT or Claude through the AI Connector doesn't count against any limit.
- If you need more, add a pack. Nothing is charged unless you ask for it.

[CONFIRM: the viewer daily limit number.]

**During the 14 day trial** (smaller limits)

| Trial limit | Freelancer | Studio | Company |
| :--- | :-: | :-: | :-: |
| First analyses and re-runs | 3 + 2 | 5 + 3 |  |
| Alignment report re-runs |  |  | 1 |
| Section copy or writing tasks | 15 | 25 | 20 |
| Strategy assistant messages | 15 | 40 | 15 |
| Mockups | 5 | 10 | 8 |
| Quick tone checks |  |  | 250 |
| Ask the Brand |  |  | 125 |

### When you need more

`[anchor: #add-ons]`

> When you need more.

| Add-on | Price | For | Text |
| :--- | :-: | :--- | :--- |
| Extra seat | $8 a month | Studio | A sixth member, a seventh, as many as you need. |
| 5 more active brands | $10 a month | Studio | For when more clients run at the same time. |
| Extra brand | $19 a month | Company | For every other brand the company runs. |
| Brand Brain pack | $12 once | Every paid plan | 100 writing tasks and 60 strategy assistant messages. |
| Mockup pack | $9 once | Every paid plan | 60 mockups. |

> Packs last 12 months, and are used after your monthly limit runs out.

[Note: the Project Pass ($19) is gone. With Freelancer at $12 for three brands, it has no job left.]

### The free badge

> Free, with our small signature.

*Tool: antithesis · benefit first.*

> Everything you publish on the free plan, from the form to the guide and the hub, carries a small "Made with Markyos" badge. Anyone who clicks it lands on "Start your own". The badge disappears on every paid plan, and during the trial.

[CONFIRM: the badge's destination URL; whether a client hub handed off on the free plan shows it (assumed yes, until the client subscribes).]

### How handoff pays

`[anchor: #reward]`

> The studio builds. The client owns. The return keeps coming.

*Tool: three · repetition.*

> Handoff is always free, and the hub stays live on your client's free plan. When they subscribe to Company, you get 20% of what they pay in their first year, as billing credit.

| Clients on Company | Billing credit a month | Covers |
| :-: | :-: | :--- |
| 1 | $3.80 |  |
| 4 | $15.20 | Your whole Freelancer plan |
| 8 | $30.40 | Your whole Studio plan |

[CONFIRM: while billing runs on PayPal, rewards are recorded from the client's first payment and applied as billing credit once billing moves to Stripe. Say so on the handoff page and in the terms before launch.]

### Enterprise

> `[CHIP: Coming soon]` Many brands, teams in several countries, single sign-on? The Enterprise plan is coming. Register your interest and we'll reach you first.

> **[Button: Register your interest]** `/en/contact?topic=sales`

### Billing

`[anchor: #billing]`

> Clear billing. Clearer cancelling.

*Tool: repetition · antithesis.*

- **Currency:** US dollars, before tax. [CONFIRM: VAT]
- **Payment:** through PayPal, with your PayPal account or your card.
- **More ways to pay:** coming soon, including Mada cards. When they arrive, we'll tell you first, and your plan and price stay the same.
- **Yearly:** pay for the year upfront and get two months free.
- **Upgrades:** your new limits open right away; the new price starts on your next billing date.
- **Downgrades and cancelling:** any time, from the end of the period. Nothing is deleted; anything over the limit becomes read-only.
- **Beta pricing:** locked for 12 months after launch for everyone who joined the beta.
- **Refunds:** [PLACEHOLDER: refund policy]

### Questions

`[anchor: #faq]`

> Questions. Short answers.

*Tool: rhythm.*

**Plans**

- **What's an active brand?** One you're still working on. Hand it off or archive it, and it stops counting.
- **Editor or viewer?** Editors change the brand. Viewers browse it, download its files and check their writing. On the Company plan, both are unlimited.
- **Why isn't the tone checker on Freelancer or Studio?** Because it's for the people who write as the brand every day: the company's team. When you hand off the hub, your client finds it on their plan.
- **A studio and a company workspace together?** Yes, on one account.
- **Do I need a studio?** No. A company can start on its own.

**Trial**

- **Do I need a card to try it?** No. You only pay when you subscribe.
- **What happens after 14 days?** If you subscribe, you carry on. If not, you move to the free plan, and nothing is deleted.
- **Does the launch offer work with the trial?** Yes. Try it for 14 days, then subscribe monthly before the offer ends, and pay 30% less for your first three months.

**Billing**

- **How do I pay?** Through PayPal, with your PayPal account or your card, in US dollars.
- **And Mada cards?** Coming soon, with more ways to pay. We'll tell you first.
- **Does the launch offer cover yearly billing?** No. The offer is for monthly plans; yearly already gives you two months free.
- **What if my client never pays?** The hub stays live and editable on the free plan, with the badge.

**AI**

- **Does the AI design logos?** Never. It reads and drafts words, and in the mockup builder it puts your own identity on the templates.
- **What if a tool's limit runs out?** That tool stops until next month, or until you add a pack. The rest keep working.
- **Can I connect ChatGPT or Claude?** Yes, on every paid plan. It only reads, and doesn't count against your limits.

**Your data**

- **Is my content safe?** Nothing goes public until you publish it. **[Link: Security]**
- **Is the dashboard in Arabic?** Yes. You pick your interface language; the brand has its own.

### Last call

> **[Button: I design brands for clients]** · **[Button: I run my company's brand]**

> Try it free for 14 days. No card needed.

---

## Page 2 · Roadmap

| Field | Value |
| :--- | :--- |
| URL | `/en/roadmap` |
| Title | Roadmap · Markyos |

### Hero

> What's built. What's next.

*Tool: antithesis · repetition.*

> What we're building has no dates here, because we'd rather be honest than promise.

### Two columns

| Column | Text |
| :--- | :--- |
| Live at launch, February 2027 | Forms and AI analysis · strategy and the strategy assistant · asset library · guideline sites and section copy · mockup builder · handoff · studio board · voice and tone checker · leadership alignment · Ask the Brand · AI Connector · viewers and partner links |
| Coming soon | Moodboards · art direction · department playbooks · Chrome extension · converting an old PDF guide · brand health · download tracking · reviews and approvals · design checks · the Enterprise plan |

[CONFIRM: the AI features (Ask the Brand, AI Connector, strategy assistant, section copy) are expected in the beta. If any slips, move it to Coming soon and put its chip back on every page.]

### What we won't build

> What we won't build, on purpose: a CRM, a design tool, AI-drawn logos.

*Tool: three.*

> **[Link: Suggest a feature]** `/en/contact?topic=feature`

---

## Page 3 · What's new

| Field | Value |
| :--- | :--- |
| URL | `/en/whats-new` (entries `/en/whats-new/[slug]`) |
| Title | What's New in Markyos |

> What's new.

*Tool: rhythm.*

> Every update in a line: what changed, and why it matters.

**Filters:** All · Studios · Companies · Improvements

**Entries:** written in `markyos_resources_ar_4_whats_new.md` and `markyos_resources_en_4_whats_new.md`. Each publishes the day its feature ships, not before.

---

## Page 4 · Security

| Field | Value |
| :--- | :--- |
| URL | `/en/security` |
| Title | Security and Privacy · Markyos |

[CONFIRM: every line checked with the technical partner, claiming only what the server enforces on launch day.]

### Hero

> Your brand is yours. So are your words.

*Tool: repetition · rhythm.*

> How we protect your files and your words, and what we never do with them.

### Three promises

- **Nothing is public until you publish.** Links you can revoke, and a password for the hub.
- **Permissions on the server.** Viewers can't change anything; a studio sees only what it was invited to.
- **Your words aren't kept.** The tone checker keeps no text unless you choose; the AI runs only when you ask, and never publishes or deletes.

### The details

- Files are stored on Railway, apart from the database, with a managed Postgres database. [CONFIRM: region]
- Inspiration images are always private.
- Form answers are read as text, not instructions.
- Payments go through our payment provider; we never see your card number. Passwords are hashed.
- The AI runs on the OpenAI API, and nothing is sent to it unless you ask. [CONFIRM: OpenAI's API data terms before any line about training]
- Connected AI tools only read, in the brands you choose, and the owner decides who connects. What they read goes to their provider, under your terms with them.

> To report a vulnerability: [PLACEHOLDER: security@markyos.com]

---

## Page 5 · About

| Field | Value |
| :--- | :--- |
| URL | `/en/about` |
| Title | About · Markyos |

### Hero

> Built from inside the problem.

*Tool: rhythm · benefit first.*

### The story

[CONFIRM: Abdullah to rewrite in his own voice. First person, short.]

> I've designed brands and built their strategies since 2019. Every time, the brand went out as a file, then drifted within a year. Arabic was always the weakest part, because every tool was built for English first. So I built the place I'd wanted on every project.

> Abdullah Saeedan, Founder and CEO

### What we believe

> Five beliefs. One brand.

*Tool: antithesis.*

- A brand is a place, not a file.
- Arabic is a first language, not a translation.
- The AI suggests. People decide.
- When the client wins, the studio wins.
- We say what we've built, and what we won't.

### The team

- **Abdullah Saeedan** · Founder and CEO. [CONFIRM: photo]
- **[PLACEHOLDER: name]** · Partner, engineering and platform.

> Leave your mark. Make it last. **[Button: Start free]**

*Tool: double meaning (بصمة / mark).*

---

## Page 6 · Contact

| Field | Value |
| :--- | :--- |
| URL | `/en/contact` (`?topic=sales | support | studios | press | security | feature`) |
| Title | Contact · Markyos |

> Talk to us.

*Tool: rhythm.*

> A small team that reads every message.

| Topic | Text | Email |
| :--- | :--- | :--- |
| Sales and Enterprise | We reply within [X] working days. | [PLACEHOLDER: sales@] |
| Support | Try the help centre first. | [PLACEHOLDER: support@] |
| Studio partnerships | For studios that want to work closely with us. | [PLACEHOLDER: studios@] |
| Press | For journalists and media. | [PLACEHOLDER: press@] |
| Suggest a feature | We read every one. |  |

**Form**

| Field | Text |
| :--- | :--- |
| Name | Name |
| Email | Work email |
| You are | Studio · Freelancer · Company · Other |
| Message | How can we help? |
| Button | **Send** |
| Success | Got it. We'll reply within [X] working days. |
| Error | It didn't send. Check the fields and try again. |

---

## Review · Part D

| Question | Answer |
| :--- | :--- |
| One rhymed line per section at most? | Yes. No rhymes in this part |
| Hype, banned words, dashes? | None |
| Every feature live or chipped? | Yes. Enterprise and unreleased rows say "coming soon", no dates |
| Pricing rebuilt | Pricing v5.1 from Notion: three paid cards with every limit on every card, a free plan for each side, a 14 day trial with no card, 30% launch offer, yearly with two months free, per-tool AI limits, add-ons, the partner reward, PayPal billing, FAQ grouped by topic |
| Terms kept apart | "AI limits" for Brand Brain and "billing credit" for the partner reward, in both languages. The word "credits" is gone |

---

# Part E · Resources and System Pages

Pages: Resources · Blog · Guides · Help centre · Compare · Start · 404 · Legal summaries. Hubs are short: a headline, a filter, and cards that come from the CMS. The articles themselves live in the resources files (`markyos_resources_ar_1` to `_4`, and `_en_1` to `_4`).

---

## Page 1 · Resources

| Field | Value |
| :--- | :--- |
| URL | `/en/resources` |
| Title | Resources · Markyos |

> How brands are built. And how they last.

*Tool: repetition · antithesis.*

> Articles, guides and free templates. In Arabic and English.

| Section | Text | Link |
| :--- | :--- | :--- |
| Blog | Ideas on strategy, identity and voice. | `/en/blog` |
| Guides | Take it today. Use it tomorrow. | `/en/guides` |
| Help centre | Every step in Markyos, explained. | `/en/help` |
| Compare | Markyos next to what you use today, honestly. | `/en/compare` |
| What's new | What we added, and why. | `/en/whats-new` |

**Newsletter**

> One email a month. One idea worth it.

| Field | Text |
| :--- | :--- |
| Input | Your email |
| Button | **Subscribe** |
| Under | No noise. Unsubscribe any time. |

[CONFIRM: cadence and the newsletter tool for Markyos.]

---

## Page 2 · Blog

| Field | Value |
| :--- | :--- |
| URL | `/en/blog` (posts `/en/blog/[slug]`) |
| Title | Blog · Markyos |

> What building brands taught us.

*Tool: benefit first.*

**Categories:** Strategy · Identity · Bilingual brands · Voice · Running a studio

**Launch posts (10)**, titles as written in the resources files:

| # | Slug | Category |
| :-: | :--- | :--- |
| 1 | `brand-strategy` | Strategy |
| 2 | `visual-identity-components` | Identity |
| 3 | `arabic-latin-font-pairing` | Bilingual brands |
| 4 | `bilingual-brand-naming` | Bilingual brands |
| 5 | `rebrand-or-refresh` | Strategy |
| 6 | `pricing-brand-identity-projects` | Running a studio |
| 7 | `rtl-design-mistakes` | Bilingual brands |
| 8 | `measure-brand-consistency` | Voice |
| 9 | `ai-and-brand-voice` | Voice |
| 10 | `brand-architecture` | Strategy |

**Card:** category · title · the first sentence of the article's answer paragraph · reading time.

---

## Page 3 · Guides and templates

| Field | Value |
| :--- | :--- |
| URL | `/en/guides` (each `/en/guides/[slug]`) |
| Title | Free Brand Guides and Templates · Markyos |

> Take it free. Use it tomorrow.

*Tool: rhythm · repetition.*

**Filters:** All · For studios · For companies

**Launch guides (10)**, from the resources files. Known slugs: `brand-strategy-one-page` · `brand-guidelines-template` · `brand-audit-checklist` · `brand-presentation` · `brand-project-scope` · `ai-usage-policy` · `internal-brand-launch`. [CONFIRM: the remaining three slugs]

**Card:** title · "after this guide, you'll…" in one line · who it's for · what you download.

---

## Page 4 · Help centre

| Field | Value |
| :--- | :--- |
| URL | `/en/help` (articles `/en/help/[category]/[slug]`) |
| Title | Help Centre · Markyos |

> How can we help?

*Tool: rhythm. Plain on purpose: someone here has a problem.*

> Search: "hand off a hub", "add an editor", "AI limits"…

| Category | Text |
| :--- | :--- |
| Getting started | Start here. |
| Forms and analysis | From question to draft. |
| Assets and guidelines | Your files, and their site. |
| Handoff | From your hands to your client's. |
| Voice and tone | How your brand writes. |
| Team and sharing | Who edits, who sees. |
| Account and billing | Your plan, your limits. |
| Security and privacy | What we keep, and what we don't. |
| Connected AI tools | Your brand, in your AI tool. |

[Note: article rule.] The title is the task as a verb («كيف تسلّم المركز لعميلك» / "How to hand off a hub to your client"), then numbered steps, one action each, with a screenshot in the page language.

> Didn't find it? **[Link: Write to support]**

---

## Page 5 · Compare

| Field | Value |
| :--- | :--- |
| URL | `/en/compare` |
| Title | Markyos Compared · Markyos |

> Honest comparisons.

*Tool: rhythm.*

> What we do better, what your tools do better, and when you don't need us at all.

| Group | Slug |
| :--- | :--- |
| Instead of a file | `pdf-guidelines` · `notion-brand-guidelines` |
| Instead of several tools | `tool-stack` · `brand-brief-forms` · `milanote` |
| Brand platforms | `guidelines-site` · `endform` · `frontify` · `brand-management-platforms` |
| Alongside Markyos | `canva-brand-kit` |

> Names are trademarks of their owners, used for description only, with no affiliation or endorsement.

[CONFIRM: the pages publish after launch, every fact rechecked the week each goes live, one legal read before the first named page.]

---

## Page 6 · Start (sign-up)

| Field | Value |
| :--- | :--- |
| URL | `/en/start` (`?type=studio` or `?type=company` preselects; both stay visible) |

### Screen 1

> Welcome to Markyos. What do you do with brands?

|  | Text |
| :--- | :--- |
| Card 1 | **I design brands for clients.** A studio, agency or freelancer. |
| Card 2 | **I run my company's brand.** A marketing lead, brand manager or founder. |
| Hint | Not sure? If it's your own company's brand, pick "I run my company's brand". |

### Screen 2

| Field | Text |
| :--- | :--- |
| Heading, studio | Let's start your first project. |
| Heading, company | Let's build your brand hub. |
| Name | Your name |
| Email | Work email |
| Password | At least 8 characters [CONFIRM] |
| Workspace | Studio name / Company name |
| Button | **Create my account** |
| Under | 14 days free on the plan that fits you, no card needed. By creating an account you agree to the **[Terms]** and **[Privacy Policy]**. |

### Screen 3

| Studio | Company |
| :--- | :--- |
| **Send a form to a client.** | **I have brand files.** |
| **Build a guide from finished files.** | **I only have a logo and colours.** |
| **Look around a demo project.** | **A studio works with me.** |

[Note: the full onboarding flow (wizard, checklist, emails) is a separate spec.]

### Errors

| Case | Text |
| :--- | :--- |
| Email taken | This email already has an account. **[Log in]** |
| Short password | That password is too short. Use at least 8 characters. |
| Invalid email | Check the email. It looks like there's a typo. |
| Free workspace exists | You already have a free workspace of this type. Pick a paid plan for a second one. |

---

## Page 7 · 404

> This page isn't here. Your brand is.

*Tool: antithesis.*

> **[Button: Go home]** · **[Link: Pricing]** · **[Link: Help centre]**

**A published hub that's gone**

> This hub isn't available. It may have been unpublished, or the link expired. Ask whoever sent it to you.

---

## Pages 8 to 10 · Privacy, Terms and Cookies

**Frames only. A lawyer writes and reviews the full text before launch.** The section lists for the lawyer are in `markyos_pages_ar_4_signup_legal.md`. The style doesn't apply here: plain, short, literal.

### Privacy · summary box

- We collect only what we need to run your account and your brand.
- Your files and brand content are yours. We don't sell them or use them for ads.
- Text you check in the tone checker isn't kept, unless you save it for 30 days.
- Nothing goes to our AI provider (OpenAI) unless you ask for it.
- You can export your data or delete your account at any time.
- When you connect an AI tool to your hub, what it reads goes to that tool's provider, under your own account and terms with them.

### Terms · summary box

- Your brand and files are yours. We host them so you can work on them.
- When a studio hands off a hub, ownership moves to the client.
- What the AI writes is a suggestion. The decision and responsibility are yours.
- Upload only what you have the right to use, especially fonts and images.
- Subscriptions renew automatically; cancel any time. Payments run through PayPal today. When we add more ways to pay, we'll tell you first, and your plan and price stay the same.
- The trial lasts 14 days with no card. After it, you move to the free plan if you don't subscribe, and nothing is deleted.
- An upgrade opens your new plan's limits right away; its price starts on your next billing date.
- AI tools you connect read only what you can see, and change nothing.

[CONFIRM: the lawyer reviews the AI Connector lines in both boxes.]

### Cookies · banner

> We use essential cookies to run the site, and optional ones to understand how you use it. **[Accept]** **[Essential only]** **[Settings]**

---

## Review · Part E

| Question | Answer |
| :--- | :--- |
| Rhymes, hype, dashes? | None |
| Every feature live or chipped? | Yes |
| Shortest it can be? | Hubs are headline, filter and cards. Article lists come from the CMS |

---

## Open items

| # | Item |
| :-: | :--- |
| 1 |  |
| 2 | 14 day trial: build the reminders (day 10 and day 13) and the move to the free plan on day 15 |
| 3 | The free badge: destination URL, and whether a handed-off client hub on the free plan shows it |
| 4 | "or your card" everywhere |
| 5 | Partner reward during the PayPal months: recorded now, applied when billing moves to Stripe. Say so on the handoff page and in the terms |
| 6 | Tax and VAT on receipts; refund policy; contact emails and reply times |
| 7 | Prices are hypotheses until 1 February 2027; lock them after the beta pricing test |
| 8 |  |
| 9 | Mockup builder: Arabic name and template list |
| 10 | Guideline looks per plan (2 free, 8 paid) and voice per channel: confirm against Plan Limits & Entitlements v5.1 |
| 11 | Viewer daily AI limit on the Company plan |
| 12 | Nakhla) for the hero link, open without signing in |
| 13 | Dialect and register claims depend on the December Arabic test |
| 14 | OpenAI API data terms before any line about training; storage region on Railway |
| 15 | Proof slot: real beta names, with permission, after the beta |
| 16 | Notion's Website tracker lists older paths (`/en/solutions/discovery`, `/en/solutions/client-handoff`). This file uses `/en/platform/...` for feature pages. Align one to the other |

*Markyos site copy v5 · one file.*
