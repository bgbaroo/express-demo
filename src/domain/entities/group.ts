import { IUser } from "./user";

export interface IGroup {
  id: string;
  name: string;

  members(): IUser[];
  isEmpty(): boolean;
  isMember(userId: string): boolean;
  getMember(userId: string): IUser | undefined; // maybe undefined if not found
  addMember(user: IUser): void;
  delMember(userId: string): boolean;
}

export class Group implements IGroup {
  id: string;
  name: string;

  private _users: IUser[];
  private findMemberIndex: (this: IGroup, userId: string) => number;

  constructor(id: string, name: string, users: IUser[]) {
    this.id = id;
    this.name = name;
    this._users = users;
  }

  members(this: Group): IUser[] {
    return this._users;
  }

  isEmpty(this: Group): boolean {
    return this._users.length === 0;
  }

  isMember(this: Group, userId: string): boolean {
    return !(this._users.find((u: IUser, _) => u.id === userId) == undefined);
  }

  getMember(this: Group, userId: string): IUser | undefined {
    return this._users.find((u: IUser, _) => u.id === userId) || undefined;
  }

  addMember(this: Group, user: IUser): void {
    this._users.push(user);
  }

  delMember(this: Group, userId: string): boolean {
    const idx = this.findMemberIndex(userId);
    if (idx === -1) {
      return false;
    }

    // Remove 1 element with splice at index idx
    this._users.splice(idx, 1);
    return true;
  }
}
