# Spécification produit

## Objectif

L'application aide un entraîneur Rallye-Cap à préparer rapidement un alignement clair pour un match: ordre des frappeurs, défensive par manche, équité de temps de jeu et supports partageables.

## Public cible

- Entraîneurs qui préparent l'alignement avant le match.
- Assistants qui consultent les positions pendant le match.
- Parents qui reçoivent une version simple à lire.

## Parcours principal

1. Entrer les informations du match: équipe, adversaire, date, endroit, local ou visiteur.
2. Ajouter les joueurs et activer ceux qui participent au match.
3. Ajuster l'ordre des frappeurs.
4. Générer ou modifier l'alignement défensif.
5. Vérifier les alertes et l'indice d'équité.
6. Exporter un mode match, une version imprimable ou une image parents.

## Règles métier actuelles

- Les règles Rallye-Cap sont considérées uniformes par défaut. Il ne faut pas ajouter de profils par association ou catégorie sans nouvelle décision produit.
- Le nombre de joueurs actifs doit être entre 6 et 12.
- Le nombre de manches doit être entre 4 et 9.
- Chaque manche défensive doit avoir 6 défenseurs.
- Les positions défensives sont `1B`, `2B`, `3B`, `AC`, `L1`, `L2`; les autres joueurs sont au banc.
- En mode frappe fixe, il y a 6 frappeurs par manche et l'ordre continue à la manche suivante.
- Quand la frappe fixe est désactivée, l'application garde l'ordre général des frappeurs, mais ne doit pas afficher de frappeurs par manche, de nombre de présences au bâton prévu, ni de rang `(#)` dans les cases du tableau. Ces informations dépendent alors des retraits réels pendant le match.

## Règles obligatoires de défensive

Ces règles sont obligatoires. L'application doit les traiter comme des erreurs à corriger, pas comme de simples préférences d'équité.

- Premier but: un joueur peut jouer `1B` au maximum une fois dans le match.
- Lanceurs: un joueur ne peut pas être lanceur deux manches consécutives. `L1` et `L2` comptent tous les deux comme une présence de lanceur.
- Banc: un joueur ne peut pas être au banc deux manches consécutives.
- Défense complète: chaque manche doit avoir exactement 6 défenseurs et chaque position défensive doit être assignée une seule fois.

Hypothèse produit:

- Avec 4 manches et entre 6 et 12 joueurs actifs, l'application devrait normalement pouvoir produire un alignement qui respecte ces contraintes.
- Si une contrainte devient impossible à cause d'un changement en cours de match ou d'un nombre différent de manches, l'application doit l'expliquer clairement.

## Objectifs d'équité

Ces objectifs améliorent la qualité de l'alignement, mais ils ne doivent pas masquer les règles obligatoires.

- Répartir le temps de jeu le plus équitablement possible.
- Répartir les présences défensives le plus équitablement possible.
- Répartir les présences au bâton le plus équitablement possible en mode frappe fixe.
- Les cartes d'équité sont harmonisées entre les modes: `Temps de jeu`, `Variété des positions` et `Indice global`. En mode frappe fixe, la carte `Présences au bâton` est ajoutée.
- `Temps de jeu` inclut les présences au bâton et la défensive quand la frappe fixe est activée. Quand la frappe fixe est désactivée, `Temps de jeu` inclut seulement la défensive, parce que les présences au bâton dépendent des retraits réels.
- Quand la frappe fixe est désactivée, les présences au bâton ne doivent pas influencer les scores d'équité. Les statistiques n'affichent alors pas les colonnes `AB` ni `Total`.
- Varier les positions autant que possible après respect des règles obligatoires.

## Exigences de langue et d'encodage

- La langue de référence est le français du Québec.
- Le HTML doit rester `lang="fr-CA"` avec `<meta charset="utf-8">`.
- Les fichiers doivent être enregistrés en UTF-8.
- Les textes visibles doivent utiliser des caractères français corrects, pas des chaînes mojibake comme `Ã©`, `Ã¨`, `â€™`, `âœ”`.

## Fonctionnalités existantes

- Ajout de joueurs par liste, virgules ou lignes.
- Activation et suppression de joueurs.
- Réorganisation de l'ordre par glisser-déposer.
- Génération automatique de la défensive.
- Ajustement manuel des positions par glisser-déposer dans une manche.
- Validations et suggestions.
- Statistiques par joueur.
- Mode match navigable par boutons, clavier ou geste tactile.
- Exports: courriel HTML, impression/PDF, image parents, mode match HTML autonome.
- L'export texte mini imprimante doit suivre le même ordre de demi-manches que le mode match: l'équipe visiteuse frappe en début de manche et l'équipe locale frappe en fin de manche.

## Mode match

