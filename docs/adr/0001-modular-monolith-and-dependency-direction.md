# 0001. Modular monolith with one-way module dependencies

- Status: accepted
- Date: 2026-11-07

## Context and problem statement

The API manages customers, cleaning services, and orders (`spec.md`). It is a university lab built and run by one team on one PostgreSQL database. We need a structure that keeps responsibilities separate without the cost of distributed services. How should the code be split, and which parts may depend on which?

## Decision drivers

- One deployable app and one database (spec).
- Order creation needs customer existence and current service prices.
- Customers and services must be changeable without touching orders.
- Boundaries must be checkable automatically.

## Considered options

- Modular monolith: `CustomersModule`, `ServicesModule`, `OrdersModule`, with `Orders → Customers, Services`.
- Layer-first structure (all controllers together, all services together).
- Separate microservices per domain.

## Decision outcome

Chosen option: "Modular monolith", because it matches the single app/database constraint and gives each domain a clear owner while keeping calls in-process.

Dependency rules:

- `OrdersModule` imports `CustomersModule` and `ServicesModule` and uses their exported services.
- `CustomersModule` and `ServicesModule` import neither each other nor `OrdersModule`.
- `PrismaModule` is a global infrastructure module, not a feature dependency.
- `scripts/audit-modules.mjs` (`make audit`) fails the build on any other feature-to-feature import.

### Consequences

- Good, because domains can evolve independently and the dependency graph is acyclic.
- Good, because a violation is caught by `make check` and the pre-push hook.
- Bad, because Orders cannot use Prisma relations to read customers/services directly; it must go through their services (see ADR 0002).
