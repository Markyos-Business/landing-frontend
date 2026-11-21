import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/locales";

const LATIN_RUN = /([A-Za-z0-9](?:[A-Za-z0-9.,:/@_+&#%=?-]*[A-Za-z0-9/])?(?:\s+[A-Za-z0-9](?:[A-Za-z0-9.,:/@_+&#%=?-]*[A-Za-z0-9/])?)*)/;

/*
 * A plain string with each Latin run wrapped in <bdi> when the page is
 * Arabic, so "markyos.com" or "PDF" can't reorder the words around it. The
 * same rule `prepareHelpBody` applies to an article's body, for titles and
 * summaries rendered as text.
 */
export function Bidi({ text, locale }: { text: string; locale: Locale }) {
  if (locale !== "ar" || !/[A-Za-z0-9]/.test(text)) return <>{text}</>;
  return (
    <>
      {text.split(LATIN_RUN).map((part, i) =>
        i % 2 === 1 ? <bdi key={i}>{part}</bdi> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
