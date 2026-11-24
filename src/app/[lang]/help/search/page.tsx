import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { searchHelp } from "@/lib/content/help";
import { isLocale } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui";
import { ContactFallback, HELP_COPY } from "@/components/public/help";
import { HelpSearch } from "@/components/public/help/HelpSearch";

/*
 * Help Center search: /help/search?q= (C5).
 *
 * The first results are rendered on the server, so the page works without
 * JavaScript and a link to a search opens with its answer; after that the
 * results follow the field as the reader types (HelpSearch). Never indexed:
 * a results page is not a page anyone should land on from a search engine.
 */
export const dynamic = "force-dynamic";

type Search = Promise<{ q?: string | string[]; category?: string | string[]; type?: string | string[] }>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const meta = HELP_COPY[lang].search.meta;
  return pageMetadata({ locale: lang, path: "/help/search", title: meta.title, description: meta.description, noindex: true });
}

export default async function Page({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Search }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const sp = await searchParams;
  const q = one(sp.q).slice(0, 200);
  const filters = { category: one(sp.category), type: one(sp.type) };
  const initial = q.trim() ? await searchHelp(lang, { q, ...filters }, await headers()) : null;
  const c = HELP_COPY[lang].search;

  return (
    <Section className="pt-[clamp(1.5rem,4vw,2.5rem)]">
      <h1 className="mk-h2 mk-bidi">{c.title}</h1>
      <div className="mt-6">
        <HelpSearch locale={lang} initialQuery={q} initialFilters={filters} initial={initial} />
      </div>
      <ContactFallback locale={lang} />
    </Section>
  );
}
