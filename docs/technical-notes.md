# Notes techniques

## Identité et domaine

L'application porte la marque `CoachRally` et son URL canonique est `https://coachrally.app/`. GitHub Pages sert le domaine personnalisé grâce au fichier `CNAME`, copié dans l'artifact statique par le workflow de déploiement. Les clés de stockage qui commencent par `rallye_cap_` restent inchangées afin de préserver les données locales existantes.

## État

L'état applicatif est sauvegardé dans `localStorage` avec la clé `rallye_cap_qc_v5`. Le modèle courant stocke `teams`, `activeTeamId`, `matches`, `activeMatchId` et `route`; les champs de formulaire historiques (`team`, `players`, `cloud`, etc.) sont reconstruits comme alias runtime de l'équipe ou du match actif et ne sont plus la source persistée.

## Sauvegarde Firebase optionnelle

Firebase est une couche optionnelle au-dessus du stockage local. L'application doit continuer de fonctionner hors ligne et sans configuration Firebase. Pour activer la synchronisation, créer un fichier `firebase-config.js` basé sur `firebase-config.example.js`, puis configurer Firebase Authentication et Firestore dans le projet Firebase.

En production GitHub Pages, `firebase-config.js` est généré par le workflow `.github/workflows/pages.yml` à partir des secrets GitHub Actions. Le fichier local `firebase-config.js` reste ignoré par Git. Le workflow copie seulement les fichiers statiques nécessaires dans `dist`, écrit la configuration Firebase générée, puis publie l'artifact avec GitHub Pages.

La première passe utilise:

- Firebase Authentication avec courriel/mot de passe et Google;
- Firestore pour synchroniser les matchs explicitement mis en ligne;
- App Check optionnel avec reCAPTCHA v3 quand `appCheckSiteKey` est configuré;
- `users/{uid}/matches/{matchId}` pour le document privé éditable par l'entraîneur connecté;
- `publicMatches/{publicId}` pour la projection spectateur publique en lecture seule;
- `publicTeams/{teamPublicId}` pour la liste publique permanente des matchs publiés d'une équipe;
- une liste `Matchs` pour ouvrir ou supprimer les matchs cloud du compte connecté;
- un lien `#public/{publicId}` pour la vue spectateur live.
- un lien `#banc/{publicId}` pour la vue Banc des jeunes automatique et sans contrôles;
- un lien `#fans/{teamPublicId}` pour la liste publique des matchs publiés d'une équipe.

App Check est initialisé avant Auth et Firestore quand `firebase-config.js` contient `appCheckSiteKey`, `recaptchaV3SiteKey` ou `appCheck.siteKey`. Le rafraîchissement automatique des tokens est activé. En développement local, `appCheckDebugToken` doit être utilisé pour éviter que les appels `localhost` soient classés comme non vérifiés.

Procédure de debug App Check:

1. Ajouter temporairement `appCheckDebugToken: true` dans `firebase-config.js`, avec une clé `appCheckSiteKey` valide.
2. Ouvrir l'app avec la console du navigateur visible et déclencher Firebase, par exemple en se connectant au cloud.
3. Copier le jeton affiché sous la forme `AppCheck debug token`.
4. L'ajouter dans Firebase Console > App Check > app Web > Manage debug tokens.
5. Remplacer ensuite `true` par le jeton enregistré, par exemple `appCheckDebugToken: "..."`.

Les métriques App Check peuvent contenir des requêtes anciennes provenant d'onglets ouverts ou d'une version non rechargée de l'app. Les catégories `invalid requests` et `outdated client requests` doivent être surveillées avant production. L'enforcement App Check côté Firebase ne devrait être activé qu'après avoir vérifié que les clients légitimes sont validés, sinon Firestore et Authentication peuvent être bloqués pour les utilisateurs.

Les archives sont des matchs `archived` en lecture seule. Elles peuvent rester locales ou exister en ligne, mais les règles Firestore empêchent leur modification future tout en gardant la suppression permise au propriétaire.

