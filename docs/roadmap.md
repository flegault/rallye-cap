# Roadmap

## Maintenant

- Compléter la gestion multi-match restante: actions avancées de reprise/recommencement à partir d'un match archivé.
- Stabiliser les changements de joueurs en cours de match: retrait, remplacement, ajout imprévu, choix de la demi-manche d'effet et historique des demi-manches déjà jouées.
- Raffiner la gestion des positions futures incomplètes après un retrait ou remplacement pendant le match.
- Améliorer les exports et partages: PDF parents responsive et aperçu modifiable pour l'export `Texte`.
- Extraire la logique métier de `app.js` dans des modules testables.
- Ajouter des tests pour la génération, la progression par demi-manche et les cas limites des changements de joueurs.

## Workflow actuel

Le workflow livré est maintenant:

```text
Match -> Joueurs -> Alignement
```

`Partager` et `Spectateur` sont des vues hors étapes numérotées, accessibles dans le menu.

### Navigation

- Livré: le header est simplifié en un menu global unique avec statut compact du match; les étapes `Match`, `Joueurs` et `Alignement` restent dans le contenu plutôt que dans la barre du haut.
- `#accueil`: porte d'entrée contextuelle; création de l'équipe si elle manque, reprise du match ou création d'un nouveau match.
- `#equipe`: gestion hors workflow de notre équipe et du bassin permanent de joueurs.
- `#match`: informations du match, côté local/visiteur, adversaire, date, heure et endroit.
- `#joueurs`: liste des joueurs du match et présence/absence avant le début.
- `#alignement`: frappe fixe, ordre des frappeurs, optimisation défensive, progression du match, validations, suggestions, statistiques et changements de joueurs.
- `#partager`: exports `Banc`, `Programme` et `Texte`. Le partage courriel et le spectateur autonome sont retirés.
- `#spectateur`: vue simplifiée en lecture seule.
- Anciennes routes:
  - `#jouer` redirige vers `#alignement`.

### Alignement

- `Alignement` remplace l'ancienne séparation `Alignement partant` / `Jouer`.
- `Optimiser` recalcule les positions défensives sans modifier l'ordre de frappe courant.
- Le bouton shuffle près de `Optimiser` mélange l'ordre de frappe des joueurs actifs, puis optimise les positions.
- L'ordre peut encore être modifié manuellement par glisser-déposer avant le début du match.
- Les joueurs ajoutés avant match vont à la fin de l'ordre.
- L'ajout, la suppression et la présence/absence avant match déclenchent une optimisation automatique à la première arrivée sur `Alignement` quand 6 à 12 joueurs sont actifs.

### Match commencé

- Le match avance seulement vers l'avant, une demi-manche à la fois.
- Les demi-manches passées sont historiques et non modifiables.
- Les informations de match, la liste des joueurs, la frappe fixe, le shuffle et `Optimiser` sont bloqués ou masqués quand le match est commencé.
- `Changement de joueurs` dans `Alignement` ouvre `Retirer`, `Remplacer` ou `Ajouter`, puis demande la demi-manche d'effet.
- Les suggestions et les corrections automatiques doivent viser seulement les demi-manches non jouées.

### Partage et spectateur

- `Partager` et `Spectateur` ne font plus partie du chemin numéroté.
- Le spectateur autonome est retiré de `Partager`; la cible de partage externe devient un futur lien en ligne en lecture seule.
- L'accès à `Spectateur` reste possible même si certains exports devront éventuellement être bloqués selon la validité du match.

### Équipe et joueurs permanents

- Notre équipe et son bassin de joueurs sont gérés séparément du workflow de match.
- Cette gestion ne devient pas une étape numérotée et elle est accessible dans `Équipe`.
- Elle permet de définir le nom de notre équipe et d'ajouter, renommer ou supprimer des joueurs pour les matchs futurs.
- Le workflow `Joueurs` sert alors à indiquer les présences et absences du match courant, sans supprimer de joueur du bassin permanent.
- L'accueil contextuel est livré pour la création d'équipe, la reprise du match courant, la création d'un nouveau match et l'accès aux archives.

