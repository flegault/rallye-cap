# Structure du site

Ce document décrit la structure actuelle de l'application et sert de base pour simplifier l'expérience utilisateur.

## Navigation actuelle

L'application est une SPA avec huit vues accessibles par hash URL:

- `#accueil`
- `#equipe`
- `#mesmatchs`
- `#archives`
- `#match`
- `#joueurs`
- `#alignement`
- `#partager`
- `#spectateur`
- `#public/{publicId}` pour le spectateur live public en lecture seule

La navigation est disponible dans:

- un menu global unique dans la barre du haut;
- les étapes numérotées du workflow, affichées dans le contenu;
- certains boutons de continuité entre les vues.

Le menu global regroupe `Accueil`, `Équipe`, `Archives`, `Partage`, `Spectateur` et l'action destructive `Réinitialiser`. `Réinitialiser` conserve ce libellé parce que l'action efface vraiment toutes les données locales. Le lien `Partage` devrait rester textuel et ne pas dépendre d'une icône décorative dans le menu.

## Sitemap actuel

```text
Alignement Rallye-Cap
+-- Accueil (#accueil)
|   +-- Si aucune équipe: appel à créer l'équipe
|   +-- Si équipe créée: créer un nouveau match ou reprendre la préparation
|   +-- Si match commencé: continuer le match
|   +-- Hero de présentation
|   +-- Cartes cliquables: nom de l'équipe, statut du match, joueurs enregistrés, matchs archivés
|   +-- Statuts: Aucun match prévu, En préparation, En cours avec demi-manche
|   +-- Un seul bouton d'action principal selon l'état
+-- Équipe (#equipe), hors workflow
|   +-- Nom de notre équipe
|   +-- Joueurs du bassin permanent
|   |   +-- Ajouter un joueur
|   |   +-- Renommer un joueur
|   |   +-- Supprimer un joueur
|   +-- Créer une équipe exemple
+-- Mes matchs (#mesmatchs)
|   +-- Sauvegarder le match courant en ligne
|   +-- Mes matchs en ligne
|   |   +-- Ouvrir
|   |   +-- Supprimer
+-- Match (#match)
|   +-- Local / visiteur
|   +-- Adversaire
|   +-- Date
|   +-- Heure 24h
|   +-- Endroit
|   +-- Nombre de manches initial
|   +-- Frappe fixe
|   +-- Indication que l'exemple se charge depuis le menu
+-- Joueurs (#joueurs)
|   +-- Joueurs enregistrés
|   |   +-- Activer / désactiver un joueur
|   +-- Continuer vers Alignement
+-- Alignement (#alignement)
|   +-- Alignement
|   |   +-- Modes locaux Préparer / Jouer
|   |   +-- Préparer: mélanger l'ordre au bâton, optimiser
|   |   +-- Jouer: commencer le match / terminer la demi-manche courante
|   |   +-- Jouer: changement de joueurs quand le match est commencé
|   |   +-- Réordonner les joueurs par glisser-déposer
|   |   +-- Positions par joueur et par manche
|   |   +-- Sélection de joueur ou de manche
|   |   +-- Échange manuel de positions par glisser-déposer
|   +-- Légende des positions
|   +-- Validation
|   +-- Suggestions, seulement quand une action est proposée
|   +-- Statistiques et équité
|   +-- Continuer vers Partager
+-- Archives (#archives)
|   +-- Liste des matchs archivés
|   +-- Consultation en lecture seule, fermée par défaut
|   +-- Exports régénérés depuis le snapshot
|   +-- Suppression manuelle avec confirmation
+-- Partager (#partager)
|   +-- Exports
|   |   +-- Programme
|   |   +-- Banc
|   |   +-- Texte
|   +-- En ligne
|   +-- Spectateur live
|   |   +-- Publier un lien public
|   |   +-- Mot de passe optionnel chiffré côté client
|   |   +-- Retirer le partage
|   +-- Édition
|   |   +-- Sauvegarder le match courant en ligne
|   |   +-- Mes matchs en ligne: ouvrir ou supprimer
+-- Spectateur (#spectateur)
    +-- Programme ou alignement à venir
    +-- Carte de manche courante
    |   +-- Attaque: frappeurs de la manche si la frappe fixe est activée
    |   +-- Attaque: rappel de suivre l'ordre au banc si la frappe fixe est désactivée
    |   +-- Défense: positions défensives
    +-- État final de remerciement quand le match est terminé
    +-- Navigation précédent / suivant
    +-- Points de progression
```

