import { Request, Response } from "express";

import resp from "../response";
import { IHandlerClipboards } from "../routes/clipboards";
import {
  IUseCaseCreateClipboard,
  IUseCaseDeleteUserClipboard,
  IUseCaseDeleteUserClipboards,
  IUseCaseGetUserClipboard,
  IUseCaseGetUserClipboards,
} from "../../domain/interfaces/usecases/clipboard";
import { IClipboard, Clipboard } from "../../domain/entities/clipboard";
import { User } from "../../domain/entities/user";

export class HandlerClipboards implements IHandlerClipboards {
  private usecaseCreateClipboard: IUseCaseCreateClipboard;
  private usecaseGetUserClipboard: IUseCaseGetUserClipboard;
  private usecaseGetUserClipboards: IUseCaseGetUserClipboards;
  private usecaseDeleteUserClipboard: IUseCaseDeleteUserClipboard;
  private usecaseDeleteUserClipboards: IUseCaseDeleteUserClipboards;

  constructor(arg: {
    createClipboard: IUseCaseCreateClipboard;
    getClipboard: IUseCaseGetUserClipboard;
    getClipboards: IUseCaseGetUserClipboards;
    deleteClipboard: IUseCaseDeleteUserClipboard;
    deleteClipboards: IUseCaseDeleteUserClipboards;
  }) {
    this.usecaseCreateClipboard = arg.createClipboard;
    this.usecaseGetUserClipboard = arg.getClipboard;
    this.usecaseDeleteUserClipboard = arg.deleteClipboard;
    this.usecaseDeleteUserClipboards = arg.deleteClipboards;
  }

  async createClipboard(req: Request, res: Response): Promise<Response> {
    const { userId, content, title } = req.body;
    if (!userId) {
      return resp.MissingField(res, "userId");
    }
    if (!content) {
      return resp.MissingField(res, "content");
    }

    // PreClipboard is clipboard without field id (not known yet)
    const clipboard: IClipboard = new Clipboard({
      user: new User("foo"),
      title: title,
      content: "bar",
    });

    return this.usecaseCreateClipboard
      .execute(clipboard)
      .then(() => resp.Created(res, clipboard))
      .catch((err) =>
        resp.InternalServerError(res, `failed to create clipboard: ${err}`),
      );
  }

  async getClipboard(req: Request, res: Response): Promise<Response> {
    const { id, userId } = req.body;
    if (!id) {
      return resp.MissingField(res, "id");
    }

    if (!userId) {
      return resp.MissingField(res, "userId");
    }

    return this.usecaseGetUserClipboard
      .execute(userId, id)
      .then((clip) => {
        if (clip === undefined) {
          return resp.NotFound(res, `clipboard ${id} not found`);
        }

        return resp.Ok(res, clip);
      })
      .catch((err) =>
        resp.InternalServerError(res, `failed to get clipboard ${id}: ${err}`),
      );
  }

  async getClipboards(req: Request, res: Response): Promise<Response> {
    const { userId } = req.body;

    if (!userId) {
      return resp.MissingField(res, "userId");
    }

    return this.usecaseGetUserClipboards
      .execute(userId)
      .then((clipboards) => {
        if (clipboards) {
          return resp.Ok(res, clipboards);
        }

        return resp.NotFound(
          res,
          `clipboards for user ${userId} was not found`,
        );
      })
      .catch((err) =>
        resp.InternalServerError(
          res,
          `failed to get clipboards for user ${userId}: ${err}`,
        ),
      );
  }

  async deleteClipboard(req: Request, res: Response): Promise<Response> {
    const { id, userId } = req.body;
    if (!id) {
      return resp.MissingField(res, "id");
    }

    if (!userId) {
      return resp.MissingField(res, "userId");
    }

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

  async deleteClipboards(req: Request, res: Response): Promise<Response> {
    const { userId } = req.body;

    if (!userId) {
      return resp.MissingField(res, "userId");
    }

    return this.usecaseDeleteUserClipboards
      .execute(userId)
      .then((deleteds) => {
        if (deleteds) {
          return resp.Ok(
            res,
            `${deleteds} clipboards from user ${userId} deleted`,
          );
        }

        return resp.NotFound(
          res,
          `clipboards for user ${userId} was not found`,
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
