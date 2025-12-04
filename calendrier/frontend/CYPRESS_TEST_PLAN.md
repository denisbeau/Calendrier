# Plan de Tests Cypress - Application Calendrier

Ce document décrit un plan complet de tests end-to-end (E2E) avec Cypress pour tester entièrement l'application Calendrier. Le plan couvre toutes les fonctionnalités principales de l'application.

## Vue d'ensemble

L'application comprend les fonctionnalités suivantes :

- **Authentification** : Login et Signup
- **Page d'accueil** : Landing page avec navigation
- **Calendrier** : Gestion d'événements (création, édition, suppression)
- **Groupes** : Création et gestion de groupes, invitations
- **Navigation** : Routes protégées et navigation entre pages

---

## Structure des Tests

### 1. Tests d'Authentification (Déjà implémentés)

#### 1.1 Tests de Signup (`cypress/e2e/signup.cy.js`)

- ✅ Affichage du formulaire d'inscription
- ✅ Validation des champs requis
- ✅ Soumission avec succès
- ✅ Gestion des erreurs (utilisateur existant, erreurs réseau)
- ✅ État de chargement
- ✅ Navigation vers la page de login

#### 1.2 Tests de Login (`cypress/e2e/login.cy.js`)

- ✅ Affichage du formulaire de connexion
- ✅ Validation des champs requis
- ✅ Connexion réussie avec navigation
- ✅ Gestion des erreurs (identifiants invalides, erreurs réseau)
- ✅ Magic link (connexion sans mot de passe)
- ✅ État de chargement

---

## Tests à Implémenter

### 2. Tests de Navigation et Routes Protégées

#### 2.1 Test : Redirection vers login pour les routes protégées

**Fichier** : `cypress/e2e/navigation.cy.js`

**Description** : Vérifier que les utilisateurs non authentifiés sont redirigés vers la page de login lorsqu'ils tentent d'accéder à des routes protégées.

**Scénarios** :

- Accès à `/calendar` sans être connecté → redirection vers `/login`
- Accès à `/groups` sans être connecté → redirection vers `/login`
- Après connexion réussie → redirection vers `/calendar`

**Code de test** :

```javascript
describe("Protected Routes", () => {
  it("should redirect to login when accessing /calendar without authentication", () => {
    cy.visit("/calendar");
    cy.url().should("include", "/login");
  });

  it("should redirect to login when accessing /groups without authentication", () => {
    cy.visit("/groups");
    cy.url().should("include", "/login");
  });

  it("should allow access to protected routes after login", () => {
    // Mock successful login
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: {
        access_token: "test-token",
        user: { id: "user-1", email: "test@example.com" },
      },
    }).as("login");

    cy.visit("/login");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait("@login");
    cy.url({ timeout: 5000 }).should("include", "/calendar");
  });
});
```

---

### 3. Tests de la Page d'Accueil

#### 3.1 Test : Affichage et navigation depuis la page d'accueil

**Fichier** : `cypress/e2e/homepage.cy.js`

**Description** : Vérifier que la page d'accueil s'affiche correctement et que les liens de navigation fonctionnent.

**Scénarios** :

- Affichage du titre et de la description
- Affichage des fonctionnalités (Event Management, Multiple Views, etc.)
- Navigation vers la page de login
- Navigation vers le calendrier (si connecté)

**Code de test** :

```javascript
describe("Home Page", () => {
  it("should display the homepage with all sections", () => {
    cy.visit("/");
    cy.contains("Calendar App").should("be.visible");
    cy.contains("Event Management").should("be.visible");
    cy.contains("Multiple Views").should("be.visible");
  });

  it("should navigate to login page when clicking login link", () => {
    cy.visit("/");
    // Assuming there's a login link/button
    cy.contains("Log in").click();
    cy.url().should("include", "/login");
  });
});
```

---

### 4. Tests du Calendrier - Création d'Événements

#### 4.1 Test : Création d'un événement avec tous les champs

**Fichier** : `cypress/e2e/calendar-events.cy.js`

**Description** : Vérifier que l'utilisateur peut créer un événement avec tous les champs requis.

**Scénarios** :

- Remplir le formulaire avec titre, date de début, date de fin, couleur, catégorie
- Soumettre le formulaire
- Vérifier que l'événement apparaît dans le calendrier
- Vérifier que le formulaire est réinitialisé après création

**Code de test** :

