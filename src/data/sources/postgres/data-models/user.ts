import { DbOnly, DataModelUser, DataModelGroup } from "./models";

import { IUser, IUserArg, User } from "../../../../domain/entities/user";

// Extends DataModelUser with shallow group information.
// DataModelUserWithGroups.groups only contains what's available
// in the table `groups`, and nothing more, to save on costs.
interface DataModelUserWithGroups extends DataModelUser {
  groups: DataModelGroup[];
  ownGroups: DataModelGroup[];
}

type AppDataModelUser = Omit<DataModelUser, DbOnly>;
type AppDataModelUserWithGroups = Omit<DataModelUserWithGroups, DbOnly>;

// Includes ownly top-level information of DataModelGroup
interface IIncludeGroups {
  groups: boolean;
  ownGroups: boolean;
}

// Fields of a group required for the user to create it
interface UserCreateGroup {
  name: string;
}

interface ICreateGroupOwner extends AppDataModelUser {
  password: string;
  ownGroups: {
    create: UserCreateGroup[] | undefined;
  };
}

interface IUserId {
  id: string;
}

interface IUserData extends IUser {
  password: string;
}

class UserData extends User implements IUserData {
  password: string;
  constructor(arg: IUserArg & { password: string }) {
    super(arg);
    this.password = arg.password;
  }
}

function usersToUserIds(users: IUser[]): IUserId[] {
  return users.map((user): IUserId => {
    return {
      id: user.id,
    };
  });
}

function toUser(data: AppDataModelUserWithGroups): IUserData {
  return new UserData({ ...data, groups: [] });
}

function toUsers(data: AppDataModelUserWithGroups[]): IUserData[] {
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

export { AppDataModelUserWithGroups, IIncludeGroups, IUserData };

export default {
  usersToUserIds,
  toUser,
  toUsers,
  formCreateUserToDataModelUser,
  includeGroupsAndOwnGroups,
};
