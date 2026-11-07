# Review checklist

## Scope and spec
- [ ] The change implements what the spec says — no more, no less.
- [ ] Spec, README, and ADRs are updated where behavior, setup, or architecture changed.

## Architecture
- [ ] Controllers contain HTTP handling only; no Prisma calls or business rules in controllers.
- [ ] Module imports follow `Orders → Customers, Services`; Customers and Services do not import each other or Orders.
- [ ] Order item code lives in `src/orders/`; no `OrderItemsModule`.
- [ ] Modules use the shared `PrismaService`; no `new PrismaClient()` outside `src/prisma/`.

## Correctness
- [ ] Amounts are integer cents; totals are `Σ(quantity × unitPriceCents)`.
- [ ] Order item prices are snapshots, never read back from the current service price.
- [ ] Multi-record writes use a transaction; failure leaves no partial records.
- [ ] Error mapping: invalid input → 400, unknown ID → 404, invalid status transition → 409.

## Data
- [ ] Schema changes have a migration; the migration applies to a fresh database.
- [ ] Constraints (non-negative price, positive quantity) are enforced in code and, where possible, in the database.

## Quality
- [ ] `make check` passes; new behavior is tested.
- [ ] No secrets, credentials, or `.env` files committed (including in `ai/`).
- [ ] Names are clear; no dead code or commented-out blocks.
