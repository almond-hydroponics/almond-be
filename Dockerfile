# STAGE 1: build
# base image
FROM node:12.16.1-alpine AS build

LABEL maintainer="Francis Masha" MAINTAINER="Francis Masha <francismasha96@gmail.com>"
LABEL application="almond-be"

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package.json yarn.lock ./

#USER node

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
RUN npm install yarn@1.21.x && rm -rf package-lock.json
#COPY package.json yarn.lock /usr/app/
#COPY src/ /usr/app/

RUN yarn install

COPY --chown=node:node . .

USER node

#RUN yarn run build

# STAGE 2: nginx
#FROM nginx:1.17.6-alpine
#
## setup nginx configurations
## Remove (some of the) default nginx config
#RUN \
#  rm -rf /etc/nginx/conf.d/default.conf && \
#  rm -rf /etc/nginx/nginx.conf && \
#  rm -rf /etc/nginx/sites-*
#
#COPY ./nginx.conf /etc/nginx/
#COPY nginx/*.conf /etc/nginx/conf.d/
#
## add permissions for nginx user
#RUN \
##  chown -R node:node /app && \
#  chmod -R 755 /home/node/app && \
#  chown -R node:node /var/cache/nginx && \
#  chown -R node:node /var/log/nginx && \
#  chown -R node:node /etc/nginx/conf.d
#
#RUN \
#  touch /var/run/nginx.pid && \
#  chown -R nginx:nginx /var/run/nginx.pid
#
## From ‘build’ stage copy the artifacts in build/ to the default nginx public folder
##RUN rm -rf /usr/share/nginx/html/*
##COPY --from=build /app/build /usr/share/nginx/html
#
#RUN apk add libcap
#
#RUN setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx
#RUN setcap 'cap_net_bind_service=+ep' /etc/nginx/nginx.conf

# switch to non-root user
#USER nginx:nginx

# fire up nginx
EXPOSE 8080

#WORKDIR /app/build

RUN ls -la

CMD [ "yarn", "start" ]

#CMD /bin/sh -c "node app.js"

#ENTRYPOINT ["/home/node/app/entrypoint.sh"]
