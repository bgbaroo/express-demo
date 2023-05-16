import { DataModelGroup, DbOnly } from "./models";
import userModel, { AppDataModelUserWithGroups, IIncludeGroups } from "./user";

import { IGroup, Group } from "../../../../domain/entities/group";
import { GroupOwner } from "../../../../domain/entities/group-owner";

interface DataModelGroupWithMembers extends DataModelGroup {
  owner: AppDataModelUserWithGroups;
  users: AppDataModelUserWithGroups[];
}

type AppDataModelGroupWithMembers = Omit<DataModelGroupWithMembers, DbOnly>;

interface IIncludeOwnerAndUsers {
  owner: {
    include: IIncludeGroups;
  };
  users: {
    include: IIncludeGroups;
  };
}

function includeOwnerAndUsers(): IIncludeOwnerAndUsers {
  return {
    owner: {
      include: {
        groups: true,
        ownGroups: true,
      },
    },
    users: {
      include: {
        groups: true,
        ownGroups: true,
      },
    },
  };
}

// TODO: Decide recursiveness of group members and owners
function toGroupWithMembers(group: AppDataModelGroupWithMembers): IGroup {
  return new Group({
    id: group.id,
    name: group.name,
    owner: new GroupOwner({
      id: group.owner.id,
      email: group.owner.email,
      // groups: group.owner.groups.map((group) => toGroupWithMembers(group)),
      // ownGroups: group.owner.ownGroups.map((group) =>
      //   toGroupWithMembers(group),
      // ),
    }),
    users: userModel.toUsers(group.users),
  });
}

export { AppDataModelGroupWithMembers };

export default {
  toGroupWithMembers,
  includeOwnerAndUsers,
};
