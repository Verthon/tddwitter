# Login

Status: draft

## Problem

A registered user can't sign in. The api has no login, session or `/me` endpoints, register hashes with bcrypt (72-byte cap) in `index.ts`, and the web login page calls a mocked absolute `PUBLIC_AUTH_API` URL. Branch `wip/login` logs in without checking the password.

## Solution

- api: `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET /api/auth/me`. A short-lived JWT access token and an opaque, rotating refresh token, both in httpOnly cookies (`arch/adr/auth.md`, `arch/adr/jwt.md`).
- One Argon2id `passwordHasher` for register and login (onboarding decision 9). bcrypt goes.
- `JWT_SECRET` comes from the file named by `JWT_SECRET_FILE` (onboarding decision 10, `docs/tasks/docker.md` R5).
- web: the login page and the signed-in state use the real API on relative `/api/auth/*` paths (onboarding decision 7: same origin through a reverse proxy).

## Seam

- api: the auth HTTP routes via `app.request`, built as in `api/src/index.ts` from `createAuthRoutes(registerService)` and `createSessionRoutes({ sessionService, jwtSecret })`, wrapped in `createTestApp`, with in-memory repositories and the real `passwordHasher`. Accounts are created through `POST /register`. Paths are relative to the sub-app (`/login`, not `/api/auth/login`). Time is moved with `vi.setSystemTime` (only `Date` is faked).
- web: the login page (`LoginPage`) and, for the signed-in flow, `AppRoutes` at `/login`, in a browser test (`renderWithProviders`), with MSW handlers on relative `/api/auth/*` paths.

## Commands

### Log in

Actor: visitor · Preconditions: an account registered with `user@example.com` / a valid password

- AC-LOGIN-01: Given a registered account, When `POST /login` with its email and password, Then 200 `{ id, email }` and two cookies: `access_token` (`Max-Age=900; Path=/; HttpOnly; Secure; SameSite=Strict`) and `refresh_token` (`Max-Age=2592000; Path=/api/auth; HttpOnly; Secure; SameSite=Strict`), both non-empty.
- AC-LOGIN-02: Given a registered account, When `POST /login` with a wrong password, Then 401 `{ error: { en: "Invalid email or password" } }` and no `Set-Cookie`.
- AC-LOGIN-03: Given no account for the email, When `POST /login`, Then the same 401 body as AC-LOGIN-02 and no `Set-Cookie`.
- AC-LOGIN-04: Given a body with a missing, empty or non-string field, an invalid email, or a password over 128 characters, When `POST /login`, Then 400 `{ error: { en: <message> } }` and no `Set-Cookie`.
- AC-LOGIN-05: Given a malformed JSON body, When `POST /login`, Then 400 `{ error: { en: "Malformed JSON body" } }` and no `Set-Cookie`.
- AC-LOGIN-06: Given the account lookup throws, When `POST /login`, Then 500 `{ error: { en: "Something went wrong" } }`, no `Set-Cookie`, and the error is logged once.

### Read the current account

Actor: any client · Preconditions: none

- AC-LOGIN-07: Given a logged-in session, When `GET /me` with its cookies, Then 200 `{ id, email }` of that account.
- AC-LOGIN-08: Given no `access_token`, a garbage one, or one signed with another secret, When `GET /me`, Then 401 `{ error: { en: "Unauthorized" } }`.
- AC-LOGIN-09: Given a login at T, When `GET /me` at T + 899 s and at T + 901 s, Then 200 and then 401 `Unauthorized`.

### Refresh the session

Actor: logged-in client · Preconditions: a `refresh_token` cookie from login or a previous refresh

- AC-LOGIN-10: Given a login and an expired access token (T + 901 s), When `POST /refresh` with the cookies, Then 204 with new `access_token` and `refresh_token` cookies (same attributes as AC-LOGIN-01), the refresh token differs from the old one, and `GET /me` with the new cookies returns 200.
- AC-LOGIN-11: Given a refresh token already used for a refresh, When `POST /refresh` with it again, Then 401 `Unauthorized` and no new `access_token`.
- AC-LOGIN-12: Given no `refresh_token` or an unknown one, When `POST /refresh`, Then 401 `Unauthorized` and no new `access_token`.
- AC-LOGIN-13: Given a login at T, When `POST /refresh` at T + 30 days + 1 s, Then 401 `Unauthorized`.
- AC-LOGIN-14: Given two logins of the same account, When `POST /refresh` with each session's cookies, Then the first gets 401 and the second gets 204 (one session per account).

