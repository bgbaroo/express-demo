import { IUsecaseClipboard } from "../interfaces/usecases/clipboard";
import { IClipboardRepository } from "../interfaces/repositories/clipboard";
import { IClipboard } from "../entities/clipboard";

// Current usecase is just repository wrapper.
export class UsecaseClipboard implements IUsecaseClipboard {
  private repository: IClipboardRepository;

  constructor(repo: IClipboardRepository) {
    this.repository = repo;
  }

  newClipboardId(this: UsecaseClipboard): string {
    return this.repository.newClipboardId();
  }

  async createClipboard(clipboard: IClipboard): Promise<void> {
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