Les équipes privées vivent dans `users/{uid}/teams/{teamId}` et contiennent le nom, le bassin permanent, les références publiques non secrètes, `updatedAtMs` et `updatedByClientId`. Elles sont chargées avant les matchs afin de préserver le même `teamId` sur tous les appareils. Les conflits utilisent la règle de la dernière modification gagnante; une équipe distante plus récente remplace le profil local, sans modifier les snapshots des matchs existants.

Les documents privés de match contiennent le `payload` complet pour l'édition, plus des métadonnées top-level (`teamId`, `team`, `opp`, `date`, `time`, `place`, `status`, `started`, `completed`, `currentIndex`, `currentLabel`, `publicId`, `updatedAtMs`) afin d'afficher `Matchs` sans dépendre d'un lien d'édition. L'app filtre les matchs locaux et cloud sur le `teamId` de l'équipe active.

Les documents privés incluent aussi `status` au niveau racine. Les règles Firestore interdisent la modification d'un match déjà archivé (`status == archived` ou `payload.status == archived`), mais gardent la suppression permise au propriétaire.

L'action globale `Réinitialiser` efface l'état local et tente aussi de supprimer le document cloud éditable ainsi que le lien spectateur public courant si l'utilisateur est connecté et que le module Firebase est chargé. La suppression cloud est opportuniste: l'état local est réinitialisé même si le réseau ou Firebase échoue.

Le partage public peut être publié sans mot de passe ou avec un mot de passe optionnel. Quand un mot de passe est fourni, la projection publique est chiffrée côté client avec WebCrypto avant d'être écrite dans Firestore. Le mot de passe n'est pas sauvegardé dans Firestore. Cette approche garde l'app statique et compatible GitHub Pages, mais un mot de passe faible peut être attaqué hors ligne si quelqu'un récupère le document chiffré.

Le partage public d'équipe est un document `publicTeams/{teamPublicId}` qui contient le nom public de l'équipe active, une projection limitée de son bassin permanent (`players` avec `playerId`, `name`, `number`, `label`), une liste de résumés de matchs publiés pour cette même équipe et l'indicateur `passwordProtected` de chaque match. L'identifiant se gère depuis la modale `Lien d'équipe` de la carte équipe. Une création utilise une transaction Firestore et échoue dès que le document ciblé existe, même s'il appartient au même compte; les mises à jour et suppressions utilisent exclusivement le `publicId` appartenant à l'équipe active, jamais une référence cloud globale héritée d'une autre équipe. `publicSlug` ne doit pas faire basculer la modale dans l'état actif avant le succès de l'écriture. Le chargement impose aussi l'unicité locale des `publicId`: si un état corrompu associe le même lien à plusieurs équipes, seule la première conserve la référence. Il peut être publié sans mot de passe ou chiffré avec le même mécanisme WebCrypto que `publicMatches`. Les détails d'un match restent servis par son document `publicMatches/{publicId}`. La liste d'équipe est mise à jour quand un lien Match est publié, retiré, sauvegardé ou quand un match publié est terminé, ainsi qu'après les changements de nom d'équipe, de joueurs ou de numéros quand le lien d'équipe est actif. Retirer le document d'équipe désactive seulement l'URL permanente; les liens de match déjà publiés restent actifs jusqu'à leur retrait individuel.

