# Spécification produit

## Objectif

L'application aide un entraîneur Rallye-Cap à préparer rapidement un alignement clair pour un match: ordre des frappeurs, défensive par manche, équité de temps de jeu et supports partageables.

Promesse UX:

- clair et équitable pour le banc;
- facile pour les entraîneurs;
- beau et lisible pour les parents.

## Public cible

- Entraîneurs qui préparent l'alignement avant le match.
- Assistants qui consultent les positions pendant le match.
- Parents qui reçoivent une version simple à lire.

## Parcours principal

Le workflow cible suit la réalité du match et limite les retours en arrière une fois la partie commencée:

1. `📅 Match`: entrer les informations du match: équipe, adversaire, date, endroit, local ou visiteur.
2. `👨‍👩‍👦‍👦 Joueurs`: ajouter, renommer, activer ou désactiver les joueurs avant le début du match.
3. `📋 Alignement`: choisir la frappe fixe, optimiser, ajuster manuellement, suivre la progression du match, appliquer les suggestions et gérer les changements de joueurs.
4. `Partager`: page non numérotée accessible par une icône standard de partage.

Le mode spectateur est une vue simplifiée en lecture seule accessible par le menu. Il n'est plus une étape du workflow principal.

Observation UX à explorer:

- L'étape `Joueurs` pourrait devenir la première étape si la réutilisation de la liste de joueurs devient plus importante que la saisie des informations du match.

## Règles métier actuelles

- Les règles Rallye-Cap sont considérées uniformes par défaut. Il ne faut pas ajouter de profils par association ou catégorie sans nouvelle décision produit.
- Le nombre de joueurs actifs doit être entre 6 et 12.
- Le nombre de manches doit être entre 4 et 9.
- Chaque manche défensive doit avoir 6 défenseurs.
- Les positions défensives sont `1B`, `2B`, `3B`, `AC`, `L1`, `L2`; les autres joueurs sont au banc.
- En mode frappe fixe, il y a 6 frappeurs par manche et l'ordre continue à la manche suivante.
- La frappe fixe est normalement activée en Rallye-Cap; l'interface doit l'indiquer clairement.
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
- Vue spectateur navigable par boutons, clavier ou geste tactile.
- Exports: courriel HTML, impression/PDF, image parents, spectateur HTML autonome.
- L'export texte mini imprimante doit suivre le même ordre de demi-manches que la vue spectateur: l'équipe visiteuse frappe en début de manche et l'équipe locale frappe en fin de manche.

## Préparation de match

- Un nouveau match devrait être initialisé avec la date du jour.
- L'action destructive globale devrait être libellée `Recommencer` plutôt que `Réinitialiser`.
- Recommencer doit être confirmé clairement et expliquer si les joueurs enregistrés sont conservés ou supprimés.
- Terminer un match doit permettre de conserver la liste des joueurs pour préparer un nouveau match.

## Progression du match dans l'alignement

