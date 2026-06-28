# Firebase / Firestore: synchronisation et partage

Ce document décrit la cible de la première intégration Firebase. L'application reste locale par défaut; Firebase ajoute une sauvegarde optionnelle des matchs mis en ligne, une édition mobile et un mode spectateur public live.

## Vue d'ensemble

```mermaid
flowchart LR
  Coach["Entraîneur<br/>ordinateur ou mobile"] --> App["SPA Rallye-Cap<br/>GitHub Pages / local"]
  App --> Local["localStorage<br/>source locale immédiate"]
  App --> Auth["Firebase Auth<br/>courriel + Google"]
  App --> Private["Firestore privé<br/>users/{uid}/matches/{matchId}"]
  App --> Public["Firestore public<br/>publicMatches/{publicId}"]
  Parent["Parent / spectateur"] --> PublicView["#public/{publicId}<br/>vue lecture seule"]
  PublicView --> Public
```

Principes:

- `localStorage` demeure la sauvegarde immédiate et hors ligne.
- Firestore synchronise seulement les matchs explicitement mis en ligne.
- Les archives sont des matchs `archived` en lecture seule; elles peuvent rester locales ou exister en ligne, mais ne doivent plus être modifiées.
- Le spectateur public lit une projection limitée, pas l'état complet du match.
- Un mot de passe public optionnel chiffre la projection côté client.

## Modèle Firestore

```mermaid
erDiagram
  USER ||--o{ PRIVATE_MATCH : owns
  PRIVATE_MATCH ||--o| PUBLIC_MATCH : publishes

  USER {
    string uid
    string email
  }

  PRIVATE_MATCH {
    string ownerUid
    number schemaVersion
    string status
    number updatedAtMs
    object payload
  }

  PUBLIC_MATCH {
    string ownerUid
    string matchId
    number schemaVersion
    number updatedAtMs
    boolean passwordProtected
    object payload
    object encryptedPayload
  }
```

Chemins:

```text
users/{uid}/teams/{teamId}
users/{uid}/matches/{matchId}
publicMatches/{publicId}
```

L'équipe privée contient son nom, son bassin permanent et ses références publiques non secrètes. Elle possède le même `teamId` sur tous les appareils et doit être gérée en ligne avant qu'un de ses matchs puisse l'être. Les équipes sont chargées avant les matchs lors de la connexion.

Le document privé contient le match complet pour l'édition, incluant `status` au niveau racine et dans `payload.status`. Le document public contient seulement ce que la vue spectateur doit afficher.

## Sauvegarde d'un match

```mermaid
sequenceDiagram
  participant Coach as Entraîneur
  participant App as App locale
  participant LS as localStorage
  participant Auth as Firebase Auth
  participant FS as Firestore privé

  Coach->>App: Modifie l'alignement
  App->>LS: Sauvegarde locale immédiate
  App->>Auth: Vérifie l'utilisateur connecté
  alt Match déjà lié au cloud
    App->>FS: Sauvegarde debounced du payload
    FS-->>App: updatedAtMs
    App->>App: Statut synchronisé
  else Local seulement
    App->>App: Aucun appel cloud automatique
  end
```

La première sauvegarde en ligne crée ou réutilise `matchId`. Ensuite, les changements locaux peuvent être poussés automatiquement avec un délai court.

## Ouverture sur mobile

```mermaid
sequenceDiagram
  participant Desktop as App ordinateur
  participant Mobile as App mobile
  participant Auth as Firebase Auth
  participant FS as Firestore privé

  Desktop->>FS: Sauvegarde équipe puis match privés
  Mobile->>Auth: Connexion courriel ou Google
  Auth-->>Mobile: uid
  Mobile->>FS: Liste users/{uid}/teams
  FS-->>Mobile: Équipes privées
  Mobile->>FS: Liste users/{uid}/matches
  FS-->>Mobile: Mes matchs
  Mobile->>FS: Ouvre users/{uid}/matches/{matchId}
  FS-->>Mobile: Payload du match
  Mobile->>Mobile: Remplace la copie locale après confirmation/chargement
```

En v1, l'entraîneur reprend un match en ligne via `Mes matchs` après connexion. Les rôles multi-entraîneurs ou invitations sont hors portée.

## Spectateur public live

```mermaid
sequenceDiagram
  participant Coach as Entraîneur
  participant App as App entraîneur
  participant Public as publicMatches/{publicId}
  participant Fan as Spectateur

  Coach->>App: Publie le spectateur live
  App->>Public: Écrit la projection publique
  Fan->>Public: Ouvre #public/{publicId}
  Public-->>Fan: Projection initiale
  Coach->>App: Avance la demi-manche / ajuste une position
  App->>Public: Met à jour la projection
  Public-->>Fan: Mise à jour en temps réel
```

Le spectateur ne peut pas modifier le match. Il reçoit seulement la projection lecture seule.

## Mot de passe public optionnel

```mermaid
flowchart TD
  A["Projection spectateur"] --> B{"Mot de passe fourni?"}
  B -- Non --> C["Écrire payload public clair<br/>dans publicMatches/{publicId}"]
  B -- Oui --> D["Dériver une clé avec PBKDF2"]
  D --> E["Chiffrer JSON avec AES-GCM"]
  E --> F["Écrire salt + iv + ciphertext<br/>dans publicMatches/{publicId}"]
  G["Spectateur ouvre le lien"] --> H{"passwordProtected?"}
  H -- Non --> I["Afficher directement"]
  H -- Oui --> J["Demander le mot de passe"]
  J --> K["Déchiffrer côté navigateur"]
  K --> I
```

Le mot de passe n'est pas stocké dans Firestore. Le chiffrement protège le contenu public si le document est lu directement. Un mot de passe faible reste moins robuste, parce qu'un attaquant pourrait tenter de le deviner hors ligne à partir du contenu chiffré.

## Archivage

```mermaid
flowchart LR
  Current["Match courant"] --> Archive["Archive locale figée"]
  Current --> DeletePrivate["Supprimer le document privé cloud"]
  Current --> DeletePublic["Retirer le partage public"]
  Archive --> LocalOnly["Consultation locale lecture seule"]
```

Archiver un match le rend figé. Les changements futurs à l'équipe et aux joueurs ne modifient pas l'archive. Si le match archivé existe en ligne, les règles Firestore empêchent ses modifications futures tout en permettant sa suppression.

## Règles de sécurité

```mermaid
flowchart TD
  Request["Requête Firestore"] --> Path{"Chemin"}
  Path --> Private["users/{uid}/matches/{matchId}"]
  Path --> Public["publicMatches/{publicId}"]
  Private --> AuthCheck{"request.auth.uid == uid?"}
  AuthCheck -- Oui --> Archived{"Match déjà archivé?"}
  Archived -- Non --> AllowPrivate["Lecture/création/modification permise"]
  Archived -- Oui --> DeleteOnly["Suppression permise<br/>modification refusée"]
  AuthCheck -- Non --> DenyPrivate["Refus"]
  Public --> ReadPublic["Lecture publique permise"]
  Public --> WritePublic{"Écriture par ownerUid?"}
  WritePublic -- Oui --> AllowWrite["Écriture permise"]
  WritePublic -- Non --> DenyWrite["Refus"]
```

Les règles Firestore protègent les documents privés. Un match déjà archivé ne peut plus être modifié côté cloud, mais son propriétaire peut le supprimer. Le chiffrement côté client protège le contenu d'un partage public avec mot de passe.
