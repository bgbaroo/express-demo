import { IClipboard } from "../../entities/clipboard";

export interface IUsecaseClipboard {
  newClipboardId(): string;
  createClipboard(clipboard: IClipboard): Promise<void>;
  getClipboard(id: string, userId: string): Promise<IClipboard | undefined>;
  deleteClipboard(id: string, userId: string): Promise<boolean>;
}
