import { HandlerFunc, HandlerFuncAuth } from "../app";
import { authenticateJwt } from "../auth/jwt";
import { Router } from "./router";

export interface IHandlerUsers {
  register: HandlerFunc;
  login: HandlerFunc;
  // Require auth
  logout: HandlerFuncAuth;
  changePassword: HandlerFuncAuth;
  deleteUser: HandlerFuncAuth;
}

export class RouterUsers extends Router {
  constructor(handler: IHandlerUsers) {
    super();

    this.router().post("/register", handler.register.bind(handler));
    this.router().post("/login", handler.login.bind(handler));

    this.router().post(
      "/logout",
      authenticateJwt,
      handler.logout.bind(handler),
    );
    this.router().post(
      "/pw",
      authenticateJwt,
      handler.changePassword.bind(handler),
    );
    this.router().delete(
      "/",
      authenticateJwt,
      handler.deleteUser.bind(handler),
    );
  }
}