## Flux principal actuel

```text
Match -> Joueurs -> Alignement
```

Ce flux prépare le match et garde la gestion active dans `Alignement` après le début. `Accueil` et `Équipe` sont hors workflow.

Décision:

- conserver `Match` avant `Joueurs`, parce que la date, le terrain et les équipes donnent le contexte naturel des présences et absences du match courant.

## Workflow de référence

Le workflow cible suit la réalité d'un match et évite de devoir revenir dans les étapes de préparation après le début.

```text
📅 Match -> 👨‍👩‍👦‍👦 Joueurs -> 📋 Alignement
```

`Archives`, `Mes matchs` et `Spectateur` sont des pages non numérotées accessibles dans le menu. `Partager` reste une route non numérotée, mais elle est ouverte depuis le match courant plutôt que depuis le menu global. `Spectateur` est une vue simplifiée en lecture seule.

La gestion durable de notre équipe et de son bassin de joueurs est séparée du workflow de match sans devenir une étape numérotée. Elle vit dans `Équipe` et sert à définir le nom de notre équipe ainsi que les joueurs disponibles pour les matchs futurs. Le workflow `Joueurs` sert seulement à indiquer qui est présent ou absent pour le match courant.

Sitemap cible:

```text
Alignement Rallye-Cap
+-- Accueil
|   +-- Équipe à créer si aucune équipe n'est définie
|   +-- Reprendre le match en cours ou créer un nouveau match
|   +-- Archives à ajouter plus tard
+-- Équipe, hors workflow
|   +-- Nom de notre équipe
|   +-- Joueurs du bassin permanent
|   +-- Ajouter / renommer / supprimer un joueur pour les matchs futurs
|   +-- Champ de numéro de joueur à prévoir pour certains exports
+-- Match
|   +-- Local / visiteur
|   +-- Adversaire
|   +-- Date
|   +-- Heure
|   +-- Endroit
|   +-- Indication que l'exemple se charge depuis le menu
+-- Joueurs
|   +-- Joueurs du bassin permanent
|   +-- Indiquer présent / absent pour le match courant
|   +-- Option `Frappe fixe`
|   +-- Sans suppression de joueur dans cette étape
+-- Alignement
|   +-- Mélanger l'ordre au bâton
|   +-- Optimiser
|   +-- Bouton unique pour commencer le match ou avancer à la prochaine demi-manche
|   +-- Bouton unique `Changement de joueurs`
|   |   +-- Enlever / remplacer / ajouter un joueur
|   |   +-- Choix obligatoire de la demi-manche d'effet
|   +-- Tableau principal modifiable selon la progression
|   +-- Validation
|   +-- Suggestions, seulement quand une action est proposée
|   +-- Statistiques et équité
|   +-- Alerte de positions défensives futures incomplètes
|   |   +-- Clic sur cellule `BANC` en surbrillance
|   |   +-- Action `Remplir les positions possibles`
+-- Partage
|   +-- Exports disponibles seulement si le match respecte les règles de base
|   +-- Accès au Spectateur local toujours disponible
+-- Spectateur
    +-- Vue simplifiée en lecture seule
    +-- Suivi en direct du déroulement à explorer plus tard
```

## Flux secondaires actuels

- Modifier la préparation après génération.
- Optimiser l'alignement.
- Ajouter ou retirer une manche si le contexte réel change.
- Corriger des problèmes à partir des suggestions.
- Exporter depuis la section `Partager`.
- Utiliser la vue spectateur comme écran de consultation pendant la partie.

