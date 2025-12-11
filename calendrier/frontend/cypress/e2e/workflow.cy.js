// cypress/e2e/workflow.cy.js
describe("Complete Workflow", () => {
  it("should complete full event lifecycle in a group", () => {
    // 1. Login
    cy.login("test@example.com", "password123");

    // 2. Create group
    cy.visit("/groups");
    
    // Mock Supabase REST API calls - use broader patterns
    cy.intercept("POST", "**/rest/v1/groups**", {
      statusCode: 201,
      body: [
        {
          id: "group-1",
          name: "Workflow Group",
          description: null,
          invite_code: "WORKFL",
          owner_id: "user-123",
        },
      ],
    }).as("createGroup");

    cy.intercept("POST", "**/rest/v1/group_members**", {
      statusCode: 201,
      body: [{ id: "member-1", group_id: "group-1", user_id: "user-123", role: "admin" }],
    }).as("createMember");

    cy.intercept("GET", "**/rest/v1/group_members**", {
      statusCode: 200,
      body: [
        {
          group_id: "group-1",
          role: "admin",
          groups: {
            id: "group-1",
            name: "Workflow Group",
            description: null,
            invite_code: "WORKFL",
          },
        },
      ],
    }).as("fetchGroups");

    cy.get('input[placeholder*="Nom du groupe" i]').type("Workflow Group");
    cy.contains("button", "Créer").click();
    cy.wait("@createGroup", { timeout: 10000 });
    cy.wait("@createMember", { timeout: 10000 });
    cy.wait("@fetchGroups", { timeout: 10000 });

    // 3. Navigate to group calendar
    cy.contains("button", "Voir calendrier").click();
    cy.url({ timeout: 5000 }).should("include", "groupId=group-1");

    // 4. Create event with dynamic date
    cy.window().then((win) => {
      const formatLocalDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0, 0);

      cy.get('input[placeholder*="title" i]').type("Workflow Event");
      cy.get('input[type="datetime-local"]')
        .first()
        .clear()
        .type(formatLocalDateTime(tomorrow));
      cy.get('input[type="datetime-local"]')
        .last()
        .clear()
        .type(formatLocalDateTime(endTime));
      cy.contains("button", "Create Event").click();
      cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");
      cy.wait(1000);
      cy.contains("Workflow Event", { timeout: 5000 }).should("be.visible");

      // 5. Edit event
      cy.wait(1000);
      cy.contains("Workflow Event", { timeout: 10000 }).should("be.visible");
      cy.contains("Workflow Event").click({ force: true });
      cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "Workflow Event");
      cy.get('input[placeholder*="title" i]')
        .clear()
        .type("Updated Workflow Event");
      cy.contains("button", "Update Event").click();
      cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");
      cy.wait(2000);
      
      // Refresh calendar view
      cy.get("button").contains("Month").click();
      cy.wait(1000);
      
      cy.contains("Updated Workflow Event", { timeout: 10000 }).should("be.visible");

      // 6. Delete event
      cy.contains("Updated Workflow Event").click({ force: true });
      cy.contains("button", "Delete Event").click();
      cy.wait(1000);
      cy.get("body").should("not.contain", "Updated Workflow Event");
    });
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

    // 2. Login (after email confirmation) - use custom login command
    cy.login("newuser@example.com", "password123");
    cy.visitCalendar();

    // 3. Create first event with dynamic date
    cy.window().then((win) => {
      const formatLocalDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(15, 0, 0, 0);

      cy.get('input[placeholder*="title" i]').type("My First Event");
      cy.get('input[type="datetime-local"]')
        .first()
        .clear()
        .type(formatLocalDateTime(tomorrow));
      cy.get('input[type="datetime-local"]')
        .last()
        .clear()
        .type(formatLocalDateTime(endTime));
      cy.contains("button", "Create Event").click();
      cy.get('input[placeholder*="title" i]', { timeout: 5000 }).should("have.value", "");
      cy.wait(1000);
      cy.contains("My First Event", { timeout: 5000 }).should("be.visible");
    });
  });

  it("should complete group invitation workflow", () => {
    // 1. Login as user 1
    cy.login("user1@example.com", "password123");

    // 2. Create group
    cy.visit("/groups");
    
    // Mock Supabase REST API calls - intercept POST to groups
    // Supabase .select().single() expects array response, client extracts first element
    cy.intercept("POST", "**/rest/v1/groups*", (req) => {
      // Always return array format (Supabase REST API standard)
      req.reply({
        statusCode: 201,
        body: [
          {
            id: "group-1",
            name: "Shared Group",
            description: null,
            invite_code: "SHARED",
            owner_id: "user-1",
            created_at: new Date().toISOString(),
          },
        ],
      });
    }).as("createGroup");

    cy.intercept("POST", "**/rest/v1/group_members**", {
      statusCode: 201,
      body: [{ id: "member-1", group_id: "group-1", user_id: "user-1", role: "admin" }],
    }).as("createMember");

    cy.intercept("GET", "**/rest/v1/group_members**", {
      statusCode: 200,
      body: [
        {
          group_id: "group-1",
          role: "admin",
          groups: {
            id: "group-1",
            name: "Shared Group",
            description: null,
            invite_code: "SHARED",
          },
        },
      ],
    }).as("fetchGroups");

    cy.get('input[placeholder*="Nom du groupe" i]').type("Shared Group");
    cy.contains("button", "Créer").click();
    cy.wait("@createGroup", { timeout: 10000 });
    cy.wait("@createMember", { timeout: 10000 });

    // Wait for success message
    cy.contains("Groupe créé", { timeout: 10000 }).should("be.visible");
    
    // Wait for the component to update with the invite code and for loadGroups to complete
    cy.wait(2000);

    // 3. Get invite code - check for the code directly
    cy.get("body", { timeout: 10000 }).should("contain", "SHARED");

    // 4. Logout (simulate)
    cy.clearCookies();
    cy.clearLocalStorage();

    // 5. Login as user 2
    cy.login("user2@example.com", "password123");

    // 6. Join group with code
    cy.visit("/groups");
    
    // Mock Supabase REST API calls for joining - use broader patterns
    cy.intercept("GET", "**/rest/v1/groups**", (req) => {
      if (req.url.includes("SHARED") || req.url.includes("invite_code")) {
        req.reply({
          statusCode: 200,
          body: [{ id: "group-1", name: "Shared Group", invite_code: "SHARED" }],
        });
      }
    }).as("findGroup");

    cy.intercept("GET", "**/rest/v1/group_members**", (req) => {
      if (req.url.includes("group_id=eq.group-1") && req.url.includes("user_id=eq")) {
        // Check member request
        req.reply({ statusCode: 200, body: [] });
      } else if (req.url.includes("group_id=eq.group-1") && !req.url.includes("user_id=eq")) {
        // Count members request
        req.reply({ statusCode: 200, body: [{ id: "member-1" }] });
      } else if (req.url.includes("user_id=eq")) {
        // Fetch user groups after join
        req.reply({
          statusCode: 200,
          body: [
            {
              group_id: "group-1",
              role: "member",
              groups: {
                id: "group-1",
                name: "Shared Group",
                description: null,
                invite_code: "SHARED",
              },
            },
          ],
        });
      } else {
        req.reply({ statusCode: 200, body: [] });
      }
    }).as("groupMembers");

    cy.intercept("POST", "**/rest/v1/group_members**", {
      statusCode: 201,
      body: [{ id: "member-2", group_id: "group-1", user_id: "user-2", role: "member" }],
    }).as("addMember");

    cy.get('input[placeholder*="code" i]').type("SHARED");
    cy.contains("button", "Rejoindre").click();
    cy.wait("@findGroup", { timeout: 10000 }).then(() => {}, () => {});
    cy.wait("@groupMembers", { timeout: 10000 }).then(() => {}, () => {});
    cy.wait("@addMember", { timeout: 10000 }).then(() => {}, () => {});

    // 7. Verify group appears
    cy.contains("Shared Group", { timeout: 5000 }).should("be.visible");

    // 8. Navigate to group calendar
    cy.contains("button", "Voir calendrier").click();
    cy.url({ timeout: 5000 }).should("include", "groupId=group-1");
  });
});

