# ---- Stage 1: Build Frontend ----
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Serve Backend ----
FROM node:18-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy built frontend assets into backend static directory
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3001

CMD ["node", "src/index.js"]
