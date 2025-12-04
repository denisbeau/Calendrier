// cypress/e2e/homepage.cy.js
describe("Home Page", () => {
  it("should display the homepage with all sections", () => {
    cy.visit("/");
    cy.contains("Calendar App").should("be.visible");
    cy.contains("Event Management").should("be.visible");
    cy.contains("Multiple Views").should("be.visible");
  });

  it("should navigate to login page when clicking login link", () => {
    cy.visit("/");
    // Look for any login link or button
    cy.contains("Log in").click();
    cy.url().should("include", "/login");
  });

  it("should display all feature sections", () => {
    cy.visit("/");
    
    // Check for main heading
    cy.contains("Calendar App").should("be.visible");
    
    // Check for feature descriptions
    cy.contains("Event Management").should("be.visible");
    cy.contains("Multiple Views").should("be.visible");
    
    // The page should be accessible
    cy.get("body").should("be.visible");
  });

  it("should be accessible without authentication", () => {
    cy.visit("/");
    cy.url().should("not.include", "/login");
    cy.contains("Calendar App").should("be.visible");
  });
});

