# Frontend
FROM node:20-alpine as build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_BASE=/api
ENV VITE_BASE=$VITE_BASE
RUN npm run build


# Backend
FROM node:20-alpine as build-backend
WORKDIR /app/backend
COPY api-node/package*.json ./
RUN npm install
COPY api-node ./
RUN npm run build


# Production
FROM node:20-alpine as production 
WORKDIR /app
COPY api-node/package*.json ./
RUN npm install --omit=dev

## full permission to read and write at the uploads folder
RUN mkdir uploads && chmod 777 uploads

COPY --from=build-backend /app/backend/dist ./dist
COPY --from=build-frontend /app/frontend/dist ./public
EXPOSE 5000
CMD ["node", "dist/index.js"]