### Gaps connus du workflow

- La fin de match offre maintenant une sortie de base complète: archiver ou non, conserver l'équipe et les joueurs, puis retourner à l'accueil. Il reste à livrer les actions avancées de reprise/recommencement.
- Les exports doivent être contrôlés plus finement selon la validité réelle du match.
- Les changements de joueurs doivent encore être stabilisés quand ils créent des positions futures incomplètes.
- Le modèle de données courant utilise encore `team` et `players` comme bassin permanent et comme base du match courant. Une séparation interne plus nette reste à faire avant une synchronisation ou publication en ligne.

## Prochaines fonctionnalités candidates

- Ajouter des titres de page différents par vue/hash afin d'améliorer l'historique du navigateur et le retour arrière.
- Explorer Firebase/Firestore pour publier optionnellement un match avec un lien ou un QR code toujours à jour.
- Sauvegarder plusieurs matchs.
- Livré: ajouter une page d'archives des matchs passés.
- Terminer un match avec action explicite, puis offrir `Nouveau match avec les mêmes joueurs` ou `Recommencer ce match`.
  - Livré partiellement: à la fin de la dernière demi-manche, l'application propose d'archiver ou non, ferme le match courant, conserve l'équipe et les joueurs, puis retourne à l'accueil.
- Ajouter les archives à l'accueil contextuel quand la gestion multi-match sera disponible.
  - Livré: l'accueil affiche le nombre d'archives locales et ouvre la page `Archives`.
- Importer et exporter une liste de joueurs.
- Normaliser automatiquement la casse des noms de joueurs à l'ajout, par exemple `marquis grissom` -> `Marquis Grissom`.
- Livré: ajouter un champ optionnel de numéro de chandail à 2 chiffres dans les cartes joueurs de `Équipe`. Le numéro est éditable seulement hors match, comme le nom du joueur. Il apparaît en pastille dans l'alignement et reste disponible pour `Programme`, `Banc`, `Texte`, `Spectateur` et les futurs partages parents/fans.
- Optimiser automatiquement l'alignement la première fois qu'on arrive sur `Alignement` après des changements de joueurs, parce que les ajouts/retraits ne sont pas toujours bien reflétés avant optimisation.
  - Livré: ajout, suppression et présence/absence avant match déclenchent une optimisation automatique à l'arrivée sur `Alignement`.
- À la première arrivée sur `Alignement`, offrir de mélanger l'ordre au bâton avant d'afficher l'alignement, idéalement avec l'option aléatoire comme choix simple et réversible avant le début du match.
- Livré: ajouter une action à la demande pour mélanger l'ordre au bâton avec une icône shuffle près de `Optimiser`. Le mélange optimise automatiquement les positions, mais `Optimiser` seul conserve maintenant l'ordre courant.
- Décision: garder `Match` avant `Joueurs`, parce que l'équipe permanente est maintenant séparée et que les présences/absences se décident dans le contexte d'un match daté.
- Évaluer plus tard une correction de progression avancée. L'interface principale doit d'abord avancer seulement d'une demi-manche à la fois.
- Deuxième passe Alignement: permettre de recommencer un match démarré par erreur tant que le début de 1re manche n'est pas terminé, avec confirmation claire et retour à l'état non commencé.
- Pour `Spectateur`, explorer plus tard un suivi en direct du déroulement du match basé sur la progression courante.
- Dans `Spectateur`, indiquer clairement quand le match n'est pas commencé et placer la vue au début dans ce cas.
- Dupliquer un match existant.
- Ajouter un écran de résumé avant impression.
- En mode attaque, afficher les lanceurs de la prochaine manche défensive si applicable.
- En mode défense, afficher les deux premiers frappeurs de la prochaine manche offensive si applicable.
- Livré: harmoniser le look de la vue spectateur avec le reste de l'application, retirer l'en-tête global dans cette vue et afficher les états `En cours`, `Terminée` et `À venir`.

## Match et joueurs

Le découpage actuel sépare la préparation en deux étapes:

- `Match`: adversaire, local/visiteur, date, heure et endroit;
- `Joueurs`: présence/absence des joueurs disponibles pour le match courant.

