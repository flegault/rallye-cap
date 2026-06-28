# Structure du site

Ce document décrit la structure actuelle de l'application et sert de base pour simplifier l'expérience utilisateur.

## Navigation actuelle

L'application est une SPA avec les vues applicatives principales suivantes accessibles par hash URL:

- `#accueil`
- `#matchs`
- `#match`
- `#joueurs`
- `#alignement`
- `#match-en-cours` pour la gestion simplifiée du match par le coach
- `#public/{publicId}` pour le spectateur live public en lecture seule
- `#banc/{publicId}` pour la tablette du banc en lecture seule et sans navigation
- `#fans/{teamPublicId}` pour la liste publique permanente des matchs publiés d'une équipe

La navigation est disponible dans:

- un menu global unique dans la barre du haut;
- les étapes numérotées du workflow, affichées dans le contenu;
- certains boutons de continuité entre les vues.

Le menu global regroupe `Accueil`, `Connexion` et l'action destructive `Réinitialiser`. L'icône et le titre du site ramènent à `Accueil`. Le changement d'équipe vit dans `Accueil`, via une modale ouverte depuis la carte d'équipe. `Matchs` n'est pas dans le menu global; la page reste accessible depuis l'accueil. La route interne `Spectateur` n'a plus d'accès visible en attendant sa refonte. `Réinitialiser` conserve ce libellé parce que l'action efface vraiment toutes les données locales et en ligne connues.

## Sitemap actuel

```text
Alignement Rallye-Cap
+-- Accueil (#accueil)
|   +-- Si aucune équipe: appel à créer l'équipe
|   +-- Créer une équipe exemple seulement si aucune équipe n'existe, dans la section de création
|   +-- Carte de contexte `Équipe active`, affichant `Aucune équipe` si aucune équipe n'existe
|   +-- Changer ou créer une équipe par modale depuis cette carte
|   +-- Nom de notre équipe éditable directement dans le titre de la boîte d'équipe
|   +-- Lien public d'équipe par modale ouverte depuis l'icône de lien
|   +-- Joueurs du bassin permanent
|   +-- Si équipe créée sans match actif: créer explicitement un nouveau match
|   +-- Si match courant non archivé: cartes workflow `Match`, `Joueurs`, `Alignement` ou `Jouer`
|   +-- Accès à `Matchs` par la carte de contexte
|   +-- Hero de présentation
|   +-- Cartes cliquables: adversaire/date/heure/endroit, présents/absents, tableau d'alignement ou jeu
|   +-- Statuts: Aucun match prévu, En préparation, En cours avec demi-manche, Match terminé
|   +-- Un seul bouton d'action principal selon l'état
+-- Matchs (#matchs), hors menu global
|   +-- Tableau Matchs
|   |   +-- Matchs locaux et matchs en ligne non archivés
|   |   +-- Tri par adversaire, date/heure, endroit, statut, modification
|   |   +-- Ligne cliquable pour ouvrir
|   |   +-- Actions: partager, archiver, supprimer
|   +-- Tableau Matchs archivés
|   |   +-- Archives locales en lecture seule
|   |   +-- Matchs archivés en ligne du compte connecté
|   |   +-- Ligne cliquable pour consulter, partager ou supprimer
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
+-- Modale Partager le match
|   +-- Exports: Programme, Banc, Texte
|   +-- Mettre le match en ligne
|   +-- Spectateurs en direct: créer, copier ou retirer le lien public du match
+-- Modale Lien d'équipe
|   +-- Créer, copier ou retirer le lien public permanent de l'équipe active
|   +-- Mot de passe optionnel chiffré côté client
|   +-- Liste des liens d'équipe du compte connecté
+-- Match en cours (#match-en-cours)
    +-- Accès par la pastille de l’en-tête ou depuis Alignement
    +-- Une demi-manche à la fois, navigable par glissement horizontal
    +-- Pastille ramenant à la demi-manche courante
    +-- Progression active seulement sur la demi-manche courante
    +-- Changement rapide de joueurs
    +-- Alerte d’équité future avec retour vers Alignement
    +-- Suggestions futures repliées, applicables après confirmation
    +-- Joueurs présents au banc dans une section repliée
+-- Fans publics (#fans/{teamPublicId})
    +-- Équipe publiée
    |   +-- Liste des joueurs
    |   +-- Choix de plusieurs favoris privés au navigateur
    +-- Liste des matchs publiés pour l'équipe
    +-- Indicateur de match protégé par mot de passe
    +-- Ouverture du match dans `#public/{publicId}`
