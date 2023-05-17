import { IUseCaseGetUserClipboards } from "../interfaces/usecases/clipboard";
import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";
import { IClipboard } from "../entities/clipboard";

export class UseCaseGetUserClipboards implements IUseCaseGetUserClipboards {
  private repo: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repo = repo;
  }

  async execute(userId: string): Promise<IClipboard[] | null> {
    return await this.repo.getUserClipboards(userId);
  }
}
