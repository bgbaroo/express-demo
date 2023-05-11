import { IClipboard } from "../entities/clipboard";
import { IClipboardRepository } from "../interfaces/repositories/clipboard";

function dummyId(clipboard: IClipboard): string {
  return clipboard.userId + clipboard.id;
}

export class RepositoryClipboards implements IClipboardRepository {
  private storage: Map<string, IClipboard>;
  private counter: number; // For mock IDs

  constructor() {
    this.storage = new Map();
    this.counter = 0;
  }

  debug() {
    console.table(this.storage);
  }

  newClipboardId(): string {
    return this.counter.toString();
  }

  async createClipboard(clipboard: IClipboard): Promise<void> {
    const key: string = dummyId(clipboard);

    this.storage.set(key, clipboard);
    this.counter++;

    return Promise.resolve();
  }

  async getClipboard(
    id: string,
    userId: string,
  ): Promise<IClipboard | undefined> {
    const key = userId + id;
    return Promise.resolve(this.storage.get(key));
  }

  async getClipboards(userId: string): Promise<IClipboard[]> {
    return Promise.resolve(
      Array.from(this.storage.values()).filter(
        (clip: IClipboard, _) => clip.userId === userId,
      ),
    );
  }

  async updateClipboard(clipboard: IClipboard): Promise<void> {
    const key = dummyId(clipboard);
    this.storage.set(key, clipboard);

    return Promise.resolve();
  }

  async deleteClipboard(id: string, userId: string): Promise<boolean> {
    const key = userId + id;
    return Promise.resolve(this.storage.delete(key));
  }
}
