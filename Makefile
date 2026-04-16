.PHONY: up down build test lint migrate logs

up:
	docker compose up --build -d

down:
	docker compose down -v

build:
	docker compose build --no-cache

test:
	cd backend && python -m pytest -v
	cd frontend && npm test -- --run

lint:
	cd backend && ruff check . && ruff format --check . && mypy --strict src/
	cd frontend && npx tsc --noEmit && npx eslint . && npx prettier --check .

migrate:
	cd backend && alembic upgrade head

logs:
	docker compose logs -f

smoke:
	bash scripts/smoke.sh
