import express, { Express, Request, Response } from "express";
import { routes as clipboardRoutes } from "./routes/clipboard";
import { routes as userRoutes } from "./routes/users";
import { routes as groupRoutes } from "./routes/groups";
import { Ok } from "./response";

export async function listenAndServe(port: number | string) {
  // Setup our Express app
  const app: Express = express();
  app.use(express.json());

  app.get("/test", (_req, res) => {
    return Ok("ok", res);
  });

  // Register routes
  app.use("/clipboards", clipboardRoutes());
  app.use("/users", userRoutes());
  app.use("/groups", groupRoutes());

  // Listen and serve
  app.listen(port, () => {
    console.log(`Express server is listening on ${port}`);
  });
}
