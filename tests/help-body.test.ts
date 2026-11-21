/*
 * The Help Center article body (C4): headings, table of contents, images,
 * videos and Latin runs in Arabic.
 *
 *   npm run test:help
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { prepareHelpBody, readingMinutes, videoSource } from "../src/components/public/help/body.ts";

const opts = (locale: "en" | "ar") => ({
  locale,
  origin: "https://api.example.com",
  anchorLabel: (h: string) => `Link to ${h}`,
  videoTitle: (n: number) => `Video ${n}`,
});

test("headings get ids, anchors and a table of contents", () => {
  const { html, toc } = prepareHelpBody("<h2>Before you start</h2><p>x</p><h3>What you need</h3><h2>Before you start</h2>", opts("en"));
  assert.deepEqual(toc, [
    { id: "before-you-start", text: "Before you start", level: 2 },
    { id: "what-you-need", text: "What you need", level: 3 },
    { id: "before-you-start-2", text: "Before you start", level: 2 },
  ]);
  assert.match(html, /<h2 id="before-you-start">Before you start<a class="mk-anchor" href="#before-you-start" aria-label="Link to Before you start">/);
});

test("Arabic headings keep Arabic ids, without tashkeel", () => {
  const { toc } = prepareHelpBody("<h2>قبل البَدء</h2>", opts("ar"));
  assert.equal(toc[0].id, "قبل-البدء");
});

test("images are lazy, keep their alt, and get absolute URLs", () => {
  const { html } = prepareHelpBody('<img src="/media/a.png" alt="Library"><img src="https://cdn.x/b.png">', opts("en"));
  assert.match(html, /<img src="https:\/\/api.example.com\/media\/a.png" alt="Library" loading="lazy" decoding="async">/);
  assert.match(html, /<img src="https:\/\/cdn.x\/b.png" alt="" loading="lazy"/);
});

test("YouTube and Vimeo links become lazy players; other links stay links", () => {
  assert.equal(videoSource("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?hl=en");
  assert.equal(videoSource("https://youtu.be/dQw4w9WgXcQ"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?hl=en");
  assert.equal(videoSource("https://vimeo.com/76979871"), "https://player.vimeo.com/video/76979871?dnt=1");
  assert.equal(videoSource("https://example.com/v.mp4"), null);
  const { html } = prepareHelpBody(
    '<p><a class="video-embed" href="https://youtu.be/dQw4w9WgXcQ">https://youtu.be/dQw4w9WgXcQ</a></p><p><a class="video-embed" href="https://example.com/v">v</a></p>',
    opts("en"),
  );
  assert.match(html, /<iframe src="https:\/\/www.youtube-nocookie.com\/embed\/dQw4w9WgXcQ\?hl=en" title="Video 1" loading="lazy"/);
  assert.match(html, /<a class="video-embed" href="https:\/\/example.com\/v">v<\/a>/);
});

test("Latin runs in Arabic are isolated, but not in code, tags or entities", () => {
  const { html } = prepareHelpBody(
    '<p>افتح markyos.com واختر Start free ثم R&amp;D.</p><pre><code>npm run dev</code></pre><p><a href="https://x.com">رابط</a></p>',
    opts("ar"),
  );
  assert.match(html, /افتح <bdi>markyos.com<\/bdi> واختر <bdi>Start free<\/bdi> ثم <bdi>R<\/bdi>&amp;<bdi>D<\/bdi>\./);
  assert.match(html, /<pre><code>npm run dev<\/code><\/pre>/);
  assert.match(html, /<a href="https:\/\/x.com">رابط<\/a>/);
  assert.doesNotMatch(prepareHelpBody("<p>Open markyos.com</p>", opts("en")).html, /bdi/);
});

test("sentence punctuation stays outside the isolated run", () => {
  const { html } = prepareHelpBody("<p>تتبع الترتيب نفسه في Markyos.</p>", opts("ar"));
  assert.match(html, /في <bdi>Markyos<\/bdi>\.<\/p>/);
});

test("reading time is words / 200, at least a minute", () => {
  assert.equal(readingMinutes(50), 1);
  assert.equal(readingMinutes(1000), 5);
});
