import { IClipboard } from "../../entities/clipboard";

export interface IClipboardRepository {
  newClipboardId(): string;
  createClipboard(clipboard: IClipboard): Promise<void>;
  getClipboard(id: string, userId: string): Promise<IClipboard | undefined>;
  getClipboards(userId: string): Promise<IClipboard[]>;
  updateClipboard(clipboard: IClipboard);
  deleteClipboard(id: string, userId: string): Promise<boolean>;
}
