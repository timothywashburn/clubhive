FROM node:22-alpine
WORKDIR /app
COPY shared/ shared/
COPY server/ server/

WORKDIR /app/shared
RUN npm ci

WORKDIR /app/server
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]asdfasdf