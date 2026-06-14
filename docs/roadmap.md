# Roadmap

## Maintenant

- Stabiliser la première version expérimentale des changements de joueurs pendant un match: démarrage explicite, cadenas de manches, demi-manches barrées, ajout/remplacement/retrait de joueurs sur téléphone.
- Vérifier que le moteur respecte les règles obligatoires avant les objectifs d'équité.
- Extraire la logique métier de `app.js` dans des modules testables.

## Prochaines fonctionnalités candidates

- Explorer Firebase/Firestore pour publier optionnellement un match avec un lien ou un QR code toujours à jour.
- Gérer les changements de dernière minute: absence, retrait en cours de match, ajout imprévu.
- Sauvegarder plusieurs matchs.
- Ajouter une archive des matchs passés.
- Importer et exporter une liste de joueurs.
- Dupliquer un match existant.
- Ajouter un écran de résumé avant impression.
- En mode attaque, afficher les lanceurs de la prochaine manche défensive si applicable.
- En mode défense, afficher les deux premiers frappeurs de la prochaine manche offensive si applicable.
- Harmoniser le look du mode match avec le reste de l'application.

## Préparation

La vue `Préparation` regroupe maintenant l'ancienne vue `Équipe` et l'ancienne vue `Ordre`.

À conserver:

- activation / désactivation temporaire d'un joueur sans suppression;
- suppression explicite d'un joueur;
- action `Charger un exemple` placée dans l'en-tête de préparation.

## Alignement

- L'ordre des frappeurs se modifie directement dans le tableau principal en glissant les joueurs.
- L'option `Frappe fixe` est un réglage de l'écran `Alignement`.
- Les validations et l'équité suivent le tableau principal pour servir de rétroaction après l'ajustement.
- Simplifier la densité de l'écran `Alignement`:
  - garder une section `Validation` visible comme verdict rapide;
  - afficher les règles obligatoires avec `check` ou `x`;
  - afficher l'équité avec `check`, `warning` ou `x`;
  - renommer `Problèmes et suggestions` en `Suggestions`;
  - afficher `Suggestions` seulement quand il y a des actions concrètes à proposer;
  - regrouper les cartes d'équité et le tableau détaillé dans une section `Statistiques et équité`;
  - garder les cartes d'équité dans cette section, idéalement repliée par défaut.

## Publication optionnelle en ligne

Firebase/Firestore est une avenue prometteuse pour publier un match spécifique tout en gardant l'application locale par défaut.

Modèle souhaité:

- local-first: rien n'est envoyé en ligne tant que l'entraîneur ne publie pas le match;
- publication explicite d'un seul match;
- lien ou QR code vers une version consultable;
- mise à jour du match publié quand l'entraîneur modifie l'alignement;
- données minimales: prénoms, numéros si disponibles, ordre, positions, infos de match;
- accès public seulement aux personnes qui ont le lien;
- vue parents en lecture seule avec informations limitées comme minimum;
- mode assistant modifiable à évaluer plus tard;
- possibilité de dépublier ou remplacer le lien plus tard.

Notes de coût:

- Firebase/Firestore offre un palier sans frais qui semble suffisant pour un prototype et une petite utilisation d'équipe.
- Les quotas et prix peuvent changer; vérifier la page officielle Firebase avant de dépendre du service.

Points à définir avant implémentation:

- format exact du document Firestore;
- règles de sécurité pour empêcher la modification non autorisée;
- stratégie `publicId` non devinable et `editToken` local;
- durée de conservation ou suppression manuelle;
- comportement hors ligne quand un match publié ne peut pas être synchronisé.

## Sortie texte pour mini imprimante

Un export texte minimal est disponible dans `Partager` pour imprimer rapidement un alignement de dernière minute avec une petite imprimante et l'application Funny Print.

Objectifs livrés:

- format texte brut, sans HTML;
- lisible sur papier étroit;
- priorité aux informations utiles en match;
- facile à copier dans une autre application.

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

Première tranche expérimentale:

- bouton explicite `Débuter le match`;
- bouton `Recommencer le match` après le début, avec confirmation, pour débarrer toutes les demi-manches et réactiver `Optimiser`;
- tableau principal séparé en demies-manches `Début` / `Fin` avec icônes `🏏` attaque et `🧤` défensive selon visiteur/local;
- glisser-déposer de l'ordre qui déplace les lignes complètes avant le début du match;
- lignes du tableau principal stables par joueur après le début du match, avec rang courant dans la première colonne;
- snapshots d'ordre au bâton pour les demies-manches offensives barrées afin de préserver l'historique;
- cadenas ouvert ou fermé dans les sous-en-têtes `Début` et `Fin` pour barrer les demi-manches;
- verrouillage continu: barrer une manche future propose de barrer les manches précédentes, et débarrer une manche propose de débarrer les suivantes;
- bouton pour barrer ou débarrer la demi-manche courante dans le mode match;
- `Optimiser` désactivé quand le match est débuté;
- ajout d'un joueur en match débuté avec choix `Ajouter`, `Remplacer` ou `Inactif`;
- remplacement qui substitue les joueurs dans l'ordre et les assignations non barrées;
- retrait d'un joueur actif avec avertissement, sans toucher aux manches barrées;
- obligation de remplacer un joueur si seulement 6 joueurs sont actifs.

## Stabilisation changements en cours de match

Bogues majeurs à prioriser:

