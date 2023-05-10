import { IGroup } from "../../entities/group";

export interface IGroupRepository {
  createGroup(group: IGroup): Promise<void>;
  getGroup(id: string): Promise<IGroup>;
  getGroups(): Promise<IGroup[]>;
  updateGroup(group: IGroup): Promise<void>;
  deleteGroup(group: IGroup): Promise<void>;
}
