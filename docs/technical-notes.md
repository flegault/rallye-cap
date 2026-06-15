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
- `started`: match explicitement débuté dans l'état actuel; à remplacer par une progression de demi-manche plus explicite
- `locks.innings`: ancien stockage de manches barrées, conservé seulement pour compatibilité avec l'état sauvegardé
- `locks.halves`: stockage interne transitoire des demi-manches complétées, indexées sous la forme `inning:debut` ou `inning:fin`
- `route`: vue active

Quand le match est commencé, l'action `Optimiser` est désactivée. Les demi-manches complétées ne doivent pas être recalculées automatiquement. Les changements de joueurs pendant le match doivent viser les demi-manches futures et laisser les corrections ambiguës à l'entraîneur.

Dette fonctionnelle connue: quand toutes les demi-manches sont complétées, l'état actuel peut laisser l'entraîneur bloqué sans action claire pour terminer le match et préparer un nouveau match avec les mêmes joueurs. Une prochaine itération devrait distinguer `match terminé`, `nouveau match avec joueurs conservés` et `recommencer en supprimant les données`.

Le tableau principal rend les manches en deux demi-manches. Les assignations défensives restent stockées par manche dans `schedule`, mais l'édition défensive est bloquée quand la demi-manche défensive correspondante est complétée. Les rangs de frappe affichés pour une demi-manche offensive complétée utilisent `battingOrders` pour éviter de réécrire l'historique quand l'ordre futur change.

Avant le début du match, les lignes du tableau suivent `order` et le glisser-déposer de la première colonne déplace la ligne complète. Quand le match est débuté, le rendu stabilise les lignes par joueur enregistré actif, et `order` sert seulement de rang courant. `generateAll()` remet `order` dans l'ordre des joueurs enregistrés avant de recalculer l'alignement.

## Refactor workflow cible

Le workflow cible remplace l'ancien onglet `Jouer` par une gestion directe dans `Alignement`. Les routes principales sont:

- `#match`: édition des métadonnées seulement tant que `started` est faux;
- `#joueurs`: édition de la liste seulement tant que `started` est faux;
- `#alignement`: édition de l'alignement avant match, suivi de progression pendant le match, validations, suggestions, statistiques et changements de joueurs;
- `#spectateur`: vue en lecture seule dérivée du même état;
- `#partager`: exports et liens, sans être une étape numérotée du workflow.

`#alignement` démarre le match avec confirmation si la progression est encore au début. Le démarrage est bloqué si l'alignement n'est pas minimalement prêt: 6 à 12 joueurs actifs, au moins une manche préparée et 6 positions défensives assignées pour chaque manche prévue. Une fois le match commencé, les champs de match, la liste des joueurs, l'ajout de joueurs, `Frappe fixe` et `Optimiser` sont verrouillés ou masqués.

Le menu du haut garde seulement les étapes principales visibles. `Partager`, `Spectateur`, `Charger un exemple` et `Réinitialiser` sont regroupés dans `Autres`. `Charger un exemple` est bloqué pendant un match débuté.

Le libellé durable souhaité pour l'action destructive globale est `Recommencer`, pas `Réinitialiser`. L'implémentation doit préciser si les joueurs sont conservés ou effacés.

État transitoire: l'onglet `Jouer` n'est plus visible et l'ancienne route `#jouer` est redirigée vers `#alignement`. Le modèle interne utilise encore `started` et `locks.halves`; il devrait éventuellement être remplacé par un index monotone de demi-manche complétée ou courante, par exemple `currentHalfIndex` ou `completedHalfCount`. Les demi-manches passées deviendraient alors de l'historique non modifiable, la demi-manche courante serait mise en évidence, et les demi-manches futures resteraient modifiables dans `Alignement`.

Dette restante: le refactor de workflow a été livré surtout au niveau navigation/rendu. La logique demeure fortement centralisée dans `app.js`, avec des conditions dispersées dans les fonctions de rendu et d'interaction. L'extraction en modules testables reste à faire.

Pour limiter la complexité, les actions en cours de match devraient être des commandes explicites sur l'état:

- avancer à la prochaine demi-manche;
- ne pas reculer dans l'interface principale;
- enlever un joueur pour le futur;
- remplacer un joueur pour le futur;
- ajouter un joueur pour le futur.

Dans la cible simplifiée, ces commandes sont exposées dans `Alignement`. Les commandes de changement de joueurs doivent demander la demi-manche d'effet, verrouiller implicitement les demi-manches précédentes comme jouées, puis appliquer les changements seulement aux demi-manches futures. Les suggestions automatiques doivent filtrer les demi-manches déjà jouées.

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
- date du jour initialisée pour un nouveau match;
- ajout de joueurs;
- génération et régénération;
- modification manuelle par glisser-déposer;
- navigation cible `Match`, `Joueurs`, `Alignement`, `Partage`, `Spectateur`;
- démarrage explicite du match;
- blocage du démarrage quand l'alignement n'est pas minimalement prêt;
- progression vers la prochaine demi-manche;
- absence de retour arrière dans l'interface principale;
- ajout d'un joueur en match débuté;
- remplacement d'un joueur en match débuté;
- retrait d'un joueur actif avec seulement 6 joueurs disponibles;
- export HTML autonome.
- fin de match et nouveau match avec les mêmes joueurs;
- export parents avec beaucoup de joueurs et noms longs;
- aperçu modifiable de l'export mini imprimante;
- vue spectateur avec lanceurs affichés sur deux lignes.

## Direction d'architecture

Objectif progressif:

- garder une version statique simple;
- séparer les responsabilités;
- éviter un grand changement de framework tant que les règles métier ne sont pas testées.

Découpage actuel:

- `index.html`: structure HTML et points de montage;
- `styles.css`: styles de l'application;
- `app.js`: état, moteur d'alignement, rendu, exports et interactions.
- `rules.js`: validations pures des règles obligatoires, nettoyage des positions, résumé des violations d'horaire, statistiques/équité et garde-fous métier simples comme la validation de démarrage. `startReadiness()` refuse aussi un horaire vide pour éviter de débuter un match sans alignement réel;
- `tests/rules.html`: tests navigateur simples pour les règles obligatoires.

Découpage recommandé:

- `src/domain/lineup.js`: génération, validations, statistiques;
- `src/domain/state.js`: normalisation de l'état;
- `src/ui/render.js`: rendu DOM;
- `src/ui/exports.js`: HTML courriel, impression, image, spectateur;
- `tests/`: cas métier.
