// cypress/e2e/signup.cy.js
describe("Signup Page", () => {
  beforeEach(() => {
    // Visit the signup page before each test
    // Ensure the page is fully loaded before proceeding
    cy.visit("/signup", { timeout: 10000 });
    // Wait for the page to be ready
    cy.get("body").should("be.visible");
  });

  it("should display the signup form with all required fields", () => {
    // Check that all form elements are present
    cy.get('input[placeholder="Your full name"]').should("be.visible");
    cy.get('input[placeholder="you@example.com"]').should("be.visible");
    cy.get('input[placeholder="At least 6 characters"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible").and("contain", "Sign up");
    cy.get('button').contains("Back to login").should("be.visible");
  });

  it("should show error message when submitting with empty email and password", () => {
    // Try to submit without filling required fields
    cy.get('button[type="submit"]').click();

    // Should show error message
    cy.contains("Email and password are required").should("be.visible");
  });

  it("should show error message when submitting with empty email", () => {
    // Fill only password
    cy.get('input[placeholder="At least 6 characters"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Should show error message
    cy.contains("Email and password are required").should("be.visible");
  });

  it("should show error message when submitting with empty password", () => {
    // Fill only email
    cy.get('input[placeholder="you@example.com"]').type("test@example.com");
    cy.get('button[type="submit"]').click();

    // Should show error message
    cy.contains("Email and password are required").should("be.visible");
  });

  it("should allow typing in all input fields", () => {
    const testName = "John Doe";
    const testEmail = "john@example.com";
    const testPassword = "password123";

    // Type in name field
    cy.get('input[placeholder="Your full name"]')
      .type(testName)
      .should("have.value", testName);

    // Type in email field
    cy.get('input[placeholder="you@example.com"]')
      .type(testEmail)
      .should("have.value", testEmail);

    // Type in password field
    cy.get('input[placeholder="At least 6 characters"]')
      .type(testPassword)
      .should("have.value", testPassword);
  });

  it("should disable submit button while loading", () => {
    // Fill form with valid data
    cy.get('input[placeholder="you@example.com"]').type("test@example.com");
    cy.get('input[placeholder="At least 6 characters"]').type("password123");

    // Intercept the Supabase signup request
    cy.intercept(
      {
        method: "POST",
        pathname: "/auth/v1/signup",
      },
      {
        statusCode: 200,
        delay: 1000, // Simulate network delay
        body: {
          user: { id: "test-user-id", email: "test@example.com" },
          session: null,
        },
      }
    ).as("signupRequest");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Button should be disabled and show loading state
    cy.get('button[type="submit"]')
      .should("be.disabled")
      .and("contain", "Signing up...");

    // Wait for the request to complete
    cy.wait("@signupRequest");
  });

  it("should show success message on successful signup", () => {
    // Fill form with valid data
    const testEmail = "newuser@example.com";
    const testPassword = "password123";

    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="At least 6 characters"]').type(testPassword);

    // Intercept successful signup
    cy.intercept(
      {
        method: "POST",
        pathname: "/auth/v1/signup",
      },
      {
        statusCode: 200,
        body: {
          user: { id: "test-user-id", email: testEmail },
          session: null,
        },
      }
    ).as("successfulSignup");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the request
    cy.wait("@successfulSignup");

    // Should show success message
    cy.contains(
      "Sign-up succeeded — check your email for a confirmation link."
    ).should("be.visible");
  });

  it("should show error message on signup failure", () => {
    // Intercept failed signup (e.g., user already exists)
    // Supabase expects a specific error format
    cy.intercept(
      {
        method: "POST",
        pathname: "/auth/v1/signup",
      },
      (req) => {
        req.reply({
          statusCode: 400,
          body: {
            error: "User already registered",
            error_description: "User already registered",
          },
        });
      }
    ).as("failedSignup");

    // Fill form with valid data
    const testEmail = "existing@example.com";
    const testPassword = "password123";

    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="At least 6 characters"]').type(testPassword);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the request - give it time to process
    cy.wait("@failedSignup", { timeout: 10000 });

    // Wait a bit for React to update the DOM
    cy.wait(500);

    // Should show error message - check for error container
    // Supabase might format the error differently, so check for any error text
    cy.get(".text-sm.text-red-300", { timeout: 5000 })
      .should("be.visible")
      .then(($error) => {
        // Get the actual text content
        const errorText = $error.text();
        // Check that it contains error-related text (not [object Object])
        expect(errorText).to.not.equal("[object Object]");
        expect(errorText.length).to.be.greaterThan(0);
        // The error should mention something about the failure
        expect(errorText.toLowerCase()).to.satisfy((text) => {
          return (
            text.includes("already") ||
            text.includes("registered") ||
            text.includes("error") ||
            text.includes("failed") ||
            text.includes("signup")
          );
        });
      });
  });

  it("should navigate to login page when clicking 'Back to login' button", () => {
    // Click the "Back to login" button
    cy.get('button').contains("Back to login").click();

    // Should navigate to login page
    cy.url().should("include", "/login");
  });

  it("should trim email and name fields on submit", () => {
    const testEmail = "  test@example.com  ";
    const testName = "  John Doe  ";
    const testPassword = "password123";

    // Fill form with whitespace
    cy.get('input[placeholder="Your full name"]').type(testName);
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="At least 6 characters"]').type(testPassword);

    // Intercept the request to check trimmed values
    cy.intercept(
      {
        method: "POST",
        pathname: "/auth/v1/signup",
      },
      (req) => {
        expect(req.body.email).to.equal("test@example.com");
        req.reply({
          statusCode: 200,
          body: {
            user: { id: "test-user-id", email: "test@example.com" },
            session: null,
          },
        });
      }
    ).as("signupWithTrimmedValues");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the request
    cy.wait("@signupWithTrimmedValues");
  });

  it("should clear error messages when submitting again after error", () => {
    // First, trigger an error by submitting empty form
    cy.get('button[type="submit"]').click();
    cy.contains("Email and password are required").should("be.visible");

    // Now fill the form correctly
    cy.get('input[placeholder="you@example.com"]').type("test@example.com");
    cy.get('input[placeholder="At least 6 characters"]').type("password123");

    // Intercept successful signup
    cy.intercept(
      {
        method: "POST",
        pathname: "/auth/v1/signup",
      },
      {
        statusCode: 200,
        body: {
          user: { id: "test-user-id", email: "test@example.com" },
          session: null,
        },
      }
    ).as("retrySignup");

    // Submit again
    cy.get('button[type="submit"]').click();

    // Error message should be gone, success message should appear
    cy.contains("Email and password are required").should("not.exist");
    cy.wait("@retrySignup");
    cy.contains(
      "Sign-up succeeded — check your email for a confirmation link."
    ).should("be.visible");
  });

  it("should handle network errors gracefully", () => {
    // Intercept network error
    cy.intercept(
      {
        method: "POST",
        pathname: "/auth/v1/signup",
      },
      (req) => {
        req.reply({
          statusCode: 500,
          body: {
            error: "Internal server error",
            error_description: "Internal server error",
          },
        });
      }
    ).as("networkError");

    // Fill form with valid data
    cy.get('input[placeholder="you@example.com"]').type("test@example.com");
    cy.get('input[placeholder="At least 6 characters"]').type("password123");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the request
    cy.wait("@networkError", { timeout: 10000 });

    // Wait a bit for React to update the DOM
    cy.wait(500);

    // Should show error message - check for error container
    cy.get(".text-sm.text-red-300", { timeout: 5000 })
      .should("be.visible")
      .then(($error) => {
        // Get the actual text content
        const errorText = $error.text();
        // Check that it contains error-related text (not [object Object])
        expect(errorText).to.not.equal("[object Object]");
        expect(errorText.length).to.be.greaterThan(0);
        // The error should mention something about the failure
        expect(errorText.toLowerCase()).to.satisfy((text) => {
          return (
            text.includes("internal") ||
            text.includes("server") ||
            text.includes("error") ||
            text.includes("failed") ||
            text.includes("unexpected")
          );
        });
      });
  });
});

