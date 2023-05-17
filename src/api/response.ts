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
  MissingParam = "missing param",
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
    fieldName: string,
  ): Promise<Response> {
    return res
      .status(this.code)
      .json(
        Object.fromEntries(
          new Map<string, any>()
            .set("status", this.status)
            .set(fieldName, this.body),
        ),
      )
      .end();
  }
}

async function NotImplemented(
  res: Response,
  usecase: string,
): Promise<Response> {
  return new JsonResp(
    Codes.InternalServerError,
    Bodies.NotImplemented.toString() + `: ${usecase}`,
  ).marshal(res, "error");
}

async function MissingField(res: Response, field: string): Promise<Response> {
  const body = `${Bodies.MissingField}: '${field}'`;
  return new JsonResp(Codes.BadRequest, body).marshal(res, "error");
}

async function MissingParam(res: Response, param: string): Promise<Response> {
  const body = `${Bodies.MissingParam}: '${param}'`;
  return new JsonResp(Codes.BadRequest, body).marshal(res, "error");
}

async function Ok(res: Response, body: any): Promise<Response> {
  return new JsonResp(Codes.Ok, body).marshal(res, "data");
}

async function Created(res: Response, body: any): Promise<Response> {
  return new JsonResp(Codes.Created, body).marshal(res, "resource");
}

async function NotFound(res: Response, body: any): Promise<Response> {
  return new JsonResp(Codes.NotFound, body).marshal(res, "message");
}

async function InternalServerError(
  res: Response,
  body: any,
): Promise<Response> {
  return new JsonResp(Codes.InternalServerError, body).marshal(res, "message");
}

async function Unauthorized(res: Response, body: any) {
  return new JsonResp(Codes.Unauthorized, body).marshal(res, "reason");
}

export default {
  NotImplemented,
  MissingField,
  MissingParam,
  Ok,
  Created,
  NotFound,
  InternalServerError,
  Unauthorized,
  Status,
};
