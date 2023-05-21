import { IUserData } from "../../../data/sources/postgres/data-models/user";

import { IUser } from "../../entities/user";

export interface IWhereUser {
  email?: string;
  id?: string;
}

export interface IRepositoryUser {
  createUser(user: IUser, password: string): Promise<IUserData>;
  getUserNotNullable(where: IWhereUser): Promise<IUserData>;
  getUser(where: IWhereUser): Promise<IUserData | null>;
  getUsers(): Promise<IUserData[]>;
  updateUser(user: IUser, where: IWhereUser): Promise<IUserData>;
  changePassword(user: IUser, newPassword: string): Promise<IUserData>;
  deleteUser(id: string): Promise<IUserData>;
}
