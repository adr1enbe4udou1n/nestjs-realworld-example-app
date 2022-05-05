FROM node:16-alpine
RUN apk --no-cache add curl

COPY /package.json /pnpm-lock.yaml /app/

WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@7
RUN pnpm i --prod

COPY /dist dist

ENTRYPOINT ["npm", "run", "start:prod"]
