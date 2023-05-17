import { HandlerFuncAuth } from "../app";
import { authenticateJwt } from "../auth/jwt";
import { Router } from "./router";

export interface IHandlerClipboards {
  createClipboard: HandlerFuncAuth;
  getClipboard: HandlerFuncAuth;
  getClipboards: HandlerFuncAuth;
  getGroupClipboards: HandlerFuncAuth;
  getGroupsClipboards: HandlerFuncAuth;
  deleteClipboard: HandlerFuncAuth;
  deleteClipboards: HandlerFuncAuth;
}

export class RouterClipboard extends Router {
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
