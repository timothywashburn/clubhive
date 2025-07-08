# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY shared/ shared/
COPY client/ client/
WORKDIR /app/client
RUN npm ci --ignore-scripts
RUN npm run build

# Production stage - simple static file server
FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
EXPOSE 80