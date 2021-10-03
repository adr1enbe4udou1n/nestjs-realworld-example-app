FROM node:14-alpine
RUN apk --no-cache add curl

COPY /package.json /pnpm-lock.yaml /app/
COPY /dist /app/dist
WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.7.js | node - add --global pnpm@6
RUN pnpm i --frozen-lockfile --prod

ENTRYPOINT ["node", "dist/main"]
