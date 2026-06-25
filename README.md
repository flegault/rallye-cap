# Rallye-Cap

Application web statique pour préparer, ajuster et partager l'alignement d'une équipe de baseball Rallye-Cap.

L'app aide les entraîneurs à créer un alignement clair et équitable, à suivre la progression du match, à gérer les changements de joueurs et à partager une version simple pour les parents.

## Fonctionnalités

- Gestion de plusieurs équipes locales, avec un bassin permanent de joueurs séparé par équipe.
- Préparation de matchs avec adversaire, date, heure, endroit, local/visiteur, nombre de manches et frappe fixe.
- Présences et absences par match.
- Génération d'un alignement défensif selon les règles Rallye-Cap.
- Ajustement manuel de l'ordre des frappeurs et des positions.
- Suivi du match par demi-manche dans l'onglet `Alignement`.
- Changements de joueurs en cours de match.
- Validation des règles obligatoires.
- Statistiques et indicateurs d'équité.
- Archives de matchs en lecture seule.
- Exports `Programme`, `Banc` et `Texte`.
- Vue `Spectateur` locale en lecture seule.
- Synchronisation Firebase optionnelle pour les matchs mis en ligne.
- Liens publics pour spectateurs en direct, avec mot de passe optionnel.
- Lien permanent public par équipe (`#fans/...`) avec liste des joueurs et des matchs partagés.
- Favoris multiples côté parents/spectateurs, mémorisés seulement dans leur navigateur.

## Utilisation locale

Aucune installation n'est requise.

Ouvrir simplement `index.html` dans un navigateur moderne.

Les données sont sauvegardées localement dans le navigateur avec `localStorage`, sous la clé:

```text
rallye_cap_qc_v5
```

L'application reste utilisable hors ligne à partir des fichiers statiques.

## Structure du projet

```text
index.html                  Structure HTML de l'application
styles.css                  Styles
app.js                      Logique applicative principale
rules.js                    Validations pures des règles obligatoires
firebase-sync.js            Synchronisation Firebase optionnelle
firebase-config.example.js  Exemple de configuration Firebase
firestore.rules             Règles Firestore
tests/rules.html            Tests navigateur des règles
docs/                       Documentation produit, UX et technique
```

## Workflow principal

Le flux principal suit la préparation réelle d'un match:

```text
Match -> Joueurs -> Alignement
```

- `Accueil`: point d'entrée contextuel.
- `Équipe`: gestion du nom de l'équipe active et de son bassin permanent de joueurs.
- `Mes matchs`: matchs locaux, matchs en ligne et archives de l'équipe active.
- `Match`: informations du match.
- `Joueurs`: présences et absences pour le match courant.
- `Alignement`: génération, ajustements, progression du match et changements de joueurs.
- `Partager`: exports du match courant et gestion des liens publics de l'équipe active.
- `Spectateur`: vue simplifiée en lecture seule.

La barre du haut affiche l'équipe active et permet de changer d'équipe ou d'en créer une nouvelle. Les joueurs, les matchs, les liens publics d'équipe et les liens spectateurs restent séparés par équipe; il n'y a pas de déplacement de match entre équipes.

## Règles Rallye-Cap prises en charge

L'application valide notamment:

- de 6 à 12 joueurs actifs pour un match;
- 4 à 9 manches;
- 6 défenseurs par manche;
- une seule assignation par position défensive;
- positions `1B`, `2B`, `3B`, `AC`, `L1`, `L2`;
- aucun joueur au `1B` plus d'une fois;
- aucun lanceur deux manches consécutives;
- aucun joueur au banc deux manches consécutives.

Les règles obligatoires sont traitées comme des erreurs à corriger, pas comme de simples préférences.

## Firebase optionnel

L'application fonctionne sans Firebase.

Firebase sert seulement à ajouter une couche de synchronisation en ligne pour les matchs explicitement mis en ligne et les liens publics spectateurs.

Les données privées de l'entraîneur restent locales par défaut. Les documents cloud servent aux matchs mis en ligne, aux liens publics `#public/...` et aux liens permanents d'équipe `#fans/...`.

Dans `Partager`:

- `Lien permanent d'équipe` gère l'identifiant public, le mot de passe optionnel, la copie et le retrait du lien de l'équipe active.
- `Spectateurs en direct` crée le lien public du match courant.
- La liste des matchs partagés permet de copier ou retirer les liens publics de l'équipe active.

Le lien public d'équipe publie une projection limitée: nom d'équipe, joueurs (`playerId`, nom, numéro, libellé) et résumés des matchs publiés. Avec mot de passe, cette projection est chiffrée côté client avant l'écriture Firestore.

Pour l'activer en local:

1. Créer un projet Firebase avec Authentication et Firestore.
2. Activer la connexion par courriel/mot de passe et Google.
3. Copier `firebase-config.example.js` vers `firebase-config.js`.
4. Remplacer les valeurs par celles du projet Firebase.
5. Déployer les règles à partir de `firestore.rules`.
6. Optionnel: configurer Firebase App Check avec reCAPTCHA v3.

`firebase-config.js` ne doit pas être committé.

## Déploiement GitHub Pages

Le workflow GitHub Actions `.github/workflows/pages.yml` publie l'application statique sur GitHub Pages.

Pour l'utiliser:

1. Aller dans `Settings > Pages`.
2. Choisir `Build and deployment > Source: GitHub Actions`.
3. Ajouter les secrets GitHub Actions nécessaires:

```text
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_APP_ID
FIREBASE_APPCHECK_SITE_KEY
```

Le workflow génère `firebase-config.js` pendant le déploiement à partir des secrets.

La vraie configuration Firebase ne doit pas être stockée dans le dépôt.

## App Check en développement local

Pour tester Firebase App Check en local, ajouter temporairement ceci dans `firebase-config.js`:

```js
appCheckSiteKey: "CLE_SITE_RECAPTCHA_V3",
appCheckDebugToken: true
```

Ouvrir ensuite l'application avec la console du navigateur ouverte. Firebase affichera un jeton `AppCheck debug token`.

Ajouter ce jeton dans Firebase Console:

```text
App Check > app Web > Manage debug tokens
```

Puis remplacer `true` par la valeur du jeton enregistré:

```js
appCheckDebugToken: "JETON_DEBUG_ENREGISTRE"
```

Ne jamais ajouter de debug token dans les secrets GitHub ou dans un fichier publié.

## Tests

Les tests actuels sont des tests navigateur simples.

Ouvrir:

```text
tests/rules.html
```

Une vérification syntaxique rapide peut aussi être lancée avec Node:

```powershell
node --check app.js
node --check rules.js
node --check firebase-sync.js
```

## Documentation

- `AGENTS.md`: consignes de maintenance pour agents.
- `docs/product-spec.md`: règles produit et parcours utilisateur.
- `docs/site-structure.md`: structure de navigation et décisions UX.
- `docs/technical-notes.md`: architecture, état et notes d'implémentation.
- `docs/firebase-firestore-sync.md`: détails de synchronisation Firebase.
- `docs/roadmap.md`: améliorations prévues, dettes et décisions.

## Notes de maintenance

- Les fichiers texte et HTML doivent rester en UTF-8.
- Le français du Québec doit être conservé.
- Les données des joueurs et des matchs restent locales par défaut.
- L'application doit rester utilisable hors ligne.
- Les changements de règles métier doivent être documentés dans `docs/product-spec.md`.
- Les changements de navigation ou de flux utilisateur doivent être documentés dans `docs/site-structure.md`.
- Les décisions techniques durables doivent être documentées dans `docs/technical-notes.md`.
