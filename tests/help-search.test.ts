/*
 * Help Center search on the website (C5): the same normalisation as the
 * platform, and highlighting that marks matches in the text as written.
 *
 *   npm run test:help
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { highlight, normalise, terms } from "../src/components/public/help/fold.ts";

test("normalises like the platform", () => {
  for (const [a, b] of [
    ["تسجيل الدّخول", "تسجيل الدخول"],
    ["إنشاء", "انشاء"],
    ["مكتبة", "مكتبه"],
    ["مستوى", "مستوي"],
    ["الـــدخول", "الدخول"],
    ["رمز ٢٠٢٦", "رمز 2026"],
    ["Sign-In", "sign in"],
  ]) {
    assert.equal(normalise(a), normalise(b), `${a} / ${b}`);
  }
});

test("marks a match in the text as written, tashkeel included", () => {
  const parts = highlight("بعد تسجيل الدُّخول يصلك رمز", terms("الدخول"));
  assert.deepEqual(
    parts.filter((p) => p.hit).map((p) => p.text),
    ["الدُّخول"],
  );
  assert.equal(parts.map((p) => p.text).join(""), "بعد تسجيل الدُّخول يصلك رمز");
});

test("marks every word, case-insensitively, without overlaps", () => {
  const parts = highlight("Invite people to your Studio", terms("studio invite"));
  assert.deepEqual(parts.filter((p) => p.hit).map((p) => p.text), ["Invite", "Studio"]);
  assert.deepEqual(highlight("Nothing here", terms("x y")), [{ text: "Nothing here", hit: false }]);
});

test("one form per letter: a query with أ finds ا", () => {
  const parts = highlight("انشاء الاستوديو", terms("إنشاء"));
  assert.deepEqual(parts.filter((p) => p.hit).map((p) => p.text), ["انشاء"]);
});
