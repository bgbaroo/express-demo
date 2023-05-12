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

  async getUserClipboard(
    userId: string,
    id: string,
  ): Promise<IClipboard | undefined> {
    return this.repository.getUserClipboard(userId, id);
  }

  async deleteUserClipboard(userId: string, id: string): Promise<boolean> {
    return this.repository.deleteUserClipboard(userId, id);
  }
}
