import express, { Router } from "express";
import { createGroup, deleteGroup } from "../handlers/groups";

export function routes(): Router {
  const router: Router = express.Router();

  router.post("/", createGroup);
  router.delete("/", deleteGroup);

  return router;
}
