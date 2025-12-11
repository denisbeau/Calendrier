## Grille d’évaluation – Checklist & Procédure

Ce document résume, pour chaque critère de la grille (TOTAL 100), ce qui est déjà couvert dans le projet, ce que vous devez encore **exécuter manuellement**, et quelles preuves fournir.

---

## 0. Organisation de la documentation

- **Dossier racine de documentation**
  - Recommandé : conserver ce fichier sous `documentation/workflows/evaluation-checklist.md`.
  - Vous pouvez y ajouter d’autres fichiers, par exemple :
    - `documentation/style-guides/git-guidelines.md`
    - `documentation/workflows/testing-workflow.md`

---

## 1. Contribution & normes Git (commits, branches, PR, revues) — 30 pts ✅ (effectué)

- **Ce qui est attendu**

  - Plusieurs branches de fonctionnalité (`feature/...`, `fix/...`, etc.).
  - Beaucoup de petits commits avec messages descriptifs.
  - (Optionnel) Pull Requests avec revues.

- **Commandes exécutées**

```bash
git status -sb

git checkout -b feature/final-evaluation

git add .
git commit -m "chore: finalize testing documentation and evidence"
git push -u origin feature/final-evaluation

# Pour montrer l’historique
git log --oneline --graph --all -20
git branch -a
```

- **Preuves à fournir**
  - Capture(s) d’écran montrant :
    - Plusieurs branches `feature/...`.
    - Un historique de commits propre avec des messages clairs.
  - (Optionnel) Capture de l’interface GitHub avec une PR et des commentaires de revue.

---

## 2. Couverture tests unitaires (≥ 75 % lignes/branches, rapport) — 10 pts ✅ (effectué)

- **Déjà en place dans le projet**

  - `vitest.config.js` : seuils de couverture configurés à ≥ 75 %.
  - Tests unitaires présents, notamment :
    - `src/utils/__tests__/dateUtils.test.js`
    - `src/services/__tests__/api.test.js`
    - `src/features/calendar/hooks/__tests__/useCalendarEvents.test.js`
    - `src/features/auth/__tests__/Login.test.jsx`
    - `src/features/auth/__tests__/SignUp.test.jsx`
  - Rapport de couverture déjà généré dans `coverage/`.

- **Commandes exécutées**

```bash
npm install
npm run test:coverage
```

- **Vérification & preuves**

  - Ouvrir le rapport HTML :

    ```bash
    # Windows
    start coverage/index.html
    ```

  - Vérifier que Statements / Branches / Functions / Lines sont tous ≥ 75 %.
  - Capture(s) d’écran :
    - Résumé de couverture dans le terminal.
    - Page `coverage/index.html` avec les pourcentages.

---

## 3. Tests d’intégration (≥ 3 cas critiques, verts en CI) — 10 pts ✅ (effectué)

- **Déjà en place dans le projet**

  - Fichiers :
    - `src/__tests__/integration/auth.integration.test.js`
    - `src/__tests__/integration/calendar.integration.test.js`
    - `src/__tests__/integration/groups.integration.test.js`
  - Environ 9 tests couvrant au moins 3 cas critiques.

- **Commandes exécutées**

```bash
npm run test:integration
```

- **Vérification & preuves**
  - Tous les tests doivent passer localement.
  - Capture du terminal montrant `npm run test:integration` avec tous les tests verts.
  - Une fois poussé sur GitHub :
    - Aller dans l’onglet **Actions**.
    - Vérifier que l’étape « integration tests » du workflow est verte.
    - Faire une capture d’écran du workflow vert.

---

## 4. Tests E2E (≥ 3 parcours utilisateurs critiques, verts en CI) — 10 pts ✅ (effectué localement)

- **Déjà en place dans le projet**

  - Fichiers Cypress principaux :
    - `cypress/e2e/login.cy.js`
    - `cypress/e2e/signup.cy.js`
    - `cypress/e2e/navigation.cy.js`
    - `cypress/e2e/homepage.cy.js`
    - `cypress/e2e/calendar-events.cy.js`
    - `cypress/e2e/calendar-views.cy.js`
    - `cypress/e2e/groups.cy.js`
    - `cypress/e2e/workflow.cy.js`
    - `cypress/e2e/responsive.cy.js`
    - `cypress/e2e/performance.cy.js`
  - 30+ tests couvrant les parcours critiques.

- **Option 1 (recommandée, exécutée) : script E2E complet**

```bash
npm run test:e2e
```

- **Option 2 : manuel (2 terminaux, si besoin uniquement)**

```bash
# Terminal 1 : démarrer le serveur
npm run dev

# Terminal 2 : lancer Cypress en mode headless
npm run cypress:run
```

- **Option 3 : Cypress UI (pour développement)**

```bash
npm run cypress:open
```

- **Preuves à fournir**
  - Capture(s) d’écran de Cypress (CLI ou UI) montrant tous les specs verts.
  - Mention explicite de quelques parcours clés (ex. : inscription, connexion, création d’événement, rejoindre un groupe).
  - Capture du job E2E vert dans GitHub Actions.

---

## 5. Utilisation de Cucumber (≥ 3 scénarios Given/When/Then) — 5 pts ✅ (scénarios .feature verts)

- **Déjà en place dans le projet**

  - Fichiers `.feature` :
    - `cypress/e2e/signup.feature`
    - `cypress/e2e/calendar-event.feature`
    - `cypress/e2e/group-join.feature`
  - Step definitions :
    - `cypress/support/step_definitions/common.steps.js`

- **Commandes exécutées**

