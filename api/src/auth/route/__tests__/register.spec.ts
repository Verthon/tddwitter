import { describe, it, expect } from "vitest";
import { createAuthRoutes } from "../route.js";
import { createRegisterService } from "../../register/registerService.js";
import { createInMemoryAccountRepository } from "../../repository/inMemoryAccountRepository.js";

const fakeHash = async (password: string) => `hashed_${password}`;

const setup = () => {
  const repository = createInMemoryAccountRepository();
  const service = createRegisterService({ repository, hashPassword: fakeHash });
  const app = createAuthRoutes(service);
  return { app };
};

const post = (app: ReturnType<typeof createAuthRoutes>, body: unknown) =>
  app.request("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /register", () => {
  it("returns 201 with id and email on success", async () => {
    const { app } = setup();

    const res = await post(app, {
      email: "user@example.com",
      password: "correct-horse-1",
    });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toStrictEqual({ id: 1, email: "user@example.com" });
  });

  it("returns 409 when email already exists", async () => {
    const { app } = setup();

    await post(app, { email: "user@example.com", password: "correct-horse-1" });
    const res = await post(app, { email: "user@example.com", password: "correct-horse-2" });

    expect(res.status).toBe(409);
  });

  it("returns 400 for invalid input", async () => {
    const { app } = setup();

    const res = await post(app, { email: "bad", password: "short" });

    expect(res.status).toBe(400);
  });
});
