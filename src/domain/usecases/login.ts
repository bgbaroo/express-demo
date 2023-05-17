import { IUseCaseUserRegister } from "../interfaces/usecases/user";
import { IRepositoryUser } from "../interfaces/repositories/user";
import { IUser } from "../entities/user";

export class UseCaseUserLogin implements IUseCaseUserRegister {
  private readonly repo: IRepositoryUser;

  constructor(repo: IRepositoryUser) {
    this.repo = repo;
  }

  async execute(user: IUser, password: string): Promise<IUser> {
    const _user = await this.repo.getUser({ email: user.email });
    if (!_user) {
      return Promise.reject(`no such user: ${user.email}`);
    }

    if (_user.password !== password) {
      return Promise.reject("invalid password");
    }

    return Promise.resolve(_user);
  }
}
