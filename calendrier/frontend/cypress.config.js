/* eslint-env node */
/* eslint-disable no-console */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // IMPORTANT: set baseUrl to where your dev server serves the app
    baseUrl: "http://localhost:5173",

    setupNodeEvents(on, config) {
      on("task", {
        log(message) {
          console.log("[cypress task log]", message);
          return null;
        },
      });
      return config;
    },
  },
});
