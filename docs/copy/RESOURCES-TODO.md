# Resources: what the import left open

**Generated 8 November 2026** by `npm run cms:import`, and kept because the
answers are not in the CMS.

The forty written pieces came with ninety-one square-bracket notes in the
Markdown — instructions to the writer rather than text for the page. They were
removed on import, which is the only correct thing to do with them, and listed
here so removing them is not the same as losing them.

They fall into four kinds, and three of them are work:

- **`[CONFIRM: …]`** — a fact nobody has verified. Competitor pricing, ship
  dates, plan names, whether a feature exists at launch. These pages are
  **published**, so each one is a claim currently live.
- **`[Link: …]` / `[رابط: …]` with no path** — a cross-reference to a piece
  that had no URL when it was written. Most link markers *did* carry a path
  and became real links; these are the ones left pointing nowhere. The label
  survives as plain text, so the sentence still reads.
- **`[Button: …]` / `[زر: …]`** — a download or CTA the design is meant to
  place. **No guide has a download file**: the source folders carry the
  article, the Word copy and the images, and no PDF or template. Until one is
  uploaded to the guide's `downloadFile`, "Download the template" has nothing
  behind it, which is why the markers were not rendered as buttons.
- **`[CHIP: …]` / `[شارة: …]`** — a launch-status chip. `src/lib/status.ts` already
  owns these by feature id; they were never going to be placed from a string
  in the body.

Separately, **eight of the nine release notes have no release date.** The Date
row says "Launch week", "Third week after launch", "Spring 2027",
"Mid-2027 (v4.0)". Only "Markyos is live" carries a real one, 15 February
2027. The rest are dated today, which is true — they are being published
today — and each wants its real date set in the panel.

page that is now published.


## Blog/01-brand-strategy
- **[Link: "Seven questions every discovery brief needs" →]**
- [CONFIRM: Abdullah to adjust from his own project timelines]
- (ar) **[رابط: مقال «سبعة أسئلة. وعميل تفهمه أكثر مما يفهم نفسه.» ←]**

## Blog/05-rebrand-or-refresh
- **[Link: "Brands don't die. They drift." →]**
- (ar) **[رابط: مقال «العلامات لا تموت، بل تتوه.» ←]**

## Blog/08-measure-brand-consistency
- **[Link: The bilingual term base template →]**
- **[Link: Arabic register by channel →]**
- (ar) **[رابط: قالب قاموس المصطلحات ثنائي اللغة ←]**
- (ar) **[رابط: جدول مستوى العربية لكل قناة ←]**

## Blog/09-ai-and-brand-voice
- **[Link: Voice traits in twenty minutes →]**
- [CHIP: Coming 2027]
- (ar) **[رابط: سمات الصوت في عشرين دقيقة ←]**

## Blog/10-brand-architecture
- [CHIP: Coming 2027]
- [CONFIRM: The Business plan and brand architecture ship in v5.0. Keep the chip until they do; check plan numbers against the live Pricing page.]
- (ar) [CONFIRM: Business plan and brand architecture ship in v5.0. Keep the chip until they do; check plan numbers against the live Pricing page.]

## Compare/01-pdf-guidelines
- [CHIP: Coming 2027]
- [Button: Turn your guidelines into a live site, free →]

## Compare/02-tool-stack
- [Button: Try a full project free →]

## Compare/03-guidelines-site
- [CONFIRM: check whether Guidelines offers an export, and describe it only if it does]

