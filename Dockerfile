# syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

USER node
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
