import { HandlerFuncAuth } from "../app";
import { authenticateJwt } from "../auth/jwt";
import { Router } from "./router";

export interface IHandlerGroups {
  createGroup: HandlerFuncAuth;
  deleteGroup: HandlerFuncAuth;
}

export class RouterGroups extends Router {
  constructor(handler: IHandlerGroups) {
    super();
    this.router().post("/", authenticateJwt, handler.createGroup.bind(handler));
    this.router().delete(
      "/",
      authenticateJwt,
      handler.deleteGroup.bind(handler),
    );
  }
}
