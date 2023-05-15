import { BasePrismaSchemaDataLink, DbDriver } from "./prisma-postgres";
import modelGroup from "../datamodels/group";
import modelUser from "../datamodels/user";

import { IGroup } from "../../../../domain/entities/group";

export class DataLinkGroup extends BasePrismaSchemaDataLink {
  constructor(db: DbDriver) {
    super(db);
  }

  async createGroup(group: IGroup): Promise<IGroup> {
    return this.db.group
      .create({
        include: modelGroup.alwaysIncludeOwnerAndUsers(),
        data: {
          id: group.id,
          name: group.name,
          users: {
            connect: modelUser.usersToUserIds(group.getMembers()),
          },
          owner: {
            connect: {
              id: group.getOwnerId(),
            },
          },
        },
      })
      .then((result) => {
        return Promise.resolve(modelGroup.toGroupWithMembers(result));
      })
      .catch((err) => Promise.reject(`failed to create group: ${err}`));
  }

  async getGroup(id: string): Promise<IGroup | null> {
    return this.db.group
      .findUnique({
        include: modelGroup.alwaysIncludeOwnerAndUsers(),
        where: { id },
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(null);
        }

        return Promise.resolve(modelGroup.toGroupWithMembers(result));
      })
      .catch((err) => Promise.reject(`failed to get group: ${err}`));
  }

  async getGroups(): Promise<IGroup[]> {
    return this.db.group
      .findMany({
        include: modelGroup.alwaysIncludeOwnerAndUsers(),
      })
      .then((groups) =>
        groups.map((group) => {
          return modelGroup.toGroupWithMembers(group);
        }),
      )
      .catch((err) => Promise.reject(`failed to getGroups: ${err}`));
  }

  // TODO: check if members was removed, will this remove UserOnGroup too?
  async updateGroup(group: IGroup): Promise<IGroup> {
    return this.db.group
      .update({
        include: modelGroup.alwaysIncludeOwnerAndUsers(),
        where: {
          id: group.id,
        },
        data: {
          name: group.name,
          // Overwrite with set (with current users)
          users: {
            set: modelUser.usersToUserIds(group.getMembers()),
          },

          // Do not allow these fields to change
          id: undefined,
          ownerId: undefined,
          owner: undefined,
        },
      })
      .then((result) => Promise.resolve(modelGroup.toGroupWithMembers(result)))
      .catch((err) => Promise.reject(`failed to update group: ${err}`));
  }

  async deleteGroup(group: IGroup): Promise<IGroup> {
    return this.db.group
      .delete({
        include: modelGroup.alwaysIncludeOwnerAndUsers(),
        where: {
          id: group.id,
        },
      })
      .then((result) => Promise.resolve(modelGroup.toGroupWithMembers(result)))
      .catch((err) => Promise.reject(`not implemented ${err}`));
  }
}
