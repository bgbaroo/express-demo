import express, { Router } from "express";
import {
  createClipboard,
  getClipboard,
  deleteClipboard,
} from "../handlers/clipboards";

export function routes(): Router {
  const router: Router = express.Router();

  router.post("/", createClipboard);
  router.get("/", getClipboard);
  router.delete("/", deleteClipboard);

  return router;
}
