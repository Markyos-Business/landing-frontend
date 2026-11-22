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
  AGENCY_PARTNER_SHARE,
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
 * The eight paid plans, read out of the page rather than imported.
 *
 * Importing the price table would prove the page agrees with the table; this
 * proves the page agrees with the deck. The figures below are v4.3's, typed
 * here once, in the only place in the repository where typing them is the
 * point.
 */
const DECK = {
  solo: { monthly: 12, yearly: 10, inOffer: false, audience: "freelancers" },
  pro: { monthly: 24, yearly: 19, inOffer: true, audience: "freelancers" },
  studio: { monthly: 59, yearly: 49, inOffer: true, audience: "studios" },
  agency: { monthly: 119, yearly: 99, inOffer: true, audience: "studios" },
  starter: { monthly: 12, yearly: 10, inOffer: false, audience: "companies" },
  brand: { monthly: 24, yearly: 19, inOffer: true, audience: "companies" },
  team: { monthly: 59, yearly: 49, inOffer: true, audience: "companies" },
  business: { monthly: 119, yearly: 99, inOffer: true, audience: "companies" },
};

/* Free, then the paid plans in the order each tab shows them. */
const TABS = {
  freelancers: { plans: ["free", "solo", "pro"], recommended: "pro", type: "freelancer" },
  studios: { plans: ["free", "studio", "agency"], recommended: "studio", type: "studio" },
  companies: {
    plans: ["free", "starter", "brand", "team", "business"],
    recommended: "brand",
    type: "company",
  },
};

assert.equal(LOWEST_PAID_MONTHLY, 12, "v4.3 puts the lowest paid price at $12 (Solo and Starter)");
assert.deepEqual(
  serial(EXTRAS),
  { projectPass: 19, brainPack: 12, mockupPack: 12, seat: 8, enterpriseFrom: 299 },
  "the one-time purchases moved away from v4.3",
);
assert.equal(PARTNER_SHARE, 20);
assert.equal(AGENCY_PARTNER_SHARE, 25, "v4.3 raises the partner reward on Agency alone");
assert.equal(LAUNCH_OFFER.percent, 50);
assert.equal(LAUNCH_OFFER.months, 3, "the offer is three monthly cycles, not a year");
assert.deepEqual(
  [...LAUNCH_OFFER.plans].sort(),
  Object.keys(DECK).filter((id) => DECK[id].inOffer).sort(),
  "the offer covers the six plans above $12 — and never Solo or Starter",
);
assert(Date.parse(LAUNCH_OFFER.closes) > Date.parse(LAUNCH_OFFER.opens), "the offer closes before it opens");

/*
 * "Save about 20%" has to stay about true.
 *
 * The yearly rates are a second list price, not a computed discount: $24 a
 * month is $19 yearly, which is 20.8%, and $119 is $99, which is 16.8%. A band
 * is the honest assertion. It fails the day somebody sets a yearly rate that
 * makes the toggle's own label a lie.
 */
for (const [id, plan] of Object.entries(DECK)) {
  const saving = ((plan.monthly - plan.yearly) / plan.monthly) * 100;
  assert(
    saving >= 15 && saving <= 25,
    `${id}: yearly saves ${saving.toFixed(1)}%, which the toggle cannot call "about 20%"`,
  );
}

