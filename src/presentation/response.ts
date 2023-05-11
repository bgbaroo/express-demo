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

// TODO: Review
class JsonResp {
  private code: Codes;
  status: Status;
  body: any;

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
    fieldName: string,
    res: Response
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
  return new JsonResp(Codes.Ok, body).marshal("data", res);
}

export async function Created(body: any, res: Response): Promise<Response> {
  return new JsonResp(Codes.Created, body).marshal("resource", res);
}

export async function NotImplemented(res: Response): Promise<Response> {
  return new JsonResp(Codes.InternalServerError, Bodies.NotImplemented).marshal(
    "error",
    res
  );
}

export async function MissingField(
  field: string,
  res: Response
): Promise<Response> {
  const body = Bodies.MissingField + ` '${field}'`;
  return new JsonResp(Codes.BadRequest, body).marshal("error", res);
}

export async function NotFound(body: any, res: Response): Promise<Response> {
  return new JsonResp(Codes.NotFound, body).marshal("message", res);
}

export async function InternalServerError(
  body: any,
  res: Response
): Promise<Response> {
  return new JsonResp(Codes.InternalServerError, body).marshal("message", res);
}
