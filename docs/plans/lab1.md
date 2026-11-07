# Lab 1 implementation plan

## Target result

Create a runnable NestJS, TypeScript, Prisma, and PostgreSQL project foundation for the dry cleaning API. Establish the Customers, Services, and Orders module boundaries, development standards, repeatable checks, and a working `GET /version` endpoint. Full customer, service, and order CRUD remains for later labs.

The starting workspace contains only `spec.md` and is not yet a Git repository. Keep the setup small and use standard NestJS tooling. Stop when a fresh checkout can follow the README, apply the database migration, run the app and `/version`, pass all Makefile checks, and demonstrate that failing hooks block commits or pushes.

## Acceptance criteria

- The app starts with PostgreSQL configured through environment variables; Prisma validates and the initial migration applies to a fresh database.
- `CustomersModule`, `ServicesModule`, and `OrdersModule` exist. Orders depends on Customers and Services; those modules are independent. Order items stay inside Orders.
- Controllers contain HTTP handling only; business logic belongs in services when features are added. No placeholder CRUD endpoints are required for this lab.
- `GET /version` returns the current Git commit SHA. A smoke test verifies its response using a known SHA.
- The README documents prerequisites, local database setup, migration, development, and checks.
- `standards/` contains a spec format, MADR ADR format, Definition of Done, and review checklist. Architecture decisions are recorded in `docs/adr/`.
- Formatting, linting, TypeScript static checks, Prisma validation, smoke test, and build can be run through the Makefile. Repository Git hooks return a failing exit status when their checks fail.
- The module dependency audit confirms the intended direction and the absence of an `OrderItemsModule`. AI prompts and responses are retained in `ai/` without secrets.

## Steps

1. **Scope the spec.** Update `spec.md` to distinguish the full system target from Lab 1. Keep its data model and future API behavior, but add Lab 1 acceptance criteria for the scaffold, migration, module boundaries, `/version`, documentation, hooks, and checks. The current title says “Lab 1” while its CRUD and order criteria require later work (`spec.md`, lines 1 and 34–39).
2. **Initialize and scaffold.** Initialize Git, scaffold NestJS with TypeScript, add Prisma and PostgreSQL configuration, and provide an example environment file. Add only the dependencies needed for this foundation. Document local PostgreSQL setup in the README; add infrastructure only if needed.
3. **Define persistence.** Model Customer, Service, Order, and OrderItem in Prisma according to `spec.md`, lines 15–24. Add and apply the initial migration. Keep order item unit prices as snapshots and amounts in integer cents.
4. **Build module structure.** Add Customers, Services, and Orders modules, with one shared Prisma provider. Wire Orders to Customers and Services; keep them independent of one another. Place order item code under Orders. Add service classes for business logic boundaries, without implementing CRUD.
5. **Implement `/version`.** Add `GET /version` and a small SHA lookup service. Make the lookup testable with a known value so the smoke test can run before the first commit exists.
6. **Set standards and decisions.** Write the four `standards/` documents. Add MADR records under `docs/adr/` for the modular monolith and dependency direction, Prisma access and service-layer business logic, and order item ownership with price snapshots.
7. **Add repeatable checks and hooks.** Configure Prettier, ESLint, TypeScript type checking, Prisma validation, a basic application smoke test, and build. Expose focused and full-check Makefile targets. Add repository-owned `.githooks/` scripts and document installation through a Makefile target. Run formatting, lint, and smoke checks before commit; run the full checks, including type checking, Prisma validation, and build, before push. Avoid a separate hook framework.
8. **Audit and verify.** Inspect module imports and NestJS wiring for `Orders → Customers, Services`, with no reverse or Customers-to-Services dependency. Confirm there is no separate OrderItems module. Follow the README from a clean checkout, apply the migration, run the app, check `/version`, run the full Makefile target, and deliberately fail a check to prove each hook blocks its action.
9. **Record AI use.** Save prompts and responses for planning and implementation in `ai/`, omitting credentials and other secrets. After this lab, perform the requested review: identify three real issues or shortcuts, record feedback, update the spec or standards, and fix them in follow-up commits.

## Commit sequence

1. Scoped spec and standards.
2. NestJS/Prisma scaffold and initial migration.
3. Module structure and ADRs in `docs/adr/`.
4. `/version` endpoint and smoke test.
5. Makefile, checks, hooks, README, and AI record.

Run relevant checks before each commit, then test the push hook. Keep the later three-issue review and fixes in separate follow-up commits. No commit is part of this planning step.

## Risks and mitigations

- **The current spec reads as a full CRUD lab:** scope its acceptance criteria before implementation, while retaining the future behavior.
- **The first commit has no existing SHA:** inject a known SHA in the smoke test; verify the real SHA after the first commit.
- **Module boundaries can drift:** audit imports and module wiring as part of the full checks and review checklist.
- **Hooks may be inactive in a fresh clone:** provide an explicit installation command and verification steps in the README.
