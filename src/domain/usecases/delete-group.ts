import { IUseCaseDeleteGroup } from "../interfaces/usecases/group";
import { IRepositoryGroup } from "../interfaces/repositories/group";

import { IGroup } from "../entities/group";

export class UseCaseDeleteGroup implements IUseCaseDeleteGroup {
  private readonly repo: IRepositoryGroup;

  constructor(repo: IRepositoryGroup) {
    this.repo = repo;
  }

  async execute(userId: string, id: string): Promise<IGroup> {
    return await this.repo.deleteGroup({ id, ownerId: userId });
  }
}