La gestion durable de notre équipe, de son nom et de son bassin de joueurs est séparée de ce découpage dans `Équipe`, sans devenir une étape du workflow.

À stabiliser:

- initialiser les nouveaux matchs avec la date du jour;
- ajouter le nombre de manches initial dans l'étape `Match`, puisque c'est une propriété du match prévu avant l'ajustement de l'alignement;
- déplacer le réglage `Frappe fixe` dans l'étape `Match`, puisqu'il décrit les règles/configurations du match courant. Il devient non modifiable après le début du match;
- utiliser une heure en format 24h avec intervalles de 5 minutes;
- Livré: `Match` contient maintenant les manches initiales, `Frappe fixe`, l'heure 24h par pas de 5 minutes, l'heure par défaut `18:30` et une mise en page plus claire sans texte d'aide redondant sur `Équipe`.
- garder `Réinitialiser` pour l'action destructive globale, parce qu'elle efface vraiment toutes les données locales;
- normaliser automatiquement la casse des noms de joueurs à l'ajout;
- garder les actions de modification clairement bloquées quand le match est débuté.

À ne pas changer pour l'instant:

- garder les libellés local/visiteur plutôt que passer à un langage phrase du type `visitent les` / `reçoivent les`. Ce langage est intéressant, mais la grammaire varie selon les noms d'équipe.

## Accueil

Améliorations UX à prévoir:

- états du match:
  - `Aucun match prévu`;
  - `En préparation`;
  - `En cours`, avec la demi-manche courante affichée.
- dans le détail du match, afficher date, heure et endroit;
- Livré: l'accueil utilise `Aucun match prévu`, `Préparer un match`, `Match en préparation` et `En cours` avec la demi-manche courante, et affiche date, heure et endroit quand disponibles.

## Équipe et joueurs

Améliorations UX à prévoir:

- Livré: ajouter le numéro de chandail optionnel dans `Équipe`, éditable seulement avant match;
- Livré: `Équipe` affiche un compteur de joueurs dans l'en-tête.
- Livré: l'action `Créer une équipe exemple` est placée sous la liste des joueurs et son avertissement précise que l'équipe, les matchs et les archives locales sont remplacés.
- dans l'étape `Joueurs`, garder des cartes de même taille pour les joueurs présents et absents;
- dans l'étape `Joueurs`, ne pas afficher de carte vide `Aucun` quand il n'y a pas de présents ou d'absents; la bulle de total existante suffit.
- Livré: les boîtes `Présents` et `Absents` restent affichées en tout temps, avec des cartes de même hauteur dans une grille à deux colonnes.
- Livré: quand plus de 12 joueurs existent dans le bassin ou sont collés dans la liste, les joueurs excédentaires restent visibles comme absents au lieu d'être perdus.
- Livré partiellement: `Joueurs` ne contient plus `Frappe fixe`.

## Alignement

- L'ordre des frappeurs se modifie directement dans le tableau principal en glissant les joueurs.
- L'option `Frappe fixe` doit migrer vers l'écran `Match`, car elle fait partie des paramètres du match courant.
- L'interface doit indiquer que `Frappe fixe` est normalement activée en Rallye-Cap.
- Les validations et l'équité suivent le tableau principal pour servir de rétroaction après l'ajustement.
- Simplifier la densité de l'écran `Alignement`:
  - consolider l'introduction, les actions de progression et le tableau dans une seule carte;
  - retirer le pill de statut redondant quand le bouton de progression et le tableau indiquent déjà l'état;
  - placer `mélanger`, `Optimiser`, `Commencer/terminer la demi-manche` et `Changement de joueurs` au-dessus du tableau;
  - garder une section `Validation` visible comme verdict rapide;
  - afficher les règles obligatoires avec `check` ou `x`;
  - afficher l'équité avec `check`, `warning` ou `x`;
  - renommer `Problèmes et suggestions` en `Suggestions`;
  - afficher `Suggestions` seulement quand il y a des actions concrètes à proposer;
  - regrouper les cartes d'équité et le tableau détaillé dans une section `Statistiques et équité`;
  - garder les cartes d'équité dans cette section, idéalement repliée par défaut.
  - Livré partiellement: `Suggestions` est renommé et masqué quand il n'y a rien d'actionnable; les cartes d'équité et le tableau sont regroupés dans `Statistiques et équité`.
