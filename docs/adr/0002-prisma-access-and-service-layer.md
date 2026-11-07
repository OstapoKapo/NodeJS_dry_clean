# 0002. Shared Prisma provider; business logic in services

- Status: accepted
- Date: 2026-11-07

## Context and problem statement

All modules use the same PostgreSQL database. We need one way to access data and one place for business rules (price snapshots, totals, status transitions) so they are testable and not duplicated in HTTP code.

## Decision drivers

- One database connection pool for the whole app.
- Controllers should stay thin and easy to review.
- Order creation must run in one transaction.

## Considered options

- A global `PrismaService` injected into feature services; controllers call services only.
- A repository class per model wrapping Prisma.
- Each module creating its own `PrismaClient`.

## Decision outcome

Chosen option: "global `PrismaService` + service layer", because Prisma's client is already a typed data-access layer and an extra repository layer adds code without benefit at this size.

- `src/prisma/PrismaService` extends `PrismaClient` and is provided once by the global `PrismaModule`.
- Controllers handle HTTP only (routing, DTO validation, status codes) and delegate to services.
- Each module's service writes only its own tables. Orders reads customers and services through `CustomersService` and `ServicesService`, which may accept a transaction client so order creation stays in one transaction.
- Prisma 6 is used (`prisma-client-js` generator) as the current stable line with standard NestJS integration.

### Consequences

- Good, because there is a single connection pool and one place to look for each rule.
- Good, because services can be unit-tested with a mocked `PrismaService`.
- Bad, because the "own tables only" rule is enforced by review, not by the compiler.
