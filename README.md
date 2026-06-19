# Rallye-Cap

Application SPA statique pour préparer, ajuster et partager l'alignement d'une équipe de baseball Rallye-Cap.

## Utilisation

Ouvrir `index.html` dans un navigateur moderne. Les données restent sauvegardées localement sur l'appareil avec `localStorage`.

## Synchronisation Firebase optionnelle

L'application reste utilisable sans Firebase. Pour tester la sauvegarde en ligne:

1. Créer un projet Firebase avec Authentication et Firestore.
2. Activer les méthodes de connexion courriel/mot de passe et Google.
3. Copier `firebase-config.example.js` vers `firebase-config.js` et remplacer les valeurs.
4. Optionnel mais recommandé avant production: créer une clé de site reCAPTCHA v3, enregistrer l'app dans Firebase App Check, puis ajouter `appCheckSiteKey` dans `firebase-config.js`.
5. Déployer des règles basées sur `firestore.rules`.

### Déploiement GitHub Pages avec secrets

Le workflow `.github/workflows/pages.yml` publie l'app statique sur GitHub Pages et génère `firebase-config.js` pendant le déploiement. La vraie configuration Firebase ne doit pas être committée.

Dans GitHub, configurer d'abord Pages avec `Settings > Pages > Build and deployment > Source: GitHub Actions`, puis ajouter ces secrets dans `Settings > Secrets and variables > Actions`:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_APPCHECK_SITE_KEY`

Le secret `FIREBASE_APPCHECK_SITE_KEY` doit contenir la clé de site reCAPTCHA v3 utilisée par Firebase App Check. Ne pas ajouter de debug token dans les secrets de production.

### App Check en debug local

Pour tester App Check en local, ajouter temporairement ceci dans `firebase-config.js`:

```js
appCheckSiteKey: "CLE_SITE_RECAPTCHA_V3",
appCheckDebugToken: true
```

Ouvrir ensuite l'app avec la console du navigateur ouverte. Firebase affiche un jeton `AppCheck debug token`. Copier ce jeton dans Firebase Console > App Check > app Web > Manage debug tokens. Après l'avoir enregistré, remplacer `true` par la valeur du jeton:

```js
appCheckDebugToken: "JETON_DEBUG_ENREGISTRE"
```

Ne pas activer l'enforcement App Check tant que les métriques Firebase affichent encore des requêtes `Unverified`, `invalid` ou `outdated client`. En local, fermer les anciens onglets et faire un rechargement complet aide à éliminer les requêtes provenant d'une vieille version de l'app.

La sync sauvegarde seulement le match courant. Les archives restent locales. Le partage spectateur public utilise un lien `#public/...`; avec mot de passe, la projection publique est chiffrée côté client avant d'être écrite dans Firestore.

Les diagrammes Mermaid de cette intégration sont dans [`docs/firebase-firestore-sync.md`](docs/firebase-firestore-sync.md).

Flux principal actuel:

1. `Match`: adversaire, local/visiteur, date, heure, endroit, manches initiales et option `Frappe fixe`.
2. `Joueurs`: présences/absences pour le match courant.
3. `Alignement`: ordre des frappeurs, optimisation, progression par demi-manche, validations, suggestions et changements de joueurs.

`Accueil` sert de porte d'entrée contextuelle. `Équipe` gère le nom de l'équipe et le bassin permanent de joueurs hors workflow. `Partager` et `Spectateur` sont accessibles dans le menu.

L'app doit rester utilisable hors ligne et conserver le français du Québec en UTF-8.

## Fonctionnalités

- Génération d'un alignement défensif respectant les règles obligatoires Rallye-Cap.
- Ajustement manuel de l'ordre et des positions.
- Progression du match par demi-manche, avec historique non modifiable.
- Changements de joueurs en cours de match à partir d'une demi-manche choisie.
- Fin de match avec choix d'archiver localement ou non, puis retour à l'accueil.
- Archives locales en lecture seule, indépendantes des changements futurs à l'équipe.
- Exports `Banc`, `Programme` et `Texte`.
- Vue `Spectateur` locale en lecture seule.

L'ancien export HTML autonome du spectateur est retiré. La cible future pour partager le spectateur hors de l'app est un lien en ligne en lecture seule.

## Documentation

- `AGENTS.md`: consignes de maintenance pour agents.
- `docs/product-spec.md`: règles produit et parcours utilisateur.
- `docs/site-structure.md`: structure de navigation et pistes d'optimisation UX.
- `docs/technical-notes.md`: état, architecture et notes d'implémentation.
- `docs/roadmap.md`: améliorations, dettes et décisions à prendre.

## Tests

Ouvrir `tests/rules.html` dans un navigateur pour exécuter les tests des règles obligatoires. Une vérification rapide du JavaScript peut aussi être faite avec:

```powershell
node --check app.js
```
