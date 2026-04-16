# ADR 0001: Separate User and Admin Tables

## Status
Accepted

## Context
The system has two distinct actor types — regular users and administrators — with fundamentally different permissions and lifecycle.

## Decision
Use separate `users` and `admins` database tables instead of a single polymorphic table with a `role` column.

## Consequences
- **Pros**: Clear schema separation, no accidental privilege escalation through role field manipulation, independent indexing and constraints, simpler queries per role.
- **Cons**: Slight code duplication in repository/service layers. Mitigated by a shared `BaseRepository` generic class.
