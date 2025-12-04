// cypress/e2e/groups.cy.js
describe("Groups - Creation", () => {
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

    // Navigate to groups
    cy.visit("/groups");
  });

  it("should create a new group", () => {
    const groupName = "Test Group";
    const groupDescription = "Test Description";

    // Mock API call for group creation
    cy.intercept("POST", "**/api/groups", {
      statusCode: 201,
      body: {
        group: {
          id: "group-1",
          name: groupName,
          description: groupDescription,
        },
        invite_code: "ABCDEF",
      },
    }).as("createGroup");

    // Mock fetch groups to include the new group
    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [
        {
          group: {
            id: "group-1",
            name: groupName,
            description: groupDescription,
          },
          role: "admin",
        },
      ],
    }).as("fetchGroups");

    // Fill form
    cy.get('input[placeholder*="Nom du groupe" i]').type(groupName);
    cy.get('input[placeholder*="Description" i]').type(groupDescription);

    // Submit
    cy.contains("button", "Créer").click();

    // Wait for API call
    cy.wait("@createGroup");

    // Verify success message
    cy.contains("Groupe créé", { timeout: 5000 }).should("be.visible");

    // Verify invite code is displayed
    cy.contains("ABCDEF", { timeout: 5000 }).should("be.visible");

    // Wait for groups to be fetched
    cy.wait("@fetchGroups");

    // Verify group appears in list
    cy.contains(groupName, { timeout: 5000 }).should("be.visible");
  });

  it("should show error when group name is empty", () => {
    cy.contains("button", "Créer").click();
    cy.contains("Nom requis", { timeout: 5000 }).should("be.visible");
  });

  it("should create group without description", () => {
    const groupName = "Group Without Description";

    // Mock API call
    cy.intercept("POST", "**/api/groups", {
      statusCode: 201,
      body: {
        group: { id: "group-2", name: groupName, description: null },
        invite_code: "GHIJKL",
      },
    }).as("createGroup");

    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [
        {
          group: { id: "group-2", name: groupName, description: null },
          role: "admin",
        },
      ],
    }).as("fetchGroups");

    // Fill only name
    cy.get('input[placeholder*="Nom du groupe" i]').type(groupName);

    // Submit
    cy.contains("button", "Créer").click();

    cy.wait("@createGroup");
    cy.contains("Groupe créé", { timeout: 5000 }).should("be.visible");
  });
});

describe("Groups - Joining", () => {
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

    // Navigate to groups
    cy.visit("/groups");
  });

  it("should join a group with valid code", () => {
    const inviteCode = "ABCDEF";

    // Mock API call for joining group
    cy.intercept("POST", "**/api/groups/join", {
      statusCode: 200,
      body: { success: true },
    }).as("joinGroup");

    // Mock fetch groups to return the new group
    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [
        {
          group: { id: "group-1", name: "Joined Group", description: null },
          role: "member",
        },
      ],
    }).as("fetchGroups");

    // Enter code
    cy.get('input[placeholder*="code" i]').type(inviteCode);

    // Submit
    cy.contains("button", "Rejoindre").click();

    // Wait for API calls
    cy.wait("@joinGroup");
    cy.wait("@fetchGroups");

    // Verify success message
    cy.contains("Vous avez rejoint le groupe", { timeout: 5000 }).should(
      "be.visible"
    );

    // Verify group appears in list
    cy.contains("Joined Group", { timeout: 5000 }).should("be.visible");
  });

  it("should show error for invalid code format", () => {
    cy.get('input[placeholder*="code" i]').type("ABC"); // Too short
    cy.contains("button", "Rejoindre").click();
    cy.contains("code à 6 lettres", { timeout: 5000 }).should("be.visible");
  });

  it("should show error for invalid code", () => {
    cy.intercept("POST", "**/api/groups/join", {
      statusCode: 400,
      body: { error: "Invalid code" },
    }).as("joinGroupError");

    cy.get('input[placeholder*="code" i]').type("INVALID");
    cy.contains("button", "Rejoindre").click();
    cy.wait("@joinGroupError");
    cy.contains("Impossible de rejoindre", { timeout: 5000 }).should(
      "be.visible"
    );
  });

  it("should convert code to uppercase automatically", () => {
    const lowercaseCode = "abcdef";

    cy.intercept("POST", "**/api/groups/join", (req) => {
      // Verify code is uppercase
      expect(req.body.code || req.body.invite_code).to.equal("ABCDEF");
      req.reply({
        statusCode: 200,
        body: { success: true },
      });
    }).as("joinGroup");

    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [
        {
          group: { id: "group-1", name: "Joined Group", description: null },
          role: "member",
        },
      ],
    }).as("fetchGroups");

    // Enter lowercase code
    cy.get('input[placeholder*="code" i]').type(lowercaseCode);
    cy.contains("button", "Rejoindre").click();

    cy.wait("@joinGroup");
  });
});

describe("Groups - Calendar Navigation", () => {
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

    // Mock groups list
    cy.intercept("GET", "**/api/groups", {
      statusCode: 200,
      body: [
        {
          group: { id: "group-1", name: "Test Group", description: null },
          role: "admin",
        },
      ],
    });
  });

  it("should navigate to group calendar", () => {
    cy.visit("/groups");

    // Click "Voir calendrier" button
    cy.contains("button", "Voir calendrier").click();

    // Verify navigation
    cy.url({ timeout: 5000 }).should("include", "/calendar");
    cy.url().should("include", "groupId=group-1");
  });

  it("should display group calendar correctly", () => {
    cy.visit("/groups");
    cy.contains("button", "Voir calendrier").click();

    // Verify calendar page loads
    cy.url({ timeout: 5000 }).should("include", "/calendar");
    cy.url().should("include", "groupId=group-1");

    // Verify calendar is visible
    cy.get(".rbc-calendar", { timeout: 5000 }).should("be.visible");
  });
});

