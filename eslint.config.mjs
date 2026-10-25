import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /*
       * An underscore means "this parameter is part of the signature and
       * deliberately unused".
       *
       * The content adapters need it: `localContent` implements an interface
       * whose methods take arguments it has nothing to do with yet, and the
       * parameters are what document the shape Payload will have to satisfy.
       * Deleting them to satisfy the linter would delete the documentation.
       */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