## Frictions connues

- L'écran `Alignement` contient beaucoup de sections et peut paraître dense.
- La fin de match offre une sortie de base avec archive complète en lecture seule, mais les actions avancées de reprise/recommencement restent à simplifier.
- La vue spectateur pourrait mieux anticiper la prochaine action utile:
  - en attaque: prochains lanceurs à préparer si applicable;
  - en défense: deux premiers frappeurs de la prochaine présence offensive si applicable.
- La vue spectateur affiche les deux lanceurs sur deux lignes séparées pour présenter 6 éléments défensifs, comme les 6 frappeurs en attaque.
- La route `#spectateur` masque l'en-tête global et le workflow numéroté pour donner une vue plein écran simplifiée.
- La vue spectateur locale indique `En cours`, `Terminée` et `À venir`, et offre un bouton `Manche en cours`.
- La vue spectateur pourrait informer qu'une nouvelle demi-manche est disponible sans déplacer automatiquement l'utilisateur qui consulte une autre étape.
  - Livré pour le spectateur public.
- La vue spectateur ne devrait pas répéter `Lecture seule` ni afficher `À venir` si ces libellés nuisent à la simplicité.
  - Livré partiellement pour le spectateur public.
- La vue spectateur devrait éventuellement inclure une première étape `Programme`, puis un état final `Merci, à la prochaine`.
  - Livré pour le spectateur public.
- `Mes matchs` gère la sauvegarde, l'ouverture et la suppression des matchs cloud. La section `Partager` agit seulement sur le match courant et regroupe les exports (`Programme`, `Banc`, `Texte`) ainsi que `Spectateur live`.
- Les suggestions et validations pourraient être rapprochées du tableau quand l'utilisateur corrige manuellement.
- Le flux ne distingue pas encore clairement préparation avant-match, ajustement, et consultation pendant le match.

## Direction d'optimisation UX

Objectif: rendre l'application plus simple et plus fluide sans enlever les contrôles utiles aux entraîneurs.

Principes:

- Garder le chemin principal très clair.
- Séparer les actions fréquentes des actions avancées.
- Éviter les boutons doublés quand la navigation principale donne déjà accès à la même destination.
- Placer les actions près de l'objet qu'elles modifient.
- Garder la vue spectateur très lisible et utilisable rapidement sur téléphone.
- Réduire les décisions visibles quand elles ne sont pas nécessaires.
- Ne pas cacher les alertes qui bloquent une règle obligatoire.

Découpage potentiel:

- Préparation
  - équipe;
  - joueurs et ordre des frappeurs dans une même zone;
  - exemple de départ.
- Génération
  - réglages essentiels;
  - bouton générer;
  - validations obligatoires.
- Ajustement
  - tableau principal;
  - suggestions;
  - statistiques avancées optionnelles.
- Partage
  - Banc;
  - Programme;
  - Texte;
  - publication en ligne future.
- Match
  - vue simplifiée;
  - navigation rapide;
  - infos de préparation de la prochaine demi-manche.

## Questions UX à explorer

- Est-ce que les statistiques avancées devraient être repliées par défaut?
- Comment proposer le mélange aléatoire au premier affichage de `Alignement` sans alourdir le flux?
- Est-ce que le réglage des manches devrait aussi être disponible dans la vue spectateur, en plus de l'écran d'alignement?
- Est-ce que les sous-en-têtes du tableau doivent garder les textes `Début` et `Fin`, ou seulement les icônes et cadenas puisque la colonne gauche est toujours le début et la colonne droite est toujours la fin?
- Quel patron d'interaction est le plus rapide sur téléphone pour corriger une position défensive manquante après un retrait de joueur: clic sur `BANC`, zone `Positions non assignées`, ou menu d'action par manche?
- Où placer un raccourci rapide vers le match en cours près du menu sans surcharger le header?
- Le bouton `Sauvegarder` de `Équipe` doit-il être retiré au profit d'une sauvegarde automatique, ou étendu comme action explicite cohérente ailleurs?
- Pour la frappe non fixe, quelle interaction minimale permettrait de saisir le dernier frappeur d'une manche sans transformer `Spectateur` en outil d'édition complet?

