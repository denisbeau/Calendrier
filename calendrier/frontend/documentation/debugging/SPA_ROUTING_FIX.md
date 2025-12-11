# Fix pour l'erreur 404 lors du rafraîchissement des pages

## Problème

Lorsque vous rafraîchissez une page sur une route autre que `/` (par exemple `/calendar`, `/login`, `/groups`), vous obtenez une erreur 404.

**Erreur typique :**
```
404: NOT_FOUND
Code: NOT_FOUND
ID: iad1::q85zg-1764880317210-8fe80dbb421f
```

## Cause

Dans une Single Page Application (SPA) avec React Router, toutes les routes sont gérées côté client. Quand vous rafraîchissez la page sur `/calendar`, le serveur web essaie de trouver un fichier physique à cet emplacement, mais il n'existe pas. Le serveur doit être configuré pour rediriger toutes les requêtes vers `index.html`, qui chargera ensuite React Router pour gérer la route.

## Solution

J'ai ajouté des fichiers de configuration pour différentes plateformes de déploiement :

### 1. **Vercel** (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. **Netlify** (`netlify.toml` et `public/_redirects`)
- `netlify.toml` : Configuration Netlify
- `public/_redirects` : Fichier de redirections Netlify (aussi utilisé par d'autres plateformes)

### 3. **Vite Dev Server** (`vite.config.js`)
La configuration Vite a été mise à jour pour mieux gérer le routing en développement.

## Déploiement

### Pour Vercel :
1. Le fichier `vercel.json` sera automatiquement détecté
2. Redéployez votre application
3. Les routes devraient maintenant fonctionner lors du rafraîchissement

### Pour Netlify :
1. Les fichiers `netlify.toml` et `public/_redirects` seront automatiquement détectés
2. Redéployez votre application
3. Les routes devraient maintenant fonctionner lors du rafraîchissement

### Pour d'autres plateformes :
- **Apache** : Créez un fichier `.htaccess` dans le dossier `public` :
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  ```

- **Nginx** : Ajoutez dans votre configuration :
  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

- **GitHub Pages** : Utilisez le fichier `public/_redirects` ou créez un fichier `404.html` qui redirige vers `index.html`

## Test

1. Déployez votre application
2. Naviguez vers une route comme `/calendar` ou `/login`
3. Rafraîchissez la page (F5 ou Ctrl+R)
4. La page devrait se charger correctement sans erreur 404

## Notes

- Le fichier `public/_redirects` est copié dans le dossier `dist` lors du build Vite
- Assurez-vous que ces fichiers sont commités dans votre repository
- Après le déploiement, il peut y avoir un léger délai avant que les changements prennent effet

