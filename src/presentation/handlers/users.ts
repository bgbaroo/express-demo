import { Request, Response } from "express";

import resp from "../response";
import { IHandlerUsers } from "../routes/users";
import { IUsecaseUser } from "../../domain/interfaces/usecases/user";

export class HandlerUsers implements IHandlerUsers {
  private usecase: IUsecaseUser;

  constructor(usecase: IUsecaseUser) {
    this.usecase = usecase;
  }

  async register(_req: Request, res: Response): Promise<Response> {
    return resp.NotImplemented(res, "register");
  }

  async login(_req: Request, res: Response): Promise<Response> {
    return resp.NotImplemented(res, "login");
  }

  async changePassword(_req: Request, res: Response): Promise<Response> {
    return resp.NotImplemented(res, "changePassword");
  }

  async deleteUser(_req: Request, res: Response): Promise<Response> {
    return resp.NotImplemented(res, "deleteUser");
  }
}
