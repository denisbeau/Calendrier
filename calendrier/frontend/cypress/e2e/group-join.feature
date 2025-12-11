# cypress/e2e/group-join.feature
Feature: Rejoindre un groupe
  En tant qu'utilisateur connecté
  Je veux rejoindre un groupe avec un code d'invitation
  Afin de partager des événements avec d'autres utilisateurs

  Background:
    Given je suis connecté avec l'email "user@example.com" et le mot de passe "password123"

  Scenario: Rejoindre un groupe avec un code d'invitation valide
    Given je suis sur la page "des groupes"
    And je configure les intercepts pour rejoindre un groupe avec le code "ABC123"
    When je remplis le champ "code d'invitation" avec "ABC123"
    And je clique sur le bouton "Rejoindre"
    Then je devrais voir le message "Vous avez rejoint le groupe"
    And je devrais voir le groupe dans ma liste de groupes

  Scenario: Rejoindre un groupe échoue avec un code invalide
    Given je suis sur la page "des groupes"
    And je configure les intercepts pour un code invalide "INVALID"
    When je remplis le champ "code d'invitation" avec "INVALID"
    And je clique sur le bouton "Rejoindre"
    Then je devrais voir un message d'erreur
    And le message devrait indiquer que le code est invalide

  Scenario: Rejoindre un groupe échoue avec un code vide
    Given je suis sur la page "des groupes"
    When je clique sur le bouton "Rejoindre" sans remplir le code
    Then je devrais voir un message d'erreur
    And le message devrait indiquer que le code est requis

