# [Prisma ORM](https://www.prisma.io)

This project uses Prisma as ORM library, to map our data models
to SQL queries. We choose to use ORM because writing raw SQL
queries in fast-moving world is a little bit of a headache.

## Installing Prisma

To start, use `npm` to install `prisma` package:

> Note: Unlike Express, we don't need type annotation package with Prisma

```shell
npm install --save-dev prisma;
```

This will give us `npx` script `prisma`, which we can verify:

```shell
npx prisma --version;
```

## Initialize Prisma Schema

Just as `package.json` is your project manifest, and `tsconfig.json` is TypeScript-specific
configuration, Prisma also has its own manifest files with `.prisma` extension and format,
called [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema).

As the file extension implies, this file is not a JSON,
or other data interchange format - it has its own synyax that you must follow.

The schema defines 3 entities: **(1) datasource**, i.e. database vendor,
**(2) generator**, i.e. schema-to-code generator, and **(3) the data models**,
which defines our database shape and the relationship.

Prisma main idea is that you declare your database manifest in the Schema,
and Prisma will then generate _Prisma Client_, a type-safe query builder,
based on your Schema.

The Prisma Client talks to the database and provides ORM mapping for us,
which our application code can then import and use to talk to the databases,
so we can just focus on writing application code.

> The Prisma-generated client (from the Schema) defaults `./node_modules/.prisma/client`

We can write these files manually, but it's best to let Prisma generate the templates for us.
To initialize the template with PostgreSQL as datasource, use the Prisma `npx` script:

```shell
# Generate a new Schema for PostgreSQL
npx prisma init --datasource-provider=postgresql
```

This creates a new top-level directory `prisma`, and generates a new Prisma Schema
at [`./prisma/schema.prisma`](./prisma/schema.prisma).

## [Define data model in the Schema](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model)

After the Schema is initialized, we can now define our data models.

In this tutorial, the models represent our SQL tables and
their relationship, since our datasource is an SQL database.

> Prisma Schema can also define data models for No-SQL such as MongoDB

Let's first discuss our data models - in this tutorial, we will have 3 SQL tables:
(1) `users`, (2) `groups`, and (3) `clipboards`. Each clipboard (an entry in table
`clipboards`) will have its corresponding owner (a user), and each user can belong
to 0-or-many groups.

Fields that will be auto-generated will be decorated with `@default`, which means that our
appication code won't have to come up with fields, when inserting entries via Prisma.

### Entities

All 3 entities use UUID strings as primary keys, which is auto-generated
by Prisma (via `uuid()` Prisma function), and all 3 have `createdAt` column,
which is set to the write time (via `now()` Prisma function).

