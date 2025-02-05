# Portfolio Vue.js - Ben Mecha Ali

Un portfolio professionnel multilingue développé avec Vue.js 3, TypeScript et Tailwind CSS.

## 🌟 Fonctionnalités

- 🌍 Support multilingue (Français, Anglais, Arabe)
- 🌓 Thème clair/sombre
- 📱 Design responsive
- ⚡ Animations fluides avec VueUse Motion
- 🎨 UI moderne avec Tailwind CSS
- 🔍 SEO optimisé
- 🗺️ Génération automatique du sitemap

## 🛠️ Technologies utilisées

- Vue.js 3
- TypeScript
- Tailwind CSS
- Vue Router
- Vue I18n
- VueUse (Motion, Head, Core)
- Lucide Icons
- Vite

## 📦 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/BenMacha/benmacha.github.io.git
cd benmacha.github.io
```

2. Installez les dépendances avec pnpm :
```bash
pnpm install
```

3. Lancez le serveur de développement :
```bash
pnpm dev
```

## 🔧 Personnalisation

### Structure du projet

```
src/
├── components/        # Composants réutilisables
├── i18n/             # Fichiers de traduction
│   └── locales/      # FR, EN, AR translations
├── views/            # Pages de l'application
├── router/           # Configuration des routes
└── App.vue           # Composant racine
```

### Modification des informations

1. **Informations personnelles** : Modifiez les fichiers de traduction dans `src/i18n/locales/` :
   - `fr.json` pour le français
   - `en.json` pour l'anglais
   - `ar.json` pour l'arabe

2. **Expérience professionnelle** : Mettez à jour la section `experience.items` dans les fichiers de traduction.

3. **Projets** : Modifiez la section `projects.items` et `projects.github.items` dans les fichiers de traduction.

4. **Compétences** : Mettez à jour le composant `Skills.vue` avec vos compétences.

### Personnalisation du thème

Le thème est configurable dans `src/style.css` et `tailwind.config.js`. Vous pouvez modifier :

- Les couleurs du thème
- La typographie
- Les espacements
- Les animations

## 📝 Scripts disponibles

- `pnpm dev` : Lance le serveur de développement
- `pnpm build` : Compile le projet pour la production
- `pnpm preview` : Prévisualise la version de production
- `pnpm sitemap` : Génère le sitemap

## 🚀 Déploiement

### GitHub Pages

1. Créez un nouveau dépôt sur GitHub nommé `username.github.io` (remplacez `username` par votre nom d'utilisateur GitHub)

2. Ajoutez le fichier `.github/workflows/deploy.yml` :
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'pnpm'
          
      - name: Install Dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm build
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.5
        with:
          branch: gh-pages
          folder: dist
```

3. Configurez la base URL dans `vite.config.ts` :
```ts
export default defineConfig({
  base: '/',  // Si vous utilisez un domaine personnalisé
  // OU
  base: '/nom-du-repo/',  // Si vous utilisez username.github.io/nom-du-repo
  plugins: [vue()]
})
```

4. Poussez vos modifications :
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push
```

5. Dans les paramètres du dépôt GitHub, activez GitHub Pages et sélectionnez la branche `gh-pages`.

### Cloudflare Pages

1. Connectez-vous à votre tableau de bord Cloudflare

2. Allez dans "Pages" et cliquez sur "Create a project"

3. Connectez votre dépôt GitHub

4. Configurez les paramètres de build :
   - Framework preset : Vue
   - Build command : `pnpm build`
   - Build output directory : `dist`
   - Node.js version : 18

5. Variables d'environnement (si nécessaire) :
   ```
   NODE_VERSION=18
   ```

6. Cliquez sur "Save and Deploy"

7. (Optionnel) Configurez votre domaine personnalisé :
   - Dans l'onglet "Custom domains"
   - Cliquez sur "Set up a custom domain"
   - Suivez les instructions pour configurer les enregistrements DNS

### Configuration du routeur pour l'hébergement statique

Pour que le routage fonctionne correctement sur les hébergements statiques, ajoutez un fichier `public/_redirects` (pour Netlify/Cloudflare) :
```
/* /index.html 200
```

Ou un fichier `public/404.html` qui redirige vers la racine pour GitHub Pages.

## 📄 Licence

MIT

## 👤 Contact

- Site web : [benmacha.tn](https://benmacha.tn)
- GitHub : [@BenMacha](https://github.com/BenMacha)
- LinkedIn : [Ben Mecha Ali](https://www.linkedin.com/in/ben-mecha-ali)