```javascript
describe("Calendar Events - Creation", () => {
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
  });

  it("should create a new event with all fields", () => {
    const eventTitle = "Test Event";
    const startDate = "2024-12-25T10:00";
    const endDate = "2024-12-25T11:00";

    // Fill form
    cy.get('input[placeholder*="title" i]').type(eventTitle);
    cy.get('input[type="datetime-local"]').first().clear().type(startDate);
    cy.get('input[type="datetime-local"]').last().clear().type(endDate);

    // Submit
    cy.contains("button", "Create Event").click();

    // Verify event appears in calendar
    cy.contains(eventTitle).should("be.visible");

    // Verify form is reset
    cy.get('input[placeholder*="title" i]').should("have.value", "");
  });
});
```

#### 4.2 Test : Validation du formulaire d'événement

**Description** : Vérifier que les validations fonctionnent correctement.

**Scénarios** :

- Soumission avec titre vide → erreur
- Soumission avec date de début vide → erreur
- Soumission avec date de fin vide → erreur
- Soumission avec date de fin avant date de début → erreur
- Messages d'erreur appropriés affichés

**Code de test** :

```javascript
it("should show validation errors for empty required fields", () => {
  cy.contains("button", "Create Event").click();
  cy.contains("Event title is required").should("be.visible");
});

it("should show error when end date is before start date", () => {
  cy.get('input[placeholder*="title" i]').type("Test Event");
  cy.get('input[type="datetime-local"]').first().type("2024-12-25T11:00");
  cy.get('input[type="datetime-local"]').last().type("2024-12-25T10:00");
  cy.contains("button", "Create Event").click();
  cy.contains("End time must be after start time").should("be.visible");
});
```

---

### 5. Tests du Calendrier - Édition d'Événements

#### 5.1 Test : Édition d'un événement existant

**Description** : Vérifier que l'utilisateur peut modifier un événement existant.

**Scénarios** :

- Cliquer sur un événement dans le calendrier
- Le formulaire se remplit avec les données de l'événement
- Modifier les champs
- Soumettre les modifications
- Vérifier que l'événement est mis à jour dans le calendrier

**Code de test** :

```javascript
describe("Calendar Events - Editing", () => {
  beforeEach(() => {
    // Setup: create an event first
    // ... (authentication and event creation)
  });

  it("should edit an existing event", () => {
    // Click on event in calendar
    cy.contains("Test Event").click();

    // Verify form is populated
    cy.get('input[placeholder*="title" i]').should("have.value", "Test Event");

    // Modify title
    cy.get('input[placeholder*="title" i]').clear().type("Updated Event");

    // Submit
    cy.contains("button", "Update Event").click();

    // Verify event is updated
    cy.contains("Updated Event").should("be.visible");
    cy.contains("Test Event").should("not.exist");
  });
});
```

#### 5.2 Test : Annulation de l'édition

**Description** : Vérifier que l'utilisateur peut annuler l'édition d'un événement.

**Scénarios** :

- Cliquer sur un événement
- Modifier les champs
- Cliquer sur "Cancel"
- Vérifier que les modifications ne sont pas sauvegardées
- Vérifier que le formulaire est réinitialisé

---

### 6. Tests du Calendrier - Suppression d'Événements

#### 6.1 Test : Suppression d'un événement

**Description** : Vérifier que l'utilisateur peut supprimer un événement.

**Scénarios** :

- Cliquer sur un événement
- Cliquer sur le bouton "Delete Event"
- Vérifier que l'événement disparaît du calendrier
- Vérifier que le formulaire est réinitialisé

**Code de test** :

```javascript
describe("Calendar Events - Deletion", () => {
  it("should delete an event", () => {
    // Create event first
    // ... (setup)

    // Click on event
    cy.contains("Test Event").click();

    // Click delete button
    cy.contains("button", "Delete Event").click();

    // Verify event is removed
    cy.contains("Test Event").should("not.exist");

    // Verify form is reset
    cy.get('input[placeholder*="title" i]').should("have.value", "");
  });
});
```

---

### 7. Tests du Calendrier - Vues et Navigation

#### 7.1 Test : Changement de vue du calendrier

**Description** : Vérifier que l'utilisateur peut changer entre les différentes vues du calendrier.

**Scénarios** :

- Afficher la vue "Month"
- Changer vers la vue "Week"
- Changer vers la vue "Day"
- Changer vers la vue "Agenda"
- Vérifier que les événements sont visibles dans chaque vue

