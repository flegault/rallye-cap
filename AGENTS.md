# Notes pour agents

Ce dépôt contient une application SPA statique pour préparer un alignement de baseball Rallye-Cap.

## Règles générales

- L'application doit rester utilisable hors ligne à partir d'un fichier statique.
- Les données des joueurs et des matchs restent locales à l'appareil, sauf décision produit documentée.
- Le français du Québec doit être conservé. Les fichiers texte et HTML doivent être en UTF-8.
- Ne pas remplacer les accents par de l'ASCII. Corriger les problèmes de type `Ã©`, `â€™`, `âœ”` en restaurant les vrais caractères UTF-8.
- Documenter tout changement de règle métier dans `docs/product-spec.md`.
- Documenter toute décision technique durable dans `docs/technical-notes.md`.
- Mettre à jour `docs/roadmap.md` quand une amélioration planifiée est livrée, rejetée ou redécoupée.

## Architecture actuelle

- `index.html` contient le HTML, le CSS et le JavaScript.
- L'état est sauvegardé dans `localStorage` avec la clé `rallye_cap_qc_v4`.
- Les vues principales sont: équipe, ordre des frappeurs, alignement, mode match.
- Le moteur d'alignement, les validations, le rendu et les exports sont encore regroupés dans un seul script.

## Priorités de maintenance

1. Restaurer l'encodage UTF-8 lisible dans toute l'interface.
2. Extraire la logique métier dans des modules testables.
3. Ajouter des tests pour la génération, les validations et les cas limites.
4. Garder les exports HTML, impression/PDF et image parents compatibles avec une app statique.

## Risques connus

- Plusieurs chaînes visibles sont actuellement encodées incorrectement.
- Il n'y a pas de tests automatisés.
- Les fonctionnalités presse-papiers, fenêtre d'impression et téléchargement dépendent du navigateur.
- Une modification du schéma `localStorage` peut casser les données déjà sauvegardées si elle n'est pas migrée.