- Livré: stabiliser la taille des boutons `Mélanger`, `Optimiser`, `Commencer` / `Terminer...`, `Changement de joueurs` et des boutons `+` / `-` de manches afin que l'interface ne bouge pas selon le texte.
- Livré: remplacer l'icône seule de shuffle par le libellé texte `Mélanger`.
- Livré: mode local `Préparer` / `Jouer` au-dessus du tableau d'alignement, sans recréer une route `Jouer`:
  - avant match, `Préparer` contient `Mélanger` et `Optimiser`;
  - quand l'entraîneur veut commencer, il passe à `Jouer`;
  - `Jouer` contient `Commencer le match` puis la progression de demi-manche, ainsi que `Changement de joueurs`;
  - quand le match est commencé, l'interface force le mode `Jouer`;
  - `Préparer` reste utile avant match pour ajuster l'ordre et les positions.

## Archives

Améliorations UX à prévoir:

- ne pas afficher les détails d'une archive par défaut;
- permettre de fermer le détail d'une archive ouverte;
- ajouter éventuellement un tri par date ascendant/descendant;
- ajouter éventuellement de la pagination quand la liste devient longue;
- ajouter éventuellement des filtres par équipe/adversaire.

## Publication optionnelle en ligne

Firebase/Firestore est une avenue prometteuse pour publier un match spécifique tout en gardant l'application locale par défaut.

Modèle souhaité:

- local-first: rien n'est envoyé en ligne tant que l'entraîneur ne publie pas le match;
- publication explicite d'un seul match;
- lien ou QR code vers une version consultable;
- deux vues futures: archive privée complète pour l'entraîneur et projection publique limitée pour les parents;
- la projection publique doit être dérivée d'un snapshot de match, pas du bassin d'équipe courant;
- données publiques minimales: prénoms, numéros si disponibles, ordre, positions, infos de match;
- accès public seulement aux personnes qui ont le lien;
- vue parents en lecture seule avec informations limitées comme minimum;
- mode assistant modifiable à évaluer plus tard;
- possibilité de dépublier ou remplacer le lien plus tard.

Notes de coût:

- Firebase/Firestore offre un palier sans frais qui semble suffisant pour un prototype et une petite utilisation d'équipe.
- Les quotas et prix peuvent changer; vérifier la page officielle Firebase avant de dépendre du service.

Points à définir avant implémentation:

- format exact des documents Firestore privé/public;
- règles de sécurité pour empêcher la modification non autorisée;
- stratégie `publicId` non devinable et `editToken` local;
- durée de conservation ou suppression manuelle;
- comportement hors ligne quand un match publié ne peut pas être synchronisé.

## Partages parents et vues fans

À explorer:

- `Programme`: ajouter une première page style poster avec les équipes, date, heure, joueurs présents et numéros de chandail, avec une composition visuelle baseball en arrière-plan.
- Évaluer si le `Programme` doit devenir un PDF multi-page plutôt qu'une seule image quand on ajoute une page poster et que le contenu doit éviter les coupures.
- Future vue fan joueur: vue centrée sur un joueur, montrant quelles manches il frappe, défend ou encourage.
- La vue fan joueur est probablement une vue partageable en ligne ou une extension de `Spectateur`; la forme exacte reste à explorer plus tard.

## Sortie Texte

Un export `Texte` minimal est disponible dans `Partager` pour imprimer rapidement un alignement de dernière minute avec une petite imprimante, l'application Funny Print ou une autre application.

Objectifs livrés:

- format texte brut, sans HTML;
- lisible sur papier étroit;
- priorité aux informations utiles en match;
- facile à copier dans une autre application.

À améliorer:

- Afficher le texte généré dans un champ éditable avant la copie. Les modifications manuelles ne sont pas sauvegardées dans l'état du match.
- Séparer la génération du texte et l'action `Copier`, afin de permettre une correction rapide avant d'envoyer vers Funny Print.

