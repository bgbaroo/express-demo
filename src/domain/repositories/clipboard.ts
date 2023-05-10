import { IClipboard } from "../entities/clipboard";
import { AppErrors } from "../errors";
import { IClipboardRepository } from "../interfaces/repositories/clipboard";

function dummyId(clipboard: IClipboard): string {
  return clipboard.userId + clipboard.id;
}

class ClipboardRepository implements IClipboardRepository {
  private storage: Map<string, IClipboard>;
  private counter: number; // For mock IDs

  constructor() {
    this.storage = new Map();
    this.counter = 0;
  }

  debug(this: ClipboardRepository) {
    console.table(this.storage);
  }

  newClipboardId(this: ClipboardRepository): string {
    return this.counter.toString();
  }

  async createClipboard(
    this: ClipboardRepository,
    clipboard: IClipboard
  ): Promise<void> {
    const key: string = dummyId(clipboard);

    this.storage.set(key, clipboard);
    this.counter++;

    return Promise.resolve();
  }

  async getClipboard(
    this: ClipboardRepository,
    id: string,
    userId: string
  ): Promise<IClipboard> {
    const key = userId + id;
    const clipboard = this.storage.get(key);
    if (clipboard) {
      return Promise.resolve(clipboard);
    }

    return Promise.reject(AppErrors.ClipboardNotFound);
  }

  async getClipboards(
    this: ClipboardRepository,
    userId: string
  ): Promise<IClipboard[]> {
    return Promise.resolve(
      Array.from(this.storage.values()).filter(
        (clip: IClipboard, _) => clip.userId === userId
      )
    );
  }

  async updateClipboard(clipboard: IClipboard): Promise<void> {
    const key = dummyId(clipboard);
    this.storage.set(key, clipboard);

    return Promise.resolve();
  }

  async deleteClipboard(
    this: ClipboardRepository,
    id: string,
    userId: string
  ): Promise<boolean> {
    const key = userId + id;
    return Promise.resolve(this.storage.delete(key));
  }
}

const repository: ClipboardRepository = new ClipboardRepository();
export default repository;
