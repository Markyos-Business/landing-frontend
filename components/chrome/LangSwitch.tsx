"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { swapLocaleInPath } from "@/lib/i18n/href";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/lib/i18n/locales";

/*
 * The language switcher.
 *
 * A single link to the other language, labelled in that language's own
 * script — العربية on the English page, English on the Arabic one. That is
 * what the reference's header shows, and it is the right shape for a site
 * with exactly two languages: a two-pill segmented control spends header room
 * telling you which language you are already reading, which you can see.
 *
 * A Client Component for one reason: it needs the current pathname so it can
 * offer the *same page* in the other language. A reader three-quarters of the
 * way down /en/companies who clicks العربية should land on /ar/companies, not
 * on the Arabic homepage.
 *
 * A link, not a button, and a real href — so a crawler follows it, the pair is
 * discoverable alongside the hreflang tags, and the whole thing works before
 * any JavaScript arrives.
 *
 * The cookie is set on navigation by `proxy.ts`, which sees the locale in the
 * URL. Setting it here as well would mean the preference depends on
 * JavaScript, and it does not need to.
 */

export function LangSwitch({
  locale,
  label,
}: {
  locale: Locale;
  /** Accessible name for the control, from the copy dictionary. */
  label: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const other = LOCALES.find((l) => l !== locale);
  if (!other) return null;

  return (
    <Link
      href={swapLocaleInPath(pathname, other)}
      hrefLang={other}
      // The visible text is the language's endonym, which is the clearest
      // label there is — but it does not say what the control *does*, so the
      // accessible name adds that. Both are read; the title serves a mouse.
      aria-label={`${label}: ${LOCALE_LABEL[other]}`}
      title={LOCALE_LABEL[other]}
      lang={other}
      className="text-[length:var(--fs-ui)] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
      // Arabic set in the Arabic face even on the English page, because "ع" in
      // a Latin font is not the same letterform.
      //
      // `--font-arabic`, not `--font-plex-arabic`: §2.1 makes Thmanya Sans the
      // Arabic face and keeps Plex as the last-resort fallback behind it. Naming
      // Plex directly here skipped the brand face on every English page.
      style={other === "ar" ? { fontFamily: "var(--font-arabic)" } : undefined}
    >
      {LOCALE_LABEL[other]}
    </Link>
  );
}
