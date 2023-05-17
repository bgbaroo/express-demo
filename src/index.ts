import { init as initApp } from "./init";

async function main(): Promise<void> {
  return initApp().listenAndServe(process.env.PORT || 8000);
}

main();
