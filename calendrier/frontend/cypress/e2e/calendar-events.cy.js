// cypress/e2e/calendar-events.cy.js
describe("Calendar Events - Creation", () => {
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

  it("should create a new event with all fields", () => {
    const eventTitle = "Test Event";
    const startDate = "2024-12-25T10:00";
    const endDate = "2024-12-25T11:00";

    // Fill form
    cy.get('input[placeholder*="title" i]').type(eventTitle);
    cy.get('input[type="datetime-local"]').first().clear().type(startDate);
    cy.get('input[type="datetime-local"]').last().clear().type(endDate);

    // Submit
    cy.contains("button", "Create Event").click();

    // Verify event appears in calendar
    cy.contains(eventTitle, { timeout: 5000 }).should("be.visible");

    // Verify form is reset
    cy.get('input[placeholder*="title" i]').should("have.value", "");
  });

  it("should show validation errors for empty required fields", () => {
    cy.contains("button", "Create Event").click();
    cy.contains("Event title is required").should("be.visible");
  });

  it("should show error when end date is before start date", () => {
    cy.get('input[placeholder*="title" i]').type("Test Event");
    cy.get('input[type="datetime-local"]').first().type("2024-12-25T11:00");
    cy.get('input[type="datetime-local"]').last().type("2024-12-25T10:00");
    cy.contains("button", "Create Event").click();
    cy.contains("End time must be after start time").should("be.visible");
  });

  it("should show error when start date is empty", () => {
    cy.get('input[placeholder*="title" i]').type("Test Event");
    cy.contains("button", "Create Event").click();
    cy.contains("Start time is required").should("be.visible");
  });

  it("should show error when end date is empty", () => {
    cy.get('input[placeholder*="title" i]').type("Test Event");
    cy.get('input[type="datetime-local"]').first().type("2024-12-25T10:00");
    cy.contains("button", "Create Event").click();
    cy.contains("End time is required").should("be.visible");
  });
});

describe("Calendar Events - Editing", () => {
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

    // Create an event first
    const eventTitle = "Test Event";
    const startDate = "2024-12-25T10:00";
    const endDate = "2024-12-25T11:00";

    cy.get('input[placeholder*="title" i]').type(eventTitle);
    cy.get('input[type="datetime-local"]').first().clear().type(startDate);
    cy.get('input[type="datetime-local"]').last().clear().type(endDate);
    cy.contains("button", "Create Event").click();
    cy.contains(eventTitle, { timeout: 5000 }).should("be.visible");
  });

  it("should edit an existing event", () => {
    // Click on event in calendar
    cy.contains("Test Event").click();

    // Verify form is populated
    cy.get('input[placeholder*="title" i]').should("have.value", "Test Event");

    // Modify title
    cy.get('input[placeholder*="title" i]').clear().type("Updated Event");

    // Submit
    cy.contains("button", "Update Event").click();

    // Verify event is updated
    cy.contains("Updated Event", { timeout: 5000 }).should("be.visible");
    cy.contains("Test Event").should("not.exist");
  });

  it("should cancel editing an event", () => {
    // Click on event
    cy.contains("Test Event").click();

    // Verify form is populated
    cy.get('input[placeholder*="title" i]').should("have.value", "Test Event");

    // Modify title
    cy.get('input[placeholder*="title" i]').clear().type("Modified Event");

    // Click cancel
    cy.contains("button", "Cancel").click();

    // Verify form is reset
    cy.get('input[placeholder*="title" i]').should("have.value", "");

    // Verify original event still exists
    cy.contains("Test Event").should("be.visible");
    cy.contains("Modified Event").should("not.exist");
  });
});

describe("Calendar Events - Deletion", () => {
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

    // Create an event first
    const eventTitle = "Event To Delete";
    const startDate = "2024-12-25T10:00";
    const endDate = "2024-12-25T11:00";

    cy.get('input[placeholder*="title" i]').type(eventTitle);
    cy.get('input[type="datetime-local"]').first().clear().type(startDate);
    cy.get('input[type="datetime-local"]').last().clear().type(endDate);
    cy.contains("button", "Create Event").click();
    cy.contains(eventTitle, { timeout: 5000 }).should("be.visible");
  });

  it("should delete an event", () => {
    // Click on event
    cy.contains("Event To Delete").click();

    // Click delete button
    cy.contains("button", "Delete Event").click();

    // Verify event is removed
    cy.contains("Event To Delete").should("not.exist");

    // Verify form is reset
    cy.get('input[placeholder*="title" i]').should("have.value", "");
  });
});

