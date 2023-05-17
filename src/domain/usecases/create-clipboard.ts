import { IUseCaseCreateClipboard } from "../interfaces/usecases/clipboard";
import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";

import { IClipboard } from "../entities/clipboard";

export class UseCaseCreateClipboard implements IUseCaseCreateClipboard {
  private readonly repo: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repo = repo;
  }

  async execute(clipboard: IClipboard): Promise<IClipboard> {
    return await this.repo.createClipboard(clipboard);
  }
}
