"use client";

import { useEffect, useRef, useState } from "react";
import type { IconName } from "@/components/ui";
import { Icon } from "@/components/ui";
import { INK_50, INK_64, BLUE_DEEP } from "./landing";

/*
 * The journey, as a dial.
 *
 * Seven stops, one lit. The stage is a display word; the tool and what
 * actually happens sit beside the lit one. Scrolling past moves the light
 * down the list, and pointing at a stop or tabbing to it takes over.
 *
 * ── Why this replaced the table ───────────────────────────────────────────
 *
 * It was a seven-row, three-column table, and the note above it argued that
 * it had to be: "a studio owner reads the table and recognises their last
 * project, row by row". That argument is about the *order* and about the
 * pairing of a stage with its breakage, and none of it is given up here. A
 * table of terms and their descriptions is a definition list with rules drawn
 * on it, and `<dl>` says the same thing to a screen reader — stage, then its
 * tool, then what happens to it — without a 680px minimum width that made the
 * whole thing scroll sideways on a phone.
 *
 * What it buys is that the seven stages read as one journey at a glance. In a
 * table the stage names are the narrowest column, set at 16px, carrying the
 * argument of the section in its quietest type.
 *
 * ── What it does not take from the reference ──────────────────────────────
 *
 * The reference pins the section and drives the list from scroll: the page
 * stops, the list slides so the lit word stays on a centre line, and it
 * resumes when the list runs out. Two reasons not to. It costs roughly seven
 * viewport heights of scroll on the one page that was just cut from 17,700px,
 * and taking the page's scroll away is the kind of thing that is charming
 * once and infuriating on the second visit.
 *
 * So the list does not move and the page never stops. What moves is the
 * light, and it still moves with the scroll — the active stop is whichever
 * one is crossing the middle of the viewport, which is the same rhythm
 * without the pinning. A pointer or a keyboard takes over from it.
 */

export type Station = { station: string; tool: string; what: string; icon: IconName };

export function StationDial({
  stations,
  labels,
}: {
  stations: Station[];
  /** The old column heads. They label the two halves of a stop now. */
  labels: { station: string; tool: string; what: string };
}) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDListElement>(null);
  /*
   * Whether a pointer or a keyboard has taken over from the scroll.
   *
   * A ref and not state: it is read inside the observer's callback and
   * changing it must not re-run the effect, or every hover would tear down
   * and rebuild seven observers.
   */
  const taken = useRef(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = [...list.querySelectorAll<HTMLElement>("[data-stop]")];
    if (!rows.length) return;

    /*
     * A root margin that collapses the viewport to a line across its middle.
     *
     * -50% top and bottom leaves a zero-height band, so a row "intersects"
     * exactly while it is crossing the centre of the screen — which, with
     * rows that touch, means one row at a time and no arithmetic. Cheaper
     * than a scroll listener and it cannot be made to fire during a paint.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        if (taken.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = rows.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    for (const row of rows) observer.observe(row);
    return () => observer.disconnect();
  }, []);

  /*
   * How wide the longest stop actually is.
   *
   * The copy panel sits beside the lit word and has to start past every
   * word, in any language. That distance is a text measurement, which CSS
   * cannot make, so it is made here once and handed over as
   * `--mk-dial-word`; tailwind/ does the arithmetic.
   *
   * Re-measured when the list resizes — the type is a `clamp()` on the
   * viewport — and again when the webfonts land, because the first
   * measurement is of the fallback face and Thmanya and Inter do not set
   * the same words to the same width.
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const terms = list.querySelectorAll<HTMLElement>(".mk-dial-term");
      if (!terms.length) return;
      let widest = 0;
      for (const term of terms) widest = Math.max(widest, term.getBoundingClientRect().width);
      const next = `${Math.ceil(widest)}px`;
      // Only on a change: the property is read by an absolutely positioned
      // child, so writing it cannot resize the list — but a no-op write
      // that feeds a ResizeObserver is a loop waiting for a browser that
      // rounds differently.
      if (list.style.getPropertyValue("--mk-dial-word") !== next) {
        list.style.setProperty("--mk-dial-word", next);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => observer.disconnect();
  }, [stations]);

  const take = (index: number) => {
    taken.current = true;
    setActive(index);
  };

  return (
    <dl
      ref={listRef}
      className="mk-dial mk-still mk-seq"
      onPointerLeave={() => {
        taken.current = false;
      }}
    >
      {stations.map((stop, i) => (
        // A `div` wrapping each dt/dd pair, which `<dl>` allows and which is
        // what gives a stop a box to be hovered and lit as one thing.
        <div
          key={stop.station}
          data-stop=""
          data-on={i === active ? "" : undefined}
          onPointerEnter={() => take(i)}
        >
          <dt>
            {/*
             * A button, because otherwise this is unreachable without a
             * mouse. Everything a stop says is in the document either way —
             * a screen reader walks all seven, lit or not — but a sighted
             * keyboard user would have had six stops they could never read.
             */}
            <button type="button" className="mk-dial-term mk-bidi" onFocus={() => take(i)}>
              {stop.station}
            </button>
          </dt>

          <dd>
            <span className="mk-dial-label mk-bidi">{labels.tool}</span>
            <span className="mk-dial-tool">
              <Icon name={stop.icon} size={17} style={{ color: BLUE_DEEP, flex: "none" }} />
              {/* `.mk-page-dir`, not `dir="auto"`: "Google Forms أو Typeform"
                  begins with a Latin letter and would otherwise resolve its
                  own direction and sit on the far edge. See tailwind/. */}
              <span className="mk-page-dir" style={{ color: INK_50 }}>
                {stop.tool}
              </span>
            </span>
            <span className="mk-dial-label mk-bidi" style={{ marginBlockStart: 14 }}>
              {labels.what}
            </span>
            <span className="mk-bidi" style={{ color: INK_64, lineHeight: 1.75 }}>
              {stop.what}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
