/* eslint-env cypress */
// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// catch uncaught exceptions from the AUT so they don't fail the test
Cypress.on("uncaught:exception", (err) => {
  // log to the browser console (visible in Cypress headed mode)
  // eslint-disable-next-line no-console
  console.error("Uncaught exception in app:", err.message, err.stack);

  // returning false prevents Cypress from failing the test
  return false;
});