L'app peut encore lister les documents `publicTeams` dont `ownerUid` correspond au compte connecté pour des besoins internes, mais la modale `Lien d'équipe` n'affiche plus cette liste. Elle affiche seulement le lien actif local avec `Copier` / `Retirer`, ou les champs de création si aucun lien n'est actif.

Les favoris des fans restent privés au navigateur. La clé `localStorage` est `rallye_cap_public_favorite_players:{teamPublicId}` et contient un tableau JSON de `playerId`; le contexte `global` sert de repli quand un match public n'a pas encore de `teamPublicId`.

Bug UX connu: Chrome peut interpréter le champ de mot de passe du partage spectateur comme un formulaire de connexion et proposer d'enregistrer le mot de passe en utilisant un autre champ de la page, comme l'endroit du match, comme nom d'utilisateur. Ce n'est pas une authentification Firebase et le mot de passe n'est pas stocké dans Firestore, mais l'expérience est confuse. À corriger en priorité dans l'UI de partage avec des attributs `autocomplete` plus précis, des noms de champs moins ambigus, une séparation claire entre formulaire de match et mot de passe public, ou une interaction qui ne ressemble pas à un formulaire de connexion classique.

La politique de conflit v1 est volontairement simple: dernière sauvegarde gagne. Si une version distante plus récente est reçue, l'application avertit l'utilisateur et remplace la copie locale.

Le document privé cloud contient le match complet pour permettre l'édition sur un autre appareil avant ou pendant le match. La projection publique expose seulement le contexte à `draft`; à `ready`, elle expose l’alignement complet uniquement si le lien Match existe déjà; à `active`, elle ajoute la progression courante. Aucune transition ne crée automatiquement un lien public.

La projection publique contient `publicStage`, `ready`, `programme`, `fanMessage`, `currentIndex` et `phases`. À `ready`, `Programme` et toutes les phases sont consultables, mais aucune phase n’est marquée courante. Une invalidation repasse à `draft` et retire les joueurs, frappeurs et défenses de la projection suivante.

La route Banc lit exactement le même document `publicMatches/{publicId}` et partage la clé de session du mot de passe spectateur. `bench-view.js` transforme purement la projection en modèle `waiting`, `playing` ou `final`, calcule la prochaine demi-manche et deux listes distinctes de joueurs au banc. Une mission unique est choisie déterministement par index de demi-manche et partagée par tous les joueurs de cette liste. La défense utilise une grille textuelle adaptative et les mêmes caractères `🧢` et `🧤` que les autres vues. Firestore conserve naturellement le dernier snapshot pendant une coupure; les événements `online` et `offline` mettent seulement à jour le point d'état, dont le libellé demeure accessible sans être visible.

Le champ `fanMessage` est une courte note destinée aux fans. Le rendu HTML utilise un mini-Markdown interne sans dépendance: le texte est échappé avant transformation, puis seuls `**gras**`, `*italique*`, les retours de ligne et les listes `- item` sont reconnus. L'export SVG `Programme` convertit ce mini-Markdown en lignes de texte lisibles et augmente la hauteur de l'image au besoin.

Les diagrammes d'architecture et de flux sont dans `docs/firebase-firestore-sync.md`.

Champs principaux:

- `team`, `opp`, `date`, `place`
- `time`: heure du match courant, optionnelle
- `fanMessage`: message optionnel aux fans, limité à 300 caractères
- Équipe: `fanMessage` public de 300 caractères, inclus dans les payloads local, privé et `#fans`
- `side`: `visiteur` ou `locale`
- `fixed`: frappe fixe activée ou non
- `innings`: nombre de manches
- `players`: joueurs enregistrés
- `order`: ordre des joueurs par identifiant
- `battingOrders`: snapshots d'ordre au bâton par demie-manche offensive barrée, indexés sous la forme `inning:debut` ou `inning:fin`
- `schedule`: positions par manche
- `started`: match explicitement débuté dans l'état actuel; à remplacer par une progression de demi-manche plus explicite
- `locks.innings`: champ hérité du modèle de progression précédent; il ne doit plus guider de nouvelle logique. La source courante est `locks.halves`.
- `locks.halves`: stockage interne transitoire des demi-manches complétées, indexées sous la forme `inning:debut` ou `inning:fin`
- `archives`: liste locale des matchs archivés, conservée dans le même état `localStorage`. Les nouvelles archives utilisent `schemaVersion: 1` et stockent un snapshot complet du match.
- `route`: vue active

Quand le match est commencé, l'action `Optimiser` est désactivée. Les demi-manches complétées ne doivent pas être recalculées automatiquement. Les changements de joueurs pendant le match doivent viser les demi-manches futures et laisser les corrections ambiguës à l'entraîneur.

