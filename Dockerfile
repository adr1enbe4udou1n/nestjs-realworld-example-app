FROM node:16-alpine

WORKDIR /app

COPY node_modules node_modules/
COPY dist dist/

ENTRYPOINT ["node", "dist/src/main"]
