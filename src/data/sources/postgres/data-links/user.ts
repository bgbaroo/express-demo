import { BasePrismaSchemaDataLink, DbDriver } from "../";
import { IDataLinkUser } from "../../../interfaces/data-links";
import modelUser, { IUserData } from "../data-models/user";

import { IWhereUser } from "../../../../domain/interfaces/repositories/user";
import { IUser } from "../../../../domain/entities/user";

export class DataLinkUser
  extends BasePrismaSchemaDataLink
  implements IDataLinkUser
{
  constructor(db: DbDriver) {
    super(db);
  }

  async createUser(user: IUser, password: string): Promise<IUserData> {
    return this.db.user
      .create({
        include: modelUser.includeGroupsAndOwnGroups(),
        data: modelUser.formCreateUserToDataModelUser(user, password),
      })
      .then((created) => modelUser.toUser(created))
      .catch((err) => Promise.reject(`failed to create user: ${err}`));
  }

  async getUser(where: IWhereUser): Promise<IUserData | null> {
    return this.db.user
      .findUnique({
        include: modelUser.includeGroupsAndOwnGroups(),
        where,
      })
      .then((user) => {
        if (!user) {
          return Promise.resolve(null);
        }

        return Promise.resolve(modelUser.toUser(user));
      })
      .catch((err) =>
        Promise.reject(
          `failed to get user (id: ${where.id}, email: ${where.email}): ${err}`,
        ),
      );
  }

  async getUsers(): Promise<IUserData[] | null> {
    return this.db.user
      .findMany({
        include: modelUser.includeGroupsAndOwnGroups(),
      })
      .then((users) => {
        if (!users) {
          return Promise.resolve(null);
        }
        return Promise.resolve(modelUser.toUsers(users));
      })
      .catch((err) => Promise.reject(`failed to get users: ${err}`));
  }

  // TODO: check if groups and ownGroups was updated
  async updateUser(user: IUser, where: IWhereUser): Promise<IUserData> {
    return this.db.user
      .update({
        include: modelUser.includeGroupsAndOwnGroups(),
        where,
        data: {
          ...user,
          groups: {
            set: user.groups().map((group): { id: string } => {
              return { id: group.id };
            }),
          },
          ownGroups: {
            set: user.groupsOwned().map((group): { id: string } => {
              return { id: group.id };
            }),
          },
        },
      })
      .then((updated) => {
        if (!updated) {
          return Promise.reject(null);
        }

        return Promise.resolve(modelUser.toUser(updated));
      })
      .catch((err) => Promise.reject(`failed to update user ${user}: ${err}`));
  }

  async changePassword(user: IUser, newPassword: string): Promise<IUserData> {
    return this.db.user
      .update({
        include: modelUser.includeGroupsAndOwnGroups(),
        where: {
          id: user.id,
        },
        data: {
          password: newPassword,
        },
      })
      .then((updated) => {
        if (!updated) {
          return Promise.reject(null);
        }

        return Promise.resolve(modelUser.toUser(updated));
      })
      .catch((err) => Promise.reject(`failed to update user ${user}: ${err}`));
  }

  async deleteUser(id: string): Promise<IUserData | null> {
    return this.db.user
      .delete({
        include: modelUser.includeGroupsAndOwnGroups(),
        where: { id },
      })
      .then((deleted) => {
        if (!deleted) {
          return Promise.resolve(null);
        }
        return Promise.resolve(modelUser.toUser(deleted));
      })
      .catch((err) => Promise.reject(`failed to delete users: ${err}`));
  }
}
