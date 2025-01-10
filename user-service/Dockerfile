FROM node:20-alpine

LABEL maintainer="info@impactfirst.co"

WORKDIR /var/www/backend

COPY package*.json ./

RUN yarn install

RUN yarn add glob rimraf @types/validator class-transformer

RUN mkdir uploads

COPY . .

RUN yarn run build

CMD ["yarn", "run", "start:prod"]
