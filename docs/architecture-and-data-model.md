# Rare Collectible Auction House — architecture and data model

This document summarizes how the NestJS backend is structured and how domain entities relate in PostgreSQL (TypeORM).

---

## 1. Entity–relationship diagram (ERD)

Core rule: **bids** belong to one **auction** and one **bidder** (**user**). An **auction** optionally points to a single row in **bids** for the current highest offer and (when ended) the winning bid—those are foreign keys on `auctions`, not separate tables.

```mermaid
erDiagram
  users {
    uuid id PK
    varchar email UK
    varchar password_hash
    user_role_enum role
    varchar display_name
    varchar contact_phone
    jsonb preferences_json
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }

  auctions {
    uuid id PK
    uuid seller_id FK
    varchar title
    text description
    auction_status_enum status
    timestamptz starts_at
    timestamptz ends_at
    numeric starting_price
    uuid current_high_bid_id FK
    uuid winning_bid_id FK
    boolean is_deleted
    timestamptz created_at
    timestamptz updated_at
  }

  auction_images {
    uuid id PK
    uuid auction_id FK
    varchar url
    int sort_order
    timestamptz created_at
  }

  bids {
    uuid id PK
    uuid auction_id FK
    uuid bidder_id FK
    numeric amount
    timestamptz created_at
  }

  messages {
    uuid id PK
    uuid auction_id FK
    uuid sender_id FK
    uuid recipient_id FK
    text body
    boolean is_deleted
    timestamptz created_at
  }

  notifications {
    uuid id PK
    uuid user_id FK
    varchar type
    varchar title
    text body
    jsonb payload_json
    uuid auction_id FK
    timestamptz read_at
    timestamptz created_at
  }

  disputes {
    uuid id PK
    uuid auction_id FK
    uuid raised_by_user_id FK
    text description
    varchar evidence_url
    dispute_status_enum status
    dispute_resolution_enum resolution
    text resolution_notes
    uuid resolved_by_admin_id FK
    timestamptz resolved_at
    timestamptz created_at
    timestamptz updated_at
  }

  payments {
    uuid id PK
    uuid auction_id FK
    uuid payer_user_id FK
    uuid payee_user_id FK
    numeric amount
    char currency
    payment_status_enum status
    varchar external_reference
    boolean is_deleted
    timestamptz created_at
    timestamptz updated_at
  }

  users ||--o{ auctions : "seller"
  auctions ||--o{ auction_images : "has"
  auctions ||--o{ bids : "receives"
  users ||--o{ bids : "places"
  auctions }o--o| bids : "current_high_bid"
  auctions }o--o| bids : "winning_bid"
  auctions ||--o{ messages : "context"
  users ||--o{ messages : "sends"
  users ||--o{ messages : "receives"
  users ||--o{ notifications : "receives"
  auctions ||--o{ notifications : "relates_to"
  auctions ||--o{ disputes : "about"
  users ||--o{ disputes : "raises"
  users ||--o{ disputes : "resolves_admin"
  auctions ||--o{ payments : "optional_context"
  users ||--o{ payments : "payer"
  users ||--o{ payments : "payee"
```

**Cardinality notes**

- One **user** can sell many **auctions**; each **auction** has exactly one **seller**.
- One **auction** has many **bids**; each **bid** belongs to one **auction** and one **bidder**.
- **current_high_bid_id** and **winning_bid_id** on **auctions** are optional references into **bids** (same table as normal bids).
- **messages** and **notifications** tie communication and alerts to **users** and optionally to an **auction**.
- **disputes** link an **auction**, the **user** who raised them, and optionally an **admin** who resolved them.
- **payments** link **payer** and **payee** users and may reference an **auction** when the payment is sale-related.

---

## 2. Application architecture (logical view)

The system is a **single backend** (REST JSON) intended to be used by a **separate frontend** (e.g. React). Persistence is **PostgreSQL** via **TypeORM**; HTTP is served by **NestJS on Express**.

