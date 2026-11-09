import type { EcosystemCopy } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { INK, INK_45 } from "../landing";

/*
 * The same six tools on a phone, as a wrapped row.
 *
 * A real list, because that is what it is, and the one the arc above
 * is `aria-hidden` in favour of — so a screen reader gets these once
 * at every width rather than twice on a tablet and never on a phone.
 */
export function ToolChips({ tools }: { tools: EcosystemCopy["tools"] }) {
  return (
    <ul
      className="mk-funnel-narrow"
      style={{
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        margin: "8px 0 56px",
        padding: 0,
        listStyle: "none",
      }}
    >
      {tools.map((tool) => (
        <li key={tool.label} style={{ display: "flex" }}>
          <span
            style={{
              minBlockSize: 34,
              padding: "4px 12px",
              borderRadius: 999,
              background: "#fff",
              boxShadow: "0 0 0 1px rgba(11,11,15,.06)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: INK_45,
            }}
          >
            <Icon name={tool.icon} size={15} />
            <span className="mk-bidi" style={{ color: INK }}>
              {tool.label}
            </span>
            <span dir="ltr" style={{ fontFamily: "Inter, sans-serif", fontSize: 12 }}>
              {tool.tool}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
