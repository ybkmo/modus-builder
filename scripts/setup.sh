#!/usr/bin/env bash
set -euo pipefail

# MODUS Builder — Setup Script
# Works on POSIX shells (macOS, Linux, Git Bash on Windows)

echo "[setup] Creating directories..."
mkdir -p frontend/public backend/src docker db lib/ai lib/deploy scripts

echo "[setup] Installing root dependencies..."
npm install

echo "[setup] Installing frontend dependencies..."
if [ -d "frontend" ]; then
  cd frontend && npm install && cd ..
fi

echo "[setup] Installing backend dependencies..."
if [ -d "backend" ]; then
  cd backend && npm install && cd ..
fi

echo "[setup] Copying environment file..."
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "[setup] Created .env from .env.example"
else
  echo "[setup] .env already exists, skipping copy"
fi

echo "[setup] Initialising database..."
if command -v psql &>/dev/null; then
  DB_NAME="${DB_NAME:-modus}"
  DB_USER="${DB_USER:-postgres}"
  DB_PASS="${DB_PASSWORD:-password}"
  DB_HOST="${DB_HOST:-localhost}"
  CONN="postgres://${DB_USER}:${DB_PASS}@${DB_HOST}"

  echo "[setup] Creating database ${DB_NAME} (if not exists)..."
  psql "${CONN}/postgres" -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
    psql "${CONN}/postgres" -c "CREATE DATABASE ${DB_NAME};"

  echo "[setup] Running schema.sql..."
  psql "${CONN}/${DB_NAME}" -f db/schema.sql

  echo "[setup] Running seed.sql..."
  psql "${CONN}/${DB_NAME}" -f db/seed.sql
else
  echo "[setup] psql not found. Skipping database init — please run schema.sql / seed.sql manually."
fi

echo "[setup] Done! Run 'npm run dev' to start development."
