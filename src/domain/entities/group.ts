import { IUser } from "./user";

export interface IGroup {
  id: string;
  name: string;

  addMember(user: IUser): boolean;
  members(): IUser[];
  size(): number;
  isEmpty(): boolean;
  isMember(email: string): boolean;
  getMember(email: string): IUser | undefined;
  delMember(email: string): boolean;
}

export class Group implements IGroup {
  id: string;
  name: string;
  private _members: Map<string, IUser>;

  constructor(id: string, name: string, users: IUser[]) {
    this.id = id;
    this.name = name;
    this._members = new Map();

    users.forEach((user) => {
      this.addMember(user);
    });
  }

  // Do not add new user with duplicate emails
  addMember(this: Group, user: IUser): boolean {
    if (this.isMember(user.email)) {
      return false;
    }

    this._members.set(user.email, user);
    return true;
  }

  size(this: Group): number {
    return this._members.size;
  }

  members(this: Group): IUser[] {
    return Array.from(this._members.values());
  }

  isEmpty(this: Group): boolean {
    return this._members.size === 0;
  }

  isMember(this: Group, email: string): boolean {
    return this._members.get(email) != undefined;
  }

  getMember(this: Group, email: string): IUser | undefined {
    return this._members.get(email);
  }

  delMember(this: Group, email: string): boolean {
    return this._members.delete(email);
  }
}
