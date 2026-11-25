import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import { getHelpHome, type HelpHome as HomeData } from "@/lib/content/help";
import { HELP_COPY, HelpHome } from "@/components/public/help";

/*
 * The Help Center home, from the platform's help API (C1).
 *
 * The CMS "help" collection used to stand in while the Help Center was empty.
 * It is retired on the site (review LR-21, 25 Nov 2026): one source for
 * /help, so a CMS slug can never shadow a Help Center topic.
 *
 * When the API can't be reached on a revalidation the page throws, so Next
 * keeps serving the last good page (or the locale error boundary). During a
 * build without a backend it renders empty rather than failing the deploy.
 */
export const revalidate = 3600;

const PATH = "/help";
const EMPTY: HomeData = { categories: [], popular: [], gettingStarted: [], recent: [] };
const building = () => process.env.NEXT_PHASE === "phase-production-build";

async function home(lang: "ar" | "en"): Promise<HomeData> {
  const data = await getHelpHome(lang);
  if (data) return data;
  if (building()) return EMPTY;
  throw new Error("Help Center unavailable");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const meta = HELP_COPY[lang].meta;
  const data = await home(lang);
  return pageMetadata({
    locale: lang,
    path: PATH,
    title: meta.title,
    description: meta.description,
    noindex: !data.categories.some((c) => c.articleCount > 0),
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <HelpHome locale={lang} data={await home(lang)} />;
}
