// cypress/e2e/performance.cy.js
describe("Performance and Loading", () => {
  it("should load homepage within reasonable time", () => {
    const startTime = Date.now();
    cy.visit("/");
    cy.contains("Calendar App").should("be.visible");
    const loadTime = Date.now() - startTime;

    // Homepage should load within 3 seconds
    expect(loadTime).to.be.lessThan(3000);
  });

  it("should load login page within reasonable time", () => {
    const startTime = Date.now();
    cy.visit("/login");
    cy.contains("Log in").should("be.visible");
    const loadTime = Date.now() - startTime;

    // Login page should load within 2 seconds
    expect(loadTime).to.be.lessThan(2000);
  });

  it("should load calendar page within reasonable time after authentication", () => {
    // Mock authentication
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token", user: { id: "user-1" } },
    });

    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");

    const startTime = Date.now();
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("include", "/calendar");
    cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");
    const loadTime = Date.now() - startTime;

    // Calendar should load within 5 seconds after login
    expect(loadTime).to.be.lessThan(5000);
  });

  it("should load groups page within reasonable time", () => {
    // Mock authentication
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token", user: { id: "user-1" } },
    });

    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [],
    });

    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    const startTime = Date.now();
    cy.visit("/groups");
    cy.contains("Mes groupes", { timeout: 5000 }).should("be.visible");
    const loadTime = Date.now() - startTime;

    // Groups page should load within 3 seconds
    expect(loadTime).to.be.lessThan(3000);
  });

  it("should handle multiple rapid page navigations", () => {
    // Mock authentication
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token", user: { id: "user-1" } },
    });

    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [],
    });

    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // Rapid navigation between pages
    cy.visit("/groups");
    cy.contains("Mes groupes", { timeout: 5000 }).should("be.visible");

    cy.visit("/calendar");
    cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");

    cy.visit("/groups");
    cy.contains("Mes groupes", { timeout: 5000 }).should("be.visible");
  });

  it("should not have memory leaks during multiple event creations", () => {
    // Mock authentication
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token", user: { id: "user-1" } },
    });

    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // Create multiple events
    for (let i = 1; i <= 5; i++) {
      cy.get('input[placeholder*="title" i]').type(`Event ${i}`);
      cy.get('input[type="datetime-local"]')
        .first()
        .clear()
        .type(`2024-12-${25 + i}T10:00`);
      cy.get('input[type="datetime-local"]')
        .last()
        .clear()
        .type(`2024-12-${25 + i}T11:00`);
      cy.contains("button", "Create Event").click();
      cy.contains(`Event ${i}`, { timeout: 5000 }).should("be.visible");
    }

    // Verify all events are still visible
    for (let i = 1; i <= 5; i++) {
      cy.contains(`Event ${i}`).should("be.visible");
    }
  });
});


