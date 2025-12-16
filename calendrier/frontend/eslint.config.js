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
  globalIgnores(["dist", "_sokrates/**", "coverage/**", "node_modules/**"]),

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
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": "warn",
    },
  },

  // Cypress spec/support files — allow Cypress globals and browser APIs
  {
    files: ["cypress/**/*.js", "cypress/**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { 
        ...globals.browser, 
        ...globals.mocha,
        Cypress: "readonly", 
        cy: "readonly",
        expect: "readonly",
      },
      parserOptions: moduleParserOptions,
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { varsIgnorePattern: "^(win|_)" }],
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
      "no-console": "off",
    },
  },

  // Test files (Vitest, Jest)
  {
    files: ["**/*.test.{js,jsx}", "**/__tests__/**/*.{js,jsx}", "src/setupTests.js", "vitest.config.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node, global: "readonly" },
      parserOptions: moduleParserOptions,
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^(result|expected|_)" }],
      "react-refresh/only-export-components": "off",
    },
  },

  // Server/Node files
  {
    files: ["src/server/**/*.js", "vite.config.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node, process: "readonly", __dirname: "readonly" },
      parserOptions: moduleParserOptions,
    },
    rules: {
      "no-console": "off",
    },
  },
]);
