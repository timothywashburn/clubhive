FROM node:18-alpine
WORKDIR /app
COPY shared/ shared/
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]