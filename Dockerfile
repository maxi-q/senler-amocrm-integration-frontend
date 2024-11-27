FROM node:20.17.0

WORKDIR /app

COPY package*.json ./

RUN rm -rf /app/dist

RUN npm install

COPY . ./

RUN npm run build