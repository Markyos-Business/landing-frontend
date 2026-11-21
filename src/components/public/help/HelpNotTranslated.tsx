import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Section } from "@/components/ui";
import { HELP_COPY } from "./copy";

/*
 * An article opened in a language it isn't published in — what the header's
 * language switch reaches. Says so in this language («هذه المقالة غير متاحة
 * بالعربية بعد»), links to the edition that exists, and is never indexed.
 */
export function HelpNotTranslated({
  locale,
  other,
  otherPath,
  title,
}: {
  locale: Locale;
  /** The language the article is written in. */
  other: Locale;
  /** Its path in that language, below the locale prefix. */
  otherPath: string;
  /** Its title, in that language. */
  title: string;
}) {
  const c = HELP_COPY[locale].article.notTranslated;
  return (
    <Section className="pt-[clamp(3rem,8vw,6rem)]">
      <div className="mk-measure">
        <p className="mk-eyebrow mk-bidi">{c.eyebrow}</p>
        <h1 className="mk-h2 mk-bidi mt-4">{c.title}</h1>
        <p className="mk-lead mk-bidi mt-4">{c.body}</p>
        <p className="mt-6 text-[length:var(--fs-h3)] font-medium text-[var(--text)]">
          <bdi lang={other}>{title}</bdi>
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={localeHref(other, otherPath)}
            hrefLang={other}
            lang={other}
            dir={other === "ar" ? "rtl" : "ltr"}
            className="mk-btn mk-solid"
          >
            {c.read}
          </Link>
          <Link href={localeHref(locale, "/help")} className="mk-help-crumb mk-bidi text-[length:var(--fs-ui)] font-medium">
            {c.back}
          </Link>
        </div>
      </div>
    </Section>
  );
}
