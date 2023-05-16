import dotenv from "dotenv";
import postgres from "./data/sources/postgres";

import { DataLinkUser } from "./data/sources/postgres/data-links/user";
import { RepositoryClipboard } from "./domain/repositories/clipboard";
import { UseCaseGroupCreateGroup } from "./domain/usecases/group";
import {
  UseCaseUserRegister,
  UseCaseUserLogin,
  UseCaseUserChangePassword,
  UseCaseUserDeleteUser,
  UseCaseUserGetUser,
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
import { DataLinkGroup } from "./data/sources/postgres/data-links/group";
import { RepositoryGroup } from "./domain/repositories/group";

async function main(): Promise<void> {
  dotenv.config();
  const dataLink = postgres;

  const dataLinkUser = new DataLinkUser(dataLink);
  const repoUser = new RepositoryUser(dataLinkUser);
  const handlerUsers = new HandlerUsers({
    register: new UseCaseUserRegister(repoUser),
    login: new UseCaseUserLogin(repoUser),
    changePassword: new UseCaseUserChangePassword(repoUser),
    deleteUser: new UseCaseUserDeleteUser(repoUser),
  });

  const dataLinkClipboard = new DataLinkClipboard(dataLink);
  const repoClipboard = new RepositoryClipboard(dataLinkClipboard);
  const handlerClipboards = new HandlerClipboards({
    createClipboard: new UseCaseCreateClipboard(repoClipboard),
    getClipboard: new UseCaseGetUserClipboard(repoClipboard),
    getClipboards: new UseCaseGetUserClipboards(repoClipboard),
    deleteClipboard: new UseCaseDeleteUserClipboard(repoClipboard),
    deleteClipboards: new UseCaseDeleteUserClipboards(repoClipboard),
  });

  const dataLinkGroup = new DataLinkGroup(dataLink);
  const repoGroup = new RepositoryGroup(dataLinkGroup);
  const handlerGroups = new HandlerGroups({
    createGroup: new UseCaseGroupCreateGroup(repoGroup),
    getUser: new UseCaseUserGetUser(repoUser),
  });

  const app = new App({
    clipboard: handlerClipboards,
    user: handlerUsers,
    group: handlerGroups,
  });

  // Graceful shutdowns are implemented in listenAndServe
  return app.listenAndServe(8000);
}

main();
