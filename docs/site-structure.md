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
|   |   +-- Adversaire
|   |   +-- Date
|   |   +-- Endroit
|   |   +-- Local / visiteur
|   +-- Joueurs enregistrés
|   |   +-- Activer / désactiver un joueur
|   |   +-- Supprimer un joueur
|   +-- Ajouter ou coller des joueurs
|   +-- Ordre des frappeurs
|   |   +-- Réordonner par glisser-déposer
|   |   +-- Mélanger l'ordre
|   +-- Option frappe fixe
|   +-- Alertes de nombre de joueurs actifs
+-- Alignement (#alignement)
|   +-- Actions
|   |   +-- Régénérer
|   |   +-- Partager
|   +-- Manches
|   |   +-- Retirer une manche
|   |   +-- Nombre de manches courant
|   |   +-- Ajouter une manche
|   +-- Validations
|   +-- Équité
|   +-- Tableau principal
|   |   +-- Positions par joueur et par manche
|   |   +-- Sélection de joueur ou de manche
|   |   +-- Échange manuel de positions par glisser-déposer
|   +-- Légende des positions
|   +-- Problèmes et suggestions
|   +-- Statistiques
+-- Partager (#partager)
|   +-- Entraîneurs
|   |   +-- PDF entraîneur
|   +-- Parents
|   |   +-- Image parents
|   +-- Courriel
|   |   +-- Copier courriel HTML
|   +-- Mode match autonome
|       +-- Exporter mode match
+-- Mode match (#match)
    +-- Carte de manche courante
    |   +-- Attaque: frappeurs de la manche
    |   +-- Défense: positions défensives
    +-- Navigation précédent / suivant
    +-- Points de progression
    +-- Lien vers Partager
```

## Flux principal actuel

```text
Préparation -> Alignement -> Partager -> Mode match
```

Ce flux est logique pour préparer un match avant d'arriver au terrain.

## Flux secondaires actuels

- Charger un exemple puis aller directement à l'alignement.
- Modifier la préparation après génération.
- Régénérer l'alignement.
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
- Garder le mode match très lisible et utilisable rapidement sur téléphone.
- Réduire les décisions visibles quand elles ne sont pas nécessaires.
- Ne pas cacher les alertes qui bloquent une règle obligatoire.

Découpage potentiel:

- Préparation
  - équipe;
  - joueurs;
  - ordre des frappeurs.
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

## Décisions UX prises

- Les vues `Équipe` et `Ordre` sont fusionnées en une seule vue de préparation.
- Garder la possibilité de désactiver temporairement un joueur sans le supprimer.
- Garder la possibilité d'ajuster l'ordre des frappeurs manuellement.
- Garder une action pour rendre l'ordre aléatoire.
- Regrouper les exports et publications dans une section séparée `Partager`.
- La section `Partager` doit utiliser des conventions UI faciles à reconnaître: impression/PDF, copier, image, texte, lien, QR code.
- Retirer la vue terrain de l'expérience principale.
- L'ajout et le retrait de manche doivent rester possibles en cours de match, parce qu'une 5e manche peut être ajoutée si le temps le permet.
- L'ajout/retrait de manche est accessible clairement dans l'écran d'alignement.

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
- export du mode match autonome.

À venir:

- texte mini imprimante;
- publication en ligne;
- QR code.

Le mode publication en ligne devrait au minimum offrir une vue parents en lecture seule avec des informations limitées.
