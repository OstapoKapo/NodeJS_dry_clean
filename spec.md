# Dry Cleaning Management System

> This spec describes the **full system target**. Lab 1 delivers only the project foundation; see [Lab 1 scope](#lab-1-scope). Sections marked *target* are implemented in later labs.

## Purpose

Build a NestJS, Prisma, PostgreSQL, and TypeScript REST API for employees to manage customers, cleaning services, and orders. Use one application and database with three modules. Authentication, payments, delivery, promotions, notifications, integrations, and a frontend are out of scope.

## Modules and dependencies

- **Customers:** Create, list, get by ID, and update customers.
- **Services:** Create and list services; update prices and active state.
- **Orders:** Create orders with items, calculate totals, get orders with items, and update status. Items belong to Orders.

Customers and Services are independent. When creating an order, Orders checks the customer through Customers and reads current prices and active states through Services. Modules share a Prisma connection but own their respective rules and data.

## Data model

| Model | Fields and relationships |
| --- | --- |
| Customer | `id`, `firstName`, `lastName`, `phone`, optional `email`; one customer has many orders. |
| Service | `id`, `name`, `priceCents` (nonnegative integer), `isActive`; one service can appear in many items. |
| Order | `id`, `customerId`, `status`, `totalCents`; belongs to a customer and has at least one item. |
| OrderItem | `id`, `orderId`, `serviceId`, `quantity` (positive integer), `unitPriceCents`; belongs to an order and references a service. |

Amounts use integer cents. `totalCents = Σ(quantity × unitPriceCents)`. Each item's `unitPriceCents` is a snapshot of the service price at order creation.

## Main scenarios (target)

1. Customer creation or update changes one customer. Service creation or price/active-state update changes one catalog entry.
2. Order creation checks that the customer exists, the order has items, and each item references an existing active service with a positive quantity. It saves the order, price snapshots, items, and calculated total in one transaction; failure saves nothing.
3. Status moves only `CREATED → PROCESSING → READY → COMPLETED`, one step per update. `COMPLETED` is terminal. Status updates do not change items or totals.

## Acceptance criteria (target, later labs)

- `POST /customers`, `GET /customers`, `GET /customers/:id`, and `PATCH /customers/:id` perform the stated customer operations.
- `POST /services`, `GET /services`, and `PATCH /services/:id` create/list services and update `priceCents` or `isActive`.
- `POST /orders` creates a `CREATED` order for an existing customer with one or more valid items. Its items contain saved unit prices, and its total equals the sum of quantity times saved unit price.
- `GET /orders/:id` returns status, customer ID, total, and items. Changing a service price later leaves existing order prices and totals unchanged.
- `PATCH /orders/:id/status` accepts the next status only; skipped, backward, or post-`COMPLETED` transitions return 409.
- Invalid input returns 400; unknown customer, service, or order IDs return 404; a rejected order creates no partial records.

## Lab 1 scope

Lab 1 builds the runnable foundation only. Customer, service, and order CRUD and the scenarios above are **not** part of Lab 1.

### Lab 1 acceptance criteria

- **Scaffold:** a NestJS + TypeScript app starts with PostgreSQL configured through environment variables (`DATABASE_URL`, `PORT`); an `.env.example` documents them.
- **Migration:** the Prisma schema models Customer, Service, Order, and OrderItem as in the data model above; `prisma validate` passes and the initial migration applies to a fresh database.
- **Module boundaries:** `CustomersModule`, `ServicesModule`, and `OrdersModule` exist. Orders imports Customers and Services; Customers and Services import neither each other nor Orders. Order item code lives inside Orders; there is no `OrderItemsModule`. One shared Prisma provider is used by all modules.
- **Layering:** controllers contain HTTP handling only; business logic belongs in services. No placeholder CRUD endpoints.
- **`GET /version`:** returns `{ "sha": "<git commit SHA>" }`. A smoke test verifies the response using an injected known SHA.
- **Documentation:** the README covers prerequisites, local database setup, migration, development, and checks. `standards/` holds the spec format, MADR ADR format, Definition of Done, and review checklist; decisions are recorded in `docs/adr/`.
- **Checks and hooks:** formatting, lint, type check, Prisma validation, smoke test, module audit, and build run through the Makefile. Repository Git hooks (`.githooks/`) exit non-zero when their checks fail: pre-commit runs format, lint, and smoke; pre-push runs the full check.
- **AI record:** prompts and responses are kept in `ai/` without secrets.
