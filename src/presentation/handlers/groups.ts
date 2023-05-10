import { Request, Response } from "express";
import { NotImplemented } from "../response";

export async function createGroup(
  _req: Request,
  res: Response
): Promise<Response> {
  return NotImplemented(res);
}

export async function deleteGroup(
  _req: Request,
  res: Response
): Promise<Response> {
  return NotImplemented(res);
}
