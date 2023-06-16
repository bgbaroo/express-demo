import { authenticateJwt } from "../auth/jwt";
import { IHandlerUsers } from "../handlers";
import { Router } from "./router";

export function newRouterUsers(handler: IHandlerUsers): Router {
  return new RouterUsers(handler);
}

class RouterUsers extends Router {
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
