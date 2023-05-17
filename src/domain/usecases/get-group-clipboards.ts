import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";
import { IUseCaseGetGroupClipboards } from "../interfaces/usecases/clipboard";

import { IClipboard } from "../entities/clipboard";

export class UseCaseGetGroupClipboards implements IUseCaseGetGroupClipboards {
  private repo: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repo = repo;
  }

  async execute(userId: string, groupId: string): Promise<IClipboard[] | null> {
    return await this.repo.getGroupClipboards(userId, groupId);
  }
}
