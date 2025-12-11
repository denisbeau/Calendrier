// ***********************************************
// Custom Cypress commands for authentication
// ***********************************************

/**
 * Custom login command that properly authenticates with Supabase
 * This command intercepts Supabase auth calls and mocks the session
 */
Cypress.Commands.add("login", (email = "test@example.com", password = "password123") => {
  // Intercept all Supabase auth endpoints with flexible patterns
  cy.intercept("POST", "**/auth/v1/token**", {
    statusCode: 200,
    body: {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      token_type: "bearer",
      user: {
        id: "user-123",
        email: email,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      },
    },
  }).as("signInWithPassword");

  cy.intercept("GET", "**/auth/v1/user**", {
    statusCode: 200,
    body: {
      id: "user-123",
      email: email,
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    },
  }).as("getUser");

  // Intercept session endpoint
  cy.intercept("GET", "**/auth/v1/**", (req) => {
    if (req.url.includes("session") || req.url.includes("user")) {
      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: "user-123",
            email: email,
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          },
          session: {
            access_token: "mock-access-token",
            refresh_token: "mock-refresh-token",
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: "user-123",
              email: email,
            },
          },
        },
      });
    }
  }).as("authSession");

  // Visit login page
  cy.visit("/login");

  // Fill in credentials
  cy.get('input[type="email"]').should("be.visible").clear().type(email);
  cy.get('input[type="password"]').should("be.visible").clear().type(password);

  // Submit form
  cy.get('button[type="submit"]').click();

  // Wait for the success message
  cy.contains("Logged in.", { timeout: 10000 }).should("be.visible");

  // Wait for navigation to calendar
  cy.url({ timeout: 10000 }).should("include", "/calendar");
  
  // Wait a bit for the app to fully load
  cy.wait(1000);
});

/**
 * Command to navigate to calendar after login
 */
Cypress.Commands.add("visitCalendar", () => {
  cy.visit("/calendar", { timeout: 10000 });
  cy.url().should("include", "/calendar");
});

/**
 * Helper to format date for datetime-local input
 */
Cypress.Commands.add("formatLocalDateTime", (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
});

/**
 * Helper to get tomorrow's date at a specific time
 */
Cypress.Commands.add("getTomorrowAt", (hours = 10, minutes = 0) => {
  return cy.window().then((win) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    return tomorrow;
  });
});
