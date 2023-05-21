import request from "supertest";

import initApp from "../../src/init-app";
import postgres from "../../src/data/sources/postgres";
import { clearDb } from "../util";

// TODO: mock DB
const app = initApp({ db: postgres });
const apiPath = "/groups";
const apiRegister = "/users/register";
const apiLogin = "/users/login";

const credentialFoo = { email: "foo", password: "fooPass" };
const credentialBar = { email: "bar", password: "barPass" };
let tokenFoo: string;
let tokenBar: string;

beforeEach(async () => {
  await clearDb(postgres);
  return initDb();
});

afterAll(() => {
  clearDb(postgres);
  return postgres.$disconnect();
});

async function initDb() {
  await Promise.all([
    request(app.server).post(apiRegister).send(credentialFoo).expect(201),
    request(app.server).post(apiRegister).send(credentialBar).expect(201),
  ]);

  const users = await Promise.all([
    request(app.server).post(apiLogin).send(credentialFoo).expect(200),
    request(app.server).post(apiLogin).send(credentialBar).expect(200),
  ]);

  tokenFoo = `Bearer ${users[0].body.data.token}`;
  tokenBar = `Bearer ${users[1].body.data.token}`;
}

describe("Create group", () => {
  const payloadBad = { id: "foo" };
  const payloadOk = { name: "fooGroup" };

  test("unauthorized request should return 401", async () => {
    await request(app.server).post(apiPath).send(payloadOk).expect(401);
  });

  test("bad request should return 400", async () => {
    await request(app.server)
      .post(apiPath)
      .set({ Authorization: tokenFoo })
      .send(payloadBad)
      .expect(400);
  });

  test("good request should return 201", async () => {
    await request(app.server)
      .post(apiPath)
      .set({ Authorization: tokenFoo })
      .send(payloadOk)
      .expect(201);
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
