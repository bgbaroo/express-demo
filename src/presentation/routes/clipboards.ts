import { HandlerFunc } from "../app";
import { Router } from "./router";

export interface IHandlerClipboards {
  createClipboard: HandlerFunc;
  getClipboard: HandlerFunc;
  deleteClipboard: HandlerFunc;
}

export class RouterClipboard extends Router {
  constructor(handler: IHandlerClipboards) {
    super();
    this.router().post("/", handler.createClipboard.bind(handler));
    this.router().get("/", handler.getClipboard.bind(handler));
    this.router().delete("/", handler.deleteClipboard.bind(handler));
  }
}