**Code de test** :

```javascript
describe("Calendar Views", () => {
  it("should switch between calendar views", () => {
    cy.visit("/calendar");

    // Test Month view
    cy.get("button").contains("Month").click();
    cy.get(".rbc-month-view").should("be.visible");

    // Test Week view
    cy.get("button").contains("Week").click();
    cy.get(".rbc-time-view").should("be.visible");

    // Test Day view
    cy.get("button").contains("Day").click();
    cy.get(".rbc-time-view").should("be.visible");

    // Test Agenda view
    cy.get("button").contains("Agenda").click();
    cy.get(".rbc-agenda-view").should("be.visible");
  });
});
```

#### 7.2 Test : Navigation dans le calendrier (précédent/suivant)

**Description** : Vérifier que l'utilisateur peut naviguer entre les périodes.

**Scénarios** :

- Cliquer sur "Previous" pour aller à la période précédente
- Cliquer sur "Next" pour aller à la période suivante
- Cliquer sur "Today" pour revenir à la date actuelle
- Vérifier que la date affichée change correctement

---

### 8. Tests du Calendrier - Sélection de Créneaux

#### 8.1 Test : Création d'événement en sélectionnant un créneau

**Description** : Vérifier que l'utilisateur peut créer un événement en cliquant sur un créneau horaire.

**Scénarios** :

- Cliquer sur un créneau horaire dans le calendrier
- Vérifier que le formulaire est pré-rempli avec les dates de début et de fin
- Remplir le titre et soumettre
- Vérifier que l'événement est créé avec les bonnes dates

**Code de test** :

```javascript
describe("Calendar Slot Selection", () => {
  it("should pre-fill form when selecting a time slot", () => {
    cy.visit("/calendar");

    // Switch to week view for easier slot selection
    cy.get("button").contains("Week").click();

    // Click on a time slot (this requires specific selectors based on react-big-calendar)
    // The exact selector depends on the calendar implementation
    cy.get(".rbc-time-slot").first().click({ force: true });

    // Verify form is pre-filled
    cy.get('input[type="datetime-local"]').first().should("not.have.value", "");
    cy.get('input[type="datetime-local"]').last().should("not.have.value", "");
  });
});
```

---

### 9. Tests des Groupes - Création

#### 9.1 Test : Création d'un groupe

**Fichier** : `cypress/e2e/groups.cy.js`

**Description** : Vérifier que l'utilisateur peut créer un nouveau groupe.

**Scénarios** :

- Remplir le formulaire de création avec nom et description
- Soumettre le formulaire
- Vérifier que le groupe est créé
- Vérifier que le code d'invitation est affiché
- Vérifier que le groupe apparaît dans la liste

**Code de test** :

```javascript
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

    // Fill form
    cy.get('input[placeholder*="Nom du groupe" i]').type(groupName);
    cy.get('input[placeholder*="Description" i]').type(groupDescription);

    // Submit
    cy.contains("button", "Créer").click();

    // Wait for API call
    cy.wait("@createGroup");

    // Verify success message
    cy.contains("Groupe créé").should("be.visible");

    // Verify invite code is displayed
    cy.contains("ABCDEF").should("be.visible");

    // Verify group appears in list
    cy.contains(groupName).should("be.visible");
  });

  it("should show error when group name is empty", () => {
    cy.contains("button", "Créer").click();
    cy.contains("Nom requis").should("be.visible");
  });
});
```

---

### 10. Tests des Groupes - Rejoindre un Groupe

#### 10.1 Test : Rejoindre un groupe avec un code valide

**Description** : Vérifier que l'utilisateur peut rejoindre un groupe avec un code d'invitation valide.

**Scénarios** :

- Entrer un code d'invitation à 6 lettres
- Soumettre le formulaire
- Vérifier que le groupe est ajouté à la liste
- Vérifier le message de succès

**Code de test** :

```javascript
describe("Groups - Joining", () => {
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
    cy.contains("Vous avez rejoint le groupe").should("be.visible");

    // Verify group appears in list
    cy.contains("Joined Group").should("be.visible");
  });

  it("should show error for invalid code format", () => {
    cy.get('input[placeholder*="code" i]').type("ABC"); // Too short
    cy.contains("button", "Rejoindre").click();
    cy.contains("code à 6 lettres").should("be.visible");
  });

  it("should show error for invalid code", () => {
    cy.intercept("POST", "**/api/groups/join", {
      statusCode: 400,
      body: { error: "Invalid code" },
    }).as("joinGroupError");

    cy.get('input[placeholder*="code" i]').type("INVALID");
    cy.contains("button", "Rejoindre").click();
    cy.wait("@joinGroupError");
    cy.contains("Impossible de rejoindre").should("be.visible");
  });
});
```

