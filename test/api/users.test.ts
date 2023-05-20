import request from "supertest";
import dotenv from "dotenv";

import initApp from "../../src/init-app";
import postgres from "../../src/data/sources/postgres";
import { clearDb } from "../util";

// TODO: mock DB
const app = initApp({ db: postgres });

beforeEach(() => {
  return clearDb(postgres);
});

describe("Register API", () => {
  dotenv.config();
  const apiPath = "/users/register";

  test("Missing email should return 400", async () => {
    const payload = { password: "foo" };
    return await request(app.server).post(apiPath).send(payload).expect(400);
  });

  test("Missing password should return 400", async () => {
    const payload = { email: "foo" };
    return await request(app.server).post(apiPath).send(payload).expect(400);
  });

  test("Should return 201", async () => {
    const payload = { email: "foo", password: "foobar" };
    return await request(app.server).post(apiPath).send(payload).expect(201);
  });
});

describe("Login API", () => {
  const userCredential = { email: "foo", password: "foobar" };
  const invalidUserCredentials = { email: "foo", password: "bar" };

  const registerPath = "/users/register";
  const loginPath = "/users/login";

  test("Invalid credentials should not authenticate", async () => {
    await request(app.server)
      .post(registerPath)
      .send(userCredential)
      .expect(201);

    const res = await request(app.server)
      .post(loginPath)
      .send(invalidUserCredentials)
      .expect(401);

    expect(res.error).toBeDefined();
  });

  test("Should authenticate login", async () => {
    await request(app.server)
      .post(registerPath)
      .send(userCredential)
      .expect(201);

    const res = await request(app.server)
      .post(loginPath)
      .send(userCredential)
      .expect(200);

    expect(res.body.status).toBeDefined();
  });

  test("JWT should authenticate", async () => {
    await request(app.server)
      .post(registerPath)
      .send(userCredential)
      .expect(201);

    const loginRes = await request(app.server)
      .post(loginPath)
      .send(userCredential)
      .expect(200);

    const token = loginRes.body.data.token;

    const res = await request(app.server)
      .get("/clipboards")
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status === 401).toEqual(false);
  });
});

afterAll(() => {
  return postgres.$disconnect();
});