Contenu actuel:

- équipe, adversaire, date ou terrain si utile;
- ordre des frappeurs;
- défensive par manche;
- lanceurs clairement visibles;
- banc par manche;
- très peu de décoration.

## Changement de joueurs sur mobile: priorité

L'application doit aider l'entraîneur à ajuster rapidement un match déjà préparé quand la liste réelle change juste avant ou pendant le match, surtout sur téléphone.

Objectif UX:

- permettre un changement en quelques gestes;
- rester lisible et utilisable sur un petit écran, possiblement au banc ou près du terrain;
- éviter de demander une raison détaillée;
- montrer clairement l'impact sur les manches, le banc, l'ordre des frappeurs et l'équité;
- préserver le plus possible les ajustements manuels déjà faits.
- demander une confirmation avant les opérations qui peuvent modifier beaucoup l'alignement, comme recalculer plusieurs manches ou remplacer plusieurs assignations manuelles.
- expliquer brièvement ce qui sera conservé, ce qui sera recalculé et quelles manches sont touchées avant de confirmer un gros changement.

Cas à couvrir:

- absence de dernière minute d'un joueur prévu;
- retard d'un joueur prévu;
- ajout de dernière minute d'un joueur disponible;
- substitution ou remplacement temporaire;
- joueur qui quitte ou se blesse en cours de match;
- joueur présent qui n'était pas prévu au départ.

Comportement souhaité:

- conserver le plus possible l'alignement déjà ajusté manuellement;
- conserver les manches déjà jouées ou déjà confirmées;
- recalculer seulement les manches futures ou ce qui devient invalide;
- afficher clairement les impacts sur l'ordre des frappeurs, les positions, le banc et l'équité;
- permettre de revenir à la liste initiale si l'ajustement était temporaire.

Statuts possibles:

- actif;
- retardé ou pas encore disponible;
- absent ou retiré du match;
- ajouté au match;
- inactif hors match.

Il n'est pas nécessaire de distinguer les raisons dans l'app. Une absence, un retard, une blessure, un départ, un joueur prêté à l'autre équipe ou une autre indisponibilité peuvent être traités comme un changement de disponibilité. Un joueur emprunté ou présent sans être prévu est traité comme ajouté au match.

Comportement livré:

- progression de match directement dans `Alignement`;
- bouton `Commencer le match`, puis action simple pour terminer la demi-manche courante;
- avancement seulement vers l'avant, sans retour arrière dans l'interface principale;
- tableau principal séparé en demies-manches `Début` / `Fin` avec icônes `🏏` attaque et `🧤` défensive selon visiteur/local;
- glisser-déposer de l'ordre qui déplace les lignes complètes avant le début du match;
- `Optimiser` désactivé quand le match est commencé;
- `Optimiser` préserve l'ordre au bâton courant avant le match;
- bouton shuffle pour mélanger l'ordre au bâton avant le match et optimiser automatiquement les positions;
- lignes du tableau principal stables par joueur après le début du match, avec rang courant dans la première colonne;
- snapshots d'ordre au bâton pour les demies-manches offensives jouées afin de préserver l'historique;
- ajout direct d'un joueur en match commencé après choix de la demi-manche d'effet; le remplacement reste une action séparée;
- remplacement qui substitue les joueurs dans l'ordre et les assignations futures;
- retrait d'un joueur actif avec avertissement, sans toucher aux demi-manches jouées;
- obligation de remplacer un joueur si seulement 6 joueurs sont actifs.

## Stabilisation changements en cours de match

Bogues majeurs à prioriser:

