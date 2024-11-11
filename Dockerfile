FROM node:21-alpine3.18

RUN apk add --no-cache bash libreoffice openjdk8-jre
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install -g @nestjs/cli

USER node

WORKDIR /home/node/app