- Le match ne devient pas `débuté` automatiquement; l'entraîneur doit utiliser une action explicite `Débuter le match`.
- Quand le match est débuté, l'action `Optimiser` est désactivée. Le bouton de démarrage devient `Recommencer le match`; avec confirmation, il débarre toutes les demi-manches, réinitialise l'historique des rangs au bâton et rend `Optimiser` disponible de nouveau.
- Le tableau principal sépare chaque manche en deux demies-manches `Début` et `Fin`.
- L'en-tête de chaque demie-manche indique le type de jeu pour notre équipe: `🏏` pour l'attaque et `🧤` pour la défensive. L'ordre dépend du statut visiteur/local.
- Les lignes du tableau principal restent associées aux joueurs. En attaque, les cellules affichent seulement le rang de frappe prévu (`#1`, `#2`, etc.) quand la frappe fixe est activée. En défensive, les cellules affichent les positions.
- Chaque demie-manche peut être barrée ou débarrée depuis son sous-en-tête `Début` ou `Fin` avec un cadenas ouvert ou fermé.
- Les manches barrées doivent former une progression continue depuis le début du match. Barrer une manche future doit proposer de barrer les manches précédentes manquantes avec confirmation. Débarrer une manche doit aussi débarrer les manches suivantes déjà barrées, avec confirmation.
- Les demi-manches barrées doivent former une progression continue depuis le début du match. Barrer une demie-manche future doit proposer de barrer les demies-manches précédentes manquantes avec confirmation. Débarrer une demie-manche doit aussi débarrer les demies-manches suivantes déjà barrées, avec confirmation.
- Une demi-manche peut aussi être barrée depuis le mode match. Une manche peut donc être ouverte, partiellement barrée ou complètement barrée.
- Quand une demie-manche offensive est barrée, l'ordre au bâton utilisé pour cette demie-manche est figé afin que les changements futurs ne modifient pas l'historique.
- Avant le début du match, l'ordre des frappeurs peut être modifié en glissant les joueurs dans la première colonne; le déplacement réordonne les lignes complètes. Une fois le match débuté, ce glisser-déposer d'ordre est désactivé.
- Avant le début du match, `Optimiser` remet l'ordre des frappeurs dans l'ordre normal des joueurs enregistrés avant de recalculer l'alignement.
- En attaque, afficher seulement les frappeurs de la manche courante quand la frappe fixe est activée.
- Quand la frappe fixe est désactivée, afficher un rappel de suivre l'ordre au banc au lieu d'une liste de frappeurs par manche.
- En attaque, afficher aussi les lanceurs de la prochaine manche défensive de notre équipe quand cette prochaine défense existe, pour préparer les casques.
- En défense, afficher les positions défensives de la manche courante.
- En défense, afficher aussi les deux premiers frappeurs de la prochaine manche offensive de notre équipe quand cette prochaine présence au bâton existe.
- Permettre l'ajout ou le retrait d'une manche en cours de match quand le contexte réel change, par exemple quand il reste assez de temps pour une 5e manche.
- Ne pas afficher d'aperçu de frappeurs après la dernière présence offensive possible du match.
- Ne pas afficher d'aperçu des lanceurs après la dernière manche défensive possible du match.

## Changements de joueurs pendant un match

- Les changements rapides sur téléphone sont prioritaires, mais les opérations qui changent beaucoup l'alignement doivent demander confirmation.
- Quand un joueur est ajouté pendant un match débuté, l'entraîneur doit choisir entre `Ajouter`, `Remplacer` ou `Inactif`.
- `Ajouter`: le joueur est ajouté à la fin de l'ordre au bâton et reste sans assignation défensive automatique dans les manches non barrées.
- `Remplacer`: le nouveau joueur prend la place du joueur remplacé dans l'ordre et dans les assignations des manches non barrées.
- `Inactif`: le joueur est enregistré sans participer au match courant.
- Quand un joueur actif est retiré pendant un match débuté, les manches barrées ne sont pas modifiées. Les assignations non barrées du joueur sont retirées et l'entraîneur doit corriger manuellement.
- Si seulement 6 joueurs sont actifs, retirer un joueur exige un remplacement.
- Quand un remplacement se fait pendant un match débuté, le tableau doit préserver l'historique du joueur remplacé dans les demi-manches barrées, ajouter une ligne pour le nouveau joueur, retirer l'ancien joueur de l'ordre futur et retirer l'ancien joueur des assignations défensives futures non barrées.
- Quand un remplacement se fait avant le début du match, le nouveau joueur doit prendre la place du joueur retiré dans l'ordre et dans le tableau.
- Si un retrait ou une désactivation crée une manche future avec moins de 6 positions assignées, l'application doit offrir un chemin clair pour corriger l'alignement. Les corrections possibles incluent une suggestion automatique pour insérer un joueur du banc, une action manuelle rapide depuis une cellule `BANC`, ou une ligne/zone indiquant les positions non assignées.
- Le match ne doit pas pouvoir être débuté si l'alignement n'est pas minimalement prêt: nombre de joueurs actif valide, positions défensives complètes pour les manches prévues, et absence de blocage majeur connu.
- Charger un exemple pendant un match débuté doit être interdit ou demander une confirmation explicite indiquant que les données du match courant seront remplacées.

## Questions ouvertes

- La gestion multi-match doit-elle être limitée aux matchs à venir ou inclure une archive complète des anciens matchs?
