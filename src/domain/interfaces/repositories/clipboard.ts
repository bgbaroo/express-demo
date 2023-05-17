import { IClipboard } from "../../entities/clipboard";

export interface IRepositoryClipboard {
  createClipboard(clipboard: IClipboard): Promise<IClipboard>;
  getUserClipboard(userId: string, id: string): Promise<IClipboard | null>;
  getUserClipboards(userId: string): Promise<IClipboard[] | null>;
  getGroupClipboards(
    userId: string,
    groupId: string,
  ): Promise<IClipboard[] | null>;
  deleteUserClipboard(userId: string, id: string): Promise<IClipboard>;
  deleteUserClipboards(userId: string): Promise<number>;
}
