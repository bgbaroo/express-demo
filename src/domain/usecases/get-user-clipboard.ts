import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";
import { IUseCaseGetUserClipboard } from "../interfaces/usecases/clipboard";

import { IClipboard } from "../entities/clipboard";

export class UseCaseGetUserClipboard implements IUseCaseGetUserClipboard {
  private repo: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repo = repo;
  }

  async execute(arg: {
    userId: string;
    id: string;
  }): Promise<IClipboard | null> {
    return await this.repo.getUserClipboard(arg);
  }
}
