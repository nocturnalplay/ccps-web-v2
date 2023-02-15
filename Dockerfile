FROM node:16.17.1-buster-slim

WORKDIR /usr/src/app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY package.json package-lock.json ./

COPY . .
RUN npm i
RUN npm run build
CMD ["npm","start"]