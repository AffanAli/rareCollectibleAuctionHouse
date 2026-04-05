## Rare Collectible Auction House

coursework backend (NestJS on **Express** via `@nestjs/platform-express`). Controllers expose REST-shaped routes; services hold stub logic until persistence and auth are added. This is a structured **module/controller/service** layout (similar to MVC routing + logic layers), not a production deployment.

**Architecture & ERD:** see [docs/architecture-and-data-model.md](docs/architecture-and-data-model.md) (Mermaid entity–relationship diagram, layered architecture, sample request flow).

[Nest](https://github.com/nestjs/nest) framework TypeScript starter, extended with domain modules under `src/modules/`.

### API map (stubs)

| Area          | Base path                                                                                                 | Notes                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Health        | `GET /`, `GET /test`                                                                                      |                                                                                  |
| Auth          | `POST /auth/register`, `POST /auth/login`, `GET /auth/test`                                               | JWT/password hashing TODO                                                        |
| Users         | `GET/PATCH /users/me`, `GET /users/me/auction-history`, `GET /users/test`                                 | Auth context TODO                                                                |
| Auctions      | `GET/POST /auctions`, `GET /auctions/:id`, `GET /auctions/test`                                           |                                                                                  |
| Bids          | `POST /auctions/:auctionId/bids`, `GET /auctions/:auctionId/bids`, `GET /users/me/bids`, `GET /bids/test` |                                                                                  |
| Messages      | `GET/POST /messages`, `GET /messages/test`                                                                |                                                                                  |
| Notifications | `GET /notifications`, `GET /notifications/test`                                                           |                                                                                  |
| Disputes      | `GET/POST /disputes`, `GET /disputes/test`                                                                |                                                                                  |
| Payments      | `GET /payments`, `GET /payments/test`                                                                     | Protect for admin later                                                          |
| Admin         | `GET /admin/*`, `GET /admin/test`                                                                         | `users`, `auctions`, `bids`, `messages`, `notifications`, `disputes`, `payments` |

Frontend (e.g. React) can call this API with **CORS** enabled in `main.ts`. Copy `.env.example` to `.env` for `PORT`, `CORS_ORIGIN`, and database settings.

### PostgreSQL and TypeORM migrations

- **Entities:** `src/database/entities/` (User, Auction, AuctionImage, Bid, Message, Notification, Dispute, Payment).
- **CLI data source:** `src/database/data-source.ts` (used by TypeORM CLI; loads `.env` from the project root).
- **Initial migration:** `src/database/migrations/1743345600000-initial-schema.ts`.

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
