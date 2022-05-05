FROM node:16-alpine

WORKDIR /app

COPY node_modules node_modules/
COPY package.json ./
COPY dist dist/

RUN sed -i /useTsNode/d package.json

ENTRYPOINT ["npm", "run", "start:prod"]
