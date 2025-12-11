// cypress/e2e/calendar-events.cy.js
describe("Calendar Events - Creation", () => {
  beforeEach(() => {
    // Use custom login command
    cy.login("test@example.com", "password123");
    cy.visitCalendar();
  });

  it("should create a new event with all fields", () => {
    const eventTitle = "Test Event";
    
    // Use current date + 1 day to ensure event is visible
    // Format dates in local timezone for datetime-local input
    cy.window().then((win) => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0, 0);
      
      // Format for datetime-local input (YYYY-MM-DDTHH:mm)
      const formatLocalDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      
      const startDateStr = formatLocalDateTime(tomorrow);
      const endDateStr = formatLocalDateTime(endTime);

      // Switch to month view to see the event
      cy.get("button").contains("Month").click();
      cy.wait(500);

      // Fill form
      cy.get('input[placeholder*="title" i]').type(eventTitle);
      cy.get('input[type="datetime-local"]').first().clear().type(startDateStr);
      cy.get('input[type="datetime-local"]').last().clear().type(endDateStr);

      // Submit
      cy.contains("button", "Create Event").click();

      // Wait for form to reset (indicates event was created)
      cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");

      // Verify event appears in calendar
      // React Big Calendar renders events in .rbc-event elements
      cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");
      cy.get(".rbc-event", { timeout: 5000 }).should("exist");
      // Look for event title in the calendar - it might be in .rbc-event-content or directly in .rbc-event
      cy.get(".rbc-event", { timeout: 5000 }).contains(eventTitle).should("be.visible");
    });

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
    // Ensure start date field is empty
    cy.get('input[type="datetime-local"]').first().clear();
    // Ensure end date field is empty too
    cy.get('input[type="datetime-local"]').last().clear();
    cy.contains("button", "Create Event").click();
    // Check for error message - "Start time is required"
    cy.contains("Start time is required", { timeout: 4000 }).should('be.visible');
  });

  it("should show error when end date is empty", () => {
    cy.get('input[placeholder*="title" i]').type("Test Event");
    cy.get('input[type="datetime-local"]').first().clear().type("2024-12-25T10:00");
    // Ensure end date field is empty
    cy.get('input[type="datetime-local"]').last().clear();
    cy.contains("button", "Create Event").click();
    // Check for error message - "End time is required"
    cy.contains("End time is required", { timeout: 4000 }).should('be.visible');
  });
});

describe("Calendar Events - Editing", () => {
  beforeEach(() => {
    // Use custom login command
    cy.login("test@example.com", "password123");
    cy.visitCalendar();

    // Create an event first using current date
    cy.window().then((win) => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0, 0);
      
      const formatLocalDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      
      const eventTitle = "Test Event";
      const startDate = formatLocalDateTime(tomorrow);
      const endDate = formatLocalDateTime(endTime);

      cy.get('input[placeholder*="title" i]').type(eventTitle);
      cy.get('input[type="datetime-local"]').first().clear().type(startDate);
      cy.get('input[type="datetime-local"]').last().clear().type(endDate);
      cy.contains("button", "Create Event").click();
      
      // Wait for form to reset
      cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");
      
      // Verify event appears
      cy.get(".rbc-event", { timeout: 5000 }).contains("Test Event").should("be.visible");
    });
  });

  it("should edit an existing event", () => {
    // Switch to month view to see the event better
    cy.get("button").contains("Month").click();
    cy.wait(1500);
    
    // Wait for event to be visible and scroll to it
    cy.contains("Test Event", { timeout: 10000 }).scrollIntoView().should("be.visible");
    
    // Click on event in calendar - try different approaches
    cy.get("body").then(($body) => {
      const eventElement = $body.find(".rbc-event").filter((i, el) => {
        return Cypress.$(el).text().includes("Test Event");
      }).first();
      
      if (eventElement.length > 0) {
        cy.wrap(eventElement).click({ force: true });
      } else {
        // Fallback: click anywhere on the event text
        cy.contains("Test Event").click({ force: true });
      }
    });

    // Verify form is populated
    cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "Test Event");

    // Modify title
    cy.get('input[placeholder*="title" i]').clear().type("Updated Event");

    // Submit
    cy.contains("button", "Update Event").click();

    // Wait for form to reset (indicates update was processed)
    cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");
    
    // Wait a bit for React to update the calendar
    cy.wait(2000);
    
    // Refresh the calendar view to force re-render
    cy.get("button").contains("Week").click();
    cy.wait(1000);
    cy.get("button").contains("Month").click();
    cy.wait(2000);
    
    // Now check for the updated event - use a more flexible approach
    cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");
    
    // Check that "Updated Event" appears somewhere in the calendar
    cy.get("body", { timeout: 15000 }).should("contain", "Updated Event");
    
    // Verify old event is gone - check in .rbc-event elements
    cy.get(".rbc-event").should("not.contain", "Test Event");
  });

  it("should cancel editing an event", () => {
    // Click on event in calendar - use force to handle overlay issues
    cy.get(".rbc-event").contains("Test Event").click({ force: true });

    // Verify form is populated
    cy.get('input[placeholder*="title" i]').should("have.value", "Test Event");

    // Modify title
    cy.get('input[placeholder*="title" i]').clear().type("Modified Event");

    // Click cancel
    cy.contains("button", "Cancel").click();

    // Verify form is reset
    cy.get('input[placeholder*="title" i]').should("have.value", "");

    // Verify original event still exists
    cy.get(".rbc-event").contains("Test Event").should("be.visible");
    cy.get(".rbc-event").should("not.contain", "Modified Event");
  });
});