- Quand toutes les demi-manches sont terminées, l'application doit permettre de terminer le match et de préparer un nouveau match avec les mêmes joueurs. Présentement, l'entraîneur peut se retrouver bloqué dans un état de match terminé.
- Après ajout ou retrait de joueurs, l'alignement peut rester dans un état mal ajusté tant que l'utilisateur ne clique pas manuellement sur `Optimiser`.
- Quand plus de 12 joueurs sont entrés, l'application semble rendre seulement 12 joueurs actifs. Les joueurs excédentaires devraient plutôt apparaître comme absents ou inactifs, sans être perdus ni invisibles.
- Il semble y avoir des bogues quand un joueur redevient présent après avoir été absent ou inactif. À valider avec les nouvelles règles d'ordre.
- Retirer ou désactiver un joueur pendant un match peut laisser des manches futures avec moins de 6 positions assignées et rendre l'alignement difficile à corriger.
  - Première correction livrée: générer une suggestion pour insérer un joueur du banc dans une position manquante et permettre de cliquer une cellule `BANC` pour remplir automatiquement une position manquante.
  - Livré: une alerte apparaît dans `Alignement` au-dessus du tableau quand des manches défensives futures sont incomplètes. Elle nomme les manches touchées et offre `Remplir les positions possibles` quand un joueur au banc peut être assigné.
  - À évaluer plus tard: ajouter une ligne ou zone `Positions non assignées` en bas du tableau.
- En match débuté, permettre de modifier manuellement les positions des manches futures sans toucher aux demi-manches déjà complétées.
  - Livré: le tableau d'`Alignement` reste interactif pour les demi-manches futures; les demi-manches complétées restent grisées et non modifiables.
- Remplacer un joueur pendant un match doit préserver l'historique du joueur remplacé dans les demi-manches jouées, ajouter une ligne pour le nouveau joueur, retirer l'ancien joueur de l'ordre futur et retirer l'ancien joueur des assignations défensives futures.
  - Première correction livrée: les joueurs inactifs qui ont de l'historique verrouillé restent visibles dans le tableau, les snapshots de frappe verrouillés peuvent afficher un ancien joueur, et le nouveau joueur apparaît sous le joueur remplacé pour les manches futures.
- Exposer les changements de joueurs directement dans `Alignement`, sans retourner dans `Joueurs`.
  - Livré: un bouton unique dans `Alignement` ouvre `Retirer`, `Remplacer` ou `Ajouter`, puis demande la demi-manche d'effet.
- Retirer l'action `Remplacer` de l'étape `Joueurs` avant match.
  - Livré: l'étape `Joueurs` n'affiche plus d'action directe `Remplacer`; le remplacement reste disponible dans les changements de joueurs en cours de match.
- Vérifier que le moteur respecte les règles obligatoires avant les objectifs d'équité.
  - Livré: `tests/rules.html` couvre les règles obligatoires, les positions défensives dupliquées ou inconnues, le blocage du démarrage sans manche préparée et le blocage du démarrage avec une manche incomplète.

Irritants UX à corriger:

- Le texte d'introduction devrait mieux nommer la promesse produit: un alignement clair et équitable pour le banc, facile pour les entraîneurs et beau pour les parents.
- Rendre la demi-manche courante plus évidente dans `Alignement`.
- Dans `Spectateur`, afficher les deux lanceurs sur deux lignes séparées pour obtenir 6 éléments visuels comme l'ordre de frappe.
  - Livré: `L1` et `L2` sont affichés sur deux lignes distinctes dans `Spectateur`.
- Livré: le bouton d'échange `Local` / `Visiteur` reste stable quand on inverse les côtés.
- Livré: les actions des cartes joueurs restent sur une seule ligne.
- Livré: le curseur de glisser-déposer des joueurs utilise une main.
- Livré: les icônes de demi-manche sont centrées dans les entêtes du tableau principal.
- Livré: cliquer sur l'en-tête `Ordre` désélectionne le tableau principal.

Évolutions de règles / validations:

- Au démarrage du match, bloquer si le nombre de joueurs actifs n'est pas entre 6 et 12. Pour les autres règles ou problèmes d'alignement, afficher un avertissement et permettre à l'entraîneur de continuer après confirmation.

Bugs de sélection du tableau:

- Livré: sélectionner un joueur surligne toute sa ligne dans `Alignement`.
- Livré: sélectionner une cellule surligne la ligne du joueur et seulement la colonne de la demi-manche concernée.
- Livré: les entêtes de demi-manche sélectionnent seulement leur demi-manche; l'entête de manche complète ne sélectionne plus les deux colonnes.
- Livré: cliquer sur `Ordre` désélectionne toute sélection active.

