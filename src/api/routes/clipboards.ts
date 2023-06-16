import { authenticateJwt } from "../auth/jwt";
import { IHandlerClipboards } from "../handlers";
import { Router } from "./router";

export function newRouterClipboard(handler: IHandlerClipboards): Router {
  return new RouterClipboard(handler);
}

class RouterClipboard extends Router {
  constructor(handler: IHandlerClipboards) {
    super();

    this.router().get(
      "/group/:groupId",
      authenticateJwt,
      handler.getGroupClipboards.bind(handler),
    );
    this.router().get(
      "/group",
      authenticateJwt,
      handler.getGroupsClipboards.bind(handler),
    );
    this.router().get(
      "/:id",
      authenticateJwt,
      handler.getClipboard.bind(handler),
    );
    this.router().get(
      "/",
      authenticateJwt,
      handler.getClipboards.bind(handler),
    );
    this.router().post(
      "/",
      authenticateJwt,
      handler.createClipboard.bind(handler),
    );
    this.router().delete(
      "/:id",
      authenticateJwt,
      handler.deleteClipboard.bind(handler),
    );
    this.router().delete(
      "/",
      authenticateJwt,
      handler.deleteClipboards.bind(handler),
    );
  }
}
