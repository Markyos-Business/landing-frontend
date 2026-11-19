import type { Collection, ContentSource } from "./adapter";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { djangoContent } from "./django";

/** Website content is edited and published in the app's Django CMS only. */
export const content: ContentSource = djangoContent;

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
