import { IUseCaseGetUserByEmail } from "../interfaces/usecases/user";
import { IRepositoryUser } from "../interfaces/repositories/user";
import { IUser } from "../entities/user";

export class UseCaseGetUserByEmail implements IUseCaseGetUserByEmail {
  private readonly repo: IRepositoryUser;

  constructor(repo: IRepositoryUser) {
    this.repo = repo;
  }

  async execute(email: string): Promise<IUser | null> {
    return await this.repo.getUser({ email });
  }
}
