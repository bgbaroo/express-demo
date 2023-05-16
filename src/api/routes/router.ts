import express, { Router as ExpressRouter } from "express";

export class Router {
  private _router: ExpressRouter;

  constructor() {
    this._router = express.Router();
  }

  router(): ExpressRouter {
    return this._router;
  }
}
