import { IUser } from "./user";

export interface IGroup {
  id: string;
  name: string;

  members(): IUser[];
  isEmpty(): boolean;
  isMember(userId: string): boolean;
  getMember(userId: string): IUser | undefined; // maybe undefined if not found
  addMember(user: IUser): boolean;
  delMember(userId: string): boolean;
}

export class Group implements IGroup {
  id: string;
  name: string;
  private _members: Map<string, IUser>;

  constructor(id: string, name: string, users: IUser[]) {
    this.id = id;
    this.name = name;

    users.forEach((user) => {
      this._members.set(user.id, user);
    });
  }

  members(this: Group): IUser[] {
    return Array.from(this._members.values());
  }

  isEmpty(this: Group): boolean {
    return this._members.size === 0;
  }

  isMember(this: Group, userId: string): boolean {
    return this._members.get(userId) != undefined;
  }

  getMember(this: Group, userId: string): IUser | undefined {
    return this._members.get(userId);
  }

  addMember(this: Group, user: IUser): boolean {
    if (this.isMember(user.id)) {
      return false;
    }

    this._members.set(user.id, user);
    return true;
  }

  delMember(this: Group, userId: string): boolean {
    return this._members.delete(userId);
  }
}
