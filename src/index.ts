import { RepositoryClipboards } from "./domain/repositories/clipboards";
import { UsecaseGroup } from "./domain/usecases/group";
import { UsecaseUser } from "./domain/usecases/user";
import {
  UseCaseCreateClipboard,
  UseCaseDeleteUserClipboard,
  UseCaseDeleteUserClipboards,
  UseCaseGetUserClipboard,
  UseCaseGetUserClipboards,
} from "./domain/usecases/clipboard";

import { App } from "./presentation/app";
import { HandlerClipboards } from "./presentation/handlers/clipboards";
import { HandlerGroups } from "./presentation/handlers/groups";
import { HandlerUsers } from "./presentation/handlers/users";

async function main(): Promise<void> {
  const repoClipboards = new RepositoryClipboards();
  const handlerClipboards = new HandlerClipboards({
    createClipboard: new UseCaseCreateClipboard(repoClipboards),
    getClipboard: new UseCaseGetUserClipboard(repoClipboards),
    getClipboards: new UseCaseGetUserClipboards(repoClipboards),
    deleteClipboard: new UseCaseDeleteUserClipboard(repoClipboards),
    deleteClipboards: new UseCaseDeleteUserClipboards(repoClipboards),
  });

  // Dummy
  const usecaseUser = new UsecaseUser();
  const handlerUsers = new HandlerUsers(usecaseUser);

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
