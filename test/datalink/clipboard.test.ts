import { PrismaClient } from "@prisma/client";
import { DataLinkUser } from "../../src/data/sources/postgres/data-links/user";
import { DataLinkGroup } from "../../src/data/sources/postgres/data-links/group";
import { DataLinkClipboard } from "../../src/data/sources/postgres/data-links/clipboard";

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
      const clip = await clipboardDb.getUserClipboard(
        clipboard.id,
        ownerUser.id,
      );

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

    console.log("Getting group clipboards");
    const groupClipboardsResult = await getGroupClipboards(
      clipboardDb,
      group.id,
    );
    if (!groupClipboardsResult) {
      return Promise.reject("null group clipboard");
    }

    console.log("group clip result");
    console.table(groupClipboardsResult);
    groupClipboardsResult.forEach((result) => {
      expect(result.getUserId()).toBe(owner.id);
    });

    return Promise.resolve();
  });
});

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

async function getGroupClipboards(
  clipboardDb: DataLinkClipboard,
  groupId: string,
): Promise<IClipboard[] | null> {
  console.log("Getting group clipboards");
  return await clipboardDb.getGroupClipboards(groupId);
}
