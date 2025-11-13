FROM node:24.11-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

USER node
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
