import { authenticateJwt } from "../auth/jwt";
import { IHandlerGroups } from "../handlers";
import { Router } from "./router";

export function newRouterGroups(handler: IHandlerGroups): Router {
  return new RouterGroups(handler);
}

class RouterGroups extends Router {
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