+-- Banc des jeunes (#banc/{publicId})
    +-- Même publication et même mot de passe que le lien Match
    +-- `Maintenant`: liste des positions défensives ou ordre de frappe complet
    +-- `Ensuite`: prochaine demi-manche compacte
    +-- Missions d'encouragement pour les joueurs présents hors de l'action
    +-- Suivi automatique sans boutons, balayage ni navigation
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

`Matchs` et `Spectateur` sont des pages non numérotées hors menu global. `Matchs` s'ouvre depuis l'accueil. La route interne `Spectateur` n'a plus d'accès visible en attendant sa refonte. `Partager` est une action non numérotée liée au match courant, affichée avec l'icône de lien: elle ouvre une modale qui sépare `Lien Match`, `Gérer en ligne` et `Exports`. Créer l'équipe ou modifier le bassin permanent ne crée pas de match automatiquement; le match est créé par une action explicite depuis l'accueil.

La gestion durable de notre équipe et de son bassin de joueurs est séparée du workflow de match sans devenir une étape numérotée. Elle vit dans `Accueil` et sert à définir le nom de notre équipe ainsi que les joueurs disponibles pour les matchs futurs. Le workflow `Joueurs` sert seulement à indiquer qui est présent ou absent pour le match courant.

Sitemap cible:

```text
Alignement Rallye-Cap
+-- Accueil
|   +-- Équipe à créer si aucune équipe n'est définie
|   +-- Reprendre le match en cours ou créer un nouveau match
|   +-- Actions du match courant: lien de partage et suppression du match
|   +-- Archives à ajouter plus tard
+-- Accueil
|   +-- Équipe courante hors workflow
|   |   +-- Nom de notre équipe éditable dans le titre de la boîte d'équipe
|   |   +-- Joueurs du bassin permanent
|   |   +-- Ajouter / renommer / supprimer un joueur pour les matchs futurs
|   +-- Accès à Matchs
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
+-- Modale Partager le match
|   +-- Exports disponibles seulement si le match respecte les règles de base
|   +-- Publication du match et lien spectateur public
+-- Modale Lien d'équipe
|   +-- Lien public permanent de l'équipe active
+-- Spectateur
    +-- Vue simplifiée en lecture seule
    +-- Suivi en direct du déroulement à explorer plus tard
```

## Flux secondaires actuels

- Modifier la préparation après génération.
- Optimiser l'alignement.
- Ajouter ou retirer une manche si le contexte réel change.
- Corriger des problèmes à partir des suggestions.
- Exporter depuis la modale `Partager le match`.
- Utiliser `Match en cours` comme écran terrain simplifié du coach.

## Frictions connues

- L'écran `Alignement` contient beaucoup de sections et peut paraître dense.
- La fin de match offre une sortie de base avec archive complète en lecture seule, mais les actions avancées de reprise/recommencement restent à simplifier.
- La vue publique pourrait mieux anticiper la prochaine action utile:
  - en attaque: prochains lanceurs à préparer si applicable;
  - en défense: deux premiers frappeurs de la prochaine présence offensive si applicable.
- La vue publique affiche les deux lanceurs sur deux lignes séparées pour présenter 6 éléments défensifs, comme les 6 frappeurs en attaque.
- La route coach `#match-en-cours` conserve l’en-tête, masque le workflow numéroté et présente une demi-manche à la fois dans un carrousel tactile.
- La vue publique suit automatiquement la progression si le spectateur regarde le direct. S’il consulte une autre étape, chaque nouvelle demi-manche déclenche une seule fois un popup proposant de l’afficher ou de rester sur place.
- La vue spectateur ne devrait pas répéter `Lecture seule` ni afficher `À venir` si ces libellés nuisent à la simplicité.
  - Livré partiellement pour le spectateur public.
- La vue spectateur devrait éventuellement inclure une première étape `Programme`, puis un état final `Merci, à la prochaine`.
  - Livré pour le spectateur public.
- `Matchs` gère la sauvegarde, l'ouverture et la suppression des matchs cloud. La modale `Partager le match` agit sur le match sélectionné ou courant: exports (`Programme`, `Banc`, `Texte`), publication et lien spectateur. La modale `Lien d'équipe` agit sur l'équipe active.
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
- Comment faire évoluer le raccourci rapide près du menu sans surcharger le header si d'autres actions globales apparaissent?
- Le bouton `Sauvegarder` de `Équipe` doit-il être retiré au profit d'une sauvegarde automatique, ou étendu comme action explicite cohérente ailleurs?
- Si la frappe non fixe revient dans les besoins terrain, quel outil coach devrait porter le suivi du dernier frappeur sans transformer `Spectateur` en outil d'édition?

## Décisions UX prises

- Le workflow cible est `Match`, `Joueurs`, `Alignement`; `Partager` et `Spectateur` ne sont pas des étapes numérotées. `Partager` reste visible comme action de match non numérotée quand un match courant existe.
- `Match` reste avant `Joueurs`, parce que les présences et absences sont confirmées dans le contexte d'un match daté.
- `Accueil` est la porte d'entrée contextuelle: configuration de l'équipe si elle manque, création explicite d'un match si aucun match n'est actif, ou reprise du match en cours.
- Le hero de présentation apparaît seulement dans `Accueil`.
- Quand un match courant non archivé existe, les cartes de l'accueil suivent le workflow: `Match`, `Joueurs`, puis `Alignement` ou `Jouer`. Un match archivé ouvert ne doit pas alimenter ces raccourcis de préparation.
- L'accueil affiche un seul bouton d'action principal selon l'état courant.
- `Équipe` est hors workflow et gère le nom de notre équipe ainsi que le bassin permanent de joueurs.
- Une fois le match commencé, les étapes `Match` et `Joueurs` ne sont plus modifiables.
- `Alignement` devient la vue de gestion active pendant la partie. L'onglet `Jouer` est retiré du workflow principal.
- Le concept de cadenas est retiré du modèle cible. La progression de match détermine les demi-manches passées, courantes et futures.
- La progression avance seulement vers l'avant, une demi-manche à la fois. Reculer n'est pas une action normale de l'interface principale.
- Les changements de joueurs pendant la partie sont accessibles dans `Alignement` par un bouton unique. L'entraîneur choisit la demi-manche précise à partir de laquelle appliquer l'action.
- Les suggestions d'action ne doivent viser que les demi-manches non jouées.
- Le mode match actuel devient `Spectateur`, une vue simplifiée en lecture seule accessible par le menu.
- `Match en cours` masque le workflow numéroté et la pastille redondante de l’en-tête. La navigation entre les demi-manches se fait par glissement ou par les points de progression; sa propre pastille ramène à la demi-manche courante.
- L'exemple vit seulement dans `Accueil`, comme action secondaire de création d'équipe quand aucune équipe n'existe.
- La gestion de notre équipe et du bassin permanent de joueurs doit être séparée du workflow de match, mais ne doit pas devenir une étape numérotée.
- La préparation du match se limite aux informations du match courant, aux présences et à l'alignement.
- L'ordre des frappeurs se modifie dans le tableau principal de l'alignement, en glissant les joueurs dans la première colonne.
- Garder la possibilité de désactiver temporairement un joueur sans le supprimer.
- Garder la possibilité d'ajuster l'ordre des frappeurs manuellement.
- Les changements de vue doivent ramener l'utilisateur en haut de la page.
- Le tableau de contexte de l'accueil affiche l'équipe active, les joueurs, le total des matchs et l'accès au partage; il ne doit pas afficher les manches, le côté local/visiteur ou l'équité.
- La carte `Équipe active` affiche `Aucune équipe` quand aucune équipe n'existe et ouvre toujours la modale de sélection ou création.
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
- `Partager` ouvre une modale liée au match courant, accessible depuis le workflow et depuis une ligne de `Matchs`.
- La pastille `Match en cours` de l’en-tête et un bouton secondaire du même nom dans `Alignement` ouvrent `#match-en-cours`. Au démarrage depuis Alignement, `Commencer ici` est primaire et `Commencer dans Match en cours` est secondaire. La vue propose la progression, les changements rapides, les joueurs présents au banc pour la demi-manche consultée, les problèmes d’équité futurs et une section de suggestions applicables après confirmation. Les absents ne sont pas affichés comme joueurs au banc.
- Chaque étape du flux principal doit avoir un bouton `Continuer` en bas pour soutenir le flux guidé.
- Regrouper les exports et publications dans la modale `Partager le match`.
- Les actions de partage doivent utiliser des conventions UI faciles à reconnaître: impression/PDF, copier, image, texte, lien, QR code.
- Les exports de la modale `Partager le match` sont présentés comme des actions de même niveau visuel. L'ancien export spectateur autonome est retiré; le partage spectateur externe passe par le lien en ligne du match.
- Retirer la vue terrain de l'expérience principale.
- L'ajout et le retrait de manche doivent rester possibles en cours de match, parce qu'une 5e manche peut être ajoutée si le temps le permet.
- L'ajout/retrait de manche est accessible clairement dans l'écran d'alignement.
- Le match est démarré par un bouton explicite dans `Alignement`. Une fois commencé, ce bouton devient l'action pour terminer la demi-manche courante et passer à la suivante.
- Quand la dernière demi-manche est terminée, un modal propose `Archiver et retourner à l'accueil` ou `Ne pas archiver`. Les deux choix ferment le match courant, conservent l'équipe et les joueurs, puis retournent à `Accueil`.
- L'interface principale ne propose pas de retour à la demi-manche précédente. Une action de correction de progression pourra être évaluée plus tard comme outil avancé avec confirmation forte.
- Quand le match est débuté, `Optimiser` est désactivé.
- Dans `Alignement`, les modes locaux `Préparer` / `Jouer` réduisent la densité sans recréer une route `Jouer`. Quand le match est commencé, le mode `Jouer` est forcé.
- Dans `Joueurs`, l'action `Ajouter un joueur à l'équipe` est placée sous les listes `Présents` et `Absents`, avant `Continuer`.
- Le tableau principal affiche chaque manche en deux colonnes de demie-manche: `Début` et `Fin`.
- Les sous-en-têtes utilisent `🏏` pour l'attaque et `🧤` pour la défensive selon le statut visiteur/local.
- Avant le début du match, glisser un joueur dans la première colonne change l'ordre et déplace la ligne complète.
- Quand le match est débuté, les lignes du tableau principal restent stables par joueur. La première colonne affiche le rang courant dans l'ordre des frappeurs, tandis que les cellules d'attaque affichent les rangs prévus par demie-manche.
- Les demi-manches jouées doivent rester continues depuis le début du match.
- Une manche peut être ouverte, partiellement jouée ou complètement jouée.
- Les changements de joueurs pendant un match touchent seulement les demi-manches non jouées à partir de la demi-manche d'effet choisie et demandent confirmation quand ils ont un impact important.
- L'action `Remplacer` ne fait plus partie de l'étape `Joueurs` avant match. Le remplacement reste une action de changement en cours de match dans `Alignement`, où l'historique déjà joué doit être conservé.
- Dans l'étape `Joueurs`, cliquer une carte joueur bascule sa disponibilité `Présent` / `Absent` pour le match courant.
- L'ajout, le renommage et la suppression des joueurs se font dans `Accueil`, hors workflow.
- Dans `Accueil`, le numéro de chandail optionnel devrait être éditable seulement avant match, comme les autres informations du bassin permanent.
- Dans `Joueurs`, les cartes doivent garder une taille stable entre présents et absents. Les sections vides n'ont pas besoin d'une carte `Aucun`.
- Le menu du haut est un menu global unique. Les étapes principales restent dans le contenu, pas dans le header.
- Le libellé `Réinitialiser` est conservé pour l'action destructive globale. Sa confirmation utilise: `Toutes tes équipes, joueurs et matchs seront supprimés pour toujours. Continuer?`
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

## Modales de partage

La modale `Partager le match` regroupe:

- `Lien Match`: mot de passe optionnel, création, copie et retrait du lien public stable; le texte précise qu'il apparaîtra dans un lien d'équipe existant ou peut être partagé directement;
- `Gérer en ligne`: toggle `Oui` / `Non` pour la gestion de l'alignement et la synchronisation privée du match pour le coach;
- `Exports`: `Programme`, `Banc` et `Texte`, avec la description de chaque document sous son titre.

La modale `Lien d'équipe` vit dans la carte d'équipe de l'accueil. Elle a deux états sans boîte intermédiaire: si un lien public permanent confirmé existe, elle affiche seulement `#fans/{teamPublicId}` avec `Copier` et `Retirer`; sinon elle affiche directement les champs `Identifiant public`, `Mot de passe optionnel` et l'action `Créer le lien`. Elle passe à l'état actif seulement après le succès Firestore; en cas d'erreur, elle reste ouverte et affiche le message sous les champs sans enregistrer la saisie. L'identifiant public est obligatoire pour créer le lien. Elle n'affiche plus la liste des documents Firestore `publicTeams`. La reprise et la suppression complètes des matchs cloud vivent dans `Matchs`.

Les champs de lien et de mot de passe des modales `Partager le match` et `Lien d'équipe` sont disponibles seulement quand l'entraîneur est connecté. Sinon, la modale affiche une explication et un bouton primaire vert `Connexion`.

Les partages locaux doivent rester utilisables sans connexion. Les actions cloud doivent expliquer la connexion requise et proposer de se connecter quand l'utilisateur tente de les utiliser.

## Archives dans Matchs

Les archives ne sont plus une page séparée. Elles vivent dans `Matchs`, dans le tableau `Matchs archivés`.

La section `Matchs archivés` regroupe:

- liste locale des matchs archivés, du plus récent au plus ancien;
- consultation en lecture seule dans les vues existantes du match;
- suppression manuelle avec confirmation;
- état cloud visible et actions `Partager` / `Supprimer`; le retrait cloud passe par `Partager > Gérer en ligne`.

Le partage `Texte` doit suivre l'ordre réel des demi-manches comme la vue spectateur: attaque en début de manche si notre équipe est visiteuse, défense en début de manche si notre équipe est locale.

Améliorations UX à prévoir:

- afficher le partage `Texte` dans une zone éditable avant de le copier;
- adapter l'image/PDF parents aux longues listes et aux noms longs;
- générer des noms de fichiers avec la date et les équipes.

À venir:

- publication en ligne;
- QR code.

Le mode publication en ligne devrait au minimum offrir une vue fans en lecture seule avec des informations limitées.

## Mise à jour v5 multi-match

Le modèle v5 est local-first et multi-match. Pendant la phase de développement, l'application démarre vide si aucune donnée `rallye_cap_qc_v5` valide n'existe. Les anciens modèles de données ne sont pas supportés et ne doivent pas influencer le code applicatif.

`Matchs` devient la vue centrale de gestion:

- `Matchs`: matchs non archivés, locaux ou en ligne;
- `Matchs archivés`: matchs `archived`, ouverts en lecture seule.

Les deux tableaux combinent les matchs locaux et les matchs en ligne du compte connecté. Les doublons sont fusionnés par identifiant cloud. Un match en ligne seulement est importé localement quand l'utilisateur ouvre la ligne, puis l'app navigue vers `Match`.

Le tableau est triable par adversaire, date/heure du match, endroit, statut et dernière modification. Le tri par défaut place les matchs les plus récents en premier selon la date et l'heure du match. Les actions sont `Partager`, le dossier d'archivage quand applicable et la poubelle de suppression. Les données cloud sont rechargées automatiquement à l'ouverture de la page, sans bouton `Actualiser`.

La modale `Partager le match` agit sur le match actif ou sélectionné avec trois sections: `Lien Match`; `Gérer en ligne` pour l'édition et la synchronisation cloud privée; puis `Exports` (`Programme`, `Banc`, `Texte`). La modale `Lien d'équipe` reprend la même séparation avec `Lien public`, puis `Gérer en ligne` pour la synchronisation privée de l'équipe. Sur un nouvel appareil, la connexion charge les équipes privées avant leurs matchs. Un match privé ne peut être activé que si son équipe l'est déjà; une tentative affiche une erreur avec un accès direct à la modale `Lien d'équipe`. Les liens publics restent actifs quand les copies privées sont retirées.
