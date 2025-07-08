# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY ../shared ../shared
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Production stage - simple static file server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80