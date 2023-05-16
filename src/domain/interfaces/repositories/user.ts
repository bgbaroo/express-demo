import { IUserData } from "../../../data/sources/postgres/data-models/user";

import { IUser } from "../../entities/user";

export interface IRepositoryUser {
  createUser(user: IUser, password: string): Promise<IUserData>;
  getUser(id: string): Promise<IUserData | null>;
  getUsers(): Promise<IUserData[] | null>;
  updateUser(user: IUser): Promise<IUserData | null>;
  deleteUser(id: string): Promise<IUserData | null>;
}
