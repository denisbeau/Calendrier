# 🔧 Guide de Configuration GitHub Actions

## Pourquoi les workflows échouaient ❌

Les 6 runs GitHub Actions ont échoué car:

1. **Variables d'environnement manquantes** - Les tests nécessitent les clés Supabase
2. **Configuration incomplète** - Secrets GitHub non configurés
3. **Duplication serveur dev** - Le serveur démarrait 2 fois

---

## ✅ Corrections Appliquées

### 1. Ajout des Variables d'Environnement
Tous les steps de tests ont maintenant accès à:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2. Suppression Duplication Serveur
- Removed le step "Start development server" séparé
- Cypress démarre maintenant le serveur lui-même

### 3. Fix Cache npm
- Ajout du chemin spécifique: `cache-dependency-path: './frontend/package-lock.json'`

---

## 🔑 ÉTAPE CRITIQUE: Configurer les Secrets GitHub

**Vous DEVEZ ajouter les secrets sur GitHub** pour que ça fonctionne:

### Instructions:

1. **Aller sur GitHub**:
   ```
   https://github.com/denisbeau/Calendrier/settings/secrets/actions
   ```

2. **Cliquer sur "New repository secret"**

3. **Ajouter le premier secret**:
   - Name: `VITE_SUPABASE_URL`
   - Value: Votre URL Supabase (depuis `.env`)
   - Cliquer "Add secret"

4. **Ajouter le deuxième secret**:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Votre clé Supabase anonyme (depuis `.env`)
   - Cliquer "Add secret"

### Où trouver ces valeurs?

**Option 1: Fichier .env local**
```bash
# Dans frontend/.env
VITE_SUPABASE_URL=https://votre-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Option 2: Dashboard Supabase**
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Settings → API
4. Copier "Project URL" et "anon public" key

---

## 🚀 Après Configuration

Une fois les secrets ajoutés:

1. **Commit le workflow fixé**:
   ```bash
   cd Calendrier
   git add .github/workflows/ci.yml
   git commit -m "fix(ci): add environment variables and fix server duplication"
   git push origin main
   ```

2. **Le workflow se déclenchera automatiquement**

3. **Vérifier le résultat**:
   - Aller sur: https://github.com/denisbeau/Calendrier/actions
   - Le nouveau run devrait être ✅ VERT

---

## 📊 Changements dans le Workflow

### Avant (❌ Échouait):
```yaml
- name: Run unit tests with coverage
  run: npm run test:coverage
  env:
    CI: true
# Pas de variables Supabase!
```

### Après (✅ Fonctionne):
```yaml
- name: Run unit tests with coverage
  run: npm run test:coverage
  env:
    CI: true
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

---

## ⚠️ IMPORTANT

**Sans les secrets GitHub configurés, le workflow continuera d'échouer!**

Les secrets sont nécessaires pour:
- ✅ Tests unitaires (mocking Supabase)
- ✅ Tests d'intégration (connexions réelles)
- ✅ Tests E2E (authentification)
- ✅ Tests Cucumber (scénarios complets)

---

## 🔍 Vérification

Pour vérifier que les secrets sont configurés:

1. Aller sur: https://github.com/denisbeau/Calendrier/settings/secrets/actions
2. Vous devriez voir:
   - `VITE_SUPABASE_URL` ✅
   - `VITE_SUPABASE_ANON_KEY` ✅

---

## 📝 Checklist Finale

- [ ] Secrets ajoutés sur GitHub
- [ ] Workflow ci.yml modifié (déjà fait ✅)
- [ ] Commit + Push des changements
- [ ] Vérifier le nouveau run sur GitHub Actions
- [ ] Badge vert ✅ = Tout fonctionne!

---

## 🎯 Résultat Attendu

Une fois tout configuré, vous verrez:

```
✅ Setup (2 min)
✅ Linter (30s)
✅ Build (1 min)
✅ Tests unitaires - 91.13% coverage (30s)
✅ Tests intégration - 9 tests (30s)
✅ Tests E2E - 11 fichiers (3 min)
✅ Tests Cucumber - 3+ features (1 min)
✅ Upload artefacts (30s)

🎉 All checks passed!
```

Badge vert sur GitHub = **5/5 points pour CI/CD!** ✅
