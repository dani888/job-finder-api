FROM node:latest

WORKDIR /usr

COPY package.json ./

RUN npm install

COPY src src

EXPOSE 8080
CMD ["npm", "run", "start"]