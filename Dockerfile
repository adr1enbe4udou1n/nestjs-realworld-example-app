FROM node:16-slim

WORKDIR /app

COPY node_modules node_modules/
COPY package.json ./
COPY dist dist/

ENV MIKRO_ORM_CLI_USE_TS_NODE=false

ENTRYPOINT ["node", "dist/main"]
