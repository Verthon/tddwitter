import { Hono } from "hono";
import { sign } from "hono/jwt";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createTestApp, rejectWith } from "@/common/test-utils/http.js";
import { passwordHasher } from "../password/passwordHasher.js";
import { createRegisterService } from "../register/registerService.js";
import type { AccountRepository } from "../repository/accountRepository.js";
import { createInMemoryAccountRepository } from "../repository/inMemoryAccountRepository.js";
import { createInMemoryRefreshTokenRepository } from "../repository/inMemoryRefreshTokenRepository.js";
import { createAuthRoutes } from "../route/route.js";
import { createSessionRoutes } from "../route/sessionRoutes.js";
import { createSessionService } from "../session/sessionService.js";

const JWT_SECRET = "acceptance-test-secret-of-at-least-32-chars";
const OTHER_SECRET = "another-secret-that-is-at-least-32-chars";

const SECOND_MS = 1000;
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
const T0 = new Date("2026-01-01T12:00:00.000Z");

const EMAIL = "user@example.com";
const PASSWORD = "correct-horse-battery";

const setup = (accountRepository: AccountRepository = createInMemoryAccountRepository()) => {
  const registerService = createRegisterService({
    repository: accountRepository,
    hashPassword: passwordHasher.hash,
  });
  const sessionService = createSessionService({
    accountRepository,
    refreshTokenRepository: createInMemoryRefreshTokenRepository(),
    verifyPassword: passwordHasher.verify,
    jwtSecret: JWT_SECRET,
  });
  const routes = new Hono()
    .route("/", createAuthRoutes(registerService))
    .route("/", createSessionRoutes({ sessionService, jwtSecret: JWT_SECRET }));
  return { app: createTestApp(routes) };
};

type App = ReturnType<typeof setup>["app"];

const postJson = (app: App, path: string, body: unknown, cookie?: string) =>
  app.request(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });

const post = (app: App, path: string, cookie?: string) =>
  app.request(path, { method: "POST", headers: cookie ? { Cookie: cookie } : {} });

const getMe = (app: App, cookie?: string) =>
  app.request("/me", { headers: cookie ? { Cookie: cookie } : {} });

const register = async (app: App, email = EMAIL, password = PASSWORD) => {
  const res = await postJson(app, "/register", { email, password });
  expect(res.status).toBe(201);
  return (await res.json()) as { id: number; email: string };
};

const login = (app: App, email = EMAIL, password = PASSWORD) =>
  postJson(app, "/login", { email, password });

type ParsedCookie = {
  value: string;
  attributes: Record<string, string | true>;
};

const parseSetCookies = (res: Response): Record<string, ParsedCookie> =>
  Object.fromEntries(
    res.headers.getSetCookie().map((header) => {
      const [pair = "", ...rest] = header.split(";").map((part) => part.trim());
      const separator = pair.indexOf("=");
      const attributes = Object.fromEntries(
        rest.map((attribute) => {
          const index = attribute.indexOf("=");
          return index === -1
            ? [attribute.toLowerCase(), true]
            : [attribute.slice(0, index).toLowerCase(), attribute.slice(index + 1)];
        }),
      );
      return [pair.slice(0, separator), { value: pair.slice(separator + 1), attributes }];
    }),
  );

