import { RepositoryClipboards } from "./domain/repositories/clipboards";
import { UsecaseClipboard } from "./domain/usecases/clipboard";
import { UsecaseGroup } from "./domain/usecases/group";
import { UsecaseUser } from "./domain/usecases/user";

import { HandlerClipboards } from "./presentation/handlers/clipboards";
import { HandlerGroups } from "./presentation/handlers/groups";
import { HandlerUsers } from "./presentation/handlers/users";
import { App } from "./presentation/app";

async function main(): Promise<void> {
  const repoClipboards = new RepositoryClipboards();
  const usecaseClipboard = new UsecaseClipboard(repoClipboards);
  const handlerClipboards = new HandlerClipboards(usecaseClipboard);

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
