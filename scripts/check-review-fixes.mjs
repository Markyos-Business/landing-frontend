import assert from "node:assert/strict";
import { launch } from "./browser-lib.mjs";

const base = process.env.BASE_URL ?? "http://localhost:3001";
assert(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname), "Local review checks only");
const browser = await launch(process.env.PLAYWRIGHT_EXECUTABLE_PATH
  ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {});
try {
  const context = await browser.newContext({
    viewport: { width: 360, height: 900 }, hasTouch: true, isMobile: true, reducedMotion: "reduce",
  });
  let posts = 0;
  await context.route("**/*", route => {
    const request = route.request();
    if (request.method() !== "GET") {
      if (new URL(request.url()).pathname === "/api/contact") posts++;
      return route.abort();
    }
    return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url()).hostname)
      ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  for (const locale of ["ar", "en"]) {
    const prefix = locale === "ar" ? "" : "/en";
    await page.goto(`${base}${prefix}/contact`);
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelectorAll('[aria-invalid="true"]').length === 3);
    assert.equal(await page.locator('[name="name"]').evaluate(el => el === document.activeElement), true);
    assert(await page.locator('[role="status"]').innerText());
    for (const name of ["name", "email", "message"]) {
      const id = await page.locator(`[name="${name}"]`).getAttribute("aria-describedby");
      assert(id && await page.locator(`[id="${id}"]`).innerText());
    }
    await page.locator('[name="name"]').fill("Local review");
    await page.locator('[name="email"]').fill("invalid");
    await page.locator('[name="message"]').fill("A complete local validation test message.");
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelectorAll('[aria-invalid="true"]').length === 1);
    assert.equal(await page.locator('[name="email"]').evaluate(el => el === document.activeElement), true);
    await page.locator('[name="email"]').fill("review@example.invalid");
    await page.locator('[name="message"]').fill("short");
    await page.locator('button[type="submit"]').click();
    assert.equal(await page.locator('[name="message"]').getAttribute("aria-invalid"), "true");
    assert.equal(posts, 0, "Invalid forms must not send any contact requests");
    // Exercise a server-only validation rejection without sending any message.
    await page.route("**/api/contact", route => route.fulfill({
      status: 422, contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "invalid_input", fields: [{ path: "email" }] }),
    }));
    await page.locator('[name="message"]').fill("A complete local validation test message.");
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() => {
      const email = document.querySelector('[name="email"]');
      return email.getAttribute("aria-invalid") === "true" && !email.disabled && email === document.activeElement;
    });
    await page.unroute("**/api/contact");
    for (const link of await page.locator('footer nav a').all()) {
      assert((await link.boundingBox()).height >= 44, "Footer touch target below 44px");
    }
    await page.goto(`${base}${prefix}/solutions/guideline-sites`);
    assert((await page.locator('main').innerText()).includes(locale === "ar"
      ? "ربط النطاقات الخاصة غير متاح بعد" : "Custom domains are coming soon"));
    await page.goto(`${base}${prefix}/missing-review-page`);
    await page.locator(`html[dir="${locale === "ar" ? "rtl" : "ltr"}"]`).waitFor();
    assert.equal(await page.locator('html').getAttribute('dir'), locale === "ar" ? "rtl" : "ltr");
    assert((await page.locator('h1').innerText()).includes(locale === "ar" ? "غير موجودة" : "not here"));
    const image = await context.request.get(`${base}/brand/og-${locale}.png`);
    assert.equal(image.status(), 200);
    const png = await image.body();
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  }
  for (const path of ["start", "signup", "register", "login"]) {
    const response = await context.request.get(`${base}/en/${path}?type=studio`, { maxRedirects: 0 });
    assert.equal(response.status(), 307);
    const destination = new URL(response.headers().location);
    assert.equal(destination.hostname, "localhost");
    assert.equal(destination.pathname, path === "login" ? "/login" : "/signup");
    assert.equal(destination.searchParams.get("lang"), "en");
    assert.equal(destination.searchParams.get("type"), "studio");
  }
  console.log("Review fixes: bilingual required/email/message errors, focus, no invalid POSTs, footer touch targets, domain honesty, localized 404s, both OG images and four legacy auth redirects passed.");
} finally {
  await browser.close();
}
