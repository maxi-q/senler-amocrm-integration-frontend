FROM node:20.17.0

ARG VITE_CLIENT_ID
ARG VITE_REDIRECT_URI

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build -- --outDir=temp

RUN rm -rf /app/dist/*

CMD cp -r /app/temp/* /app/dist/
