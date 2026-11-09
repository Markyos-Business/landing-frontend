/**
 * markyos.com's whole styling setup, laid out like markyos-frontend's. The CSS
 * entry (src/app/tailwind.css) only loads Tailwind and points here; everything
 * else lives in this file and the modules beside it:
 *
 *   tailwind/tokens.generated.js  the product's tokens and theme mapping,
 *                                 written by `npm run sync:tokens` and never
 *                                 edited here
 *   tailwind/tokens.js            the design system's `--mk-*` layer, and the
 *                                 site's own token names re-pointed onto it
 *   tailwind/base.js              element defaults
 *   tailwind/components/*.js      the `.mk-*` vocabulary, one module per area
 *
 * Every rule is registered with `addBase`, so the whole vocabulary sits below
 * Tailwind's utilities: a utility on an element still beats the class it is
 * refining, which is what lets a card title say `.mk-h3` for its weight and a
 * `text-[…]` for its size without the two fighting. The modules are added in
 * the order the stylesheets were imported in, so a later rule still wins a
 * tie against an earlier one.
 *
 * Content scanning is automatic in Tailwind v4, so there is no `content` list,
 * and no RTL plugin: logical utilities (`ms-*`, `ps-*`, `start-*`) are built in.
 *
 * @type {import("tailwindcss").Config}
 */
import plugin from "tailwindcss/plugin";
import { generatedTheme, generatedTokens } from "./tailwind/tokens.generated.js";
import { designSystemTokens, themeTokens } from "./tailwind/tokens.js";
import { baseStyles } from "./tailwind/base.js";
import { componentStyles } from "./tailwind/components/index.js";

const config = {
  theme: {
    extend: generatedTheme,
  },
  plugins: [
    plugin(({ addBase }) => {
      /*
       * The font defaults preflight reads. Tailwind derives these from a CSS
       * `@theme` block but not from a JS config, and without them <html> fell
       * back to preflight's own system stack. Declared from the same theme
       * values `@theme inline` used, so the page's root font is unchanged.
       */
      addBase({
        ":root, :host": {
          "--font-mono": generatedTheme.fontFamily.mono,
          "--default-font-family": generatedTheme.fontFamily.sans,
          "--default-mono-font-family": generatedTheme.fontFamily.mono,
        },
      });
      addBase(generatedTokens);
      addBase(designSystemTokens);
      addBase(themeTokens);
      addBase(baseStyles);
      for (const styles of componentStyles) addBase(styles);
    }),
  ],
};

export default config;
