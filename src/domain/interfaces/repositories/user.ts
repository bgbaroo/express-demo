import { IUserData } from "../../../data/sources/postgres/data-models/user";

import { IUser } from "../../entities/user";

export interface WhereUser {
  email?: string;
  id?: string;
}

export interface IRepositoryUser {
  createUser(user: IUser, password: string): Promise<IUserData>;
  getUser(where: WhereUser): Promise<IUserData>;
  getUsers(): Promise<IUserData[]>;
  updateUser(user: IUser, where: WhereUser): Promise<IUserData>;
  changePassword(user: IUser, newPassword: string): Promise<IUserData>;
  deleteUser(id: string): Promise<IUserData>;
}
