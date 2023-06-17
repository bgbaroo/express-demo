import { IUseCaseGetGroupsClipboards } from "../interfaces/usecases/clipboard";
import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";

import { IClipboard } from "../entities/clipboard";

export class UseCaseGetGroupsClipboards implements IUseCaseGetGroupsClipboards {
  private readonly repo: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repo = repo;
  }

  async execute(userId: string): Promise<IClipboard[] | null> {
    return await this.repo.getUserGroupsClipboards(userId);
  }
}
