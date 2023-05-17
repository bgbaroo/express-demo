import readline from "readline";
import postgres from "../../src/data/sources/postgres";

import { DataLinkUser } from "../../src/data/sources/postgres/data-links/user";
import { DataLinkGroup } from "../../src/data/sources/postgres/data-links/group";
import { DataLinkClipboard } from "../../src/data/sources/postgres/data-links/clipboard";
import { DbDriver } from "../../src/data/sources/postgres";

import { RepositoryUser } from "../../src/domain/repositories/user";
import { RepositoryGroup } from "../../src/domain/repositories/group";
import { RepositoryClipboard } from "../../src/domain/repositories/clipboard";

import { GroupOwner } from "../../src/domain/entities/group-owner";
import { Group } from "../../src/domain/entities/group";
import { User } from "../../src/domain/entities/user";
import { IClipboard, Clipboard } from "../../src/domain/entities/clipboard";

interface Arg {
  owner: string;
  members: string[];
  nonMembers: string[];
  dbDriver: DbDriver;
  dataLinkUser: DataLinkUser;
  dataLinkGroup: DataLinkGroup;
  dataLinkClipboard: DataLinkClipboard;
}

describe("groups and clipboards", () => {
  const arg: Arg = {
    owner: "ownerUser",
    members: ["member1", "member2", "member3"],
    nonMembers: ["user1", "user2", "user3"],
    dbDriver: postgres,
    dataLinkUser: new DataLinkUser(postgres),
    dataLinkGroup: new DataLinkGroup(postgres),
    dataLinkClipboard: new DataLinkClipboard(postgres),
  };

  it("membership visibility", async () => {
    try {
      await clearDbPrompt(arg.dbDriver);
      await testGroupClipboards(arg);
      await clearDb(arg.dbDriver);
    } catch (err) {
      // Clear databases after error
      console.error(`Got error: ${err}`);
      await clearDb(arg.dbDriver);

      console.log(`Cleared DB`);
    }
  });
});

async function testGroupClipboards(arg: Arg): Promise<void> {
  const repoUser = new RepositoryUser(arg.dataLinkUser);
  const repoGroup = new RepositoryGroup(arg.dataLinkGroup);
  const repoClipboard = new RepositoryClipboard(arg.dataLinkClipboard);

  console.log("Creating group owner user");
  const ownerUser = await repoUser.createUser(
    new User({ email: arg.owner }),
    "ownerPass",
  );

  console.log("Creating group members");
  const members = await Promise.all(
    arg.members.map((email, i) =>
      repoUser.createUser(new User({ email }), `passMem${i + 1}`),
    ),
  );

  console.log("Creating non-members");
  const nonMembers = await Promise.all(
    arg.nonMembers.map((email, i) =>
      repoUser.createUser(new User({ email }), `passMem${i + 1}`),
    ),
  );

  console.log("Creating group");
  const group = await repoGroup.createGroup(
    new Group({
      name: "groupName",
      owner: new GroupOwner({ id: ownerUser.id, email: ownerUser.email }),
      users: members,
    }),
  );

  console.log("Creating owner clipboard");
  const ownerClips = await createClipboards(repoClipboard, [
    new Clipboard({ content: "ownerClip1", user: ownerUser }),
    new Clipboard({ content: "ownerClip2", user: ownerUser }),
  ]);

  members.forEach(async (member) => {
    const ownerGroupClips = await repoClipboard.getGroupsClipboards(member.id);
    if (!ownerGroupClips) {
      return Promise.reject("null groupClips");
    }

    expect(ownerGroupClips.length).toBe(ownerClips.length);
    ownerGroupClips.forEach((clip) =>
      expect(clip.getUserId()).toBe(ownerUser.id),
    );
  });

  console.log("Creating non-members' clipboards");
  const nonMemberClips = await Promise.all(
    nonMembers.map(async (nonMem, i) => {
      return repoClipboard.createClipboard(
        new Clipboard({
          title: `nonMember${i + 1} note`,
          content: `nonMember${i + 1} note`,
          user: nonMem,
        }),
      );
    }),
  );

  const groupClipboards = await repoClipboard.getGroupClipboards(group.id);
  if (!groupClipboards) {
    return Promise.reject("null groupClipboards");
  }
  if (groupClipboards.length === 0) {
    return Promise.reject("0 group clipboards");
  }
  groupClipboards.forEach((groupClip) => {
    nonMemberClips.forEach((nonGroupClip) =>
      expect(groupClip.id === nonGroupClip.id).toBe(false),
    );
  });

  // Members should not see non-members' clips
  members.forEach(async (member) => {
    const memberShouldSee = await repoClipboard.getGroupsClipboards(member.id);
    if (!memberShouldSee) {
      return Promise.reject("null groupClips");
    }

    expect(memberShouldSee.length).toBe(ownerClips.length);
    memberShouldSee.forEach((clip) => {
      nonMemberClips.forEach((nonMemClip) =>
        expect(clip.id === nonMemClip.id).toBe(false),
      );
    });
  });

  return Promise.resolve();
}

async function clearDbPrompt(pg: DbDriver): Promise<void> {
  return userPrompt(
    "Clear table 'clipboards', 'groups', and 'users' before tests? [y/Y]",
  )
    .then((answer) => {
      if (answer.toUpperCase().includes("y")) {
        Promise.resolve();
      }

      Promise.reject();
    })
    .then(async () => {
      console.log("Clearing db pre-tests");

      await clearDb(pg);
    })
    .catch((err) => {
      if (err) {
        console.error(`Got error: ${err}`);
      }

      console.log("Not clearing db before tests");
    })
    .finally(() => {
      console.log("Starting tests");

      return Promise.resolve();
    });
}

async function userPrompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const readLine = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readLine.question(question, (userInput: string) => {
      readLine.close();
      resolve(userInput);
    });
  });
}

async function createClipboards(
  repo: RepositoryClipboard,
  clipboards: IClipboard[],
): Promise<IClipboard[]> {
  return await Promise.all(
    clipboards.map((clip) => repo.createClipboard(clip)),
  );
}

async function clearDb(pg: DbDriver): Promise<void> {
  console.log("clearing all entries in database");
  await pg.clipboard.deleteMany();
  await pg.group.deleteMany();
  await pg.user.deleteMany();
}
