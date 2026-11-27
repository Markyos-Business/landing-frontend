"use client";

import { useRef, useState } from "react";

/*
 * One question, and the card that answers it.
 *
 * ── Why the page needs this at all ───────────────────────────────────────
 *
 * Copy deck v4.3 splits /pricing into three audiences and gives them eleven
 * plans between them. The audience switch above answers "which of these am
 * I"; it does not answer "and which card is mine", which is still a choice
 * between three and five. Every one of those choices turns on a single fact —
 * how many clients at once, how many people on the team, how many brands and
 * editors — and never on the price, which is the last thing a visitor can
 * judge. So the page asks the fact, and lights the card.
 *
 * ── Why it moves a class instead of lifting state ────────────────────────
 *
 * The cards are server components in a sibling block, rendered once and never
 * re-rendered: there is no client-side owner of "which plan is lit" to lift
 * this into, and creating one would turn the whole plan grid — eleven cards,
 * every limit, every price — into client-rendered markup to carry a single
 * class. So this reaches for the cards by the ids the content file gave both
 * ends, which is the same contract `AudienceTabs` has with the hash.
 *
 * It is safe for exactly the reason it looks unsafe: nothing else ever
 * rewrites those elements, so React will not undo it.
 *
 * ── The answer that means "wrong tab" ────────────────────────────────────
 *
 * "Others work with me" is a real answer to "how many clients do you work
 * with", and its plan is not on the freelancers tab at all. Rather than
 * invent a half-answer, that chip carries `tab:studios` and sets the hash,
 * which is the switch's own deep link — so the panel changes and the page
 * scrolls to it, exactly as a link from the nav does.
 */

export function Chooser({
  label,
  options,
}: {
  label: string;
  options: { label: string; target: string; note?: string }[];
}) {
  /*
   * The pick is which chip, not which card.
   *
   * Two chips may honestly answer with the same card — on the companies tab
   * "up to five" and "more than that" are both the Company plan, and what
   * separates them is the note about the sixth editor. Keying the state on the
   * target made them one chip in four different ways: a duplicate React key,
   * both reading as checked, both holding the roving tab stop, and the second
   * one's note unreachable because `find` stops at the first match.
   */
  const [picked, setPicked] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const choose = (index: number) => {
    setPicked(index);
    const { target } = options[index];

    const tab = target.startsWith("tab:") ? target.slice(4) : null;
    if (tab) {
      /*
       * Write the hash, then say so.
       *
       * The switch opens the panel named by the hash and listens for
       * `hashchange`, so this needs the address bar to change *and* the event
       * to fire. Neither of the two obvious ways to do that survives the
       * lint rules, for reasons that are both fair: assigning
       * `location.hash` is writing to something outside the component, and
       * `location.assign` with a relative target is how an internal Next.js
       * navigation gets done by accident.
       *
       * `replaceState` is the honest instrument anyway. This is a filter on
       * one page, not a page to come back from, and dispatching the event
       * ourselves is what `replaceState` deliberately does not do.
       */
      window.history.replaceState(null, "", `#${tab}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      return;
    }

    /*
     * Put out whatever this chooser lit before — including the card the
     * server marked recommended, because a reader who has now answered the
     * question should see one lit card and not two.
     */
    for (const option of options) {
      if (option.target.startsWith("tab:")) continue;
      document.getElementById(option.target)?.classList.remove("mk-plan-lit");
    }

    const card = document.getElementById(target);
    if (!card) return;
    card.classList.add("mk-plan-lit");
    /*
     * Scroll, then take focus. `scrollIntoView` with no `behavior` follows the
     * root's `scroll-behavior`, which is already reduced-motion aware; calling
     * `focus()` afterwards with `preventScroll` keeps that one scroll rather
     * than racing it with a second, and is what tells a screen-reader user
     * that the answer moved them somewhere.
     */
    card.scrollIntoView({ block: "center" });
    card.focus({ preventScroll: true });
  };

  /*
   * Arrow keys move the pick, which is what a radio group does — and the key
   * follows the finger, not the reading order: on /ar the row is mirrored, so
   * ArrowRight is the previous chip. Same rule as the audience switch, the
   * billing switch and the solutions explorer.
   */
  const move = (to: number) => {
    const next = (to + options.length) % options.length;
    choose(next);
    rowRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  };

  const note = picked === null ? undefined : options[picked].note;

  return (
    <>
      <div ref={rowRef} role="radiogroup" aria-label={label} className="mk-choice-row mt-8">
        {options.map((option, i) => (
          <button
            /* The label, not the target: two chips may share a card, and no
               chooser asks the same question twice. */
            key={option.label}
            type="button"
            role="radio"
            aria-checked={i === picked}
            /* Nothing is picked to begin with, so the first chip is the one
               the tab key reaches — the roving index a radio group wants. */
            tabIndex={picked === null ? (i === 0 ? 0 : -1) : i === picked ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={(event) => {
              const rtl = document.dir === "rtl";
              const keys: Record<string, number> = {
                ArrowRight: rtl ? i - 1 : i + 1,
                ArrowDown: i + 1,
                ArrowLeft: rtl ? i + 1 : i - 1,
                ArrowUp: i - 1,
                Home: 0,
                End: options.length - 1,
              };
              if (event.key in keys) {
                event.preventDefault();
                move(keys[event.key]);
              }
            }}
            className="mk-choice mk-bidi"
          >
            {option.label}
          </button>
        ))}
      </div>
      {/*
       * The one answer that needs a sentence rather than a card: "more than
       * twelve people" is an agency plan plus extra seats, or a conversation.
       * `aria-live` because the chip that reveals it is the chip that was just
       * pressed — the reader who pressed it is the one who has to be told.
       */}
      {options.some((option) => option.note) ? (
        <p
          aria-live="polite"
          /* The height is reserved whether or not a note is showing, so the
             cards below do not jump when one appears. */
          className="mk-bidi mt-5 min-h-[1.5rem] text-[length:var(--fs-ui)] text-[var(--text-muted)]"
        >
          {note ?? ""}
        </p>
      ) : null}
    </>
  );
}
