import { IUser } from "../../../../domain/entities/user";
import { BasePrismaSchemaDataLink, DbDriver } from "./prisma-postgres";
import userAdapter from "./adapters/user";

export class DataLinkUser extends BasePrismaSchemaDataLink {
  constructor(db: DbDriver) {
    super(db);
  }

  async createUser(user: IUser, password: string): Promise<IUser> {
    return this.db.user
      .create({
        data: userAdapter.formCreateUserToDataModelUser(user, password),
      })
      .then((created) => userAdapter.dataModelUserToIUser(created))
      .catch((err) => Promise.reject(`failed to create user: ${err}`));
  }

  async getUser(id: string): Promise<IUser | null> {
    return this.db.user
      .findUnique({
        where: {
          id: id,
        },
        include: {
          groups: true,
          ownGroups: true,
        },
      })
      .then((user) => {
        if (!user) {
          return Promise.resolve(null);
        }

        return Promise.resolve(userAdapter.dataModelUserToIUser(user));
      })
      .catch((err) => Promise.reject(`failed to get user ${id}: ${err}`));
  }

  async getUsers(): Promise<IUser[] | null> {
    return this.db.user
      .findMany({
        include: {
          groups: true,
          ownGroups: true,
        },
      })
      .then((users) => {
        if (!users) {
          return Promise.resolve(null);
        }
        return Promise.resolve(userAdapter.dataModelUsersToIUsers(users));
      })
      .catch((err) => Promise.reject(`failed to get users: ${err}`));
  }

  async updateUser(user: IUser): Promise<IUser | null> {
    return this.db.user
      .update({
        where: {
          id: user.id,
        },
        data: {
          ...user,
          groups: {},
          ownGroups: {},
        },
      })
      .then((updated) => {
        if (!updated) {
          return Promise.reject(null);
        }

        return Promise.resolve(userAdapter.dataModelUserToIUser(updated));
      })
      .catch((err) => Promise.reject(`failed to update user ${user}: ${err}`));
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return this.db.user
      .delete({
        where: { id },
      })
      .then((deleted) => {
        if (!deleted) {
          return Promise.resolve(null);
        }
        return Promise.resolve(userAdapter.dataModelUserToIUser(deleted));
      })
      .catch((err) => Promise.reject(`failed to delete users: ${err}`));
  }
}