const createCookieJar = () => {
  const cookies = new Map<string, string>();
  return {
    store(res: Response) {
      for (const [name, cookie] of Object.entries(parseSetCookies(res))) {
        if (cookie.attributes["max-age"] === "0") {
          cookies.delete(name);
        } else {
          cookies.set(name, cookie.value);
        }
      }
    },
    header: () => [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
    get: (name: string) => cookies.get(name),
  };
};

const loginWithJar = async (app: App) => {
  const jar = createCookieJar();
  const res = await login(app);
  expect(res.status).toBe(200);
  jar.store(res);
  return jar;
};

const advanceClockBy = (seconds: number) => {
  vi.setSystemTime(Date.now() + seconds * SECOND_MS);
};

const UNAUTHORIZED = { error: { en: "Unauthorized" } };
const INVALID_CREDENTIALS = { error: { en: "Invalid email or password" } };
const GENERIC_ERROR = { error: { en: "Something went wrong" } };

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(T0);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("POST /login", () => {
  it("AC-LOGIN-01: returns 200 with the account and sets the access and refresh cookies for correct credentials", async () => {
    const { app } = setup();
    const account = await register(app);

    const res = await login(app);

    expect(res.status).toBe(200);
    expect(await res.json()).toStrictEqual({ id: account.id, email: EMAIL });
    const cookies = parseSetCookies(res);
    expect(Object.keys(cookies).sort()).toStrictEqual(["access_token", "refresh_token"]);
    expect(cookies.access_token?.value).not.toBe("");
    expect(cookies.access_token?.attributes).toStrictEqual({
      "max-age": String(ACCESS_TOKEN_TTL_SECONDS),
      path: "/",
      httponly: true,
      secure: true,
      samesite: "Strict",
    });
    expect(cookies.refresh_token?.value).not.toBe("");
    expect(cookies.refresh_token?.attributes).toStrictEqual({
      "max-age": String(REFRESH_TOKEN_TTL_SECONDS),
      path: "/api/auth",
      httponly: true,
      secure: true,
      samesite: "Strict",
    });
  });

  it("AC-LOGIN-02: returns 401 without cookies for a wrong password", async () => {
    const { app } = setup();
    await register(app);

    const res = await login(app, EMAIL, "wrong-horse-battery");

    expect(res.status).toBe(401);
    expect(await res.json()).toStrictEqual(INVALID_CREDENTIALS);
    expect(res.headers.getSetCookie()).toStrictEqual([]);
  });

  it("AC-LOGIN-03: returns the same 401 without cookies for an unknown email", async () => {
    const { app } = setup();
    await register(app);

    const res = await login(app, "nobody@example.com", PASSWORD);

    expect(res.status).toBe(401);
    expect(await res.json()).toStrictEqual(INVALID_CREDENTIALS);
    expect(res.headers.getSetCookie()).toStrictEqual([]);
  });

  it.each([
    ["a missing password", { email: EMAIL }],
    ["a missing email", { password: PASSWORD }],
    ["a non-string password", { email: EMAIL, password: 123456789012 }],
    ["an invalid email", { email: "not-an-email", password: PASSWORD }],
    ["an empty password", { email: EMAIL, password: "" }],
    ["a password longer than 128 characters", { email: EMAIL, password: "a".repeat(129) }],
  ])("AC-LOGIN-04: returns 400 without cookies for %s", async (_case, body) => {
    const { app } = setup();
    await register(app);

    const res = await postJson(app, "/login", body);

    expect(res.status).toBe(400);
    expect(await res.json()).toStrictEqual({ error: { en: expect.any(String) } });
    expect(res.headers.getSetCookie()).toStrictEqual([]);
  });

  it("AC-LOGIN-05: returns 400 for a malformed JSON body", async () => {
    const { app } = setup();

    const res = await app.request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json",
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toStrictEqual({ error: { en: "Malformed JSON body" } });
    expect(res.headers.getSetCookie()).toStrictEqual([]);
  });

  it("AC-LOGIN-06: returns a generic 500 without leaking details when the account lookup throws", async () => {
    const logError = vi.spyOn(console, "error").mockImplementation(() => {});
    const failingRepository = {
      ...createInMemoryAccountRepository(),
      findByEmail: rejectWith(new Error("connection refused")),
    };
    const { app } = setup(failingRepository);

    const res = await login(app);

    expect(res.status).toBe(500);
    expect(await res.json()).toStrictEqual(GENERIC_ERROR);
    expect(res.headers.getSetCookie()).toStrictEqual([]);
    expect(logError).toHaveBeenCalledOnce();
    logError.mockRestore();
  });
});

describe("GET /me", () => {
  it("AC-LOGIN-07: returns the logged-in account for a valid access token", async () => {
    const { app } = setup();
    const account = await register(app);
    const jar = await loginWithJar(app);

    const res = await getMe(app, jar.header());

    expect(res.status).toBe(200);
    expect(await res.json()).toStrictEqual({ id: account.id, email: EMAIL });
  });

  it("AC-LOGIN-08: returns 401 without an access token, with a garbage token, or with a token signed by another secret", async () => {
    const { app } = setup();
    const account = await register(app);
    const foreignToken = await sign(
      { sub: String(account.id), exp: Math.floor(Date.now() / 1000) + 60 },
      OTHER_SECRET,
      "HS256",
    );

    const missing = await getMe(app);
    const garbage = await getMe(app, "access_token=garbage");
    const foreign = await getMe(app, `access_token=${foreignToken}`);

    for (const res of [missing, garbage, foreign]) {
      expect(res.status).toBe(401);
      expect(await res.json()).toStrictEqual(UNAUTHORIZED);
    }
  });

  it("AC-LOGIN-09: returns 401 once the access token is older than 15 minutes", async () => {
    const { app } = setup();
    await register(app);
    const jar = await loginWithJar(app);

    advanceClockBy(ACCESS_TOKEN_TTL_SECONDS - 1);
    const beforeExpiry = await getMe(app, jar.header());
    advanceClockBy(2);
    const afterExpiry = await getMe(app, jar.header());

    expect(beforeExpiry.status).toBe(200);
    expect(afterExpiry.status).toBe(401);
    expect(await afterExpiry.json()).toStrictEqual(UNAUTHORIZED);
  });
});

describe("POST /refresh", () => {
  it("AC-LOGIN-10: issues new access and refresh cookies for a valid refresh token, and the new access token works", async () => {
    const { app } = setup();
    const account = await register(app);
    const jar = await loginWithJar(app);
    const firstRefreshToken = jar.get("refresh_token");
    advanceClockBy(ACCESS_TOKEN_TTL_SECONDS + 1);

    const res = await post(app, "/refresh", jar.header());

    expect(res.status).toBe(204);
    const cookies = parseSetCookies(res);
    expect(Object.keys(cookies).sort()).toStrictEqual(["access_token", "refresh_token"]);
    expect(cookies.access_token?.attributes).toStrictEqual({
      "max-age": String(ACCESS_TOKEN_TTL_SECONDS),
      path: "/",
      httponly: true,
      secure: true,
      samesite: "Strict",
    });
    expect(cookies.refresh_token?.attributes).toStrictEqual({
      "max-age": String(REFRESH_TOKEN_TTL_SECONDS),
      path: "/api/auth",
      httponly: true,
      secure: true,
      samesite: "Strict",
    });
    expect(cookies.refresh_token?.value).not.toBe(firstRefreshToken);
    jar.store(res);
    const me = await getMe(app, jar.header());
    expect(me.status).toBe(200);
    expect(await me.json()).toStrictEqual({ id: account.id, email: EMAIL });
  });

  it("AC-LOGIN-11: rejects a refresh token that was already used (rotation)", async () => {
    const { app } = setup();
    await register(app);
    const jar = await loginWithJar(app);
    const usedCookie = jar.header();
    const first = await post(app, "/refresh", usedCookie);
    expect(first.status).toBe(204);

    const res = await post(app, "/refresh", usedCookie);

    expect(res.status).toBe(401);
    expect(await res.json()).toStrictEqual(UNAUTHORIZED);
    expect(parseSetCookies(res).access_token?.value ?? "").toBe("");
  });

  it("AC-LOGIN-12: returns 401 without a refresh token or with an unknown one", async () => {
    const { app } = setup();
    await register(app);

    const missing = await post(app, "/refresh");
    const unknown = await post(app, "/refresh", "refresh_token=unknown-token");

    for (const res of [missing, unknown]) {
      expect(res.status).toBe(401);
      expect(await res.json()).toStrictEqual(UNAUTHORIZED);
      expect(parseSetCookies(res).access_token?.value ?? "").toBe("");
    }
  });

  it("AC-LOGIN-13: returns 401 once the refresh token is older than 30 days", async () => {
    const { app } = setup();
    await register(app);
    const jar = await loginWithJar(app);

    advanceClockBy(REFRESH_TOKEN_TTL_SECONDS + 1);
    const res = await post(app, "/refresh", jar.header());

    expect(res.status).toBe(401);
    expect(await res.json()).toStrictEqual(UNAUTHORIZED);
  });

  it("AC-LOGIN-14: a new login ends the previous session of the same account", async () => {
    const { app } = setup();
    await register(app);
    const firstSession = await loginWithJar(app);
    const secondSession = await loginWithJar(app);

    const oldRefresh = await post(app, "/refresh", firstSession.header());
    const newRefresh = await post(app, "/refresh", secondSession.header());

    expect(oldRefresh.status).toBe(401);
    expect(newRefresh.status).toBe(204);
  });
});

describe("POST /logout", () => {
  it("AC-LOGIN-15: clears both cookies and revokes the refresh token", async () => {
    const { app } = setup();
    await register(app);
    const jar = await loginWithJar(app);
    const sessionCookie = jar.header();

    const res = await post(app, "/logout", sessionCookie);

    expect(res.status).toBe(204);
    const cookies = parseSetCookies(res);
    expect(cookies.access_token).toMatchObject({
      value: "",
      attributes: { "max-age": "0", path: "/" },
    });
    expect(cookies.refresh_token).toMatchObject({
      value: "",
      attributes: { "max-age": "0", path: "/api/auth" },
    });
    const refresh = await post(app, "/refresh", sessionCookie);
    expect(refresh.status).toBe(401);
  });

  it("AC-LOGIN-16: succeeds and clears both cookies without a session", async () => {
    const { app } = setup();

    const res = await post(app, "/logout");

    expect(res.status).toBe(204);
    const cookies = parseSetCookies(res);
    expect(cookies.access_token).toMatchObject({ value: "", attributes: { "max-age": "0" } });
    expect(cookies.refresh_token).toMatchObject({ value: "", attributes: { "max-age": "0" } });
  });
});

describe("Password storage", () => {
  const PHC_ARGON2ID = /^\$argon2id\$v=19\$m=19456,t=2,p=1\$[A-Za-z0-9+/]{22}\$[A-Za-z0-9+/]{43}$/;

  it("AC-LOGIN-17: register stores an Argon2id PHC string with a fresh salt per account", async () => {
    const inner = createInMemoryAccountRepository();
    const storedHashes: string[] = [];
    const recordingRepository: AccountRepository = {
      ...inner,
      save: (account) => {
        storedHashes.push(account.passwordHash);
        return inner.save(account);
      },
    };
    const { app } = setup(recordingRepository);

    await register(app, "first@example.com", PASSWORD);
    await register(app, "second@example.com", PASSWORD);

    expect(storedHashes).toHaveLength(2);
    expect(storedHashes[0]).toMatch(PHC_ARGON2ID);
    expect(storedHashes[1]).toMatch(PHC_ARGON2ID);
    expect(storedHashes[0]).not.toBe(storedHashes[1]);
  });

  it("AC-LOGIN-18: accepts passwords up to 128 characters and rejects longer ones at register", async () => {
    const { app } = setup();
    const longest = "p".repeat(128);

    const accepted = await postJson(app, "/register", { email: EMAIL, password: longest });
    const rejected = await postJson(app, "/register", {
      email: "other@example.com",
      password: "p".repeat(129),
    });
    const loggedIn = await login(app, EMAIL, longest);

    expect(accepted.status).toBe(201);
    expect(rejected.status).toBe(400);
    expect(loggedIn.status).toBe(200);
  });
});
