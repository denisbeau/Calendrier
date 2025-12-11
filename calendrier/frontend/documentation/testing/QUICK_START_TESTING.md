# Guide Rapide - Vérification des Tests

## 🚀 Commandes Rapides

### Tests Unitaires (Couverture ≥75%)
```bash
npm run test:coverage
```
**Résultat attendu :** Tous les tests passent, couverture ≥75% ✅

---

### Tests d'Intégration (≥3 cas critiques)
```bash
npm run test:integration
```
**Résultat attendu :** 9 tests passent dans 3 fichiers ✅

---

### Tests E2E et Cucumber

**Option 1 : Script automatique (recommandé)**
```bash
npm run test:e2e
```
Ce script démarre automatiquement le serveur, attend qu'il soit prêt, puis lance les tests E2E.

**Option 2 : Cypress UI (pour développement)**
```bash
npm run cypress:open
```
Cypress UI démarre automatiquement le serveur et vous permet de voir les tests s'exécuter.

**Option 3 : Manuel (deux terminaux)**
```bash
# Terminal 1
npm run dev

# Terminal 2 (dans un nouveau terminal)
npm run cypress:run
```

**Résultat attendu :** 30+ tests E2E passent + 9 scénarios Cucumber ✅

---

## ✅ Checklist Rapide

```bash
# 1. Tests unitaires
npm run test:coverage
# ✅ Vérifier : Couverture ≥75% (actuellement 80.64% branches)

# 2. Tests d'intégration
npm run test:integration
# ✅ Vérifier : 9 tests passent

# 3. Tests E2E (script automatique)
npm run test:e2e     # Démarre serveur + lance tests automatiquement
# ✅ Vérifier : Tous les tests E2E passent

# 4. Vérifier Cucumber
ls cypress/e2e/*.feature
# ✅ Vérifier : 3 fichiers .feature présents
```

---

## 📊 Résultats Attendus

### Tests Unitaires
- **56 tests** passent
- **Couverture :** 91.13% statements, 80.64% branches, 95.12% functions, 93.04% lines

### Tests d'Intégration
- **9 tests** dans 3 fichiers
- Tous les cas critiques couverts

### Tests E2E
- **30+ tests** dans 10 fichiers
- Tous les parcours utilisateurs couverts

### Cucumber
- **9 scénarios** dans 3 fichiers .feature
- Tous les scénarios Given/When/Then lisibles

---

## 🎯 Tous les Critères Satisfaits

✅ **100/100 points** - Prêt pour la Sprint Review !

