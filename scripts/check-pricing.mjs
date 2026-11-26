import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

/*
 * The pricing gate, rewritten for copy deck v4.3 (22 Nov 2026).
 *
 * ── What the gate is for ────────────────────────────────────────────────────
 *
 * Until v4.2 this site sold what the platform sells: three account types, each
 * with a one-time pass and a monthly subscription. Every figure on /pricing
 * came from `CURRENT_PRICES`, and this script's whole job was to hold that
 * constant against the backend's `billing.py` and the platform's
 * `accountTypes.ts` so the page and the checkout could not drift.
 *
 * v4.2 replaced the catalogue with named plans and v4.3 replaced that with
 * eleven of them across three audiences. None of it exists in billing, PayPal
 * is not connected, and the deck's own Open item 7 says the prices and limits
 * are hypotheses until the cost test closes in February 2027.
 *
 * So the gate does three jobs:
 *
 *   1. **The old job, unchanged.** `CURRENT_PRICES` is still compared to the
 *      sibling repositories when they are checked out. It no longer appears on
 *      any page, but it is still the only record in this repository of what a
 *      card is actually charged, and the day either sibling moves to the v4.3
 *      catalogue this is what fails and says so.
 *
 *   2. **Nothing may claim a payment the checkout cannot take.** Every plan
 *      CTA has to create a free account or open a conversation — never carry a
 *      plan into a checkout — and every figure a reader can check has to be
 *      derived from the one catalogue rather than typed into a sentence.
 *
 *   3. **The page has to work as a page.** Eleven cards in three panels is a
 *      shape with three ways to break silently: a chooser chip pointing at a
 *      card that is not there, two panels shipping the same DOM id, and a card
 *      value that runs out of a card five columns wide. All three are invisible
 *      in a diff and in a type; this is where they fail instead.
 *
 * Delete job 2 the day the plans are real in billing. Not before.
 */

