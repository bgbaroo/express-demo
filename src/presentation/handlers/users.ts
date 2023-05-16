import { Request, Response } from "express";
import { IHandlerUsers } from "../routes/users";
import resp from "../response";
import {
  IUseCaseUserRegister,
  IUseCaseUserLogin,
  IUseCaseUserLogout,
  IUseCaseUserDeleteUser,
  IUseCaseUserChangePassword,
} from "../../domain/interfaces/usecases/user";
import { User } from "../../domain/entities/user";

export class HandlerUsers implements IHandlerUsers {
  private readonly usecaseRegister?: IUseCaseUserRegister;
  private readonly usecaseLogin?: IUseCaseUserLogin;
  private readonly usecaseLogout?: IUseCaseUserLogout;
  private readonly usecaseChangePassword?: IUseCaseUserChangePassword;
  private readonly usecaseDeleteUser?: IUseCaseUserDeleteUser;

  constructor(arg: {
    register: IUseCaseUserRegister;
    login: IUseCaseUserLogin;
    logout?: IUseCaseUserLogout;
    changePassword?: IUseCaseUserChangePassword;
    delete?: IUseCaseUserDeleteUser;
  }) {
    this.usecaseRegister = arg.register;
    this.usecaseLogin = arg.login;
    this.usecaseLogout = arg.logout;
    this.usecaseChangePassword = arg.changePassword;
    this.usecaseDeleteUser = arg.delete;
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
        return resp.InternalServerError(res, `failed to login user ${email}`);
      });
  }

  async logout(_req: Request, res: Response): Promise<Response> {
    if (this.usecaseLogout === undefined) {
      return resp.NotImplemented(res, "login");
    }

    return resp.NotImplemented(res, "login");
  }

  async changePassword(req: Request, res: Response): Promise<Response> {
    if (this.usecaseChangePassword === undefined) {
      return resp.NotImplemented(res, "login");
    }

    const { email, newPassword } = req.body;
    if (!email) {
      return resp.MissingField(res, "email");
    }
    if (!newPassword) {
      return resp.MissingField(res, "password");
    }

    return this.usecaseChangePassword
      .execute(new User({ email }), newPassword)
      .then((user) => resp.Ok(res, `password for ${user.email} updated`))
      .catch((err) => {
        console.error(`failed to change password for ${email}: ${err}`);
        return resp.InternalServerError(
          res,
          `failed to update password for ${email}`,
        );
      });
  }

  async deleteUser(_req: Request, res: Response): Promise<Response> {
    if (this.usecaseDeleteUser === undefined) {
      return resp.NotImplemented(res, "login");
    }

    return resp.NotImplemented(res, "deleteUser");
  }
}
