import http from "http";
import express, { Request, Response } from "express";

import resp from "./response";
import { IHandlerClipboards, RouterClipboard } from "./routes/clipboards";
import { IHandlerUsers, RouterUsers } from "./routes/users";
import { IHandlerGroups, RouterGroups } from "./routes/groups";

export type HandlerFunc = (Request, Response) => Promise<Response>;

export class App {
  private app: express.Express;

  constructor(arg: {
    clipboard: IHandlerClipboards;
    user: IHandlerUsers;
    group: IHandlerGroups;
  }) {
    // Setup our Express app
    this.app = express();
    this.app.use(express.json());

    this.app.get("/status", (_req: Request, res: Response) => {
      return resp.Ok(res, "ok");
    });

    // Register routers
    this.app.use("/clipboards", new RouterClipboard(arg.clipboard).router());
    this.app.use("/users", new RouterUsers(arg.user).router());
    this.app.use("/groups", new RouterGroups(arg.group).router());
  }

  async listenAndServe(port: number | string): Promise<void> {
    const server = this.app.listen(port, () => {
      console.log(`Express server is listening on ${port}`);
    });

    shutdown(server, "SIGINT");
    shutdown(server, "SIGTERM");
  }
}

async function shutdown(server: http.Server, signal: string) {
  // Graceful shutdown for HTTP server
  process.on(signal, () => {
    console.log(`${signal} signal received: closing Express server`);

    server.close(() => {
      console.log(`Express server closed due to ${signal}`);
      return Promise.resolve();
    });
  });
}
