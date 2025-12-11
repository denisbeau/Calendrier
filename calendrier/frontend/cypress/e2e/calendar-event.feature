# cypress/e2e/calendar-event.feature
Feature: Création d'événement dans le calendrier
  En tant qu'utilisateur connecté
  Je veux créer des événements dans mon calendrier
  Afin de gérer mon emploi du temps

  Background:
    Given je suis connecté avec l'email "user@example.com" et le mot de passe "password123"

  Scenario: Créer un événement avec succès
    Given je suis sur la page "du calendrier"
    When je crée un événement avec le titre "Réunion d'équipe" de "tomorrow" à "tomorrow+1h"
    Then l'événement "Réunion d'équipe" devrait apparaître dans le calendrier
    And le formulaire devrait être réinitialisé

  Scenario: Créer un événement échoue sans titre
    Given je suis sur la page "du calendrier"
    When je remplis le champ "titre" avec ""
    And je clique sur le bouton "Create Event"
    Then je devrais voir le message "Event title is required"

  Scenario: Créer un événement échoue si la date de fin est avant la date de début
    Given je suis sur la page "du calendrier"
    When je remplis le champ "titre" avec "Événement invalide"
    And je remplis le champ "start" avec "2024-12-25T11:00"
    And je remplis le champ "end" avec "2024-12-25T10:00"
    And je clique sur le bouton "Create Event"
    Then je devrais voir le message "End time must be after start time"

