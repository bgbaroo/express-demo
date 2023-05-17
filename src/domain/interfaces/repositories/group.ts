import { IGroup } from "../../entities/group";

export interface IWhereGroup {
  id?: string;
  ownerId?: string;
  user?: {
    id: string;
  };
}

export interface IRepositoryGroup {
  createGroup(group: IGroup): Promise<IGroup>;
  getGroup(where: IWhereGroup): Promise<IGroup | null>;
  getGroups(where: IWhereGroup): Promise<IGroup[]>;
  updateGroup(group: IGroup): Promise<IGroup>;
  deleteGroup(where: IWhereGroup): Promise<IGroup>;
  deleteGroups(where: IWhereGroup): Promise<number>;
}