The model name is singular [PascalCase](https://en.wikipedia.org/wiki/Camel_case),
and Prisma will map the Schema model name to SQL tables with plural
all-lowercase table names. For example, `model User` will be mapped to table `users`.

### Relations

In this tutorial, we have a one-to-one relationship for clipboard and user
(a clipboard can only have 1 user). We also have a many-to-many (M-N) relationship
for user-group (a user can be long to 1-or-more groups).

This can be expressed in Prisma Schema like so:

```prisma
model Clipboard {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?

  // Since a User can have many Clipboards,
  // but a Clipboard can only have 1 User,
  // Clipboard relates to model User,
  // with Clipboard.userId being User.id

  user      User     @relation(fields: [userId], references: [id])
  userId    String
}

model User {
  id         String   @id @default(uuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  email      String   @unique
  clipboards Clipboard[]

  // A User can have >1 Group(s)
  groups     UserOnGroup[]
}

// Relation table required for M-N relationship between User and Group
model UserOnGroup {
  id      String @id @default(uuid())

  // This model refers to User.id via UserOnGroup.userId
  user    User   @relation(fields: [userId], references: [id])
  userId  String

  // This model refers to Group.id via UserOnGroup.groupId
  group   Group  @relation(fields: [groupId], references: [id])
  groupId String
}

model Group {
  id        String   @id @default(uuid())
  createdAt DateTime @updatedAt
  updatedAt DateTime @default(now())
  name      String   @unique

  // A Group can have >1 User(s)
  users     UserOnGroup[]
}
```

In addition to `model Clipboard`, `model User`, and `model Group`, we also have
a relation table to map M-N relationship `model UserOnGroup`.

Now our data models are ready, but we still don't have the Prisma Client.

## Generate the Prisma Client

To generate the Prisma Client, use `npm` to install `@prisma/client`. As part of
the install script, the installation invokes `npx` script `prisma generate`, which
read the Schema and builds a new client based on the Schema.

We will not use `--save-dev` option, since we need the client in our production environment
too. When we push our project to a server, it will pull down `@prisma/client` and
re-generate a new client that is optimized to the server.

> Each time our data model changes, we'll need to re-generate a new Prisma Client
> with `npx prisma generate`. The package installation, though, is required only once.

```shell
npm install @prisma/client;
```

> If your Schema was bad, the command above should report an error. Should this happen,
> update your Schema and generate the Client with:
>
> ```shell
> npx prisma generate;
> ```

After your Client is successfully generated, we are ready to use the Client in our app code.

### Placing `prisma` directory in different place

By default, the `npx prisma init` commands creates `prisma` directory at the project root.
This can interfere with our project code organization, especially when we employ clean
architecture in our code.

You can, in fact, put your `prisma` directory anywhere under the project root. But you will
need to instruct `npx` script `prisma generate` to find your `prisma` from a non-default
location. Do this with `--schema` flag.

For example, if you moved your `prisma` directory from `./prisma` to `./data/sources/prisma`,
and your schema filename is `schema.prisma`, then you'll need to supply
`--schema ./src/data/sources/postgres/prisma/schema.prisma` in your client generation command:

```shell
npx prisma generate --schema ./src/data/sources/postgres/prisma/schema.prisma;
```

> Note: You can put the above command in an `npm run` script by modifying your `package.json`.

## PostgreSQL connection

Before we update our code to use Prisma, let's first connect to the database.
The connection to the database, like our data models, was defined in
[Prisma Schema](./prisma/schema.prisma).

The connection to the DB is specified via a URL, whose scheme varies amoung database vendors.

> Since the URL may contain sensitive information such as database passwords or other secrets,
> it is advised to always use some kind of secret management for the URLs, both in development
> and production.

One of the simplest way to manage secrets in development without exposing them is via
the _environment variables (also called **env**)_, which is a key-value dictionary.

Envs are good because it is cross-platform, portable, can be supplied in many forms,
and language agnostic.

In this tutorial, we will be using env to manage connection URL, leveraging Prisma's
built-in mechanisms to obtain env declared in [`/.env`](./.env) file.

When we install `@prisma/client`, the install script also created the file
[`.env`](./.env) for us in the project root, initialized with a nice template for us:

```shell
# File /.env
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Now we can just substitute `johndoe` with our Postgres username, `randompassword`
with Postgres username's password, `mydb` with our Postgres DB name, and `public`
with our Postgres schema.

The `localhost:5432` means that PostgreSQL is listening on `localhost` port 5432.

For example, my PostgreSQL user is `postgres`, whose password is `postgres`,
and PostgreSQL is listening at `localhost@5432`. My database name is `express-demo`,
and the PostgreSQL schema (not to be confused with Prisma Schema) is `public`,
then my URL would look like so:

```shell
# File /.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/express-demo?schema=public"
```

> For other envs, we can use `dotenv` package to manage envs, e.g. for Redis connection,
> but this is beyond the scope of this tutorial.

Now, update your Prisma Schema to use envs with the `datasource` key:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

This will instruct the generator to create a Prisma Client which takes its connection URL
from an env with key `DATABASE_URL`, which is what we just put in [`./.env`](./.env).

## SQL migration

After we defined our data models and database connection, we still can't just jump right back
to coding.

We still need to prepare the database, i.e. defining SQL tables with exactly
the same fields and relations as with our Prisma Schema data models.

But this is difficult - you might define invalid tables, with broken relations, etc.
The best way to do this is to let Prisma do it for you.

With Prisma, `npx prisma migrate` performs database operations that reshape the database
to match with our Prisma data models.

There're 2 flavors for Prisma migration - (1) development and (2) production.

We will mostly be running development migrations, as development period is where most of
table alterations happen. The development migrations are toggled with `--dev` flag.

We run production migrations when the production database needs to be altered to match
with the new code we're deploying.

`prisma migrate` takes the same `--schema` flag as with `prisma generate`, so if you are
migrating your databases from schema `./src/data/sources/postgres/prisma/schema.prisma`,
you will need to run:

```shell
npx prisma migrate --dev --schema ./src/data/sources/postgres/prisma/schema.prisma;
```

> Note: You can put the above command in an `npm run` script by modifying your `package.json`.

This will prompt Prisma to read the Schema file, parses the data models, and alters any
out-of-sync tables to match the data models declared in the Schema.

You can verify that the correct tables were created during migration manually, or just
try to write some code - if any mistakes were made, Prisma will complain in our application
code that the tables are some how incorrect.

## Using Prisma Client in our code

After your Schema data models compiles, and migrations ran successfully, we can now
start to add Prisma to our application code.

Connecting to the databases is as simple as importing `PrismaClient` object from
`@prisma/client`.

The following code imports `PrismaClient` generated from the step above and initializes
a TypeScript Prisma Client:

```typescript
import { PrismaClient } from "@prisma/client";

// Our ORM provider
const prisma = new PrismaClient();
```

The object was generated with our Prisma Schema, so it had all the
neccessary information to connect to the databases and map the tables back
to TypeScript types and symbols.

All models are available as top-level object fields of variable `prisma`,
for example, the `users` table (`User` model) is represented in `prisma`
as `prisma.user`.

### Basic SQL operations

The arguments to `prisma` object methods are usually objects.
And for DB operations, they usually have top-level key `data` for our entry data.

Other top-level keys are still related to the DB operations, but not our data.
For example, they might be used to fine-tune database performance metrics or behaviors.

### `create`, `findFirst`, and `findMany`

We can try inserting a new entry for model `User` with `prisma.user.create`,
and then immediately query for that new user with `prisma.user.findFirst`.

`create` method creates a single entry, and `findFirst` returns the first entry
Prisma found that matches some conditions given. In this example, the `findFirst`
condition is that the entry's `email` matches with `newUser`'s.

> Note: we use `await` to make 2 database operations synchronous - we first
> insert and wait until that insertion is finished, before we progress to read
> it back to compare it.

```typescript
import { PrismaClient } from "@prisma/client";

async function ormDemo() {
  const prisma = new PrismaClient();

  // Insert
  const newUser = await prisma.user.create({
    data: {
      email: "newUser@foo.bar",
    },
  });

  // Get a User from the database whose email matches newUser.email
  const sameNewUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: newUser.email,
      },
    },
  });

  console.log("user inserted");
  console.table(newUser);
  console.log("user queried");
  console.table(sameNewUser);

  // All users in table `users` with 0 conditions
  const allUsers = await prisma.user.findMany();
  console.table(allUsers);
}

