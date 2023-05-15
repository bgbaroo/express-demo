import { PrismaClient } from "@prisma/client";

import { DataLinkUser } from "../../src/data/sources/postgres/datalink/user";
import { DataLinkGroup } from "../../src/data/sources/postgres/datalink/group";
import { GroupOwner } from "../../src/domain/entities/group-owner";
import { Group } from "../../src/domain/entities/group";
import { User } from "../../src/domain/entities/user";

interface Arg {
  gName: string; // group name
  gOwner: string; // group owner email
  gMembers: string[]; // group members
  gNewMembers: string[]; // group members to be inserted later
  gNonMembers: string[]; // non-members
  gExMembers: string[]; // group members that will be removed
}

describe("users and groups datalink", () => {
  it("group with user relations", async () => {
    const pg = new PrismaClient();
    const userDb = new DataLinkUser(pg);
    const groupDb = new DataLinkGroup(pg);

    const arg = {
      gName: "groupName",
      gOwner: "groupOwner",
      gMembers: ["member1", "member2", "member3", "member4"],
      gNewMembers: ["newMember1", "newMember2"],
      gNonMembers: ["user1", "user2"],
      gExMembers: ["member2", "member4", "newMember1"],
    };

    expect(await testUserAndGroupWrites(userDb, groupDb, arg)).resolves;
  });
});

async function testUserAndGroupWrites(
  userDb: DataLinkUser,
  groupDb: DataLinkGroup,
  arg: Arg,
): Promise<void> {
  try {
    // Insert group owner
    const ownerUser = await userDb.createUser(
      new GroupOwner(arg.gOwner),
      "passOwner",
    );
    const owner = new GroupOwner(ownerUser.email, ownerUser.id);

    // Insert all other users
    const users = await Promise.all(
      Array.from(
        new Set([
          ...arg.gMembers,
          ...arg.gNewMembers,
          ...arg.gNonMembers,
          ...arg.gExMembers,
        ]),
      ).map((user, i) => userDb.createUser(new User(user), `pass_${i}`)),
    );
    const groupMembers = users.filter((user) =>
      arg.gMembers.includes(user.email),
    );
    const newMembers = users.filter((user) =>
      arg.gNewMembers.includes(user.email),
    );
    const exMembers = users.filter((user) =>
      arg.gExMembers.includes(user.email),
    );

    // Create a Group with just gMembers, and insert it to DB
    console.log("Testing inserting with members", groupMembers);
    const group = await groupDb.createGroup(
      new Group({
        owner,
        name: arg.gName,
        users: groupMembers,
      }),
    );

    console.table({
      debug: "group members",
      members: group.getMembers().map((member) => member.email),
    });

    // Test getMembers and isMembers
    group.getMembers().forEach((member) => {
      expect(group.isMember(member.id)).toBe(true);

      if (member.email == arg.gOwner) {
        return;
      }
      expect(arg.gMembers.includes(member.email)).toBe(true);
    });

    // Add new members arg.NewMembers
    console.log("Testing updating with newMembers", newMembers);
    group.addMembers(owner, newMembers);

    // Save it back to DB
    const groupNewMembers = await groupDb.updateGroup(group);
    groupNewMembers
      .getMembers()
      .filter((newMember) => !arg.gMembers.includes(newMember.email))
      .forEach((newMember) => {
        expect(groupNewMembers.isMember(newMember.id)).toBe(true);
        if (newMember.email == arg.gOwner) {
          return;
        }

        console.log(`checking new user ${newMember.email}`);
        expect(arg.gNewMembers.includes(newMember.email)).toBe(true);
        expect(arg.gNonMembers.includes(newMember.email)).toBe(false);
      });

    console.table({
      debug: "groupNewMembers members",
      members: groupNewMembers.getMembers().map((member) => member.email),
    });

    // Make sure that ex-members were once in our group before deleting them
    console.log("Removing exMembers", exMembers);
    groupNewMembers.delMembers(
      owner,
      exMembers.map((ex) => ex.id),
    );

    // Save back group without ex-members
    console.log("Testing updating without exMembers");
    const groupNoExes = await groupDb.updateGroup(groupNewMembers);
    console.table({
      debug: "groupNoExes members",
      members: groupNoExes.getMembers().map((member) => member.email),
    });

    // Test that ex-members are not members
    groupNoExes.getMembers().forEach((member) => {
      if (member.email == arg.gOwner) {
        return;
      }

      expect(arg.gExMembers.includes(member.email)).toBe(false);
      expect(arg.gNonMembers.includes(member.email)).toBe(false);
    });
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}
