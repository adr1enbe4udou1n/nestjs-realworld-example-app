FROM node:lts-slim

RUN apt-get update && apt-get install -y \
  openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY node_modules node_modules/
COPY package.json ./
COPY prisma prisma/
COPY dist dist/

ENTRYPOINT ["node", "dist/src/main"]
