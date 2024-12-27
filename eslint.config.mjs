import globals from "globals";
import eslintJs from "@eslint/js";
import typescriptEslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["dist/*"],
  },
  eslintJs.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script",
    },
  },
  {
    files: ["webpack.config.js"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