---

### 11. Tests des Groupes - Navigation vers le Calendrier du Groupe

#### 11.1 Test : Affichage du calendrier d'un groupe

**Description** : Vérifier que l'utilisateur peut voir le calendrier d'un groupe spécifique.

**Scénarios** :

- Cliquer sur "Voir calendrier" pour un groupe
- Vérifier la navigation vers `/calendar?groupId=...`
- Vérifier que le paramètre `groupId` est présent dans l'URL
- Vérifier que le calendrier s'affiche correctement

**Code de test** :

```javascript
describe("Groups - Calendar Navigation", () => {
  beforeEach(() => {
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
    cy.url().should("include", "/calendar");
    cy.url().should("include", "groupId=group-1");
  });
});
```

---

### 12. Tests d'Intégration - Workflow Complet

#### 12.1 Test : Workflow complet de création d'événement dans un groupe

**Description** : Tester un workflow complet de bout en bout.

**Scénarios** :

1. Se connecter
2. Créer un groupe
3. Naviguer vers le calendrier du groupe
4. Créer un événement
5. Modifier l'événement
6. Supprimer l'événement

**Code de test** :

```javascript
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

    cy.get('input[placeholder*="Nom du groupe" i]').type("Workflow Group");
    cy.contains("button", "Créer").click();
    cy.wait("@createGroup");

    // 3. Navigate to group calendar
    cy.contains("button", "Voir calendrier").click();
    cy.url().should("include", "groupId=group-1");

    // 4. Create event
    cy.get('input[placeholder*="title" i]').type("Workflow Event");
    cy.get('input[type="datetime-local"]').first().type("2024-12-25T10:00");
    cy.get('input[type="datetime-local"]').last().type("2024-12-25T11:00");
    cy.contains("button", "Create Event").click();
    cy.contains("Workflow Event").should("be.visible");

    // 5. Edit event
    cy.contains("Workflow Event").click();
    cy.get('input[placeholder*="title" i]')
      .clear()
      .type("Updated Workflow Event");
    cy.contains("button", "Update Event").click();
    cy.contains("Updated Workflow Event").should("be.visible");

    // 6. Delete event
    cy.contains("Updated Workflow Event").click();
    cy.contains("button", "Delete Event").click();
    cy.contains("Updated Workflow Event").should("not.exist");
  });
});
```

---

### 13. Tests de Responsive Design (Optionnel)

#### 13.1 Test : Affichage sur différentes tailles d'écran

**Description** : Vérifier que l'application fonctionne correctement sur mobile et desktop.

**Scénarios** :

- Tester sur viewport mobile (375x667)
- Tester sur viewport tablette (768x1024)
- Tester sur viewport desktop (1920x1080)
- Vérifier que les éléments sont accessibles et fonctionnels

**Code de test** :

```javascript
describe("Responsive Design", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    it(`should display correctly on ${name}`, () => {
      cy.viewport(width, height);
      cy.visit("/");
      cy.contains("Calendar App").should("be.visible");
    });
  });
});
```

---

### 14. Tests de Performance et Chargement (Optionnel)

#### 14.1 Test : Temps de chargement des pages

**Description** : Vérifier que les pages se chargent dans un délai raisonnable.

**Scénarios** :

- Mesurer le temps de chargement de la page d'accueil
- Mesurer le temps de chargement du calendrier
- Mesurer le temps de chargement des groupes

---

## Résumé des Fichiers de Tests

1. **`cypress/e2e/signup.cy.js`** ✅ (Déjà implémenté)

   - Tests d'inscription complets

2. **`cypress/e2e/login.cy.js`** ✅ (Déjà implémenté)

   - Tests de connexion complets

3. **`cypress/e2e/navigation.cy.js`** ✅ (Implémenté)

   - Routes protégées
   - Redirections

4. **`cypress/e2e/homepage.cy.js`** ✅ (Implémenté)

   - Affichage de la page d'accueil
   - Navigation

