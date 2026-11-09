"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Section } from "@/components/ui";

/*
 * Two audiences, one place on the page.
 *
 * /pricing was 10,700px tall and four of its eleven sections were the same
 * thing twice: a ladder of plans for studios, an eleven-row comparison of
 * those plans, then a ladder for companies and an eleven-row comparison of
 * those. Nobody is both. Everyone had to scroll a page and a half of somebody
 * else's prices to reach the FAQ. /platform had the same shape across its two
 * tool tables, nineteen rows between them.
 *
 * ── Why both panels are in the HTML ──────────────────────────────────────
 *
 * The inactive panel is rendered and hidden, not dropped. /pricing is the page
 * this site most needs indexed, and half its prices existing only after a click
 * is a worse trade than the markup weight. `hidden` keeps the panel out of the
 * accessibility tree and out of Find-in-page while leaving it in the document,
 * and it costs nothing to render: the panels are server components passed in as
 * props, so none of that content reaches the client bundle.
 *
 * Without JavaScript the first option shows and the switch does not move. That
 * is the page the site had before, minus one audience's half.
 *
 * ── Why a radio group and not tabs ───────────────────────────────────────
 *
 * The options are mutually exclusive states of one control — "which of these am
 * I" — which is what a radio group is. The tabs pattern announces a set of
 * pages within a page; this is a filter, and "radio button, 1 of 2" is the more
 * useful thing to hear. Both switches on the homepage were built this way for
 * the same reason.
 *
 * ── The hash is the deep link ────────────────────────────────────────────
 *
 * The pricing hero offers "for studios" and "for companies" as two links, and
 * the nav points at them. Those were anchors to two sections; an anchor into a
 * hidden panel scrolls to nothing, so each option's id is read from the hash
 * instead — `/pricing#companies` opens on companies, and an in-page click
 * switches the panel rather than jumping past it.
 */

export function AudienceTabs({
  id,
  headingId,
  label,
  head,
  white,
  options,
}: {
  id?: string;
  headingId?: string;
  /** Names the group — "which of these are you", not the page's subject. */
  label: string;
  /** The heading block above the switch. Server-rendered and passed in. */
  head?: ReactNode;
  white: boolean;
  options: { id: string; label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(options[0]?.id ?? "");
  const groupRef = useRef<HTMLDivElement>(null);

  /*
   * `ids`, not `options`: the prop is a fresh array on every render, so an
   * effect depending on it would re-run forever. The string is stable and
   * carries the only thing the effect needs out of it.
   */
  const ids = options.map((option) => option.id).join(" ");

  useEffect(() => {
    const known = ids.split(" ");
    const fromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!known.includes(hash)) return;
      setActive(hash);
      /*
       * And scroll, because nothing else will.
       *
       * `#studios` names an option, not an element, so the browser finds no
       * target and stays where it is — which on a link from the nav or another
       * page means the panel quietly changes somewhere below the fold. The
       * switch is what the link is for, so that is what comes into view.
       * `scroll-padding-block-start` on the root keeps it clear of the sticky
       * header, and `scroll-behavior` there is already reduced-motion aware.
       */
      groupRef.current?.scrollIntoView({ block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [ids]);

  const index = Math.max(
    0,
    options.findIndex((option) => option.id === active),
  );

  /*
   * Arrow keys move to the next option and take focus with them, which is what
   * a radio group does. Written for any number of options even though both
   * callers have two: a three-way split — studios, freelancers, companies — is
   * already how /solutions divides the same audience, and a control that
   * silently only works for two is the kind of thing nobody finds until then.
   */
  const move = (to: number) => {
    const next = (to + options.length) % options.length;
    setActive(options[next].id);
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <>
      {/*
       * Tighter than a section at both ends.
       *
       * The switch is a control that belongs to the panel under it, not a
       * section of its own, so a full 100px above it left it floating in an
       * empty band — 290px of nothing between the pricing hero's last line and
       * the control the page is now built around. Below, the design's gap
       * between a switch and what it switches is 40px, and the panel carries no
       * top padding of its own for the same reason.
       */}
      <Section
        id={id}
        labelledBy={headingId}
        white={white}
        className="pt-[clamp(2.5rem,6vw,4.5rem)] pb-10"
      >
        <div className="mk-seq flex flex-col items-center text-center">
          {head}
          <div
            ref={groupRef}
            role="radiogroup"
            aria-label={label}
            className="mk-switch mt-8"
            style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
          >
            {/*
             * The knob sits behind the labels, placed with a logical inset and
             * moved with a physical translate — so its travel has to carry
             * `--mk-dir` or it leaves the track in Arabic. Same workaround as
             * the homepage's toggle; see the token's note in tailwind/.
             */}
            <span
              aria-hidden="true"
              className="mk-switch-knob"
              style={{
                inlineSize: `calc((100% - 8px) / ${options.length})`,
                transform: `translateX(calc(${index * 100}% * var(--mk-dir)))`,
              }}
            />
            {options.map((option, i) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={option.id === active}
                aria-controls={`audience-${option.id}`}
                tabIndex={option.id === active ? 0 : -1}
                onClick={() => setActive(option.id)}
                onKeyDown={(event) => {
                  /* `ArrowRight` moves the ring to the right of the
                     *screen*, which on /ar — where the track is mirrored —
                     is the previous option. The arrow follows the key under
                     the finger, not the reading order; pressing Right and
                     watching the ring travel left is what this replaced.
                     `--mk-dir` already does this for the knob's travel, and
                     the billing switch and the solutions explorer both
                     match. */
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
                className="mk-switch-item mk-bidi"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {options.map((option) => (
        <div
          key={option.id}
          id={`audience-${option.id}`}
          hidden={option.id !== active}
          /* The panel's first section continues the switch's band rather than
             opening a new one — they are one block of the page. */
          className="[&>section:first-child]:pt-0"
        >
          {option.content}
        </div>
      ))}
    </>
  );
}
