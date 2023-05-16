import { v4 as uuid } from "uuid";
import { IGroup } from "./group";

export interface IUser {
  id: string;
  email: string;

  groupsOwned(): IGroup[];
  groups(): IGroup[];
}

export interface IUserArg {
  email: string;
  id?: string;
  groups?: IGroup[];
}

// Basic user who does not own any groups.
// Otherwise, see class GroupOwner.
export class User implements IUser {
  id: string;
  email: string;

  private _groups: Set<IGroup>;

  // Creates a new User. If id is undefined,
  // UUID will be auto-generated for the user
  constructor(arg: IUserArg) {
    this.id = arg.id || uuid();
    this.email = arg.email;
    this._groups = new Set(arg.groups);
  }

  groupsOwned(): IGroup[] {
    return [];
  }

  groups(): IGroup[] {
    return Array.from(this._groups);
  }
}
