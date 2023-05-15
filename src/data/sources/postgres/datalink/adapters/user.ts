import { DbOnly, DataModelUser } from "./db-only";

import { IUser, User } from "../../../../../domain/entities/user";

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

function dataModelUserToIUser(data: DataModelUser): IUser {
  return new User(data.email, data.id);
}

function dataModelUsersToIUsers(data: DataModelUser[]): IUser[] {
  return data.map((user) => dataModelUserToIUser(user));
}

// Allows create empty group with name and owner as member,
// but will not create new group members (models UserOnGroup and User)

type IDataModelUser = Omit<DataModelUser, DbOnly>;

interface IDataModelUserWithOwnGroups extends IDataModelUser {
  password: string;
  ownGroups: {
    create: UserCreateGroup[] | undefined;
  };
}

function mapUserCreateGroups(
  groupNames: string[] | undefined,
): UserCreateGroup[] | undefined {
  if (!groupNames) {
    return undefined;
  }

  return groupNames.map((groupName) => {
    return { name: groupName };
  });
}

function formCreateUserToDataModelUser(
  user: IUser,
  password: string,
): IDataModelUserWithOwnGroups {
  return {
    id: user.id,
    email: user.email,
    password,
    ownGroups: {
      create: mapUserCreateGroups(user.groupsOwned()),
    },
  };
}

export { IUserId };

export default {
  usersToUserIds,
  dataModelUserToIUser,
  dataModelUsersToIUsers,
  formCreateUserToDataModelUser,
};
