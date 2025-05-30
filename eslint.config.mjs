import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // type rules you want
      "@typescript-eslint/no-explicit-any": "off", // Allow the use of 'any' everywhere
      "sonarjs/no-overload-matches-call": "off", // Disable this specific rule
      "no-throw-literal": "off" // Disable the general throw literal rule
    },
  },
];
