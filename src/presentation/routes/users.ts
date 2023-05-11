import { Router } from "./router";
import { HandlerFunc } from "../app";

export interface IHandlerUsers {
  register: HandlerFunc;
  login: HandlerFunc;
  changePassword: HandlerFunc;
  deleteUser: HandlerFunc;
}

export class RouterUsers extends Router {
  constructor(handler: IHandlerUsers) {
    super();
    this.router().post("/register", handler.register.bind(handler));
    this.router().post("/login", handler.login.bind(handler));
    this.router().post("/pw", handler.changePassword.bind(handler));
    this.router().delete("/", handler.deleteUser.bind(handler));
  }
}
