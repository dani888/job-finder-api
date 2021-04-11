FROM node:latest

WORKDIR /usr

COPY package.json ./

RUN npm install

COPY src src
COPY .env .env

EXPOSE 8080
CMD ["npm", "run", "start"]