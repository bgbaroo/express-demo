import { Group as DataModelGroup, User as DataModelUser } from "@prisma/client";
import { DbOnly } from "./db-only";
import userAdapter from "./user";

import { Group } from "../../../../../domain/entities/group";
import { GroupOwner } from "../../../../../domain/entities/group_owner";
import { IGroup } from "../../../../../domain/entities/group";

interface DataModelGroupWithMembers extends DataModelGroup {
  owner: DataModelUser;
  users: DataModelUser[];
}

type AppDataModelGroupWithMembers = Omit<DataModelGroupWithMembers, DbOnly>;

interface IncludeOwnerAndUsers {
  users: boolean;
  owner: boolean;
}

function alwaysIncludeOwnerAndUsers(): IncludeOwnerAndUsers {
  return { owner: true, users: true };
}

function dataModelGroupWithMembersToGroup(
  group: AppDataModelGroupWithMembers,
): IGroup {
  return new Group({
    id: group.id,
    name: group.name,
    owner: new GroupOwner(group.owner.email, group.owner.id),
    users: userAdapter.dataModelUsersToIUsers(group.users),
  });
}

export default {
  dataModelGroupWithMembersToGroup,
  alwaysIncludeOwnerAndUsers,
};
