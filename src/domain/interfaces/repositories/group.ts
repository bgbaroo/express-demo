import { IGroup } from "../../entities/group";

export interface IRepositoryGroup {
  createGroup(group: IGroup): Promise<IGroup>;
  getGroup(id: string): Promise<IGroup | null>;
  getGroups(): Promise<IGroup[]>;
  updateGroup(group: IGroup): Promise<IGroup>;
  deleteGroup(group: IGroup): Promise<IGroup>;
}
