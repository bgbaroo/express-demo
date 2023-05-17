import { IUseCaseGroupCreateGroup } from "../interfaces/usecases/group";
import { IRepositoryGroup } from "../interfaces/repositories/group";

import { IGroup } from "../entities/group";

export class UseCaseGroupCreateGroup implements IUseCaseGroupCreateGroup {
  private readonly repo: IRepositoryGroup;

  constructor(repo: IRepositoryGroup) {
    this.repo = repo;
  }

  async execute(group: IGroup): Promise<IGroup> {
    return await this.repo.createGroup(group);
  }
}
