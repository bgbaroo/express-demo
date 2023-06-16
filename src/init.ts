import { DbDriver } from "./data/sources/postgres";
import { DataLinkUser } from "./data/sources/postgres/data-links/user";
import { DataLinkGroup } from "./data/sources/postgres/data-links/group";
import { DataLinkClipboard } from "./data/sources/postgres/data-links/clipboard";

import { RepositoryUser } from "./domain/repositories/user";
import { RepositoryGroup } from "./domain/repositories/group";
import { RepositoryClipboard } from "./domain/repositories/clipboard";

import { UseCaseUserRegister } from "./domain/usecases/register";
import { UseCaseUserLogin } from "./domain/usecases/login";
import { UseCaseUserChangePassword } from "./domain/usecases/change-password";
import { UseCaseUserDeleteUser } from "./domain/usecases/delete-user";

import { UseCaseCreateGroup } from "./domain/usecases/create-group";
import { UseCaseDeleteGroup } from "./domain/usecases/delete-group";
import { UseCaseDeleteUserGroups } from "./domain/usecases/delete-user-groups";

import { UseCaseCreateClipboard } from "./domain/usecases/create-clipboard";
import { UseCaseGetUserClipboard } from "./domain/usecases/get-user-clipboard";
import { UseCaseGetUserClipboards } from "./domain/usecases/get-user-clipboards";
import { UseCaseGetGroupClipboards } from "./domain/usecases/get-group-clipboards";
import { UseCaseGetGroupsClipboards } from "./domain/usecases/get-groups-clipboards";
import { UseCaseDeleteUserClipboard } from "./domain/usecases/delete-user-clipboard";
import { UseCaseDeleteUserClipboards } from "./domain/usecases/delete-user-clipboards";

import handlers from "./api/handlers";
import { App, ArgCreateApp } from "./api/app";

function init<T extends App>(
  // t is class symbol of any type whose
  // constructor takes in ArgCreateApp and returns T
  t: { new (arg: ArgCreateApp): T },
  arg: { db: DbDriver },
): T {
  const dataLinkUser = new DataLinkUser(arg.db);
  const repoUser = new RepositoryUser(dataLinkUser);
  const handlerUsers = handlers.newHandlerUsers({
    register: new UseCaseUserRegister(repoUser),
    login: new UseCaseUserLogin(repoUser),
    changePassword: new UseCaseUserChangePassword(repoUser),
    deleteUser: new UseCaseUserDeleteUser(repoUser),
  });

  const dataLinkGroup = new DataLinkGroup(arg.db);
  const repoGroup = new RepositoryGroup(dataLinkGroup);
  const handlerGroups = handlers.newHandlerGroups({
    createGroup: new UseCaseCreateGroup({ repoGroup, repoUser }),
    deleteGroup: new UseCaseDeleteGroup(repoGroup),
    deleteGroups: new UseCaseDeleteUserGroups(repoGroup),
  });

  const dataLinkClipboard = new DataLinkClipboard(arg.db);
  const repoClipboard = new RepositoryClipboard(dataLinkClipboard);
  const handlerClipboards = handlers.newHandlerClipboards({
    createClipboard: new UseCaseCreateClipboard(repoClipboard),
    getClipboard: new UseCaseGetUserClipboard(repoClipboard),
    getClipboards: new UseCaseGetUserClipboards(repoClipboard),
    getGroupClipboards: new UseCaseGetGroupClipboards(repoClipboard),
    getGroupsClipboards: new UseCaseGetGroupsClipboards(repoClipboard),
    deleteClipboard: new UseCaseDeleteUserClipboard(repoClipboard),
    deleteClipboards: new UseCaseDeleteUserClipboards(repoClipboard),
  });

  return new t({
    clipboard: handlerClipboards,
    user: handlerUsers,
    group: handlerGroups,
  });
}

export default init;
