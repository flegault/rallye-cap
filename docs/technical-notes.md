# Notes techniques

## État

L'état applicatif est sauvegardé dans `localStorage` avec la clé `rallye_cap_qc_v4`.

Champs principaux:

- `team`, `opp`, `date`, `place`
- `side`: `visiteur` ou `locale`
- `fixed`: frappe fixe activée ou non
- `innings`: nombre de manches
- `players`: joueurs enregistrés
- `order`: ordre des joueurs par identifiant
- `battingOrders`: snapshots d'ordre au bâton par demie-manche offensive barrée, indexés sous la forme `inning:debut` ou `inning:fin`
- `schedule`: positions par manche
- `started`: match explicitement débuté
- `locks.innings`: ancien stockage de manches barrées, conservé seulement pour compatibilité avec l'état sauvegardé
- `locks.halves`: stockage interne transitoire des demi-manches complétées, indexées sous la forme `inning:debut` ou `inning:fin`
- `route`: vue active

Quand `started` est vrai, l'action `Optimiser` est désactivée. Revenir avant le début du match depuis `Jouer` remet `started` à `false`, vide `locks` et vide `battingOrders`, avec confirmation. Les demi-manches complétées ne doivent pas être recalculées automatiquement. Les changements de joueurs pendant le match doivent viser les demi-manches futures et laisser les corrections ambiguës à l'entraîneur.

Le tableau principal rend les manches en deux demi-manches. Les assignations défensives restent stockées par manche dans `schedule`, mais l'édition défensive est bloquée quand la demi-manche défensive correspondante est complétée. L'interface n'affiche plus de cadenas; `Jouer` avance ou recule la progression en modifiant encore `locks.halves` à l'interne. Les rangs de frappe affichés pour une demi-manche offensive complétée utilisent `battingOrders` pour éviter de réécrire l'historique quand l'ordre futur change.

Avant le début du match, les lignes du tableau suivent `order` et le glisser-déposer de la première colonne déplace la ligne complète. Quand le match est débuté, le rendu stabilise les lignes par joueur enregistré actif, et `order` sert seulement de rang courant. `generateAll()` remet `order` dans l'ordre des joueurs enregistrés avant de recalculer l'alignement.

## Refactor workflow cible

La première tranche du workflow cible est livrée dans la SPA statique. Les routes principales sont:

- `#match`: édition des métadonnées seulement tant que `started` est faux;
- `#joueurs`: édition de la liste seulement tant que `started` est faux;
- `#alignement`: édition complète de l'alignement seulement tant que `started` est faux;
- `#jouer`: vue de progression pendant un match commencé;
- `#spectateur`: vue en lecture seule dérivée du même état;
- `#partager`: exports et liens, sans être une étape numérotée du workflow.

`#jouer` démarre le match avec confirmation si `started` est faux. Le démarrage est bloqué si l'alignement n'est pas minimalement prêt: 6 à 12 joueurs actifs et 6 positions défensives assignées pour chaque manche prévue. Une fois le match commencé, les champs de match, la liste des joueurs, l'ajout de joueurs, `Frappe fixe` et `Optimiser` sont verrouillés ou masqués dans les vues de préparation.

Le menu du haut garde seulement les étapes principales visibles. `Partager`, `Spectateur`, `Charger un exemple` et `Réinitialiser` sont regroupés dans `Autres`. `Charger un exemple` est bloqué pendant un match débuté.

État transitoire: le workflow cible est visible dans l'interface, mais le modèle interne n'est pas encore complètement refactoré. La progression devrait éventuellement remplacer `locks` par un index de demi-manche courante ou complétée, par exemple `currentHalfIndex`. Les demi-manches passées deviendraient alors de l'historique non modifiable, la demi-manche courante serait mise en évidence, et les demi-manches futures resteraient modifiables seulement par les actions permises dans `Jouer`.

Dette restante: le refactor de workflow a été livré surtout au niveau navigation/rendu. La logique demeure fortement centralisée dans `app.js`, avec des conditions dispersées dans les fonctions de rendu et d'interaction. L'extraction en modules testables reste à faire.

