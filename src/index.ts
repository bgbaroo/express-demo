import dotenv from "dotenv";

import postgres from "./data/sources/postgres";
import initApp from "./init-app";

async function main(): Promise<void> {
  dotenv.config();

  return initApp({ db: postgres }).listenAndServe(process.env.PORT || 8000);
}

main();
