# ADR 0003: Webhook Idempotency via transaction_id Unique Constraint

## Status
Accepted

## Context
Payment webhooks may be delivered more than once. Duplicate processing would incorrectly inflate account balances.

## Decision
The `payments.transaction_id` column has a `UNIQUE` constraint. Processing flow:
1. Check if a payment with this `transaction_id` exists.
2. If yes, return success with `already_processed: true`.
3. If no, acquire a `FOR UPDATE` lock on the account, insert the payment, update the balance — all in one transaction.
4. If an `IntegrityError` occurs (race condition), rollback and return idempotent response.

## Consequences
- **Pros**: Guaranteed at-most-once processing regardless of retry count or concurrency level.
- **Cons**: Requires careful transaction management and error handling for the race condition path.
