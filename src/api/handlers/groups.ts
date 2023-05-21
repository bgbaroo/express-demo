import { Response } from "express";

import resp from "../response";
import { GenericAuthRequest } from "../request";
import { IHandlerGroups } from "../routes/groups";
import { AuthRequest } from "../auth/jwt";
import { AppErrors } from "../../domain/errors";
import { GroupOwner } from "../../domain/entities/group-owner";
import { IGroup, Group } from "../../domain/entities/group";
import { IUser } from "../../domain/entities/user";
import {
  IUseCaseCreateGroup,
  IUseCaseDeleteGroup,
  IUseCaseDeleteUserGroups,
} from "../../domain/interfaces/usecases/group";
import { IUseCaseGetUserByEmail } from "../../domain/interfaces/usecases/user";

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

  // TODO: get multiple users by emails instead
  private readonly usecaseGetUserByEmail: IUseCaseGetUserByEmail;

  constructor(arg: {
    createGroup: IUseCaseCreateGroup;
    deleteGroup: IUseCaseDeleteGroup;
    deleteGroups: IUseCaseDeleteUserGroups;
    getUserByEmail: IUseCaseGetUserByEmail;
  }) {
    this.usecaseCreateGroup = arg.createGroup;
    this.usecaseDeleteGroup = arg.deleteGroup;
    this.usecaseDeleteGroups = arg.deleteGroups;
    this.usecaseGetUserByEmail = arg.getUserByEmail;
  }

  private async getUsersByEmail(
    emails: string[] | undefined,
  ): Promise<IUser[] | undefined> {
    if (!emails) {
      return undefined;
    }

    // Match return signature with use case types
    const members: IUser[] | undefined = [];
    const _members = await Promise.all(
      emails.map(async (email): Promise<IUser | null> => {
        return this.usecaseGetUserByEmail.execute(email);
      }),
    ).catch((err) => {
      console.error(`error getting user by email: ${err}`);

      return undefined;
    });

    if (_members) {
      _members.forEach((member) => {
        if (member) members.push(member);
      });
    }

    return members;
  }

  async createGroup(
    req: AuthRequest<any, ResponseGroup, CreateGroupBody, any>,
    res: Response,
  ): Promise<Response> {
    const { name, memberEmails: emails } = req.body;
    if (!name) {
      return resp.MissingField(res, "name");
    }

    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.usecaseCreateGroup
      .execute(
        new Group({
          name,
          owner: new GroupOwner({ id: userId, email }),
          users: await this.getUsersByEmail(emails),
        }),
      )
      .then((group) => resp.Created(res, groupToResp(group)))
      .catch((err) => {
        console.error(
          `failed to create group ${name} by owner ${email} with members ${emails}: ${err}`,
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
