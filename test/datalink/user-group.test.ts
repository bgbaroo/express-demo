import { PrismaClient } from "@prisma/client";

import { DataLinkUser } from "../../src/data/sources/postgres/datalink/user";
import { DataLinkGroup } from "../../src/data/sources/postgres/datalink/group";
import { GroupOwner } from "../../src/domain/entities/group_owner";
import { Group, IGroup } from "../../src/domain/entities/group";
import { User } from "../../src/domain/entities/user";

describe("test DB datalink", () => {
  it("creating group with user relations", async () => {
    await testUserAndGroup();
  });
});

async function testUserAndGroup() {
  try {
    const pg = new PrismaClient();
    const userDb = new DataLinkUser(pg);
    const groupDb = new DataLinkGroup(pg);

    // The IDs will be discarded
    const user0 = new User("user0Id", "user0");
    const user1 = new User("user1_id", "user1");
    const user2 = new User("user2_id", "user2");

    // Insert owner
    const user0Saved = await userDb.createUser(user0, "pass0");
    const user0Owner = new GroupOwner(user0Saved.id, user0Saved.email);

    // Insert other users
    const user1Saved = await userDb.createUser(user1, "pass1");
    const user2Saved = await userDb.createUser(user2, "pass2");

    // Create groups, with correct user IDs (from databases)
    const group = new Group("groupId", "groupName", user0Owner, [
      user1Saved,
      user2Saved,
    ]);

    const groupSaved = await groupDb.createGroup(group);
    expect(groupSaved).toBeTruthy();

    const groupResult = await groupDb.getGroup(groupSaved.id);

    expect(groupResult).toBeTruthy();

    if (!groupResult) {
      return;
    }

    const groupQueried: IGroup = groupResult;

    [user0Owner, user1Saved, user2Saved].forEach((member) => {
      expect(groupSaved.isMember(member.id)).toBe(true);
      expect(groupQueried.isMember(member.id)).toBe(true);
    });
  } catch (err) {
    console.error(err);
  }
}
