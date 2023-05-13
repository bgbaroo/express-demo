import { IUser } from "../entities/user";
import { IRepositoryUser } from "../interfaces/repositories/user";

export class RepositoryUser implements IRepositoryUser {
  createUser(_user: IUser): Promise<void> {
    return Promise.reject("not implemented");
  }
  getUser(): Promise<IUser> {
    return Promise.reject("not implemented");
  }
  getUsers(): Promise<IUser[]> {
    return Promise.reject("not implemented");
  }
  updateUser(_user: IUser): Promise<void> {
    return Promise.reject("not implemented");
  }
  deleteUser(_id: string): Promise<void> {
    return Promise.reject("not implemented");
  }
}
