# Structure du site

Ce document décrit la structure actuelle de l'application et sert de base pour simplifier l'expérience utilisateur.

## Navigation actuelle

L'application est une SPA avec quatre vues principales accessibles par hash URL:

- `#equipe`
- `#alignement`
- `#partager`
- `#match`

La navigation est disponible dans:

- la barre du haut;
- les étapes numérotées;
- certains boutons de continuité entre les vues.

## Sitemap actuel

```text
Alignement Rallye-Cap
+-- Préparation (#equipe)
|   +-- Infos du match
|   |   +-- Nom de l'équipe
|   |   +-- Statut visiteur / locale de l'équipe
|   |   +-- Adversaire
|   |   +-- Statut visiteur / locale de l'adversaire
|   |   +-- Date
|   |   +-- Endroit
|   |   +-- Charger un exemple
|   +-- Joueurs enregistrés
|   |   +-- Activer / désactiver un joueur
|   |   +-- Renommer un joueur
|   |   +-- Remplacer un joueur
|   |   +-- Supprimer un joueur
|   +-- Ajouter des joueurs
|   +-- Continuer vers Alignement
+-- Alignement (#alignement)
|   +-- Réglages
|   |   +-- Option frappe fixe
|   +-- Tableau principal
|   |   +-- Optimiser
|   |   +-- Débuter le match
|   |   +-- Cadenas de manche
|   |   +-- Retirer une manche
|   |   +-- Ajouter une manche
|   |   +-- Réordonner les joueurs par glisser-déposer
|   |   +-- Positions par joueur et par manche
|   |   +-- Sélection de joueur ou de manche
|   |   +-- Échange manuel de positions par glisser-déposer
|   +-- Légende des positions
|   +-- Validations
|   +-- Équité
|   +-- Problèmes et suggestions
|   +-- Statistiques
|   +-- Continuer vers Partager
+-- Partager (#partager)
|   +-- Entraîneurs
|   |   +-- PDF entraîneur
|   +-- Parents
|   |   +-- Image parents
|   +-- Courriel
|   |   +-- Copier courriel HTML
|   +-- Mini imprimante
|   |   +-- Copier texte brut
|   +-- Mode match autonome
|       +-- Exporter mode match
|   +-- Continuer vers Mode match
+-- Mode match (#match)
    +-- Carte de manche courante
    |   +-- Attaque: frappeurs de la manche si la frappe fixe est activée
    |   +-- Attaque: rappel de suivre l'ordre au banc si la frappe fixe est désactivée
    |   +-- Défense: positions défensives
    +-- Navigation précédent / suivant
    +-- Barrer / débarrer la demi-manche courante
    +-- Points de progression
```

## Flux principal actuel

```text
Préparation -> Alignement -> Partager -> Mode match
```

Ce flux est logique pour préparer un match avant d'arriver au terrain.

## Workflow cible

Le workflow cible suit la réalité d'un match et évite de devoir revenir dans les étapes de préparation après le début.

```text
📅 Match -> 👨‍👩‍👦‍👦 Joueurs -> 📋 Alignement partant -> ⚾ Jouer
```

`Partager` devient une page non numérotée accessible par une icône standard de partage. `Spectateur` remplace le mode match actuel comme vue simplifiée en lecture seule accessible par le menu.

Sitemap cible:

```text
Alignement Rallye-Cap
+-- Match
|   +-- Nom de l'équipe
|   +-- Local / visiteur
|   +-- Adversaire
|   +-- Date
|   +-- Endroit
|   +-- Indication que l'exemple se charge depuis le menu
+-- Joueurs
|   +-- Joueurs enregistrés
|   +-- Ajouter un joueur
|   +-- Renommer un joueur
|   +-- Activer / désactiver un joueur avant le match
+-- Alignement partant
|   +-- Frappe fixe
|   +-- Optimiser
|   +-- Tableau principal modifiable
|   +-- Validations
|   +-- Suggestions
|   +-- Statistiques et équité
+-- Jouer
|   +-- Démarrer le match avec confirmation
|   +-- Demi-manche courante visible
|   +-- Tableau principal centré sur la demi-manche courante
|   +-- Manches passées grisées
|   +-- Passer à la prochaine demi-manche
|   +-- Revenir à la demi-manche précédente avec confirmation
|   +-- Carte `Changements de joueurs`
|   |   +-- Enlever / remplacer / ajouter un joueur pour le futur
|   |   +-- Actions actives seulement après une demi-manche complétée et avant la fin du match
+-- Partage
|   +-- Exports disponibles seulement si le match respecte les règles de base
|   +-- Lien ou export vers Spectateur toujours disponible
+-- Spectateur
    +-- Vue simplifiée en lecture seule
```

