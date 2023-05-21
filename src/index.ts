import dotenv from "dotenv";

import postgres from "./data/sources/postgres";
import { App } from "./api/app";

import initApp from "./init-app";

async function main(): Promise<void> {
  dotenv.config();

  return initApp(App, { db: postgres }).listenAndServe(
    process.env.PORT || 8000,
  );
}

main();
