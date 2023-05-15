import { PrismaClient } from "@prisma/client";

import { DataLinkUser } from "../../src/data/sources/postgres/datalink/user";
// import { DataLinkGroup } from "../../src/data/sources/postgres/datalink/group";
import { DataLinkClipboard } from "../../src/data/sources/postgres/datalink/clipboard";
import { User } from "../../src/domain/entities/user";
import { Clipboard } from "../../src/domain/entities/clipboard";
// import { GroupOwner } from "../../src/domain/entities/group_owner";
// import { IGroup, Group } from "../../src/domain/entities/group";
// import { IUser, User } from "../../src/domain/entities/user";
// import { IClipboard, Clipboard } from "../../src/domain/entities/clipboard";

describe("clipboards datalink", () => {
  const pg = new PrismaClient();
  const userDb = new DataLinkUser(pg);
  // const groupDb = new DataLinkGroup(pg);
  const clipboardDb = new DataLinkClipboard(pg);

  it("create clipboard", async () => {
    console.log("Creating owner");
    const ownerUser = await userDb.createUser(new User("owner"), "ownerPass");
    console.log("Creating clipboard");
    const clipboard = await clipboardDb.createClipboard(
      new Clipboard({
        content: "foo",
        user: ownerUser,
      }),
    );
    console.log("Getting clipboard");
    const clip = await clipboardDb.getUserClipboard(clipboard.id, ownerUser.id);
    if (!clip) {
      return Promise.reject("no clip found");
    }

    expect(clip.getUser().email).toBe(ownerUser.email);
    return Promise.resolve();

    // console.log("Creating clipboard");
    // const { owner, clipboard } = result;
    // const users = ["user1", "user2"].map((email) => new User(email));

    // console.log("Creating group");
    // const groupResult = await createGroup(groupDb, owner, users);

    // console.log("Getting group clipboards");
    // const groupClipboardsResult = await getGroupClipboards(
    //   clipboardDb,
    //   groupResult.id,
    // );
    // // expect(groupClipboardsResult).resolves;
    // expect(groupClipboardsResult).toBeTruthy();
    // if (!groupClipboardsResult) {
    //   return Promise.reject("null group clipboard");
    // }

    // expect(groupClipboardsResult[0].content).toBe(clipboard.content);
    // expect(groupClipboardsResult[0].getUserId()).toBe(clipboard.getUserId());

    // return Promise.resolve();
  });
});

// async function createClipboard(
//   userDb: DataLinkUser,
//   clipboardDb: DataLinkClipboard,
// ): Promise<{
//   clipboard: IClipboard;
//   owner: GroupOwner;
// }> {
//   try {
//     const owner = await userDb.createUser(new User("owner"), "ownerPass");
//     expect(owner).toBeTruthy();

//     console.log("Creating owner's clipboard");
//     const clipboard = await clipboardDb.createClipboard(
//       new Clipboard({
//         user: owner,
//         title: "ownerClipboard",
//         content: "some content",
//       }),
//     );
//     expect(clipboard).toBeTruthy();

//     const clip = await clipboardDb.getUserClipboard(clipboard.id, owner.id);
//     expect(clip).toBeTruthy();

//     if (!clip) {
//       return Promise.reject("null clip");
//     }

//     return Promise.resolve({
//       clipboard: clip,
//       owner: new GroupOwner(owner.email, owner.id),
//     });
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }

// async function createGroup(
//   groupDb: DataLinkGroup,
//   owner: GroupOwner,
//   users: IUser[],
// ): Promise<IGroup> {
//   return await groupDb.createGroup(
//     new Group({
//       name: "clipboardGroup",
//       owner,
//       users,
//     }),
//   );
// }

// async function getGroupClipboards(
//   clipboardDb: DataLinkClipboard,
//   groupId: string,
// ): Promise<IClipboard[] | null> {
//   console.log("Getting group clipboards");
//   return await clipboardDb.getGroupClipboards(groupId);
// }
