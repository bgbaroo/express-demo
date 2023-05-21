import { IUseCaseUserRegister } from "../interfaces/usecases/user";
import { IRepositoryUser } from "../interfaces/repositories/user";
import { compareHash } from "./util/bcrypt";

import { IUser } from "../entities/user";

export class UseCaseUserLogin implements IUseCaseUserRegister {
  private readonly repo: IRepositoryUser;

  constructor(repo: IRepositoryUser) {
    this.repo = repo;
  }

  async execute(user: IUser, password: string): Promise<IUser> {
    const _user = await this.repo.getUserNotNullable({ email: user.email });
    if (!_user) {
      return Promise.reject(`no such user: ${user.email}`);
    }

    if (!compareHash(password, _user.password)) {
      return Promise.reject(`invalid password for user ${user.email}`);
    }

    return Promise.resolve(_user);
  }
}
