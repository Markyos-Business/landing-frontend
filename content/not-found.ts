import type { Locale } from "@/lib/i18n/locales";

/*
 * The 404 page's words, shared by the localized 404 (src/app/[lang]/not-found.tsx,
 * shown when a known route calls notFound()) and the global one
 * (src/app/global-not-found.tsx, shown when a URL matches no route at all).
 * Copy from docs/copy/pages_ar_4_signup_legal.md page 31.
 */

export const NOT_FOUND_COPY: Record<
  Locale,
  { title: string; body: string; home: string; links: { label: string; href: string }[] }
> = {
  ar: {
    title: "هذه الصفحة غير موجودة.",
    body: "ربما تغيّر الرابط، أو لم تُنشر الصفحة بعد. لكن العلامة كلها هنا.",
    home: "العودة إلى الرئيسية",
    links: [
      { label: "الحلول", href: "/solutions" },
      { label: "الأسعار", href: "/pricing" },
      { label: "مركز المساعدة", href: "/help" },
    ],
  },
  en: {
    title: "That page is not here.",
    body: "The link may be old, or the page may not be written yet.",
    home: "Back to the homepage",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Pricing", href: "/pricing" },
      { label: "Help Center", href: "/help" },
    ],
  },
};
