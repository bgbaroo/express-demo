import { v4 as uuid } from "uuid";
import { IUser } from "./user";

export interface IClipboard {
  id: string;
  title: string | undefined;
  content: string;
  shared: boolean;
  expiration: Date | undefined;

  getUser(): IUser;
  getUserId(): string;
}

export class Clipboard implements IClipboard {
  id: string;
  title: string | undefined;
  content: string;
  shared = false;
  expiration: Date | undefined;

  private user: IUser;

  constructor(arg: {
    id?: string;
    user: IUser;
    title?: string;
    content: string;
    shared: boolean;
    expiration?: Date;
  }) {
    this.id = arg.id || uuid();
    this.user = arg.user;
    this.title = arg.title;
    this.content = arg.content;

    if (arg.expiration) {
      this.expiration = arg.expiration;
    }
    if (arg.shared !== undefined) {
      this.shared = arg.shared;
    }
  }

  getUser(): IUser {
    return this.user;
  }

  getUserId(): string {
    return this.user.id;
  }
}
