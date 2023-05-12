import { Request, Response } from "express";

import resp from "../response";
import { IHandlerClipboards } from "../routes/clipboards";
import {
  IPreClipboard,
  IUsecaseClipboard,
} from "../../domain/interfaces/usecases/clipboard";

export class HandlerClipboards implements IHandlerClipboards {
  private usecase: IUsecaseClipboard;

  constructor(usecase: IUsecaseClipboard) {
    this.usecase = usecase;
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
    const clipboard: IPreClipboard = {
      userId,
      title,
      content,
    };

    return this.usecase
      .createClipboard(clipboard)
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

    return this.usecase
      .getUserClipboard(userId, id)
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

  async deleteClipboard(req: Request, res: Response): Promise<Response> {
    const { id, userId } = req.body;
    if (!id) {
      return resp.MissingField(res, "id");
    }

    if (!userId) {
      return resp.MissingField(res, "userId");
    }

    return this.usecase
      .deleteUserClipboard(userId, id)
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
}
