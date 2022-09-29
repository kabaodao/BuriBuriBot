FROM node:latest

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
RUN touch osu_token.json

CMD ["node", "./src/index.js"]
