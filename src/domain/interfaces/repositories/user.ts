import { IUser } from "../../entities/user";

export interface IRepositoryUser {
  createUser(user: IUser): Promise<void>;
  getUser(): Promise<IUser>;
  getUsers(): Promise<IUser[]>;
  updateUser(user: IUser): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
