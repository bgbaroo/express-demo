import { PrismaClient } from "@prisma/client";

import { DataLinkUser } from "../../src/data/sources/postgres/datalink/user";
import { DataLinkGroup } from "../../src/data/sources/postgres/datalink/group";
import { GroupOwner } from "../../src/domain/entities/group_owner";
import { Group, IGroup } from "../../src/domain/entities/group";
import { User } from "../../src/domain/entities/user";

describe("test DB datalink", () => {
  it("creating group with user relations", async () => {
    const pg = new PrismaClient();
    const userDb = new DataLinkUser(pg);
    const groupDb = new DataLinkGroup(pg);

    const savedResult = await testUserAndGroup(userDb, groupDb);
    await testPrismaImplicitRelations(groupDb, savedResult);
  });
});

interface savedIds {
  group: string;
  members: string[];
  nonMembers?: string[];
}

async function testPrismaImplicitRelations(
  groupDb: DataLinkGroup,
  savedData: savedIds,
) {
  const groupSaved = await groupDb.getGroup(savedData.group);
  expect(groupSaved).toBeTruthy();

  if (!groupSaved) {
    return;
  }

  savedData.members.forEach((member) =>
    expect(groupSaved.isMember(member)).toBe(true),
  );

  expect(savedData.members.length).toBe(groupSaved.getMembers().length);
}

async function testUserAndGroup(
  userDb: DataLinkUser,
  groupDb: DataLinkGroup,
): Promise<savedIds> {
  try {
    // The IDs will be discarded
    const user0 = new User("user0");
    const user1 = new User("user1");
    const user2 = new User("user2");

    // Insert owner
    const user0Saved = await userDb.createUser(user0, "pass0");
    const user0Owner = new GroupOwner(user0Saved.email, user0Saved.id);

    // Insert other users
    const user1Saved = await userDb.createUser(user1, "pass1");
    const user2Saved = await userDb.createUser(user2, "pass2");

    // Create groups, with correct user IDs (from databases)
    const group = new Group({
      name: "groupName",
      owner: user0Owner,
      users: [user1Saved, user2Saved],
    });

    const groupSaved = await groupDb.createGroup(group);
    expect(groupSaved).toBeTruthy();

    const groupResult = await groupDb.getGroup(groupSaved.id);
    expect(groupResult).toBeTruthy();
    if (!groupResult) {
      return Promise.reject("null groupResult");
    }

    const groupQueried: IGroup = groupResult;

    [user0Owner, user1Saved, user2Saved].forEach((member) => {
      expect(groupSaved.isMember(member.id)).toBe(true);
      expect(groupQueried.isMember(member.id)).toBe(true);
    });

    const user3 = new User("user3");
    const user3Saved = await userDb.createUser(user3, "pass3");
    expect(groupQueried.addMember(user0Owner, user3Saved)).toBe(true);

    const groupUpdated = await groupDb.updateGroup(groupQueried);
    console.table(groupUpdated);
    [user0Owner, user1Saved, user2Saved, user3Saved].forEach((member) => {
      expect(groupUpdated.isMember(member.id)).toBe(true);
    });

    return Promise.resolve({
      group: groupUpdated.id,
      members: [user0Owner, user1Saved, user2Saved, user3Saved].map(
        (user): string => {
          return user.id;
        },
      ),
    });
  } catch (err) {
    console.error(err);

    return Promise.reject(err);
  }
}
