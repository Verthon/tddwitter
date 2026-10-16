# Testing routes with cookies and tokens

Base pattern (setup, `createTestApp`, `rejectWith`): [SKILL.md](../SKILL.md#route-tests). Test rules: [route.md](../../../../docs/architecture/api/route.md).

## Read `Set-Cookie`

`res.headers.getSetCookie()` returns one string per cookie (Node 24 `Headers`). Don't use `res.headers.get("set-cookie")`: it joins several cookies with `, `.

```ts
const res = await postJson(app, "/login", { email: "a@b.c", password: "correct-horse-1" });

expect(res.status).toBe(204);
const [cookie] = res.headers.getSetCookie();
expect(cookie).toMatch(
  /^access_token=[^;]+; Max-Age=900; Path=\/; HttpOnly; Secure; SameSite=Strict$/,
);
```

Assert no cookie on failure: `expect(res.headers.getSetCookie()).toStrictEqual([])`.

Logout: `expect(res.headers.getSetCookie()).toStrictEqual(["access_token=; Max-Age=0; Path=/; Secure"])`.

## Send a cookie

`app.request` has no cookie jar. Set the `Cookie` header yourself.

```ts
const token = await signAccessToken(1, SECRET);

const res = await app.request("/me", { headers: { Cookie: `access_token=${token}` } });
```

Carry the cookie from a login response into the next request:

```ts
const login = await postJson(app, "/login", { email: "a@b.c", password: "correct-horse-1" });
const cookie = login.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");

const res = await app.request("/me", { headers: { Cookie: cookie } });
```

Use a literal test secret (`const SECRET = "test-secret"`) passed through the route's deps. Never import `@/auth/config/jwt.js` in tests.

## Expired tokens

Either sign a token that is already expired:

```ts
const token = await sign({ sub: "1", exp: nowInSeconds() - 1 }, SECRET, "HS256");
```

or move the clock with vitest fake timers (`verify` reads `Date.now()`). Fake only `Date`:

```ts
vi.useFakeTimers({ toFake: ["Date"] });
vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
const token = await signAccessToken(1, SECRET);
vi.setSystemTime(Date.now() + (ACCESS_TOKEN_TTL_SECONDS + 1) * 1000);
expectFailureOfType(await verifyAccessToken(token, SECRET), "INVALID_TOKEN");
vi.useRealTimers();
```

- Put `vi.useRealTimers()` in `afterEach`, so a failing assertion doesn't leave the clock faked for the next test.
- Why only `Date`: plain `vi.useFakeTimers()` also fakes `setTimeout`, `setImmediate` and friends. Async `node:crypto` `argon2` still completes, because its callback comes from the libuv thread pool, not a timer. But anything that awaits a timer (a `delay` in a fake, retries with backoff) hangs until the test times out. Verified on vitest 4.0.16: `argon2` passes under both modes, `await new Promise((r) => setTimeout(r, 10))` and `setImmediate` time out under the default.
- `vi.advanceTimersByTime(ms)` also moves the faked `Date`, but `setSystemTime` reads more plainly when only the clock matters.

## Unauthenticated requests

Test both a missing cookie and a bad one, and assert the standard body:

```ts
const missing = await app.request("/me");
const bad = await app.request("/me", { headers: { Cookie: "access_token=garbage" } });

expect(missing.status).toBe(401);
expect(await missing.json()).toStrictEqual({ error: { en: "Unauthorized" } });
expect(bad.status).toBe(401);
```

## Several sub-apps on one prefix

When a feature has two route factories mounted under the same prefix in `index.ts` (`app.route("/api/auth", a)` and `app.route("/api/auth", b)`), test them together the same way:

```ts
const routes = new Hono()
  .route("/", createAuthRoutes(registerService))
  .route("/", createSessionRoutes({ sessionService, jwtSecret: SECRET }));
const app = createTestApp(routes);

await app.request("/register", { method: "POST", /* … */ });
await app.request("/login", { method: "POST", /* … */ });
```

Both sub-apps answer on their own paths, so a test can create an account through `/register` and log in through `/login` against the same in-memory repository. Verified: the same pair mounted twice under `/api/auth` serves both paths.

## `testClient`

`testClient(app)` from `hono/testing` gives a typed client (`client.thing[":id"].$get({ param: { id: "1" } })`), but only for routes chained onto the `Hono` instance (`new Hono().get(...).post(...)`). This repo's factories register routes as statements, so `testClient` has no route types here. Use `app.request`.
