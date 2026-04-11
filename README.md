## Rare Collectible Auction House

Coursework backend (NestJS on **Express** via `@nestjs/platform-express`) with PostgreSQL persistence (TypeORM), JWT auth, and a small server-rendered HTML UI (no separate frontend build). This follows a structured **module/controller/service** layout (similar to MVC routing + logic layers) and is not a production deployment.

**ERD (soft delete + FK policy):** [docs/architecture-and-data-model.md](docs/architecture-and-data-model.md).

[Nest](https://github.com/nestjs/nest) framework TypeScript starter, extended with domain modules under `src/modules/`.

### API map

| Area          | Base path                                                                                                 | Notes                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Health        | `GET /health`, `GET /test`                                                                                | `GET /` serves the public landing page (HTML).                                   |
| Auth          | `POST /auth/register`, `POST /auth/login`                                                                 | JWT (Bearer token) + bcrypt password hashing.                                    |
| Users         | `GET /users/me`, `PATCH /users/me`                                                                        | Profile: contact info + preferences.                                             |
| Auctions      | `GET /auctions`, `GET /auctions/:id`                                                                      | Public marketplace listing + detail.                                             |
|              | `GET /auctions/mine/list`, `GET /auctions/mine/:id`, `POST/PATCH/DELETE /auctions/mine/*`                  | Seller-owned listing management.                                                 |
|              | `POST /auctions/mine/:id/publish`, `POST /auctions/mine/:id/cancel`                                        | Seller status actions.                                                           |
| Bids          | `GET /auctions/:auctionId/bids`, `POST /auctions/:auctionId/bids`, `GET /users/me/bids`                   | Enforces min-next-bid rules; no self-bidding.                                    |
| Messages      | `GET /messages/inbox`, `GET/POST /auctions/:auctionId/messages`                                            | Buyer/seller communication grouped by auction.                                   |
| Notifications | `GET /notifications`, `GET /notifications/summary`, `PATCH /notifications/read-all`, `PATCH /notifications/:id/read` | Used by notification dropdown + notifications page (polling).                    |
| Disputes      | `GET /disputes/mine`, `GET /disputes/eligible-auctions`, `GET /disputes/:id`, `POST /disputes`            | Sellers/winners can raise disputes for ended auctions with evidence URLs.        |
| Payments      | `GET /payments`                                                                                            | Admin-only payment history for ended auctions.                                   |
| Admin         | `GET /admin/api/dashboard`                                                                                | Admin overview across users/auctions/bids/messages/notifications/disputes/payments. |
|              | `GET /admin/users`, `PATCH /admin/users/:id/status`                                                       | Basic user moderation (suspend/reactivate).                                      |
|              | `GET /admin/auctions`, `PATCH /admin/auctions/:id/status`                                                 | Basic auction moderation (status changes).                                       |
|              | `GET /admin/bids`, `GET /admin/messages`, `GET /admin/notifications`, `GET /admin/disputes`, `GET /admin/payments` | Read-only listings.                                                              |
|              | `PATCH /admin/disputes/:id/resolve`                                                                       | Resolve disputes with a structured outcome.                                      |

### Pages (server-rendered HTML)

- Public: `GET /` (landing), `GET /marketplace`, `GET /marketplace/:id`, `GET /login`, `GET /register`, `GET /api`
- Authenticated: `GET /profile`, `GET /seller/auctions`, `GET /seller/auctions/new`, `GET /seller/auctions/:id/edit`, `GET /bids`, `GET /messages`, `GET /notifications/page`, `GET /disputes`
- Admin: `GET /admin/dashboard`

The HTML pages store the JWT in `localStorage` under `auctionHouseToken` and call the API using `Authorization: Bearer <token>`.

Frontend (e.g. React) can call this API with **CORS** enabled in `main.ts`. Copy `.env.example` to `.env` for `PORT`, `CORS_ORIGIN`, and database settings.

### PostgreSQL and TypeORM migrations

- **Entities:** `src/database/entities/` (User, Auction, AuctionImage, Bid, Message, Notification, Dispute, Payment) — each has **`deleted_at`** for soft delete.
- **CLI data source:** `src/database/data-source.ts` (used by TypeORM CLI; loads `.env` from the project root).
- **Migrations:** `1743345600000-initial-schema.ts`, `1743345700000-soft-delete-and-no-action-fks.ts`, `1775752500000-auction-listing-enhancements.ts`.

Admin seeding on startup (local/dev): set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_DISPLAY_NAME` in `.env`. The seed runs on startup and will create the admin user if missing, or update the existing record to ensure role/password/status match the env values.

Demo data import (Docker):

```bash
docker compose --profile demo run --rm demo_import
```

The demo SQL sets all demo account passwords to `123456`. If you want the seeded admin to stay `123456` in Docker, run the backend with `ADMIN_PASSWORD=123456` (see `docker-compose.yml`).

Start PostgreSQL (example with Docker):

```bash
docker compose up -d
```

Apply migrations:

```bash
npm run migration:run
```

Other scripts: `npm run migration:show`, `npm run migration:revert`, `npm run migration:generate` (compare DB to entities; requires a running DB).

Optional: set `DB_MIGRATIONS_RUN=true` in `.env` to run migrations automatically when the Nest app starts.

**Note:** `npm run test:e2e` uses a slim `AppE2eModule` so it does not require PostgreSQL. Full `AppModule` integration tests need a reachable database.

## Project setup

Requires Node.js `>= 20` (see `package.json` `engines` and `.nvmrc`).

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

This repository is coursework and does not include production deployment guidance beyond the basics above.
