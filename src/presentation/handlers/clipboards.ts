import { Request, Response } from "express";
import { IClipboard } from "../../domain/entities/clipboard";
import usecase from "../../domain/usecases/clipboard";
import {
  Ok,
  NotFound,
  Created,
  InternalServerError,
  MissingField,
} from "../response";

export async function createClipboard(
  req: Request,
  res: Response
): Promise<Response> {
  const { userId, message } = req.body;
  if (!userId) {
    return MissingField(res, "userId");
  }
  if (!message) {
    return MissingField(res, "message");
  }

  const clipboard: IClipboard = {
    id: usecase.newClipboardId(),
    userId,
    message,
  };

  return usecase
    .createClipboard(clipboard)
    .then(() => Created(clipboard, res))
    .catch((err) =>
      InternalServerError(res, `failed to create clipboard: ${err}`)
    );
}

export async function getClipboard(
  req: Request,
  res: Response
): Promise<Response> {
  const { id, userId } = req.body;
  if (!id) {
    return MissingField(res, "id");
  }

  if (!userId) {
    return MissingField(res, "userId");
  }

  return usecase
    .getClipboard(id, userId)
    .then((clip) => {
      if (clip === undefined) {
        return NotFound(res, `clipboard ${id} not found`);
      }

      return Ok(clip, res);
    })
    .catch((err) =>
      InternalServerError(res, `failed to get clipboard ${id}: ${err}`)
    );
}

export async function deleteClipboard(
  req: Request,
  res: Response
): Promise<Response> {
  const { id, userId } = req.body;
  if (!id) {
    return MissingField(res, "id");
  }

  if (!userId) {
    return MissingField(res, "userId");
  }

  return usecase
    .deleteClipboard(id, userId)
    .then((deleted) => {
      if (deleted) {
        return Ok(`clipboard ${id} deleted`, res);
      }

      return NotFound(res, `clipboard ${id} was not found`);
    })
    .catch((err) =>
      InternalServerError(res, `failed to delete clipboard ${id}: ${err}`)
    );
}
