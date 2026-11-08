"use client";

import { useRef, useState, type ReactNode } from "react";

/*
 * Monthly or yearly, over a grid of plans.
 *
 * The annual rate was already on the page: every paid plan carried a line
 * under its price reading "19 دولاراً شهرياً بالاشتراك السنوي". That tells a
 * reader the discount exists and then leaves them to compare four cards'
 * worth of two numbers in their head, which is the one piece of arithmetic a
 * pricing page is for. The switch does it for them: one rate at a time,
 * across the whole grid, in the place the eye already is.
 *
 * ── Why both prices are in the HTML ──────────────────────────────────────
 *
 * The same trade AudienceTabs makes, for the same reason. /pricing is the
 * page this site most needs indexed and half its figures existing only after
 * a click is worse than the markup weight — so every card renders both
 * amounts on the server and the switch only changes which is shown, through
 * one `data-billing` attribute and two rules in globals.css. Nothing in the
 * cards is a client component, and without JavaScript the page is the
 * monthly page, which is the one it was before this existed.
 *
 * ── Why the state lives above the head ───────────────────────────────────
 *
 * The control sits under the section's heading and the prices it changes are
 * in the grid below, so the one thing that owns both is this wrapper. The
 * heading block is server-rendered and passed in as `head`, the way
 * AudienceTabs takes its own — nothing of the section's content crosses into
 * the client bundle, only the dozen lines below.
 */

export function BillingSwitch({
  label,
  monthly,
  annual,
  head,
  centred,
  children,
}: {
  /** Names the group — "billing cycle", not "pricing". */
  label: string;
  monthly: string;
  annual: string;
  /** The heading block above the switch. Server-rendered and passed in. */
  head?: ReactNode;
  /** Match the head's alignment: these blocks are centred, others are not. */
  centred: boolean;
  children: ReactNode;
}) {
  const [yearly, setYearly] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);

  const options: { id: "monthly" | "annual"; label: string }[] = [
    { id: "monthly", label: monthly },
    { id: "annual", label: annual },
  ];
  const index = yearly ? 1 : 0;

  /*
   * Arrow keys move between the two and take focus with them, which is what a
   * radio group does.
   *
   * `ArrowRight` moves the ring to the right of the *screen*. On /ar the
   * track is mirrored — the second option is drawn to the left of the first
   * — so that is `i - 1` there. The arrow follows the key under the finger
   * rather than the reading order; pressing Right and watching the ring go
   * left is the bug this replaced. `--mk-dir` already does the same job for
   * the knob's travel, and this is the keyboard half of it.
   */
  const move = (to: number) => {
    const next = (to + options.length) % options.length;
    setYearly(next === 1);
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div data-billing={yearly ? "annual" : "monthly"}>
      <div className={centred ? "flex flex-col items-center text-center" : ""}>
        {head}
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label={label}
          className="mk-switch mt-7"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          {/* The knob is placed with a logical inset and moved with a physical
              translate, so its travel carries `--mk-dir` or it leaves the
              track in Arabic. Same workaround as the audience switch. */}
          <span
            aria-hidden="true"
            className="mk-switch-knob"
            style={{
              inlineSize: "calc((100% - 8px) / 2)",
              transform: `translateX(calc(${index * 100}% * var(--mk-dir)))`,
            }}
          />
          {options.map((option, i) => {
            const rtlAware = (step: number) =>
              i + step * (typeof document !== "undefined" && document.dir === "rtl" ? -1 : 1);
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={index === i}
                tabIndex={index === i ? 0 : -1}
                onClick={() => setYearly(i === 1)}
                onKeyDown={(event) => {
                  const keys: Record<string, number> = {
                    ArrowRight: rtlAware(1),
                    ArrowDown: i + 1,
                    ArrowLeft: rtlAware(-1),
                    ArrowUp: i - 1,
                    Home: 0,
                    End: options.length - 1,
                  };
                  if (event.key in keys) {
                    event.preventDefault();
                    move(keys[event.key]);
                  }
                }}
                className="mk-switch-item mk-bidi"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}
