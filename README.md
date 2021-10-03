# ![RealWorld Example App](logo.png)

NestJS codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

## [RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with NestJS (with Feature orientation) including CRUD operations, authentication, routing, pagination, and more.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## Usage

### PostgreSQL

This project use **PostgreSQL** as main database provider. You can run it easily via `docker-compose up -d`.

Two databases will spin up, one for normal development and one dedicated for integrations tests.

### Run app

```sh
pnpm i
pnpm console:dev db seed # migrate and fill db with fake data
pnpm start:dev
```

And that's all, go to <http://localhost:3000/api>

### Validate API with Newman

Launch follow scripts for validating realworld schema :

```sh
pnpm console:dev db fresh # wipe all database for clean state
pnpm start
npx newman run postman.json --global-var "APIURL=http://localhost:3000/api" --global-var="USERNAME=johndoe" --global-var="EMAIL=john.doe@example.com" --global-var="PASSWORD=password"
```

### Full test suite

This project is fully tested via Jest, just run `pnpm test` for launching it.

Use `pnpm test:watch` for realtime test watching, perfect for TDD.
