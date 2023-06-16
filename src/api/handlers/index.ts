import { HandlerFuncAuth, HandlerFunc } from "../app";
import { newHandlerUsers } from "./users";
import { newHandlerGroups } from "./groups";
import { newHandlerClipboards } from "./clipboards";

export default { newHandlerUsers, newHandlerGroups, newHandlerClipboards };

export interface IHandlerUsers {
  register: HandlerFunc;
  login: HandlerFunc;
  // Require auth
  logout: HandlerFuncAuth;
  changePassword: HandlerFuncAuth;
  deleteUser: HandlerFuncAuth;
}

export interface IHandlerGroups {
  createGroup: HandlerFuncAuth;
  deleteGroup: HandlerFuncAuth;
  deleteGroups: HandlerFuncAuth;
}

export interface IHandlerClipboards {
  createClipboard: HandlerFuncAuth;
  getClipboard: HandlerFuncAuth;
  getClipboards: HandlerFuncAuth;
  getGroupClipboards: HandlerFuncAuth;
  getGroupsClipboards: HandlerFuncAuth;
  deleteClipboard: HandlerFuncAuth;
  deleteClipboards: HandlerFuncAuth;
}