## Flux secondaires actuels

- Modifier la préparation après génération.
- Optimiser l'alignement.
- Ajouter ou retirer une manche si le contexte réel change.
- Corriger des problèmes à partir des suggestions.
- Exporter depuis la section `Partager`.
- Utiliser le mode match comme écran de consultation pendant la partie.

## Frictions connues

- L'écran `Alignement` contient beaucoup de sections et peut paraître dense.
- Le mode match pourrait mieux anticiper la prochaine action utile:
  - en attaque: prochains lanceurs à préparer si applicable;
  - en défense: deux premiers frappeurs de la prochaine présence offensive si applicable.
- Les suggestions et validations pourraient être rapprochées du tableau quand l'utilisateur corrige manuellement.
- Le flux ne distingue pas encore clairement préparation avant-match, ajustement, et consultation pendant le match.

## Direction d'optimisation UX

Objectif: rendre l'application plus simple et plus fluide sans enlever les contrôles utiles aux entraîneurs.

Principes:

- Garder le chemin principal très clair.
- Séparer les actions fréquentes des actions avancées.
- Éviter les boutons doublés quand la navigation principale donne déjà accès à la même destination.
- Placer les actions près de l'objet qu'elles modifient.
- Garder le mode match très lisible et utilisable rapidement sur téléphone.
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
  - PDF / impression;
  - image parents;
  - texte mini imprimante;
  - publication en ligne future.
- Match
  - vue simplifiée;
  - navigation rapide;
  - infos de préparation de la prochaine demi-manche.

## Questions UX à explorer

- Est-ce que les statistiques avancées devraient être repliées par défaut?
- Est-ce que le réglage des manches devrait aussi être disponible dans le mode match, en plus de l'écran d'alignement?
- Est-ce que les sous-en-têtes du tableau doivent garder les textes `Début` et `Fin`, ou seulement les icônes et cadenas puisque la colonne gauche est toujours le début et la colonne droite est toujours la fin?
- Quel patron d'interaction est le plus rapide sur téléphone pour corriger une position défensive manquante après un retrait de joueur: clic sur `BANC`, zone `Positions non assignées`, ou menu d'action par manche?

## Décisions UX prises

