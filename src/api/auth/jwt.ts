import { Request, Response, NextFunction } from "express";
import response from "../response";
import jwt, { JwtPayload } from "jsonwebtoken";

const authSecret = process.env.AUTH_SECRET || "express-demo";

export interface JwtTokenPayload {
  id: string;
  email: string;
}

export interface AuthRequest<Params, ResBody, ReqBody, ReqQuery>
  extends Request<Params, ResBody, ReqBody, ReqQuery> {
  token: string | JwtPayload;
  payload: JwtTokenPayload;
}

export function generateJwt(payload: JwtTokenPayload): string {
  return jwt.sign(payload, authSecret, {
    algorithm: "HS512",
    /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
    expiresIn: "12h",
    issuer: "express-demo",
    subject: "user-login",
    audience: "user",
  });
}

export function authenticateJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  try {
    if (!token) {
      return response.Unauthorized(res, "missing JWT token");
    }

    const decoded = jwt.verify(token, authSecret);
    (req as AuthRequest<any, any, any, any>).token = decoded;
    (req as AuthRequest<any, any, any, any>).payload = {
      id: decoded["id"],
      email: decoded["email"],
    };

    return next();
  } catch (err) {
    console.error(`Auth failed for token ${token}: ${err}`);
    return response.Unauthorized(res, "authentication failed");
  }
}
