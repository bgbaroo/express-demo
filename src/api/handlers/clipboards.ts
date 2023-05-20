import { Response } from "express";

import resp from "../response";
import { GenericAuthRequest } from "../request";
import { AuthRequest } from "../auth/jwt";
import { AppErrors } from "../../domain/errors";
import { IHandlerClipboards } from "../routes/clipboards";
import {
  IUseCaseCreateClipboard,
  IUseCaseDeleteUserClipboard,
  IUseCaseDeleteUserClipboards,
  IUseCaseGetGroupClipboards,
  IUseCaseGetGroupsClipboards,
  IUseCaseGetUserClipboard,
  IUseCaseGetUserClipboards,
} from "../../domain/interfaces/usecases/clipboard";

import { Clipboard } from "../../domain/entities/clipboard";
import { User } from "../../domain/entities/user";

interface CreateClipboardBody {
  title?: string;
  content: string;
  shared: boolean;
  expiration?: Date;
}

export class HandlerClipboards implements IHandlerClipboards {
  private readonly usecaseCreateClipboard: IUseCaseCreateClipboard;
  private readonly usecaseGetUserClipboard: IUseCaseGetUserClipboard;
  private readonly usecaseGetUserClipboards: IUseCaseGetUserClipboards;
  private readonly usecaseGetGroupClipboards: IUseCaseGetGroupClipboards;
  private readonly usecaseGetGroupsClipboards: IUseCaseGetGroupsClipboards;
  private readonly usecaseDeleteUserClipboard: IUseCaseDeleteUserClipboard;
  private readonly usecaseDeleteUserClipboards: IUseCaseDeleteUserClipboards;

  constructor(arg: {
    createClipboard: IUseCaseCreateClipboard;
    getClipboard: IUseCaseGetUserClipboard;
    getClipboards: IUseCaseGetUserClipboards;
    getGroupClipboards: IUseCaseGetGroupClipboards;
    getGroupsClipboards: IUseCaseGetGroupsClipboards;
    deleteClipboard: IUseCaseDeleteUserClipboard;
    deleteClipboards: IUseCaseDeleteUserClipboards;
  }) {
    this.usecaseCreateClipboard = arg.createClipboard;
    this.usecaseGetUserClipboard = arg.getClipboard;
    this.usecaseGetUserClipboards = arg.getClipboards;
    this.usecaseGetGroupClipboards = arg.getGroupClipboards;
    this.usecaseGetGroupsClipboards = arg.getGroupsClipboards;
    this.usecaseDeleteUserClipboard = arg.deleteClipboard;
    this.usecaseDeleteUserClipboards = arg.deleteClipboards;
  }

  async createClipboard(
    req: AuthRequest<any, any, CreateClipboardBody, any>,
    res: Response,
  ): Promise<Response> {
    const { content, title, shared, expiration } = req.body;
    if (!content) {
      return resp.MissingField(res, "content");
    }
    if (!shared) {
      return resp.MissingField(res, "shared");
    }

    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.usecaseCreateClipboard
      .execute(
        new Clipboard({
          title,
          content,
          user: new User({ id: userId, email }),
          shared,
          expiration,
        }),
      )
      .then((clipboard) => resp.Created(res, clipboard))
      .catch((err) => {
        return resp.InternalServerError(
          res,
          `failed to create clipboard: ${err}`,
        );
      });
  }

  async getClipboard(
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

    return this.usecaseGetUserClipboard
      .execute(userId, id)
      .then((clip) => {
        if (!clip) {
          return resp.NotFound(res, `clipboard ${id} not found`);
        }

        return resp.Ok(res, clip);
      })
      .catch((err) =>
        resp.InternalServerError(res, `failed to get clipboard ${id}: ${err}`),
      );
  }

  async getClipboards(
    req: GenericAuthRequest,
    res: Response,
  ): Promise<Response> {
    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return await this.usecaseGetUserClipboards
      .execute(userId)
      .then((clipboards) => {
        if (!clipboards) {
          return resp.NotFound(
            res,
            `clipboards for user ${userId} was not found`,
          );
        }

        return resp.Ok(res, clipboards);
      })
      .catch((err) =>
        resp.InternalServerError(
          res,
          `failed to get clipboards for user ${userId}: ${err}`,
        ),
      );
  }

  async getGroupClipboards(
    req: AuthRequest<{ id: string }, any, any, any>,
    res: Response,
  ): Promise<Response> {
    const id = req.params.id;
    if (!id) {
      return resp.MissingField(res, "id");
    }
    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.usecaseGetGroupClipboards
      .execute(userId, id)
      .then((clipboards) => {
        if (!clipboards || clipboards.length === 0) {
          return resp.NotFound(res, `clipboards not found for group ${id}`);
        }

        return resp.Ok(res, clipboards);
      })
      .catch((err) => {
        console.error(`failed to get group ${id} clipboards: ${err}`);
        return resp.InternalServerError(
          res,
          `failed to get group ${id} clipboards`,
        );
      });
  }

  async getGroupsClipboards(
    req: GenericAuthRequest,
    res: Response,
  ): Promise<Response> {
    const { id, email } = req.payload;
    if (!id || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.usecaseGetGroupsClipboards
      .execute(id)
      .then((clipboards) => {
        if (!clipboards || clipboards.length === 0) {
          return resp.NotFound(res, `clipboards not found for group ${id}`);
        }

        return resp.Ok(res, clipboards);
      })
      .catch((err) => {
        console.error(`failed to get group ${id} clipboards: ${err}`);
        return resp.InternalServerError(
          res,
          `failed to get group ${id} clipboards`,
        );
      });
  }

  async deleteClipboard(
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
    return this.usecaseDeleteUserClipboard
      .execute(userId, id)
      .then((deleted) => {
        if (deleted) {
          return resp.Ok(res, `clipboard ${id} deleted`);
        }

        return resp.NotFound(res, `clipboard ${id} was not found`);
      })
      .catch((err) =>
        resp.InternalServerError(
          res,
          `failed to delete clipboard ${id}: ${err}`,
        ),
      );
  }

  async deleteClipboards(
    req: GenericAuthRequest,
    res: Response,
  ): Promise<Response> {
    const { id: userId, email } = req.payload;
    if (!userId || !email) {
      return resp.InternalServerError(res, AppErrors.MissingJWTPayload);
    }

    return this.usecaseDeleteUserClipboards
      .execute(userId)
      .then((deleteds) => {
        if (deleteds === 0) {
          return resp.NotFound(
            res,
            `clipboards for user ${userId} was not found`,
          );
        }

        return resp.Ok(
          res,
          `${deleteds} clipboards from user ${userId} deleted`,
        );
      })
      .catch((err) =>
        resp.InternalServerError(
          res,
          `failed to delete user clipboards ${userId}: ${err}`,
        ),
      );
  }
}
