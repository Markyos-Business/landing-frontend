import assert from "node:assert/strict";
import { request } from "playwright";

// Use an isolated, initialized CMS. Never point this synthetic-write check at production.
const baseURL = process.env.CMS_TEST_URL;
assert(baseURL && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseURL).hostname), "Set CMS_TEST_URL to the isolated local CMS");
const email = process.env.CMS_TEST_EMAIL;
const password = process.env.CMS_TEST_PASSWORD;
assert(email && password, "Set the isolated admin's CMS_TEST_EMAIL and CMS_TEST_PASSWORD");
const admin = await request.newContext({ baseURL });
const anonymous = await request.newContext({ baseURL });
const cleanup = [];
const contexts = [];
const sections = ["posts", "guides", "helpArticles", "comparisons", "updates"];
const stamp = `permissions-${Date.now()}`;
try {
  assert((await admin.post("/api/users/login", { data: { email, password } })).ok(), "admin login");
  for (const role of ["editor", "viewer"]) {
    const userEmail = `${stamp}-${role}@cms.markyos.test`;
    const created = await admin.post("/api/users", { data: { email: userEmail, password, name: role, role, sections } });
    assert.equal(created.status(), 201);
    const user = (await created.json()).doc;
    cleanup.push(`/api/users/${user.id}`);
    const actor = await request.newContext({ baseURL });
    contexts.push(actor);
    assert((await actor.post("/api/users/login", { data: { email: userEmail, password } })).ok());
    const users = (await (await actor.get("/api/users")).json()).docs;
    assert.deepEqual(users.map((u) => u.id), [user.id], "users are self-only");
    await actor.patch(`/api/users/${user.id}`, { data: { role: "admin" } });
    assert.equal((await (await admin.get(`/api/users/${user.id}`)).json()).role, role, "self escalation blocked");
    for (const section of sections) {
      const created = await actor.post(`/api/${section}`, { data: { title: `${stamp} ${role}`, slug: `${stamp}-${role}`, _status: "published" } });
      if (role === "viewer") {
        assert.equal(created.status(), 403, `${section}: viewer cannot create`);
        continue;
      }
      assert.equal(created.status(), 201, `${section}: editor can create a draft`);
      const doc = (await created.json()).doc;
      const url = `/api/${section}/${doc.id}`;
      cleanup.push(url);
      assert.equal((await anonymous.get(url)).status(), 404, `${section}: editor create cannot publish`);
      await actor.patch(url, { data: { _status: "published" } });
      assert.equal((await anonymous.get(url)).status(), 404, `${section}: editor update cannot publish`);
      assert.equal((await actor.delete(url)).status(), 403, `${section}: editor cannot delete`);
      assert((await admin.patch(url, { data: { _status: "published" } })).ok(), `${section}: admin publish`);
      assert.equal((await anonymous.get(url)).status(), 200, `${section}: published content is public`);
      console.log(`${section}: editor create/update publication denied; admin publication allowed`);
    }
  }
  console.log("CMS permissions passed across all five editorial collections and both restricted roles.");
} finally {
  for (const url of cleanup.reverse()) assert((await admin.delete(url)).ok(), `cleanup ${url}`);
  await Promise.all([...contexts, admin, anonymous].map((ctx) => ctx.dispose()));
}
