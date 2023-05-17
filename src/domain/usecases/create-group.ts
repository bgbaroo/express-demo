import { IUseCaseCreateGroup } from "../interfaces/usecases/group";
import { IRepositoryGroup } from "../interfaces/repositories/group";

import { IGroup } from "../entities/group";

export class UseCaseCreateGroup implements IUseCaseCreateGroup {
  private readonly repo: IRepositoryGroup;

  constructor(repo: IRepositoryGroup) {
    this.repo = repo;
  }

  async execute(group: IGroup): Promise<IGroup> {
    return await this.repo.createGroup(group);
  }
}