## Décisions UX prises

- Le workflow cible est `Match`, `Joueurs`, `Alignement`; `Partager` et `Spectateur` ne sont pas des étapes numérotées.
- `Match` reste avant `Joueurs`, parce que les présences et absences sont confirmées dans le contexte d'un match daté.
- `Accueil` est la porte d'entrée contextuelle: configuration de l'équipe si elle manque, reprise du match en cours ou création d'un nouveau match.
- Le hero de présentation apparaît seulement dans `Accueil`.
- Les cartes de contexte de l'accueil indiquent clairement le nom de l'équipe, le statut du match, le nombre de joueurs enregistrés et le nombre de matchs archivés localement. Les cartes `Équipe` et `Joueurs` mènent à `Équipe`; la carte de statut mène à `Match`; la carte archives mène à `Archives`.
- L'accueil affiche un seul bouton d'action principal selon l'état courant.
- `Équipe` est hors workflow et gère le nom de notre équipe ainsi que le bassin permanent de joueurs.
- Une fois le match commencé, les étapes `Match` et `Joueurs` ne sont plus modifiables.
- `Alignement` devient la vue de gestion active pendant la partie. L'onglet `Jouer` est retiré du workflow principal.
- Le concept de cadenas est retiré du modèle cible. La progression de match détermine les demi-manches passées, courantes et futures.
- La progression avance seulement vers l'avant, une demi-manche à la fois. Reculer n'est pas une action normale de l'interface principale.
- Les changements de joueurs pendant la partie sont accessibles dans `Alignement` par un bouton unique. L'entraîneur choisit la demi-manche précise à partir de laquelle appliquer l'action.
- Les suggestions d'action ne doivent viser que les demi-manches non jouées.
- Le mode match actuel devient `Spectateur`, une vue simplifiée en lecture seule accessible par le menu.
- `Spectateur` n'affiche pas l'en-tête global ni le workflow numéroté. Les contrôles visibles sont limités à la navigation précédente/suivante et au retour vers la manche en cours.
- L'exemple vit seulement dans `Équipe` sous forme de création d'équipe exemple. Il ne doit pas apparaître dans `Accueil` ni dans le menu principal.
- La gestion de notre équipe et du bassin permanent de joueurs doit être séparée du workflow de match, mais ne doit pas devenir une étape numérotée.
- La préparation du match se limite aux informations du match courant, aux présences et à l'alignement.
- L'ordre des frappeurs se modifie dans le tableau principal de l'alignement, en glissant les joueurs dans la première colonne.
- Garder la possibilité de désactiver temporairement un joueur sans le supprimer.
- Garder la possibilité d'ajuster l'ordre des frappeurs manuellement.
- Les changements de vue doivent ramener l'utilisateur en haut de la page.
- Le tableau de contexte de l'accueil affiche l'état de l'équipe, les joueurs enregistrés et les matchs archivés; il ne doit pas afficher les manches, le côté local/visiteur ou l'équité.
- La préparation du match est séparée en deux groupes avec entêtes: `Équipes` pour notre équipe/côtés/adversaire, puis `Détails` pour date/heure/endroit. `Notre équipe` ressemble à un champ de formulaire et reste cliquable vers `Équipe`.
- L'état du match dans l'accueil doit utiliser `Aucun match prévu`, `En préparation` et `En cours`, avec la demi-manche courante quand le match est commencé.
- Dans le détail de match de l'accueil, afficher date, heure et endroit.
- Le bouton principal de l'accueil devrait utiliser `Préparer un match`; l'état préparé devrait être libellé `Match en préparation`.
- L'heure du match devrait être saisie en format 24h avec intervalles de 5 minutes.
- Le nombre de manches initial et le réglage `Frappe fixe` appartiennent à l'écran `Match`.
- Le langage phrase `visitent les` / `reçoivent les` n'est pas retenu pour le moment; les libellés local/visiteur restent plus robustes.
- Le bouton d'échange `Local` / `Visiteur` doit rester stable visuellement quand les côtés changent.
- L'action `Optimiser` remplace `Régénérer` et doit être près du tableau principal.
- Le bouton `Optimiser` devient grisé après optimisation et se réactive dès qu'une modification manuelle est faite.
- Avant le début du match, l'arrivée sur `Alignement` optimise automatiquement après ajout, suppression ou changement de présence des joueurs.
- L'ajout et le retrait de manches sont des icônes `-` et `+` dans l'en-tête de la dernière manche.
- Les validations et l'équité doivent être affichées après le tableau principal.
- L'écran `Alignement` ne doit pas avoir de bouton `Partager` si la navigation principale donne déjà accès à `Partager`.
- L'écran `Partager` ne doit pas avoir de bouton `Ouvrir le spectateur` si la navigation principale donne déjà accès à `Spectateur`.
- L'écran `Spectateur` ne doit pas avoir de bouton `Partager` si la navigation principale donne déjà accès à `Partager`.
- Chaque étape du flux principal doit avoir un bouton `Continuer` en bas pour soutenir le flux guidé.
- Regrouper les exports et publications dans une section séparée `Partager`.
- La section `Partager` doit utiliser des conventions UI faciles à reconnaître: impression/PDF, copier, image, texte, lien, QR code.
- Les exports de la section `Partager` sont présentés comme des cartes de même niveau visuel. L'ancien export spectateur autonome est retiré; le partage spectateur externe cible un futur lien en ligne.
- Retirer la vue terrain de l'expérience principale.
- L'ajout et le retrait de manche doivent rester possibles en cours de match, parce qu'une 5e manche peut être ajoutée si le temps le permet.
- L'ajout/retrait de manche est accessible clairement dans l'écran d'alignement.
- Le match est démarré par un bouton explicite dans `Alignement`. Une fois commencé, ce bouton devient l'action pour terminer la demi-manche courante et passer à la suivante.
- Quand la dernière demi-manche est terminée, un modal propose `Archiver et retourner à l'accueil` ou `Ne pas archiver`. Les deux choix ferment le match courant, conservent l'équipe et les joueurs, puis retournent à `Accueil`.
- L'interface principale ne propose pas de retour à la demi-manche précédente. Une action de correction de progression pourra être évaluée plus tard comme outil avancé avec confirmation forte.
- Quand le match est débuté, `Optimiser` est désactivé.
- Dans `Alignement`, les modes locaux `Préparer` / `Jouer` réduisent la densité sans recréer une route `Jouer`. Quand le match est commencé, le mode `Jouer` est forcé.
- Le tableau principal affiche chaque manche en deux colonnes de demie-manche: `Début` et `Fin`.
- Les sous-en-têtes utilisent `🏏` pour l'attaque et `🧤` pour la défensive selon le statut visiteur/local.
- Avant le début du match, glisser un joueur dans la première colonne change l'ordre et déplace la ligne complète.
- Quand le match est débuté, les lignes du tableau principal restent stables par joueur. La première colonne affiche le rang courant dans l'ordre des frappeurs, tandis que les cellules d'attaque affichent les rangs prévus par demie-manche.
- Les demi-manches jouées doivent rester continues depuis le début du match.
- Une manche peut être ouverte, partiellement jouée ou complètement jouée.
- Les changements de joueurs pendant un match touchent seulement les demi-manches non jouées à partir de la demi-manche d'effet choisie et demandent confirmation quand ils ont un impact important.
- L'action `Remplacer` ne fait plus partie de l'étape `Joueurs` avant match. Le remplacement reste une action de changement en cours de match dans `Alignement`, où l'historique déjà joué doit être conservé.
- Dans l'étape `Joueurs`, cliquer une carte joueur bascule sa disponibilité `Présent` / `Absent` pour le match courant.
- L'ajout, le renommage et la suppression des joueurs se font dans `Équipe`, hors workflow.
- Dans `Équipe`, le numéro de chandail optionnel devrait être éditable seulement avant match, comme les autres informations du bassin permanent.
- Dans `Joueurs`, les cartes doivent garder une taille stable entre présents et absents. Les sections vides n'ont pas besoin d'une carte `Aucun`.
- Le menu du haut est un menu global unique. Les étapes principales restent dans le contenu, pas dans le header.
- Le libellé `Réinitialiser` est conservé pour l'action destructive globale, parce qu'elle efface toutes les données locales.
- Les textes d'accueil devraient être resserrés autour de: `Clair et équitable pour le banc, facile pour les entraîneurs et beau pour les parents.` et `Prépare un match et crée un alignement équitable qui respecte les règles Rallye-Cap.`
- Les entêtes de demi-manche du tableau principal affichent seulement les icônes bâton et gant; `Début` est toujours la colonne de gauche et `Fin` la colonne de droite.
- Au démarrage de la progression du match, l'application bloque si le nombre de joueurs actifs n'est pas entre 6 et 12. Si le nombre de joueurs est valide mais que des positions défensives manquent ou que des règles ne sont pas respectées, l'entraîneur reçoit un avertissement et peut continuer après confirmation.
- Cliquer sur l'en-tête `Ordre` devrait permettre de désélectionner la sélection courante du tableau principal.
- Quand `Frappe fixe` est désactivé, le tableau et les exports ne doivent pas afficher de rang de frappe `(#)` ni de frappeurs par manche.
- Les cartes d'équité utilisent les mêmes libellés dans les deux modes: `Temps de jeu`, `Variété des positions` et `Indice global`; `Présences au bâton` est ajouté seulement quand `Frappe fixe` est activé.
- `Temps de jeu` inclut les présences au bâton seulement quand `Frappe fixe` est activé; sinon il reflète la défensive seulement.
- Quand `Frappe fixe` est désactivé, les colonnes `AB` et `Total` ne sont pas affichées dans les statistiques.

