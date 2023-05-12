import { IClipboard } from "../entities/clipboard";
import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";

function dummyId(clipboard: IClipboard): string {
  return clipboard.userId + clipboard.id;
}

export class RepositoryClipboards implements IRepositoryClipboard {
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

  async getUserClipboard(
    userId: string,
    id: string,
  ): Promise<IClipboard | undefined> {
    const key = userId + id;
    return Promise.resolve(this.storage.get(key));
  }

  async getUserClipboards(userId: string): Promise<IClipboard[]> {
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

  async deleteUserClipboard(userId: string, id: string): Promise<boolean> {
    const key = userId + id;
    return Promise.resolve(this.storage.delete(key));
  }

  async deleteUserClipboards(userId: string): Promise<number> {
    return Promise.reject("not implemented");
  }
}
