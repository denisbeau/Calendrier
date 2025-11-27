// cypress/e2e/signup.cy.js

describe("Sign Up Flow", () => {
  beforeEach(() => {
    cy.visit("/");
    // Open Sign Up view
    cy.contains("button", "Sign up").click();
  });

  it("shows validation errors if required fields are empty", () => {
    // Click sign up without filling fields
    cy.contains("button", "Sign up").click();

    // Wait for error message to appear
    cy.contains("Email and password are required.", { timeout: 5000 }).should(
      "be.visible"
    );
  });

  it("allows a user to enter name, email, password and submit", () => {
    const testName = "Cypress Test User";
    const testEmail = `cypress${Date.now()}@example.com`;
    const testPassword = "Test1234!";

    cy.get('input[placeholder="Your full name"]').type(testName);
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="At least 6 characters"]').type(testPassword);

    cy.contains("button", "Sign up").click();

    // Wait for success message (async from Supabase)
    cy.contains(
      "Sign-up succeeded — check your email for a confirmation link.",
      { timeout: 10000 }
    ).should("be.visible");
  });

  it("displays error if signup fails (e.g., duplicate email)", () => {
    const existingEmail = "existinguser@example.com";

    cy.get('input[placeholder="you@example.com"]').type(existingEmail);
    cy.get('input[placeholder="At least 6 characters"]').type("Test1234!");

    cy.contains("button", "Sign up").click();

    // Supabase error message may vary; check for "already registered"
    cy.get(".text-sm.text-red-300", { timeout: 10000 }).should(
      "contain.text",
      "already registered"
    );
  });
});
