import { IClipboard } from "../../entities/clipboard";

// IPreClipboard is IClipboard without the field id
export interface IPreClipboard extends Omit<IClipboard, "id"> {}

export interface IUsecaseClipboard {
  createClipboard(clipboard: IPreClipboard): Promise<void>;
  getClipboard(id: string, userId: string): Promise<IClipboard | undefined>;
  deleteClipboard(id: string, userId: string): Promise<boolean>;
}
