import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3213";
assert(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname), "Use an isolated local server");
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHANNEL ? {channel: process.env.PLAYWRIGHT_CHANNEL} : {});
try {
  const context = await browser.newContext();
  for (const target of [{topic:"newsletter"}, {topic:"contact"}, {type:"studio"}, {type:"company"}]) {
    const response = await context.request.post(`${base}/api/waitlist`, {data:{email:"waitlist@markyos.test",locale:"en",...target}});
    assert.equal(response.status(),501,"valid signup must reach the explicitly unconnected state");
    assert.equal((await response.json()).error,"not_implemented");
  }
  for (const data of [{email:"invalid",topic:"newsletter"}, {email:"waitlist@markyos.test"}, {email:"waitlist@markyos.test",topic:"unknown"}]) {
    assert.equal((await context.request.post(`${base}/api/waitlist`,{data})).status(),422);
  }
  assert.equal((await context.request.post(`${base}/api/waitlist`,{data:Buffer.from("{"),headers:{"content-type":"application/json"}})).status(),400);
  assert.equal((await context.request.post(`${base}/api/waitlist`,{data:{email:"bot@markyos.test",topic:"newsletter",company_url:"https://bot.invalid"}})).status(),202,"honeypot is discarded");
  for (const locale of ["en","ar"]) {
    const page=await context.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto(`${base}/${locale}/contact`,{waitUntil:"networkidle"});
    const form=page.locator("form").filter({has:page.locator('input[name="email"]')});
    await form.locator('input[name="email"]').fill("visitor@markyos.test");
    const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/waitlist')&&r.request().method()==='POST');
    await form.locator('button[type="submit"]').click();
    const response=await responsePromise;assert.equal(response.status(),501);
    assert.deepEqual(response.request().postDataJSON(),{email:"visitor@markyos.test",topic:"contact",locale});
    const pending=locale==="ar"?"ولم يُحفظ أي طلب":"nothing was stored";
    await form.getByRole("status").filter({hasText:pending}).waitFor();
    assert.equal(await form.locator('button[type="submit"]').isEnabled(),true);assert.deepEqual(errors,[]);
    await page.close();
  }
  await context.close();console.log("Waitlist contract, validation, honeypot and bilingual pending form checks passed.");
} finally {await browser.close();}
