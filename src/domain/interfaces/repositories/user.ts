import { IUser } from "../../entities/user";

export interface IRepositoryUser {
  createUser(user: IUser, password: string): Promise<IUser>;
  getUser(id: string): Promise<IUser | null>;
  getUsers(): Promise<IUser[] | null>;
  updateUser(user: IUser): Promise<IUser | null>;
  deleteUser(id: string): Promise<IUser | null>;
}
