# express-demo

Simple web back-end written in TypeScript.

The demo will include:

1. [Setting up](/SETUP.md) the project

   Initializing Node.js modules for Express.js development using TypeScript

2. Basic webserver with Express, with [Clean Architecture](./src/) structure

   Organizing your code into separate module units, each having one responsibility

3. Connecting to databases with [ORM](./src/data/sources/postgres/)

   Use ORM to simplify modeling database data in our code

4. [Authorizations](./src/api/auth/)

   Protect private resources with industry standard strategies.

5. (TODO) Other advanced concepts

6. [Testing](./test/)

   Write tests to help catch bugs before deployment

## Features

This demo back-end app will be a clipboard/text sharing service.

It support basic CRUD operations, as well as authorizations and user groups.

I will try to make it use both in-memory cache, Redis store, and a SQL database.

Code is organized following the [clean architecture](https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/) mindset.

The HTTP APIs are not yet stable, so they are not documented.

## Other references

- [Style guide](https://google.github.io/styleguide/tsguide.html)

  Code style guide, for convention

- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

  ✅ Do: use types `string`, `number`, `boolean`, `object`

  ❌ Don't: use types `String`, `Number`, `Boolean`, `Object`