Questions fermées:

- Correction manuelle rapide des positions manquantes: le chemin existant par suggestion et clic sur une cellule `BANC` est considéré suffisant pour l'instant. Une zone `Positions non assignées` reste une amélioration possible si ce flux devient trop lent sur téléphone.

## Bugs et dettes connues

- Pas encore de suite automatisée CLI. La couverture actuelle est une page de tests navigateur dans `tests/rules.html`.
- Les exports peuvent diverger de l'affichage principal parce qu'ils reconstruisent leur propre HTML.
- Livré: l'image parents s'adapte mieux aux longues listes et aux noms longs avec ordre sur deux colonnes, sections aérées et retours de ligne contrôlés.
- Livré: les partages sont simplifiés en `Banc`, `Programme` et `Texte`; le partage courriel est retiré.
- Livré: l'export `Banc` imprime un tableau simple avec une ligne par joueur et deux sous-colonnes par manche, `🏏` et `🧤`; la colonne frappe reste vide quand la frappe fixe est désactivée.
- Livré: l'image parents est réorganisée chronologiquement par manche avec une colonne d'icône compacte, frappeurs `1` à `6` en frappe fixe et positions défensives harmonisées dans l'ordre `L1`, `L2`, `AC`, `1B`, `2B`, `3B`.
- Livré: les fichiers d'export parents utilisent un nom simple avec date et équipes, par exemple `2026-06-15_expos_padres.png`.
- Les comportements de presse-papiers et de fenêtres surgissantes varient selon le navigateur.
- `app.js` contient encore trop de responsabilités: état, moteur d'alignement, rendu, exports et interactions.

## Décisions à prendre

- Rester en app statique pure ou introduire un petit outil de build.
- Garder les caractères typographiques (`’`, `—`, `✔`) ou préférer une ponctuation plus simple en UTF-8.
- Définir le comportement exact quand un joueur est retiré après des ajustements manuels.
- Choisir une stratégie de tests navigateur.

## Décisions prises

- Les archives de matchs passés seront verrouillées en lecture seule. Elles servent à consulter l'historique, pas à modifier rétroactivement un alignement.
- L'archivage des matchs sera déclenché par une action manuelle, pas automatiquement.
- Les exports ne sont pas stockés dans les archives; ils sont régénérés à partir du snapshot figé.
- La publication en ligne doit au minimum supporter un mode spectateur en lecture seule avec informations limitées.
- Les exports et publications sont regroupés dans une section `Partager`.
- La vue terrain est retirée de l'expérience principale.

## Livré