- La gestion du match se fait dans `Alignement`. L'onglet `Jouer` est retiré du workflow principal.
- `Alignement` affiche l'état courant du match au-dessus ou près du tableau: `Match non commencé`, `À jouer: début 1re`, `À jouer: fin 1re`, etc.
- Un seul bouton principal fait avancer la progression par demi-manche: `Commencer le match`, puis `Terminer début 1re`, `Terminer fin 1re`, etc.
- Après la dernière demi-manche, l'application doit permettre de terminer le match et de sortir de l'état bloqué tout en gardant les mêmes joueurs en mémoire.
- L'interface principale ne permet pas de revenir à une demi-manche précédente. Une correction de progression, si nécessaire, doit être une action avancée future avec confirmation forte.
- Commencer le match ou appliquer un changement à partir d'une demi-manche verrouille les demi-manches précédentes comme jouées.
- Quand une demi-manche est jouée, elle devient de l'historique non modifiable. Les demi-manches futures restent modifiables selon les actions permises.
- Quand le match est commencé, les vues `Match` et `Joueurs` deviennent non modifiables.
- L'action `Optimiser` existe seulement avant le début réel du match dans `Alignement`.
- Le tableau principal sépare chaque manche en deux demi-manches: la colonne gauche est toujours le début et la colonne droite est toujours la fin.
- L'en-tête de chaque demi-manche indique seulement le type de jeu pour notre équipe: `🏏` pour l'attaque et `🧤` pour la défensive. L'ordre dépend du statut visiteur/local.
- Les lignes du tableau principal restent associées aux joueurs. En attaque, les cellules affichent seulement le rang de frappe prévu (`#1`, `#2`, etc.) quand la frappe fixe est activée. En défensive, les cellules affichent les positions.
- Le concept de cadenas est remplacé par une progression de match: les demi-manches passées sont grisées et la demi-manche `À jouer` est indiquée clairement.
- Sur mobile, le tableau principal de `Alignement` doit faire défiler horizontalement automatiquement vers la demi-manche `À jouer` quand le match est commencé.
- Quand une demie-manche offensive est barrée, l'ordre au bâton utilisé pour cette demie-manche est figé afin que les changements futurs ne modifient pas l'historique.
- Avant le début du match, l'ordre des frappeurs peut être modifié en glissant les joueurs dans la première colonne; le déplacement réordonne les lignes complètes. Une fois le match débuté, ce glisser-déposer d'ordre est désactivé.
- Avant le début du match, `Optimiser` recalcule les positions défensives en respectant l'ordre de frappe courant.
- Avant le début du match, une action de mélange aléatoire peut modifier l'ordre de frappe des joueurs actifs. Cette action demande confirmation, mélange l'ordre, puis optimise automatiquement les positions défensives.
- Avant le début du match, la première arrivée sur `Alignement` après un ajout, une suppression ou un changement de présence des joueurs optimise automatiquement l'alignement si 6 à 12 joueurs sont actifs. Un remplacement direct avant match conserve plutôt la place et les assignations du joueur remplacé.
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
- Les changements de joueurs en cours de match sont accessibles depuis `Alignement` par un seul bouton de changement de joueurs.
- Le changement demande toujours la demi-manche précise à partir de laquelle l'action s'applique, par exemple `Début 3e` ou `Fin 3e`.
- Les demi-manches précédentes sont alors considérées jouées et ne doivent plus être modifiées par ce changement ni par les suggestions automatiques.
- Une fois qu'une demi-manche est jouée, aucun changement futur ne peut être appliqué dans une demi-manche précédente.
- `Enlever`: si plus de 6 joueurs sont actifs, le joueur est retiré des demi-manches futures. Son historique demeure visible.
- `Remplacer`: le nouveau joueur peut être un joueur inactif existant ou un nouveau nom. L'historique du joueur remplacé demeure, une nouvelle ligne est ajoutée sous lui, et le nouveau joueur reprend ses assignations futures.
- `Ajouter`: si moins de 12 joueurs sont actifs, le nouveau joueur est ajouté directement au match en cours. Il est placé en bas de la liste, devient dernier frappeur et ne reçoit aucune assignation défensive automatique. Le remplacement d'un joueur doit passer par l'action séparée `Remplacer`.
- `Inactif`: le joueur est enregistré sans participer au match courant.
- Un joueur actif peut aussi être remplacé directement depuis la liste des joueurs enregistrés avant le début du match.
- Quand un joueur actif est retiré pendant un match débuté, les demi-manches passées ne sont pas modifiées. Les assignations futures du joueur sont retirées et l'entraîneur doit corriger manuellement.
- Si seulement 6 joueurs sont actifs, retirer un joueur exige un remplacement.
- Quand un remplacement se fait pendant un match débuté, le tableau doit préserver l'historique du joueur remplacé dans les demi-manches passées, ajouter une ligne pour le nouveau joueur sous le joueur remplacé, retirer l'ancien joueur de l'ordre futur et retirer l'ancien joueur des assignations défensives futures.
- Quand un remplacement se fait avant le début du match, le nouveau joueur doit prendre la place exacte du joueur retiré dans l'ordre, dans le tableau et dans les assignations défensives. Le joueur remplacé devient inactif.
- Si un retrait ou une désactivation crée une manche future avec moins de 6 positions assignées, l'application doit offrir un chemin clair pour corriger l'alignement. Les corrections possibles incluent une suggestion automatique pour insérer un joueur du banc, une action manuelle rapide depuis une cellule `BANC`, ou une ligne/zone indiquant les positions non assignées.
- Dans `Alignement`, les manches défensives futures incomplètes doivent être signalées directement au-dessus du tableau. L'entraîneur peut cliquer une cellule `BANC` mise en évidence pour assigner une position manquante, ou utiliser une action globale qui remplit automatiquement les positions possibles sans toucher aux demi-manches déjà complétées.
- Les suggestions proposées en cas de problème doivent viser seulement les demi-manches non jouées.
- Le match ne doit pas pouvoir être débuté si l'alignement n'est pas minimalement prêt: 6 à 12 joueurs actifs, au moins une manche préparée et 6 positions défensives assignées pour chaque manche prévue.
- Charger un exemple pendant un match débuté est interdit; l'entraîneur doit réinitialiser ou recommencer le match avant de remplacer les données.

## Exports et partage

- Les exports parents doivent rester lisibles avec beaucoup de joueurs et avec des noms longs. La mise en page doit s'adapter au contenu au lieu de couper ou de superposer les textes.
- Les noms de fichiers d'exports parents devraient inclure la date et les noms des équipes.
- Dans la vue spectateur, les deux lanceurs doivent être affichés sur deux lignes séparées afin que la défensive présente 6 éléments visuels, comme l'ordre de frappe.
- L'export mini imprimante doit afficher le texte dans une zone éditable avant la copie. Les modifications manuelles ne sont pas sauvegardées dans le match; elles servent seulement à ajuster l'impression de dernière minute.

## Questions ouvertes

- La gestion multi-match doit-elle être limitée aux matchs à venir ou inclure une archive complète des anciens matchs?
