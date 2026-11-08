import type { Collection, ContentSource } from "./adapter";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { payloadContent } from "./payload";

/*
 * The one place the content source is chosen.
 *
 * Pages import `content` and are unaware of which implementation answered —
 * which is what let the site ship against a stub before the CMS existed, and
 * what would let it move again if Payload were ever replaced.
 *
 * ── There used to be two sources, and that was the bug ────────────────────
 *
 * Until 8 Nov 2026 this file composed Payload with a second, code-level source
 * (`./seed.ts`, reading `content/editorial/ar.ts`) that filled in per slug
 * wherever the CMS had nothing. The intent was good: migrate the section an
 * article at a time instead of going from all-placeholder to one real post and
 * an empty page.
 *
 * What it actually produced was a site whose blog listed thirteen posts and an
 * admin panel that listed one. Thirty-one of the thirty-two pieces on the
 * resource pages were code. They could not be edited, categorised, reordered,
 * unpublished or translated from the panel; the dashboard's counts were honest
 * about the CMS and therefore wrong about the site; and deleting a post in the
 * panel would have silently resurrected its placeholder, because the fallback
 * had no way to tell "never written" from "deliberately removed".
 *
 * Those thirty-one were imported into Payload and then deleted from it, on
 * request, to make room for real writing. Both files are gone with them —
 * keeping a one-command way to recreate thirty-one deleted documents is the
 * same "the panel is not in control" failure in a slower form. `git log --
 * content/editorial/` has them if they are ever wanted back.
 *
 * So this is one source now. The CMS is the whole truth about what the
 * resource pages contain, and an empty section is an empty section.
 *
 * ── What happens when the CMS is unreachable ──────────────────────────────
 *
 * The index pages render their empty state. Every read in ./payload.ts goes
 * through `safeRead`, so a database problem degrades the blog to "nothing
 * published yet" rather than 500ing a route the homepage links to. That is a
 * worse failure than serving a placeholder and a better one than serving a
 * placeholder nobody can see in the panel.
 */

export const content: ContentSource = payloadContent;

export type {
  Article,
  ArticleSummary,
  Collection,
  ContentSource,
} from "./adapter";

/**
 * Which languages a given piece is actually written in.
 *
 * Every article route needs this for two things, and both were wrong the
 * moment real English writing arrived.
 *
 * `hreflang` has to name the editions that exist. The routes used to call
 * `localesFor()`, which answers "Arabic only" because that is true of the
 * page copy in `content/pages/`. It was true of the CMS as well while the
 * only editorial on the site was an Arabic placeholder seed, so nothing
 * showed. With a bilingual blog it would have declared the English edition
 * of forty pieces not to exist while serving them.
 *
 * `noindex` has the same root. It was `!(lang === DEFAULT_LOCALE)` — the
 * honest answer while an English article URL could only ever be the
 * "not translated yet" notice, and the wrong one as soon as that URL has an
 * article on it. A piece is indexable in the languages it was written in,
 * and the notice is what is served — and kept out of the index — in the
 * others.
 *
 * One query per locale, on routes that are statically rendered and
 * revalidated hourly, so this costs a build rather than a request.
 */
export async function articleLocales(
  collection: Collection,
  slug: string,
): Promise<Locale[]> {
  const found = await Promise.all(
    LOCALES.map(async (locale) =>
      (await content.getArticle({ locale, collection, slug })) ? locale : null,
    ),
  );
  return found.filter((locale): locale is Locale => locale !== null);
}
