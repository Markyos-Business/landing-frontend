import type { SiteCopy } from "../types";

/*
 * English page copy — markyos_landing_page_copy.md v1.0 (16 Oct 2026).
 *
 * This is approved copy. Edits are copy decisions, not code changes: keep the
 * voice rules in §1.5 (short sentences, "you" over "we", real nouns, no
 * exclamation marks, none of "revolutionary / seamless / leverage / unlock").
 *
 * Three things in here are deliberately unfinished and must not ship as they
 * stand. Each is marked CONFIRM at its line, and all three are listed in
 * docs/BEFORE-PUBLISH.md:
 *   - "No card needed" on the free plans
 *   - every price (hypotheses until the beta pricing test closes 1 Feb 2027)
 *   - the founder note, which Abdullah rewrites in his own words
 */

export const copy: SiteCopy = {
  meta: {
    title: "Markyos — The bilingual brand hub, Arabic and English",
    description:
      "Run brand projects from first brief to client handoff, and keep your company on brand in Arabic and English. Start free.",
    ogTitle: "Build the brand. Hand it over. Keep it alive.",
    ogDescription:
      "The bilingual brand platform for studios that make brands and companies that run them.",
  },

  chips: {
    comingSpring2027: "Coming spring 2027",
    coming2027: "Coming 2027",
    arrivingFeb2027: "Arriving February 2027",
  },

  nav: {
    /*
     * Four items plus a button, from markyos_solutions_menu.md §1.1.
     *
     * "For studios" and "For companies" were two of five flat links; they are
     * now two of three columns inside Solutions, which also has room for
     * freelancers. The visitor's first question is still "is this for me?",
     * and Solutions sits first because that is what answers it — the dropdown
     * just answers it in more detail than a link could.
     */
    items: [
      {
        label: "Solutions",
        href: "/solutions",
        groups: [
          {
            heading: "Studios and agencies",
            line: "Run every client project, and your team, from one place.",
            items: [
              {
                title: "Every project, one place",
                line: "From the first brief to the handoff, with every project on one board by stage.",
                href: "/solutions/client-projects",
              },
              {
                title: "Discovery and AI analysis",
                line: "Bilingual briefs, and a report that finds the contradictions and the missing questions.",
                href: "/solutions/discovery",
              },
              {
                title: "Guideline sites that build themselves",
                line: "Drop the final files, pick a look, and the site is built in a few clicks.",
                href: "/solutions/guideline-sites",
              },
              {
                title: "A handoff that pays you back",
                line: "Hand over a live hub, and earn 20% when your client upgrades.",
                href: "/solutions/client-handoff",
              },
            ],
            more: { label: "See everything for studios", href: "/solutions/studios" },
          },
          {
            heading: "Freelance designers",
            line: "Show up like a full team, even when it's just you.",
            items: [
              {
                title: "A strategist's read on every client",
                line: "An AI read on your client's answers. The first one in every project is free.",
                href: "/solutions/discovery#analysis",
              },
              {
                title: "Guidelines without building them",
                line: "Your final files become a full guideline site, without hours of layout.",
                href: "/solutions/guideline-sites",
              },
              {
                title: "A handoff that matches your work",
                line: "Instead of a PDF, your client gets a live brand hub with their name on it.",
                href: "/solutions/client-handoff",
              },
              {
                title: "A brief that looks professional",
                line: "Questions written by a strategist, in Arabic and English, with no client account needed.",
                href: "/solutions/discovery#forms",
              },
            ],
            more: { label: "See everything for freelancers", href: "/solutions/freelancers" },
          },
          {
            heading: "Companies",
            line: "Your whole company on brand, in both languages.",
            items: [
              {
                title: "One home for your brand",
                line: "Assets, guidelines and strategy in one hub, always up to date.",
                href: "/solutions/brand-hub",
              },
              {
                title: "Tone-of-voice checker",
                line: "Know in seconds if a text sounds like you, in Arabic and English.",
                href: "/solutions/tone-checker",
              },
              {
                title: "The whole company, free",
                line: "Unlimited viewers on paid plans, and safe links for your agencies and partners.",
                href: "/solutions/company-rollout",
              },
              {
                title: "One voice, both languages",
                line: "Your voice traits, the Arabic register for each channel, and an approved translation for every key term.",
                href: "/solutions/brand-voice",
              },
            ],
            more: { label: "See everything for companies", href: "/solutions/companies" },
          },
        ],
        strip: [
          { label: "Built in Arabic, not translated into it.", href: "/platform/arabic" },
          { label: "How does handoff work?", href: "/solutions/client-handoff#how" },
          { label: "Not sure? Help me choose", href: "/start" },
        ],
      },
      { label: "Platform", href: "/platform" },
      { label: "Pricing", href: "/pricing" },
      {
        // A plain list, not a mega menu. The menu spec does not give Resources
        // one, and these four are the footer's Resources column — approved
        // labels, with no invented descriptions written under them.
        label: "Resources",
        href: "/resources",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Guides", href: "/guides" },
          { label: "Help center", href: "/help" },
          { label: "Compare", href: "/compare" },
        ],
      },
    ],
    login: "Log in",
    startFree: "Start free",
    languageLabel: "Site language",
    menuLabel: "Menu",
    skipToContent: "Skip to content",
  },

  footer: {
    columns: [
      {
        heading: "Product",
        links: [
          { label: "Platform", href: "/platform" },
          { label: "Pricing", href: "/pricing" },
          { label: "Roadmap", href: "/roadmap" },
          { label: "What's new", href: "/whats-new" },
        ],
      },
      {
        heading: "For",
        links: [
          { label: "Studios and agencies", href: "/solutions/studios" },
          // Freelancers have a page of their own now rather than sharing the
          // studios one, because the menu gives them a column of their own.
          { label: "Freelance designers", href: "/solutions/freelancers" },
          { label: "Companies", href: "/solutions/companies" },
          // "Marketing teams" pointed at /solutions/companies too. Two labels
          // for one page is a dead-looking link the second time somebody
          // clicks it, so the slot goes to the hub instead.
          { label: "All solutions", href: "/solutions" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Guides", href: "/guides" },
          { label: "Help center", href: "/help" },
          { label: "Compare", href: "/compare" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "Built in Arabic", href: "/platform/arabic" },
        ],
      },
    ],
    line: "Markyos. Every asset. Every instruction. Both directions.",
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "Cookies", href: "/cookies" },
    ],
  },

  announcement: {
    live: {
      text: "New: Markyos is open. Studios and companies can start free today.",
      cta: { label: "See what's new", href: "/whats-new" },
    },
    // The scarcity is real — these are the actual beta sizes — so it creates
    // urgency without inventing it.
    beta: {
      text: "Private beta is open for 25 studios and 15 companies in the Gulf and Southeast Asia.",
      cta: { label: "Apply for a spot", href: "/start" },
    },
  },

  home: {
    hero: {
      eyebrow: "Every asset. Every instruction. Both directions.",
      headline: "Build the brand. Hand it over. Keep it alive.",
      subheadline:
        "Markyos is the bilingual brand platform for the studios that make brands and the companies that run them. Discovery, strategy, guidelines and voice live in one place, in Arabic and English, from the first question to the brand your whole company uses every day.",
      studioCta: { label: "I make brands for clients", href: "/start?type=studio" },
      companyCta: { label: "I run my company's brand", href: "/start?type=company" },
      // CONFIRM: "No card needed" — if a card is required on the free plan,
      // this becomes "Free plan. Cancel anytime."
      microcopy:
        "Free plan. No card needed. Not sure? If it's your own brand, choose the second one.",
      // §6.3. The spot counts are the real beta sizes, and the locked price is
      // a commitment — do not change either without changing the offer.
      beta: {
        studioCta: { label: "Apply for the studio beta", href: "/start?type=studio" },
        companyCta: { label: "Apply for the company beta", href: "/start?type=company" },
        microcopy:
          "25 studio spots and 15 company spots. Free during the beta, and your beta price is locked for 12 months.",
      },
    },

    proofStrip: {
      facts: [
        "Arabic and English, built in from line one",
        "8 guideline looks, ready to use",
        "16 guideline sections that build themselves",
        "Your first AI brief analysis, free",
      ],
    },

    productGlimpse: {
      headline: "One brand. Every place it needs to live.",
      body: [
        "Discovery answers turn into strategy. Strategy and the final files turn into a guideline site. The site turns into the hub your client's team opens every day. Nothing gets copied and pasted along the way, so nothing goes out of date.",
      ],
      // The same four stages the paragraph above describes, as a list you can
      // scan. Order is the product's order and is not a layout choice.
      flow: [
        { name: "Discovery form", line: "Your client answers, in either language" },
        { name: "Draft accepted", line: "Findings land as drafts you approve" },
        { name: "Guideline page", line: "Sections assemble from what exists" },
        { name: "The hub, in Arabic", line: "Open on any device, mirrored" },
      ],
    },

    problem: {
      eyebrow: "The quiet problem",
      headline: "Brands don't die. They decay.",
      body: [
        "You spend months getting a brand right. The strategy, the logo, the colours, the voice. Then it goes out into the world as a PDF.",
        "Six months later, sales is using the old logo. HR writes like a different company. The Arabic version says something the English never meant. And every “is this on-brand?” question lands on one person's desk.",
        "Nobody did anything wrong. The brand just had nowhere to live.",
      ],
      cards: [
        {
          headline: "The PDF nobody opens",
          line: "Guidelines get emailed once, saved somewhere, and never seen again.",
        },
        {
          headline: "Two languages, drifting apart",
          line: "Arabic and English versions get written by different people, at different times, with different words.",
        },
        {
          headline: "One person, every question",
          line: "The marketing manager becomes the brand's help desk, and the bottleneck.",
        },
      ],
      transition: "It's not a people problem. It's a home problem.",
    },

    shift: {
      headline: "A brand isn't a document. It's a place.",
      body: [
        "A place where the logo is always the right one. Where the strategy and the voice sit next to the files they explain. Where the Arabic and the English are written together, not one after the other. And where anyone in the company can find the answer without asking.",
        "That place is Markyos. A studio builds it. A company runs it.",
      ],
      cta: { label: "See how it works for you", href: "#choose-path" },
    },

    choosePath: {
      headline: "Two ways in. One brand at the end.",
      youGetLabel: "You get",
      studio: {
        label: "For studios",
        who: "Brand strategists, designers and agencies who make brands for clients",
        headline: "Run the whole project here, then hand it over like it's worth what they paid.",
        youGet:
          "Discovery forms, an AI read on the answers, boards, a guideline site that builds itself, and a handoff your client remembers",
        cta: { label: "I make brands for clients", href: "/start?type=studio" },
      },
      company: {
        label: "For companies",
        who: "Marketing managers, brand leads and founders who run their own brand",
        headline: "Keep your brand consistent in every department, every channel, both languages.",
        youGet:
          "Your strategy, assets and voice in one hub, a tone checker that knows your brand, and room for the whole company",
        cta: { label: "I run my company's brand", href: "/start?type=company" },
      },
    },

    studioPath: {
      eyebrow: "For studios",
      headline: "From the first question to the final handoff. In one place.",
      subheadline:
        "Every step feeds the next one. Skip any step you don't need, or start from the middle with a brand you've already designed.",
      stepLabel: "Step",
      steps: [
        {
          name: "Discover",
          feature: "question-library",
          headline: "Send a brief your client will actually finish.",
          body: "Bilingual discovery forms your client answers at their own link, in Arabic or English, without making an account. Start from a template for a new brand, a rebrand or a sub-brand, then add, remove or reorder questions from a library written by a brand strategist, not a translation tool. Paste your call notes in too, so nothing said on Zoom gets lost.",
          smallPrint: "Forms and responses are free and unlimited on every plan.",
        },
        {
          name: "Analyze",
          feature: "brief-analysis",
          headline: "Get a senior strategist's read on the answers. The first one's free.",
          body: "Markyos reads the brief and your call notes and gives you a structured report: goals, audience, competitors, personality signals, and the two things a junior designer would miss — the contradictions in what the client said, and the questions you still need to ask. It ends with two or three strategic routes the brand could take. Every finding lands as a draft. You accept what's useful. Nothing goes into the strategy without you.",
          smallPrint: "One free analysis in every project, on every plan. Re-runs use credits.",
        },
        {
          name: "Strategize",
          headline: "Write the strategy where the brand will live.",
          body: "Vision, mission, purpose, positioning, personas, voice traits, values and competitors, in both languages. Accept the analysis drafts you agree with, write the rest yourself, and the strategy flows straight into the guideline site later. Doing visual identity only? Skip it.",
        },
        {
          name: "Explore",
          headline: "Find the direction with your client, not just for them.",
          body: "Collect references on a moodboard and Markyos pulls the palette out of the real pixels in your images. Group them, cull them, and show the client a direction they can react to.",
          coming: {
            feature: "whiteboard",
            headline: "Real-time whiteboard.",
            body: "Sketch directions with your team and your client live, on the same canvas, with your approved logo, colours and type as live pieces. Clients join from a link, no account needed. And AI art direction turns a board into mood words, a palette rationale, and Arabic and Latin type pairings.",
          },
        },
        {
          name: "Design",
          headline: "Keep designing in the tools you love.",
          body: "Markyos isn't a design tool, and it doesn't want to be. Design the identity in Figma, Illustrator or whatever you use. Everything you need to design well (the brief, the analysis, the strategy, the boards) is one tab away.",
        },
        {
          name: "Deliver",
          feature: "brand-kit-intake",
          headline: "Drop the zip. We'll sort it.",
          body: "Drag in the final folder. Markyos opens it in your browser, finds the logos (and guesses which is primary, icon, mono or reversed), groups the fonts into families and checks which ones cover Arabic, pulls the colours, and files the rest. Then it shows you one screen — “We found 6 logo files, 2 font families and 9 colours” — so you can confirm and move on.",
        },
        {
          name: "Build",
          feature: "auto-compose",
          headline: "Your guideline site, built in a few clicks.",
          body: "Pick one of 8 looks. Markyos assembles the site from what the project already holds: the logo system with clearspace and misuse examples, the colour section with a contrast check, typography in Arabic and Latin, imagery, and the strategy you accepted. Sixteen sections build themselves when their data exists. Then edit anything, with 19 layouts and a full builder, on desktop, tablet and phone.",
        },
        {
          name: "Hand off",
          feature: "handoff",
          headline: "Hand it over like it's worth what they paid.",
          body: "Invite your client, and the hub becomes theirs. Their own brand site, live and editable, with their own login. You keep the role you agreed on, the project stops counting against your plan, and your slot is free for the next client. No zip file. No “final_FINAL_v3.pdf”. A brand they can actually use.",
        },
      ],
      cta: { label: "Start your first project free", href: "/start?type=studio" },
    },

    handoffLoop: {
      feature: "partner-reward",
      headline: "Build it free. Hand it over. Get rewarded when they grow.",
      body: [
        "You can run a full project on the free plan, from brief to handoff. When your client upgrades their hub, you earn 20% of what they pay for the first 12 months, as credit on your own plan.",
        "Five clients on the Brand plan covers your own Pro subscription.",
      ],
      strip: [
        { label: "You build", line: "the brand, the strategy, the hub" },
        { label: "They own", line: "a live brand hub with their name on it" },
        { label: "You earn", line: "20% back as credit while they grow" },
      ],
      cta: { label: "I make brands for clients", href: "/start?type=studio" },
    },

    company: {
      eyebrow: "For companies",
      headline: "Your whole company, on brand. In both languages.",
      subheadline:
        "Markyos holds your strategy, your assets and your voice in one hub, and helps everyone use them right, so you stop being the brand's help desk.",
      partLabel: "Part",
      parts: [
        {
          name: "Set it up your way",
          headline: "Start from wherever your brand is today.",
          table: [
            {
              condition: "Brand files and maybe an old PDF",
              action: "Import. Drop the files in and Markyos builds the hub from them",
            },
            {
              condition: "A logo and colours, but nothing written down",
              action:
                "Define. Send a short questionnaire to your leadership and let Markyos show you where they agree and where they don't",
            },
            {
              condition: "Nothing yet",
              action:
                "Bring your studio. Invite the studio you already work with, or start with one",
            },
          ],
        },
        {
          name: "Get your leaders on the same page",
          feature: "stakeholder-workshop",
          headline: "Find out what your leadership really thinks the brand is.",
          body: [
            "Send the same brand questions to your CEO, sales, marketing and customer service. Each person answers alone, in Arabic or English. Markyos compares the answers and shows you where leadership agrees, where they don't (“premium” from the CEO, “affordable” from sales), and which questions nobody could answer.",
            "It's the most useful page you'll bring to your next management meeting. The first one is free.",
          ],
        },
        {
          name: "Define the voice once",
          feature: "voice-profile",
          headline: "Write down how you sound, so everyone can sound like it.",
          body: [
            "Set three to five voice traits (“we are / we are not”), add examples of content that's perfectly on-brand, and decide how the voice shifts for social, email, website, ads and customer service. Choose the Arabic register for each channel (Modern Standard Arabic, Gulf, Egyptian or Levantine), UK or US English, and whether mixing is fine.",
            "Then build your term base: preferred words, banned words, product names, and the approved translation of each one in both directions.",
          ],
          coming: {
            feature: "department-playbooks",
            headline: "Department playbooks.",
            body: "Each team gets its own page: who they talk to, key messages in both languages, and a voice dial that shifts the master voice a step warmer for HR or a step more precise for sales, while staying recognisably you.",
          },
        },
        {
          name: "Check before it goes out",
          headline: "The tone checker gets its own section below.",
        },
        {
          name: "Bring everyone in",
          feature: "company-free-plan",
          headline: "Editors change the brand. Everyone else can use it, free.",
          body: [
            "On paid plans, viewers are unlimited and free. Your whole company can open the hub, download the right logo, and check their own writing, without you buying a seat for every person. Share approved files with your agency, printer or a journalist through a link that expires.",
          ],
          coming: {
            feature: "ask-the-brand",
            headline: "Ask the Brand.",
            body: "A sidebar assistant that answers “Can I put the logo on red?” or “What's our tagline in Arabic?” from your hub, with a link to the exact page. If the hub doesn't say, it tells you, and the question goes on your list of gaps to fill.",
          },
        },
      ],
      cta: { label: "Set up your brand free", href: "/start?type=company" },
    },

    toneChecker: {
      feature: "tone-checker",
      eyebrow: "The tone checker",
      headline: "Is this on brand? Know in seconds. In Arabic and English.",
      body: "Paste any piece of content, pick the channel, and Markyos checks it against your voice, your department rules and your term base. Not a generic “friendly” or “formal” setting. Yours.",
      outputHeading: "What you get back",
      outputs: [
        { term: "A score out of 100", line: "with a word — On brand, Close, or Off brand" },
        { term: "A score for each voice trait", line: "with the reason in one line" },
        { term: "Flagged sentences", line: "with the rule or trait each one breaks" },
        { term: "Term problems", line: "a banned word, a product name translated wrong" },
        {
          term: "Arabic register mismatches",
          line: "Egyptian dialect on a channel set to Gulf, for example",
        },
      ],
      extrasHeading: "Two more things it does",
      extras: [
        { term: "Rewrite in brand voice.", line: "Keep the meaning, fix the voice." },
        {
          term: "Translate in brand voice.",
          line: "Arabic to English and back, following your term base and the register of the channel. Transcreation, not word-for-word.",
        },
      ],
      privacy:
        "Your text is checked, not kept. We store the score, not the words, unless you choose to save it (for 30 days).",
      comingHeading: "Coming next for the checker",
      coming: [
        { feature: "document-checks", label: "Check whole Word and PDF documents" },
        { feature: "integrations", label: "Check text anywhere you write, from a Chrome extension" },
      ],
      cta: { label: "Run your first tone check free", href: "/start?type=company" },
      smallPrint: "25 quick checks a month on the free plan. 1,000 a month on Brand.",
    },

    pillars: {
      headline: "Change it once. It changes everywhere.",
      body: "Most brand tools keep copies. A logo in the guidelines, another in the sales folder, another in a deck. Copies drift. Markyos keeps one of everything and shows it wherever it's needed, so when a colour changes, every page that uses it changes with it.",
      pillars: [
        {
          name: "Assets",
          headline: "Every file, one home",
          line: "Logos, fonts, colours, imagery and documents, with the right version always on top.",
        },
        {
          name: "Guidelines",
          headline: "The rules, as a real site",
          line: "A guideline site people actually open, built from the assets, never copies of them.",
        },
        {
          name: "Strategy",
          headline: "The thinking behind it",
          line: "Strategy and department pages that point back to the same assets and rules, so every team reads the same brand.",
        },
      ],
    },

    bilingual: {
      eyebrow: "Arabic and English",
      headline: "Built in Arabic. Not translated into it.",
      body: "Most brand tools were made in English and taught a little Arabic later. Markyos was built with both languages as equals from the first line of code. The whole layout mirrors. Arabic and Latin logos each get their own slot. Type specimens show both scripts side by side. And the words that matter (your discovery questions, your term base, your voice) are written for each language, not run through a translator.",
      points: [
        {
          term: "Mirrors properly",
          line: "not just text alignment; every layout, menu and arrow flips",
        },
        {
          term: "Two scripts, one system",
          line: "Arabic and Latin logos, fonts and type scales side by side",
        },
        {
          term: "Register-aware",
          line: "Modern Standard, Gulf, Egyptian and Levantine Arabic, set per channel",
        },
        {
          term: "Terms that stay put",
          line: "approved translations for every product name and key word",
        },
      ],
      lineEn: "Every asset. Every instruction. Both directions.",
      lineAr: "كل الأصول. كل الإرشادات. في الاتجاهين.",
    },

    aiRules: {
      headline: "AI does the first draft. You make the call.",
      body: "Markyos uses AI where it saves you real time: reading a brief, comparing stakeholder answers, checking content against your voice. It never gets the last word.",
      promises: [
        {
          term: "Drafts, never decisions",
          line: "Everything AI produces lands as a draft with its sources shown. Nothing changes in your brand until a person accepts it.",
        },
        {
          term: "Real artwork only",
          line: "AI never draws your logo or invents your brand's lettering. Your files are your files.",
        },
        {
          term: "Your words stay yours",
          line: "Content you check isn't stored unless you choose to save it.",
        },
        {
          term: "No surprise bills",
          line: "AI runs on credits you can see. If you run out, it stops and asks. It never charges you on the side.",
        },
      ],
    },

    /*
     * v2 §03 — what the AI does, shown before it is explained.
     *
     * Three articles, each a picture with the words underneath. Taken from
     * `Markyos Homepage v2.dc.html`; the stance that used to open this part
     * of the page is still `aiRules`, now at /platform.
     */
    aiAlongside: {
      headline: "AI does the first draft. People make the call.",
      cta: { label: "How we use AI", href: "/platform#ai" },
      articles: [
        {
          title: "Explore with your client, not just for them",
          line: "Collect references on a moodboard and Markyos pulls the palette out of the real pixels. Put directions side by side and let the client pick in their own language.",
          cta: { label: "Open a moodboard", href: "/platform#explore" },
        },
        {
          title: "Read the brief like a senior strategist",
          line: "Send the same questions to your CEO, sales and service. AI compares the answers and shows where leadership disagrees about the brand. The first analysis in every project is free.",
          cta: { label: "Run an analysis", href: "/platform#analysis" },
        },
        {
          title: "Is this on brand? Know in seconds.",
          line: "Paste any piece of content, pick the channel, and Markyos checks it against your voice, your key terms and the right Arabic dialect.",
          cta: { label: "Check a caption", href: "/platform#tone" },
        },
      ],
    },

    /*
     * v2 §04 — the platform, as seven windows onto it.
     *
     * The headline is `pillars.headline` verbatim: the same approved line, and
     * this section is what that line was always claiming. The three pillars
     * themselves are still rendered at /platform, where they have room to be
     * read rather than looked at.
     */
    platformGrid: {
      headline: "Change it once. It changes everywhere.",
      cta: { label: "See the platform", href: "/platform" },
      cells: [
        { name: "Discovery", href: "/platform#discovery" },
        {
          name: "Asset library",
          line: "Drop the final zip. Markyos sorts primary, icon, mono and reversed.",
          href: "/platform#assets",
        },
        {
          name: "Guideline site",
          line: "Logo, colour with a contrast check, type in both scripts. Built in a few clicks.",
          href: "/platform#guidelines",
        },
        {
          name: "Handoff",
          line: "No zip, no final_FINAL_v3.pdf. The client owns a live hub.",
          href: "/platform#handoff",
        },
        {
          name: "Unlimited viewers",
          line: "Pay for the people who change the brand, not the people who use it.",
          href: "/pricing",
        },
        {
          name: "Rights and expiry",
          line: "Usage windows per region, pulled before they lapse.",
          href: "/platform#rights",
        },
        {
          name: "Brand health",
          line: "See what got checked, what got fixed and where the Arabic is missing.",
          href: "/platform#health",
        },
      ],
    },
    replaceStack: {
      headline: "Retire the tools that were holding your brand together.",
      columns: { job: "The job", usually: "What it usually takes", markyos: "In Markyos" },
      rows: [
        {
          job: "Discovery",
          usually: "A general form tool and a lot of copy-paste",
          markyos: "Bilingual brand forms, and an AI read on the answers",
        },
        {
          job: "Exploring a direction",
          usually: "A whiteboard tool that doesn't know your brand",
          markyos: "A moodboard with your real palette (live whiteboard coming spring 2027)",
        },
        {
          job: "Guidelines",
          usually: "A PDF that gets opened once",
          markyos: "A live guideline site that builds itself",
        },
        {
          job: "Files",
          usually: "A shared folder with five versions of the logo",
          markyos: "One asset library, always current",
        },
        {
          job: "Voice",
          usually: "A per-seat writing tool that doesn't know your strategy",
          markyos: "A tone checker that checks against your voice, priced per company",
        },
        {
          job: "Handoff",
          usually: "A zip file and a goodbye email",
          markyos: "Ownership of a live hub",
        },
      ],
      line: "Fewer tabs. One brand. Both languages.",
    },

    comingNext: {
      headline: "Where Markyos is going.",
      subheadline: "We ship in the open. Here's what's next, in the order it's coming.",
      phases: [
        {
          season: "Spring 2027",
          theme: "Explore together",
          items: [
            "A real-time whiteboard you share with your client",
            "Your brand's logo, colours and type as live pieces on the board",
            "AI art direction from a board",
            "Department playbooks",
            "Campaigns and launches inside a brand",
            "Email signatures in Arabic and English for every employee",
          ],
        },
        {
          season: "Mid 2027",
          theme: "Think, ask, present",
          items: [
            "A strategy assistant that follows a real brand method",
            "Ask the Brand for every employee",
            "Check whole Word and PDF documents",
            "Turn an old PDF guideline into a living hub",
            "Ready-made brand templates: social posts, slides, letterheads, business cards",
          ],
        },
        {
          season: "Later in 2027",
          theme: "Run a whole brand team",
          items: [
            "Review requests and approvals",
            "A brand health dashboard you can show management",
            "Check your writing anywhere with a Chrome extension",
            "Sub-brands that inherit from a master brand",
            "Figma sync, an API, and single sign-on",
          ],
        },
      ],
      link: { label: "See the full roadmap", href: "/roadmap" },
    },

    // CONFIRM: every price below is a hypothesis until the beta pricing test
    // closes on 1 Feb 2027. Update from the final pricing page before launch.
    pricingTeaser: {
      headline: "Start free. Pay when it's working.",
      studioToggle: "For studios",
      companyToggle: "For companies",
      studioPlans: [
        {
          name: "Free",
          price: "$0",
          rows: [{ label: "Active projects", value: "1" }],
          line: "Run a full project, from brief to handoff",
          cta: { label: "Start free", href: "/start?type=studio&plan=free" },
        },
        {
          name: "Pro",
          price: "$24/month",
          rows: [{ label: "Active projects", value: "3" }],
          line: "For freelancers running a few clients at once",
          cta: { label: "Start with Pro", href: "/start?type=studio&plan=pro" },
          recommended: true,
        },
        {
          name: "Studio",
          price: "$59/month",
          rows: [{ label: "Active projects", value: "10" }],
          line: "For studios with a team (5 seats)",
          cta: { label: "Start with Studio", href: "/start?type=studio&plan=studio" },
        },
      ],
      companyPlans: [
        {
          name: "Free",
          price: "$0",
          rows: [
            { label: "Editors", value: "2" },
            { label: "Viewers", value: "25" },
          ],
          line: "Build your hub and check your content",
          cta: { label: "Start free", href: "/start?type=company&plan=free" },
        },
        {
          name: "Brand",
          price: "$24/month",
          rows: [
            { label: "Editors", value: "5" },
            { label: "Viewers", value: "Unlimited" },
          ],
          line: "Your whole company, on brand",
          cta: { label: "Start with Brand", href: "/start?type=company&plan=brand" },
          recommended: true,
        },
        {
          name: "Team",
          price: "$59/month",
          rows: [
            { label: "Editors", value: "15" },
            { label: "Viewers", value: "Unlimited" },
          ],
          line: "For several brands (3) and bigger teams",
          cta: { label: "Start with Team", href: "/start?type=company&plan=team" },
        },
      ],
      recommendedLabel: "Recommended",
      studioNote:
        "Handed-off projects don't count. Your slot frees up the moment the client owns their hub.",
      companyNote:
        "Viewers are free on every paid plan. You pay for the people who change the brand, not the people who use it.",
      underBoth:
        "Save about 20% with annual billing. Need more? Agency, Business and Enterprise plans are coming in 2027.",
      link: { label: "Compare all plans", href: "/pricing" },
    },

    // CONFIRM: Abdullah to rewrite in his own words, and correct the regions
    // to match his real client history. Do not publish as drafted.
    founderNote: {
      headline: "Why we built this",
      body: [
        "I've worked as a brand designer and strategist since 2019, across the Gulf and Southeast Asia. On almost every project, the same thing happened. We'd do our best thinking, hand over the brand as a PDF, and watch it fade within a year. The Arabic was always the weakest part, because every tool we used was built for English first.",
        "Markyos is the tool I wanted on every one of those projects. A place to run the work properly, hand it over properly, and give the client a brand their whole company can actually use. In both languages, as equals.",
      ],
      signature: "— Abdullah Saeedan, Co-founder",
    },

    faq: {
      headline: "Questions, answered",
      items: [
        {
          question: "Who is Markyos for?",
          answer:
            "Two kinds of people. Studios and freelance designers who make brands for clients, and companies (usually a marketing manager or brand lead) who run their own brand. You choose which one you are when you sign up.",
        },
        {
          question:
            "I'm a designer and I also run marketing at a company. Do I need two accounts?",
          answer:
            "No. One login can have both a studio workspace and a company workspace. Switch between them from the menu in the top corner.",
        },
        {
          question: "Is Markyos a design tool?",
          answer:
            "No. Keep designing in Figma, Illustrator or whatever you use. Markyos is where everything around the design lives: the brief, the strategy, the exploration, the guideline site, and the brand after it's handed over.",
        },
        {
          question: "Does the AI design logos?",
          answer:
            "Never. AI in Markyos reads, compares and drafts words. It doesn't draw logos or invent brand lettering, and everything it suggests waits for a person to accept it.",
        },
        {
          question: "What happens to my client's hub if they never pay?",
          answer:
            "It stays live and editable on the free company plan, with up to 2 editors, a Markyos web address, and a small “Made with Markyos” badge. They upgrade when they want their whole team in, their own domain, and no badge.",
        },
        {
          question: "What counts as an “active project”?",
          answer:
            "A project you can still edit. Once you hand it over to the client or archive it, it stops counting, and the slot is free again.",
        },
        {
          question: "What's the difference between an editor and a viewer?",
          answer:
            "Editors can change the brand. Viewers can see it, download approved files and check their own writing. On paid company plans, viewers are free and unlimited.",
        },
        {
          question: "How good is the Arabic, really?",
          answer:
            "Arabic isn't a translation layer in Markyos. The interface mirrors fully, both scripts have their own logo and font slots, and the tone checker understands the difference between Modern Standard, Gulf, Egyptian and Levantine Arabic. The discovery questions were written in both languages by a brand strategist.",
        },
        {
          question: "I already have brand guidelines as a PDF. Can I bring them in?",
          answer:
            "Yes. Drop your brand files in and Markyos builds the hub from them. Soon, it will also read your old PDF and draft the guideline sections, voice and key terms from it.",
          coming: "document-checks",
        },
        {
          question: "Is my content safe?",
          answer:
            "Text you run through the tone checker isn't stored unless you choose to save it, and saved text is deleted after 30 days. Nothing in your workspace goes public until you publish it, and you can protect a published hub with a password.",
        },
        {
          question: "Can I use my own domain?",
          answer: "Yes, on paid plans. Password protection is available too.",
        },
        {
          question: "How do I pay?",
          answer:
            "By card, through Stripe, in US dollars. Cards that only work on the Mada network aren't supported yet.",
        },
      ],
    },

    finalCta: {
      eyebrow: "",
      headline: "Your brand deserves a better home than a PDF.",
      subheadline: "Start free today. Build it, hand it over, or run it, in Arabic and English.",
      studioCta: { label: "I make brands for clients", href: "/start?type=studio" },
      companyCta: { label: "I run my company's brand", href: "/start?type=company" },
      // CONFIRM: same free-plan line as the hero. Keep the two in step.
      microcopy: "Free plan. No card needed.",
      beta: {
        studioCta: { label: "Save my studio spot", href: "/start?type=studio" },
        companyCta: { label: "Save my company spot", href: "/start?type=company" },
        microcopy: "Free during the beta. Your beta price is locked for 12 months.",
      },
    },
  },
};
