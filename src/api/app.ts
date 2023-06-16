import http from "http";
import express, { Request, Response } from "express";

import resp from "./response";
import routes from "./routes";
import { AuthRequest } from "./auth/jwt";
import { IHandlerClipboards, IHandlerGroups, IHandlerUsers } from "./handlers";

// Handlers that do not require authentication middleware
export type HandlerFunc = (Request, Response) => Promise<Response>;
// Handlers that require authentication middleware
export type HandlerFuncAuth = (AuthRequest, Response) => Promise<Response>;

export interface ArgCreateApp {
  user: IHandlerUsers;
  group: IHandlerGroups;
  clipboard: IHandlerClipboards;
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
      routes.newRouterClipboard(arg.clipboard).router(),
    );
    this._server.use("/users", routes.newRouterUsers(arg.user).router());
    this._server.use("/groups", routes.newRouterGroups(arg.group).router());
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
