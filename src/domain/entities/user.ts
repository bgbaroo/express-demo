import { v4 as uuid } from "uuid";

export interface IUser {
  id: string;
  email: string;

  groupsOwned(): string[] | undefined;
}

// Basic user who does not own any groups.
// Otherwise, see class GroupOwner.
export class User implements IUser {
  id: string;
  email: string;

  // Creates a new User. If id is undefined,
  // UUID will be auto-generated for the user
  constructor(email: string, id?: string) {
    this.id = id || uuid();
    this.email = email;
  }

  groupsOwned(): string[] | undefined {
    return undefined;
  }
}
