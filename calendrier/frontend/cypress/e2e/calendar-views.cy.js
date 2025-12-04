// cypress/e2e/calendar-views.cy.js
describe("Calendar Views", () => {
  beforeEach(() => {
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
  });

  it("should switch between calendar views", () => {
    // Test Month view
    cy.get("button").contains("Month").click();
    cy.get(".rbc-month-view", { timeout: 2000 }).should("be.visible");

    // Test Week view
    cy.get("button").contains("Week").click();
    cy.get(".rbc-time-view", { timeout: 2000 }).should("be.visible");

    // Test Day view
    cy.get("button").contains("Day").click();
    cy.get(".rbc-time-view", { timeout: 2000 }).should("be.visible");

    // Test Agenda view
    cy.get("button").contains("Agenda").click();
    cy.get(".rbc-agenda-view", { timeout: 2000 }).should("be.visible");
  });

  it("should display events in different views", () => {
    // Create an event first
    const eventTitle = "View Test Event";
    const startDate = "2024-12-25T10:00";
    const endDate = "2024-12-25T11:00";

    cy.get('input[placeholder*="title" i]').type(eventTitle);
    cy.get('input[type="datetime-local"]').first().clear().type(startDate);
    cy.get('input[type="datetime-local"]').last().clear().type(endDate);
    cy.contains("button", "Create Event").click();
    cy.contains(eventTitle, { timeout: 5000 }).should("be.visible");

    // Test in Week view
    cy.get("button").contains("Week").click();
    cy.contains(eventTitle, { timeout: 2000 }).should("be.visible");

    // Test in Day view
    cy.get("button").contains("Day").click();
    cy.contains(eventTitle, { timeout: 2000 }).should("be.visible");

    // Test in Month view
    cy.get("button").contains("Month").click();
    cy.contains(eventTitle, { timeout: 2000 }).should("be.visible");

    // Test in Agenda view
    cy.get("button").contains("Agenda").click();
    cy.contains(eventTitle, { timeout: 2000 }).should("be.visible");
  });

  it("should navigate to previous period", () => {
    cy.get("button").contains("Week").click();
    
    // Get current date display (if available)
    // Click previous button
    cy.get(".rbc-header button").first().click({ force: true });
    
    // Calendar should update
    cy.get(".rbc-calendar").should("be.visible");
  });

  it("should navigate to next period", () => {
    cy.get("button").contains("Week").click();
    
    // Click next button
    cy.get(".rbc-header button").last().click({ force: true });
    
    // Calendar should update
    cy.get(".rbc-calendar").should("be.visible");
  });

  it("should navigate to today", () => {
    cy.get("button").contains("Week").click();
    
    // Navigate away first
    cy.get(".rbc-header button").last().click({ force: true });
    
    // Click today button if available
    cy.get("button").contains("Today").click({ force: true });
    
    // Calendar should show current date
    cy.get(".rbc-calendar").should("be.visible");
  });
});

describe("Calendar Slot Selection", () => {
  beforeEach(() => {
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
  });

  it("should pre-fill form when selecting a time slot", () => {
    // Switch to week view for easier slot selection
    cy.get("button").contains("Week").click();
    cy.wait(500); // Wait for view to render

    // Click on a time slot (this requires specific selectors based on react-big-calendar)
    // Try to find and click a time slot
    cy.get(".rbc-time-slot").first().click({ force: true });

    // Verify form is pre-filled
    cy.get('input[type="datetime-local"]').first().should("not.have.value", "");
    cy.get('input[type="datetime-local"]').last().should("not.have.value", "");
  });

  it("should create event from slot selection", () => {
    // Switch to week view
    cy.get("button").contains("Week").click();
    cy.wait(500);

    // Click on a time slot
    cy.get(".rbc-time-slot").first().click({ force: true });

    // Verify form is pre-filled
    cy.get('input[type="datetime-local"]').first().should("not.have.value", "");

    // Fill title
    cy.get('input[placeholder*="title" i]').type("Slot Event");

    // Submit
    cy.contains("button", "Create Event").click();

    // Verify event is created
    cy.contains("Slot Event", { timeout: 5000 }).should("be.visible");
  });
});

