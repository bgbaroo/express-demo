import { DbOnly, DataModelUser, DataModelGroup } from "./models";

import { IUser, User } from "../../../../domain/entities/user";

// Extends DataModelUser with shallow group information.
// DataModelUserWithGroups.groups only contains what's available
// in the table `groups`, and nothing more, to save on costs.
interface DataModelUserWithGroups extends DataModelUser {
  groups: DataModelGroup[];
  ownGroups: DataModelGroup[];
}

type AppDataModelUser = Omit<DataModelUser, DbOnly>;
type AppDataModelUserWithGroups = Omit<DataModelUserWithGroups, DbOnly>;

interface IIncludeGroups {
  groups: boolean;
  ownGroups: boolean;
}

interface ICreateGroupOwner extends AppDataModelUser {
  password: string;
  ownGroups: {
    create: UserCreateGroup[] | undefined;
  };
}

interface UserCreateGroup {
  name: string;
}
interface IUserId {
  id: string;
}

function usersToUserIds(users: IUser[]): IUserId[] {
  return users.map((user): IUserId => {
    return {
      id: user.id,
    };
  });
}

function toUser(data: AppDataModelUserWithGroups): IUser {
  return new User({ ...data, groups: [] });
}

function toUsers(data: AppDataModelUserWithGroups[]): IUser[] {
  return data.map((user) => toUser(user));
}

function mapUserCreateGroups(
  groups: { name: string }[] | undefined,
): UserCreateGroup[] | undefined {
  if (!groups) {
    return undefined;
  }

  return groups.map((groupName) => {
    return { name: groupName.name };
  });
}

function formCreateUserToDataModelUser(
  user: IUser,
  password: string,
): ICreateGroupOwner {
  return {
    id: user.id,
    email: user.email,
    password,
    ownGroups: {
      create: mapUserCreateGroups(user.groupsOwned()),
    },
  };
}

function includeGroupsAndOwnGroups(): IIncludeGroups {
  return {
    groups: true,
    ownGroups: true,
  };
}

export { AppDataModelUserWithGroups, IIncludeGroups };

export default {
  usersToUserIds,
  toUser,
  toUsers,
  formCreateUserToDataModelUser,
  includeGroupsAndOwnGroups,
};
