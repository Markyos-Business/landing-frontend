"use client";

import { usePathname } from "next/navigation";
import { localeHref, splitLocalePath } from "@/lib/i18n/href";

/** Keep backend outages recoverable without exposing server errors or inventing prices. */
export default function PageError({ retry }: { error: unknown; retry: () => void }) {
  const { locale } = splitLocalePath(usePathname() ?? "/");
  const copy = locale === "ar"
    ? {
        title: "تعذّر تحميل الصفحة",
        body: "بعض المعلومات غير متاحة الآن. يمكنك إعادة المحاولة أو إنشاء حساب مجاني.",
        retry: "إعادة المحاولة", signup: "إنشاء حساب", contact: "التواصل معنا",
      }
    : {
        title: "This page is temporarily unavailable",
        body: "Some information could not load. Try again or create a free account.",
        retry: "Try again", signup: "Create account", contact: "Contact us",
      };

  return (
    <section className="mk-container py-16" aria-labelledby="page-error-title">
      <h1 id="page-error-title" className="mk-h2 mk-bidi">{copy.title}</h1>
      <p className="mk-lead mk-bidi mt-5">{copy.body}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="button" className="mk-btn mk-solid" onClick={retry}>{copy.retry}</button>
        <a className="mk-btn mk-outline" href={localeHref(locale, "/start")}>{copy.signup}</a>
        <a className="mk-tap" href={localeHref(locale, "/contact")}>{copy.contact}</a>
      </div>
    </section>
  );
}
