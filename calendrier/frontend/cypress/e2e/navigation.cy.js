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
    // Mock successful login
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: {
        access_token: "test-token",
        user: { id: "user-1", email: "test@example.com" },
      },
    }).as("login");

    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait("@login");
    cy.url({ timeout: 5000 }).should("include", "/calendar");
  });

  it("should allow access to /groups after login", () => {
    // Mock successful login
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: {
        access_token: "test-token",
        user: { id: "user-1", email: "test@example.com" },
      },
    }).as("login");

    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait("@login");
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // Navigate to groups
    cy.visit("/groups");
    cy.url().should("include", "/groups");
  });
});

