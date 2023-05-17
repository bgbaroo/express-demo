import request from "supertest";
import dotenv from "dotenv";

import app from "../../src/init-app";

describe("Register API", () => {
  dotenv.config();

  it("Missing email should fail", async () => {
    const payload = { password: "foo" };
    request(app).post("/users/register").send(payload).expect(400);
  });

  it("Missing password should fail", async () => {
    const payload = { email: "foo" };
    request(app).post("/users/register").send(payload).expect(400);
  });
});
