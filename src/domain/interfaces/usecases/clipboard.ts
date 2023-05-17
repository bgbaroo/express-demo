import { IClipboard } from "../../entities/clipboard";

export interface IUseCaseCreateClipboard {
  execute(clipboard: IClipboard): Promise<IClipboard>;
}

export interface IUseCaseGetUserClipboard {
  execute(userId: string, id: string): Promise<IClipboard | null>;
}

export interface IUseCaseGetUserClipboards {
  execute(userId: string): Promise<IClipboard[] | null>;
}

export interface IUseCaseGetGroupClipboards {
  execute(userId: string, groupId: string): Promise<IClipboard[] | null>;
}

export interface IUseCaseDeleteUserClipboard {
  execute(userId: string, id: string): Promise<IClipboard>;
}

export interface IUseCaseDeleteUserClipboards {
  execute(userId: string): Promise<number>;
}
