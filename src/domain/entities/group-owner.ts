import { IUser, User, IUserArg } from "./user";
import { IGroup } from "./group";

export interface IGroupOwner extends IUser {
  groupsOwned(): IGroup[];
  ownsGroup(groupId: string): boolean;
  ownNewGroup(group: IGroup);
}

export interface IGroupOwnerArg extends IUserArg {
  ownGroups?: IGroup[];
}

export class GroupOwner extends User implements IGroupOwner {
  private _ownGroups: Set<IGroup>;

  constructor(arg: IGroupOwnerArg) {
    super(arg);
    this._ownGroups = new Set(arg.ownGroups);
  }

  groupsOwned(): IGroup[] {
    return Array.from(this._ownGroups);
  }

  ownsGroup(groupId: string): boolean {
    return this.groupsOwned()
      .map((group) => group.id)
      .includes(groupId);
  }

  ownNewGroup(group: IGroup) {
    this._ownGroups.add(group);
  }
}
