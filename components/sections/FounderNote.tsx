import type { FounderNoteCopy } from "@/content/types";
import { Section } from "@/components/ui/Section";

/*
 * The founder note.
 *
 * The only place on the page written in the first person, and the only place
 * a person is named. That is why it gets a face: everything above it is the
 * product arguing for itself, and this is somebody saying they had the
 * problem. A paragraph signed by nobody is a paragraph by the marketing
 * department.
 *
 * No photograph — initials on a disc. A real portrait is a design asset
 * nobody has handed over yet, and a placeholder silhouette would say less
 * than two letters do.
 */

export function FounderNote({ copy }: { copy: FounderNoteCopy }) {
  const { name, role } = parseSignature(copy.signature);

  return (
    <Section id="founder-note" labelledBy="founder-note-heading" rule>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          {/*
           * No size override. `--fs-h2` is "one h2 size in the system"
           * (theme.css), and this heading was hand-set to a bespoke
           * 28-to-34px clamp that appears nowhere else — so the one section
           * on the page that speaks in the founder's voice was also the one
           * whose heading came in smaller than its neighbours. §7: a display
           * size hand-set in a section goes back to the nearest token.
           */}
          <h2 id="founder-note-heading" className="mk-h2">
            {copy.headline}
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 flex-none place-items-center rounded-full bg-[var(--surface-2)] text-[0.75rem] font-medium text-[var(--text-muted)]"
            >
              {initials(name)}
            </span>
            <span>
              <span className="mk-bidi block text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
                {name}
              </span>
              {role ? (
                <span className="mk-bidi block text-[0.75rem] text-[var(--text-muted)]">
                  {role}
                </span>
              ) : null}
            </span>
          </div>
        </div>

        <div className="space-y-5 self-start">
          {copy.body.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 32)}
              className={`mk-bidi text-[length:var(--fs-lead)] leading-[1.65] ${
                i === 0 ? "text-[var(--text)]" : "text-[var(--text-muted)]"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}

/**
 * Pull a name and a role out of "— Abdullah Saeedan, Co-founder".
 *
 * The signature is one approved string in content/ and stays that way, since
 * it is what a reader would expect at the end of a letter. Splitting it here
 * is presentation.
 *
 * Handles the Arabic comma as well as the Latin one, and falls back to
 * showing the whole thing as the name — a signature that is not in this shape
 * renders intact rather than losing half of itself.
 */
function parseSignature(signature: string): { name: string; role?: string } {
  const clean = signature.replace(/^[—–-]\s*/u, "").trim();
  const match = clean.match(/^(.+?)\s*[,،]\s*(.+)$/u);
  if (!match) return { name: clean };
  return { name: match[1], role: match[2] };
}

/** Up to two initials, from the first and last word of a name. */
function initials(name: string): string {
  const words = name.split(/\s+/u).filter(Boolean);
  if (words.length === 0) return "";
  const first = [...words[0]][0] ?? "";
  const last = words.length > 1 ? ([...words[words.length - 1]][0] ?? "") : "";
  return (first + last).toLocaleUpperCase();
}
