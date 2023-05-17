import { IUseCaseGroupDeleteUserGroups } from "../interfaces/usecases/group";
import { IRepositoryGroup } from "../interfaces/repositories/group";

export class UseCaseGroupDeleteUserGroups
  implements IUseCaseGroupDeleteUserGroups
{
  private readonly repo: IRepositoryGroup;

  constructor(repo: IRepositoryGroup) {
    this.repo = repo;
  }

  async execute(userId: string): Promise<number> {
    return await this.repo.deleteGroups({ ownerId: userId });
  }
}
