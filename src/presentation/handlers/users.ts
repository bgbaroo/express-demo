import { Request, Response } from "express";
import { NotImplemented } from "../response";

export async function register(
  _req: Request,
  res: Response
): Promise<Response> {
  return NotImplemented(res);
}

export async function login(_req: Request, res: Response): Promise<Response> {
  return NotImplemented(res);
}

export async function changePassword(
  _req: Request,
  res: Response
): Promise<Response> {
  return NotImplemented(res);
}

export async function deleteUser(
  _req: Request,
  res: Response
): Promise<Response> {
  return NotImplemented(res);
}
