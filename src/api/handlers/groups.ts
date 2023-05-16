import { Response } from "express";

import resp from "../response";
// import { AppErrors } from "../../domain/errors";
import { IHandlerGroups } from "../routes/groups";
import { IUseCaseGroupCreateGroup } from "../../domain/interfaces/usecases/group";
import { AuthRequest } from "../auth/jwt";
// import { Group } from "../../domain/entities/group";
import { IUseCaseUserGetUser } from "../../domain/interfaces/usecases/user";

export class HandlerGroups implements IHandlerGroups {
  private readonly create: IUseCaseGroupCreateGroup;
  private readonly getUser: IUseCaseUserGetUser;

  constructor(arg: {
    createGroup: IUseCaseGroupCreateGroup;
    getUser: IUseCaseUserGetUser;
  }) {
    this.create = arg.createGroup;
    this.getUser = arg.getUser;
  }

  async createGroup(req: AuthRequest, res: Response): Promise<Response> {
    if (this.create === undefined) {
      return resp.NotImplemented(res, "deleteGroup");
    }

    return resp.NotImplemented(res, "deleteGroup");
  }

  async deleteGroup(_req: AuthRequest, res: Response): Promise<Response> {
    if (this.getUser === undefined) {
      return resp.NotImplemented(res, "deleteGroup");
    }

    return resp.NotImplemented(res, "deleteGroup");
  }
}