## Compare/04-endform
- [CONFIRM: check Endform's export options before describing migration further]

## Compare/05-frontify
- [CHIP: Coming 2027]

## Compare/06-milanote
- [CHIP: Coming spring 2027]

## Compare/07-brand-brief-forms
- [CONFIRM in product]
- [CONFIRM]
- [Button: Send your first form free →]

## Compare/09-canva-brand-kit
- [CHIP: Coming 2027]
- [CONFIRM: describe only what v4.0's Canva Connect integration will actually do]

## Compare/10-brand-management-platforms
- [Button: Try Markyos free →]

## Guides/01-brand-strategy-one-page
- **[Link: Voice traits in twenty minutes →]**
- [Button: Download the template →]
- (ar) **[رابط: سمات الصوت في عشرين دقيقة ←]**

## Guides/02-brand-guidelines-template
- **[Link: "Brand guidelines people actually open" →]**
- [Button: Download the template →]
- (ar) **[رابط: مقال «دليل الهوية الذي يفتحه الناس فعلاً» ←]**

## Guides/03-bilingual-persona-template
- [Button: Download the worksheet →]

## Guides/04-brand-audit-checklist
- **[Link: Your brand strategy on one page →]**
- **[Link: The brand guidelines template →]**
- **[Link: Voice traits in twenty minutes →]**
- **[Link: The bilingual term base →]**
- [Button: Download the checklist →]
- [CONFIRM: leadership alignment may ship up to two weeks after launch. If it does, add the chip "Coming March 2027".]
- (ar) **[رابط: استراتيجية علامتك في صفحة واحدة ←]**
- (ar) **[رابط: قالب دليل الهوية ←]**
- (ar) **[رابط: سمات الصوت في عشرين دقيقة ←]**
- (ar) **[رابط: قاموس المصطلحات ثنائي اللغة ←]**
- (ar) [CONFIRM: leadership alignment may ship up to two weeks after launch. If it does, add the chip «قريباً · مارس 2027».]

## Guides/05-competitor-brand-analysis
- [Button: Download the template →]

## Guides/06-moodboard-template
- [Button: Download the template →]
- [CHIP: Coming spring 2027]
- [CONFIRM: if the moodboard isn't saved on the server at launch, the whole "In Markyos" paragraph carries "Coming spring 2027".]
- (ar) [CONFIRM: if the moodboard isn't saved on the server at launch, the whole «في ماركيوس» paragraph carries «قريباً · ربيع 2027».]

## Guides/07-brand-presentation
- [Button: Download the outline →]

## Guides/08-brand-project-scope
- [Button: Download the template →]

## Guides/09-ai-usage-policy
- [Button: Download the template →]
- [CHIP: Coming 2027]

## Guides/10-internal-brand-launch
- [Button: Download the plan →]

## Whats-New/01-markyos-is-live
- [Button: I design identities for clients →]
- [Button: I run my company's brand →]
- [CONFIRM: keep only if the beta ran]

## Whats-New/02-discovery-forms-and-brief-analysis
- [Button: Send your first form free →]
- (ar) release date is not a date: "Launch week"

## Whats-New/03-guideline-sites
- [Button: Build your first guidelines free →]
- (ar) release date is not a date: "Launch week"

## Whats-New/04-handoff-and-partner-reward
- [Button: Start your first project free →]
- (ar) release date is not a date: "Second week after launch"

## Whats-New/05-brand-voice-and-term-base
- [CONFIRM: per-channel register is Team-and-above per the pricing table; align this line with the live plan]
- [Button: Set up your brand voice free →]
- (ar) release date is not a date: "Third week after launch"

## Whats-New/06-tone-checker
- [Button: Try your first check free →]
- [CONFIRM: credit costs and quotas are provisional until the Arabic and English test before 1 Feb 2027. Keep dialect lines only if the December Arabic test passed.]
- (ar) release date is not a date: "Third week after launch"

## Whats-New/07-moodboards-live-whiteboard
- [Button: Open a board now →]
- [CONFIRM: every bullet must match what v3.0 actually ships. Remove any bullet that slips to a later release.]
- (ar) release date is not a date: "Spring 2027"

## Whats-New/09-ai-connector
- **[Link: How to connect Claude →]**
- **[Link: How to connect ChatGPT →]**
- [CONFIRM: every line must be true on the day v4.0 ships, checked with the back-end partner. Keep the security wording identical to the Security page.]
- (ar) **[رابط: كيف تربط Claude ←]**
- (ar) **[رابط: كيف تربط ChatGPT ←]**
- (ar) release date is not a date: "Mid-2027 (v4.0)"
