import { IUserData } from "../../../data/sources/postgres/data-models/user";

import { IUser } from "../../entities/user";

export interface WhereUser {
  email?: string;
  id?: string;
}

export interface IRepositoryUser {
  createUser(user: IUser, password: string): Promise<IUserData>;
  getUser(where: WhereUser): Promise<IUserData | null>;
  getUsers(): Promise<IUserData[] | null>;
  updateUser(user: IUser): Promise<IUserData | null>;
  deleteUser(id: string): Promise<IUserData | null>;
}
