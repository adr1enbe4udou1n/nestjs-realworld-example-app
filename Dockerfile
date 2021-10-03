FROM node:14-buster
RUN apt-get install -y tzdata

COPY /dist /package.json /pnpm-lock.yaml /app/
WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.7.js | node - add --global pnpm@6
RUN pnpm i --frozen-lockfile --prod

ENTRYPOINT ["node", "dist/main"]
