import { IClipboard } from "../../entities/clipboard";

export interface IClipboardUseCase {
  newClipboardId(): string;
  createClipboard(clipboard: IClipboard): Promise<void>;
  getClipboard(id: string, userId: string): Promise<IClipboard>;
  deleteClipboard(id: string, userId: string): Promise<boolean>;
}
