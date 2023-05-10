import { IClipboardUseCase } from "../interfaces/usecases/clipboard";
import { IClipboard } from "../entities/clipboard";

import repository from "../repositories/clipboard";

// Current usecase is just repository wrapper.
class ClipboardUseCase implements IClipboardUseCase {
  newClipboardId(this: ClipboardUseCase): string {
    return repository.newClipboardId();
  }

  async createClipboard(
    this: ClipboardUseCase,
    clipboard: IClipboard
  ): Promise<void> {
    return repository.createClipboard(clipboard);
  }

  async getClipboard(
    this: ClipboardUseCase,
    id: string,
    userId: string
  ): Promise<IClipboard> {
    return repository.getClipboard(id, userId);
  }

  async deleteClipboard(
    this: ClipboardUseCase,
    id: string,
    userId: string
  ): Promise<boolean> {
    return repository.deleteClipboard(id, userId);
  }
}

const usecase: ClipboardUseCase = new ClipboardUseCase();
export default usecase;
