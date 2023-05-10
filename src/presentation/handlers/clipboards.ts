import { Request, Response } from "express";
import { IClipboard } from "../../domain/entities/clipboard";
import {
  Ok,
  NotFound,
  Created,
  InternalServerError,
  MissingField,
} from "../response";
import usecase from "../../domain/usecases/clipboard";

export async function createClipboard(req: Request, res: Response) {
  const { userId, message } = req.body;
  if (!userId) {
    return MissingField("userId", res);
  }
  if (!message) {
    return MissingField("message", res);
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
      InternalServerError(`failed to create clipboard: ${err}`, res)
    );
}

// TODO: 500 returned when not found
export async function getClipboard(req: Request, res: Response) {
  const { id, userId } = req.body;
  if (!id) {
    return MissingField("id", res);
  }

  if (!userId) {
    return MissingField("userId", res);
  }

  return usecase
    .getClipboard(id, userId)
    .then((clip) => Ok(clip, res))
    .catch((err) => NotFound(`failed to get clipboard ${id}: ${err}`, res));
}

export async function deleteClipboard(
  req: Request,
  res: Response
): Promise<Response> {
  const { id, userId } = req.body;
  if (!id) {
    return MissingField("id", res);
  }

  if (!userId) {
    return MissingField("userId", res);
  }

  return usecase
    .deleteClipboard(id, userId)
    .then((deleted) => {
      if (deleted) {
        return Ok(`clipboard ${id} deleted`, res);
      }

      return NotFound(`clipboard ${id} was not found`, res);
    })
    .catch((err) =>
      InternalServerError(`failed to delete clipboard ${id}: ${err}`, res)
    );
}
