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
    title: "Markyos · At home in both languages",
    description:
      "One platform for your brand in Arabic and English: discovery, strategy, a guideline site that builds itself, handoff, and an AI that knows your brand.",
    ogTitle: "Studios build it. Companies live it.",
    ogDescription:
      "One ecosystem that replaces seven tools, for the people who make brands and the people who run them.",
  },

  chips: {
    comingSoon: "Coming soon",
    arrivingSoon: "Arriving soon",
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
        // The rail. Approved key line, §11, verbatim — and it happens to name
        // the three columns under it in order: studios build, the handoff
        // hands over, companies keep it alive.
        intro: {
          title: "Build the brand. Hand it over. Keep it alive.",
          more: { label: "All solutions", href: "/solutions" },
        },
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
      /*
       * Platform, as a second mega menu — v2.2.
       *
       * It was a flat link to /platform. The copy deck's v2.2 change gives
       * every module a feature page of its own and the header a second
       * dropdown to reach them by, on the principle that Solutions is
       * organised by *audience* and Platform by *feature*: a visitor who
       * knows they want a guideline site should not have to decide whether
       * they are a studio or a company first.
       *
       * The menu's own spec is in markyos_pages_ar_6_features.md §0.2, which
       * is not in this repo. This is built from the one source that is —
       * §1.6 of the homepage deck — so the three columns are the three
       * stages, the nine items are the nine modules in their numbered order,
       * and each line is that module's "replaces", which is the shortest
       * true description of a feature anybody scanning a menu can use.
       *
       * No `more` link per column: a stage is not a destination, and three
       * links all pointing at /platform would be the same link three times.
       * The one overview link is in `strip`.
       */
      {
        label: "Platform",
        href: "/platform",
        // Approved key line, §11, verbatim. "All the features" moved up here
        // out of `strip`: it was the one link in that strip that was a way
        // into the whole menu rather than a side door, and the rail is where
        // a visitor looks for that. It is not repeated below.
        intro: {
          title: "Your brand deserves a better home than a PDF.",
          more: { label: "All the features", href: "/platform" },
        },
        // Stages, not audiences, so the desktop panel does not label the
        // columns — see `grouping` in content/types.ts.
        grouping: "stage",
        groups: [
          {
            heading: "Create",
            line: "Discovery, strategy, inspiration, files and the guideline.",
            items: [
              {
                title: "The discovery form",
                line: "Replaces Google Forms and Typeform",
                href: "/platform/discovery-forms",
              },
              {
                title: "The strategy hub",
                line: "Replaces Word files and decks",
                href: "/platform/strategy-hub",
              },
              {
                title: "Moodboards",
                line: "Replaces Milanote and Pinterest",
                href: "/platform/moodboards",
              },
              {
                title: "The asset hub",
                line: "Replaces Google Drive and Dropbox",
                href: "/platform/asset-library",
              },
              {
                title: "The guideline site",
                line: "Replaces a PDF guideline and Guidelines.site",
                href: "/platform/guideline-sites",
              },
              {
                title: "The studio board",
                line: "Replaces tracking spreadsheets and Trello",
                href: "/platform/studio-board",
              },
            ],
          },
          {
            heading: "Hand over",
            line: "Ownership of the whole brand moves to the person who owns it.",
            items: [
              {
                title: "Handoff",
                line: "Replaces the zip file and the goodbye email",
                href: "/platform/handoff",
              },
            ],
          },
          {
            heading: "Manage",
            line: "Voice, content review, employees and partners.",
            items: [
              {
                title: "Brand voice and the tone checker",
                line: "Replaces Grammarly and Writer",
                href: "/platform/brand-voice",
              },
              {
                title: "The whole company",
                line: "Replaces shared folders and “where's the logo?”",
                href: "/platform/team-and-sharing",
              },
            ],
          },
        ],
        strip: [
          { label: "Built in Arabic, not translated into it.", href: "/platform/arabic" },
          { label: "Brand Brain", href: "/platform/brand-brain" },
        ],
      },
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
          { label: "All the features", href: "/platform" },
          { label: "Brand Brain", href: "/platform/brand-brain" },
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
    line: "Markyos. At home in both languages.",
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
      /*
       * §1.1 option A, the deck's recommended headline. B to E are in the
       * copy deck and belong to ads and the audience pages; E is the v1.0
       * line this one replaced, "Build the brand. Hand it over. Keep it
       * alive.", which the deck keeps for the studios page.
       */
      eyebrow: "The brand platform, in Arabic and English",
      headline: "Studios build it.",
      headlineAccent: "Companies live it.",
      subheadline:
        "One home for your whole brand, from the first question to the last post. In Arabic and English, as equals.",
      studioCta: { label: "I make brands for clients", href: "/start?type=studio" },
      companyCta: { label: "I run my company's brand", href: "/start?type=company" },
      // CONFIRM in the deck: if a card is required on the free plan, this
      // becomes "Free plan. Cancel anytime."
      microcopy: "Start free. No card needed.",
      /*
       * The scroll story's two strings.
       *
       * The elements are the hub's own sidebar, in the hub's own order, so
       * the names flying into the window are the names found inside it.
       */
      scene: {
        elements: ["Logo", "Colour", "Type", "Tone", "Moodboard", "Strategy", "Icons"],
        templatesLabel: "Three ready-made templates for the guideline site",
      },
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
        "7 tools in one platform",
        "Arabic and English, from line one",
        "A guideline site that builds itself in minutes",
        "Your first AI analysis, free",
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
      eyebrow: "How a brand gets built today",
      headline: "Brands don't die. They drift.",
      body: [
        "Every part of the brand sits in a different tool, with a different person. The logo drifts in the sales deck, the Arabic says something the English never meant, and every question lands on one desk.",
      ],
      /*
       * ── `line` is what the picture says, not what the card says ───────
       *
       * Each of these three cards is a headline over a drawing of the
       * problem, and `line` is the one string inside that drawing: the
       * title on the sales slide, the marketing line in the locale row,
       * the first question in the queue. The Arabic has always read that
       * way — «عرض المبيعات · الشريحة 4» is a slide title, not a sentence.
       *
       * Copy v3 §2.3 writes the English three as prose, because a copy
       * deck describes a card rather than filling in a mock. Rendered,
       * that put a sentence where a slide title goes, prose in a row
       * labelled `en-GB` beside an Arabic marketing line it did not
       * disagree with, and a three-line paragraph in a chat bubble that
       * pushed the third message out of the frame.
       *
       * So these match the Arabic: the same three slots, filled the same
       * way. The deck's three sentences are not lost — each one says what
       * its headline already says, which is why the headline is the part
       * the reader sees.
       */
      cards: [
        { headline: "A file nobody opens.", line: "Sales deck · slide 4" },
        { headline: "Two languages, drifting apart.", line: "Summer Sale, up to 40%" },
        {
          headline: "One person, every question.",
          line: "Where's the latest version of the logo?",
        },
      ],
      transition: "It's not a people problem. It's a home problem.",
      lead: "Every brand project takes the same route, and every stop on it is a different tool:",
      stationColumns: { station: "The stop", tool: "The usual tool", what: "What actually happens" },
      stations: [
        {
          station: "Discovery",
          tool: "Google Forms or Typeform",
          what: "Answers arrive in a spreadsheet, and you retype them into something else",
          icon: "form",
        },
        {
          station: "Inspiration",
          tool: "Milanote or Pinterest",
          what: "The references live in one place and the decisions they led to live in another",
          icon: "grid",
        },
        {
          station: "Strategy",
          tool: "Word, Notion or a deck",
          what: "Presented in a meeting, then saved to a folder",
          icon: "fileAlt",
        },
        {
          station: "Files",
          tool: "Google Drive or Dropbox",
          what: "“logo_final_2_new.png”, and five versions of the logo",
          icon: "folder",
        },
        {
          station: "Guidelines",
          tool: "A PDF or Guidelines.site",
          what: "Built from scratch, away from the discovery and the strategy",
          icon: "filePdf",
        },
        {
          station: "Handoff",
          tool: "A zip over WeTransfer",
          what: "The link expires in days, and so does the relationship",
          icon: "package",
        },
        {
          station: "Everyday writing",
          tool: "ChatGPT or Grammarly",
          what: "Clever tools writing confidently, in a voice that isn't your brand's",
          icon: "commentDots",
        },
      ],
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
      headline: "Three ways in. One brand.",
      youGetLabel: "You start with",
      studio: {
        label: "Studios",
        who: "Brand strategists, designers and agencies who make brands for clients",
        headline: "From the first question to the final handoff.",
        youGet: "Modules 1 to 7",
        cta: { label: "I make brands for clients", href: "/start?type=studio" },
      },
      company: {
        label: "Companies",
        who: "Marketing managers, brand leads and founders who run their own brand",
        headline: "On brand. On time. In both languages.",
        youGet: "The hub, the tone checker and the viewers",
        cta: { label: "I run my company's brand", href: "/start?type=company" },
      },
      freelancer: {
        label: "Freelancers",
        who: "Independent designers and strategists working on their own",
        headline: "Work alone. Show up as a team.",
        youGet: "The AI analysis, the guideline site and the handoff",
        cta: { label: "For freelancers", href: "/solutions/freelancers" },
      },
      closing:
        "The studio builds it, the company runs it. When a studio hands a brand over, it moves across whole, from the discovery answers to the voice, into the client's own space.",
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
          body: "Markyos reads the brief and your call notes and gives you a structured report: goals, audience, competitors, personality signals, and the two things a junior designer would miss: the contradictions in what the client said, and the questions you still need to ask. It ends with two or three strategic routes the brand could take. Every finding lands as a draft. You accept what's useful. Nothing goes into the strategy without you.",
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
          body: "Drag in the final folder. Markyos opens it in your browser, finds the logos (and guesses which is primary, icon, mono or reversed), groups the fonts into families and checks which ones cover Arabic, pulls the colours, and files the rest. Then it shows you one screen that says “We found 6 logo files, 2 font families and 9 colours”, so you can confirm and move on.",
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
        { term: "A score out of 100", line: "with a word: On brand, Close, or Off brand" },
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
      headline: "Right to left. Left to right. Always right.",
      /*
       * §2.8, and deliberately not the Arabic sentence translated. The
       * deck's own review note: the Arabic says your words never go through
       * a machine translator, which the tone checker's AI translation makes
       * untrue — so the English claims what is actually true, that nothing
       * in the platform was machine-translated.
       */
      body: "Markyos was built on Arabic and English together. The whole interface mirrors, each script gets its own logo and type, and nothing in the platform was machine-translated: the questions, templates and guideline copy were written in both languages.",
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
      features: [
        { term: "Real mirroring", line: "of every layout, menu and arrow", icon: "exchange" },
        { term: "Arabic and Latin logos", line: "each with its own slot", icon: "copyright" },
        { term: "Type in both scripts", line: "side by side", icon: "font" },
        { term: "Arabic registers", line: "set per channel", icon: "comments" },
        { term: "Terms that stay put", line: "in both languages", icon: "book" },
      ],
      link: { label: "Built in Arabic", href: "/platform/arabic" },
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
    ecosystem: {
      headline: "Right here.",
      headlineAccent: "Right everywhere.",
      body: "Forms, strategy, files, guidelines and voice, in one place. Change a colour once, and it's right on every page that uses it.",
      tools: [
        { label: "Form", tool: "Google Forms", icon: "form" },
        { label: "Board", tool: "Milanote", icon: "grid" },
        { label: "Document", tool: "Word", icon: "fileAlt" },
        { label: "Folder", tool: "Drive", icon: "folder" },
        { label: "Guideline", tool: "PDF", icon: "filePdf" },
        { label: "Chat", tool: "ChatGPT", icon: "commentDots" },
      ],
      brainLabel: "Brand Brain",
      stages: [
        {
          name: "Create",
          what: "Discover the brand. Build its guide.",
          who: "Studios and freelancers, or the company's own team",
          icon: "pencilRuler",
        },
        {
          name: "Deliver",
          what: "It moves, whole, to its owner.",
          who: "The studio and the client",
          icon: "key",
        },
        {
          name: "Run",
          what: "It lives in everything the company writes.",
          who: "Companies",
          icon: "sync",
        },
      ],
      closing:
        "And two things in the middle never change: one source of truth, so every logo, colour and rule has a single version that shows up wherever it's needed, and Brand Brain reading from it.",
      link: { label: "All features", href: "/platform" },
    },

    /*
     * §1.7, rewritten at copy v2.1.
     *
     * The capabilities, the costs and the full explanation moved to
     * /platform/brand-brain. What is left here answers the question a buyer
     * actually has — "will my brand come out better?" — once for a new brand
     * and once for one that already exists.
     */
    aiAlongside: {
      eyebrow: "Brand Brain",
      headline: "It reads",
      headlineAccent: "before it writes.",
      /*
       * §2.7. Four sentences where there were three paragraphs, and the
       * three examples the old middle paragraph buried in a list are now a
       * line of their own — they are the section's evidence, and a reader
       * skimming should hit them, not wade to them.
       */
      body: [
        "Brand Brain is the AI inside Markyos. It reads your brand, not the internet, so it sees what everyone else misses. It suggests. You decide.",
        "A client who contradicts themselves. Leaders who don't agree. A post that drifted from your voice.",
        "ChatGPT knows everything about the world. Brand Brain knows your brand.",
      ],
      effect: {
        headline: "What it does to the result",
        newBrand: "Building a new brand",
        existingBrand: "Improving a brand you already have",
        rows: [
          {
            label: "Starts from",
            newBrand: "Discovery answers and call notes",
            existingBrand: "Your leaders' answers, your current content, and your brand files",
          },
          {
            label: "Shows you",
            newBrand: "The contradictions and the missing questions, before you start designing",
            existingBrand:
              "Where leadership disagrees, and where the content has drifted from the voice, department by department",
          },
          {
            label: "Suggests",
            newBrand:
              "Strategic directions, and drafts for audience and voice, built on the client's own words",
            existingBrand:
              "Rewrites that put a text back in its voice, and translations that hold to the approved terms",
          },
          {
            label: "So you end up with",
            newBrand: "A brand that is consistent from its first day, every decision traceable to a reason",
            existingBrand:
              "A clear list of what is decaying in your brand, instead of a feeling that something isn't right",
          },
        ],
      },
      seamsHeadline: "It guards consistency at the seams where brands come apart",
      seams: [
        {
          title: "Between what the client says and what they mean",
          line: "The AI brief analysis, and the first one in every project is free.",
        },
        {
          title: "Between your leaders",
          line: "The alignment report, and the first one for every brand is free.",
        },
        {
          title: "Between your voice and everything written in it",
          line: "The tone checker, with rewriting in your brand voice beside it.",
        },
        {
          title: "Between the Arabic and the English",
          line: "The term base, and translation in your brand voice.",
        },
        {
          title: "Between the strategy and the visual direction",
          line: "AI art direction, from your moodboards.",
          chip: "board-shapes",
        },
        {
          title: "Between your guideline and what people ask",
          line: "“Ask the brand”, and a list of what the guideline is missing.",
          chip: "ask-the-brand",
        },
      ],
      limitsHeadline: "Clear limits",
      limits: [
        "It suggests, it does not decide. Everything it writes reaches you as a draft that shows where it came from, and nothing in your brand changes until you accept it. And it never draws a logo.",
      ],
      connector: {
        line: "And your own AI tools, like ChatGPT and Claude, will read your brand before they write, through the AI Connector. They read only, and change nothing.",
        chip: "ai-connector",
      },
      cta: { label: "How Brand Brain works", href: "/platform/brand-brain" },
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
      headline: "Everything a brand needs. And what's inside each part.",
      cta: { label: "See the platform", href: "/platform" },
      subheadline:
        "Every module works on its own, and works better with the rest. Start anywhere.",
      stageLabels: {
        create: "Stage one · Create",
        handOver: "Stage two · Hand over",
        manage: "Stage three · Manage",
      },
      replacesLabel: "Replaces:",
      moduleLabel: "Module",
      modules: [
        {
          n: 1,
          stage: "create",
          name: "The discovery form",
          replaces: "Google Forms and Typeform",
          promise: "Better questions, and answers that turn into work.",
          icon: "form",
          feats: [
            {
              name: "Ready-made templates",
              line: "New brand, redesign, sub-brand, naming project, product launch.",
            },
            {
              name: "A bilingual question library",
              line: "Every question written by a brand strategist in Arabic and English. Add, remove, reorder.",
            },
            {
              name: "Questions built for brands",
              line: "Personality sliders, priority ranking, reference-image picking, and a current-logo upload.",
            },
            {
              name: "A client link with no account",
              line: "They answer in Arabic or English, and the form carries your studio's logo and colours.",
            },
            {
              name: "Simple logic",
              line: "Show or hide a question based on an earlier answer.",
            },
            {
              name: "Call notes",
              line: "Paste your notes or a Zoom transcript, so they feed the analysis alongside the answers.",
            },
            { name: "Free and unlimited", line: "On every plan." },
          ],
          link: { label: "The discovery form and AI analysis", href: "/platform/discovery-forms" },
        },
        {
          n: 2,
          stage: "create",
          name: "The strategy hub",
          replaces: "Word files and decks",
          promise:
            "Most strategies live in a file nobody opens after the meeting. Here it lives where it gets used.",
          icon: "layers",
          feats: [
            { name: "Brand foundations", line: "Vision, mission, purpose and values." },
            {
              name: "Positioning and competitors",
              line: "Where your brand stands, and who stands around it.",
            },
            {
              name: "Audiences",
              line: "Who you're speaking to, and what they need to hear.",
            },
            {
              name: "Voice traits",
              line: "“We are this, not that”. The basis for the tone checker later.",
            },
            {
              name: "Both languages",
              line: "Every field in Arabic and English, side by side.",
            },
            {
              name: "From the analysis in one click",
              line: "AI findings arrive as drafts; accept the ones that fit.",
            },
            {
              name: "It carries itself across",
              line: "Approved strategy shows up in the guideline site and the brand voice, with no copying.",
            },
            {
              name: "A strategy assistant and brainstorm",
              line: "Thinks with you about positioning, naming and lines.",
              chip: "strategy-ai",
            },
          ],
          link: { label: "The strategy hub", href: "/platform/strategy-hub" },
        },
        {
          n: 3,
          stage: "create",
          name: "Moodboards",
          replaces: "Milanote and Pinterest",
          promise: "Your references don't stay images. They become decisions.",
          icon: "grid",
          feats: [
            {
              name: "An ordered board",
              line: "Ready-made zones to group references by what they are.",
            },
            {
              name: "Colour from your images",
              line: "Markyos pulls the palette out of the real pixels in your images and proposes it as a draft.",
            },
            {
              name: "Private until you approve it",
              line: "Inspiration references never appear on a public page.",
            },
            {
              name: "A live shared board",
              line: "You, your team and your client on the same board at the same time, the client joining by link with no account.",
              chip: "whiteboard",
            },
            {
              name: "Live brand pieces",
              line: "Your approved logo, colours and fonts as objects on the board, updating when they change.",
              chip: "board-shapes",
            },
            {
              name: "AI art direction",
              line: "The brand brain reads the board and suggests mood words, colours, and Arabic/Latin font pairings.",
              chip: "board-shapes",
            },
          ],
          link: { label: "Moodboards", href: "/platform/moodboards" },
        },
        {
          n: 4,
          stage: "create",
          name: "The asset hub",
          replaces: "Google Drive and Dropbox",
          promise: "Drop the folder. We'll do the sorting.",
          icon: "folderOpen",
          feats: [
            {
              name: "File intake",
              line: "Drop a folder or a zip, and Markyos opens it in your browser.",
            },
            {
              name: "Automatic sorting",
              line: "It recognises logos and which kind each one is, groups fonts into families, and extracts colours.",
            },
            {
              name: "Arabic fonts",
              line: "It checks which fonts actually support Arabic.",
            },
            {
              name: "One confirmation",
              line: "“We found 6 logo files, 2 font families and 9 colours.” You confirm and move on.",
            },
            {
              name: "One correct version",
              line: "Every file in its place, and the approved version always in front.",
            },
            {
              name: "Font licences",
              line: "Fonts not licensed for distribution are shown but not downloadable.",
            },
          ],
          link: { label: "The asset hub", href: "/platform/asset-library" },
        },
        {
          n: 5,
          stage: "create",
          name: "The guideline site",
          replaces: "A PDF guideline and Guidelines.site",
          promise: "From the final files to a complete guideline site. In a few clicks.",
          icon: "book",
          feats: [
            {
              name: "8 ready-made looks",
              line: "Pick one, and the site is built from what the project contains.",
            },
            {
              name: "16 sections that build themselves",
              line: "The logo system with clear space and misuse examples, colour with contrast checks, type, imagery, strategy.",
            },
            {
              name: "A full editor",
              line: "19 section layouts, blocks you add as you like, undo and redo.",
            },
            {
              name: "Both languages",
              line: "One guideline every visitor reads in their own language, not two guidelines.",
            },
            { name: "On every screen", line: "Review on desktop, tablet and phone." },
            {
              name: "It updates itself",
              line: "Change a colour in the assets and it changes on every page of the guideline.",
            },
            {
              name: "Safe publishing",
              line: "A Markyos link, your own domain, or password protection.",
            },
          ],
          link: { label: "The guideline site", href: "/platform/guideline-sites" },
        },
        {
          n: 6,
          stage: "create",
          name: "The studio board",
          replaces: "Tracking spreadsheets and Trello",
          promise: "Every client, and every stage they're in, at a glance.",
          icon: "scan",
          feats: [
            {
              name: "A track per project",
              line: "Discovery, analysis, strategy, exploration, design, intake, build, handoff. Skip what you don't need.",
            },
            {
              name: "A board by stage",
              line: "All your projects in columns, so you know what needs you today.",
            },
            { name: "Team and roles", line: "Owner, editor, viewer." },
            {
              name: "Clients as guests",
              line: "On the form and the review, with no account and no limit.",
            },
            {
              name: "Sign-off pins",
              line: "Your client approves the core guideline sections, and every approval is kept with its date.",
            },
          ],
          link: { label: "The studio board", href: "/platform/studio-board" },
        },
        {
          n: 7,
          stage: "handOver",
          name: "Handoff",
          replaces: "The zip file and the goodbye email",
          promise:
            "No zip. No “final_FINAL_v3.pdf”. A brand your client genuinely owns.",
          icon: "key",
          feats: [
            {
              name: "Ownership transfer",
              line: "Invite your client, and the hub becomes theirs on their own account.",
            },
            { name: "You keep a role", line: "Editor or viewer, whichever you agreed." },
            {
              name: "Your slot frees up",
              line: "The project stops counting against your plan the moment it's handed over.",
            },
            {
              name: "Always free",
              line: "Handoff is free on every plan, and the hub stays live on the client's free plan.",
            },
            {
              name: "The partner reward",
              line: "20% of what your client pays in their first year, as credit on your subscription.",
            },
            {
              name: "Their first year up front",
              line: "Pay their first year on the Brand plan at $190 instead of $228, and add it to your project's value.",
            },
          ],
          link: { label: "Handoff and the partner reward", href: "/platform/handoff" },
        },
        {
          n: 8,
          stage: "manage",
          name: "Brand voice and the tone checker",
          replaces: "Grammarly and Writer, for everything to do with your brand's voice",
          promise: "Does this text speak in your brand's voice? Know in seconds.",
          icon: "penSquare",
          feats: [
            {
              name: "Voice traits and examples",
              line: "Write how your brand speaks once, with sample text that shows it.",
            },
            {
              name: "An Arabic register per channel",
              line: "Modern Standard, Gulf, Egyptian or Levantine, and British or American English.",
            },
            {
              name: "A term base",
              line: "Preferred, banned, do-not-translate, and the approved translation for every word.",
            },
            {
              name: "The quick review",
              line: "A score out of 100, the reason for every note, banned words, and register mismatches.",
            },
            {
              name: "The deep review",
              line: "An explanation for every note, and a suggested rewrite for each sentence.",
            },
            {
              name: "Rewrite, or translate, in the brand's voice",
              line: "Arabic to English and back, following your term base.",
            },
            { name: "Your text isn't stored", line: "We keep the score, not the words." },
          ],
          link: { label: "Brand voice", href: "/platform/brand-voice" },
          link2: { label: "The tone checker", href: "/platform/tone-checker" },
        },
        {
          n: 9,
          stage: "manage",
          name: "The whole company",
          replaces: "Shared folders, and “where's the logo?” messages",
          promise: "Editors change the brand. Everyone else uses it, free.",
          icon: "building",
          feats: [
            {
              name: "Unlimited viewers",
              line: "On paid plans every employee gets into the hub free, downloads the right file, and checks their own writing.",
            },
            {
              name: "Align the leadership",
              line: "One workshop for your leaders, and a report showing where they agree and where they don't. The first report is free.",
            },
            {
              name: "Partner links",
              line: "Share approved files with your agency or printer over a link that expires on a date you set.",
            },
            {
              name: "Invite the studio",
              line: "Your studio works inside your brand without counting against your editors.",
            },
            {
              name: "Department playbooks and email signatures",
              line: "Voice and key messages per department, and a bilingual signature for every employee.",
              chip: "department-playbooks",
            },
            {
              name: "Templates, reviews and brand health",
              line: "Posts and decks with your real assets, approvals before publishing, and a dashboard you show the board.",
              chip: "brand-health",
            },
          ],
          link: { label: "Viewers and sharing", href: "/platform/team-and-sharing" },
        },
      ],
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
      headline: "Fewer files. A clearer brand.",
      columns: {
        job: "The job",
        usually: "You use today",
        markyos: "In Markyos",
        change: "What actually changes",
      },
      rows: [
        {
          job: "The discovery form",
          usually: "Google Forms · Typeform · Tally",
          markyos: "Bilingual brand forms, with questions a strategist wrote",
          change: "Answers become an analysis and strategy drafts, with no copy-paste",
        },
        {
          job: "Reading the answers",
          usually: "Two hours of your time, or ChatGPT with no context",
          markyos: "AI brief analysis: contradictions, missing questions, directions",
          change: "The first one is free on every project",
        },
        {
          job: "Strategy",
          usually: "Word · Google Docs · Notion · a deck",
          markyos: "A strategy hub built for brands, in both languages",
          change: "It carries through to the guideline and the voice, instead of sitting in a folder",
        },
        {
          job: "Moodboards",
          usually: "Milanote · Pinterest · Miro",
          markyos: "A moodboard that pulls the palette out of your real images",
          change: "The board turns into decisions: colours and drafts. And a live board with your client",
          changeChip: "whiteboard",
        },
        {
          job: "Files",
          usually: "Google Drive · Dropbox",
          markyos: "An asset library that sorts your files for you",
          change: "One correct version of every logo, font and colour",
        },
        {
          job: "The guideline",
          usually: "A PDF out of InDesign · Guidelines.site",
          markyos: "A guideline site built from the project's own files, in both languages",
          change: "Minutes instead of days, and connected to everything before it",
        },
        {
          job: "Handoff",
          usually: "A zip over WeTransfer and an email",
          markyos: "Ownership of a live brand hub, transferred",
          change: "Your client owns their brand, and you earn when they upgrade",
        },
        {
          job: "Brand voice",
          usually: "Grammarly · Writer · ChatGPT",
          markyos: "A tone checker that knows your voice and your terms",
          change: "It understands Arabic and its registers, and it's priced per company, not per person",
        },
        {
          job: "Tracking projects",
          usually: "A spreadsheet · Trello",
          markyos: "A studio board by the stage each project is in",
          change: "You know where every client stands at a glance",
        },
        {
          job: "Employee questions",
          usually: "An endless thread to the marketing manager",
          markyos: "“Ask the brand”",
          chip: "ask-the-brand",
          change: "The employee answers it themselves, from the hub",
        },
        {
          job: "Your AI tools",
          usually: "ChatGPT and Claude, with no idea what your brand is",
          markyos: "The AI connector",
          chip: "ai-connector",
          change: "They read your actual brand before they write",
        },
      ],
      line: "Fewer tabs. One brand. Both languages.",
      subheadline:
        "An honest comparison, stop by stop. What matters isn't how many tools you drop. It's that everything left is connected.",
      trademarkNote:
        "The names above are trademarks of their owners, and are mentioned only to describe the tools people commonly use.",
      link: { label: "The full comparison", href: "/compare/tool-stack" },
      notReplacedHeadline: "What Markyos does not replace",
      notReplaced: [
        {
          title: "Your design tool",
          line: "Design in Figma or Illustrator exactly as you do today. Markyos takes the final files and surrounds them with everything they need.",
          icon: "bezier",
        },
        {
          title: "Sales and invoicing",
          line: "Proposals and invoices stay in your own tools.",
          icon: "invoice",
        },
        {
          title: "The whiteboard for everything",
          line: "If you use Miro for meetings that have nothing to do with the brand, it keeps its place. Our boards are built for brands.",
          icon: "chalkboard",
        },
      ],
    },

    comingNext: {
      headline: "The ecosystem is growing. Here's what comes next.",
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
            "Ask the Brand for every employee",
            "A strategy assistant and brainstorm",
            "Connect ChatGPT or Claude to your brand",
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
      headline: "Start free. Pay as you grow.",
      // §2.9. The scope of the free plans, before the three cards spell
      // them out — a reader who stops here still leaves with the offer.
      body: "A full project free for studios. A full hub free for companies. Paid plans from $24 a month.",
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
      underBoth: "Save about 20% with annual billing.",
      link: { label: "Compare all plans", href: "/pricing" },
    },

    // CONFIRM: Abdullah to rewrite in his own words, and correct the regions
    // to match his real client history. Do not publish as drafted.
    founderNote: {
      headline: "Why we built this",
      body: [
        "I've worked as a brand designer and strategist since 2019. On every project I opened the same tools: a form in Google Forms, a board in Milanote, a strategy in a Word file, a folder in Drive, a guideline as a PDF. And every time, the brand faded within months of the handoff. And the Arabic was always the weakest part, because every one of those tools was built for English first.",
        "Markyos is the place I wanted on every one of those projects: one ecosystem where a brand is made, handed over, and lives, in Arabic and English as equals.",
      ],
      signature: "Abdullah Saeedan, Founder",
    },

    faq: {
      /*
       * Three questions, not twelve. v3 folds the FAQ into the pricing
       * section (§2.9) and sends the rest to /pricing#faq, where the deck
       * gives all fourteen a home. The nine that left are not lost: every
       * one of them is in Part D, Page 1 of the English deck.
       *
       * These three are the three the deck chose, in its order: what
       * Markyos is not, who can start, and what the AI will never do.
       */
      headline: "Questions, answered",
      items: [
        {
          question: "Is Markyos a design tool?",
          answer:
            "No. Design in Figma or Illustrator. Markyos holds everything around the design.",
        },
        {
          question: "Do I need a studio to use it?",
          answer: "No. A company can start on its own, and so can a studio.",
        },
        {
          question: "Does the AI design logos?",
          answer: "Never. It reads and drafts words. The design is yours.",
        },
      ],
      link: { label: "All questions", href: "/pricing#faq" },
    },

    /*
     * The close.
     *
     * "Built. Shared. Alive." is the English deck's §2.10, and it is back
     * after being replaced here once before. The argument against it was
     * that three passive verbs address nobody in the last place a visitor
     * reads; the argument for it is that it is the three stages of the page
     * said in three words, and it is the line the Arabic closes on too
     * («تُبنى. تُشارك. تحيا.»), which is what keeps the two editions ending
     * on the same beat.
     *
     * It disagrees with MARKYOS-DESIGN-SYSTEM.md §11, which lists "Build the
     * brand. Hand it over. Keep it alive." among the approved verbatim
     * lines. The copy deck is dated 8 Nov 2026 and the design system 20 Oct;
     * the deck wins, and §11 is the thing that is now out of date. The
     * older line is not retired — the deck keeps it for the studios page.
     */
    finalCta: {
      eyebrow: "Start today",
      headline: "Built. Shared. Alive.",
      subheadline: "Start free, studio or company.",
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
