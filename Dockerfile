FROM node:22-bullseye as build 
 
WORKDIR /app 
 
COPY package*.json pnpm-lock.yaml ./ 
 
RUN npm install -g pnpm@latest && \ 
    pnpm config set fetch-timeout 60000 && \ 
    pnpm install --frozen-lockfile 
 
COPY . ./ 
 
RUN pnpm run build