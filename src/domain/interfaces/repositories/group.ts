import { IGroup } from "../../entities/group";

export interface WhereGroup {
  id?: string;
  ownerId?: string;
  user?: {
    id: string;
  };
}

export interface IRepositoryGroup {
  createGroup(group: IGroup): Promise<IGroup>;
  getGroup(where: WhereGroup): Promise<IGroup | null>;
  getGroups(where: WhereGroup): Promise<IGroup[]>;
  updateGroup(group: IGroup): Promise<IGroup>;
  deleteGroup(where: WhereGroup): Promise<IGroup>;
  deleteGroups(where: WhereGroup): Promise<number>;
}
