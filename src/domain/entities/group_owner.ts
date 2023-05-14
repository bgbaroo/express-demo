import { IUser, User } from "./user";

export interface IGroupOwner extends IUser {
  groupsOwned(): string[];
  ownsGroup(groupId: string): boolean;
  ownNewGroup(groupId: string);
}

export class GroupOwner extends User implements IGroupOwner {
  private ownGroups: Set<string>;

  constructor(id: string, email: string) {
    super(id, email);
    this.ownGroups = new Set();
  }

  groupsOwned(): string[] {
    return Array.from(this.ownGroups);
  }

  ownsGroup(groupId: string): boolean {
    return this.ownGroups.has(groupId);
  }

  ownNewGroup(groupId: string) {
    this.ownGroups.add(groupId);
  }
}