- Retirer ou désactiver un joueur pendant un match peut laisser des manches futures avec moins de 6 positions assignées et rendre l'alignement difficile à corriger.
  - Première correction livrée: générer une suggestion pour insérer un joueur du banc dans une position manquante et permettre de cliquer une cellule `BANC` pour remplir automatiquement une position manquante.
  - À évaluer plus tard: ajouter une ligne ou zone `Positions non assignées` en bas du tableau.
- Remplacer un joueur pendant un match doit préserver l'historique du joueur remplacé dans les demi-manches barrées, ajouter une ligne pour le nouveau joueur, retirer l'ancien joueur de l'ordre futur et retirer l'ancien joueur des assignations défensives futures non barrées.
  - Première correction livrée: les joueurs inactifs qui ont de l'historique verrouillé restent visibles dans le tableau, et les snapshots de frappe verrouillés peuvent afficher un ancien joueur.
- Remplacer un joueur avant le début du match doit mettre le nouveau joueur exactement à la place de l'ancien dans l'ordre et dans le tableau.

Irritants UX à corriger:

- Le bouton d'échange `Local` / `Visiteur` ne devrait pas bouger quand on inverse les côtés.
- L'en-tête de manche devrait rester sur une ligne. À évaluer: retirer les textes `Début` et `Fin` si la colonne gauche est toujours le début et la colonne droite est toujours la fin.
- Il devrait être possible de désélectionner la sélection du tableau principal, par exemple en cliquant sur l'en-tête `Ordre`.
- `Charger un exemple` ne devrait pas être disponible pendant un match débuté, ou devrait demander une confirmation claire que le match courant sera remplacé.
- `Débuter le match` devrait être bloqué tant que l'alignement n'est pas minimalement prêt: joueurs actifs valides, positions assignées et aucune erreur majeure.

Questions à trancher avant implémentation:

- Quelle correction manuelle est la plus rapide sur téléphone pour une position manquante: clic sur `BANC`, ligne `Positions non assignées`, ou menu d'action sur la manche?
- Est-ce que les joueurs remplacés pendant un match doivent rester visibles jusqu'à la fin du match même s'ils ne sont plus actifs pour les manches futures?
- Est-ce que `Charger un exemple` doit être simplement désactivé pendant un match débuté ou disponible avec confirmation destructive?

## Bugs et dettes connues

- Aucun test automatisé.
- Les exports peuvent diverger de l'affichage principal parce qu'ils reconstruisent leur propre HTML.
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
- La publication en ligne doit au minimum supporter un mode parents en lecture seule avec informations limitées.
- Les exports et publications sont regroupés dans une section `Partager`.
- La vue terrain est retirée de l'expérience principale.

## Livré

- Documentation produit, technique, roadmap et notes pour agents.
- Documentation de la structure du site et des pistes d'optimisation UX.
- Découpage statique: `index.html`, `styles.css`, `app.js`.
- Section `Partager` séparée pour les exports.
- Retrait de la vue terrain de l'expérience principale.
- Fusion des vues `Équipe` et `Ordre` en une seule vue `Préparation`.
- Contrôles visibles pour ajouter ou retirer une manche dans l'écran d'alignement.
- Module `rules.js` pour valider les règles obligatoires.
- Base de tests navigateur dans `tests/rules.html`.
- Encodage UTF-8 documenté; les faux diagnostics causés par l'affichage PowerShell sont identifiés.
- Actions rapides `Charger l'exemple` et `Voir l'alignement` retirées de l'en-tête principal.
- Changements de vue qui ramènent l'utilisateur en haut de la page.
- Action `Optimiser` placée près du tableau principal.
- Boutons de navigation doublés retirés des sections `Alignement`, `Partager` et `Mode match`.
- Boutons `Continuer` ajoutés en bas des étapes avant le mode match.
- Bouton `Charger un exemple` déplacé dans la vue `Préparation`, avec un exemple basé sur des joueurs connus des Expos de 1994.
- `Charger un exemple` ne change plus de vue.
- Affichage `Visiteur` / `Locale` intégré près des noms d'équipes, avec inversion automatique entre l'équipe et l'adversaire.
- Gestion séparée de l'ordre retirée de `Préparation`; l'ordre se modifie dans le tableau principal de l'alignement.
- Option `Frappe fixe` déplacée au début de l'écran `Alignement`.
- Validations et équité déplacées après le tableau principal.
- Ajout/retrait de manches intégré à la dernière manche du tableau principal avec des icônes `-` et `+`.
- Action `Régénérer` renommée `Optimiser`; le bouton devient grisé après optimisation et se réactive lors d'une modification manuelle.
- Export texte brut compact ajouté pour mini imprimante / Funny Print.
- Le texte mini imprimante suit maintenant l'ordre visiteur/local des demi-manches comme le mode match.
- Le mode match autonome est intégré comme une carte normale dans `Partager`, avec un bouton secondaire.
- En mode frappe variable, les rangs de frappe par manche et les listes de frappeurs par manche sont retirés du tableau, des exports et du mode match.
- Les cartes d'équité sont harmonisées entre les modes avec `Temps de jeu`, `Variété des positions` et `Indice global`; `Présences au bâton` apparaît seulement en frappe fixe.
- `Temps de jeu` inclut les présences au bâton en frappe fixe, mais seulement la défensive en frappe variable.
- En mode frappe variable, les présences au bâton sont retirées des scores d'équité et les colonnes `AB` / `Total` sont retirées des statistiques.
