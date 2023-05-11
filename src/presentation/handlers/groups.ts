import { Request, Response } from "express";
import { NotImplemented } from "../response";

export async function createGroup(
  _req: Request,
  res: Response
): Promise<Response> {
  return NotImplemented(res, "createGroup");
}

export async function deleteGroup(
  _req: Request,
  res: Response
): Promise<Response> {
  return NotImplemented(res, "deleteGroup");
}
