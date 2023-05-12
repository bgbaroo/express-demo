import { IClipboard } from "../../entities/clipboard";

// IPreClipboard is IClipboard without the field id
export interface IPreClipboard extends Omit<IClipboard, "id"> {}

export interface IUseCaseCreateClipboard {
  execute(clipboard: IPreClipboard): Promise<void>;
}

export interface IUseCaseGetUserClipboard {
  execute(userId: string, id: string): Promise<IClipboard | undefined>;
}

export interface IUseCaseGetUserClipboards {
  execute(userId: string): Promise<IClipboard[]>;
}

export interface IUseCaseDeleteUserClipboard {
  execute(userId: string, id: string): Promise<boolean>;
}

export interface IUseCaseDeleteUserClipboards {
  execute(userId: string): Promise<number>;
}
