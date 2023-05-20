import request from "supertest";
import dotenv from "dotenv";

import initApp from "../../src/init-app";
import postgres from "../../src/data/sources/postgres";
import { clearDb } from "../util";

// TODO: mock DB
const app = initApp({ db: postgres });

beforeAll((done) => {
  clearDb(postgres);
  done();
});

describe("Register API", () => {
  dotenv.config();
  const apiPath = "/users/register";

  it("Missing email should return 400", async () => {
    const payload = { password: "foo" };
    return await request(app.server).post(apiPath).send(payload).expect(400);
  });

  it("Missing password should return 400", async () => {
    const payload = { email: "foo" };
    return await request(app.server).post(apiPath).send(payload).expect(400);
  });

  it("Should return 200", async () => {
    const payload = { email: "foo", password: "foobar" };
    return await request(app.server).post(apiPath).send(payload).expect(201);
  });
});

afterAll((done) => {
  postgres.$disconnect();
  done();
});
