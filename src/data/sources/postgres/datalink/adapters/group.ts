import { Group as DataModelGroup, User as DataModelUser } from "@prisma/client";
import {
  DataModelGroupMember,
  IDataModelGroupMember,
  dataModelGroupMembers,
  dataModelGroupMembersToUsers,
} from "./group-members";

import { Group } from "../../../../../domain/entities/group";
import { GroupOwner } from "../../../../../domain/entities/group_owner";
import { IGroup } from "../../../../../domain/entities/group";

interface DataModelGroupWithMembers extends DataModelGroup {
  users: DataModelGroupMember[];
  owner: DataModelUser;
}

interface IDataModelGroup {
  name: string;
  ownerId: string;
}

interface IDataModelGroupWithMembers extends IDataModelGroup {
  users: IDataModelGroupMember[];
}

function groupToDataModelGroup(group: IGroup): IDataModelGroup {
  return {
    ...group,
    ownerId: group.getOwnerId(),
  };
}

function groupToDataModelGroupWithMembers(
  group: IGroup,
): IDataModelGroupWithMembers {
  return {
    ...group,
    ownerId: group.getOwnerId(),
    users: dataModelGroupMembers(group),
  };
}

function dataModelGroupWithMembersToGroup(
  group: DataModelGroupWithMembers,
): IGroup {
  return new Group({
    id: group.id,
    name: group.name,
    owner: new GroupOwner(group.owner.email, group.owner.id),
    users: dataModelGroupMembersToUsers(group.users),
  });
}

export default {
  groupToDataModelGroup,
  groupToDataModelGroupWithMembers,
  dataModelGroupWithMembersToGroup,
};
