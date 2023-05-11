import { Request, Response } from "express";

import resp from "../response";
import { IClipboard } from "../../domain/entities/clipboard";
import { IUsecaseClipboard } from "../../domain/interfaces/usecases/clipboard";
import { IHandlerClipboards } from "../routes/clipboards";

export class HandlerClipboards implements IHandlerClipboards {
  private usecase: IUsecaseClipboard;

  constructor(usecase: IUsecaseClipboard) {
    this.usecase = usecase;
  }

  async createClipboard(req: Request, res: Response): Promise<Response> {
    const { userId, message } = req.body;
    if (!userId) {
      return resp.MissingField(res, "userId");
    }
    if (!message) {
      return resp.MissingField(res, "message");
    }

    const clipboard: IClipboard = {
      id: this.usecase.newClipboardId(),
      userId,
      message,
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
      .getClipboard(id, userId)
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
      .deleteClipboard(id, userId)
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
