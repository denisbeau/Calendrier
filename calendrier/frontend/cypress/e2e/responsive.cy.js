// cypress/e2e/responsive.cy.js
describe("Responsive Design", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    it(`should display correctly on ${name}`, () => {
      cy.viewport(width, height);
      cy.visit("/");
      cy.contains("Calendar App").should("be.visible");
    });
  });

  it("should display login page correctly on mobile", () => {
    cy.viewport(375, 667);
    cy.visit("/login");
    cy.contains("Log in").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
  });

  it("should display calendar page correctly on tablet", () => {
    // Mock authentication
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token", user: { id: "user-1" } },
    });

    cy.viewport(768, 1024);
    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // Verify calendar is visible
    cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");
  });

  it("should display groups page correctly on desktop", () => {
    // Mock authentication
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token", user: { id: "user-1" } },
    });

    cy.viewport(1920, 1080);
    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // Navigate to groups
    cy.visit("/groups");
    cy.contains("Mes groupes").should("be.visible");
  });

  it("should allow form interaction on mobile viewport", () => {
    cy.viewport(375, 667);
    cy.visit("/signup");

    // Verify form elements are accessible
    cy.get('input[placeholder*="Your full name" i]').should("be.visible");
    cy.get('input[placeholder*="you@example.com" i]').should("be.visible");
    cy.get('input[placeholder*="At least 6 characters" i]').should("be.visible");

    // Test typing
    cy.get('input[placeholder*="you@example.com" i]').type("test@example.com");
    cy.get('input[placeholder*="you@example.com" i]').should(
      "have.value",
      "test@example.com"
    );
  });
});