Fin de match: quand toutes les demi-manches sont complétées, l'application propose d'archiver ou non le match, conserve l'équipe et le bassin de joueurs, puis retourne à `Accueil`. Si le match est archivé, l'app crée un snapshot en lecture seule indépendant du bassin permanent.

Le tableau principal rend les manches en deux demi-manches. Les assignations défensives restent stockées par manche dans `schedule`, mais l'édition défensive est bloquée quand la demi-manche défensive correspondante est complétée. Les rangs de frappe affichés pour une demi-manche offensive complétée utilisent `battingOrders` pour éviter de réécrire l'historique quand l'ordre futur change.

Avant le début du match, les lignes du tableau suivent `order` et le glisser-déposer de la première colonne déplace la ligne complète. Quand le match est débuté, le rendu stabilise les lignes par joueur enregistré actif, et `order` sert seulement de rang courant. `generateAll()` conserve l'ordre de frappe courant et recalcule seulement les positions défensives.

Cible de modèle de données: séparer le bassin permanent de joueurs du match courant. Le bassin permanent devrait contenir le nom de notre équipe et les joueurs réutilisables entre matchs. Le match courant devrait contenir l'adversaire, la date, l'heure, l'endroit, le côté local/visiteur, les présences, l'ordre de frappe, les positions, la progression et les exports. Cette séparation doit rester compatible avec une SPA locale hors ligne et ne doit pas imposer une nouvelle étape numérotée dans le workflow.

## Refactor workflow cible

Le workflow cible sépare la préparation et la gestion active. Les routes principales sont:

- `#match`: édition des métadonnées seulement tant que `started` est faux;
- `#joueurs`: présence/absence des joueurs du match tant que `started` est faux;
- `#alignement`: édition de l'alignement avant match, validations, suggestions et confirmation `ready`; lecture seule après le départ;
- `#accueil`: porte d'entrée contextuelle selon l'état local, gestion hors workflow du nom de notre équipe et du bassin de joueurs;
- `#matchs`: tableaux des matchs locaux et cloud, incluant les matchs archivés en lecture seule;
- `#jouer`: vue coach locale complète ou simple, dérivée du même état;

`#alignement` ne démarre jamais le match. `Prêt à jouer` valide et ouvre `#jouer`, seule route autorisée à démarrer et avancer. La vue complète déplace le même nœud de tableau; la vue simple masque le workflow numéroté et les métadonnées détaillées sans dupliquer la logique.

Le menu du haut est un menu global unique qui regroupe `Accueil`, `Connexion` et `Réinitialiser`. `Matchs` reste une page séparée accessible depuis l’accueil. Les étapes `Match`, `Joueurs`, `Alignement` et `Jouer` restent visibles dans le contenu via le workflow numéroté, avec une action non numérotée `Partager`. La Vue simple masque temporairement ce workflow pour réduire la densité au banc.

Pendant le développement, les routes désuètes ne sont pas maintenues. `#equipe`, `#mesmatchs` et `#partager` ne sont pas des alias: comme toute route inconnue, elles retournent à `#accueil`.

Les routes publiques `#public/{publicId}` et `#fans/{teamPublicId}` utilisent seules `view-spectateur` et la classe `spectatorRoute`. La vue locale `#jouer` ne partage aucune commande avec les spectateurs. Le nœud DOM du tableau complet est déplacé entre les montages d’`Alignement` et de `Jouer`, ce qui évite de dupliquer son rendu et ses gestionnaires. La vue simple réutilise les rendus des frappeurs et défenseurs et les validations existantes. Son banc est dérivé de `active()`: les absents sont exclus, puis les joueurs affichés dans la demi-manche consultée sont retirés selon les positions défensives ou les frappeurs de la manche.

Les objets de suggestion portent explicitement leur index `inning`. La vue coach filtre sur cet index et sur l’état de la demi-manche défensive avant l’affichage, puis `applySuggestion` revérifie le verrouillage au moment de l’application. Cette double vérification empêche une suggestion affichée avant une progression d’altérer ensuite l’historique joué.

