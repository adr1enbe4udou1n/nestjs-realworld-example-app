FROM node:lts-slim

WORKDIR /app

COPY node_modules node_modules/
COPY package.json ./
COPY prisma prisma/
COPY dist dist/

ENTRYPOINT ["node", "dist/src/main"]
