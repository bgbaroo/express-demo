import { Group as DataModelGroup, User as DataModelUser } from "@prisma/client";
import userAdapter from "./user";

import { Group } from "../../../../../domain/entities/group";
import { GroupOwner } from "../../../../../domain/entities/group_owner";
import { IGroup } from "../../../../../domain/entities/group";
import { IUser } from "../../../../../domain/entities/user";

interface DataModelGroupWithMembers extends DataModelGroup {
  owner: DataModelUser;
  users: DataModelUser[];
}

interface IDataModelGroup {
  name: string;
  ownerId: string;
}

interface IncludeOwnerAndUsers {
  users: boolean;
  owner: boolean;
}

// Supplied to PrismaClient().group.create when the new group already
// has existing users as members
interface GroupMembers {
  connect?: { id: string }[];
}

function alwaysIncludeOwnerAndUsers(): IncludeOwnerAndUsers {
  return { owner: true, users: true };
}

function groupToDataModelGroup(group: IGroup): IDataModelGroup {
  return {
    ...group,
    ownerId: group.getOwnerId(),
  };
}

function dataModelGroupWithMembersToGroup(
  group: DataModelGroupWithMembers,
): IGroup {
  return new Group({
    id: group.id,
    name: group.name,
    owner: new GroupOwner(group.owner.email, group.owner.id),
    users: userAdapter.dataModelUsersToIUsers(group.users),
  });
}

function connectUsersToGroupMembers(members: IUser[]): GroupMembers {
  return {
    connect: members.map((member): { id: string } => {
      return { id: member.id };
    }),
  };
}

export default {
  groupToDataModelGroup,
  dataModelGroupWithMembersToGroup,
  alwaysIncludeOwnerAndUsers,
  connectUsersToGroupMembers,
};