- Le workflow cible est `Match`, `Joueurs`, `Alignement partant`, `Jouer`; `Partager` et `Spectateur` ne sont pas des étapes numérotées.
- Une fois le match commencé, les étapes `Match`, `Joueurs` et `Alignement partant` ne sont plus modifiables.
- `Jouer` devient la seule vue de gestion active pendant la partie.
- Le concept de cadenas est retiré du modèle cible. La progression de match détermine les demi-manches passées, courantes et futures.
- Les changements de joueurs pendant la partie sont accessibles dans `Jouer` après une demi-manche complétée.
- Le mode match actuel devient `Spectateur`, une vue simplifiée en lecture seule accessible par le menu.
- `Charger un exemple` vit seulement dans le menu et demande confirmation parce qu'il réinitialise toutes les données locales.
- Les vues `Équipe` et `Ordre` sont fusionnées en une seule vue de préparation.
- La préparation se limite aux informations du match et aux joueurs.
- L'ordre des frappeurs se modifie dans le tableau principal de l'alignement, en glissant les joueurs dans la première colonne.
- Garder la possibilité de désactiver temporairement un joueur sans le supprimer.
- Garder la possibilité d'ajuster l'ordre des frappeurs manuellement.
- Les changements de vue doivent ramener l'utilisateur en haut de la page.
- Le tableau de statut en haut de page affiche une ligne pleine largeur avec le nom de notre équipe et l'état du match, puis quatre cartes: joueurs actifs, manches, côté `Local` ou `Visiteur`, et équité.
- `Charger un exemple` est dans l'en-tête de `Préparation` et ne change pas de vue.
- La préparation affiche les informations du match sur une ligne: notre équipe, son côté `Local` ou `Visiteur`, un bouton d'échange, le côté de l'adversaire, l'adversaire, la date et l'endroit.
- Le bouton d'échange `Local` / `Visiteur` doit rester stable visuellement quand les côtés changent.
- L'action `Optimiser` remplace `Régénérer` et doit être près du tableau principal.
- Le bouton `Optimiser` devient grisé après optimisation et se réactive dès qu'une modification manuelle est faite.
- L'ajout et le retrait de manches sont des icônes `-` et `+` dans l'en-tête de la dernière manche.
- Les validations et l'équité doivent être affichées après le tableau principal.
- L'écran `Alignement` ne doit pas avoir de bouton `Partager` si la navigation principale donne déjà accès à `Partager`.
- L'écran `Partager` ne doit pas avoir de bouton `Ouvrir le mode match` si la navigation principale donne déjà accès au mode match.
- L'écran `Mode match` ne doit pas avoir de bouton `Partager` si la navigation principale donne déjà accès à `Partager`.
- Chaque étape avant le mode match doit avoir un bouton `Continuer` en bas pour soutenir le flux guidé.
- Regrouper les exports et publications dans une section séparée `Partager`.
- La section `Partager` doit utiliser des conventions UI faciles à reconnaître: impression/PDF, copier, image, texte, lien, QR code.
- Les exports de la section `Partager`, incluant le mode match autonome, sont présentés comme des cartes de même niveau visuel. Le bouton du mode match autonome n'est pas primaire.
- Retirer la vue terrain de l'expérience principale.
- L'ajout et le retrait de manche doivent rester possibles en cours de match, parce qu'une 5e manche peut être ajoutée si le temps le permet.
- L'ajout/retrait de manche est accessible clairement dans l'écran d'alignement.
- Le match est démarré par un bouton explicite `Débuter le match`.
- Une fois le match débuté, ce bouton devient `Recommencer le match`; avec confirmation, il débarre toutes les demi-manches, réinitialise l'historique de frappe et réactive `Optimiser`.
- Quand le match est débuté, `Optimiser` est désactivé.
- Le tableau principal affiche chaque manche en deux colonnes de demie-manche: `Début` et `Fin`.
- Les sous-en-têtes utilisent `🏏` pour l'attaque et `🧤` pour la défensive selon le statut visiteur/local.
- Avant le début du match, glisser un joueur dans la première colonne change l'ordre et déplace la ligne complète.
- Quand le match est débuté, les lignes du tableau principal restent stables par joueur. La première colonne affiche le rang courant dans l'ordre des frappeurs, tandis que les cellules d'attaque affichent les rangs prévus par demie-manche.
- Les demi-manches peuvent être barrées dans le tableau avec un cadenas ouvert ou fermé placé dans le sous-en-tête `Début` ou `Fin`. Les demi-manches peuvent aussi être barrées dans le mode match.
- Les demi-manches barrées doivent rester continues depuis le début du match. L'interface confirme les changements qui barrent ou débarrent plusieurs demi-manches.
- Une manche peut être ouverte, partiellement barrée ou complètement barrée.
- Les changements de joueurs pendant un match touchent seulement les manches non barrées et demandent confirmation quand ils ont un impact important.
- L'action `Remplacer` est disponible sur un joueur actif dans la liste des joueurs. Avant le match, le nouveau joueur prend la place et les assignations de l'ancien. Pendant un match débuté, les demi-manches barrées gardent l'ancien joueur, et le nouveau joueur apparaît sous lui pour les manches futures.
- L'étape `Joueurs` permet de renommer directement un joueur et utilise un bouton explicite `Présent` / `Absent` pour la disponibilité.
- Le bloc `Ajouter des joueurs` se replie quand l'équipe a déjà le minimum de joueurs et peut être rouvert avec un bouton explicite.
- Le menu du haut garde les étapes principales visibles et regroupe `Partager`, `Spectateur`, `Charger un exemple` et `Réinitialiser` dans `Autres`.
- Les entêtes de demi-manche du tableau principal affichent seulement les icônes bâton et gant; `Début` est toujours la colonne de gauche et `Fin` la colonne de droite.
- Le démarrage de `Jouer` est bloqué tant que l'alignement n'a pas 6 à 12 joueurs actifs et 6 positions défensives assignées par manche.
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

- PDF / impression entraîneur;
- image parents;
- copie courriel HTML;
- texte brut mini imprimante;
- export du mode match autonome.

Le texte mini imprimante doit suivre l'ordre réel des demi-manches comme le mode match: attaque en début de manche si notre équipe est visiteuse, défense en début de manche si notre équipe est locale.

À venir:

- publication en ligne;
- QR code.

Le mode publication en ligne devrait au minimum offrir une vue parents en lecture seule avec des informations limitées.
