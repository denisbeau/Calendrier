# cypress/e2e/signup.feature
Feature: Inscription utilisateur
  En tant qu'utilisateur non inscrit
  Je veux pouvoir créer un compte
  Afin d'accéder à l'application

  Scenario: Inscription réussie avec email et mot de passe
    Given je suis sur la page "d'inscription"
    And je configure l'intercept pour un signup réussi
    When je remplis le formulaire d'inscription avec:
      | nom         | email            | motDePasse  |
      | Jean Dupont | jean@example.com | password123 |
    And je clique sur le bouton "Sign up"
    Then je devrais voir le message "Sign-up succeeded"
    And je devrais voir le message "check your email"

  Scenario: Inscription échoue avec champs vides
    Given je suis sur la page "d'inscription"
    When je clique sur le bouton "Sign up"
    Then je devrais voir le message "Email and password are required."

