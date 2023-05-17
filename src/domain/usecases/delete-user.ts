import { IRepositoryUser } from "../interfaces/repositories/user";

import { IUser } from "../entities/user";

export class UseCaseUserDeleteUser {
  private readonly repo: IRepositoryUser;

  constructor(repo: IRepositoryUser) {
    this.repo = repo;
  }

  async execute(user: IUser, newPassword: string): Promise<IUser> {
    const _user = await this.repo.getUser({ email: user.email });
    if (!_user) {
      return Promise.reject(`no such user: ${user.email}`);
    }

    if (_user.password === newPassword) {
      return Promise.reject("password unchanged");
    }

    return this.repo.deleteUser(_user.id);
  }
}
