import { IClipboard } from "../../entities/clipboard";

// IPreClipboard is IClipboard without the field id
export interface IPreClipboard extends Omit<IClipboard, "id"> {}

export interface IUsecaseClipboard {
  createClipboard(clipboard: IPreClipboard): Promise<void>;
  getUserClipboard(userId: string, id: string): Promise<IClipboard | undefined>;
  deleteUserClipboard(userId: string, id: string): Promise<boolean>;
}
