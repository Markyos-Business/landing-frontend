import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import type { PanelProps } from "./types";

/* ── A plain list dropdown ───────────────────────────────────────────────── */

export function ListPanel({ id, hidden, item, locale, panelRef }: PanelProps) {
  return (
    <div id={id} hidden={hidden} ref={panelRef} data-open={!hidden} className="mk-nav-panel">
      <ul className="mk-nav-list">
        {item.links?.map((link) => (
          <li key={link.href}>
            <Link href={localeHref(locale, link.href)} className="mk-nav-list-link mk-bidi">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
