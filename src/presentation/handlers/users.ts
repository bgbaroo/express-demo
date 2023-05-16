import { Request, Response } from "express";
import { IHandlerUsers } from "../routes/users";
import resp from "../response";
import {
  IUsecaseUserRegister,
  IUsecaseUserLogin,
  IUsecaseUserLogout,
  IUsecaseUserDeleteUser,
  IUsecaseUserChangePassword,
} from "../../domain/interfaces/usecases/user";
import { User } from "../../domain/entities/user";

export class HandlerUsers implements IHandlerUsers {
  private readonly usecaseRegister?: IUsecaseUserRegister;
  private readonly usecaseLogin?: IUsecaseUserLogin;
  // private readonly usecaseLogout?: IUsecaseUserLogout;
  // private readonly usecaseChangePassword?: IUsecaseUserChangePassword;
  // private readonly usecaseDelete?: IUsecaseUserDeleteUser;

  constructor(arg: {
    usecaseRegister: IUsecaseUserRegister;
    usecaseLogin: IUsecaseUserLogin;
    usecaseLogout: IUsecaseUserLogout;
    usecaseDelete: IUsecaseUserDeleteUser;
  }) {
    this.usecaseRegister = arg.usecaseRegister;
    this.usecaseLogin = arg.usecaseLogin;
    // this.usecaseLogout = arg.usecaseLogout;
    // this.usecaseDelete = arg.usecaseDelete;
  }

  async register(req: Request, res: Response): Promise<Response> {
    if (this.usecaseRegister === undefined) {
      return resp.NotImplemented(res, "register");
    }

    const { email, password } = req.body;
    if (!email) {
      return resp.MissingField(res, "email");
    }
    if (!password) {
      return resp.MissingField(res, "password");
    }

    return this.usecaseRegister
      .execute(new User({ email }), password)
      .then((user) => {
        return resp.Created(res, { email: user.email, id: user.id });
      })
      .catch((err) => {
        console.error(`failed to create user ${email}: ${err}`);
        return resp.InternalServerError(res, "failed to create user");
      });
  }

  async login(req: Request, res: Response): Promise<Response> {
    if (this.usecaseLogin === undefined) {
      return resp.NotImplemented(res, "login");
    }

    const { email, password } = req.body;
    if (!email) {
      return resp.MissingField(res, "email");
    }
    if (!password) {
      return resp.MissingField(res, "password");
    }

    return this.usecaseLogin
      .execute(new User({ email }), password)
      .then((user) => {
        return resp.Ok(res, { email: user.email, id: user.id });
      })
      .catch((err) => {
        console.error(`failed to create user ${email}: ${err}`);
        return resp.InternalServerError(res, "failed to create user");
      });
  }

  async logout(_req: Request, res: Response): Promise<Response> {
    return resp.NotImplemented(res, "login");
  }

  async changePassword(_req: Request, res: Response): Promise<Response> {
    return resp.NotImplemented(res, "changePassword");
  }

  async deleteUser(_req: Request, res: Response): Promise<Response> {
    return resp.NotImplemented(res, "deleteUser");
  }
}
