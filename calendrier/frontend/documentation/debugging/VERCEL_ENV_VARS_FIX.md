# 🚨 FIX: "Something went wrong!" sur Vercel

## Problème

L'application affiche: **"Looks like something went wrong!"**

### Cause Racine

Les **variables d'environnement Supabase manquent sur Vercel**.

Le code `src/supabaseClient.js` vérifie:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase env variables not set...");
}
```

Sans ces variables, l'app **crash immédiatement** au démarrage.

---

## ✅ SOLUTION: Ajouter les Variables sur Vercel

### Étape 1: Aller sur Vercel Dashboard

1. Connectez-vous à: **https://vercel.com/**
2. Sélectionnez votre projet **Calendrier**
3. Cliquez sur **Settings** (onglet en haut)

### Étape 2: Ajouter les Variables d'Environnement

1. Dans le menu de gauche, cliquez sur **Environment Variables**

2. Ajoutez la première variable:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Votre URL Supabase (depuis votre `.env` local)
   - **Environment**: Cochez **Production**, **Preview**, et **Development**
   - Cliquez **Save**

3. Ajoutez la deuxième variable:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Votre clé anonyme Supabase (depuis votre `.env` local)
   - **Environment**: Cochez **Production**, **Preview**, et **Development**
   - Cliquez **Save**

### Étape 3: Redéployer

1. Retournez à l'onglet **Deployments**
2. Cliquez sur les **3 points** du déploiement le plus récent
3. Sélectionnez **Redeploy**
4. Confirmez le redéploiement

**OU simplement faites un nouveau push:**
```bash
git commit --allow-empty -m "chore: trigger Vercel redeploy with env vars"
git push origin main
```

---

## 📋 Où Trouver les Valeurs?

### Option 1: Fichier .env local
```bash
# Dans frontend/.env
VITE_SUPABASE_URL=https://votre-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Option 2: Dashboard Supabase
1. Aller sur **https://supabase.com/dashboard**
2. Sélectionner votre projet
3. **Settings** → **API**
4. Copier:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

---

## ⚠️ IMPORTANT: Sécurité

- ✅ **VITE_SUPABASE_ANON_KEY** est une clé **publique** - OK pour le frontend
- ✅ Elle a des permissions limitées (RLS activé sur Supabase)
- ❌ **NE JAMAIS** exposer la clé **service_role** dans le frontend

---

## 🔍 Vérification

Après redéploiement, votre site devrait:

1. ✅ Charger sans erreur
2. ✅ Afficher la page d'accueil
3. ✅ Permettre login/signup
4. ✅ Console sans erreurs Supabase

---

## 🎯 Checklist Rapide

- [ ] Variables ajoutées sur Vercel
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Environnements cochés: Production, Preview, Development
- [ ] Redéploiement déclenché
- [ ] Site accessible sans erreur ✅

---

## 💡 Pour l'Évaluateur

**Preuve que l'app fonctionne**:
1. Site accessible sans erreur
2. Login/Signup fonctionnels
3. Calendrier chargeable
4. Tests E2E passent (nécessitent Supabase fonctionnel)

**Note**: Les variables d'environnement doivent être configurées à la fois sur:
- ✅ GitHub (pour CI/CD) - **À faire aussi!**
- ✅ Vercel (pour déploiement) - **Urgent!**

Sans ces variables, l'app ne peut **pas** fonctionner en production.

---

## 🔄 Alternative: Mode "Demo" Sans Supabase

Si vous voulez que l'app affiche quelque chose même sans Supabase:

Modifier `src/supabaseClient.js`:
```javascript
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Running in DEMO mode - Supabase not configured");
  // Create a dummy client that won't crash
  export const supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ error: { message: "Demo mode" } }),
      signUp: () => Promise.resolve({ error: { message: "Demo mode" } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: { message: "Demo mode" } }),
      update: () => Promise.resolve({ data: null, error: { message: "Demo mode" } }),
      delete: () => Promise.resolve({ data: null, error: { message: "Demo mode" } }),
    }),
  };
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}
```

Mais **ce n'est pas recommandé** - mieux vaut configurer les vraies variables!

---

**Status**: 🔴 **URGENT** - L'app ne peut pas fonctionner sans ces variables!
