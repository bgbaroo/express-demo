import {
  ArgCreateGroup,
  IUseCaseCreateGroup,
} from "../interfaces/usecases/group";
import { IRepositoryGroup } from "../interfaces/repositories/group";
import { IRepositoryUser } from "../interfaces/repositories/user";

import { IGroup, Group } from "../entities/group";
import { IUser } from "../entities/user";
import { GroupOwner } from "../entities/group-owner";

async function getUsersByEmail(
  repoUser: IRepositoryUser,
  emails: string[] | undefined,
): Promise<IUser[] | undefined> {
  if (!emails) {
    return undefined;
  }

  // Match return signature with use case types
  const members: IUser[] | undefined = [];
  const _members = await Promise.all(
    emails.map(async (email): Promise<IUser | null> => {
      return repoUser.getUser({ email });
    }),
  ).catch((err) => {
    console.error(`error getting user by email: ${err}`);

    return undefined;
  });

  if (_members) {
    _members.forEach((member) => {
      if (member) members.push(member);
    });
  }

  return members;
}

export class UseCaseCreateGroup implements IUseCaseCreateGroup {
  private readonly repoGroup: IRepositoryGroup;
  private readonly repoUser: IRepositoryUser;

  constructor(arg: { repoGroup: IRepositoryGroup; repoUser: IRepositoryUser }) {
    this.repoGroup = arg.repoGroup;
    this.repoUser = arg.repoUser;
  }

  async execute(arg: ArgCreateGroup): Promise<IGroup> {
    return await this.repoGroup.createGroup(
      new Group({
        name: arg.name,
        owner: new GroupOwner({ id: arg.ownerId, email: arg.ownerEmail }),
        users: await getUsersByEmail(this.repoUser, arg.memberEmails),
      }),
    );
  }
}
