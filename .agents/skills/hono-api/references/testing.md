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

or move the clock with vitest fake timers (`verify` reads `Date.now()`):

```ts
vi.useFakeTimers();
const token = await signAccessToken(1, SECRET);
vi.advanceTimersByTime((ACCESS_TOKEN_TTL_SECONDS + 1) * 1000);
expectFailureOfType(await verifyAccessToken(token, SECRET), "INVALID_TOKEN");
vi.useRealTimers();
```

## Unauthenticated requests

Test both a missing cookie and a bad one, and assert the standard body:

```ts
const missing = await app.request("/me");
const bad = await app.request("/me", { headers: { Cookie: "access_token=garbage" } });

expect(missing.status).toBe(401);
expect(await missing.json()).toStrictEqual({ error: { en: "Unauthorized" } });
expect(bad.status).toBe(401);
```

## `testClient`

`testClient(app)` from `hono/testing` gives a typed client (`client.thing[":id"].$get({ param: { id: "1" } })`), but only for routes chained onto the `Hono` instance (`new Hono().get(...).post(...)`). This repo's factories register routes as statements, so `testClient` has no route types here. Use `app.request`.
