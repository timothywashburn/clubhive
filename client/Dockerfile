# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY shared/ shared/
COPY client/ client/

WORKDIR /app/shared
RUN npm ci

WORKDIR /app/client
RUN npm install --ignore-scripts
RUN npm run build

# Production stage - simple static file server
FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80