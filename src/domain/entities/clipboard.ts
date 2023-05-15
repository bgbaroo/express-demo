import { v4 as uuid } from "uuid";
import { IUser } from "./user";

export interface IClipboard {
  id: string;
  content: string;
  title: string | undefined;
  expiration: Date | undefined;

  getUser(): IUser;
  getUserId(): string;
}

export class Clipboard implements IClipboard {
  id: string;
  title: string | undefined;
  content: string;
  expiration: Date | undefined;

  private user: IUser;

  constructor(arg: {
    id?: string;
    user: IUser;
    title?: string;
    content: string;
    expiration?: Date;
  }) {
    this.id = arg.id || uuid();
    this.user = arg.user;
    this.title = arg.title;
    this.content = arg.content;
    this.expiration = arg.expiration;
  }

  getUser(): IUser {
    return this.user;
  }

  getUserId(): string {
    return this.user.id;
  }
}