5. **`cypress/e2e/calendar-events.cy.js`** ✅ (Implémenté)

   - Création d'événements
   - Édition d'événements
   - Suppression d'événements
   - Validation

6. **`cypress/e2e/calendar-views.cy.js`** ✅ (Implémenté)

   - Changement de vue
   - Navigation temporelle

7. **`cypress/e2e/groups.cy.js`** ✅ (Implémenté)

   - Création de groupes
   - Rejoindre un groupe
   - Navigation vers le calendrier du groupe

8. **`cypress/e2e/workflow.cy.js`** ✅ (Implémenté)

   - Workflows complets end-to-end

9. **`cypress/e2e/responsive.cy.js`** ✅ (Implémenté)

   - Tests responsive design
   - Affichage sur différentes tailles d'écran

10. **`cypress/e2e/performance.cy.js`** ✅ (Implémenté)
    - Tests de performance
    - Temps de chargement des pages

---

## Configuration Cypress

### Intercepts à Configurer

Pour que les tests fonctionnent correctement, vous devrez intercepter les appels API suivants :

1. **Authentification Supabase** :

   - `POST /auth/v1/signup`
   - `POST /auth/v1/token`
   - `POST /auth/v1/otp`

2. **Groupes** :

   - `GET /api/groups`
   - `POST /api/groups`
   - `POST /api/groups/join`
   - `GET /api/groups/:id/events`

3. **Événements** :
   - `GET /api/events`
   - `POST /api/events`
   - `PUT /api/events/:id`
   - `DELETE /api/events/:id`

---

## Commandes pour Exécuter les Tests

```bash
# Ouvrir Cypress en mode interactif
npx cypress open

# Exécuter tous les tests en mode headless
npx cypress run

# Exécuter un fichier de test spécifique
npx cypress run --spec "cypress/e2e/login.cy.js"

# Exécuter avec un navigateur spécifique
npx cypress run --browser chrome
```

---

## Bonnes Pratiques

1. **Isolation des Tests** : Chaque test doit être indépendant et ne pas dépendre d'autres tests.

2. **Mocking des APIs** : Utilisez `cy.intercept()` pour mocker toutes les réponses API afin que les tests soient rapides et fiables.

3. **Sélecteurs Stables** : Utilisez des sélecteurs basés sur le contenu ou des attributs `data-testid` plutôt que des classes CSS qui peuvent changer.

4. **Attentes Explicites** : Utilisez `cy.should()` pour attendre explicitement que les éléments soient visibles/interactifs.

5. **Nettoyage** : Utilisez `beforeEach` et `afterEach` pour nettoyer l'état entre les tests.

6. **Gestion des Erreurs** : Testez à la fois les cas de succès et les cas d'erreur.

---

## Prochaines Étapes

1. ✅ Implémenter les tests de navigation (`navigation.cy.js`) - **TERMINÉ**
2. ✅ Implémenter les tests de la page d'accueil (`homepage.cy.js`) - **TERMINÉ**
3. ✅ Implémenter les tests du calendrier (`calendar-events.cy.js`, `calendar-views.cy.js`) - **TERMINÉ**
4. ✅ Implémenter les tests des groupes (`groups.cy.js`) - **TERMINÉ**
5. ✅ Implémenter les tests de workflow (`workflow.cy.js`) - **TERMINÉ**
6. ✅ Ajouter des tests de performance (`performance.cy.js`) - **TERMINÉ**
7. ✅ Ajouter des tests responsive (`responsive.cy.js`) - **TERMINÉ**
8. Configurer l'intégration continue (CI/CD) pour exécuter les tests automatiquement

---

## Notes Importantes

- Assurez-vous que le serveur de développement (`npm run dev`) est en cours d'exécution avant de lancer les tests.
- Les tests utilisent des mocks pour les API, donc ils ne nécessitent pas de connexion réelle à Supabase.
- Ajustez les sélecteurs CSS selon votre implémentation réelle du composant Calendar (react-big-calendar).
- Certains tests peuvent nécessiter des ajustements en fonction de l'implémentation exacte de votre application.

---

**Total des Tests Planifiés : 15+ tests couvrant toutes les fonctionnalités principales de l'application.**

**✅ TOUS LES TESTS ONT ÉTÉ IMPLÉMENTÉS !**

- ✅ 8 fichiers de tests principaux
- ✅ 2 fichiers de tests optionnels (responsive et performance)
- ✅ 30+ tests individuels couvrant toutes les fonctionnalités
