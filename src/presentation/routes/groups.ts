import { HandlerFunc } from "../app";
import { Router } from "./router";

export interface IHandlerGroups {
  createGroup: HandlerFunc;
  deleteGroup: HandlerFunc;
}

export class RouterGroups extends Router {
  constructor(handler: IHandlerGroups) {
    super();
    this.router().post("/", handler.createGroup.bind(handler));
    this.router().delete("/", handler.deleteGroup.bind(handler));
  }
}
