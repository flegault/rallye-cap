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

1. `📅 Match`: entrer les informations du match: adversaire, date, heure, endroit, nombre de manches initial, frappe fixe, local ou visiteur.
2. `👨‍👩‍👦‍👦 Joueurs`: indiquer quels joueurs du bassin permanent sont présents ou absents pour ce match.
3. `📋 Alignement`: optimiser, ajuster manuellement, suivre la progression du match, appliquer les suggestions et gérer les changements de joueurs.
4. `Partager`: page non numérotée accessible par une icône standard de partage.

Le mode spectateur est une vue simplifiée en lecture seule accessible par le menu. Il n'est plus une étape du workflow principal.

`Accueil` est une porte d'entrée contextuelle hors workflow. Si aucune équipe n'est définie, l'accueil dirige vers la création de l'équipe. Sinon, il permet de reprendre le match courant ou de créer un nouveau match. Les états affichés doivent être formulés comme `Aucun match prévu`, `En préparation` et `En cours`, avec la demi-manche courante quand un match est commencé.

Le hero de présentation et les cartes de contexte apparaissent seulement sur `Accueil`. Ces cartes indiquent séparément le nom de l'équipe, le statut du match, le nombre de joueurs enregistrés et le nombre de matchs archivés; elles servent aussi de raccourcis vers `Équipe`, `Match` et `Archives`. L'accueil doit afficher un seul bouton d'action principal selon l'état courant.

La gestion de notre équipe et de son bassin permanent de joueurs est séparée du workflow de match, mais ne devient pas une nouvelle étape numérotée. Elle permet de définir le nom de notre équipe et d'ajouter, renommer ou supprimer les joueurs qui serviront aux matchs futurs. Le numéro de chandail est optionnel, limité à 2 chiffres, et se modifie dans `Équipe`, avant le match, comme le nom du joueur. Quand il est défini, il est affiché près du nom dans l'alignement et inclus dans les exports.

Observations UX à explorer:

- À la fin de la dernière demi-manche, l'application demande si le match doit être archivé. Dans les deux cas, l'entraîneur revient à `Accueil` et l'équipe ainsi que le bassin de joueurs restent en mémoire pour le prochain match.
- Les archives sont locales et en lecture seule. Une archive conserve un snapshot complet du match terminé; les changements futurs à l'équipe et au bassin permanent de joueurs ne modifient pas l'archive.
- Décision actuelle: `Match` reste avant `Joueurs`, parce que la présence des joueurs est liée à un match daté et que l'équipe permanente est gérée séparément hors workflow.

## Règles métier actuelles

- Les règles Rallye-Cap sont considérées uniformes par défaut. Il ne faut pas ajouter de profils par association ou catégorie sans nouvelle décision produit.
- Le nombre de joueurs actifs doit être entre 6 et 12.
- Le bassin permanent peut contenir plus de 12 joueurs. Pour un match, seuls 12 joueurs peuvent être `présents`; les joueurs excédentaires restent visibles comme `absents` et ne doivent pas être perdus.
- Le nombre de manches doit être entre 4 et 9.
- Chaque manche défensive doit avoir 6 défenseurs.
- Les positions défensives sont `1B`, `2B`, `3B`, `AC`, `L1`, `L2`; les autres joueurs sont au banc.
- En mode frappe fixe, il y a 6 frappeurs par manche et l'ordre continue à la manche suivante.
- La frappe fixe est normalement activée en Rallye-Cap; l'interface doit l'indiquer clairement dans l'étape `Match`, avec les autres paramètres du match courant.
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
- Exports: `Programme`, `Banc` et `Texte`. L'ancien export courriel HTML et l'ancien export spectateur HTML autonome sont retirés.
- L'export `Texte` doit suivre le même ordre de demi-manches que la vue spectateur: l'équipe visiteuse frappe en début de manche et l'équipe locale frappe en fin de manche.

## Préparation de match

- Un nouveau match est initialisé avec la date du jour et l'heure par défaut `18:30`.
- L'étape `Match` contient l'adversaire, la date, l'heure en format 24h, l'endroit, le côté local/visiteur, le nombre de manches initial et le réglage `Frappe fixe`. Le nom de notre équipe se gère dans `Équipe`.
- Le champ d'heure devrait proposer des intervalles de 5 minutes.
- L'action destructive globale devrait être libellée `Recommencer` plutôt que `Réinitialiser`.
- Recommencer doit être confirmé clairement et expliquer si les joueurs enregistrés sont conservés ou supprimés.
- Terminer un match doit permettre de conserver la liste des joueurs pour préparer un nouveau match.

## Progression du match dans l'alignement