Le libellé durable pour l'action destructive globale est `Réinitialiser`. Sa confirmation est: `Toutes tes équipes, joueurs et matchs seront supprimés pour toujours. Continuer?`

Les modales `Partager le match` et `Lien d'équipe` ne permettent pas de saisir un identifiant public ou un mot de passe tant que `cloud.user` est absent. Elles affichent alors un bouton primaire vert `Connexion` qui réutilise le flux `cloudLoginModal`. Quand l'utilisateur est connecté, `Créer le lien` devient l'action primaire; copier et fermer restent secondaires, et retirer un lien reste destructif. `Lien d'équipe` exige un identifiant public non vide à la création et ne rend plus de section `Lien permanent` ni de liste `publicTeams`.

La création depuis `Lien d'équipe` fournit un gestionnaire d'erreur à `savePublicTeam()`. Les erreurs sont rendues dans la modale existante plutôt que par `modal()`, afin de ne pas remplacer le formulaire. Les champs de création restent temporaires jusqu'au succès de la transaction.

La modale `Partager le match` sépare trois responsabilités. `Lien Match` gère directement le document public `#public/{publicId}` et continue de le mettre à jour depuis la copie locale, même sans sauvegarde privée. `Gérer en ligne` contrôle la synchronisation privée du match et exige que le contrôle équivalent de l'équipe soit actif; sinon, une erreur ouvre la modale `Lien d'équipe`. Cette modale contient désormais deux sections distinctes, `Lien public` et `Gérer en ligne`, sur le même modèle que le partage d'un match. Passer un match à `Non` retire seulement son document privé. Passer une équipe à `Non` retire son document privé et ceux de ses matchs, sans retirer les liens publics. `Exports` reste hors cloud et liste `Programme`, `Banc` et `Texte` avec leur description sous le titre.

Les routes `#fans/{id}` et `#public/{id}` suspendent l'écoute du document privé du coach et n'affichent donc pas `Version distante reçue`. Leurs abonnements publics restent actifs en temps réel. La vue `#jouer` conserve l’écoute privée comme `#match`, `#joueurs` et `#alignement`.

Le modèle interne utilise encore `started` et `locks.halves`; il devrait éventuellement être remplacé par un index monotone de demi-manche complétée ou courante. La route officielle `#jouer` exploite cet état pour verrouiller l’historique, mettre la demi-manche courante en évidence et laisser les demi-manches futures modifiables.

Le statut de match accepte `draft`, `ready`, `active`, `completed` et `archived`. `ready` est persistant et revient à `draft` dès qu’une mutation de préparation invalide l’alignement. Le choix `Vue complète` / `Vue simple` de `Jouer` reste uniquement en mémoire. Les routes retirées ne disposent d’aucune redirection ou logique de compatibilité.

État stabilisé: l'espace hors workflow de l'équipe vit dans `#accueil`. Le stockage utilise `teamProfile`, `roster`, `matches` et `activeMatchId` comme structure officielle locale.

La fermeture de match est maintenant explicite à la fin de la dernière demi-manche. Les archives sont des matchs v5 avec le statut `archived`; elles conservent les métadonnées du match, frappe fixe, manches, joueurs figés, ordre, positions, snapshots de frappe et demi-manches complétées.

Les exports `Programme`, `Banc` et `Texte` ne sont pas stockés dans l'archive. Ils sont régénérés à partir du snapshot figé via un état temporaire en lecture seule, puis l'état courant est restauré.

Les codes QR des exports sont générés entièrement côté client par `vendor/qrcode.js` (`qrcode-generator` 1.4.4, licence MIT). Aucune URL n'est transmise à un service de génération. La destination suit cet ordre: lien permanent `#fans` de l'équipe, lien `#public` du match, puis page d'accueil de CoachRally.

Dette restante: le refactor de workflow a été livré surtout au niveau navigation/rendu. La logique demeure fortement centralisée dans `app.js`, avec des conditions dispersées dans les fonctions de rendu et d'interaction. L'extraction en modules testables reste à faire.

