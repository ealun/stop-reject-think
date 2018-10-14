FROM node:10.10.0-slim

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/

ENV NPM_CONFIG_LOGLEVEL info
RUN npm i

COPY . /app

EXPOSE 8080

CMD ["npm", "start"]
