#!/usr/bin/env bash
set -euo pipefail

# MODUS Builder — Deploy Script
# Builds frontend, starts backend, and prints URLs.

echo "[deploy] Building frontend..."
cd frontend
npm run build
cd ..

echo "[deploy] Starting backend..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

sleep 2

echo ""
echo "========================================"
echo "  MODUS Builder is live!"
echo "========================================"
echo "  Frontend (built): ./frontend/dist"
echo "  Backend API     : http://localhost:3001"
echo ""

# Wait for backend process so script stays alive if running interactively
wait $BACKEND_PID
