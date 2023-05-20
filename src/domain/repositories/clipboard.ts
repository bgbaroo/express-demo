import { IDataLinkClipboard } from "../../data/interfaces/data-links";
import { IClipboard } from "../entities/clipboard";
import {
  IRepositoryClipboard,
  whereClipboard,
} from "../interfaces/repositories/clipboard";

export class RepositoryClipboard implements IRepositoryClipboard {
  private readonly link: IDataLinkClipboard;

  constructor(link: IDataLinkClipboard) {
    this.link = link;
  }

  async createClipboard(clipboard: IClipboard): Promise<IClipboard> {
    return await this.link.createClipboard(clipboard);
  }

  async getUserClipboard(arg: {
    userId: string;
    id: string;
  }): Promise<IClipboard | null> {
    return await this.link.getClipboard(
      whereClipboard({ clipboardId: arg.id, userId: arg.userId }),
    );
  }

  async getUserClipboards(userId: string): Promise<IClipboard[] | null> {
    return await this.link.getClipboards({ userId });
  }

  async getGroupClipboards(groupId: string): Promise<IClipboard[] | null> {
    return await this.link.getClipboards(
      whereClipboard({ shared: true, groupId }),
    );
  }

  async getGroupsClipboards(userId: string): Promise<IClipboard[] | null> {
    return await this.link.getClipboards(
      whereClipboard({ shared: true, allGroups: true, userId }),
    );
  }

  async deleteUserClipboard(arg: {
    userId: string;
    id: string;
  }): Promise<IClipboard> {
    return await this.link.deleteClipboard(arg);
  }

  async deleteUserClipboards(userId: string): Promise<number> {
    return await this.link.deleteClipboards({ userId });
  }
}
