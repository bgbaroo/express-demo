import { IGroup } from "../../entities/group";

export interface IUseCaseGroupCreateGroup {
  execute(group: IGroup): Promise<IGroup>;
}

export interface IUseCaseGroupGetGroup {
  execute(id: string): Promise<IGroup | null>;
}

export interface IUseCaseGroupGetUserGroups {
  execute(userId: string): Promise<IGroup[] | null>;
}

export interface IUseCaseGroupGetUserOwnedGroups {
  execute(userId: string): Promise<IGroup[] | null>;
}
