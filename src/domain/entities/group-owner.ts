import { IUser, User } from "./user";

export interface IGroupOwner extends IUser {
  groupsOwned(): string[];
  ownsGroup(groupId: string): boolean;
  ownNewGroup(groupId: string);
}

export class GroupOwner extends User implements IGroupOwner {
  private ownGroups: Set<string>;

  constructor(email: string, id?: string, ownGroups?: Set<string>) {
    super(email, id);
    this.ownGroups = ownGroups || new Set();
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
