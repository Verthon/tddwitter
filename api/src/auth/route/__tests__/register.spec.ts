import { describe, it, expect, vi } from "vitest";
import { createAuthRoutes } from "../route.js";
import { createRegisterService } from "../../register/registerService.js";
import { createInMemoryAccountRepository } from "../../repository/inMemoryAccountRepository.js";
import type { AccountRepository } from "../../repository/accountRepository.js";
import { createTestApp, rejectWith } from "@/common/test-utils/http.js";

const fakeHash = async (password: string) => `hashed_${password}`;

const setup = (repository: AccountRepository = createInMemoryAccountRepository()) => {
  const service = createRegisterService({ repository, hashPassword: fakeHash });
  const app = createTestApp(createAuthRoutes(service));
  return { app };
};

const post = (app: ReturnType<typeof createTestApp>, body: unknown) =>
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

  it("returns 400 with the standard error body for a malformed JSON body", async () => {
    const { app } = setup();

    const res = await app.request("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json",
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toStrictEqual({ error: { en: "Malformed JSON body" } });
  });

  it("returns a generic 500 without leaking details when the repository throws", async () => {
    const logError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { app } = setup({
      ...createInMemoryAccountRepository(),
      save: rejectWith(new Error("connection refused")),
    });

    const res = await post(app, { email: "user@example.com", password: "correct-horse-1" });

    expect(res.status).toBe(500);
    expect(await res.json()).toStrictEqual({ error: { en: "Something went wrong" } });
    expect(logError).toHaveBeenCalledOnce();
    logError.mockRestore();
  });
});
