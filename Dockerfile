FROM node:16-alpine

WORKDIR /app

COPY node_modules node_modules/
COPY /package.json ./

COPY /dist dist

ENTRYPOINT ["npm", "run", "start:prod"]
