# STAGE 1: build
# base image
FROM node:14-alpine AS build

LABEL maintainer="Francis Masha" MAINTAINER="Francis Masha <francismasha96@gmail.com>"
LABEL application="almond-be"

ARG NODE_ENV=$NODE_ENV
ENV TERM=xterm-256color

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# update the alpine image and install curl
RUN apk update && apk add curl

# installing Alpine Dependencies, but the context for the command from `yarn install` is explained above
RUN apk add --no-cache --virtual .build-deps1 g++ gcc libgcc libstdc++ linux-headers make python && \
    apk add --no-cache --virtual .npm-deps cairo-dev jpeg-dev libjpeg-turbo-dev pango pango-dev && \
    apk add bash

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories

RUN apk update
RUN apk add mongodb
RUN apk add mongodb-tools

RUN npm config set unsafe-perm true
RUN npm install yarn@1.22.x
RUN rm -rf package-lock.json

COPY yarn.lock /home/node/app
COPY package.json /home/node/app
RUN yarn install

ENV PATH="./node_modules/.bin:$PATH"

#RUN yarn build

COPY --chown=node:node . .

USER node

# fire up nginx
EXPOSE 8080

ENV PORT=8080

RUN chmod 777 /home/node/app/entrypoint.sh

ENTRYPOINT ["/home/node/app/entrypoint.sh"]

#> db.createUser({user: "almond", pwd: "froyogreen", roles: ["root"] })
