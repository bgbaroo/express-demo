import app from "./init-app";

async function main(): Promise<void> {
  return app.listenAndServe(process.env.PORT || 8000);
}

main();
