import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";
import { IClipboard } from "../entities/clipboard";
import {
  IPreClipboard,
  IUsecaseClipboard,
} from "../interfaces/usecases/clipboard";

// Current usecase is just repository wrapper.
export class UsecaseClipboard implements IUsecaseClipboard {
  private repository: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repository = repo;
  }

  async createClipboard(preClipboard: IPreClipboard): Promise<void> {
    const clipboard: IClipboard = {
      id: this.repository.newClipboardId(),
      ...preClipboard,
    };

    return this.repository.createClipboard(clipboard);
  }

  async getClipboard(
    id: string,
    userId: string,
  ): Promise<IClipboard | undefined> {
    return this.repository.getClipboard(id, userId);
  }

  async deleteClipboard(id: string, userId: string): Promise<boolean> {
    return this.repository.deleteClipboard(id, userId);
  }
}
