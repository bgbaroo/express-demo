import { Response } from "express";

enum Status {
  Ok = "ok",
  Err = "error",
}

enum Codes {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

enum Bodies {
  NotImplemented = "api not yet implemented",
  MissingField = "missing field",
}

class JsonResp {
  private code: Codes;
  private status: Status;
  private body: any;

  constructor(code: Codes, body: any) {
    this.code = code;
    this.body = body;

    if (code < 400) {
      this.status = Status.Ok;
      return;
    }

    this.status = Status.Err;
  }

  async marshal(
    this: JsonResp,
    res: Response,
    fieldName: string
  ): Promise<Response> {
    return res
      .status(this.code)
      .json(
        Object.fromEntries(
          new Map<string, any>()
            .set("status", this.status)
            .set(fieldName, this.body)
        )
      )
      .end();
  }
}

export async function Ok(body: any, res: Response): Promise<Response> {
  return new JsonResp(Codes.Ok, body).marshal(res, "data");
}

export async function Created(body: any, res: Response): Promise<Response> {
  return new JsonResp(Codes.Created, body).marshal(res, "resource");
}

export async function NotImplemented(
  res: Response,
  usecase: string
): Promise<Response> {
  return new JsonResp(
    Codes.InternalServerError,
    Bodies.NotImplemented.toString() + `: ${usecase}`
  ).marshal(res, "error");
}

export async function MissingField(
  res: Response,
  field: string
): Promise<Response> {
  const body = Bodies.MissingField + ` '${field}'`;
  return new JsonResp(Codes.BadRequest, body).marshal(res, "error");
}

export async function NotFound(res: Response, body: any): Promise<Response> {
  return new JsonResp(Codes.NotFound, body).marshal(res, "message");
}

export async function InternalServerError(
  res: Response,
  body: any
): Promise<Response> {
  return new JsonResp(Codes.InternalServerError, body).marshal(res, "message");
}