- La gestion du match se fait dans `Alignement`. L'onglet `Jouer` est retiré du workflow principal.
- `Alignement` porte l'état courant du match par le bouton de progression, le tableau et les demi-manches grisées ou mises en évidence. L'écran ne doit pas dupliquer cet état dans un pill séparé.
- Un seul bouton principal fait avancer la progression par demi-manche: `Commencer le match`, puis `Terminer début 1re`, `Terminer fin 1re`, etc.
- Après la dernière demi-manche, l'application doit permettre de terminer le match et de sortir de l'état bloqué tout en gardant les mêmes joueurs en mémoire.
- L'interface principale ne permet pas de revenir à une demi-manche précédente. Une correction de progression, si nécessaire, doit être une action avancée future avec confirmation forte.
- Commencer le match ou appliquer un changement à partir d'une demi-manche verrouille les demi-manches précédentes comme jouées.
- Quand une demi-manche est jouée, elle devient de l'historique non modifiable. Les demi-manches futures restent modifiables selon les actions permises.
- Quand le match est commencé, les vues `Match` et `Joueurs` deviennent non modifiables.
- L'action `Optimiser` existe seulement avant le début réel du match dans `Alignement`.
- `Alignement` contient deux modes locaux sans nouvelle route: `Préparer` et `Jouer`.
- Avant match, `Préparer` affiche les actions d'ajustement de l'alignement (`Mélanger`, `Optimiser`) et `Jouer` affiche l'action de démarrage.
- Quand le match est commencé, le mode `Jouer` est forcé et contient la progression de demi-manche ainsi que `Changement de joueurs`.
- Le tableau principal sépare chaque manche en deux demi-manches: la colonne gauche est toujours le début et la colonne droite est toujours la fin.
- L'en-tête de chaque demi-manche indique seulement le type de jeu pour notre équipe: `🏏` pour l'attaque et `🧤` pour la défensive. L'ordre dépend du statut visiteur/local.
- Les lignes du tableau principal restent associées aux joueurs. En attaque, les cellules affichent seulement le rang de frappe prévu (`#1`, `#2`, etc.) quand la frappe fixe est activée. En défensive, les cellules affichent les positions.
- Le concept de cadenas est remplacé par une progression de match: les demi-manches passées sont grisées et la demi-manche `À jouer` est indiquée clairement.
- Sur mobile, le tableau principal de `Alignement` doit faire défiler horizontalement automatiquement vers la demi-manche `À jouer` quand le match est commencé.
- Quand une demie-manche offensive est barrée, l'ordre au bâton utilisé pour cette demie-manche est figé afin que les changements futurs ne modifient pas l'historique.
- Avant le début du match, l'ordre des frappeurs peut être modifié en glissant les joueurs dans la première colonne; le déplacement réordonne les lignes complètes. Une fois le match débuté, ce glisser-déposer d'ordre est désactivé.
- Avant le début du match, `Optimiser` recalcule les positions défensives en respectant l'ordre de frappe courant.
- Avant le début du match, une action de mélange aléatoire peut modifier l'ordre de frappe des joueurs actifs. Cette action demande confirmation, mélange l'ordre, puis optimise automatiquement les positions défensives.
- Au premier affichage de `Alignement` pour un nouveau match, l'application devrait offrir de mélanger l'ordre de frappe avant de montrer l'alignement généré.
- Avant le début du match, la première arrivée sur `Alignement` après un ajout, une suppression ou un changement de présence des joueurs optimise automatiquement l'alignement si 6 à 12 joueurs sont actifs.
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
- Le remplacement direct avant le début du match est retiré de l'étape `Joueurs`. Avant match, un changement de composition devrait passer par la présence/absence ou par la gestion hors workflow du bassin permanent.
- Quand un joueur actif est retiré pendant un match débuté, les demi-manches passées ne sont pas modifiées. Les assignations futures du joueur sont retirées et l'entraîneur doit corriger manuellement.
- Si seulement 6 joueurs sont actifs, retirer un joueur exige un remplacement.
- Quand un remplacement se fait pendant un match débuté, le tableau doit préserver l'historique du joueur remplacé dans les demi-manches passées, ajouter une ligne pour le nouveau joueur sous le joueur remplacé, retirer l'ancien joueur de l'ordre futur et retirer l'ancien joueur des assignations défensives futures.
- Si un retrait ou une désactivation crée une manche future avec moins de 6 positions assignées, l'application doit offrir un chemin clair pour corriger l'alignement. Les corrections possibles incluent une suggestion automatique pour insérer un joueur du banc, une action manuelle rapide depuis une cellule `BANC`, ou une ligne/zone indiquant les positions non assignées.
- Dans `Alignement`, les manches défensives futures incomplètes doivent être signalées directement au-dessus du tableau. L'entraîneur peut cliquer une cellule `BANC` mise en évidence pour assigner une position manquante, ou utiliser une action globale qui remplit automatiquement les positions possibles sans toucher aux demi-manches déjà complétées.
- Les suggestions proposées en cas de problème doivent viser seulement les demi-manches non jouées.
- Au démarrage du match, l'application bloque si le nombre de joueurs actifs n'est pas entre 6 et 12. Si le nombre de joueurs est valide mais que l'alignement est incomplet ou que des règles ne sont pas respectées, l'application doit avertir clairement et permettre à l'entraîneur de continuer après confirmation.
- Créer une équipe exemple pendant un match débuté est interdit; l'entraîneur doit réinitialiser ou recommencer le match avant de remplacer les données d'équipe.

