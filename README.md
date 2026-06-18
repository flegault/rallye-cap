# Rallye-Cap

Application SPA statique pour préparer, ajuster et partager l'alignement d'une équipe de baseball Rallye-Cap.

## Utilisation

Ouvrir `index.html` dans un navigateur moderne. Les données restent sauvegardées localement sur l'appareil avec `localStorage`.

Flux principal actuel:

1. `Match`: adversaire, local/visiteur, date, heure, endroit, manches initiales et option `Frappe fixe`.
2. `Joueurs`: présences/absences pour le match courant.
3. `Alignement`: ordre des frappeurs, optimisation, progression par demi-manche, validations, suggestions et changements de joueurs.

`Accueil` sert de porte d'entrée contextuelle. `Équipe` gère le nom de l'équipe et le bassin permanent de joueurs hors workflow. `Partager` et `Spectateur` sont accessibles dans le menu.

L'app doit rester utilisable hors ligne et conserver le français du Québec en UTF-8.

## Fonctionnalités

- Génération d'un alignement défensif respectant les règles obligatoires Rallye-Cap.
- Ajustement manuel de l'ordre et des positions.
- Progression du match par demi-manche, avec historique non modifiable.
- Changements de joueurs en cours de match à partir d'une demi-manche choisie.
- Fin de match avec choix d'archiver localement ou non, puis retour à l'accueil.
- Archives locales en lecture seule, indépendantes des changements futurs à l'équipe.
- Exports `Banc`, `Programme` et `Texte`.
- Vue `Spectateur` locale en lecture seule.

L'ancien export HTML autonome du spectateur est retiré. La cible future pour partager le spectateur hors de l'app est un lien en ligne en lecture seule.

## Documentation

- `AGENTS.md`: consignes de maintenance pour agents.
- `docs/product-spec.md`: règles produit et parcours utilisateur.
- `docs/site-structure.md`: structure de navigation et pistes d'optimisation UX.
- `docs/technical-notes.md`: état, architecture et notes d'implémentation.
- `docs/roadmap.md`: améliorations, dettes et décisions à prendre.

## Tests

Ouvrir `tests/rules.html` dans un navigateur pour exécuter les tests des règles obligatoires. Une vérification rapide du JavaScript peut aussi être faite avec:

```powershell
node --check app.js
```
