# express-demo

Simple web back-end written in TypeScript.

The demo will include:

1. [Setting up](/SETUP.md) the project

2. Basic webserver with Express, with [Clean Architecture](./src/) structure

3. Connecting to databases with [ORM](./ORM.md)

4. (TODO) Authorizations

5. (TODO) Other advanced concepts

6. [Testing](./TEST.md)

## Features

This demo back-end app will be a clipboard/text sharing service.

It (will) support basic CRUD operations, as well as authorizations and user groups.

I will try to make it use both in-memory cache, Redis store, and a SQL database.

Code is organized following the [clean architecture](https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/) mindset.

The HTTP APIs are not yet stable, so they are not documented.
