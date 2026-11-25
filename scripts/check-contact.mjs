import assert from "node:assert/strict";
import { chromium } from "playwright";

/*
 * The contact form, end to end.
 *
 * ── Why this is not part of `check:live` ───────────────────────────────────
 *
 * It POSTs, and both things it POSTs into are stateful: the platform's
 * per-visitor rate limiter, and the platform itself, which stores every
 * message and emails it (console only when the platform runs with E2E=1).
 * A gate that runs in a loop beside five others would spend somebody
 * else's send quota and would start failing on its own second run. So it
 * stands alone, like `check:waitlist`, and is run against an isolated build
 * when this contract changes.
 *
 * The localhost assertion below is load-bearing for the same reason: pointed
 * at production this script would put test messages in the real inbox.
 *
 * Each API case sends its own `x-forwarded-for`, so each gets its own rate
 * limit bucket and the cases cannot starve each other. That header is
 * spoofable locally and overwritten by the proxy in production; the site
 * turns it into the anonymous visitor hash (`siteHeaders` in src/lib/visitor.ts).
 */

const base = process.env.BASE_URL ?? "http://localhost:3213";
assert(
  ["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname),
  "Use an isolated local server: this script posts messages and can send real email",
);

/** Whether the platform stored the message (202) or was unreachable (503); set by the first valid post. */
let configured = false;

/*
 * A fresh set of rate-limit buckets for every run.
 *
 * The limiter's window is ten minutes, and it does not care that the sender
 * was a test: with fixed addresses, running this gate three times in a row
 * would exhaust its own budget and the third run would fail on a 429 it did
 * not ask for. A random prefix per run means each case starts from zero
 * however often this is run, which is what a gate has to do to be worth
 * having. `.9` is the page's bucket, set on the context below so the browser's
 * own submits are counted separately from the API cases.
 */
const octet = () => Math.floor(Math.random() * 254) + 1;
const run = `10.${octet()}.${octet()}`;
const ip = (last) => `${run}.${last}`;

const valid = {
  name: "Contact Check",
  email: "visitor@markyos.test",
  topic: "sales",
  message: "This is an automated check of the contact form contract.",
};

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {},
);
try {
  const context = await browser.newContext({
    /*
     * The page's own bucket. A browser talking to localhost sends no
     * `x-forwarded-for`, so without this every run's two page submits would
     * share one bucket with every other run's.
     */
    extraHTTPHeaders: { "x-forwarded-for": ip(9) },
  });
  const post = (data, ip) =>
    context.request.post(`${base}/api/contact`, {
      headers: { "x-forwarded-for": ip, "content-type": "application/json" },
      data,
    });

  /* ── Malformed body ─────────────────────────────────────────────────────── */
  assert.equal(
    (await post(Buffer.from("{"), ip(1))).status(),
    400,
    "a body that is not JSON is a 400",
  );

  /* ── Validation ─────────────────────────────────────────────────────────── */
  const invalid = [
    [{ ...valid, email: "not-an-address" }, "an unparseable address"],
    [{ ...valid, name: "A" }, "a one-character name"],
    [{ ...valid, message: "too short" }, "a message under the floor"],
    [{ ...valid, topic: "marketing" }, "a topic that is not one of ours"],
    [{ ...valid, message: "x".repeat(4001) }, "a message over the ceiling"],
    [{ name: valid.name, email: valid.email }, "a body with no message or topic"],
    [{ ...valid, who: "agency" }, "a `who` that is not one of ours"],
    [{ ...valid, replyLanguage: "fr" }, "a reply language the site does not have"],
    [{ ...valid, phone: "1".repeat(33) }, "a phone over its ceiling"],
    [{ ...valid, company: "c".repeat(121) }, "a company name over its ceiling"],
    [{ ...valid, country: "c".repeat(61) }, "a country over its ceiling"],
  ];
  for (const [data, what] of invalid) {
    const response = await post(data, ip(2));
    assert.equal(response.status(), 422, `${what} must be rejected`);
    const payload = await response.json();
    assert.equal(payload.error, "invalid_input");
    assert(Array.isArray(payload.fields) && payload.fields.length > 0, "422 names its fields");
    /* The values a visitor typed must never come back in the response. */
    assert(
      !JSON.stringify(payload).includes(valid.email),
      "a validation error must not echo the submitted address",
    );
  }

  /* ── The optional fields are optional, and blanks are not values ────────── */
  const bare = await post(valid, ip(6));
  assert(
    [202, 503].includes(bare.status()),
    "a message with none of the five optional fields must reach the send decision",
  );
  const blanks = await post(
    { ...valid, phone: "", company: "", country: "", who: undefined },
    ip(7),
  );
  assert(
    [202, 503].includes(blanks.status()),
    "an untouched optional field posts as an empty string and must be accepted, not rejected",
  );

  /* ── Honeypot ───────────────────────────────────────────────────────────── */
  const trapped = await post({ ...valid, company_url: "https://bot.invalid" }, ip(3));
  assert.equal(trapped.status(), 202, "a filled honeypot is accepted and discarded");
  assert.equal((await trapped.json()).ok, true, "a bot is told it worked");

  /* ── The send path ──────────────────────────────────────────────────────── */
  const sent = await post(valid, ip(4));
  configured = sent.status() === 202;
  if (configured) {
    assert.equal((await sent.json()).ok, true, "a stored message is reported ok");
  } else {
    const payload = await sent.json();
    assert.equal(sent.status(), 503, "when the platform doesn't take it the route says so, not 2xx");
    assert.equal(payload.error, "unavailable");
    assert.equal(payload.ok, false, "an unsent message is never reported ok");
    assert(payload.inbox?.includes("@"), "the 503 carries the address to write to instead");
  }

  /* ── Rate limit ─────────────────────────────────────────────────────────── */
  let limited = false;
  for (let i = 0; i < 8 && !limited; i += 1) {
    limited = (await post(valid, ip(5))).status() === 429;
  }
  assert(limited, "a burst from one address is eventually rate limited");

  /* ── The form itself, in both editions ──────────────────────────────────── */
  for (const locale of ["ar", "en"]) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    /* `?topic=security` is one of the six links already in the site's copy. */
    await page.goto(`${base}/${locale}/contact?topic=security`, { waitUntil: "networkidle" });

    const form = page.locator("form").filter({ has: page.locator('textarea[name="message"]') });
    await form.waitFor();

    /* Every field the contract names is on the page. */
    for (const selector of [
      'input[name="name"]',
      'input[name="email"]',
      'input[name="phone"]',
      'input[name="company"]',
      'input[name="country"]',
      'select[name="who"]',
      'select[name="topic"]',
      'select[name="replyLanguage"]',
      'textarea[name="message"]',
    ]) {
      assert.equal(await form.locator(selector).count(), 1, `${locale}: ${selector} is present`);
    }

    /*
     * The honeypot is present, hidden from people, and out of the tab order.
     *
     * Not asserted with `isVisible()`: Playwright calls an element visible
     * whenever it has a non-empty bounding box and is not `visibility: hidden`,
     * and this field is hidden by being a clipped one-pixel box — which has a
     * box, and so passes that test. So the mechanism is checked instead: the
     * wrapper is clipped to a pixel, it clips its overflow, and it is out of
     * the accessibility tree.
     */
    const honeypot = form.locator('input[name="company_url"]');
    assert.equal(await honeypot.count(), 1, `${locale}: the honeypot is in the form`);
    const trap = await honeypot.evaluate((element) => {
      const wrapper = element.closest(".mk-honeypot");
      if (!wrapper) return { wrapped: false };
      const box = wrapper.getBoundingClientRect();
      return {
        wrapped: true,
        ariaHidden: wrapper.getAttribute("aria-hidden"),
        clipped: box.width <= 1 && box.height <= 1,
        overflow: getComputedStyle(wrapper).overflow,
      };
    });
    assert(trap.wrapped, `${locale}: the honeypot sits inside .mk-honeypot`);
    assert(trap.clipped, `${locale}: the honeypot is clipped to a pixel, so nobody sees it`);
    assert.equal(trap.overflow, "hidden", `${locale}: the honeypot clips its overflow`);
    assert.equal(
      trap.ariaHidden,
      "true",
      `${locale}: the honeypot is out of the accessibility tree`,
    );
    assert.equal(
      await honeypot.getAttribute("tabindex"),
      "-1",
      `${locale}: the honeypot is out of the tab order`,
    );

    /* The URL's topic won, over the block's default. */
    assert.equal(
      await form.locator('select[name="topic"]').inputValue(),
      "security",
      `${locale}: ?topic= preselects the topic`,
    );

    /* Every control has an accessible name — the labels are real labels. */
    for (const [selector, field] of [
      ['input[name="name"]', "name"],
      ['input[name="email"]', "email"],
      ['input[name="phone"]', "phone"],
      ['input[name="company"]', "company"],
      ['input[name="country"]', "country"],
      ['select[name="who"]', "who"],
      ['select[name="replyLanguage"]', "reply language"],
      ['textarea[name="message"]', "message"],
    ]) {
      const named = await form.locator(selector).evaluate((element) => {
        const labelled = element.labels?.[0]?.textContent?.trim();
        return Boolean(labelled || element.getAttribute("aria-label"));
      });
      assert(named, `${locale}: the ${field} field has a label`);
    }

    /* An address and a phone number read left to right on an Arabic page. */
    for (const field of ["email", "phone"]) {
      assert.equal(
        await form.locator(`input[name="${field}"]`).getAttribute("dir"),
        "ltr",
        `${locale}: the ${field} field is explicitly ltr`,
      );
    }

    /*
     * Every select wears the site's chevron, not the browser's.
     *
     * The native arrow was the one piece of interface here the browser drew:
     * a different glyph from every other chevron on the site, laid out inside
     * the field's own padding, hard against the rounded corner — and on the
     * Arabic edition it landed on the corner the page ends at, reading as a
     * caret adrift in the gutter. All four facts below are the fix, and each
     * of them is silent when it breaks: the arrow would simply be in the
     * wrong place on one edition, which is exactly how it got there.
     */
    for (const name of ["who", "topic", "replyLanguage"]) {
      const control = form.locator(`select[name="${name}"]`);
      /*
       * `elementFromPoint` reads viewport coordinates, so the control has to
       * be on screen and clear of the fixed header before it means anything.
       * `behavior: "instant"` because a smooth scroll would still be moving
       * when the next line measures.
       */
      await control.evaluate((select) =>
        select.scrollIntoView({ block: "center", behavior: "instant" }),
      );
      const chevron = await control.evaluate((select) => {
        const arrow = select.parentElement.querySelector(".mk-select-arrow");
        if (!arrow) return { arrow: false };
        const field = select.getBoundingClientRect();
        const glyph = arrow.getBoundingClientRect();
        const rtl = getComputedStyle(select).direction === "rtl";
        return {
          arrow: true,
          /* The browser's own arrow is off, or there would be two. */
          appearance: getComputedStyle(select).appearance,
          /* Distance from the glyph to the field's inline-end edge. */
          gap: Math.round(rtl ? glyph.left - field.left : field.right - glyph.right),
          /* Off-centre by how many pixels, vertically. */
          offset: Math.round(glyph.top + glyph.height / 2 - (field.top + field.height / 2)),
          /*
           * A click on the chevron has to fall through to the select. It is a
           * picture of the control, not a second target, and `pointer-events`
           * is the only thing making that true.
           */
          events: getComputedStyle(arrow).pointerEvents,
          reaches:
            document.elementFromPoint(glyph.left + glyph.width / 2, glyph.top + glyph.height / 2) ===
            select,
        };
      });
      assert(chevron.arrow, `${locale}: "${name}" has the site's own chevron beside it`);
      assert.equal(
        chevron.appearance,
        "none",
        `${locale}: "${name}" has the browser's native arrow turned off`,
      );
      assert.equal(
        chevron.gap,
        14,
        `${locale}: "${name}"'s chevron sits 14px inside the field's inline-end edge`,
      );
      assert.equal(chevron.offset, 0, `${locale}: "${name}"'s chevron is vertically centred`);
      assert.equal(
        chevron.events,
        "none",
        `${locale}: "${name}"'s chevron takes no pointer events of its own`,
      );
      assert(chevron.reaches, `${locale}: a click on "${name}"'s chevron reaches the select`);
    }

    /* `who` opens unanswered rather than claiming its first option. */
    assert.equal(
      await form.locator('select[name="who"]').inputValue(),
      "",
      `${locale}: an untouched "who you are" is empty, not the first option`,
    );

    /* The reply language opens on the edition being read. */
    assert.equal(
      await form.locator('select[name="replyLanguage"]').inputValue(),
      locale,
      `${locale}: the reply language defaults to the edition`,
    );

    /*
     * The five optional fields carry a visible "optional" marker, and the
     * four required ones do not. That is the form's whole convention, and it
     * is the kind of thing that rots silently when a field is added later.
     */
    for (const [name, wanted] of [
      ["name", false],
      ["email", false],
      ["topic", false],
      ["message", false],
      ["phone", true],
      ["company", true],
      ["country", true],
      ["who", true],
    ]) {
      const marked = await form
        .locator(`[name="${name}"]`)
        .evaluate((element) => Boolean(element.closest("label")?.querySelector(".mk-field-hint")));
      assert.equal(marked, wanted, `${locale}: "${name}" optional marker should be ${wanted}`);
    }

    await form.locator('input[name="name"]').fill("Contact Check");
    await form.locator('input[name="email"]').fill("visitor@markyos.test");
    await form.locator('textarea[name="message"]').fill("A message typed by the contact check.");

    /*
     * English fills every optional field as well, Arabic leaves them all
     * alone — so one run covers both shapes of the request: the full nine and
     * the bare four, with the blanks stripped rather than posted as "".
     */
    const full = locale === "en";
    if (full) {
      await form.locator('input[name="phone"]').fill("+966 50 000 0000");
      await form.locator('input[name="company"]').fill("Contact Check Studio");
      await form.locator('input[name="country"]').fill("Saudi Arabia");
      await form.locator('select[name="who"]').selectOption("studio");
      await form.locator('select[name="replyLanguage"]').selectOption("ar");
    }

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/contact") && response.request().method() === "POST",
    );
    await form.locator('button[type="submit"]').click();
    const response = await responsePromise;

    /* Exactly the contract, with the topic from the URL and the page's locale. */
    assert.deepEqual(
      response.request().postDataJSON(),
      full
        ? {
            name: "Contact Check",
            email: "visitor@markyos.test",
            topic: "security",
            message: "A message typed by the contact check.",
            phone: "+966 50 000 0000",
            company: "Contact Check Studio",
            country: "Saudi Arabia",
            who: "studio",
            replyLanguage: "ar",
            locale,
          }
        : {
            /*
             * No `phone`, `company`, `country` or `who` keys at all. An
             * untouched optional field must not travel as `""` — that is what
             * puts an empty `Phone:` line in the inbox.
             */
            name: "Contact Check",
            email: "visitor@markyos.test",
            topic: "security",
            message: "A message typed by the contact check.",
            replyLanguage: locale,
            locale,
          },
    );

    if (configured) {
      assert.equal(response.status(), 202);
      const confirmed = locale === "ar" ? "وصلت رسالتك" : "Your message arrived";
      await form.getByRole("status").filter({ hasText: confirmed }).waitFor();
    } else {
      assert.equal(response.status(), 503);
      /*
       * The honest line, and the address as a link. A form that cannot send
       * has one useful thing to offer and this is the check that it offers it.
       */
      const undelivered = locale === "ar" ? "لم تُرسل رسالتك" : "was not sent";
      await form.getByRole("status").filter({ hasText: undelivered }).waitFor();
      assert.equal(
        await form.locator('[role="status"] a[href^="mailto:"]').count(),
        1,
        `${locale}: an undelivered message offers the inbox as a mailto link`,
      );
      /* And nothing anybody typed was thrown away. */
      assert.equal(
        await form.locator('textarea[name="message"]').inputValue(),
        "A message typed by the contact check.",
        `${locale}: a failed send keeps the message in the field`,
      );
    }

    assert.equal(await form.locator('button[type="submit"]').isEnabled(), true);
    assert.deepEqual(errors, [], `${locale}: no page errors`);
    await page.close();
  }

  await context.close();
  console.log(
    configured
      ? "Contact form: nine fields, chevrons, validation, honeypot, rate limit, stored by the platform and both editions passed."
      : "Contact form: nine fields, chevrons, validation, honeypot, rate limit, honest 503 and both editions passed.",
  );
} finally {
  await browser.close();
}
