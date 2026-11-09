import { INK, INK_55 } from "../landing";

export function LangTab({
  label,
  checked,
  latin,
  onSelect,
}: {
  label: string;
  checked: boolean;
  latin?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      tabIndex={checked ? 0 : -1}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      style={{
        position: "relative",
        blockSize: 44,
        border: 0,
        background: "transparent",
        borderRadius: 999,
        cursor: "pointer",
        fontFamily: latin ? "Inter, sans-serif" : undefined,
        fontSize: latin ? 14 : 15,
        fontWeight: 500,
        color: checked ? INK : INK_55,
        transition: "color 200ms",
      }}
    >
      {label}
    </button>
  );
}
