import { IUseCaseDeleteUserClipboards } from "../interfaces/usecases/clipboard";
import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";

export class UseCaseDeleteUserClipboards
  implements IUseCaseDeleteUserClipboards
{
  private repo: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repo = repo;
  }

  async execute(userId: string): Promise<number> {
    return await this.repo.deleteUserClipboards(userId);
  }
}
