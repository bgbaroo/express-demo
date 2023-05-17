import { IUserData } from "../sources/postgres/data-models/user";
import { IWhereUser } from "../../domain/interfaces/repositories/user";
import { IWhereGroup } from "../../domain/interfaces/repositories/group";
import { IWhereClipboard } from "../../domain/interfaces/repositories/clipboard";

import { IUser } from "../../domain/entities/user";
import { IGroup } from "../../domain/entities/group";
import { IClipboard } from "../../domain/entities/clipboard";

export interface IDataLinkUser {
  createUser(user: IUser, password: string): Promise<IUserData>;
  getUser(where: IWhereUser): Promise<IUserData | null>;
  getUsers(): Promise<IUserData[] | null>;
  getUsers(): Promise<IUserData[] | null>;
  updateUser(user: IUser, where: IWhereUser): Promise<IUserData>;
  changePassword(user: IUser, newPassword: string): Promise<IUserData>;
  deleteUser(id: string): Promise<IUserData | null>;
}

export interface IDataLinkGroup {
  createGroup(group: IGroup): Promise<IGroup>;
  getGroup(where: IWhereGroup): Promise<IGroup | null>;
  getGroups(where: IWhereGroup): Promise<IGroup[]>;
  updateGroup(group: IGroup): Promise<IGroup>;
  deleteGroup(where: IWhereGroup): Promise<IGroup>;
  deleteGroups(where: IWhereGroup): Promise<number>;
}

export interface IDataLinkClipboard {
  createClipboard(clipboard: IClipboard): Promise<IClipboard>;
  getClipboard(where: IWhereClipboard | undefined): Promise<IClipboard | null>;
  getClipboards(
    where: IWhereClipboard | undefined,
  ): Promise<IClipboard[] | null>;
  deleteClipboard(where: IWhereClipboard): Promise<IClipboard>;
  deleteClipboards(where: IWhereClipboard): Promise<number>;
}
