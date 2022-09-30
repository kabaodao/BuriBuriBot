FROM node:latest

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY ../.env .
RUN touch osu_token.json

CMD ["node", "./src/index.js"]
