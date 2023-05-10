# Setting up a TypeScript Express project (2023)

## Initialize a Node project

1. Create a Node module, either with `npm` or `pnpm` (this note will assume `npm`):

```shell
# With npm:
npm init;
```

This will give us a new, default `package.json` file

2. Change project type to ES Module

> This is done so that we can use `import foo from 'bar'` syntax (from ES Modules)
> instead of `const foo = require(bar)` (CommonJS):

In `package.json` file, add or change top-level key `"type"` with value `"module"`.

## Setup TypeScript

1. Install TypeScript

We will install TypeScript as _dev dependencies_, since we only need it during development.
This means that TypeScript package will not be downloaded in production environment.

```shell
npm install --save-dev typescript;
```

This installs `tsc`, the TypeScript compiler, which can now be executed using `npx`.
Verify that we do indeed have `tsc` and `npx` can see it via this dummy command:

```shell
npx tsc --version # This will print tsc version
```

In addition to package `typescript` itself, we need another package `@types/node`
to help decorate Node symbols with TypeScript types, so that TypeScript understands Node-specific
symbols in our source code (Node is native JavaScript, not TypeScript):

```shell
npm install -save-dev @types/node;
```

> In addition to using `npm` or `pnpm`, we can also use system package manager to install TypeScript,
> but this is not the convention of the course.
>
> If you used system package manager such as `brew` to install TypeScript,
> then you can invoke `tsc` directly by its name (if it's in `PATH`).
>
> ```shell
> # On macOS
> brew install typescript;
> # On Arch
> pacman -S typescript;
> # On Debian
> apt install typescript;
> # On Windows
> winget install TypeScript
>
> # Check if it's installed
> tsc --version
> ```

2. Initialize `tsconfig.json`

> Just like how `package.json` is a manifest for our project, `tsconfig.json` is a manifest
> specifically for TypeScript in our project.
>
> `tsconfig.json` includes configuration like the source directories, the output JavaScript editions,
> and other compiler options.

To initialize a new, default `tsconfig.json`, run:

```shell
npx tsc --init;
```

Now we should have a `tsconfig.json` at our package root.

3. Prepare `src` and `dist` directories

We will create 2 directories `src` and `dist` in our project, with `src` being the TS source code we write,
and `dist` being the compiled JS output that we will run with Node:

```shell
mkdir src dist; # This creates 2 new directories "src" and "dist"
```

Now, configure `tsc` to read source files from `src` and output JS files to `dist`, by updating `tsconfig.json`.

- We will configure `dist` first - go to `compilerOptions.outDir` and change the value to `"dist"`

- Then, go to top-level key `include`, and update it with value `["src/**/*"]` - this means that `tsc` will include
  all files with `.ts` extensions under `src` for compilation

4. Configure `tsconfig.json`

Other keys in `tsconfig.json` is also worth customizing. For our basic project, let's just mess with `compilerOptions` key.

We will use the following values for `compilerOptions`:

- `compilerOptions.module`: `"NodeNext"`

  This specifies module system of our TS program (not to be confused with `package.json`'s `"type"` key')

- `compilerOptions.moduleResolution`: `"NodeNext"`

  This specifies how `tsc` finds our imports

- `compilerOptions.target`: `"ES2020"`

  This specifies which JavaScript edition of the target output

- `compilerOptions.sourceMap`: `true`

  This will prompt `tsc` to create a mapper file `dist/foo.js.map` file for `src/foo.ts`, for debugging

The code block below is the bare minimum `tsconfig.json` that covers everything from steps 4-5:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2020",
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src/**/*"]
}
```

5. Add npm scripts (optional)

npm scripts are like aliases to long commands. They are configured in `package.json` under the key `"scripts"`.

- `npm run start`

  This script runs the JavaScript entrypoint code `dist/index.js`.

  Do this by adding new key `"start"` with value `"node dist/index.js"` to top-level key `"scripts"`

- `npm run dstart` (Compile TypeScript and run the resulting JavaScript output)

  This saves us time when we are repeatedly running and killing the program during development.

  Do this by first installing a new package `ts-node`:

  ```shell
  npm install --save-dev ts-node;
  ```

  We can use `ts-node` to imitate compiling TS and running JS.

  And then add a new key `"dstart"` with value `"ts-node src/index.ts"` to top-level key `"scripts"`

- `npm run dev` (Like `run dstart`, but with file watching)

  This script will restart the execution everytime a TS files changed.

  Do this by first adding a new package `ts-node-dev`:

  ```shell
  npm install --save-dev ts-node-dev;
  ```

  And then add a new key `"dev"` with value `"ts-node-dev src/index.ts"` to top-level key `"scripts"`

## Setup Express with TypeScript

### Install Express, as well as its type decoration package:

```shell
npm install express @types/express;
```

This installs 2 packages - (1) `express` Express library, and (2) `@types/express` Express type decorations
The type decoration package is required in order for TypeScript to understand Express code, since the Express
library itself is written in plain JavaScript.

## Verifying Express + TypeScript, and our npm scripts

Try writing a simple webserver using Express in TypeScript, and see if our setup steps done above work perfectly.

We will first begin with our entrypoint file, or `src/index.ts`:

```typescript
import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("hello, world!").end();
});

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});
```

And try running our `npm run` commands:

```shell
npm run build;
```

This should compile and produce a new file, `dist/index.js`.

```shell
npm run start;
```

This should start the server by executing the file generated from `npm run build` above.

```shell
# Remove previously compiled dist/index.js
rm dist/index.js;

# Use ts-node to directly execute the src/index.ts file
npm run dstart;
```

The first command deletes file `dist/index.js`, but the second command should re-compile,
and run the freshly compiled JavaScript code in `dist`

```shell
npm run dev;
```

This should start executing `src/index.ts`, and restart the program after the souce file changed.

Try this by changing a line of your code during `npm run dev`.

Note: [`tsconfig.json`](./tsconfig.json) used in this repository does not wholly follow this
document. Instead, it is configured to my liking, which includes extra type safety and null checks.
