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

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
