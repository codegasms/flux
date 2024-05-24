FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apk add make gcc
RUN npm install -g node-gyp
RUN npm install
COPY . .
RUN npm run build
CMD node --experimental-require-module dist/main.js
