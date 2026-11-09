#!/usr/bin/env node
/*
 * Can the dropdowns actually be opened with a mouse?
 *
 * This exists because they could not, and nothing caught it. Both panels hang
 * below their trigger with a gap — 8px under Resources, 14px under Solutions,
 * which is the header's own padding — and that gap belongs to no element. The
 * nav closed on `pointerleave`, so moving from a trigger towards its panel
 * left the nav's subtree and fired a close 2px into a 14px journey. The menu
 * vanished before the pointer was halfway to it.
 *
 * Every static check passed the whole time. It typechecks, it lints, the links
 * are in the DOM, the panel has the right aria wiring, and a screenshot of an
 * open menu looks correct — because a screenshot is taken with the pointer
 * parked on the trigger. The bug only exists in the half-second between
 * wanting the menu and reaching it, which is a thing you find by moving a
 * pointer, or by a person telling you the nav is broken.
 *
 * So this walks the pointer from each trigger to the first link inside its
 * panel, in small steps, the way a hand does, and fails if the panel
 * disappears on the way. It also checks the opposite — that leaving really
 * does close it — because a menu that never closes is the other bug.
 *
 *   node scripts/check-nav.mjs            exits 1 on any failure
 *
 * Run against a built server (see check:live). It drives the real page, so it
 * catches a CSS change that opens a new gap just as well as a JS one.
 */

import { launch, BASE, assertServerUp } from "./browser-lib.mjs";

/* Both editions: the panels mirror, and a bug can live in only one of them. */
const PAGES = ["/", "/en"];

/* Enough steps that the pointer lands inside the gap rather than stepping
   over it. A single jump would pass against the broken build. */
const STEPS = 14;
const STEP_PAUSE_MS = 18;

/* Longer than nav/useNavMenus.ts's CLOSE_DELAY_MS, so "it closed" means closed. */
const SETTLE_MS = 600;

const problems = [];

const browser = await launch();

try {
  await assertServerUp();

  for (const path of PAGES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const triggers = await page.$$("header button[aria-controls]");
    let checked = 0;

    for (const trigger of triggers) {
      const triggerBox = await trigger.boundingBox();
      // Not laid out at this width — the phone menu's button. Not ours.
      if (!triggerBox) continue;

      const label = (await trigger.innerText()).trim().replace(/\s+/g, " ");
      const panelId = await trigger.getAttribute("aria-controls");
      const panel = await page.$(`[id="${panelId}"]`);
      const where = `${path} · ${label}`;

      if (!panel) {
        problems.push(`${where}: aria-controls names #${panelId}, which is not in the page`);
        continue;
      }
      checked++;

      const from = {
        x: triggerBox.x + triggerBox.width / 2,
        y: triggerBox.y + triggerBox.height / 2,
      };

      await page.mouse.move(from.x, from.y);
      await page.waitForTimeout(400);

      if (!(await panel.isVisible())) {
        problems.push(`${where}: does not open on hover`);
        continue;
      }

      const link = await panel.$("a");
      if (!link) {
        problems.push(`${where}: panel opened but holds no links`);
        continue;
      }
      const linkBox = await link.boundingBox();
      const to = { x: linkBox.x + linkBox.width / 2, y: linkBox.y + linkBox.height / 2 };

      /* The journey. */
      let closedAt = null;
      for (let step = 1; step <= STEPS; step++) {
        const t = step / STEPS;
        await page.mouse.move(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
        await page.waitForTimeout(STEP_PAUSE_MS);
        if (!(await panel.isVisible())) {
          closedAt = Math.round(t * 100);
          break;
        }
      }

      if (closedAt !== null) {
        problems.push(
          `${where}: closed ${closedAt}% of the way from the trigger to its first link — unreachable by mouse`,
        );
        continue;
      }

      /* Resting on a link must not close it either. */
      await page.waitForTimeout(SETTLE_MS);
      if (!(await panel.isVisible())) {
        problems.push(`${where}: closed while the pointer rested on a link`);
        continue;
      }

      /*
       * And leaving must close it. Measured against the panel's own box —
       * the mega panel is 1440x595, so an arbitrary "somewhere else" is
       * usually still inside it.
       */
      const panelBox = await panel.boundingBox();
      await page.mouse.move(panelBox.x + panelBox.width - 4, panelBox.y + panelBox.height + 60);
      await page.waitForTimeout(SETTLE_MS);
      if (await panel.isVisible()) {
        problems.push(`${where}: did not close after the pointer left it`);
      }
    }

    if (checked === 0) problems.push(`${path}: found no dropdown triggers to check`);
    await page.close();
  }

  /*
   * The phone menu, which until now nothing checked at all.
   *
   * It opened and could not be closed. MobileNav renders inside the header,
   * so its panel is the toggle's own sibling; the panel was positioned and
   * the toggle was not, so the panel painted in front of the one control
   * that dismisses it. Its top edge was a hard-coded 56px described as the
   * header's height, while the header is 64px and sits below an
   * announcement bar — so the panel started about 100px too high and lay
   * over the header. With no Escape key on a phone, the only way out of the
   * menu was to follow a link somewhere you had not chosen to go.
   *
   * Tested the way a finger works: ask what is topmost at the middle of the
   * button, then tap that point and see whether the menu actually closed.
   * Checking `isVisible` on the toggle would have passed against the broken
   * build, because the button was visible the whole time — just buried.
   */
  for (const path of PAGES) {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    const toggle = page.locator("header button[aria-controls]:visible").first();
    if ((await toggle.count()) === 0) {
      problems.push(`${path} (phone): found no menu button`);
      await context.close();
      continue;
    }

    await toggle.click();
    await page.waitForTimeout(400);

    if ((await toggle.getAttribute("aria-expanded")) !== "true") {
      problems.push(`${path} (phone): the menu did not open`);
    }

    const covered = await toggle.evaluate((el) => {
      const b = el.getBoundingClientRect();
      const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      return !(hit === el || el.contains(hit));
    });
    if (covered) {
      problems.push(`${path} (phone): the open panel covers the button that closes it`);
    }

    const box = await toggle.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(400);
    if ((await toggle.getAttribute("aria-expanded")) !== "false") {
      problems.push(`${path} (phone): tapping the toggle again did not close the menu`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} navigation problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error("\n  See the header note in src/components/navbar/nav/Nav.tsx: opening is");
  console.error("  delayed, closing is delayed longer, and the close is cancelled by");
  console.error("  re-entering the nav — which is what makes the gap crossable.\n");
  process.exit(1);
}

console.log(`\n✓ ${PAGES.length} editions: dropdowns reachable by mouse, phone menu opens and closes.`);
