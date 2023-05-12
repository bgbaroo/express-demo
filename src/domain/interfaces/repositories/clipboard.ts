import { IClipboard } from "../../entities/clipboard";

export interface IRepositoryClipboard {
  newClipboardId(): string;
  createClipboard(clipboard: IClipboard): Promise<void>;
  getUserClipboard(userId: string, id: string): Promise<IClipboard | undefined>;
  getUserClipboards(userId: string): Promise<IClipboard[]>;
  updateClipboard(clipboard: IClipboard);
  deleteUserClipboard(userId: string, id: string): Promise<boolean>;
}
