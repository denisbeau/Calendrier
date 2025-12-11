// cypress/e2e/navigation.cy.js
describe("Protected Routes", () => {
  it("should redirect to login when accessing /calendar without authentication", () => {
    cy.visit("/calendar");
    cy.url().should("include", "/login");
  });

  it("should redirect to login when accessing /groups without authentication", () => {
    cy.visit("/groups");
    cy.url().should("include", "/login");
  });

  it("should allow access to protected routes after login", () => {
    // Use custom login command
    cy.login("test@example.com", "password123");
    cy.visitCalendar();
    cy.url({ timeout: 5000 }).should("include", "/calendar");
  });

  it("should allow access to /groups after login", () => {
    // Use custom login command
    cy.login("test@example.com", "password123");
    cy.visit("/groups");
    cy.url({ timeout: 5000 }).should("include", "/groups");
  });
});

