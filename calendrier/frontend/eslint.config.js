import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

// Shared parser options for ES modules with JSX
const moduleParserOptions = {
  ecmaVersion: "latest",
  ecmaFeatures: { jsx: true },
  sourceType: "module",
};

export default defineConfig([
  globalIgnores(["dist"]),

  // Default app rules (your existing config)
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: moduleParserOptions,
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },

  // Cypress spec/support files — allow Cypress globals and browser APIs
  {
    files: ["cypress/**/*.js", "cypress/**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, Cypress: "readonly", cy: "readonly" },
      parserOptions: moduleParserOptions,
    },
    rules: {
      // allow console in Cypress support if you want
      "no-console": "off",
    },
  },

  // Cypress config file runs in Node / CommonJS
  {
    files: ["cypress.config.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
      },
    },
    rules: {
      // allow console in config files
      "no-console": "off",
    },
  },
]);
