import { BasePrismaSchemaDataLink, DbDriver } from "./link";
import modelGroup from "../data-models/group";
import modelUser from "../data-models/user";

import { IGroup } from "../../../../domain/entities/group";
import { IWhereGroup } from "../../../../domain/interfaces/repositories/group";

export class DataLinkGroup extends BasePrismaSchemaDataLink {
  constructor(db: DbDriver) {
    super(db);
  }

  async createGroup(group: IGroup): Promise<IGroup> {
    return this.db.group
      .create({
        include: modelGroup.includeOwnerAndUsers(),
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

  async getGroup(where: IWhereGroup): Promise<IGroup | null> {
    return this.db.group
      .findUnique({
        include: modelGroup.includeOwnerAndUsers(),
        where: where,
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(null);
        }

        return Promise.resolve(modelGroup.toGroupWithMembers(result));
      })
      .catch((err) => Promise.reject(`failed to get group: ${err}`));
  }

  async getGroups(where: IWhereGroup): Promise<IGroup[]> {
    return this.db.group
      .findMany({
        include: modelGroup.includeOwnerAndUsers(),
        where: where,
      })
      .then((groups) =>
        groups.map((group) => {
          return modelGroup.toGroupWithMembers(group);
        }),
      )
      .catch((err) => Promise.reject(`failed to getGroups: ${err}`));
  }

  async updateGroup(group: IGroup): Promise<IGroup> {
    return this.db.group
      .update({
        include: modelGroup.includeOwnerAndUsers(),
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

  async deleteGroup(where: IWhereGroup): Promise<IGroup> {
    return this.db.group
      .delete({
        include: modelGroup.includeOwnerAndUsers(),
        where,
      })
      .then((result) => Promise.resolve(modelGroup.toGroupWithMembers(result)))
      .catch((err) => Promise.reject(`not implemented ${err}`));
  }

  async deleteGroups(where: IWhereGroup): Promise<number> {
    return this.db.group
      .deleteMany({
        where,
      })
      .then(({ count }) => Promise.resolve(count))
      .catch((err) => Promise.reject(`not implemented ${err}`));
  }
}
