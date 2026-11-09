
/*
 * The editorial templates — blog, guides, help centre.
 *
 * ── Three indexes now, not one ────────────────────────────────────────────
 *
 * It used to be one index and one article template for all three, on the
 * argument that they are the same two pages with different words. That was
 * right while all three were lists of titles and wrong once they had real
 * content in them: a magazine, a shelf of downloads and a support centre are
 * three different things to arrive at, and a reader arrives at each with a
 * different question.
 *
 *   /blog    one piece to read now, then the rest to browse.  "What's new?"
 *   /guides  a shelf. Every item equal, nothing featured.     "What is there?"
 *   /help    search first, then categories.                   "Where's my answer?"
 *
 * What they still share — and what keeps them in one folder — is the card,
 * the cover, the meta line, the reading-time plural and the whole article
 * template. The shapes differ; the vocabulary does not. Labels and plurals are
 * in `./copy`, the cover and helpers in `./shared`, one file per view.
 *
 * ── Covers, with no photographs ───────────────────────────────────────────
 *
 * The references these are drawn from are photographic: a hero shot on the
 * article, a landscape on every card. This site has no imagery by design and
 * nothing in the content model carries a picture today — `heroImage` is
 * optional and no seeded piece sets one. So a cover is typeset instead of
 * photographed: the piece's own category, large, on one of four grounds mixed
 * from the site's single blue. It is a real object rather than a placeholder
 * frame, it cannot go stale, and the day a post arrives with a photograph
 * `Cover` renders that instead without anything else changing.
 */

export type { Collection } from "@/lib/content";
export { COLLECTIONS } from "./copy";
export { ArticleIndex } from "./ArticleIndex";
export { ArticleView } from "./ArticleView";
