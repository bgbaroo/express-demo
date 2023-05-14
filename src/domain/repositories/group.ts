import { IRepositoryGroup } from "../interfaces/repositories/group";
import { IGroup } from "../entities/group";
import { DataLinkGroup } from "../../data/sources/postgres/datalink/group";

export class RepositoryGroup implements IRepositoryGroup {
  private link: DataLinkGroup;

  constructor(link: DataLinkGroup) {
    this.link = link;
  }

  async createGroup(group: IGroup): Promise<IGroup> {
    return await this.link.createGroup(group);
  }

  async getGroup(id: string): Promise<IGroup | null> {
    return await this.link.getGroup(id);
  }

  async getGroups(): Promise<IGroup[]> {
    return await this.link.getGroups();
  }

  async updateGroup(group: IGroup): Promise<IGroup> {
    return await this.link.updateGroup(group);
  }

  async deleteGroup(group: IGroup): Promise<IGroup> {
    return await this.link.deleteGroup(group);
  }
}
