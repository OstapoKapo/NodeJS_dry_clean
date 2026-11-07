# Dry Cleaning Management System

Lab 1 establishes a NestJS/TypeScript API, Prisma/PostgreSQL schema, module boundaries, and development checks. The customer, service, and order endpoints in [spec.md](spec.md) are planned for later labs. The only HTTP endpoint in this lab is `GET /version`.

## Requirements

- Node.js 20.19 or newer, npm, Git, and Make
- PostgreSQL 16 locally, or Docker Compose for the included development database

## Set up

```sh
cp .env.example .env
make install
docker compose up -d db
npm run prisma:migrate
make hooks
npm run start:dev
```

The example database listens on `localhost:5433`. If using an existing PostgreSQL server, create a database and user, then set `DATABASE_URL` in `.env` instead of starting Docker Compose. Prisma loads `.env` for migration commands; the start scripts load it through Node's `--env-file` flag. Run `npm run prisma:migrate:dev` when authoring a new schema migration; commit the generated migration. `make install` uses the lockfile and generates the Prisma client.

Check the running API:

```sh
curl http://localhost:3000/version
```

The response is `{ "sha": "<current Git commit SHA>" }`. Set `GIT_SHA` in the runtime environment when deploying without the `.git` directory. The app returns 503 if neither source is available. `PORT` defaults to 3000.

## Development checks

```sh
make check          # format, lint, typecheck, Prisma validate, module audit, tests, build
make commit-check   # format, lint, smoke test
make format         # apply Prettier
make hooks          # install repository Git hooks for this clone
```

The pre-commit hook runs `make commit-check`; the pre-push hook runs `make check`. Both block the Git action on a failing check. Git does not install repository hooks automatically, so run `make hooks` after cloning. The smoke test sends an HTTP request through Nest with a mocked database provider and known SHA. Its in-memory transport needs neither PostgreSQL nor a listening port.

## Project layout

- `src/customers/`, `src/services/`, `src/orders/`: feature modules; Orders depends on Customers and Services, while the other two are independent. Order items belong inside Orders.
- `src/prisma/`: shared Prisma provider. `prisma/`: schema and migrations.
- `src/version/`: commit SHA controller and service, registered directly in `AppModule`.
- `standards/`: project document formats, Definition of Done, and review checklist.
- `docs/adr/`: accepted architecture decisions. `docs/plans/`: implementation plans.
- `ai/`: prompts and responses used for project work, without secrets.

Read [AGENTS.md](AGENTS.md), [spec.md](spec.md), the applicable [standards](standards/), and [ADRs](docs/adr/) before changing the project.
