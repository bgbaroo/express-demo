import { DbDriver } from "./data/sources/postgres";
import links from "./data/sources/postgres/data-links";
import repos from "./domain/repositories";

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
  const dataLinkUser = links.newDataLinkUser(arg.db);
  const repoUser = repos.newRepositoryUser(dataLinkUser);
  const handlerUsers = handlers.newHandlerUsers({
    register: new UseCaseUserRegister(repoUser),
    login: new UseCaseUserLogin(repoUser),
    changePassword: new UseCaseUserChangePassword(repoUser),
    deleteUser: new UseCaseUserDeleteUser(repoUser),
  });

  const dataLinkGroup = links.newDataLinkGroup(arg.db);
  const repoGroup = repos.newRepositoryGroup(dataLinkGroup);
  const handlerGroups = handlers.newHandlerGroups({
    createGroup: new UseCaseCreateGroup({ repoGroup, repoUser }),
    deleteGroup: new UseCaseDeleteGroup(repoGroup),
    deleteGroups: new UseCaseDeleteUserGroups(repoGroup),
  });

  const dataLinkClipboard = links.newDataLinkClipboard(arg.db);
  const repoClipboard = repos.newRepositoryClipboard(dataLinkClipboard);
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
