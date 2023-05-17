import readline from "readline";
import { PrismaClient } from "@prisma/client";
import { DataLinkUser } from "../../src/data/sources/postgres/data-links/user";
import { DataLinkGroup } from "../../src/data/sources/postgres/data-links/group";
import { DataLinkClipboard } from "../../src/data/sources/postgres/data-links/clipboard";

import { RepositoryClipboard } from "../../src/domain/repositories/clipboard";
import { GroupOwner } from "../../src/domain/entities/group-owner";
import { IGroup, Group } from "../../src/domain/entities/group";
import { IUser, User } from "../../src/domain/entities/user";
import { IClipboard, Clipboard } from "../../src/domain/entities/clipboard";

describe("clipboards datalink", () => {
  const pg = new PrismaClient();
  const userDb = new DataLinkUser(pg);
  const groupDb = new DataLinkGroup(pg);
  const clipboardDb = new DataLinkClipboard(pg);

  it("create clipboard", async () => {
    try {
      await clearDbPrompt(pg);

      console.log("Creating owner");
      const ownerUser = await userDb.createUser(
        new User({
          email: "owner",
        }),
        "ownerPass",
      );

      console.log("Creating clipboards");
      const clipboards = await createClipboards(clipboardDb, [
        new Clipboard({
          content: "foo",
          user: ownerUser,
        }),
        new Clipboard({
          content: "bar",
          user: ownerUser,
        }),
      ]);

      console.log("Getting clipboard");
      clipboards.forEach(async (clipboard) => {
        const clip = await clipboardDb.getClipboard({
          id: clipboard.id,
          userId: ownerUser.id,
        });

        if (!clip) {
          return Promise.reject("null clipboard");
        }
        expect(clip.id).toBe(clipboard.id);
        expect(clip.content).toBe(clipboard.content);
      });

      console.log("clipboards");
      console.table(clipboards);

      console.log("Creating users");
      const users = ["user1", "user2"].map((email) => new User({ email }));
      await Promise.all(
        users.map((user, i) => userDb.createUser(user, `pass_${i}`)),
      );

      console.log("Creating group");
      const owner = new GroupOwner({
        ...ownerUser,
        groups: ownerUser.groups(),
      });

      const group = await createGroup(groupDb, owner, users);
      const repo = new RepositoryClipboard(clipboardDb);

      console.log("Getting group clipboards");
      const groupClipboardsResult = await repo.getGroupClipboards(group.id);
      if (!groupClipboardsResult) {
        return Promise.reject("null group clipboards");
      }

      console.log("Group clipboads result");
      console.table(groupClipboardsResult);

      expect(groupClipboardsResult.length).toBe(clipboards.length);
      groupClipboardsResult.forEach((result) => {
        expect(result.getUserId()).toBe(owner.id);
      });

      console.log("Creating other users' clipboards");
      const otherPeoplesClips = await createClipboards(clipboardDb, [
        new Clipboard({
          user: users[0],
          title: "user1 note",
          content: "user1 clipboard",
        }),
        new Clipboard({
          user: users[1],
          title: "user2 note",
          content: "user2 clipboard",
        }),
      ]);

      console.log("Getting groups clipboards");

      const groupsClipboardsResult = await repo.getGroupsClipboards(
        users[0].id,
      );
      if (!groupsClipboardsResult) {
        return Promise.reject("null groups clipboards");
      }

      console.log("Groups clipboards result");
      console.table(groupsClipboardsResult);
      expect(groupsClipboardsResult.length).toBe(
        clipboards.length + otherPeoplesClips.length,
      );

      console.log("clearing db post-tests");
      await clearDb(pg);

      return Promise.resolve();
    } catch (err) {
      console.error(`Got error: ${err}`);

      await clearDb(pg);
      return Promise.reject(err);
    }
  });
});

async function clearDbPrompt(pg: PrismaClient): Promise<void> {
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
  clipboardDb: DataLinkClipboard,
  clipboards: IClipboard[],
): Promise<IClipboard[]> {
  return await Promise.all(
    clipboards.map((clip) => clipboardDb.createClipboard(clip)),
  );
}

async function createGroup(
  groupDb: DataLinkGroup,
  owner: GroupOwner,
  users: IUser[],
): Promise<IGroup> {
  return await groupDb.createGroup(
    new Group({
      name: "clipboardGroup",
      owner,
      users,
    }),
  );
}

async function clearDb(pg: PrismaClient): Promise<void> {
  console.log("clearing all entries in database");
  await pg.clipboard.deleteMany();
  await pg.group.deleteMany();
  await pg.user.deleteMany();
}
