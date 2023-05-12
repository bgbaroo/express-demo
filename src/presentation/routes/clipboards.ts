import { HandlerFunc } from "../app";
import { Router } from "./router";

export interface IHandlerClipboards {
  createClipboard: HandlerFunc;
  getClipboard: HandlerFunc;
  getClipboards: HandlerFunc;
  deleteClipboard: HandlerFunc;
  deleteClipboards: HandlerFunc;
}

export class RouterClipboard extends Router {
  constructor(handler: IHandlerClipboards) {
    super();
    this.router().post("/", handler.createClipboard.bind(handler));
    this.router().get("/", handler.getClipboard.bind(handler));
    this.router().delete("/", handler.deleteClipboard.bind(handler));
  }
}
