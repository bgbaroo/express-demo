import dotenv from "dotenv";
import postgres from "./data/sources/postgres";

import { DataLinkUser } from "./data/sources/postgres/data-links/user";
import { RepositoryClipboards } from "./domain/repositories/clipboard";
import { UsecaseGroup } from "./domain/usecases/group";
import {
  UseCaseUserRegister,
  UseCaseUserLogin,
  UseCaseUserChangePassword,
  UseCaseUserDeleteUser,
} from "./domain/usecases/user";
import {
  UseCaseCreateClipboard,
  UseCaseDeleteUserClipboard,
  UseCaseDeleteUserClipboards,
  UseCaseGetUserClipboard,
  UseCaseGetUserClipboards,
} from "./domain/usecases/clipboard";

import { App } from "./api/app";
import { HandlerClipboards } from "./api/handlers/clipboards";
import { HandlerGroups } from "./api/handlers/groups";
import { HandlerUsers } from "./api/handlers/users";
import { RepositoryUser } from "./domain/repositories/user";
import { DataLinkClipboard } from "./data/sources/postgres/data-links/clipboard";

async function main(): Promise<void> {
  dotenv.config();
  const dataLink = postgres;

  const dataLinkUser = new DataLinkUser(dataLink);
  const userRepo = new RepositoryUser(dataLinkUser);
  const handlerUsers = new HandlerUsers({
    register: new UseCaseUserRegister(userRepo),
    login: new UseCaseUserLogin(userRepo),
    changePassword: new UseCaseUserChangePassword(userRepo),
    deleteUser: new UseCaseUserDeleteUser(userRepo),
  });

  const dataLinkClipboard = new DataLinkClipboard(dataLink);
  const repoClipboards = new RepositoryClipboards(dataLinkClipboard);
  const handlerClipboards = new HandlerClipboards({
    createClipboard: new UseCaseCreateClipboard(repoClipboards),
    getClipboard: new UseCaseGetUserClipboard(repoClipboards),
    getClipboards: new UseCaseGetUserClipboards(repoClipboards),
    deleteClipboard: new UseCaseDeleteUserClipboard(repoClipboards),
    deleteClipboards: new UseCaseDeleteUserClipboards(repoClipboards),
  });

  // Dummy
  const usecaseGroup = new UsecaseGroup();
  const handlerGroups = new HandlerGroups(usecaseGroup);

  const app = new App({
    clipboard: handlerClipboards,
    user: handlerUsers,
    group: handlerGroups,
  });

  // Graceful shutdowns are implemented in listenAndServe
  return app.listenAndServe(8000);
}

main();