### Log out

Actor: any client · Preconditions: none

- AC-LOGIN-15: Given a logged-in session, When `POST /logout` with its cookies, Then 204, `Set-Cookie` clears `access_token` (`Max-Age=0; Path=/`) and `refresh_token` (`Max-Age=0; Path=/api/auth`), and a later `POST /refresh` with the old cookies gets 401.
- AC-LOGIN-16: Given no cookies, When `POST /logout`, Then 204 and both cookies are cleared.

### Store passwords

Actor: visitor registering · Preconditions: none

- AC-LOGIN-17: Given two accounts registered with the same password, When the repository saves them, Then each `passwordHash` is `$argon2id$v=19$m=19456,t=2,p=1$<22-char base64 salt>$<43-char base64 hash>` and the two differ.
- AC-LOGIN-18: Given a 128-character password, When registering and then logging in with it, Then 201 and 200. Given a 129-character password, When registering, Then 400.

### Log in from the web app

Actor: visitor in the browser · Preconditions: on `/login`

- AC-LOGIN-19: Given the login page, When the user submits email and password, Then the app sends `POST /api/auth/login` (same origin, relative path) with JSON `{ email, password }` and navigates to `/`.
- AC-LOGIN-20: Given the API answers 401, When the user submits, Then an `alert` shows `core.auth.login.error.invalidCredentials`, the submit button is enabled again and the user stays on `/login`.
- AC-LOGIN-21: Given the API answers 500 or the request fails, When the user submits, Then an `alert` shows `core.auth.login.error.generic`, the submit button is enabled again and the user stays on `/login`.
- AC-LOGIN-22: Given `GET /api/auth/me` answers 401 (signed out: the sidebar shows the Log in link, no Create Post link), When the user logs in and `GET /api/auth/me` now answers `{ id, email }`, Then the signed-in navigation shows (Create Post link) and the Log in link is gone.

## Implementation decisions

