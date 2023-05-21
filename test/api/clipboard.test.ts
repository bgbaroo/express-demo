import request from "supertest";

import { AppDev } from "../../src/api/app";
import init from "../../src/init";
import postgres from "../../src/data/sources/postgres";
import { clearDb } from "../util";

// TODO: mock DB
const server = init<AppDev>(AppDev, { db: postgres }).server();

const apiPath = "/clipboards";
const userCredential = { email: "foo", password: "bar" };
const defaultClip = { title: "fooNote", content: "note", shared: true };

let token: string;

beforeEach(async () => {
  await clearDb(postgres);

  return initDb();
});

afterAll(() => {
  clearDb(postgres);

  return postgres.$disconnect();
});

async function initDb() {
  await request(server).post("/users/register").send(userCredential);

  const res = await request(server)
    .post("/users/login")
    .send(userCredential)
    .expect(200);

  token = `Bearer ${res.body.data.token}`;
}

describe("Create clipboard", () => {
  test("Missing token should return 401", async () => {
    return await request(server).post(apiPath).send(defaultClip).expect(401);
  });

  test("should return 201", async () => {
    return await request(server)
      .post(apiPath)
      .set({ Authorization: token })
      .send(defaultClip)
      .expect(201);
  });
});

describe("Get clipboard", () => {
  test("Bad ID should return 404", async () => {
    await request(server)
      .post(apiPath)
      .set({ Authorization: token })
      .send(defaultClip)
      .expect(201);

    await request(server)
      .get(`${apiPath}/some_bad_id`)
      .set({ Authorization: token })
      .send(defaultClip)
      .expect(404);
  });

  test("Should found some", async () => {
    await request(server)
      .post(apiPath)
      .set({ Authorization: token })
      .send(defaultClip)
      .expect(201);

    await request(server)
      .get(`${apiPath}`)
      .set({ Authorization: token })
      .send(defaultClip)
      .expect(200);
  });

  test("Should found exact", async () => {
    const res = await request(server)
      .post(apiPath)
      .set({ Authorization: token })
      .send(defaultClip)
      .expect(201);

    const id = res.body.resource.id;
    await request(server)
      .get(`${apiPath}/${id}`)
      .set({ Authorization: token })
      .send(defaultClip)
      .expect(200);
  });
});
