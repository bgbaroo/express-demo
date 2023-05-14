import { Group } from "../../src/domain/entities/group";
import { IGroupOwner, GroupOwner } from "../../src/domain/entities/group_owner";
import { IUser, User } from "../../src/domain/entities/user";

function mockOwner(id?: string, email?: string): IGroupOwner {
  return new GroupOwner(id || "ownerId", email || "ownerEmail");
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
      const group = new Group(gid, `$group_${gid}`, owner);

      it("empty group.size() != 1", () => {
        // Owner is also a member,
        // and Groups will always have 1 owner
        expect(group.size()).toBe(1);
      });

      it("group has invalid owner", () => {
        expect(group.getOwnerId()).toBe(owner.id);
      });

      it("owner forgot some groups", () => {
        expect(ownerForgot(owner, gids)).toBeUndefined();
      });

      const len = owner.groupsOwned().length;
      it("owner groups length mismatch", () => {
        expect(len).toBe(i + 1);
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
  const myUser: IUser = new User(id, fooAtBar);

  const users: IUser[] = [
    {
      ...myUser,
    },
    new User("2345", "bar@baz.com"),
    new User("3456", "baz@foo.com"),
    new User(id, fooAtBar),
  ];

  const owner = mockOwner();
  const group = new Group("gid", "gname", owner, users);
  const target = group.getMember(id);

  it("unexpected Group.ownerId()", () => {
    expect(group.getOwnerId()).toBe(owner.id);
  });

  it("unexpected Group.size()", () => {
    expect(group.size()).toBe(4); // Plus the owner
  });

  it("User undefined", () => {
    expect(target).toBeDefined();
  });

  it("User.id undefined", () => {
    expect(target?.id).toBeDefined();
  });

  it("User.id unexpected", () => {
    expect(target?.id).toBe(id);
  });

  it("User.email undefined", () => {
    expect(target?.email).toBeDefined();
  });

  it("User.email unexpected", () => {
    expect(target?.email).toBe(myUser.email);
  });
});