describe("Calendar Events - Deletion", () => {
  beforeEach(() => {
    // Auto-accept window.confirm dialogs for all tests in this suite
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });
    
    // Use custom login command
    cy.login("test@example.com", "password123");
    cy.visitCalendar();

    // Create an event first using current date
    cy.window().then((win) => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0, 0);
      
      const formatLocalDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      
      const eventTitle = "Event To Delete";
      const startDate = formatLocalDateTime(tomorrow);
      const endDate = formatLocalDateTime(endTime);

      cy.get('input[placeholder*="title" i]').type(eventTitle);
      cy.get('input[type="datetime-local"]').first().clear().type(startDate);
      cy.get('input[type="datetime-local"]').last().clear().type(endDate);
      cy.contains("button", "Create Event").click();
      
      // Wait for form to reset
      cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");
      
      // Verify event appears
      cy.get(".rbc-event", { timeout: 5000 }).contains("Event To Delete").should("be.visible");
    });
  });

  it("should delete an event", () => {
    // Switch to month view to see the event better
    cy.get("button").contains("Month").click();
    cy.wait(1500);
    
    // Wait for event to be visible and scroll to it
    cy.contains("Event To Delete", { timeout: 10000 }).scrollIntoView().should("be.visible");
    
    // Verify event exists in calendar before deletion
    cy.get(".rbc-event").contains("Event To Delete", { timeout: 5000 }).should("be.visible");
    
    // Click on event in calendar - try different approaches
    cy.get("body").then(($body) => {
      const eventElement = $body.find(".rbc-event").filter((i, el) => {
        return Cypress.$(el).text().includes("Event To Delete");
      }).first();
      
      if (eventElement.length > 0) {
        cy.wrap(eventElement).click({ force: true });
      } else {
        // Fallback: click anywhere on the event text
        cy.contains("Event To Delete").click({ force: true });
      }
    });

    // Wait for form to be populated
    cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "Event To Delete");

    // Re-stub window.confirm just before clicking delete to ensure it's active
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    // Click delete button
    cy.contains("button", "Delete Event").click();

    // Wait for deletion to complete and form to reset
    cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");
    
    // Wait a bit for React to update the calendar
    cy.wait(2000);
    
    // Refresh the calendar view to force re-render
    cy.get("button").contains("Week").click();
    cy.wait(1000);
    cy.get("button").contains("Month").click();
    cy.wait(2000);
    
    // Verify event is removed - check that it's not in the calendar
    // Simply check that "Event To Delete" is not in the body
    // This works whether there are other events or not
    cy.get("body", { timeout: 10000 }).should("not.contain", "Event To Delete");
    
    // Also verify the calendar is still visible (deletion didn't break the UI)
    cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");
  });
});

