import dotenv from "dotenv";

import postgres from "./data/sources/postgres";
import { App } from "./api/app";
import init from "./init";

async function main(): Promise<void> {
  dotenv.config();

  return init(App, { db: postgres }).listenAndServe(process.env.PORT || 8000);
}

main();