const root = path.resolve(import.meta.dirname, "..");
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const requireLocal = (name) => {
    assert(name.startsWith("."), `Unexpected runtime dependency: ${name}`);
    let target = path.resolve(path.dirname(file), name);
    if (!fs.existsSync(target)) target += ".ts";
    return load(target);
  };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {}, { filename: file })(requireLocal, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const {
  CURRENT_PRICES,
  LAUNCH_OFFER,
  LOWEST_PAID_MONTHLY,
  EXTRAS,
  PARTNER_SHARE,
  YEARLY_MONTHS,
  TRIAL,
  AI_LIMITS,
  partnerCredit,
  currentPricingPage,
  currentPricingTeaser,
  currentLaunchOffer,
} = load(path.join(root, "content/current-pricing.ts"));

const serial = (value) => JSON.parse(JSON.stringify(value));
const dollars = (value) =>
  `$${value.toLocaleString("en-US", Number.isInteger(value) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── 1. The checkout's own prices, against the siblings ────────────────────── */

let comparisons = 0;
const backend = path.resolve(root, "../markyos-backend/apps/brands/billing.py");
if (fs.existsSync(backend)) {
  const literal = fs.readFileSync(backend, "utf8").match(/PRICES = (\{[\s\S]*?\n\})/)[1];
  const cents = JSON.parse(literal.replace(/,\s*([}\]])/g, "$1"));
  for (const [account, prices] of Object.entries(cents)) {
    assert.equal(CURRENT_PRICES[account].pass * 100, prices.pass, `${account}: backend pass price drift`);
    assert.equal(CURRENT_PRICES[account].subscription * 100, prices.subscription, `${account}: backend monthly price drift`);
  }
  comparisons++;
}
const platform = path.resolve(root, "../markyos-frontend/src/constants/accountTypes.ts");
if (fs.existsSync(platform)) {
  const { ACCOUNT_TYPES } = load(platform);
  for (const [account, prices] of Object.entries(CURRENT_PRICES)) {
    assert.deepEqual(serial(prices), serial(ACCOUNT_TYPES[account].prices), `${account}: platform price drift`);
  }
  comparisons++;
}

/* ── 2. The catalogue's own arithmetic ─────────────────────────────────────── */

/*
 * The three paid plans, read out of the page rather than imported.
 *
 * Importing the price table would prove the page agrees with the table; this
 * proves the page agrees with the deck. The figures below are copy deck v5.2's
 * (docs/copy/markyos_pricing_page_copy_v5_2.md), typed here once, in the only
 * place in the repository where typing them is the point.
 */
const DECK = {
  freelancer: { monthly: 12, yearly: 120, audience: "freelancers" },
  studio: { monthly: 29, yearly: 290, audience: "studios" },
  company: { monthly: 19, yearly: 190, audience: "companies" },
};

/*
 * The three tabs, and the three cards on each.
 *
 * v5.2 puts the same Free card on both builder tabs and the same Studio card
 * on both of them too, so a card id carries its tab. `bigger-team` is Studio
 * plus add-ons rather than a fourth plan, and `enterprise` has no price at
 * all, so neither is in DECK — the per-card price assertions skip a card with
 * no annual rate, which is exactly those two and the free plans.
 */
const TABS = {
  freelancers: { plans: ["free", "freelancer", "studio"], recommended: "freelancer", type: "studio", tableCols: 4 },
  studios: { plans: ["free", "studio", "bigger-team"], recommended: "studio", type: "studio", tableCols: 4 },
  companies: { plans: ["free", "company", "enterprise"], recommended: "company", type: "company", tableCols: 3 },
};

/*
 * Cards that do not sign anybody up for a plan.
 *
 * Enterprise has no price and no checkout: v5.2 gives it "join the waitlist",
 * and there is no waitlist page, so it goes to the contact form's sales topic.
 * It is listed here rather than inferred, so a second card can never quietly
 * stop creating an account.
 */
const OFF_SIGNUP = { "plan-companies-enterprise": "/contact?topic=sales" };

assert.equal(LOWEST_PAID_MONTHLY, 12, "v5.2 puts the lowest paid price at $12 (Freelancer)");
assert.deepEqual(
  serial(EXTRAS),
  { seat: 8, brands5: 10, companyBrand: 19, companyEditor: 8, brainPack: 12, mockupPack: 9 },
  "the add-ons moved away from v5.2 §5",
);
assert.equal(PARTNER_SHARE, 20, "v5.2 has one partner rate; the 25% belonged to the Agency plan, which is gone");
assert.equal(TRIAL.days, 14, "v5.2's entry path is a 14 day trial");
assert.deepEqual(serial(TRIAL.reminderDays), [10, 13], "the deck reminds on day 10 and day 13");
assert.equal(TRIAL.freeFromDay, 15, "the workspace moves to Free on day 15");
assert.equal(LAUNCH_OFFER.percent, 30, "v5.2 drops the launch offer from 50% to 30%");
assert.equal(LAUNCH_OFFER.months, 3, "the offer is three monthly cycles, not a year");
assert.deepEqual(
  [...LAUNCH_OFFER.plans].sort(),
  Object.keys(DECK).sort(),
  "v5.2 puts every paid monthly plan in the offer — there is no $6 plan left to carve out",
);
assert(Date.parse(LAUNCH_OFFER.closes) > Date.parse(LAUNCH_OFFER.opens), "the offer closes before it opens");

/*
 * Two months free, exactly.
 *
 * v4.3 needed a tolerance band here because its yearly rates were a second
 * list price covering four different real discounts. v5.2 states a rule — a
 * year costs ten months — and its three amounts obey it to the dollar, so the
 * rule is what gets asserted. $12 → $120, $29 → $290, $19 → $190.
 */
assert.equal(YEARLY_MONTHS, 10, "two months free means a year costs ten months");
for (const [id, plan] of Object.entries(DECK)) {
  assert.equal(
    plan.monthly * YEARLY_MONTHS,
    plan.yearly,
    `${id}: the yearly price is not the monthly price times ${YEARLY_MONTHS}`,
  );
}

/* The partner reward, derived from the one plan it is a share of. */
assert.equal(partnerCredit(1), dollars((DECK.company.monthly * PARTNER_SHARE) / 100));
assert.equal(partnerCredit(4), dollars((4 * DECK.company.monthly * PARTNER_SHARE) / 100));
assert.equal(partnerCredit(8), dollars((8 * DECK.company.monthly * PARTNER_SHARE) / 100));
assert.equal(partnerCredit(1), "$3.80", "a cent figure keeps both its digits");

/*
 * The limits the feature pages quote, against the deck's own tables.
 *
 * Three pages outside /pricing state an allowance — the tone checker, and two
 * of the three audience pages — and they read `AI_LIMITS` so there is one
 * place to change. This is the check that the one place is right: every figure
 * here is v4.3's, and the Team quick-check number is in it because that is the
 * one that outlived two decks at 3,000 while the deck said 2,500.
 */
const LIMITS = {
  builders: {
    activeBrands: { free: 1, freelancer: 3, studio: 10 },
    newProjects: { free: 1, freelancer: 3, studio: 10 },
    seats: { free: 1, freelancer: 1, studio: 5 },
    storage: { free: "2 GB", freelancer: "20 GB", studio: "100 GB" },
    looks: { free: 2, freelancer: 8, studio: 8 },
    reruns: { free: null, freelancer: 5, studio: 15 },
    sectionDrafts: { free: 5, freelancer: 30, studio: 100 },
    assistant: { free: null, freelancer: 40, studio: 150 },
    mockups: { free: 3, freelancer: 15, studio: 40 },
  },
  companies: {
    brands: { free: 1, company: 1 },
    editors: { free: 1, company: 5 },
    viewers: { free: 25, company: null },
    studioCollaborators: { free: 1, company: 1 },
    storage: { free: "2 GB", company: "25 GB" },
    looks: { free: 2, company: 8 },
    alignmentReruns: { free: null, company: 3 },
    quickChecks: { free: 25, company: 1000 },
    askTheBrand: { free: 20, company: 500 },
    deepChecks: { free: 5, company: 80 },
    assistant: { free: null, company: 50 },
    mockups: { free: 3, company: 30 },
  },
};
assert.deepEqual(serial(AI_LIMITS), LIMITS, "the AI limits moved away from copy deck v5.2");

/* ── 3. Both editions, the homepage, and the page itself ───────────────────── */

for (const locale of ["en", "ar"]) {
  const { pricingPages } = load(path.join(root, `content/pages/${locale}/pricing.ts`));
  const page = pricingPages.find((p) => p.path === "/pricing");
  assert.deepEqual(serial(page), serial(currentPricingPage(locale)), `${locale}: /pricing is not the catalogue`);

  const home = load(path.join(root, `content/${locale}/${locale === "en" ? "index" : "overrides"}.ts`));
  const teaser = (home.copy ?? home.overrides).home.pricingTeaser;
  assert.deepEqual(serial(teaser), serial(currentPricingTeaser(locale)), `${locale}: the homepage teaser has drifted`);

  /* The homepage's one price sentence quotes the catalogue floor. */
  const microcopy = (home.copy ?? home.overrides).home.finalCta.microcopy;
  assert(
    microcopy.includes(String(LOWEST_PAID_MONTHLY)),
    `${locale}: the last call does not quote the lowest paid price`,
  );

  /*
   * One switch, three panels, in the deck's order.
   *
   * v4.2 stacked two plan grids in the page body; v4.3's three audiences are
   * panels of the one switch instead, which is why this looks inside the
   * `audience` block rather than at the top level.
   */
  const group = page.blocks.find((b) => b.kind === "audience");
  assert(group, `${locale}: /pricing has no audience switch`);
  assert.equal(group.param, "for", "v5.2 keeps the shareable ?for= link");
  assert.deepEqual(
    /* `serial`, because the catalogue is evaluated in a `vm` context: its
       arrays have that realm's prototype and `deepStrictEqual` compares
       prototypes, so two identical lists of ids would otherwise fail. */
    serial(group.options.map((option) => option.id)),
    Object.keys(TABS),
    `${locale}: the three tabs are freelancers, studios and companies`,
  );

  /* Every DOM id on the page, so a hidden panel cannot shadow a visible one. */
  const ids = [];
  const collect = (blocks) => {
    for (const block of blocks) {
      if (block.id) ids.push(block.id);
      if (block.kind === "plans") for (const plan of block.plans) if (plan.id) ids.push(plan.id);
      if (block.kind === "audience") for (const option of block.options) collect(option.blocks);
    }
  };
  collect(page.blocks);
  assert.deepEqual(
    [...new Set(ids)].sort(),
    [...ids].sort(),
    `${locale}: /pricing ships a duplicate id — ${ids.filter((id, i) => ids.indexOf(id) !== i).join(", ")}`,
  );

  for (const [audience, tab] of Object.entries(TABS)) {
    const option = group.options.find((o) => o.id === audience);
    const grid = option.blocks.find((b) => b.kind === "plans");
    assert(grid, `${audience}: no plan grid`);
    assert.equal(grid.plans.length, tab.plans.length, `${audience}: wrong number of plans`);
    assert(grid.billing, `${audience}: the monthly/yearly switch is part of v4.3`);
    assert(grid.labels, `${audience}: v4.3's cards carry "pick it if" and "move up when"`);

    /*
     * Blocks inside a panel carry no id, by the rule in content/pages/types.ts:
     * every panel is in the HTML, so an id in one is either a duplicate of its
     * opposite number or an anchor that scrolls into something hidden.
     */
    for (const block of option.blocks) {
      assert.equal(block.id, undefined, `${audience}: a block inside a panel must not carry an id`);
    }

    const recommended = grid.plans.filter((plan) => plan.recommended);
    assert.equal(recommended.length, 1, `${audience}: exactly one recommended plan`);
    assert.equal(
      recommended[0].id,
      `plan-${audience}-${tab.recommended}`,
      `${audience}: the deck recommends ${tab.recommended}`,
    );

    /*
     * A plan row's value has to fit the card it is in.
     *
     * The card lays a row out as a label that wraps beside a value that does
     * not — `shrink-0` on the `dd` in PlansBlock, so a figure like "2,500" can
     * never break across two lines. The cost is that a long value runs out of
     * the card instead, which is invisible in a diff, a type and a test: at
     * four columns "3 brands, 15 editors, extra $8" and "All 8, no badge, with
     * a password" were both clipped at the card's edge in both editions, and
     * found only by measuring the rendered page.
     *
     * Two caps, because one was not enough: a 22-character value still spilled
     * beside a 25-character label, since the label takes the width first. And
     * the caps are tighter at five columns than at three, because they are
     * physical — an 1100px container with five cards leaves about 145px of
     * content each, against about 265px at three. Measured in the browser at
     * 1440px. The detail a longer row wanted belongs in the comparison table,
     * which has a column for prose.
     */
    const [maxValue, maxPair] = grid.plans.length >= 5 ? [14, 30] : [24, 40];
    for (const plan of grid.plans) {
      for (const row of plan.rows) {
        const pair = row.label.length + row.value.length;
        assert(
          row.value.length <= maxValue && pair <= maxPair,
          `${plan.name} · "${row.label}" + "${row.value}" is ${row.value.length}/${pair} characters, over ${maxValue}/${maxPair} for a ${grid.plans.length}-card grid, and will overflow`,
        );
      }
    }

    for (const plan of grid.plans) {
      /*
       * Nothing here may take money.
       *
       * The plans on this page are not in billing. A CTA that carried a plan
       * into a checkout would send somebody to pay $12 for something priced
       * at $19 by the only system that can charge them.
       */
      if (OFF_SIGNUP[plan.id]) {
        assert.equal(
          plan.cta.href,
          OFF_SIGNUP[plan.id],
          `${plan.name}: a card that sells nothing goes to ${OFF_SIGNUP[plan.id]}`,
        );
        assert.equal(plan.annual, undefined, `${plan.name}: a card with no price has no yearly rate`);
      } else {
        const url = new URL(plan.cta.href, "https://markyos.test");
        assert.equal(url.pathname, "/start", `${plan.name}: a plan CTA must create a free account`);
        assert.equal(
          url.searchParams.get("type"),
          tab.type,
          `${plan.name}: a ${audience} plan signs up as ${tab.type}`,
        );
        assert.equal(url.searchParams.has("plan"), false, "Signup must not imply a paid purchase");
      }

      /* Every paid card shows its monthly price and its yearly rate, both from the deck. */
      if (plan.annual) {
        const id = plan.id.replace(`plan-${audience}-`, "");
        assert(DECK[id], `${plan.name}: ${id} is not a v5.2 plan`);
        assert.equal(plan.price, dollars(DECK[id].monthly), `${id}: monthly price drift`);
        assert.equal(plan.annual.price, dollars(DECK[id].yearly), `${id}: yearly rate drift`);
        assert(
          DECK[id].audience === audience || id === "studio",
          `${id} belongs on the ${DECK[id].audience} tab`,
        );
      }
    }

    /*
     * Every chooser chip leads somewhere that exists.
     *
     * The chooser reaches for a card by id at runtime, which means a renamed
     * plan or a mistyped audience is a chip that silently does nothing. Either
     * the target is a card in this same panel, or it is `tab:` an id the switch
     * actually has.
     */
    const chooser = option.blocks.find((b) => b.kind === "chooser");
    assert(chooser, `${audience}: v4.3 asks one question per tab`);
    const cards = new Set(grid.plans.map((plan) => plan.id));
    for (const { target } of chooser.options) {
      if (target.startsWith("tab:")) {
        assert(
          group.options.some((o) => o.id === target.slice(4)),
          `${audience}: the chooser sends a reader to a tab that does not exist (${target})`,
        );
      } else {
        assert(cards.has(target), `${audience}: the chooser points at a card that is not in this panel (${target})`);
      }
    }

    /*
     * One comparison table per tab, every row the width of its head.
     *
     * The limits in it come from the same tables the cards read, so this
     * asserts the shape — which is the part a hand-written row can still
     * break, and a five-column table is five chances to leave a cell out.
     */
    const tables = option.blocks.filter((b) => b.kind === "table");
    assert(tables.length >= 1, `${audience}: no comparison table`);
    assert.equal(
      tables[0].head.length,
      tab.tableCols,
      `${audience}: the comparison table has ${tables[0].head.length} columns, not ${tab.tableCols}`,
    );
    for (const table of tables) {
      for (const [i, row] of table.rows.entries()) {
        assert.equal(
          row.length,
          table.head.length,
          `${locale}: a ${audience} table's row ${i} has ${row.length} cells, not ${table.head.length}`,
        );
      }
    }
  }

  /* The offer: six plans, each at exactly half its monthly price. */
  const offer = page.blocks.find((b) => b.kind === "offer");
  assert(offer, `${locale}: the launch offer is missing`);
  assert.equal(offer.rows.length, LAUNCH_OFFER.plans.length);
  LAUNCH_OFFER.plans.forEach((id, i) => {
    assert.equal(offer.rows[i].was, dollars(DECK[id].monthly), `${id}: offer "was" is not the monthly price`);
    assert.equal(
      offer.rows[i].now,
      dollars((DECK[id].monthly * (100 - LAUNCH_OFFER.percent)) / 100),
      `${id}: offer "now" is not ${LAUNCH_OFFER.percent}% off the month`,
    );
  });
  assert(
    offer.rows.every((row) => row.label !== undefined),
    `${locale}: every offer row names its plan`,
  );
  assert.equal(offer.opens, LAUNCH_OFFER.opens);
  assert.equal(offer.closes, LAUNCH_OFFER.closes);

  /* The bar above the nav runs to the same instant as the block on the page. */
  const bar = currentLaunchOffer(locale);
  assert.equal(bar.closes, offer.closes, `${locale}: the bar and the offer disagree about the window`);

  /* The homepage teaser: the same three audiences, and no checkout either. */
  assert.deepEqual(
    serial(teaser.audiences.map((audience) => audience.id)),
    Object.keys(TABS),
    `${locale}: the homepage teaser and /pricing disagree about the audiences`,
  );
  for (const audience of teaser.audiences) {
    assert.equal(audience.plans.length, 3, `${audience.id}: three plans on the homepage, not the full set`);
    for (const plan of audience.plans) {
      assert.equal(new URL(plan.cta.href, "https://markyos.test").searchParams.has("plan"), false);
    }
  }
}