## Comportement de préparation

- L'ordre manuel est la référence modifiable par l'entraîneur.
- Quand l'entraîneur mélange l'ordre, le nouvel ordre devient simplement l'ordre courant.
- Si l'entraîneur modifie manuellement l'ordre après un mélange, ce nouvel ordre devient l'ordre courant.
- Désactiver temporairement un joueur le retire du match courant, mais ne supprime pas le joueur de la liste.

## Section Partager

La section `Partager` regroupe:

- `Exports`: `Programme`, `Banc` et `Texte`;
- `En ligne`: `Spectateur live` pour publier le lien public du match courant aux fans.

La gestion des matchs cloud vit dans `Mes matchs`, pas dans `Partager`.

Les partages locaux doivent rester utilisables sans connexion. Les actions cloud doivent expliquer la connexion requise et proposer de se connecter quand l'utilisateur tente de les utiliser.

## Archives

La section `Archives` regroupe:

- liste locale des matchs archivés, du plus récent au plus ancien;
- consultation en lecture seule, non ouverte par défaut et refermable;
- suppression manuelle avec confirmation;
- régénération des exports `Programme`, `Banc` et `Texte` à partir du snapshot figé;
- affichage sommaire des anciennes archives `legacy` quand les données complètes ne sont pas disponibles.

Le partage `Texte` doit suivre l'ordre réel des demi-manches comme la vue spectateur: attaque en début de manche si notre équipe est visiteuse, défense en début de manche si notre équipe est locale.

Améliorations UX à prévoir:

- afficher le partage `Texte` dans une zone éditable avant de le copier;
- adapter l'image/PDF parents aux longues listes et aux noms longs;
- générer des noms de fichiers avec la date et les équipes.

À venir:

- publication en ligne;
- QR code.

Le mode publication en ligne devrait au minimum offrir une vue fans en lecture seule avec des informations limitées.
