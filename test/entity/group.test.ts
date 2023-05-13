import { Group } from "../../src/domain/entities/group";
import { IUser } from "../../src/domain/entities/user";

describe("empty if 0 user were given to constructor", () => {
  const group = new Group("gid", "gname", []);
  it("group.isEmpty() != true", () => {
    expect(group.isEmpty()).toBe(true);
  });

  it("group.size() != 0", () => {
    expect(group.size()).toBe(0);
  });
});

describe("no duplicate emails", () => {
  const fooAtBar = "foo@bar.com";
  const id = "1234";
  const users: IUser[] = [
    {
      id: id,
      email: fooAtBar,
      groupId: "someOtherGID",
    },
    {
      id: "2345",
      email: "bar@baz.com",
      groupId: undefined,
    },
    {
      id: "3456",
      email: "baz@foo.com",
      groupId: undefined,
    },
    {
      id: "4567",
      email: fooAtBar,
      groupId: undefined,
    },
  ];

  const group = new Group("gid", "gname", users);
  const firstFooAtBar = group.getMember(fooAtBar);

  it("User undefined", () => {
    expect(firstFooAtBar).toBeDefined();
  });

  const idFromGroup = firstFooAtBar?.id;
  it("User.id undefined", () => {
    expect(idFromGroup).toBeDefined();
  });

  it("User.id unexpected", () => {
    if (idFromGroup) {
      expect(idFromGroup).toBe(id);
    }
  });

  it("User.groupId unexpected", () => {
    expect(firstFooAtBar?.groupId).toBeDefined();
    expect(firstFooAtBar?.groupId).toBe(group.id);
  });
});
