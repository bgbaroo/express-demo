import { IRepositoryGroup, WhereGroup } from "../interfaces/repositories/group";
import { IGroup } from "../entities/group";
import { DataLinkGroup } from "../../data/sources/postgres/data-links/group";

export class RepositoryGroup implements IRepositoryGroup {
  private link: DataLinkGroup;

  constructor(link: DataLinkGroup) {
    this.link = link;
  }

  async createGroup(group: IGroup): Promise<IGroup> {
    return await this.link.createGroup(group);
  }

  async getGroup(where: WhereGroup): Promise<IGroup | null> {
    return await this.link.getGroup(where);
  }

  async getGroups(where: WhereGroup): Promise<IGroup[]> {
    return await this.link.getGroups(where);
  }

  async updateGroup(group: IGroup): Promise<IGroup> {
    return await this.link.updateGroup(group);
  }

  async deleteGroup(group: IGroup): Promise<IGroup> {
    return await this.link.deleteGroup(group);
  }
}
