# PayFlow — Async Payment Platform

A production-ready payment platform built with **Sanic** (Python async), **PostgreSQL**, and **React + TypeScript**.

## Architecture

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Postgres │
│ (React)  │ /api│ (Sanic)  │     │   16     │
│ nginx:80 │     │ :8000    │     │  :5432   │
└─────────┘     └──────────┘     └──────────┘
```

- **Backend**: Sanic 23.12 + SQLAlchemy 2.0 async + asyncpg + Alembic
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui style
- **Database**: PostgreSQL 16

## Quick Start (Docker Compose)

```bash
cp .env.example .env
docker compose up --build
```

- UI: http://localhost:3000
- API: http://localhost:8000/api/v1
- DB: localhost:5432

## Quick Start (without Docker)

### Backend

```bash
cd backend
# Create a PostgreSQL database named 'app'
cp .env.example .env  # edit DATABASE_URL for your local Postgres
pip install -e ".[dev]"
alembic upgrade head
sanic app.main:create_app --factory --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # port 5173, proxies /api to localhost:8000
```

## Default Credentials

| Role  | Email               | Password         |
|-------|---------------------|------------------|
| User  | user@example.com    | user_pass_123    |
| Admin | admin@example.com   | admin_pass_123   |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL async connection string | `postgresql+asyncpg://app:app@db:5432/app` |
| `JWT_SECRET` | Secret for HS256 JWT signing | `jwt-super-secret-change-me` |
| `JWT_TTL_MINUTES` | Token TTL in minutes | `60` |
| `WEBHOOK_SECRET_KEY` | Webhook signature secret | `gfdmhghif38yrf9ew0jkf32` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000,http://localhost:5173` |
| `DEFAULT_USER_EMAIL` | Seed user email | `user@example.com` |
| `DEFAULT_USER_PASSWORD` | Seed user password | `user_pass_123` |
| `DEFAULT_ADMIN_EMAIL` | Seed admin email | `admin@example.com` |
| `DEFAULT_ADMIN_PASSWORD` | Seed admin password | `admin_pass_123` |

## API Endpoints

### User Auth
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user_pass_123"}'

# Get profile
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer <token>"

# Get accounts
curl http://localhost:8000/api/v1/users/me/accounts \
  -H "Authorization: Bearer <token>"

# Get payments
curl http://localhost:8000/api/v1/users/me/payments \
  -H "Authorization: Bearer <token>"
```

### Admin Auth & CRUD
```bash
# Admin login
curl -X POST http://localhost:8000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin_pass_123"}'

# Admin profile
curl http://localhost:8000/api/v1/admin/me \
  -H "Authorization: Bearer <admin_token>"

# List users
curl http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer <admin_token>"

# Create user
curl -X POST http://localhost:8000/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"email":"new@example.com","password":"pass123","full_name":"New User"}'

# Update user
curl -X PATCH http://localhost:8000/api/v1/admin/users/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"full_name":"Updated Name"}'

# Delete user
curl -X DELETE http://localhost:8000/api/v1/admin/users/2 \
  -H "Authorization: Bearer <admin_token>"
```

### Webhook
```bash
curl -X POST http://localhost:8000/api/v1/webhooks/payment \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "5eae174f-7cd0-472c-bd36-35660f00132b",
    "user_id": 1,
    "account_id": 1,
    "amount": 100,
    "signature": "7b47e41efe564a062029da3367bde8844bea0fb049f894687cee5d57f2858bc8"
  }'
```

## Webhook Signature Generation

```python
import hashlib

def compute_signature(account_id, amount, transaction_id, user_id, secret_key):
    raw = f"{account_id}{amount}{transaction_id}{user_id}{secret_key}"
    return hashlib.sha256(raw.encode()).hexdigest()

# Example:
sig = compute_signature(1, 100, "5eae174f-7cd0-472c-bd36-35660f00132b", 1, "gfdmhghif38yrf9ew0jkf32")
# → "7b47e41efe564a062029da3367bde8844bea0fb049f894687cee5d57f2858bc8"
```

## Running Tests

```bash
# Backend
cd backend
pytest -v

# Frontend
cd frontend
npx tsc --noEmit
npx eslint .
```

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make up` | Build and start all services |
| `make down` | Stop and remove all services + volumes |
| `make test` | Run backend + frontend tests |
| `make lint` | Run all linters |
| `make migrate` | Apply database migrations |
| `make smoke` | Run smoke tests against running services |
