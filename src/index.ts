import dotenv from "dotenv";
import postgres from "./data/sources/postgres";

import { DataLinkUser } from "./data/sources/postgres/data-links/user";
import { DataLinkGroup } from "./data/sources/postgres/data-links/group";
import { DataLinkClipboard } from "./data/sources/postgres/data-links/clipboard";

import { RepositoryUser } from "./domain/repositories/user";
import { RepositoryClipboard } from "./domain/repositories/clipboard";
import { RepositoryGroup } from "./domain/repositories/group";

import { UseCaseUserRegister } from "./domain/usecases/register";
import { UseCaseUserLogin } from "./domain/usecases/login";
import { UseCaseUserChangePassword } from "./domain/usecases/change-password";
import { UseCaseUserDeleteUser } from "./domain/usecases/delete-user";

import { UseCaseGroupCreateGroup } from "./domain/usecases/create-group";

import { UseCaseCreateClipboard } from "./domain/usecases/create-clipboard";
import { UseCaseDeleteUserClipboard } from "./domain/usecases/delete-user-clipboard";
import { UseCaseGetUserClipboard } from "./domain/usecases/get-user-clipboard";
import { UseCaseDeleteUserClipboards } from "./domain/usecases/delete-user-clipboards";
import { UseCaseGetUserClipboards } from "./domain/usecases/get-user-clipboards";

import { App } from "./api/app";
import { HandlerClipboards } from "./api/handlers/clipboards";
import { HandlerGroups } from "./api/handlers/groups";
import { HandlerUsers } from "./api/handlers/users";
import { UseCaseGroupDeleteGroup } from "./domain/usecases/delete-group";

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
    deleteGroup: new UseCaseGroupDeleteGroup(repoGroup),
  });

  const app = new App({
    clipboard: handlerClipboards,
    user: handlerUsers,
    group: handlerGroups,
  });

  // Graceful shutdowns for HTTP server are implemented in listenAndServe
  return app.listenAndServe(8000);
}

main();
