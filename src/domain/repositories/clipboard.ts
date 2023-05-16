import { DataLinkClipboard } from "../../data/sources/postgres/data-links/clipboard";
import { IClipboard } from "../entities/clipboard";
import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";

export class RepositoryClipboards implements IRepositoryClipboard {
  private readonly link: DataLinkClipboard;

  constructor(link: DataLinkClipboard) {
    this.link = link;
  }

  async createClipboard(clipboard: IClipboard): Promise<IClipboard> {
    return await this.link.createClipboard(clipboard);
  }

  async getUserClipboard(
    id: string,
    userId: string,
  ): Promise<IClipboard | null> {
    return await this.link.getUserClipboard(id, userId);
  }

  async getUserClipboards(userId: string): Promise<IClipboard[] | null> {
    return await this.link.getUserClipboards(userId);
  }

  async deleteUserClipboard(userId: string, id: string): Promise<IClipboard> {
    const clip = await this.link.getUserClipboard(id, userId);
    if (!clip) {
      return Promise.reject(`no such clipboard: ${id}`);
    }

    if (clip.getUserId() != userId) {
      return Promise.reject(`clipboard does not belong to userId ${userId}`);
    }

    return await this.link.deleteClipboard(clip.id);
  }

  async deleteUserClipboards(userId: string): Promise<number> {
    return this.link.deleteUserClipboards(userId);
  }
}
