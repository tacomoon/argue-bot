FROM node:10.8.0

ENV ACCESS_TOKEN 'pass your access token'
ENV NODE_CONFIG_DIR '../config'

EXPOSE 3000

COPY . .
WORKDIR /src

CMD node index.js