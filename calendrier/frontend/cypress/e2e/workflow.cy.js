// cypress/e2e/workflow.cy.js
describe("Complete Workflow", () => {
  it("should complete full event lifecycle in a group", () => {
    // 1. Login
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token", user: { id: "user-1" } },
    });

    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // 2. Create group
    cy.visit("/groups");
    cy.intercept("POST", "**/api/groups", {
      statusCode: 201,
      body: {
        group: { id: "group-1", name: "Workflow Group" },
        invite_code: "WORKFL",
      },
    }).as("createGroup");

    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [
        {
          group: { id: "group-1", name: "Workflow Group", description: null },
          role: "admin",
        },
      ],
    }).as("fetchGroups");

    cy.get('input[placeholder*="Nom du groupe" i]').type("Workflow Group");
    cy.contains("button", "Créer").click();
    cy.wait("@createGroup");
    cy.wait("@fetchGroups");

    // 3. Navigate to group calendar
    cy.contains("button", "Voir calendrier").click();
    cy.url({ timeout: 5000 }).should("include", "groupId=group-1");

    // 4. Create event
    cy.get('input[placeholder*="title" i]').type("Workflow Event");
    cy.get('input[type="datetime-local"]')
      .first()
      .clear()
      .type("2024-12-25T10:00");
    cy.get('input[type="datetime-local"]')
      .last()
      .clear()
      .type("2024-12-25T11:00");
    cy.contains("button", "Create Event").click();
    cy.contains("Workflow Event", { timeout: 5000 }).should("be.visible");

    // 5. Edit event
    cy.contains("Workflow Event").click();
    cy.get('input[placeholder*="title" i]')
      .clear()
      .type("Updated Workflow Event");
    cy.contains("button", "Update Event").click();
    cy.contains("Updated Workflow Event", { timeout: 5000 }).should(
      "be.visible"
    );

    // 6. Delete event
    cy.contains("Updated Workflow Event").click();
    cy.contains("button", "Delete Event").click();
    cy.contains("Updated Workflow Event").should("not.exist");
  });

  it("should complete user registration and first event creation", () => {
    // 1. Sign up
    cy.intercept("POST", "**/auth/v1/signup", {
      statusCode: 200,
      body: {
        user: { id: "new-user-1", email: "newuser@example.com" },
        session: null,
      },
    }).as("signup");

    cy.visit("/signup");
    cy.get('input[placeholder*="Your full name" i]').type("New User");
    cy.get('input[placeholder*="you@example.com" i]').type("newuser@example.com");
    cy.get('input[placeholder*="At least 6 characters" i]').type(
      "password123"
    );
    cy.get('button[type="submit"]').click();
    cy.wait("@signup");
    cy.contains("Sign-up succeeded", { timeout: 5000 }).should("be.visible");

    // 2. Login (after email confirmation)
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: {
        access_token: "token",
        user: { id: "new-user-1", email: "newuser@example.com" },
      },
    }).as("login");

    cy.visit("/login");
    cy.get('input[type="email"]').type("newuser@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait("@login");
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // 3. Create first event
    cy.get('input[placeholder*="title" i]').type("My First Event");
    cy.get('input[type="datetime-local"]')
      .first()
      .clear()
      .type("2024-12-25T14:00");
    cy.get('input[type="datetime-local"]')
      .last()
      .clear()
      .type("2024-12-25T15:00");
    cy.contains("button", "Create Event").click();
    cy.contains("My First Event", { timeout: 5000 }).should("be.visible");
  });

  it("should complete group invitation workflow", () => {
    // 1. Login as user 1
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token1", user: { id: "user-1" } },
    }).as("login1");

    cy.visit("/login");
    cy.get('input[type="email"]').type("user1@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait("@login1");
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // 2. Create group
    cy.visit("/groups");
    cy.intercept("POST", "**/api/groups", {
      statusCode: 201,
      body: {
        group: { id: "group-1", name: "Shared Group" },
        invite_code: "SHARED",
      },
    }).as("createGroup");

    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [
        {
          group: { id: "group-1", name: "Shared Group", description: null },
          role: "admin",
        },
      ],
    });

    cy.get('input[placeholder*="Nom du groupe" i]').type("Shared Group");
    cy.contains("button", "Créer").click();
    cy.wait("@createGroup");

    // 3. Get invite code
    cy.contains("SHARED", { timeout: 5000 }).should("be.visible");

    // 4. Logout (simulate)
    cy.clearCookies();
    cy.clearLocalStorage();

    // 5. Login as user 2
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: { access_token: "token2", user: { id: "user-2" } },
    }).as("login2");

    cy.visit("/login");
    cy.get('input[type="email"]').type("user2@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait("@login2");
    cy.url({ timeout: 5000 }).should("include", "/calendar");

    // 6. Join group with code
    cy.visit("/groups");
    cy.intercept("POST", "**/api/groups/join", {
      statusCode: 200,
      body: { success: true },
    }).as("joinGroup");

    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [
        {
          group: { id: "group-1", name: "Shared Group", description: null },
          role: "member",
        },
      ],
    }).as("fetchGroups");

    cy.get('input[placeholder*="code" i]').type("SHARED");
    cy.contains("button", "Rejoindre").click();
    cy.wait("@joinGroup");
    cy.wait("@fetchGroups");

    // 7. Verify group appears
    cy.contains("Shared Group", { timeout: 5000 }).should("be.visible");

    // 8. Navigate to group calendar
    cy.contains("button", "Voir calendrier").click();
    cy.url({ timeout: 5000 }).should("include", "groupId=group-1");
  });
});

