import { IRepositoryUser } from "../interfaces/repositories/user";
import { IUseCaseUserRegister } from "../interfaces/usecases/user";
import { IUser } from "../entities/user";

class BaseUseCaseUser {
  protected readonly repo: IRepositoryUser;

  constructor(repo: IRepositoryUser) {
    this.repo = repo;
  }
}

export class UseCaseUserRegister
  extends BaseUseCaseUser
  implements IUseCaseUserRegister
{
  constructor(repo: IRepositoryUser) {
    super(repo);
  }

  async execute(user: IUser, password: string): Promise<IUser> {
    return await this.repo.createUser(user, password);
  }
}

export class UseCaseUserLogin
  extends BaseUseCaseUser
  implements IUseCaseUserRegister
{
  constructor(repo: IRepositoryUser) {
    super(repo);
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
