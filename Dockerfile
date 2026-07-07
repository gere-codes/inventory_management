# Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_BASE=/api
ENV VITE_BASE=$VITE_BASE
RUN npm run build

# Backend
FROM node:20-alpine AS backend-build

WORKDIR /app/backend

COPY api-node/package*.json ./
RUN npm install

COPY api-node/ ./

RUN npm run build
RUN npm prune --production


# Production
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=backend-build /app/backend/package.json ./
RUN npm install --omit=dev

COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/drizzle ./drizzle
COPY --from=backend-build /app/backend/drizzle.config.ts ./drizzle.config.ts
COPY --from=frontend-build /app/frontend/dist ./public

# RUN mkdir -p uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

CMD ["npm", "run", "start"]