# Project rules for AI agents

Before starting a task, read this file, the relevant parts of `spec.md`, applicable files in `standards/`, and accepted decisions in `docs/adr/`. Follow `docs/plans/` when carrying out an approved plan. If a requested change conflicts with those documents, update the relevant document as part of the change and explain the decision.

## Code style

- Use TypeScript, the existing NestJS patterns, and the configured Prettier and ESLint rules.
- Keep changes focused and readable. Prefer existing project tools over new dependencies or layers.
- Keep secrets out of source control; use `.env.example` for configuration examples.

## Architecture

- Keep one NestJS application with Customers, Services, and Orders modules. Order items belong inside Orders.
- Customers and Services do not depend on each other or on Orders. Orders may depend on Customers and Services through their exported services. Keep database access in the shared Prisma provider.
- Controllers handle HTTP concerns. Put business rules and data operations in services. Preserve integer-cent prices and order-item price snapshots described in `spec.md`.

## Tests and completion

- Add or update focused tests for behavior changes. Include a migration when the Prisma schema changes.
- Before finishing, run `make check`, review the module dependency audit, and report the results and any verification gaps. Follow `standards/definition-of-done.md` and `standards/review-checklist.md`.
- Record AI prompts and responses used for project work in `ai/` without secrets.
