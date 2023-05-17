import { HandlerFuncAuth } from "../app";
import { authenticateJwt } from "../auth/jwt";
import { Router } from "./router";

export interface IHandlerGroups {
  createGroup: HandlerFuncAuth;
  deleteGroup: HandlerFuncAuth;
  deleteGroups: HandlerFuncAuth;
}

export class RouterGroups extends Router {
  constructor(handler: IHandlerGroups) {
    super();

    this.router().post("/", authenticateJwt, handler.createGroup.bind(handler));
    this.router().delete(
      "/:id",
      authenticateJwt,
      handler.deleteGroup.bind(handler),
    );
    this.router().delete(
      "/",
      authenticateJwt,
      handler.deleteGroups.bind(handler),
    );
  }
}
