import { IRepositoryUser } from "../interfaces/repositories/user";
import {
  IUseCaseUserChangePassword,
  IUseCaseUserDeleteUser,
  IUseCaseUserGetUser,
  IUseCaseUserRegister,
} from "../interfaces/usecases/user";
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

export class UseCaseUserChangePassword
  extends BaseUseCaseUser
  implements IUseCaseUserChangePassword
{
  constructor(repo: IRepositoryUser) {
    super(repo);
  }

  async execute(user: IUser, newPassword: string): Promise<IUser> {
    const _user = await this.repo.getUser({ email: user.email });
    if (!_user) {
      return Promise.reject(`no such user: ${user.email}`);
    }

    if (_user.password === newPassword) {
      return Promise.reject("password unchanged");
    }

    return await this.repo.changePassword(_user, newPassword);
  }
}

export class UseCaseUserDeleteUser
  extends BaseUseCaseUser
  implements IUseCaseUserDeleteUser
{
  constructor(repo: IRepositoryUser) {
    super(repo);
  }

  async execute(user: IUser, newPassword: string): Promise<IUser> {
    const _user = await this.repo.getUser({ email: user.email });
    if (!_user) {
      return Promise.reject(`no such user: ${user.email}`);
    }

    if (_user.password === newPassword) {
      return Promise.reject("password unchanged");
    }

    return await this.repo.deleteUser(_user.id);
  }
}

export class UseCaseUserGetUser
  extends BaseUseCaseUser
  implements IUseCaseUserGetUser
{
  constructor(repo: IRepositoryUser) {
    super(repo);
  }

  async execute(userId: string): Promise<IUser> {
    return await this.repo.getUser({ id: userId });
  }
}