Pour limiter la complexité, les actions en cours de match devraient être des commandes explicites sur l'état:

- avancer à la prochaine demi-manche;
- ne pas reculer dans l'interface principale;
- enlever un joueur pour le futur;
- remplacer un joueur pour le futur;
- ajouter un joueur pour le futur.

Ces commandes sont exposées dans `Jouer`. Les changements de joueurs demandent la demi-manche d'effet, verrouillent implicitement les demi-manches précédentes comme jouées, puis s’appliquent seulement aux demi-manches futures. Les suggestions automatiques filtrent les demi-manches déjà jouées.

## Moteur d'alignement

Le moteur actuel choisit 6 défenseurs par manche, puis assigne les positions. Il pénalise notamment:

- les joueurs au banc deux manches de suite;
- les joueurs déjà très utilisés;
- les lanceurs qui étaient lanceurs à la manche précédente;
- les répétitions au premier but.

Ces trois contraintes doivent être considérées comme obligatoires dans l'évolution du moteur:

- `1B` au maximum une fois par joueur;
- aucune présence de lanceur deux manches consécutives, que ce soit `L1` ou `L2`;
- aucune présence au banc deux manches consécutives.

Avec 4 manches et 6 à 12 joueurs actifs, le moteur devrait normalement trouver une solution valide. Les scores d'équité doivent servir à choisir entre plusieurs solutions valides, pas à accepter une violation obligatoire.

La prochaine amélioration structurelle recommandée est d'extraire cette logique hors du DOM, par exemple dans un module pur qui reçoit un état normalisé et retourne un horaire, des validations et des statistiques.

## Encodage

Standard attendu:

- fichiers texte en UTF-8;
- HTML avec `<meta charset="utf-8">`;
- français du Québec conservé tel quel;
- pas de conversion en ASCII;
- pas de mélange Windows-1252/UTF-8.

Symptômes à corriger:

- `Ã©` au lieu de `é`;
- `Ã¨` au lieu de `è`;
- `Ã ` au lieu de `à`;
- `â€™` au lieu de `'` ou `’`;
- `âœ”` au lieu de `✔`;
- `âš ` au lieu de `⚠`.

## Tests à ajouter

Tests unitaires prioritaires:

- normalisation de l'état sauvegardé;
- rotation des frappeurs en frappe fixe;
- génération avec 6, 7, 10 et 12 joueurs;
- absence de banc deux manches consécutives;
- absence de lanceur deux manches consécutives;
- aucun joueur à `1B` plus d'une fois;
- génération qui respecte toutes les règles obligatoires avec 4 manches et 6 à 12 joueurs;
- robustesse quand un joueur est désactivé après génération.

Tests navigateur prioritaires:

- chargement de l'exemple;
- nouveaux matchs créés sans date ni heure par défaut;
- ajout de joueurs;
- génération et régénération;
- modification manuelle par glisser-déposer;
- navigation cible `Accueil`, `Matchs`, `Match`, `Joueurs`, `Alignement`, `Spectateur`;
- démarrage explicite du match;
- blocage du démarrage quand le nombre de joueurs actifs n'est pas entre 6 et 12;
- avertissement au démarrage pour les autres problèmes d'alignement ou de règles, avec confirmation pour continuer;
- progression vers la prochaine demi-manche;
- absence de retour arrière dans l'interface principale;
- ajout d'un joueur en match débuté;
- remplacement d'un joueur en match débuté;
- retrait d'un joueur actif avec seulement 6 joueurs disponibles;
- lien spectateur en ligne lecture seule à définir plus tard.
- fin de match, archive locale complète en lecture seule et retour à l'accueil avec les mêmes joueurs;
- export parents avec beaucoup de joueurs et noms longs;
- aperçu modifiable de l'export `Texte`;
- vue spectateur avec lanceurs affichés sur deux lignes.

## Direction d'architecture

Objectif progressif:

