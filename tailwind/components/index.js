/*
 * The site's component styles, one module per area, in cascade order.
 * tailwind.config.js registers each with addBase in this order, so a later
 * area still wins a tie against an earlier one, as it did as one stylesheet.
 */
import { foundationStyles } from "./foundation.js";
import { layoutStyles } from "./layout.js";
import { proseStyles } from "./prose.js";
import { bidiStyles } from "./bidi.js";
import { designLanguageStyles } from "./design-language.js";
import { typeStyles } from "./type.js";
import { controlsStyles } from "./controls.js";
import { webExplorerStyles } from "./web-explorer.js";
import { pageBlocksStyles } from "./page-blocks.js";
import { widgetsStyles } from "./widgets.js";
import { buttonsStyles } from "./buttons.js";
import { navStyles } from "./nav.js";
import { heroStyles } from "./hero.js";
import { disclosureStyles } from "./disclosure.js";
import { editorialStyles } from "./editorial.js";
import { motionStyles } from "./motion.js";
import { transitionStyles } from "./transition.js";

export const componentStyles = [
  foundationStyles,
  layoutStyles,
  proseStyles,
  bidiStyles,
  designLanguageStyles,
  typeStyles,
  controlsStyles,
  webExplorerStyles,
  pageBlocksStyles,
  widgetsStyles,
  buttonsStyles,
  navStyles,
  heroStyles,
  disclosureStyles,
  editorialStyles,
  motionStyles,
  transitionStyles,
];
