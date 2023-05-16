import { DataLinkUser } from "../../data/sources/postgres/data-links/user";
import { IUserData } from "../../data/sources/postgres/data-models/user";
import { IUser } from "../entities/user";
import { IRepositoryUser, WhereUser } from "../interfaces/repositories/user";

export class RepositoryUser implements IRepositoryUser {
  private link: DataLinkUser;

  constructor(link: DataLinkUser) {
    this.link = link;
  }

  async createUser(user: IUser, password: string): Promise<IUserData> {
    return await this.link.createUser(user, password);
  }

  async getUser(where: WhereUser): Promise<IUserData | null> {
    return await this.link.getUser(where);
  }

  async getUsers(): Promise<IUserData[] | null> {
    return await this.link.getUsers();
  }

  async updateUser(user: IUser): Promise<IUserData | null> {
    return await this.updateUser(user);
  }

  async deleteUser(id: string): Promise<IUserData | null> {
    return await this.deleteUser(id);
  }
}
