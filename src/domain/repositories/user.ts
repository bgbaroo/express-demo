import { DataLinkUser } from "../../data/sources/postgres/data-links/user";
import { IUser } from "../entities/user";
import { IRepositoryUser } from "../interfaces/repositories/user";

export class RepositoryUser implements IRepositoryUser {
  private link: DataLinkUser;

  constructor(link: DataLinkUser) {
    this.link = link;
  }

  async createUser(user: IUser, password: string): Promise<IUser> {
    return await this.link.createUser(user, password);
  }

  async getUser(id: string): Promise<IUser | null> {
    return await this.link.getUser(id);
  }

  async getUsers(): Promise<IUser[] | null> {
    return await this.link.getUsers();
  }

  async updateUser(user: IUser): Promise<IUser | null> {
    return await this.updateUser(user);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await this.deleteUser(id);
  }
}
