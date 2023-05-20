import { IUseCaseDeleteUserClipboard } from "../interfaces/usecases/clipboard";
import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";

import { IClipboard } from "../entities/clipboard";

export class UseCaseDeleteUserClipboard implements IUseCaseDeleteUserClipboard {
  private repo: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repo = repo;
  }

  async execute(arg: { userId: string; id: string }): Promise<IClipboard> {
    return await this.repo.deleteUserClipboard(arg);
  }
}
