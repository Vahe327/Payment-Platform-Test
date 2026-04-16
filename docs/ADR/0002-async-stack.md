# ADR 0002: Fully Async Stack (Sanic + asyncpg + SQLAlchemy Async)

## Status
Accepted

## Context
The platform processes webhook payments that require database transactions with row-level locking (`SELECT ... FOR UPDATE`). High concurrency is expected.

## Decision
Use Sanic (async web framework) with SQLAlchemy 2.0 async engine over asyncpg driver. All I/O operations are `await`-ed.

## Consequences
- **Pros**: Non-blocking I/O, high throughput under concurrent webhook load, natural fit with PostgreSQL advisory/row locks.
- **Cons**: Requires async-aware testing (pytest-asyncio), async Alembic config, and care with session lifecycle.