```mermaid
flowchart TB
  subgraph clients [Clients]
    Web[React SPA]
    Postman[Postman / Newman]
  end

  subgraph nest [NestJS application]
    direction TB
    HTTP[Express HTTP adapter]
    Pipe[Global ValidationPipe]
    CORS[CORS]
    Mod[Feature modules]

    subgraph modules [Feature modules]
      AuthM[AuthModule]
      UsersM[UsersModule]
      AuctionsM[AuctionsModule]
      BidsM[BidsModule]
      MsgM[MessagesModule]
      NotifM[NotificationsModule]
      DispM[DisputesModule]
      PayM[PaymentsModule]
      AdminM[AdminModule]
    end

    Ctrl[Controllers — routes and DTO validation]
    Svc[Services — use cases and orchestration]
    Repo[Repositories — TypeORM]

    Mod --> AuthM & UsersM & AuctionsM & BidsM & MsgM & NotifM & DispM & PayM & AdminM
    AuthM & UsersM & AuctionsM & BidsM & MsgM & NotifM & DispM & PayM & AdminM --> Ctrl
    Ctrl --> Svc
    Svc --> Repo
  end

  subgraph data [Data tier]
    TO[(TypeORM)]
    PG[(PostgreSQL)]
    Mig[Migrations — versioned schema]
  end

  Web -->|HTTPS REST JSON| HTTP
  Postman -->|HTTPS REST JSON| HTTP
  HTTP --> CORS --> Pipe --> Mod
  Repo --> TO --> PG
  Mig -.->|applies DDL| PG
```

**Layer roles (MVC-style mapping for coursework)**

| Layer in Nest           | Typical MVC analogy                   | Responsibility                                              |
| ----------------------- | ------------------------------------- | ----------------------------------------------------------- |
| **Controller**          | Controller / “view” boundary for HTTP | HTTP methods, status codes, DTOs, routing                   |
| **Service**             | Business / application logic          | Rules (e.g. bid validity), orchestration                    |
| **Entity / Repository** | Model + data access                   | Rows in PostgreSQL, queries, transactions                   |
| **Module**              | Packaging                             | Wires controllers, services, and `TypeOrmModule.forFeature` |

**Cross-cutting (current or planned)**

- **ConfigModule**: environment-driven DB host, name, credentials, optional `DB_MIGRATIONS_RUN`.
- **Auth**: JWT/guards (stub today) will sit between HTTP and controllers for protected routes.
- **Admin**: same API process, **role** on **users** distinguishes administrators for moderation and dispute resolution.

---

## 3. Request path (example: place a bid)

```mermaid
sequenceDiagram
  participant Client
  participant BidsController
  participant BidsService
  participant TypeORM
  participant PostgreSQL

  Client->>BidsController: POST /auctions/:id/bids JSON body
  BidsController->>BidsService: create(auctionId, dto)
  BidsService->>TypeORM: load auction, validate rules, insert bid, update auction.currentHighBid
  TypeORM->>PostgreSQL: SQL in transaction
  PostgreSQL-->>TypeORM: OK
  TypeORM-->>BidsService: entities
  BidsService-->>BidsController: result DTO
  BidsController-->>Client: 201 / 400
```

---

## 4. Where this lives in the repo

| Concern                  | Location                                                    |
| ------------------------ | ----------------------------------------------------------- |
| TypeORM entities         | `src/database/entities/`                                    |
| Enums                    | `src/database/enums/`                                       |
| Migrations               | `src/database/migrations/`                                  |
| CLI `DataSource`         | `src/database/data-source.ts`                               |
| Nest TypeORM root config | `src/database/typeorm-root-options.ts`, `src/app.module.ts` |
| REST modules             | `src/modules/*`                                             |

If your IDE or Git host does not render Mermaid, paste the fenced blocks into [Mermaid Live Editor](https://mermaid.live/) or use a VS Code Mermaid preview extension.