- Documentation produit, technique, roadmap et notes pour agents.
- Documentation de la structure du site et des pistes d'optimisation UX.
- Découpage statique: `index.html`, `styles.css`, `app.js`.
- Section `Partager` séparée pour les exports.
- Retrait de la vue terrain de l'expérience principale.
- Contrôles visibles pour ajouter ou retirer une manche dans l'écran d'alignement.
- Module `rules.js` pour valider les règles obligatoires.
- Base de tests navigateur dans `tests/rules.html`.
- Encodage UTF-8 documenté; les faux diagnostics causés par l'affichage PowerShell sont identifiés.
- Actions rapides `Charger l'exemple` et `Voir l'alignement` retirées de l'en-tête principal.
- Changements de vue qui ramènent l'utilisateur en haut de la page.
- Action `Optimiser` placée près du tableau principal.
- Boutons de navigation doublés retirés des sections `Alignement`, `Partager` et `Spectateur`.
- Boutons `Continuer` ajoutés en bas des étapes du flux principal.
- Affichage `Visiteur` / `Locale` intégré près des noms d'équipes, avec inversion automatique entre l'équipe et l'adversaire.
- Gestion séparée de l'ordre retirée; l'ordre se modifie dans le tableau principal de l'alignement.
- Option `Frappe fixe` déplacée dans l'écran `Joueurs`, avec l'indication que le mode est normalement activé en Rallye-Cap. Cible suivante: la déplacer dans `Match`.
- `Alignement` consolidé: les actions principales sont au-dessus du tableau, sans pill de statut ni sous-titre `Tableau principal`.
- `Optimiser` conserve maintenant l'ordre de frappe courant au lieu de revenir à l'ordre initial des joueurs enregistrés.
- Bouton shuffle ajouté près de `Optimiser` pour mélanger l'ordre de frappe avant match et optimiser les positions automatiquement.
- Validations et équité déplacées après le tableau principal.
- Ajout/retrait de manches intégré à la dernière manche du tableau principal avec des icônes `-` et `+`.
- Action `Régénérer` renommée `Optimiser`; le bouton devient grisé après optimisation et se réactive lors d'une modification manuelle.
- Export texte brut compact ajouté pour Funny Print ou une petite imprimante.
- Le partage `Texte` suit maintenant l'ordre visiteur/local des demi-manches comme la vue spectateur.
- Le spectateur autonome a été retiré de `Partager`; la future option de partage sera un lien en ligne en lecture seule.
- En mode frappe variable, les rangs de frappe par manche et les listes de frappeurs par manche sont retirés du tableau, des exports et du spectateur.
- Les cartes d'équité sont harmonisées entre les modes avec `Temps de jeu`, `Variété des positions` et `Indice global`; `Présences au bâton` apparaît seulement en frappe fixe.
- `Temps de jeu` inclut les présences au bâton en frappe fixe, mais seulement la défensive en frappe variable.
- En mode frappe variable, les présences au bâton sont retirées des scores d'équité et les colonnes `AB` / `Total` sont retirées des statistiques.
- Workflow simplifié livré: `Match`, `Joueurs`, `Alignement`; `Partage` et `Spectateur` restent hors étapes numérotées.
- `Accueil` contextuel livré pour créer l'équipe initiale, reprendre un match ou créer un nouveau match.
- `Équipe` hors workflow livré pour gérer le nom de notre équipe et le bassin de joueurs.
- Le hero de présentation apparaît seulement dans `Accueil`.
- Les cartes de contexte de l'accueil affichent le nom de l'équipe, le statut du match, les joueurs enregistrés et les matchs archivés; les cartes liées à l'équipe mènent à `Équipe`, la carte de statut mène à `Match`, et la carte archives mène à `Archives`.
- L'accueil garde un seul bouton d'action principal selon l'état courant.
- `Partager` et `Spectateur` sont sortis des étapes numérotées.
- `Spectateur` masque maintenant l'en-tête global et le workflow numéroté, et utilise la palette visuelle du site.
- L'exemple est retiré de l'accueil et du menu principal; il reste seulement dans `Équipe` comme création d'équipe exemple.
- L'ancienne route `#jouer` redirige vers `#alignement`.
- `Alignement` affiche la demi-manche courante et permet d'avancer seulement vers la prochaine demi-manche.
- Les informations de match, la liste des joueurs et l'alignement partant sont verrouillés après le début du match.
- L'étape `Joueurs` permet de basculer `Présent` / `Absent` en cliquant directement la carte du joueur; l'ajout, le renommage et la suppression de joueurs sont déplacés dans `Équipe`.
- L'action `Remplacer` est retirée de l'étape `Joueurs` avant match; elle reste disponible dans le flux de changement de joueurs en cours de match.
- Le menu du haut est maintenant un menu global unique avec `Accueil`, `Équipe`, `Archives`, `Partage`, `Spectateur` et `Réinitialiser`.
- Les entêtes de demi-manche du tableau principal gardent seulement les icônes bâton et gant.
- Le bloc `Ajouter des joueurs` est déplacé dans `Équipe`, hors workflow.
- La création d'équipe exemple est bloquée pendant un match débuté.
- Le démarrage de la progression du match bloque si le nombre de joueurs actifs n'est pas entre 6 et 12. Les autres problèmes d'alignement ou de règles affichent un avertissement avec confirmation.
- Le refactor du workflow a retiré l'onglet `Jouer`; `Alignement` porte maintenant la progression du match, les validations, les suggestions et les changements de joueurs.
