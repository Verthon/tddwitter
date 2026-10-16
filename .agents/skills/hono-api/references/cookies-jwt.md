# Cookies and JWT

Decisions: JWT access token in an httpOnly cookie (`arch/adr/auth.md`, `arch/adr/jwt.md`). Everything below uses `hono/jwt` and `hono/cookie`, both in `hono`.

## Wiring rules

- The secret reaches routes and services through `deps`, passed from `api/src/index.ts`. Don't import `@/auth/config/jwt.js` in a route or test: it calls `getEnv()` at import time, and routes may not import `@/infra/*`.
- Signing a token is a capability like `hashPassword`: give the service `signAccessToken` in its deps, so service tests can fake it.
- Always pass `"HS256"` to `sign` and `verify`. In 4.11.3 `alg` is optional and defaults to `HS256`, but the current docs mark it required for `verify` and the `jwt` middleware.
- Always set `exp`. `verify` only rejects expired tokens when `exp` is present; a token without it never expires.

## Sign and verify

`verify` throws on a bad token. A bad token is an expected failure, so turn the token errors into a `Result` and rethrow anything else ([result.md](../../../../docs/architecture/api/result.md)).

```ts
import { sign, verify } from "hono/jwt";
import {
  JwtHeaderInvalid,
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
  JwtTokenNotBefore,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";
import { z } from "zod";

import { failure, success, type Result } from "@/common/result/Result.js";

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

const nowInSeconds = () => Math.floor(Date.now() / 1000);

export const signAccessToken = (accountId: number, secret: string) =>
  sign(
    { sub: String(accountId), exp: nowInSeconds() + ACCESS_TOKEN_TTL_SECONDS },
    secret,
    "HS256",
  );

const accessTokenPayloadSchema = z.object({
  sub: z.string().regex(/^[1-9]\d*$/).transform(Number),
});

type InvalidToken = { type: "INVALID_TOKEN" };

const isTokenError = (error: unknown) =>
  error instanceof JwtTokenInvalid ||
  error instanceof JwtHeaderInvalid ||
  error instanceof JwtTokenExpired ||
  error instanceof JwtTokenNotBefore ||
  error instanceof JwtTokenIssuedAt ||
  error instanceof JwtTokenSignatureMismatched;

export const verifyAccessToken = async (
  token: string,
  secret: string,
): Promise<Result<{ accountId: number }, InvalidToken>> => {
  try {
    const parsed = accessTokenPayloadSchema.safeParse(
      await verify(token, secret, "HS256"),
    );
    if (!parsed.success) {
      return failure({ type: "INVALID_TOKEN" as const });
    }
    return success({ accountId: parsed.data.sub });
  } catch (error) {
    if (isTokenError(error)) {
      return failure({ type: "INVALID_TOKEN" as const });
    }
    throw error;
  }
};
```

Verified: round-trip, expired, wrong secret, `"garbage"`, `"not.a.jwt"`, and a payload without `sub` all behave as typed. `verify` returns `JWTPayload` (`Record<string, unknown>` plus `exp`/`nbf`/`iat`), hence the zod parse. `Account.id` is a `number` and JWT `sub` is a string, so the schema turns `sub` back into a number; a non-numeric `sub` becomes `INVALID_TOKEN`. `decode` from `hono/jwt` reads a token without checking the signature; never use it for auth.

## Cookie options

```ts
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const ACCESS_TOKEN_COOKIE = "access_token";

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  path: "/",
  maxAge: ACCESS_TOKEN_TTL_SECONDS,
} as const;
```

- Header produced: `access_token=<jwt>; Max-Age=900; Path=/; HttpOnly; Secure; SameSite=Strict`.
- `path` defaults to `/` in `setCookie`; set it anyway so `deleteCookie` can match it.
- `maxAge` is in seconds. Hono throws if `maxAge` or `expires` is more than 400 days out.
- `Secure` works on `http://localhost` (browsers exempt localhost, per MDN).
- `SameSite=Strict` still sends the cookie from `http://localhost:<web port>` to `http://localhost:<api port>`: ports don't change the site. Cross-origin `fetch` also needs `credentials: "include"` and CORS with credentials ([cors.md](cors.md)).
- `__Host-`/`__Secure-` prefixes: pass `prefix: "host"` or `prefix: "secure"` to `setCookie` and the same as the third argument of `getCookie`. Not exercised in this repo yet.
- Signed cookies (`setSignedCookie` / `getSignedCookie`) add an HMAC to the value. A JWT is already signed, so don't use them for tokens.

## Login, logout, `/me`

```ts
type SessionRoutesDeps = { loginService: LoginService; jwtSecret: string };

export const createSessionRoutes = ({ loginService, jwtSecret }: SessionRoutesDeps) => {
  const routes = new Hono();
  const requireAuth = createRequireAuth(jwtSecret);

  routes.post("/login", async (c) => {
    const body = await readJsonBody(c);
    const result = body._tag === "Failure" ? body : await loginService.login(body.value);

    if (result._tag === "Failure") {
      const { error } = result;
      switch (error.type) {
        case "MALFORMED_JSON":
          return c.json({ error: localizedMessage({ en: "Malformed JSON body" }) }, 400);
        case "INVALID_CREDENTIALS":
          return c.json({ error: localizedMessage({ en: "Invalid credentials" }) }, 401);
        default:
          return assertNever(error);
      }
    }

    setCookie(c, ACCESS_TOKEN_COOKIE, result.value.accessToken, accessTokenCookieOptions);
    return c.body(null, 204);
  });

  routes.post("/logout", (c) => {
    deleteCookie(c, ACCESS_TOKEN_COOKIE, { path: "/", secure: true });
    return c.body(null, 204);
  });

  routes.get("/me", requireAuth, (c) => {
    return c.json({ accountId: c.get("accountId") });
  });

  return routes;
};
```

- `deleteCookie` sends `access_token=; Max-Age=0; Path=/; Secure`. Pass the same `path` (and `domain`, if any) used when setting, or the browser keeps the original cookie.
- Set the cookie only on success. A failed login sends no `Set-Cookie`.
- Status codes and body shapes come from the spec, not from this example.

## `requireAuth` middleware

```ts
import { createMiddleware } from "hono/factory";

type AuthEnv = { Variables: { accountId: number } };

export const createRequireAuth = (secret: string) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const token = getCookie(c, ACCESS_TOKEN_COOKIE);
    const result = token
      ? await verifyAccessToken(token, secret)
      : failure({ type: "INVALID_TOKEN" as const });
    if (result._tag === "Failure") {
      return c.json({ error: localizedMessage({ en: "Unauthorized" }) }, 401);
    }
    c.set("accountId", result.value.accountId);
    await next();
  });
```

Typing details: [middleware.md](middleware.md).

## Why not the built-in `jwt` middleware

`jwt({ secret, alg: "HS256", cookie: "access_token" })` from `hono/jwt` works, but (verified on 4.11.3):

- On a missing or bad token it throws `HTTPException(401)`. Through `handleUnexpectedError` that becomes a plain-text `Unauthorized` body with a `WWW-Authenticate` header, not the standard `{ error: localizedMessage(...) }` body.
- It checks the `Authorization` header first and only falls back to the cookie when the header is absent. A request with a valid cookie and a junk `Authorization: Bearer x` gets 401.
- `c.get("jwtPayload")` is `any` unless you type it with `JwtVariables<T>`, and nothing validates its shape.

Use it only if a spec accepts those responses.
