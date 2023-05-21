import { IGroup } from "../../entities/group";

export interface CreateGroupArg {
  name: string;
  ownerId: string;
  ownerEmail: string;
  memberEmails: string[] | undefined;
}

export interface IUseCaseCreateGroup {
  execute(arg: CreateGroupArg): Promise<IGroup>;
}

export interface IUseCaseGetGroup {
  execute(id: string): Promise<IGroup | null>;
}

export interface IUseCaseGetUserGroups {
  execute(userId: string): Promise<IGroup[] | null>;
}

export interface IUseCaseGetOwnedGroups {
  execute(userId: string): Promise<IGroup[] | null>;
}

export interface IUseCaseDeleteGroup {
  execute(userId: string, id: String): Promise<IGroup>;
}

export interface IUseCaseDeleteUserGroups {
  execute(userId: string): Promise<number>;
}
