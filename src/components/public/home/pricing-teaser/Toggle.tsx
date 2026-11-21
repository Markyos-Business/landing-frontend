import { INK, INK_55 } from "../landing";

export function Toggle({
  label,
  checked,
  onSelect,
}: {
  label: string;
  checked: boolean;
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
      className="mk-bidi"
      style={{
        position: "relative",
        blockSize: 44,
        /* Room either side of the label, now that the track is sized by its
           content rather than padded out to a fixed 300px. */
        paddingInline: 20,
        whiteSpace: "nowrap",
        border: 0,
        background: "transparent",
        borderRadius: 999,
        cursor: "pointer",
        fontSize: 15,
        fontWeight: 500,
        color: checked ? INK : INK_55,
        transition: "color 200ms",
      }}
    >
      {label}
    </button>
  );
}
