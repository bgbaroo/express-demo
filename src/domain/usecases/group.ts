import { IGroup } from "../entities/group";
import { IRepositoryGroup } from "../interfaces/repositories/group";
import {
  IUseCaseGroupGetGroup,
  IUseCaseGroupGetUserGroups,
  IUseCaseGroupGetUserOwnedGroups,
  IUseCaseGroupCreateGroup,
} from "../interfaces/usecases/group";

export class BaseUseCaseGroup {
  protected readonly repository: IRepositoryGroup;

  constructor(repo: IRepositoryGroup) {
    this.repository = repo;
  }
}

export class UseCaseGroupCreateGroup
  extends BaseUseCaseGroup
  implements IUseCaseGroupCreateGroup
{
  constructor(repo: IRepositoryGroup) {
    super(repo);
  }

  execute(group: IGroup): Promise<IGroup> {
    return this.repository.createGroup(group);
  }
}

export class UseCaseGroupGetGroupGetGroup
  extends BaseUseCaseGroup
  implements IUseCaseGroupGetGroup
{
  constructor(repo: IRepositoryGroup) {
    super(repo);
  }

  execute(id: string): Promise<IGroup | null> {
    return this.repository.getGroup({ id });
  }
}

export class UseCaseGroupGetUserGroups
  extends BaseUseCaseGroup
  implements IUseCaseGroupGetUserGroups
{
  constructor(repo: IRepositoryGroup) {
    super(repo);
  }

  execute(userId: string): Promise<IGroup[] | null> {
    return this.repository.getGroups({ user: { id: userId } });
  }
}

export class UseCaseGroupGetUserOwnedGroups
  extends BaseUseCaseGroup
  implements IUseCaseGroupGetUserOwnedGroups
{
  constructor(repo: IRepositoryGroup) {
    super(repo);
  }

  execute(userId: string): Promise<IGroup[] | null> {
    return this.repository.getGroups({ ownerId: userId });
  }
}
