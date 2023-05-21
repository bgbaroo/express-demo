import request from "supertest";

import { AppDev } from "../../src/api/app";
import initApp from "../../src/init-app";
import postgres from "../../src/data/sources/postgres";
import { clearDb } from "../util";

// TODO: mock DB
const server = initApp<AppDev>(AppDev, { db: postgres }).server();
const apiPath = "/groups";
const apiRegister = "/users/register";
const apiLogin = "/users/login";

const credentialFoo = { email: "foo", password: "fooPass" };
const credentialBar = { email: "bar", password: "barPass" };
let tokenFoo: string;
let tokenBar: string;

beforeEach(async () => {
  await clearDb(postgres);

  return await initDb();
});

afterAll(() => {
  clearDb(postgres);
  return postgres.$disconnect();
});

async function initDb() {
  await Promise.all([
    request(server).post(apiRegister).send(credentialFoo).expect(201),
    request(server).post(apiRegister).send(credentialBar).expect(201),
  ]);

  const users = await Promise.all([
    request(server).post(apiLogin).send(credentialFoo).expect(200),
    request(server).post(apiLogin).send(credentialBar).expect(200),
  ]);

  tokenFoo = `Bearer ${users[0].body.data.token}`;
  tokenBar = `Bearer ${users[1].body.data.token}`;
}

describe("Create group", () => {
  const payloadBad = { id: "foo" };
  const payloadOk = { name: "fooGroup" };

  test("unauthorized request should return 401", async () => {
    await request(server).post(apiPath).send(payloadOk).expect(401);
  });

  test("bad request should return 400", async () => {
    await request(server)
      .post(apiPath)
      .set({ Authorization: tokenFoo })
      .send(payloadBad)
      .expect(400);
  });

  test("good request should return 201", async () => {
    await request(server)
      .post(apiPath)
      .set({ Authorization: tokenFoo })
      .send(payloadOk)
      .expect(201);
  });

  test("duplicate group name should return 500", async () => {
    await request(server)
      .post(apiPath)
      .set({ Authorization: tokenFoo })
      .send(payloadOk)
      .expect(201);

    await request(server)
      .post(apiPath)
      .set({ Authorization: tokenBar })
      .send(payloadOk)
      .expect(500);
  });

  test("create group with non-existent member should return 201", async () => {
    const groupResp = await request(server)
      .post(apiPath)
      .set({ Authorization: tokenFoo })
      .send({ ...payloadOk, memberEmails: ["badEmail"] })
      .expect(201);

    expect(groupResp.body.resource.members.length).toEqual(1);
  });

  test("create group with existing member should return 201 with member", async () => {
    const {
      body: { resource: group },
    } = await request(server)
      .post(apiPath)
      .set({ Authorization: tokenBar })
      .send({ ...payloadOk, memberEmails: [credentialFoo.email] })
      .expect(201);

    expect(group.members.length).toEqual(2);
    expect(group.members.includes(credentialFoo.email)).toEqual(true);
    expect(group.members.includes(credentialBar.email)).toEqual(true);
  });
});

// describe("Shared clipboard", async () => {
//   const payloadCreateGroup = { name: "fooGroup" };
//   const payloadCreateClipboardShared = { content: "fooShared", shared: true };
//   const payloadCreateClipboardPrivate = {
//     content: "fooPrivate",
//     shared: false,
//   };

//   test("Non-member should not see group clipboard", async () => {
//     // User foo reates group
//     const groupCreated = request(app.server)
//       .post(apiPath)
//       .set({ Authrorization: tokenFoo })
//       .send(payloadCreateGroup);
//   });
// });
