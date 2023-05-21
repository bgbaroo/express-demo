import { Response } from "express";

import resp from "../response";
import { GenericAuthRequest } from "../request";
import { IHandlerGroups } from "../routes/groups";
import { AuthRequest } from "../auth/jwt";
import { AppErrors } from "../../domain/errors";
import { IGroup } from "../../domain/entities/group";
import {
  IUseCaseCreateGroup,
  IUseCaseDeleteGroup,
  IUseCaseDeleteUserGroups,
} from "../../domain/interfaces/usecases/group";

interface CreateGroupBody {
  name: string;
  memberEmails?: string[];
}

interface ResponseGroup {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
}

function groupToResp(group: IGroup): ResponseGroup {
  return {
    id: group.id,
    name: group.name,
    ownerId: group.getOwnerId(),
    members: group.getMembers().map((member) => member.email),
  };
}

export class HandlerGroups implements IHandlerGroups {
  private readonly usecaseCreateGroup: IUseCaseCreateGroup;
  private readonly usecaseDeleteGroup: IUseCaseDeleteGroup;
  private readonly usecaseDeleteGroups: IUseCaseDeleteUserGroups;

  constructor(arg: {
    createGroup: IUseCaseCreateGroup;
    deleteGroup: IUseCaseDeleteGroup;
    deleteGroups: IUseCaseDeleteUserGroups;
  }) {
    this.usecaseCreateGroup = arg.createGroup;
    this.usecaseDeleteGroup = arg.deleteGroup;
    this.usecaseDeleteGroups = arg.deleteGroups;
  }

  async createGroup(
    req: AuthRequest<any, ResponseGroup, CreateGroupBody, any>,
    res: Response,
  ): Promise<Response> {
    const { name, memberEmails } = req.body;
    if (!name) {
      return resp.MissingField(res, "name");
    }

    const { id: ownerId, email: ownerEmail } = req.payload;
    if (!ownerId || !ownerEmail) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.usecaseCreateGroup
      .execute({ ownerEmail, ownerId, name, memberEmails })
      .then((group) => resp.Created(res, groupToResp(group)))
      .catch((err) => {
        console.error(
          `failed to create group ${name} by owner ${ownerEmail} with members ${memberEmails}: ${err}`,
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
    return this.usecaseDeleteGroup
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

    return this.usecaseDeleteGroups
      .execute(userId)
      .then((count) => resp.Ok(res, `${count} groups deleted by user ${email}`))
      .catch((err) => {
        console.error(`failed to delete group: ${err}`);
        return resp.InternalServerError(res, "failed to delete group");
      });
  }
}
