# Refresh tokens: opaque, hashed, rotated

The access token is a short JWT ([cookies-jwt.md](cookies-jwt.md)). The refresh token is not a JWT: it is a random string the server looks up, so it can be revoked. Session rules (families, reuse detection, TTLs) come from the spec; this page shows the mechanics. Background: RFC 9700 §4.14.2 (refresh token rotation with reuse detection).

## Create and store

```ts
import { createHash, randomBytes, randomUUID } from "node:crypto";

const createRefreshToken = () => randomBytes(32).toString("base64url");
const hashRefreshToken = (token: string) => createHash("sha256").update(token).digest("hex");
```

- 32 random bytes give a 43-character base64url value, safe in a cookie without encoding.
- Store only `hashRefreshToken(token)` (64 hex chars). A leaked table then can't be replayed. SHA-256 without salt is enough here because the token is already 256 bits of randomness; slow hashes (Argon2) are for low-entropy passwords.
- A family is one login: `familyId = randomUUID()` at login, reused by every rotated successor.

## Rotate with reuse detection

```ts
const rotate = async (token: string | undefined) => {
  const row = token ? await repository.findByHash(hashRefreshToken(token)) : undefined;
  if (!row || row.expiresAt.getTime() <= Date.now()) {
    return failure({ type: "INVALID_TOKEN" as const });
  }
  if (row.rotatedAt) {
    await repository.deleteFamily(row.familyId);
    return failure({ type: "INVALID_TOKEN" as const });
  }
  await repository.markRotated(row.tokenHash);
  return success(await issue(row.accountId, row.familyId));
};
```

- Keep rotated rows (with `rotatedAt`) until the family dies; deleting them on rotation makes reuse look like an unknown token, and nothing gets revoked.
- Reuse deletes the whole family, so the attacker's or the victim's current token stops working. Other families (other devices) are untouched.
- Logout: find the row by hash and `deleteFamily(row.familyId)`.
- Compare `expiresAt` with `Date.now()` so tests can fake `Date` ([testing.md](testing.md#expired-tokens)).

## Cookie `Path` is tied to the mount point

```ts
const AUTH_MOUNT_PATH = "/api/auth";

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  path: AUTH_MOUNT_PATH,
  maxAge: REFRESH_TOKEN_TTL_SECONDS,
} as const;
```

- Header: `refresh_token=<43 chars>; Max-Age=2592000; Path=/api/auth; HttpOnly; Secure; SameSite=Strict`.
- With `Path=/api/auth` the browser sends the refresh token only to the auth endpoints, not with every `/api/*` call.
- A sub-app doesn't know where `index.ts` mounts it. The path is a plain string in the cookie, so if the mount in `index.ts` changes, the cookie path must change too, or the browser stops sending the token. Keep both in sync (one constant, or pass it in through deps).
- `deleteCookie(c, "refresh_token", { path: AUTH_MOUNT_PATH, secure: true })`: the same path, or the browser keeps the cookie.
- In `app.request` tests the path is only a header value; the test sends `Cookie` itself, so a wrong path is not caught there. Assert the attribute.

Verified on hono 4.11.3 with a temporary spec: header format, rotation, reuse revoking only its family, expiry under `vi.useFakeTimers({ toFake: ["Date"] })`, 64-char stored hashes.