/* ── 4. The retired vocabulary ─────────────────────────────────────────────── */

/*
 * The term, not the word.
 *
 * v4.2 retired AI credits and keeps "billing credit" for the partner reward,
 * so banning «رصيد» outright would fail eight true sentences about the 20%. It
 * is the *priced* forms that cannot survive: a count of credits, a credit pack,
 * an AI-credit allowance. Each pattern below is a sentence that was on the site
 * on 21 November and contradicts /pricing today.
 *
 * It walks the content tree rather than the one page, because the pricing page
 * was never where these lived -- they were on the tone checker, the brief
 * analysis and the audience pages, which is exactly where a reader meets a
 * price without having gone looking for one.
 */
const RETIRED = [
  [/\d+\s*(?:وحدة|وحدات)\s+من\s+الرصيد/, "a count of credit units"],
  [/\d+\s*credits\b/i, "a count of credits"],
  [/رصيد الذكاء الاصطناعي/, "an AI-credit allowance"],
  [/\bAI credits\b/i, "AI credits"],
  [/\bcredit pack\b|حزمة أرصدة/i, "a credit pack"],
  [/تُخصم من الرصيد|يعمل الذكاء الاصطناعي برصيد/, "spending from a credit balance"],
  /*
   * And the prepaid client year, which v4.3 removes for as long as billing is
   * PayPal: it was one charge of $190 for a year of somebody else's
   * subscription, which is the one thing PayPal cannot be asked to do here. It
   * returns with Stripe, and the deck says so.
   */
  /* Stripe is not the processor during the PayPal months. */
  [/\bStripe\b/, "paying by card through Stripe, which v5.2 replaced with PayPal"],
  /*
   * And the nine cards v5.2 replaced.
   *
   * These are plan names, so they are matched as whole words in both scripts.
   * «الوكالة» and «الأعمال» are ordinary Arabic nouns, so they are matched only
   * in the quoted form the site uses for a plan name — «خطة الوكالة» and the
   * like — rather than banned outright.
   */
  [/\b(?:Solo|Pro|Agency|Starter|Brand plan|Team plan|Business plan)\b/, "a v4.3 plan name"],
  [/«(?:الفردية|الاحترافية|الوكالة|البداية|الأعمال)»/, "a v4.3 plan name"],
  [/تصريح المشروع|\bProject Pass\b/, "the Project Pass, which v5.2 removed"],
  [/\$(?:24|49|59|99|119)\b|\b(?:24|49|59|99|119) دولار/, "a v4.3 price"],
  [/خصم 50%|50% off/, "the 50% launch offer, which v5.2 reduced to 30%"],
  [/محرّرون ومشاهدون بلا حدود|[Uu]nlimited editors and viewers/, "unlimited editors, which v5.2 caps at five per brand"],
];

const contentFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".ts")) contentFiles.push(full);
  }
})(path.join(root, "content"));

/*
 * Comments are not copy.
 *
 * The catalogue's own header explains what "AI credits" was and why it is
 * gone, which is a sentence the rule would otherwise fail on -- the same trap
 * `check-design-rules.mjs` fell into with the comments explaining its physical
 * -properties rule. Blanked rather than removed, so the line numbers in a
 * failure still point at the right line.
 */
const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (line, lead) => lead + " ".repeat(line.length - lead.length));

for (const file of contentFiles) {
  const source = stripComments(fs.readFileSync(file, "utf8"));
  for (const [pattern, what] of RETIRED) {
    const hit = source.match(pattern);
    if (!hit) continue;
    const line = source.slice(0, hit.index).split("\n").length;
    assert.fail(
      `${path.relative(root, file).split(path.sep).join("/")}:${line} still states ${what} (“${hit[0]}”). ` +
        "Copy deck v5.2 sells four plans with a monthly limit per tool, billed through PayPal; “billing credit” stays, for the partner reward only.",
    );
  }
}

console.log(
  `Pricing: v5.2 catalogue, 4 plans across 3 tabs, 14 day trial, both locales and the homepage agree, every chooser chip resolves, yearly and launch and partner figures derived, no retired pricing across ${contentFiles.length} content files; ${comparisons} sibling billing contracts compared${comparisons < 2 ? " (missing sibling repositories skipped)" : ""}.`,
);
