# 0003. Order items belong to Orders and snapshot unit prices

- Status: accepted
- Date: 2026-11-07

## Context and problem statement

An order has one or more items, each referencing a service and a quantity. Service prices change over time, but existing orders must keep their original prices and totals (`spec.md`). Where should item code live, and how are item prices stored?

## Decision drivers

- Items have no lifecycle outside their order.
- A later service price change must not alter existing orders.
- Amounts must be exact.

## Considered options

- Items inside `OrdersModule`; `unitPriceCents` copied from the service at creation.
- A separate `OrderItemsModule`.
- Items reference the service and read its current price when displayed.

## Decision outcome

Chosen option: "items inside Orders with price snapshots", because an item is part of the order aggregate and only snapshots satisfy the price-history requirement.

- `OrderItem` code lives under `src/orders/`; there is no `OrderItemsModule` (checked by `make audit`).
- `OrderItem.unitPriceCents` is copied from `Service.priceCents` when the order is created and never updated.
- `Order.totalCents = Σ(quantity × unitPriceCents)` is computed and stored at creation, in the same transaction as the items.
- All amounts are integer cents; the migration adds CHECK constraints (`priceCents >= 0`, `quantity > 0`).
- `OrderItem → Order` cascades on delete; `OrderItem → Service` and `Order → Customer` are `RESTRICT`, so history cannot be orphaned.

### Consequences

- Good, because historical orders are stable and totals are exact.
- Good, because the aggregate is created atomically.
- Bad, because the stored total duplicates derivable data and must only be written by `OrdersService`.
