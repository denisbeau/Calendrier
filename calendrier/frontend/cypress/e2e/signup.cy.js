/* eslint-disable no-undef */
// cypress/e2e/signup.cy.js
// Full end-to-end test: creates mail.tm mailbox, signs up in the app, follows confirmation link, asserts signed-in state.

describe("Signup flow with disposable mailbox (mail.tm)", () => {
  const apiBase = "https://api.mail.tm";
  const randomId = Math.random().toString(36).substring(2, 10);
  const password = "password123";
  let testEmail;
  let token;

  function createDisposableAccount(attempts = 5) {
    return cy
      .request({ url: `${apiBase}/domains`, failOnStatusCode: false })
      .then((resp) => {
        const domains =
          resp.body["hydra:member"] || resp.body?.hydra?.member || resp.body;
        const domain =
          Array.isArray(domains) && domains.length
            ? domains[0].domain
            : "mail.tm";
        testEmail = `cypress-${randomId}@${domain}`;

        return cy.request({
          method: "POST",
          url: `${apiBase}/accounts`,
          body: { address: testEmail, password },
          failOnStatusCode: false,
        });
      })
      .then((r) => {
        // If rate limited, retry a few times
        if ((r.status === 429 || r.status === 503) && attempts > 1) {
          Cypress.log({
            name: "mail.tm",
            message: `Rate limited creating mailbox, retrying... attempts left: ${
              attempts - 1
            }`,
          });
          return cy
            .wait(1500)
            .then(() => createDisposableAccount(attempts - 1));
        }
        if (r.status !== 201 && r.status !== 200) {
          throw new Error(
            `mail.tm account create failed: ${r.status} ${JSON.stringify(
              r.body
            )}`
          );
        }
        Cypress.log({
          name: "mail.tm",
          message: `Created mailbox ${testEmail}`,
        });
        return cy.wrap(r);
      });
  }

  function loginToMailbox(attempts = 6) {
    return cy
      .request({
        method: "POST",
        url: `${apiBase}/token`,
        body: { address: testEmail, password },
        failOnStatusCode: false,
      })
      .then((r) => {
        if ((r.status === 401 || r.status === 429) && attempts > 1) {
          Cypress.log({
            name: "mail.tm",
            message: `mail.tm token retry (status=${r.status})`,
          });
          return cy.wait(1200).then(() => loginToMailbox(attempts - 1));
        }
        if (r.status !== 200 && r.status !== 201) {
          throw new Error(
            `mail.tm token failed: ${r.status} ${JSON.stringify(r.body)}`
          );
        }
        token = r.body.token;
        Cypress.log({ name: "mail.tm", message: "mail.tm token acquired" });
        return cy.wrap(r);
      });
  }

  // Poll mailbox until a message appears
  function waitForEmail({ timeout = 180000, interval = 2000 } = {}) {
    const start = Date.now();
    function poll() {
      return cy
        .request({
          method: "GET",
          url: `${apiBase}/messages`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false,
        })
        .then((r) => {
          if (r.status !== 200) {
            if (Date.now() - start > timeout)
              throw new Error("Timed out polling mailbox (non-200)");
            return cy.wait(interval).then(poll);
          }
          const messages =
            r.body["hydra:member"] || r.body?.hydra?.member || r.body;
          if (Array.isArray(messages) && messages.length > 0) {
            return cy.wrap(messages[0]);
          }
          if (Date.now() - start > timeout)
            throw new Error(
              "Timed out waiting for verification email (empty mailbox)"
            );
          return cy.wait(interval).then(poll);
        });
    }
    return poll();
  }

  function extractLinkFromHtml(html) {
    if (!html) return null;
    // common pattern: href="..." or raw URL
    const hrefMatch = html.match(/href="([^"]+)"/i);
    if (hrefMatch) return hrefMatch[1];
    const href2 = html.match(/https?:\/\/[^\s"'<>]+/i);
    return href2 ? href2[0] : null;
  }

  it("creates mailbox, signs up, follows verification link and is signed in", () => {
    createDisposableAccount()
      .then(() => loginToMailbox())
      .then(() => {
        // Visit the app (ensure baseUrl set in cypress.config.js or use full URL)
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit("/");

        // Open signup form: try common selectors/texts
        cy.get("button.view-btn", { timeout: 10000 }).then(($btns) => {
          const found = [...$btns].find((b) => /sign up/i.test(b.innerText));
          if (found) return cy.wrap(found).click();
          return cy
            .contains(/^Sign up$/i, { timeout: 8000 })
            .click({ force: true });
        });

        // Fill form with a small delay to avoid flakiness
        cy.get('input[placeholder="Your full name"]', { timeout: 10000 })
          .should("be.visible")
          .clear()
          .type(`Cypress Test ${randomId}`, { delay: 10 });

        cy.get('input[placeholder="you@example.com"]')
          .clear()
          .type(testEmail, { delay: 10 })
          .should("have.value", testEmail);

        // Password fields (support one or two password inputs)
        cy.get('input[placeholder="At least 6 characters"]', {
          timeout: 8000,
        }).then(($inputs) => {
          if ($inputs.length === 0) throw new Error("No password input found");
          cy.wrap($inputs[0]).type(password, { log: false });
          if ($inputs.length > 1)
            cy.wrap($inputs[1]).type(password, { log: false });
        });

        // Submit signup
        cy.contains(/^Sign up$/i, { timeout: 8000 }).click();

        // App should show a "check your email" / success message
        cy.contains(/Sign-?up succeeded|Check your email|verification email/i, {
          timeout: 20000,
        }).should("exist");

        // Now poll mailbox for verification email
        return waitForEmail({ timeout: 180000, interval: 2000 });
      })
      .then((msg) => {
        // fetch full message and follow confirmation link
        return cy.request({
          method: "GET",
          url: `${apiBase}/messages/${msg.id}`,
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((full) => {
        const html = full.body.html || full.body.text || "";
        const link = extractLinkFromHtml(html);
        expect(link, "confirmation link found").to.be.a("string");

        // Visit the confirmation link
        cy.visit(link);

        // After following the link the app should show a signed-in state
        cy.contains(/signed in|logged in|welcome|signed in as/i, {
          timeout: 15000,
        }).should("exist");

        // Optionally assert the user email is visible in UI
        cy.contains(testEmail).should("exist");
      });
  });
});
