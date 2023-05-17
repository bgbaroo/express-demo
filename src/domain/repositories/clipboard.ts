import { DataLinkClipboard } from "../../data/sources/postgres/data-links/clipboard";
import { IClipboard } from "../entities/clipboard";
import {
  IRepositoryClipboard,
  whereClipboard,
} from "../interfaces/repositories/clipboard";

export class RepositoryClipboard implements IRepositoryClipboard {
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
    return await this.link.getClipboard(
      whereClipboard({ clipboardId: id, userId: userId }),
    );
  }

  async getUserClipboards(userId: string): Promise<IClipboard[] | null> {
    return await this.link.getClipboards({ userId });
  }

  async getGroupClipboards(groupId: string): Promise<IClipboard[] | null> {
    return await this.link.getClipboards(whereClipboard({ groupId }));
  }

  async getGroupsClipboards(userId: string): Promise<IClipboard[] | null> {
    return await this.link.getClipboards(
      whereClipboard({ allGroups: true, userId }),
    );
  }

  async deleteUserClipboard(userId: string, id: string): Promise<IClipboard> {
    return await this.link.deleteClipboard({ id, userId });
  }

  async deleteUserClipboards(userId: string): Promise<number> {
    return await this.link.deleteClipboards({ userId });
  }
}
