import { IDataLinkUser } from "../../data/interfaces/data-links";
import { IUserData } from "../../data/sources/postgres/data-models/user";
import { IUser } from "../entities/user";
import { IRepositoryUser, IWhereUser } from "../interfaces/repositories/user";

export class RepositoryUser implements IRepositoryUser {
  private link: IDataLinkUser;

  constructor(link: IDataLinkUser) {
    this.link = link;
  }

  async createUser(user: IUser, password: string): Promise<IUserData> {
    return await this.link.createUser(user, password);
  }

  async getUser(where: IWhereUser): Promise<IUserData> {
    const user = await this.link.getUser(where);
    if (!user) {
      return Promise.reject(`null user: ${where}`);
    }

    return Promise.resolve(user);
  }

  async getUsers(): Promise<IUserData[]> {
    const users = await this.link.getUsers();
    if (!users) {
      return Promise.reject(`null users`);
    }

    return Promise.resolve(users);
  }

  async updateUser(user: IUser, where: IWhereUser): Promise<IUserData> {
    return await this.link.updateUser(user, where);
  }

  async changePassword(user: IUser, newPassword: string): Promise<IUserData> {
    const _user = await this.link.changePassword(user, newPassword);
    if (!_user) {
      return Promise.reject(`null user: ${user.email}`);
    }

    return Promise.resolve(_user);
  }

  async deleteUser(id: string): Promise<IUserData> {
    return await this.deleteUser(id);
  }
}
