import express, { Router } from "express";
import { register, login, changePassword, deleteUser } from "../handlers/users";

export function routes(): Router {
  const router: Router = express.Router();

  router.post("/register", register);
  router.post("/login", login);
  router.post("/pw", changePassword);
  router.delete("/", deleteUser);

  return router;
}
