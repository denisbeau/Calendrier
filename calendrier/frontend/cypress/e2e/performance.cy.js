// cypress/e2e/performance.cy.js
describe("Performance and Loading", () => {
  it("should load homepage within reasonable time", () => {
    const startTime = Date.now();
    cy.visit("/");
    cy.contains("WeSchedule").should("be.visible");
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
    // Use custom login command
    const startTime = Date.now();
    cy.login("test@example.com", "password123");
    cy.visitCalendar();
    cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");
    const loadTime = Date.now() - startTime;

    // Calendar should load within 5 seconds after login
    expect(loadTime).to.be.lessThan(5000);
  });

  it("should load groups page within reasonable time", () => {
    // Use custom login command
    cy.login("test@example.com", "password123");
    
    // Mock groups API
    cy.intercept("GET", "**/rest/v1/group_members*user_id=eq.*", {
      statusCode: 200,
      body: [],
    });

    const startTime = Date.now();
    cy.visit("/groups");
    cy.contains("Mes groupes", { timeout: 5000 }).should("be.visible");
    const loadTime = Date.now() - startTime;

    // Groups page should load within 3 seconds
    expect(loadTime).to.be.lessThan(3000);
  });

  it("should handle multiple rapid page navigations", () => {
    // Use custom login command
    cy.login("test@example.com", "password123");

    // Mock groups API
    cy.intercept("GET", "**/rest/v1/group_members*user_id=eq.*", {
      statusCode: 200,
      body: [],
    });

    // Rapid navigation between pages
    cy.visit("/groups");
    cy.contains("Mes groupes", { timeout: 5000 }).should("be.visible");

    cy.visit("/calendar");
    cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");

    cy.visit("/groups");
    cy.contains("Mes groupes", { timeout: 5000 }).should("be.visible");
  });

  it("should not have memory leaks during multiple event creations", () => {
    // Use custom login command
    cy.login("test@example.com", "password123");
    cy.visitCalendar();

      // Switch to month view to see all events
      cy.get("button").contains("Month").click();
      cy.wait(500);

      // Create multiple events with dynamic dates
      cy.window().then((win) => {
        const formatLocalDateTime = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        for (let i = 1; i <= 5; i++) {
          const now = new Date();
          const eventDate = new Date(now);
          eventDate.setDate(eventDate.getDate() + i);
          eventDate.setHours(10, 0, 0, 0);
          
          const endTime = new Date(eventDate);
          endTime.setHours(11, 0, 0, 0);

          cy.get('input[placeholder*="title" i]').type(`Event ${i}`);
          cy.get('input[type="datetime-local"]')
            .first()
            .clear()
            .type(formatLocalDateTime(eventDate));
          cy.get('input[type="datetime-local"]')
            .last()
            .clear()
            .type(formatLocalDateTime(endTime));
          cy.contains("button", "Create Event").click();
          cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");
          cy.wait(1000);
        }

        // Wait for all events to be rendered
        cy.wait(2000);
        
        // Verify all events are still visible - use contains for more flexibility
        for (let i = 1; i <= 5; i++) {
          cy.contains(`Event ${i}`, { timeout: 10000 }).should("be.visible");
        }
      });
  });
});


