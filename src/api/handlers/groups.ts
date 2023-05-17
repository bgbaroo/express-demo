import { Response } from "express";

import resp from "../response";
import { GenericAuthRequest } from "../request";
import { IHandlerGroups } from "../routes/groups";
import { AuthRequest } from "../auth/jwt";
import { AppErrors } from "../../domain/errors";
import { GroupOwner } from "../../domain/entities/group-owner";
import { Group } from "../../domain/entities/group";
import { User } from "../../domain/entities/user";
import {
  IUseCaseGroupCreateGroup,
  IUseCaseGroupDeleteGroup,
  IUseCaseGroupDeleteUserGroups,
} from "../../domain/interfaces/usecases/group";

interface CreateGroupBody {
  name: string;
  memberEmails?: string[];
}

export class HandlerGroups implements IHandlerGroups {
  private readonly create: IUseCaseGroupCreateGroup;
  private readonly delete: IUseCaseGroupDeleteGroup;
  private readonly deletes: IUseCaseGroupDeleteUserGroups;

  constructor(arg: {
    createGroup: IUseCaseGroupCreateGroup;
    deleteGroup: IUseCaseGroupDeleteGroup;
    deleteGroups: IUseCaseGroupDeleteUserGroups;
  }) {
    this.create = arg.createGroup;
    this.delete = arg.deleteGroup;
    this.deletes = arg.deleteGroups;
  }

  async createGroup(
    req: AuthRequest<any, any, CreateGroupBody, any>,
    res: Response,
  ): Promise<Response> {
    const { name, memberEmails } = req.body;
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
          users: memberEmails?.map((member) => new User({ email: member })),
        }),
      )
      .then((group) => resp.Created(res, group))
      .catch((err) => {
        console.error(
          `failed to create group ${name} by owner ${email} with members ${memberEmails}: ${err}`,
        );
        return resp.InternalServerError(res, `failed to create group ${name}`);
      });
  }

  async deleteGroup(
    req: AuthRequest<{ id: string }, any, any, any>,
    res: Response,
  ): Promise<Response> {
    if (!req.params.id) {
      return resp.MissingParam(res, "id");
    }

    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    const id = req.params.id;
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

  async deleteGroups(
    req: GenericAuthRequest,
    res: Response,
  ): Promise<Response> {
    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.deletes
      .execute(userId)
      .then((count) => resp.Ok(res, `${count} groups deleted by user ${email}`))
      .catch((err) => {
        console.error(`failed to delete group: ${err}`);
        return resp.InternalServerError(res, "failed to delete group");
      });
  }
}
