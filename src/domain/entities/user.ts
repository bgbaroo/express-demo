export interface IUser {
  id: string;
  email: string;

  groupsOwned(): string[] | undefined;
}

export class User implements IUser {
  id: string;
  email: string;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }

  groupsOwned(): string[] | undefined {
    return undefined;
  }
}