- garder une version statique simple;
- séparer les responsabilités;
- éviter un grand changement de framework tant que les règles métier ne sont pas testées.

Découpage actuel:

- `index.html`: structure HTML et points de montage;
- `styles.css`: styles de l'application;
- `app.js`: état, moteur d'alignement, rendu, exports et interactions.
- `rules.js`: validations pures des règles obligatoires, nettoyage des positions, résumé des violations d'horaire, statistiques/équité et garde-fous métier simples comme la validation de démarrage. `startReadiness()` refuse aussi un horaire vide pour éviter de débuter un match sans alignement réel;
- `tests/rules.html`: tests navigateur simples pour les règles obligatoires.

Découpage recommandé:

- `src/domain/lineup.js`: génération, validations, statistiques;
- `src/domain/state.js`: normalisation de l'état;
- `src/ui/render.js`: rendu DOM;
- `src/ui/exports.js`: exports `Banc`, `Programme` et `Texte`;
- `tests/`: cas métier.

## État actuel v5 multi-match

Le modèle officiel courant est multi-match et local-first. Jusqu'à la mise en production, l'app ne supporte aucun vieux modèle de données. Si aucune donnée `rallye_cap_qc_v5` valide n'existe, elle démarre vide.

Décision durable pendant la phase de développement:

- ne pas ajouter de migration depuis `rallye_cap_qc_v4` ou toute autre ancienne clé;
- ne pas ajouter de logique de compatibilité pour lire, réparer ou convertir d'anciens payloads locaux ou cloud;
- corriger directement le modèle courant plutôt que de masquer les problèmes avec des fallbacks;
- réévaluer une vraie stratégie de migration seulement au moment d'une version de production avec utilisateurs réels.

Structure persistée sous `rallye_cap_qc_v5`:

- `teamProfile`: nom de notre équipe, `publicSlug` souhaité, `publicId` actif du lien permanent `#fans/{teamPublicId}` et mot de passe local optionnel du lien d'équipe;
- `roster`: bassin permanent de joueurs, indépendant des matchs;
- `matches`: liste locale de matchs;
- `activeMatchId`: match ouvert dans le workflow.

Chaque match contient ses infos, joueurs du match, ordre, positions, progression, statut et références cloud. Les statuts sont `draft`, `active`, `completed` et `archived`.

`Matchs` est la vue centrale. Elle affiche un tableau triable unique qui combine les matchs locaux et les matchs cloud du compte connecté, incluant les archives. Les colonnes sont `Adversaire`, `Date / heure`, `Endroit`, `Statut`, `Modifié` et `Actions`. Les doublons sont fusionnés par `cloud.matchId`. Un match seulement en ligne est importé localement quand l'utilisateur clique la ligne.

La page `Archives` séparée est retirée. Une archive est un match avec le statut `archived`; elle peut être ouverte dans les vues existantes avec les actions de modification désactivées.

## Stratégie de tests automatisés

Playwright est une dépendance de développement seulement. Il lance un petit serveur HTTP local qui sert directement les fichiers statiques, sans transformer l'application ni ajouter de dépendance au déploiement. La première matrice couvre Chromium en format bureau et mobile.

Les modules navigateur purs sont chargés dans un contexte `vm` par les tests Node. Les anciennes pages HTML de tests restent disponibles pour le diagnostic manuel. `npm test` exécute les tests Node, le smoke test historique, puis les parcours Playwright. Les scénarios E2E isolent `localStorage` et utilisent une configuration Firebase vide; ils ne doivent dépendre ni d'un compte ni du réseau.

La CI `.github/workflows/tests.yml` installe uniquement Chromium et exécute la même commande. En cas d'échec, Playwright conserve la trace, une capture d'écran et la vidéo dans `test-results/`; la CI téléverse ce dossier comme artifact pendant 7 jours. Ces diagnostics restent ignorés par Git. Les tests d'impression, de téléchargement, de presse-papiers et de Firebase seront ajoutés séparément avec des doubles contrôlés.