ormDemo();
```

### [Filter and conditions](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)

We can utilize the SQL `WHERE` clause with `where` object key:

```typescript
const threeYearsAgo = new Date(
  new Date().setFullYear(new Date().getFullYear() - 3),
);

// Old users created in the database before 3 years ago from now
const oldUsers = await prisma.user.findMany({
  where: {
    createdAt: {
      gte: threeYearsAgo,
    },
  },
});
```

### Prisma type definitions

You might be curious what type is variable `newUser` from the above `create` snippet.
Is it your application code's entity class `User`? Or is it untyped?

The answer is it is typed, but the type is not from your application code. When we generate
the client, the client also creates a new type for use just with Prisma. The type maps to
our Schema models. For example, Prisma type generated from `model User` might look like this:

```typescript
type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
};
```

You can see that the post (`model User.clipboards`) is not included in this type. This is because
from the SQL table viewpoint, table `users` don't have column `clipboards`.
Instead, the relation is implemented in table `clipboards` as column `userId`, hence there's no
clipboards available from this SQL-based Prisma-generated type.

If you want to access the `newUser` clipboards, you will need Prisma extra helper types, which
will be returned automatically if you supply a `include` object key to `findMany`:

```typescript
const users = await prisma.user.findMany({
  include: { clipboards: true }, // The key `clipboards` is from the Schema model User
});
```

Now that we have ORM in our code, we can progress and write code that utilize SQL databases
without having to write a single SQL query. For more examples, refer to
[Prisma docs](https://www.prisma.io/docs)
