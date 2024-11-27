FROM node:20.17.0


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

ENV VITE_CLIENT_ID="7979b14f-f5f1-4579-9d3c-64f583d351b3"
ENV VITE_REDIRECT_URI="https://79b9-188-233-0-239.ngrok-free.app"


RUN npm run build -- --outDir=temp

RUN rm -rf /app/dist/*

CMD cp -r /app/temp/* /app/dist/
