# Definition of Done

A change is done when all of the following hold:

1. **Spec** — behavior matches `spec.md`; if behavior changed, the spec changed in the same commit.
2. **Layering** — controllers only map HTTP to service calls (parsing, validation pipes, status codes). Business rules live in services. Data access goes through the shared `PrismaService`.
3. **Boundaries** — module imports respect `Orders → Customers, Services`; `make audit` checks relative and path-alias imports and actual NestJS module wiring. No `OrderItemsModule`.
4. **Data rules** — money is integer cents; multi-record writes that must succeed together use one transaction.
5. **Tests** — new behavior has a test; HTTP endpoints have a request-level smoke test; `make test` passes.
6. **Checks** — `make check` passes locally (format, lint, typecheck, Prisma validate, audit, test, build).
7. **Migrations** — schema changes ship with a committed Prisma migration that applies to a fresh database.
8. **Docs** — README updated for new setup steps or commands; significant decisions recorded as an ADR in `docs/adr/`.
9. **Hooks** — commit made with hooks installed (`make hooks`); hooks were not bypassed with `--no-verify`.
10. **AI record** — AI prompts/responses used for the change are saved in `ai/`, without secrets.
11. **Review** — the review checklist (`standards/review-checklist.md`) has been walked through.
