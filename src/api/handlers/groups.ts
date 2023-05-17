import { Response } from "express";

import resp from "../response";
import { IHandlerGroups } from "../routes/groups";
import { AuthRequest } from "../auth/jwt";
import { AppErrors } from "../../domain/errors";
import { GroupOwner } from "../../domain/entities/group-owner";
import { Group } from "../../domain/entities/group";
import { User } from "../../domain/entities/user";
import {
  IUseCaseGroupCreateGroup,
  IUseCaseGroupDeleteGroup,
} from "../../domain/interfaces/usecases/group";

export class HandlerGroups implements IHandlerGroups {
  private readonly create: IUseCaseGroupCreateGroup;
  private readonly delete: IUseCaseGroupDeleteGroup;

  constructor(arg: {
    createGroup: IUseCaseGroupCreateGroup;
    deleteGroup: IUseCaseGroupDeleteGroup;
  }) {
    this.create = arg.createGroup;
    this.delete = arg.deleteGroup;
  }

  async createGroup(req: AuthRequest, res: Response): Promise<Response> {
    const { name, members } = req.body;
    if (!name) {
      return resp.MissingField(res, "groupName");
    }

    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.create
      .execute(
        new Group({
          name,
          owner: new GroupOwner({ id: userId, email }),
          users: members.map((member) => new User({ email: member.email })),
        }),
      )
      .then((group) => resp.Created(res, group))
      .catch((err) => {
        console.error(
          `failed to create group ${name} by owner ${email} with members ${members}: ${err}`,
        );
        return resp.InternalServerError(res, `failed to create group ${name}`);
      });
  }

  async deleteGroup(req: AuthRequest, res: Response): Promise<Response> {
    const { id } = req.body;
    if (!id) {
      return resp.MissingField(res, "id");
    }

    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.delete
      .execute(userId, id)
      .then((group) =>
        resp.Ok(res, `group ${group.name} deleted by user ${email}`),
      )
      .catch((err) => {
        console.error(`failed to delete group: ${err}`);
        return resp.InternalServerError(res, "failed to delete group");
      });
  }
}
