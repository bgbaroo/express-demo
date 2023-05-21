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

export interface ArgCreateApp {
  clipboard: IHandlerClipboards;
  user: IHandlerUsers;
  group: IHandlerGroups;
}

export class App {
  protected readonly _server: express.Express;

  constructor(arg: ArgCreateApp) {
    // Setup our Express app
    this._server = express();
    this._server.use(express.json());

    this._server.get("/status", (_req: Request, res: Response) => {
      return resp.Ok(res, "ok");
    });

    // Register routers
    this._server.use(
      "/clipboards",
      new RouterClipboard(arg.clipboard).router(),
    );
    this._server.use("/users", new RouterUsers(arg.user).router());
    this._server.use("/groups", new RouterGroups(arg.group).router());
  }

  async listenAndServe(port: number | string): Promise<void> {
    const server = this._server.listen(port, () => {
      console.log(`Express server is listening on ${port}`);
    });

    shutdown(server, "SIGINT");
    shutdown(server, "SIGTERM");
  }
}

export class AppDev extends App {
  constructor(arg: ArgCreateApp) {
    super(arg);
  }

  server(): express.Express {
    return this._server;
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