/* The partner reward, derived from the plan it is a share of. */
assert.equal(partnerCredit(5), dollars((5 * DECK.brand.monthly * PARTNER_SHARE) / 100));
assert.equal(partnerCredit(12), dollars((12 * DECK.brand.monthly * PARTNER_SHARE) / 100));
assert.equal(partnerCredit(1, "starter"), "$2.40", "a cent figure keeps both its digits");

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
  freelancers: {
    reruns: { free: null, solo: 5, pro: 15 },
    quickChecks: { free: 10, solo: 50, pro: 100 },
    writingTasks: { free: 5, solo: 20, pro: 50 },
    assistant: { free: null, solo: 15, pro: 40 },
    mockups: { free: 3, solo: 10, pro: 25 },
  },
  studios: {
    reruns: { free: null, studio: 30, agency: 60 },
    quickChecks: { free: 10, studio: 300, agency: 800 },
    writingTasks: { free: 5, studio: 150, agency: 300 },
    assistant: { free: null, studio: 100, agency: 200 },
    mockups: { free: 3, studio: 60, agency: 120 },
  },
  companies: {
    reports: { free: null, starter: 2, brand: 3, team: 10, business: 20 },
    quickChecks: { free: 25, starter: 300, brand: 1000, team: 2500, business: 5000 },
    askTheBrand: { free: 20, starter: 150, brand: 500, team: 1500, business: 3000 },
    writingTasks: { free: 5, starter: 25, brand: 60, team: 150, business: 300 },
    assistant: { free: null, starter: 10, brand: 30, team: 80, business: 150 },
    mockups: { free: 3, starter: 10, brand: 20, team: 45, business: 90 },
  },
};
assert.deepEqual(serial(AI_LIMITS), LIMITS, "the AI limits moved away from copy deck v4.3");

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
  assert.equal(group.param, "for", "v4.3 asks for a shareable ?for= link");
  assert.deepEqual(
    /* `serial`, because the catalogue is evaluated in a `vm` context: its
       arrays have that realm's prototype and `deepStrictEqual` compares
       prototypes, so two identical lists of ids would otherwise fail. */
    serial(group.options.map((option) => option.id)),
    Object.keys(TABS),
    `${locale}: the three tabs are freelancers, studios and agencies, and companies`,
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
      const url = new URL(plan.cta.href, "https://markyos.test");
      assert.equal(url.pathname, "/start", `${plan.name}: a plan CTA must create a free account`);
      assert.equal(
        url.searchParams.get("type"),
        tab.type,
        `${plan.name}: a ${audience} plan signs up as ${tab.type}`,
      );
      assert.equal(url.searchParams.has("plan"), false, "Signup must not imply a paid purchase");

      /* Every paid card shows its monthly price and its yearly rate, both from the deck. */
      if (plan.annual) {
        const id = plan.id.replace(`plan-${audience}-`, "");
        assert(DECK[id], `${plan.name}: ${id} is not a v4.3 plan`);
        assert.equal(plan.price, dollars(DECK[id].monthly), `${id}: monthly price drift`);
        assert.equal(plan.annual.price, dollars(DECK[id].yearly), `${id}: yearly rate drift`);
        assert.equal(DECK[id].audience, audience, `${id} belongs on the ${DECK[id].audience} tab`);
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
    assert.equal(tables.length, 1, `${audience}: one comparison table`);
    const [table] = tables;
    assert.equal(table.head.length, 1 + tab.plans.length, `${audience}: a column per plan, plus the limit`);
    for (const [i, row] of table.rows.entries()) {
      assert.equal(
        row.length,
        table.head.length,
        `${locale}: the ${audience} table's row ${i} has ${row.length} cells, not ${table.head.length}`,
      );
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
  [/\$190\b|190 دولار/, "the prepaid client year, which v4.3 holds until billing moves to Stripe"],
  /* Stripe is not the processor during the PayPal months. */
  [/\bStripe\b/, "paying by card through Stripe, which v4.3 replaced with PayPal"],
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
        "Copy deck v4.3 sells eleven plans with a monthly limit per tool, billed through PayPal; “billing credit” stays, for the partner reward only.",
    );
  }
}

console.log(
  `Pricing: v4.3 catalogue, 11 plans across 3 audiences, both locales and the homepage agree, every chooser chip resolves, launch and partner figures derived, no retired pricing across ${contentFiles.length} content files; ${comparisons} sibling billing contracts compared${comparisons < 2 ? " (missing sibling repositories skipped)" : ""}.`,
);
