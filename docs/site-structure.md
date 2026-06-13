# Structure du site

Ce document décrit la structure actuelle de l'application et sert de base pour simplifier l'expérience utilisateur.

## Navigation actuelle

L'application est une SPA avec quatre vues principales accessibles par hash URL:

- `#equipe`
- `#ordre`
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
+-- Équipe (#equipe)
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
+-- Ordre (#ordre)
|   +-- Ordre des frappeurs
|   |   +-- Réordonner par glisser-déposer
|   |   +-- Mélanger l'ordre
|   +-- Option frappe fixe
|   +-- Alertes de nombre de joueurs actifs
+-- Alignement (#alignement)
|   +-- Actions
|   |   +-- Régénérer
|   |   +-- Copier courriel HTML
|   |   +-- PDF entraîneur
|   |   +-- Image parents
|   |   +-- Exporter mode match
|   +-- Validations
|   +-- Équité
|   +-- Tableau principal
|   |   +-- Positions par joueur et par manche
|   |   +-- Ajout / retrait de manche
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
    +-- Exports rapides
```

## Flux principal actuel

```text
Équipe → Ordre → Alignement → Partager → Mode match
```

Ce flux est logique pour préparer un match avant d'arriver au terrain.

## Flux secondaires actuels

- Charger un exemple puis aller directement à l'alignement.
- Modifier l'équipe après génération.
- Modifier l'ordre après génération.
- Régénérer l'alignement.
- Corriger des problèmes à partir des suggestions.
- Exporter depuis la section `Partager`.
- Utiliser le mode match comme écran de consultation pendant la partie.

## Frictions connues

- L'écran `Alignement` contient beaucoup de sections et peut paraître dense.
- Les contrôles d'ajout/retrait de manche sont cachés dans le dernier en-tête de tableau.
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
- Est-ce que l'ajout/retrait de manche devrait être un réglage visible avant génération plutôt qu'un contrôle dans le tableau?

## Décisions UX prises

- Fusionner les vues `Équipe` et `Ordre` en une seule vue de préparation.
- Garder la possibilité de désactiver temporairement un joueur sans le supprimer.
- Garder la possibilité d'ajuster l'ordre des frappeurs manuellement.
- Garder une action pour rendre l'ordre aléatoire.

## Vue de préparation cible

La future vue de préparation devrait contenir:

- informations du match;
- liste des joueurs;
- activation / désactivation temporaire des joueurs;
- ajout de joueurs;
- suppression d'un joueur seulement comme action explicite;
- ordre des frappeurs;
- réorganisation manuelle;
- action `Mélanger`;

Comportement attendu pour l'ordre:

- L'ordre manuel est la référence modifiable par l'entraîneur.
- Quand l'entraîneur mélange l'ordre, le nouvel ordre devient simplement l'ordre courant.
- Si l'entraîneur modifie manuellement l'ordre après un mélange, ce nouvel ordre devient l'ordre courant.
- Désactiver temporairement un joueur le retire du match courant, mais ne supprime pas le joueur de la liste.

## Décisions UX additionnelles

- Regrouper les exports et publications dans une section séparée `Partager`.
- La section `Partager` doit utiliser des conventions UI faciles à reconnaître: impression/PDF, copier, image, texte, lien, QR code.
- Retirer la vue terrain de l'expérience principale.
- L'ajout et le retrait de manche doivent rester possibles en cours de match, parce qu'une 5e manche peut être ajoutée si le temps le permet.
- L'ajout/retrait de manche ne doit pas être caché uniquement dans le tableau; il doit être accessible de façon claire dans le flux de match ou d'alignement.

## Section Partager cible

La future section `Partager` devrait regrouper:

- PDF / impression entraîneur;
- image parents;
- texte mini imprimante;
- copie courriel HTML;
- publication en ligne future;
- QR code futur.

Le mode publication en ligne devrait au minimum offrir une vue parents en lecture seule avec des informations limitées.
