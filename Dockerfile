# STAGE 1: build
# base image
FROM node:14-alpine AS build

LABEL maintainer="Francis Masha" MAINTAINER="Francis Masha <francismasha96@gmail.com>"
LABEL application="almond-be"

ARG NODE_ENV=$NODE_ENV
ENV TERM=xterm-256color
ENV APP_HOME=/home/app
#ENV PATH="./node_modules/.bin:$PATH"

RUN mkdir -p $APP_HOME && chown -R node:node $APP_HOME
WORKDIR $APP_HOME

# update the alpine image and install curl
RUN apk update && apk add curl

# installing Alpine Dependencies, but the context for the command from `yarn install` is explained above
RUN apk add --no-cache --virtual .build-deps1 g++ gcc libgcc libstdc++ linux-headers make python && \
    apk add --no-cache --virtual .npm-deps cairo-dev jpeg-dev libjpeg-turbo-dev pango pango-dev && \
    apk add bash

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories

RUN apk upgrade --update
RUN apk add --no-cache mongodb
#RUN apk add mongodb-tools
RUN apk add --no-cache mongodb-tools && \
    rm -rf /var/cache/apk/*

RUN npm config set unsafe-perm true
#RUN npm install -g yarn@1.22.5 --force
RUN rm -rf package-lock.json
COPY --chown=node:node . $APP_HOME

#COPY yarn.lock $APP_HOME
#COPY package.json $APP_HOME
#COPY --chown=node:node . $APP_HOME
#COPY --chown=node:node . .
#RUN yarn install --only=dev
RUN yarn install
RUN yarn run build

#COPY --chown=node:node . .
#USER node

#EXPOSE 8080

#RUN chmod 777 /home/node/app/entrypoint.sh
#ENTRYPOINT ["/home/node/app/entrypoint.sh"]

## Stage 2 - the production build
# build a the application image with
#FROM node:14-alpine
#ENV APP_HOME=/home/app
#WORKDIR $APP_HOME
#
## update the Alpine image and install curl
#RUN apk update && apk add curl
#RUN apk add bash
#
#RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories
#RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories
#
#RUN apk upgrade --update
#RUN apk add --no-cache mongodb
#RUN apk add mongodb-tools
#
## copy dependencies and the dist/ directory from the previous build stage.
#COPY --from=build $APP_HOME/node_modules ./node_modules/
#COPY --from=build $APP_HOME/build ./build
##COPY --chown=node:node . $APP_HOME
#COPY tsconfig.json ./
#COPY package.json ./
#COPY newrelic.js ./
#COPY entrypoint.sh ./
#COPY release.sh ./
#COPY .env ./
COPY src/data/ $APP_HOME/build/data/

# expose port 8080 for accessing  the app
EXPOSE 8080

RUN chmod 777 /home/app/entrypoint.sh
ENTRYPOINT ["/home/app/entrypoint.sh"]

## seed data if they dont exist
#RUN yarn seed:data
## run app when the container launches
#CMD ["yarn", "start"]

#> db.createUser({user: "almond", pwd: "froyogreen", roles: ["root"] })
