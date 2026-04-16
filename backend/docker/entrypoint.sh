#!/bin/bash
set -e

echo "Running migrations..."
cd /app
alembic upgrade head

echo "Starting Sanic server..."
exec sanic app.main:create_app --factory --host 0.0.0.0 --port 8000