```bash
# Vérifier la présence des fichiers .feature
ls cypress/e2e/*.feature

# Lancer uniquement les scénarios Cucumber (2 terminaux)
npm run dev
npm run cypress:run -- --spec "cypress/e2e/**/*.feature"
```

- **Preuves à fournir**
  - Capture d’écran de Cypress montrant les 3 fichiers `.feature` verts.
  - Capture d’un `.feature` ouvert dans l’éditeur, avec des Given/When/Then lisibles.

---

## 6. Toutes les fonctionnalités fonctionnent ET sont testées (démo + preuves) — 10 pts ✅ (tests automatisés exécutés)

- **Ce que couvrent déjà les tests**

  - Authentification : Login, Signup, Magic Link.
  - Calendrier : création/édition/suppression d’événements.
  - Groupes : création, rejoindre un groupe.
  - Navigation : routes protégées.
  - Responsive design (breakpoints principaux).

- **Commandes exécutées (automatisé)**

```bash
npm run test:coverage
npm run test:integration
npm run test:e2e
```

- **Démo manuelle (à faire vous-même)**

```bash
npm run dev
```

Dans le navigateur :

- Créer un compte (Signup), se connecter (Login).
- Créer/modifier/supprimer un événement dans le calendrier.
- Créer un groupe, rejoindre un groupe.
- Vérifier la navigation (pages protégées, redirections).

- **Preuves à fournir**
  - Vidéo courte OU plusieurs captures d’écran montrant les principaux parcours utilisateur dans l’application.
  - Captures du terminal montrant les 3 commandes de test qui passent.

---

## 7. Sokrates.dev — Goals tous au vert — 15 pts ✅ (analyse régénérée)

- **Déjà en place dans le projet**

  - Rapports générés dans :
    - `_sokrates/reports/html/index.html`
    - `_sokrates/reports/data/*`
  - Goals clés (tels que décrits dans `TESTING_SETUP.md`) déjà au vert.

- **Commandes exécutées**

```bash
java -jar sokrates-LATEST.jar generateReports -confFile _sokrates/config.json -outputFolder _sokrates/reports

# Windows
start _sokrates/reports/html/index.html
```

- **Vérification & preuves**
  - Dans le rapport HTML, vérifier que :
    - `LINES_OF_CODE_MAIN` est dans la zone verte.
    - `DUPLICATION_PERCENTAGE` < 5 %.
    - `VERY_HIGH_RISK_FILE_SIZE_COUNT` = 0.
    - `CONDITIONAL_COMPLEXITY_VERY_HIGH_RISK_COUNT` = 0.
  - Prendre une capture d’écran de la page affichant ces goals tous au vert.

---

## 8. Sokrates.dev — montrer avant/après (captures datées) — 5 pts

- **Déjà disponible**

  - Historique et données dans `_sokrates/history/` et `_sokrates/reports/data/`.

- **Ce que vous devez faire**

  1. Ouvrir le rapport actuel :

     ```bash
     start _sokrates/reports/html/index.html
     ```

  2. (Optionnel) Ouvrir un rapport/snapshot plus ancien ou la vue « Trend ».
  3. Faire au moins deux captures d’écran :
     - Une vue « avant » (plus de duplication / métriques moins bonnes).
     - Une vue « après » (goals au vert, duplication réduite, etc.).
  4. Sauvegarder les captures dans la documentation :

     ```bash
     mkdir -p documentation/evidence
     ```

     - `documentation/evidence/sokrates-before.png`
     - `documentation/evidence/sokrates-after.png`

---

## 9. CI/CD (GitHub Actions vert : build + tests) — 5 pts

- **Déjà en place dans le projet**

  - Fichier workflow : `.github/workflows/ci.yml`.
  - Étapes prévues : build + tests unitaires + intégration + E2E + Cucumber.

- **Commandes à exécuter (GitHub)**

```bash
# Ajouter le dépôt distant si nécessaire
git remote add origin https://github.com/<votre-username>/<votre-repo>.git

# Pousser la branche principale et les branches de travail
git push -u origin main
git push -u origin --all
```

- **Vérification sur GitHub**
  1. Aller dans l’onglet **Actions** du dépôt.
  2. Vérifier qu’un workflow `ci.yml` s’exécute sur les `push` / `pull_request`.
  3. S’assurer que toutes les étapes du workflow sont **vertes** (build + tests).
  4. Faire une capture d’écran du run CI vert.

---

## 10. Checklist finale avant rendu

- **Tests**

  - [ ] `npm run test:coverage` → tous les tests unitaires passent, couverture ≥ 75 %.
  - [ ] `npm run test:integration` → 9 tests d’intégration passent.
  - [ ] `npm run test:e2e` → tous les tests E2E passent.
  - [ ] Scénarios Cucumber (.feature) verts dans Cypress.

- **Git**

  - [ ] Branches `feature/...` visibles (`git branch -a`).
  - [ ] Historique de commits clair (`git log --oneline --graph --all -20`).
  - [ ] (Optionnel) PR ouverte et revue sur GitHub.

- **Sokrates**

  - [ ] `_sokrates/reports/html/index.html` ouvert.
  - [ ] 4 goals principaux au vert.
  - [ ] Captures « avant/après » sauvegardées dans `documentation/evidence/`.

- **CI/CD**

  - [ ] `.github/workflows/ci.yml` présent et commité.
  - [ ] Au moins un run GitHub Actions vert (build + tests).

- **Fonctionnalités**
  - [ ] Application démarrée (`npm run dev`).
  - [ ] Parcours utilisateur principaux testés manuellement (auth, calendrier, groupes, navigation).

Si tous les éléments ci-dessus sont cochés et documentés (captures, logs, rapports), vous pouvez présenter le projet comme satisfaisant **100/100** sur la grille d’évaluation.
