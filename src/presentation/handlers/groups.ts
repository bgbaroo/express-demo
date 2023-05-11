import { Request, Response } from "express";

import resp from "../response";
import { IHandlerGroups } from "../routes/groups";
import { IUsecaseGroup } from "../../domain/interfaces/usecases/group";

export class HandlerGroups implements IHandlerGroups {
  private usecase: IUsecaseGroup;

  constructor(usecase: IUsecaseGroup) {
    this.usecase = usecase;
  }

  async createGroup(_req: Request, res: Response): Promise<Response> {
    console.log(this.usecase === undefined);
    return resp.NotImplemented(res, "createGroup");
  }

  async deleteGroup(_req: Request, res: Response): Promise<Response> {
    console.log(this.usecase === undefined);
    return resp.NotImplemented(res, "deleteGroup");
  }
}
