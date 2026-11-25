import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/public/editorial";
import { getPreview } from "@/lib/content/django";
import { isLocale } from "@/lib/i18n/locales";
import { routeSlug } from "@/lib/pages/params";

/*
 * A CMS draft, opened from the editor's "Preview" button.
 *
 * The token is the only key: the platform signs it for one article and seven
 * days (POST /content/articles/<id>/preview/), and anyone holding the link can
 * read the draft, as with the Help Center's preview links. So the page is
 * rendered per request, never cached, and never indexed, and it renders
 * through the same ArticleView as the published page, which is the point.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ lang: string; token: string }>;
}) {
  const { lang, token } = await params;
  if (!isLocale(lang)) notFound();
  // The param arrives still percent-encoded (the signed token has colons).
  const preview = await getPreview(routeSlug(token), lang);
  if (!preview) notFound();
  return (
    <>
      <p role="status" className="mk-container mk-bidi pt-6 text-[length:var(--fs-ui)] text-[var(--text-muted)]">
        {lang === "ar"
          ? "معاينة مسودة. لا تظهر للزوار حتى تُنشر."
          : "Draft preview. Visitors can't see this until it's published."}
      </p>
      <ArticleView collection={preview.collection} locale={lang} post={preview.article} />
    </>
  );
}
