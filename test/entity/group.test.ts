import { Group } from "../../src/domain/entities/group";
import { IGroupOwner, GroupOwner } from "../../src/domain/entities/group-owner";
import { IUser, User } from "../../src/domain/entities/user";

function mockOwner(email?: string, id?: string): IGroupOwner {
  return new GroupOwner({ email: email || "ownerEmail", id: id || "ownerId" });
}

function ownerForgot(owner: IGroupOwner, gids: string[]): string | undefined {
  for (let i = 0; i < gids.length; i++) {
    const gid = gids[i];
    if (!owner.ownsGroup(gid)) {
      return gid;
    }
  }

  return undefined;
}

function testGroupOwner(owner: IGroupOwner, _gids: Set<string>) {
  const gids = Array.from(_gids);

  describe(`owner creates new ${gids.length} groups`, () => {
    for (let i = 0; i < gids.length; i++) {
      const gid = gids[i];
      const group = new Group({ id: gid, name: `group_${gid}`, owner });

      it("empty group.size() != 1", () => {
        // Owner is also a member,
        // and Groups will always have 1 owner
        expect(group.size()).toEqual(1);
      });

      it("group has invalid owner", () => {
        expect(group.getOwnerId()).toEqual(owner.id);
      });

      it("owner forgot some groups", () => {
        expect(ownerForgot(owner, gids)).toBeUndefined();
      });

      const len = owner.groupsOwned().length;
      it("owner groups length mismatch", () => {
        expect(len).toEqual(i + 1);
      });
    }
  });
}

describe("Creating owner and groups", () => {
  testGroupOwner(mockOwner(), new Set(["A", "B", "C", "D", "A"]));
});

describe("no duplicate emails", () => {
  const fooAtBar = "foo@bar.com";
  const id = "1234";
  const myUser: IUser = new User({ email: fooAtBar, id });

  const users: IUser[] = [
    {
      ...myUser,
    },
    new User({ email: "bar@baz.com" }),
    new User({ email: "baz@foo.com" }),
    new User({ email: fooAtBar, id }), // Group should not add this user, as ID is a duplicate
  ];

  const owner = mockOwner();
  const group = new Group({ id: "gid", name: "gname", owner, users });
  const target = group.getMember(id);

  it("unexpected Group.ownerId()", () => {
    expect(group.getOwnerId()).toEqual(owner.id);
  });

  it("unexpected Group.size()", () => {
    expect(group.size()).toEqual(4); // Plus the owner
  });

  it("User undefined", () => {
    expect(target).toBeDefined();
  });

  it("User.id undefined", () => {
    expect(target?.id).toBeDefined();
  });

  it("User.id unexpected", () => {
    expect(target?.id).toEqual(id);
  });

  it("User.email undefined", () => {
    expect(target?.email).toBeDefined();
  });

  it("User.email unexpected", () => {
    expect(target?.email).toEqual(myUser.email);
  });

  it("duplicate User.id was added", () => {
    expect(group.addMember(owner, new User({ email: fooAtBar, id }))).toEqual(
      false,
    );
  });

  it("new User was not added", () => {
    expect(
      group.addMember(owner, new User({ email: "new email", id: "new id" })),
    ).toEqual(true);
  });
});
