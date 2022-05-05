FROM node:16-alpine

WORKDIR /app

COPY node_modules node_modules/
COPY dist dist/

ENV MIKRO_ORM_CLI="./dist/mikro-orm.config.js"

ENTRYPOINT ["node", "dist/main"]
