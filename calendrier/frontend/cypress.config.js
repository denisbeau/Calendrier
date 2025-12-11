/* eslint-env node */
/* eslint-disable no-console */
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);
  
  // Configure preprocessor for both .feature (Cucumber) and .js/.jsx files
  // The createEsbuildPlugin handles .feature files specially
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
      define: {
        "process.env.NODE_ENV": '"test"',
      },
    })
  );

  on("task", {
    log(message) {
      console.log("[cypress task log]", message);
      return null;
    },
  });
  
  return config;
}

module.exports = defineConfig({
  e2e: {
    // IMPORTANT: set baseUrl to where your dev server serves the app
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.{js,jsx,feature}",
    setupNodeEvents,
  },
});
