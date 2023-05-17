import { IRepositoryUser } from "../interfaces/repositories/user";
import { IUseCaseUserRegister } from "../interfaces/usecases/user";
import { hashPassword } from "./util/bcrypt";

import { IUser } from "../entities/user";

export class UseCaseUserRegister implements IUseCaseUserRegister {
  private readonly repo: IRepositoryUser;

  constructor(repo: IRepositoryUser) {
    this.repo = repo;
  }

  async execute(user: IUser, password: string): Promise<IUser> {
    return await this.repo.createUser(user, hashPassword(password));
  }
}
