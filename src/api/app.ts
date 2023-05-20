import http from "http";
import express, { Request, Response } from "express";

import resp from "./response";
import { IHandlerClipboards, RouterClipboard } from "./routes/clipboards";
import { IHandlerUsers, RouterUsers } from "./routes/users";
import { IHandlerGroups, RouterGroups } from "./routes/groups";
import { AuthRequest } from "./auth/jwt";

// Handlers that do not require authentication middleware
export type HandlerFunc = (Request, Response) => Promise<Response>;
// Handlers that require authentication middleware
export type HandlerFuncAuth = (AuthRequest, Response) => Promise<Response>;

export class App {
  server: express.Express;

  constructor(arg: {
    clipboard: IHandlerClipboards;
    user: IHandlerUsers;
    group: IHandlerGroups;
  }) {
    // Setup our Express app
    this.server = express();
    this.server.use(express.json());

    this.server.get("/status", (_req: Request, res: Response) => {
      return resp.Ok(res, "ok");
    });

    // Register routers
    this.server.use("/clipboards", new RouterClipboard(arg.clipboard).router());
    this.server.use("/users", new RouterUsers(arg.user).router());
    this.server.use("/groups", new RouterGroups(arg.group).router());
  }

  async listenAndServe(port: number | string): Promise<void> {
    const server = this.server.listen(port, () => {
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
