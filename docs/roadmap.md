# Roadmap

## Maintenant

- Vérifier que le moteur respecte les règles obligatoires avant les objectifs d'équité.
- Extraire la logique métier de `app.js` dans des modules testables.

## Prochaines fonctionnalités candidates

- Explorer Firebase/Firestore pour publier optionnellement un match avec un lien ou un QR code toujours à jour.
- Gérer les changements de dernière minute: absence, retrait en cours de match, ajout imprévu.
- Sauvegarder plusieurs matchs.
- Ajouter une archive des matchs passés.
- Importer et exporter une liste de joueurs.
- Dupliquer un match existant.
- Ajouter un écran de résumé avant impression.
- Ajouter une sortie texte très simple pour impression de dernière minute avec une mini imprimante via Funny Print.
- En mode attaque, afficher les lanceurs de la prochaine manche défensive si applicable.
- En mode défense, afficher les deux premiers frappeurs de la prochaine manche offensive si applicable.

## Préparation

La vue `Préparation` regroupe maintenant l'ancienne vue `Équipe` et l'ancienne vue `Ordre`.

À conserver:

- activation / désactivation temporaire d'un joueur sans suppression;
- suppression explicite d'un joueur;
- ordre manuel par glisser-déposer;
- mélange aléatoire.

Idée potentielle:

- permettre de revenir au dernier ordre manuel après un mélange aléatoire.

## Publication optionnelle en ligne

Firebase/Firestore est une avenue prometteuse pour publier un match spécifique tout en gardant l'application locale par défaut.

Modèle souhaité:

- local-first: rien n'est envoyé en ligne tant que l'entraîneur ne publie pas le match;
- publication explicite d'un seul match;
- lien ou QR code vers une version consultable;
- mise à jour du match publié quand l'entraîneur modifie l'alignement;
- données minimales: prénoms, numéros si disponibles, ordre, positions, infos de match;
- accès public seulement aux personnes qui ont le lien;
- vue parents en lecture seule avec informations limitées comme minimum;
- mode assistant modifiable à évaluer plus tard;
- possibilité de dépublier ou remplacer le lien plus tard.

Notes de coût:

- Firebase/Firestore offre un palier sans frais qui semble suffisant pour un prototype et une petite utilisation d'équipe.
- Les quotas et prix peuvent changer; vérifier la page officielle Firebase avant de dépendre du service.

Points à définir avant implémentation:

- format exact du document Firestore;
- règles de sécurité pour empêcher la modification non autorisée;
- stratégie `publicId` non devinable et `editToken` local;
- durée de conservation ou suppression manuelle;
- comportement hors ligne quand un match publié ne peut pas être synchronisé.

## Sortie texte pour mini imprimante

Ajouter un export texte minimal pour imprimer rapidement un alignement de dernière minute avec une petite imprimante et l'application Funny Print.

Objectifs:

- format texte brut, sans HTML;
- lisible sur papier étroit;
- priorité aux informations utiles en match;
- facile à copier dans une autre application.

Contenu probable:

- équipe, adversaire, date ou terrain si utile;
- ordre des frappeurs;
- défensive par manche;
- lanceurs clairement visibles;
- banc par manche;
- très peu de décoration.

## Changement de joueurs: idée future

L'application devrait éventuellement aider l'entraîneur à ajuster un match déjà préparé quand la liste réelle change juste avant ou pendant le match.

Cas à couvrir:

- absence de dernière minute d'un joueur prévu;
- ajout de dernière minute d'un joueur disponible;
- joueur qui quitte ou se blesse en cours de match;
- joueur présent qui n'était pas prévu au départ.

Comportement souhaité:

- conserver le plus possible l'alignement déjà ajusté manuellement;
- conserver les manches déjà jouées ou déjà confirmées;
- recalculer seulement les manches futures ou ce qui devient invalide;
- afficher clairement les impacts sur l'ordre des frappeurs, les positions, le banc et l'équité;
- permettre de revenir à la liste initiale si l'ajustement était temporaire.

Statuts possibles:

- actif;
- absent ou retiré du match;
- ajouté au match;
- inactif hors match.

Il n'est pas nécessaire de distinguer les raisons dans l'app. Un joueur prêté à l'autre équipe est traité comme absent ou retiré pour notre match. Un joueur emprunté ou présent sans être prévu est traité comme ajouté au match.

## Bugs et dettes connues

- Aucun test automatisé.
- Les exports peuvent diverger de l'affichage principal parce qu'ils reconstruisent leur propre HTML.
- Les comportements de presse-papiers et de fenêtres surgissantes varient selon le navigateur.
- `app.js` contient encore trop de responsabilités: état, moteur d'alignement, rendu, exports et interactions.

## Décisions à prendre

- Rester en app statique pure ou introduire un petit outil de build.
- Garder les caractères typographiques (`’`, `—`, `✔`) ou préférer une ponctuation plus simple en UTF-8.
- Définir le comportement exact quand un joueur est retiré après des ajustements manuels.
- Choisir une stratégie de tests navigateur.

## Décisions prises

- Les archives de matchs passés seront verrouillées en lecture seule. Elles servent à consulter l'historique, pas à modifier rétroactivement un alignement.
- L'archivage des matchs sera déclenché par une action manuelle, pas automatiquement.
- La publication en ligne doit au minimum supporter un mode parents en lecture seule avec informations limitées.
- Les exports et publications sont regroupés dans une section `Partager`.
- La vue terrain est retirée de l'expérience principale.

## Livré

- Documentation produit, technique, roadmap et notes pour agents.
- Documentation de la structure du site et des pistes d'optimisation UX.
- Découpage statique: `index.html`, `styles.css`, `app.js`.
- Section `Partager` séparée pour les exports.
- Retrait de la vue terrain de l'expérience principale.
- Fusion des vues `Équipe` et `Ordre` en une seule vue `Préparation`.
- Contrôles visibles pour ajouter ou retirer une manche dans l'écran d'alignement.
- Module `rules.js` pour valider les règles obligatoires.
- Base de tests navigateur dans `tests/rules.html`.
- Encodage UTF-8 documenté; les faux diagnostics causés par l'affichage PowerShell sont identifiés.
