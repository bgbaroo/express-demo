import { IClipboard } from "../../entities/clipboard";

export interface IUseCaseCreateClipboard {
  execute(clipboard: IClipboard): Promise<void>;
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
