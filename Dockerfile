FROM node:14-buster
RUN apt-get install -y tzdata

COPY /dist /node_modules /package.json /app/
WORKDIR /app

ENTRYPOINT ["npm", "run", "start:prod"]