- Response bodies: login 200 `{ id: number, email: string }`; `/me` 200 `{ id: number, email: string }`; refresh 204 and logout 204 with no body. Error bodies use `localizedMessage`. Login failures never say which of email or password was wrong.
- Failure types: login `MALFORMED_JSON | VALIDATION_ERROR | INVALID_CREDENTIALS` (400, 400, 401); refresh and `/me` `INVALID_TOKEN` (401 `Unauthorized`). Exhaustive `switch` with `assertNever` (`docs/architecture/api/route.md`).
- Login validation: `email` a valid email up to 254 characters; `password` a string of 1 to 128 characters. Login does not apply the register password policy (min 12), so a policy change never locks out existing accounts.
- Unknown email: still run one `verify` against a fixed dummy Argon2id hash, so the response time doesn't reveal whether the email exists. Unit-tested below the seam, not an AC.
- Password hashing (decision 9): `passwordHasher = { hash, verify }`, two standalone functions (safe to pass detached), on `node:crypto` `argon2("argon2id", …)`: `memory: 19456` (KiB), `passes: 2`, `parallelism: 1`, 16-byte random salt, 32-byte tag. Stored as the PHC string in AC-LOGIN-17 (unpadded standard base64). `verify` parses the PHC string, recomputes with its parameters and compares with `timingSafeEqual`. Register takes `hashPassword: passwordHasher.hash`; the session service takes `verifyPassword: passwordHasher.verify`. `index.ts` wires both. Drop `bcrypt` and `@types/bcrypt`.
- Password maximum: 128 characters (JS string length) for register and login, replacing bcrypt's 72. Why 128: NIST SP 800-63B and the OWASP Authentication Cheat Sheet ask verifiers to allow at least 64 characters, so 128 leaves room for passphrases. Argon2id's cost is set by `m` and `t`, not by input length (the password is hashed once into the initial block H0, RFC 9106 §3.2), so the cap bounds request size rather than hashing time. 128 UTF-16 units are at most 384 bytes of UTF-8. Update `passwordValidationConfig.max` and its doc comment.
- Access token: JWT HS256 via `hono/jwt` `sign`/`verify` with `"HS256"` passed explicitly, payload `{ sub: String(accountId), exp: now + 900 }`. `/me` reads it from the `access_token` cookie through a `createRequireAuth(jwtSecret)`-style middleware (not the built-in `jwt` middleware: its 401 is plain text). `/me` returns 401 if the account no longer exists.
- Refresh token: 32 random bytes, base64url. Only its SHA-256 hex digest is stored, in `refresh_tokens.token_hash`, with `expires_at = now + 30 days` (existing migration). A refresh deletes the used row and inserts a new one (rotation). A login deletes the account's existing rows first (migration comment: single session per account). Logout deletes the row for the cookie's token, if any.
- Cookies: `setCookie`/`deleteCookie` from `hono/cookie`. `access_token` path `/`, `refresh_token` path `/api/auth` (sent only to auth endpoints). Delete with the same path and `secure: true`. `Set-Cookie` only on success, except logout, which always clears.
- Ports: `AccountRepository` becomes an explicit type (fixes the known deviation in `repository.md`) with `save`, `findByEmail(email): Promise<Account | undefined>` and `findById(id): Promise<Account | undefined>`; SQL and in-memory adapters. New `RefreshTokenRepository` port with SQL and in-memory adapters. Lookups that find nothing aren't failures; infrastructure errors are thrown.
- Seam modules the acceptance tests import (they exist as not-implemented placeholders; replace their bodies and types freely, but keep the names and the deps keys the tests pass): `passwordHasher` (`auth/password/passwordHasher.ts`), `createInMemoryRefreshTokenRepository()` (`auth/repository/inMemoryRefreshTokenRepository.ts`), `createSessionService({ accountRepository, refreshTokenRepository, verifyPassword, jwtSecret })` (`auth/session/sessionService.ts`), `createSessionRoutes({ sessionService, jwtSecret })` (`auth/route/sessionRoutes.ts`). `index.ts` mounts it with `app.route("/api/auth", …)` next to `createAuthRoutes`.
- Clock: expiry checks use `Date.now()` (hono's `verify` does too), so tests can fake `Date`.
- `JWT_SECRET`: `env.ts` replaces `JWT_SECRET` with `JWT_SECRET_FILE`, read with `readSecret` like `DB_USER_FILE`; the trimmed value must be at least 32 characters or the process exits at start. Secret reaches routes and services only through deps from `index.ts`; `auth/config/jwt.ts` stops calling `getEnv()` at import. Covered by a unit test below the seam.
- web: `authService` calls `/api/auth/login` and `/api/auth/me` (relative, no `PUBLIC_AUTH_API`); MSW default handlers move to `/api/auth`. `MeResponse` becomes `{ id: number; email: string }` and `useAuth` reads `id`. On login success the `me` query is invalidated and the app navigates to `/`. A 401 shows `core.auth.login.error.invalidCredentials`; anything else shows `core.auth.login.error.generic` (both keys already in `core/i18n/en.json`), in an element with `role="alert"`.

## Out of scope

- Web logout UI, silent refresh on 401 in web, and redirecting signed-out users away from protected pages (next spec).
- Revoking access tokens before they expire: a logged-out access token keeps working for up to 15 minutes.
- Rate limiting and lockout after failed logins.
- The `/user` profile endpoint and `useUser`.
- Reverse proxy and rsbuild dev proxy (onboarding Next 9), and adding `secrets/jwt_secret.txt` to `docker-compose.yml` (docker task).
- Migrating existing bcrypt hashes (no production data).
- Register changes other than the hasher and the 128 maximum.

## Open questions

- [non-blocking] One session per account (AC-LOGIN-14) follows the `refresh_tokens` migration comment. The schema itself allows several rows per account. Logging in on a second device logs out the first; change AC-LOGIN-14 before locking if multi-device sessions are wanted.
- [non-blocking] Acceptance tests use the real Argon2id hasher, so each register or login costs one hash (the suite runs in about 0.6 s).
