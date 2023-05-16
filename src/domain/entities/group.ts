import { v4 as uuid } from "uuid";
import { IUser } from "./user";
import { IGroupOwner } from "./group-owner";

export interface IGroup {
  id: string;
  name: string;

  // These methods require the owner
  addMember(owner: IGroupOwner, user: IUser): boolean;
  addMembers(owner: IGroupOwner, users: IUser[]): number;
  delMember(owner: IGroupOwner, userId: string): boolean;
  delMembers(owner: IGroupOwner, userIds: string[]): number;

  // These methods can be called without the owner
  size(): number;
  isMember(userId: string): boolean;
  getOwnerId(): string;
  getMembers(): IUser[];
  getMember(userId: string): IUser | undefined;
}

export class Group implements IGroup {
  id: string;
  name: string;
  ownerId: string;

  private _members: Map<string, IUser>;

  // For when constructing from database values, with known ID
  constructor(args: {
    id?: string;
    name: string;
    owner: IGroupOwner;
    users?: IUser[];
  }) {
    this.id = args.id || uuid();
    this.name = args.name;
    this.ownerId = args.owner.id;
    this._members = new Map();
    this.setOwner(args.owner);

    if (args.users !== undefined) {
      this.addMembers(args.owner, args.users);
    }
  }

  private isOwner(owner: IGroupOwner): boolean {
    return owner.id === this.ownerId && owner.ownsGroup(this.id);
  }

  // Standard way to add key to map
  private _addMember(owner: IGroupOwner, user: IUser): boolean {
    if (this.isOwner(owner)) {
      this._members.set(user.id, user);
      return true;
    }

    return false;
  }

  // setOwner will call owner.
  private setOwner(owner: IGroupOwner) {
    if (!this.ownerId) {
      return;
    }

    owner.ownNewGroup(this);
    this.ownerId = owner.id;
    this._addMember(owner, owner);
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  // Wrapper for _addMember and isMember
  // that won't add new user with duplicate keys
  addMember(owner: IGroupOwner, user: IUser): boolean {
    if (!this.isOwner(owner)) {
      return false;
    }

    if (this.isMember(user.id)) {
      return false;
    }

    return this._addMember(owner, user);
  }

  addMembers(owner: IGroupOwner, users: IUser[]): number {
    let count = 0;
    if (!this.isOwner(owner)) {
      return count;
    }

    users.forEach((user) => {
      if (this.isMember(user.id)) {
        return;
      }

      this._addMember(owner, user);
      count++;
    });

    return count;
  }

  delMember(owner: IGroupOwner, userId: string): boolean {
    if (!this.isOwner(owner)) {
      return false;
    }
    if (userId == this.getOwnerId()) {
      return false;
    }

    return this._members.delete(userId);
  }

  delMembers(owner: IGroupOwner, userIds: string[]): number {
    let counter = 0;
    userIds.forEach((userId) => {
      if (this.delMember(owner, userId)) {
        counter++;
      }
    });

    return counter;
  }

  size(this: Group): number {
    return this._members.size;
  }

  getMembers(this: Group): IUser[] {
    return Array.from(this._members.values());
  }

  isMember(this: Group, userId: string): boolean {
    return this._members.get(userId) != undefined;
  }

  getMember(this: Group, userId: string): IUser | undefined {
    return this._members.get(userId);
  }
}