Pour limiter la complexité, les actions en cours de match devraient être des commandes explicites sur l'état:

- avancer à la prochaine demi-manche;
- revenir à la demi-manche précédente avec confirmation;
- revenir avant le début avec confirmation et retour à l'alignement partant;
- enlever un joueur pour le futur;
- remplacer un joueur pour le futur;
- ajouter un joueur pour le futur.

## Moteur d'alignement

Le moteur actuel choisit 6 défenseurs par manche, puis assigne les positions. Il pénalise notamment:

- les joueurs au banc deux manches de suite;
- les joueurs déjà très utilisés;
- les lanceurs qui étaient lanceurs à la manche précédente;
- les répétitions au premier but.

Ces trois contraintes doivent être considérées comme obligatoires dans l'évolution du moteur:

- `1B` au maximum une fois par joueur;
- aucune présence de lanceur deux manches consécutives, que ce soit `L1` ou `L2`;
- aucune présence au banc deux manches consécutives.

Avec 4 manches et 6 à 12 joueurs actifs, le moteur devrait normalement trouver une solution valide. Les scores d'équité doivent servir à choisir entre plusieurs solutions valides, pas à accepter une violation obligatoire.

La prochaine amélioration structurelle recommandée est d'extraire cette logique hors du DOM, par exemple dans un module pur qui reçoit un état normalisé et retourne un horaire, des validations et des statistiques.

## Encodage

Standard attendu:

- fichiers texte en UTF-8;
- HTML avec `<meta charset="utf-8">`;
- français du Québec conservé tel quel;
- pas de conversion en ASCII;
- pas de mélange Windows-1252/UTF-8.

Symptômes à corriger:

- `Ã©` au lieu de `é`;
- `Ã¨` au lieu de `è`;
- `Ã ` au lieu de `à`;
- `â€™` au lieu de `'` ou `’`;
- `âœ”` au lieu de `✔`;
- `âš ` au lieu de `⚠`.

## Tests à ajouter

Tests unitaires prioritaires:

- normalisation de l'état sauvegardé;
- rotation des frappeurs en frappe fixe;
- génération avec 6, 7, 10 et 12 joueurs;
- absence de banc deux manches consécutives;
- absence de lanceur deux manches consécutives;
- aucun joueur à `1B` plus d'une fois;
- génération qui respecte toutes les règles obligatoires avec 4 manches et 6 à 12 joueurs;
- robustesse quand un joueur est désactivé après génération.

Tests navigateur prioritaires:

- chargement de l'exemple;
- ajout de joueurs;
- génération et régénération;
- modification manuelle par glisser-déposer;
- navigation `Match`, `Joueurs`, `Alignement partant`, `Jouer`, `Partage`, `Spectateur`;
- démarrage explicite du match;
- blocage du démarrage quand l'alignement n'est pas minimalement prêt;
- progression vers la prochaine demi-manche;
- retour à la demi-manche précédente avec confirmation;
- ajout d'un joueur en match débuté;
- remplacement d'un joueur en match débuté;
- retrait d'un joueur actif avec seulement 6 joueurs disponibles;
- export HTML autonome.

## Direction d'architecture

Objectif progressif:

- garder une version statique simple;
- séparer les responsabilités;
- éviter un grand changement de framework tant que les règles métier ne sont pas testées.

Découpage actuel:

- `index.html`: structure HTML et points de montage;
- `styles.css`: styles de l'application;
- `app.js`: état, moteur d'alignement, rendu, exports et interactions.
- `rules.js`: validations pures des règles obligatoires, nettoyage des positions, résumé des violations d'horaire, statistiques/équité et garde-fous métier simples comme la validation de démarrage;
- `tests/rules.html`: tests navigateur simples pour les règles obligatoires.

Découpage recommandé:

- `src/domain/lineup.js`: génération, validations, statistiques;
- `src/domain/state.js`: normalisation de l'état;
- `src/ui/render.js`: rendu DOM;
- `src/ui/exports.js`: HTML courriel, impression, image, mode match;
- `tests/`: cas métier.
