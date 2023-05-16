import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import response from "../response";

const authSecret = process.env.AUTH_SECRET || "express-demo";

export interface JwtTokenPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  token?: string | JwtPayload;
}

export function generateJwt(payload: JwtTokenPayload): string {
  return jwt.sign(payload, authSecret, {
    algorithm: "HS512",
    /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
    expiresIn: "1m",
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
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return response.Unauthorized(res, "missing JWT token");
    }

    const decoded = jwt.verify(token, authSecret);
    (req as AuthRequest).token = decoded;
    return next();
  } catch (err) {
    return response.Unauthorized(res, "authentication failed");
  }
}
