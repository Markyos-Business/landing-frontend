import type { FocusEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

/*
 * Opening waits; closing waits longer.
 *
 * `HOVER_DELAY` stops a menu flashing open when the pointer is only crossing
 * the nav on its way somewhere else.
 *
 * `CLOSE_DELAY` is the one that matters, and it is here because without it
 * these menus could not be opened with a mouse at all. The panels hang below
 * the nav with a gap — `PANEL_GAP` below, which is the header's own padding —
 * and that gap belongs to no element. Moving from a trigger towards the panel
 * therefore leaves the nav's subtree, and `pointerleave` fired a close 2px
 * into a 14px journey. The panel was gone before the pointer was halfway.
 *
 * A delay rather than a bridging element: the panels position against the
 * nav root, not against their trigger, so the dead space one has to cross is
 * inside the header and outside any single element that could span it. A
 * grace period covers that, covers the diagonal move towards a far corner of
 * a mega panel, and covers the moment of leaving one trigger for another.
 */
const HOVER_DELAY_MS = 150;
const CLOSE_DELAY_MS = 220;

/** The page gutter, `--mk-gutter`. A panel is never allowed inside it. */
const GUTTER_PX = 20;

/*
 * The desktop nav's open menu, its timers, the frame's measurement and the
 * document listeners. `Nav` is the markup; this is everything that decides
 * what it shows. The reasoning for each piece is beside it.
 */
export function useNavMenus() {
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Whether a panel was already on screen when this one opened. Only then is
     there a previous geometry worth travelling from; a first open sets the
     frame's size outright, or the card would unfold out of a 0×0 point. */
  const wasOpen = useRef(false);
  const baseId = useId();

  const cancelHover = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  /*
   * Everything stops. For Escape, click-outside and focus leaving the nav.
   *
   * `useCallback` with no dependencies because it touches only refs and the
   * state setter, all of which React guarantees are stable — which lets the
   * listener effect below depend on it honestly instead of silencing the
   * exhaustive-deps rule.
   */
  const closeNow = useCallback(() => {
    cancelHover();
    cancelClose();
    setOpen(null);
  }, []);

  useEffect(
    () => () => {
      cancelHover();
      cancelClose();
    },
    [],
  );

  /*
   * Measure the open panel and hand the frame its geometry.
   *
   * Four custom properties on the nav root, which both the frame and the
   * panels read: `--mk-nav-max` caps a panel before it is measured,
   * `--mk-nav-w` / `--mk-nav-h` are what the frame draws, and `--mk-nav-x` is
   * the horizontal offset both of them share.
   *
   * `--mk-nav-x` is a physical `translate`, not a logical inset, and that is
   * deliberate in a file that otherwise uses logical properties throughout.
   * It is the sum of two numbers — where the trigger sits inside the nav, and
   * how far the panel has to come back to clear the gutter — and both are
   * read off `getBoundingClientRect`, which only speaks in physical pixels.
   * Resolving the direction once, here, is honest; carrying two sign
   * conventions through the arithmetic to re-derive it in CSS would not be.
   *
   * ── Why a panel is anchored to its own trigger and then pulled back ──────
   *
   * A panel starts under the trigger that opened it, which is where the eye
   * already is. A mega panel is far wider than its trigger, so that start
   * position would push it through the page gutter; it is then shifted back
   * until it clears. The two mega panels are both wide enough to end up
   * clamped against the same edge, so they sit in the same place and the
   * frame travels only the difference in their widths — while the Resources
   * list, which is narrow enough to need no shift at all, stays under
   * Resources instead of being dragged across the header to join them.
   */
  const measure = useCallback((index: number) => {
    const root = rootRef.current;
    const panel = panels.current[index];
    const trigger = triggers.current[index];
    if (!root || !panel || !trigger) return;

    const container = root.closest(".mk-container");
    const bounds = container?.getBoundingClientRect();
    const docWidth = root.ownerDocument.documentElement.clientWidth;
    const minLeft = (bounds?.left ?? 0) + GUTTER_PX;
    const maxRight = (bounds?.right ?? docWidth) - GUTTER_PX;
    const rtl = getComputedStyle(root).direction === "rtl";

    /* The cap goes on before the tape measure. A panel is `max-content` wide
       up to `--mk-nav-max`, so reading its width before the cap is current
       measures a panel that will never be drawn — which is what happens on
       the first open after a window has been made narrower. */
    root.style.setProperty("--mk-nav-max", `${Math.round(maxRight - minLeft)}px`);

    const w = panel.offsetWidth;
    const h = panel.offsetHeight;

    /* Where the panel's own start edge lands if nothing moves it. The
       trigger's offset inside the nav is the same number in both directions
       once the panel's width is accounted for, so the two cases differ only
       in which edge is the start.
       Written as a branch rather than two ternaries because `rect.right ?`
       reads to `check:design` as a physical CSS offset — which, in a file
       whose whole subject is logical positioning, is a rule worth keeping
       blunt rather than teaching to parse JavaScript. */
    const rootRect = root.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    let fromTrigger = triggerRect.left - rootRect.left;
    let edge = rootRect.left;
    if (rtl) {
      fromTrigger = triggerRect.right - rootRect.right;
      edge = rootRect.right - w;
    }
    edge += fromTrigger;

    let x = fromTrigger;
    if (edge < minLeft) x += minLeft - edge;
    else if (edge + w > maxRight) x -= edge + w - maxRight;

    root.style.setProperty("--mk-nav-w", `${w}px`);
    root.style.setProperty("--mk-nav-h", `${h}px`);
    root.style.setProperty("--mk-nav-x", `${Math.round(x)}px`);
  }, []);

  /*
   * `useLayoutEffect`, not `useEffect`: the panel's `hidden` has just been
   * removed in this same commit, so it has a size to read — but only before
   * the browser paints. Measuring a frame later would show one frame of a
   * card at the previous menu's size.
   */
  useLayoutEffect(() => {
    if (open === null) {
      wasOpen.current = false;
      return;
    }
    /*
     * Opening a menu is the only thing that decides whether the frame
     * travels, and it has to be the only thing: the `ResizeObserver` below
     * fires once, a frame after every open, and while it also owned this
     * flag it turned the morph off again before the transition had drawn
     * anything. The card changed size between two menus instantly, which is
     * the exact behaviour this whole arrangement exists to replace, and it
     * looked like a CSS bug rather than a lifecycle one.
     */
    const root = rootRef.current;
    if (root) root.dataset.navMorph = wasOpen.current ? "true" : "false";
    measure(open);
    wasOpen.current = true;
  }, [open, measure]);

  /*
   * Re-measure while open, without animating.
   *
   * Two things resize a panel after it has been measured: the window, and
   * the Arabic face arriving — Thmanya Sans swaps in after first paint and
   * every line in the panel reflows under it. A `ResizeObserver` catches
   * both, and the layout-effect pass above catches neither.
   */
  useEffect(() => {
    if (open === null) return;
    const panel = panels.current[open];

    const remeasure = () => measure(open);
    window.addEventListener("resize", remeasure);

    let observer: ResizeObserver | undefined;
    if (panel && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(remeasure);
      observer.observe(panel);
    }

    return () => {
      window.removeEventListener("resize", remeasure);
      observer?.disconnect();
    };
  }, [open, measure]);

  /*
   * Escape closes and hands focus back to the trigger — without that last
   * part, closing a menu with the keyboard drops you at the top of the
   * document and you have to tab back through the whole header.
   *
   * Pointer-down rather than click for the outside-close, so the menu is
   * already gone by the time a click lands on whatever is underneath it.
   */
  useEffect(() => {
    if (open === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeNow();
      triggers.current[open]?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeNow();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, closeNow]);

  /*
   * Re-entering anywhere in the nav — including a panel, which is a DOM
   * descendant of this element however it is positioned on screen —
   * cancels a pending close. That is what makes crossing the gap work.
   */
  const onRootPointerEnter = cancelClose;

  const onRootPointerLeave = () => {
    cancelHover();
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), CLOSE_DELAY_MS);
  };

  // Tabbing past the last link in a panel closes it. `relatedTarget` is
  // where focus went; if that is still inside the nav, the panel stays.
  const onRootBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      closeNow();
    }
  };

  /* A plain link closes whatever menu is open as the pointer reaches it. */
  const onLinkPointerEnter = () => {
    cancelHover();
    cancelClose();
    setOpen(null);
  };

  const onMenuPointerEnter = (i: number, event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    cancelHover();
    cancelClose();
    /*
     * Once one menu is open the nav is "live", and moving along it
     * should track the pointer rather than making you wait out the
     * open delay again at every trigger. The delay is only there to
     * stop a menu opening on a pointer that is passing through.
     */
    if (open !== null) {
      setOpen(i);
      return;
    }
    timer.current = setTimeout(() => setOpen(i), HOVER_DELAY_MS);
  };

  const onTriggerClick = (i: number) => {
    cancelHover();
    cancelClose();
    setOpen(open === i ? null : i);
  };

  return {
    open,
    rootRef,
    triggers,
    panels,
    baseId,
    onRootPointerEnter,
    onRootPointerLeave,
    onRootBlur,
    onLinkPointerEnter,
    onMenuPointerEnter,
    onTriggerClick,
  };
}
