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

// Only includes:
// (1) Group owner's groups and his owned groups as shallow DataModelGroup (no membership data)
// (2) Group users' groups and their owned groups as shallow DataModelGroup (no membership data)
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

// Converts data from database into IGroup
function toGroupWithMembers(data: AppDataModelGroupWithMembers): IGroup {
  const owner = new GroupOwner({
    id: data.owner.id,
    email: data.owner.email,
  });

  data.owner.groups
    // Avoid adding this group again (new Group constructor also adds group)
    .filter((group) => group.id != data.id)
    .forEach((groupData) => {
      owner.ownNewGroup(new Group({ ...groupData, owner }));
    });

  return new Group({
    id: data.id,
    name: data.name,
    owner: owner,
    users: userModel.toUsers(data.users),
  });
}

export { AppDataModelGroupWithMembers };

export default {
  toGroupWithMembers,
  includeOwnerAndUsers,
};
