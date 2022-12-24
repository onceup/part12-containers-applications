FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci --only=production

USER node

CMD npm start
