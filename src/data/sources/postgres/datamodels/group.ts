import { DataModelUser, DataModelGroup, DbOnly } from "./datamodel";
import userModel from "./user";

import { IGroup, Group } from "../../../../domain/entities/group";
import { GroupOwner } from "../../../../domain/entities/group-owner";

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

function toGroupWithMembers(group: AppDataModelGroupWithMembers): IGroup {
  return new Group({
    id: group.id,
    name: group.name,
    owner: new GroupOwner(group.owner.email, group.owner.id),
    users: userModel.toUsers(group.users),
  });
}

export default {
  toGroupWithMembers,
  alwaysIncludeOwnerAndUsers,
};
