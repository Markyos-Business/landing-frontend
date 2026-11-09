/**
 * The Payload admin's styling: the website's token names and the Markyos skin
 * that re-points Payload's theme variables onto them (tailwind/admin.js says
 * why the admin follows the website's palette).
 *
 * A separate config because the admin is a separate root layout with
 * Payload's own stylesheet. Its entry (src/app/(payload)/admin.css) loads
 * only this config — no preflight, no utilities — so nothing of Tailwind's
 * reaches Payload's UI except these rules, in `@layer base`. Payload declares
 * its `payload-default` and `payload` layers first, so this layer comes after
 * them and the skin wins the ties it has to, as the old stylesheet did.
 *
 * @type {import("tailwindcss").Config}
 */
import plugin from "tailwindcss/plugin";
import { themeTokens } from "./tailwind/tokens.js";
import { adminStyles } from "./tailwind/admin.js";

const config = {
  plugins: [
    plugin(({ addBase }) => {
      addBase(themeTokens);
      addBase(adminStyles);
    }),
  ],
};

export default config;
