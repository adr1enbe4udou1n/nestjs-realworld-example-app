FROM node:lts-slim

RUN npm install pm2 -g && \
  apt-get update && apt-get install -y openssl && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY node_modules node_modules/
COPY package.json prisma.config.ts ./
COPY prisma prisma/
COPY dist dist/

ENTRYPOINT ["pm2-runtime", "dist/src/main.js", "-i", "max"]
