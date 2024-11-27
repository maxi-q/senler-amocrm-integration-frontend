FROM node:20.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build -- --outDir=temp

RUN rm -rf /app/dist/*

CMD cp -r /app/temp/* /app/dist/