## Exports et partage

- Les exports parents doivent rester lisibles avec beaucoup de joueurs et avec des noms longs. La mise en page doit s'adapter au contenu au lieu de couper ou de superposer les textes.
- Le partage `Programme` correspond à l'image parents.
- Le partage `Banc` est un tableau imprimable simple avec une ligne par joueur et deux sous-colonnes par manche: `🏏` pour le rang de frappe local `1` à `6`, et `🧤` pour la position défensive. Les présences au banc y sont affichées avec `👏 Applaudi`, `🎉 Encourage` ou `🎵 Chante` au lieu du mot `BANC`. Quand la frappe fixe est désactivée, les cellules `🏏` restent vides pour annotation manuscrite.
- Le partage `Texte` est un format brut compact. En frappe fixe, il n'affiche pas l'ordre général et liste les frappeurs de chaque demi-manche offensive un par un. En frappe variable, il garde l'ordre général, mais n'ajoute pas de rappel `Suivre l'ordre au banc`.
- L'image parents affiche la date, l'heure en format 24h et le lieu dans l'en-tête.
- L'image parents est organisée chronologiquement par manche et doit viser une impression lisible sur une page lettre. Chaque carte de manche affiche les deux demi-manches dans l'ordre réel du match avec une colonne d'icône seulement: `🏏` pour l'attaque et `🧤` pour la défense.
- En mode `Frappe fixe`, l'image parents affiche les frappeurs dans la demi-manche offensive avec une numérotation locale `1` à `6` pour chaque manche, sans afficher l'ordre général séparé.
- Quand `Frappe fixe` est désactivé, l'image parents affiche l'ordre général des frappeurs sur deux colonnes, puis chaque carte de manche indique seulement la demi-manche offensive sans liste de frappeurs.
- La demi-manche défensive affiche les 6 positions avec une grille compacte dans l'ordre `L1`, `L2`, `AC`, puis `1B`, `2B`, `3B`; `L1` et `L2` gardent le casque à côté du nom du lanceur.
- Les noms de fichiers d'exports parents utilisent le format `YYYY-MM-DD_equipe_adversaire.png`. Si la date manque, le préfixe est `match`; si l'adversaire manque, le nom contient seulement la date et notre équipe.
- Dans la vue spectateur, les deux lanceurs doivent être affichés sur deux lignes séparées afin que la défensive présente 6 éléments visuels, comme l'ordre de frappe.
- La vue spectateur doit utiliser la même palette visuelle que le reste du site.
- Le partage externe du mode spectateur cible un futur lien en ligne en lecture seule avec informations limitées, plutôt qu'un fichier HTML autonome.
- Le partage externe du mode spectateur est maintenant conçu comme un lien Firestore `#public/{publicId}`. Il publie une projection limitée du match courant, en lecture seule, et peut se mettre à jour en direct pendant le match.
- Le lien public peut être protégé par un mot de passe optionnel. Dans ce cas, la projection publique est chiffrée côté client avant sauvegarde dans Firestore; le mot de passe n'est pas stocké.
- La synchronisation en ligne sert au match courant seulement. Les archives restent locales et figées; archiver un match retire le document cloud éditable et le partage public quand c'est possible.
- L'export `Texte` doit afficher le texte dans une zone éditable avant la copie. Les modifications manuelles ne sont pas sauvegardées dans le match; elles servent seulement à ajuster l'impression de dernière minute.
- Les numéros de chandail, quand ils existent, sont affichés dans l'alignement avec une pastille près du nom et inclus dans `Programme`, `Banc`, `Texte`, `Spectateur` et les exports régénérés depuis les archives.
- Une évolution du `Programme` pourrait ajouter une première page style poster avec équipes, date, heure, joueurs présents, numéros et visuel baseball. Si cette évolution dépasse une page image fiable, un export PDF multi-page pourrait être plus approprié.
- Une future vue fan joueur pourrait montrer, pour un seul joueur, les manches où il frappe, défend ou encourage. Cette vue est probablement destinée au partage en ligne ou à une extension de `Spectateur`.

## Archives

- La page `Archives` liste les matchs archivés du plus récent au plus ancien.
- Chaque archive est en lecture seule et peut être consultée, refermée ou supprimée manuellement avec confirmation. Les détails ne devraient pas être ouverts par défaut.
- Les archives complètes conservent les métadonnées du match, les joueurs figés, l'ordre, la frappe fixe, les manches, les positions, les snapshots de frappe et les demi-manches complétées.
- Les exports `Programme`, `Banc` et `Texte` peuvent être régénérés depuis une archive complète, mais les fichiers ou rendus d'export ne sont pas stockés dans l'archive.
- Les anciennes archives sommaires restent consultables comme résumé, sans exports complets.

## Questions ouvertes

- Firestore devra-t-il publier seulement une projection publique limitée ou aussi une archive privée complète synchronisée?
