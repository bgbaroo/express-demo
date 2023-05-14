import { BasePrismaSchemaDataLink, DbDriver } from "./prisma-postgres";
import { connectUsersToGroupMembers } from "./adapters/group-members";
import groupAdapter from "./adapters/group";

import { IGroup } from "../../../../domain/entities/group";

class IncludeOwnerAndUsers {
  users: {
    include: {
      user: boolean;
    };
  };
  owner: boolean;

  constructor(arg: { includeOwner: boolean; includeUsers: boolean }) {
    return {
      owner: arg.includeOwner,
      users: {
        include: {
          user: arg.includeUsers,
        },
      },
    };
  }
}

function alwaysIncludeOwnerAndUsers(): IncludeOwnerAndUsers {
  return new IncludeOwnerAndUsers({ includeOwner: true, includeUsers: true });
}

export class DataLinkGroup extends BasePrismaSchemaDataLink {
  constructor(db: DbDriver) {
    super(db);
  }

  async createGroup(group: IGroup): Promise<IGroup> {
    return this.db.group
      .create({
        include: alwaysIncludeOwnerAndUsers(),
        data: {
          id: group.id,
          name: group.name,
          users: {
            create: connectUsersToGroupMembers(group.getMembers()),
          },
          owner: {
            connect: {
              id: group.getOwnerId(),
            },
          },
        },
      })
      .then((result) => {
        return Promise.resolve(
          groupAdapter.dataModelGroupWithMembersToGroup(result),
        );
      })
      .catch((err) => Promise.reject(`failed to create group: ${err}`));
  }

  async getGroup(id: string): Promise<IGroup | null> {
    return this.db.group
      .findUnique({
        where: { id },
        include: alwaysIncludeOwnerAndUsers(),
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(null);
        }

        return Promise.resolve(
          groupAdapter.dataModelGroupWithMembersToGroup(result),
        );
      })
      .catch((err) => Promise.reject(`failed to get group: ${err}`));
  }

  async getGroups(): Promise<IGroup[]> {
    return this.db.group
      .findMany({
        include: alwaysIncludeOwnerAndUsers(),
      })
      .then((groups) =>
        groups.map((group) => {
          return groupAdapter.dataModelGroupWithMembersToGroup(group);
        }),
      )
      .catch((err) => Promise.reject(`failed to getGroups: ${err}`));
  }

  // TODO: check if members was removed, will this remove UserOnGroup too?
  async updateGroup(group: IGroup): Promise<IGroup> {
    return this.db.group
      .update({
        where: {
          id: group.id,
        },
        include: alwaysIncludeOwnerAndUsers(),
        data: {
          // Do not allow these fields to change
          id: undefined,
          ownerId: undefined,
          owner: undefined,

          name: group.name,
          // Re-create relations: will fail
          users: {
            create: connectUsersToGroupMembers(group.getMembers()),
          },
        },
      })
      .then((result) =>
        Promise.resolve(groupAdapter.dataModelGroupWithMembersToGroup(result)),
      )
      .catch((err) => Promise.reject(`failed to update group: ${err}`));
  }

  async deleteGroup(group: IGroup): Promise<IGroup> {
    return this.db.group
      .delete({
        where: {
          id: group.id,
        },
        include: alwaysIncludeOwnerAndUsers(),
      })
      .then((result) =>
        Promise.resolve(groupAdapter.dataModelGroupWithMembersToGroup(result)),
      )
      .catch((err) => Promise.reject(`not implemented ${err}`));
  }
}
