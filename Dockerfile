FROM node:latest

ENV DISCORD_TOKEN=$DISCORD_TOKEN

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "./src/index.js"]
