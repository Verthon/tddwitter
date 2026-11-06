# Deploy ready

Created: 2026-11-05

## Goal

Going live on Railway with Supabase Free takes one working day. No real deploy is planned. See `docs/decision-log.md` D-001, D-002 and D-003.

**Done when:** the rehearsal in step 7 finished in one working day by following `DEPLOY.md`, including a real login and `GET /api/timeline` returning 200 (D-006). Rows with text are not required. Then delete this task file.

Finding numbers refer to `~/Projects/advisors/research/tddwitter-audit-2026-11-04.md`. Those findings are unreviewed research from reading the code. The audit assumed a VPS, so read findings 2, 4 and 5 with D-002 in mind.

Features are out of scope. Add a decision log entry for each real backend choice made in these steps.

## Next

1. [x] Prove the stack: `docker compose up` from a clean clone, then a real login. This is `docs/tasks/docker.md` Next 3.
2. [ ] Test the real database code in CI: SQL adapters and migrations against real Postgres (finding 14). This is `docs/tasks/docker.md` Next 4 and F2 in `docs/tasks/test-architecture.md`.
3. [ ] Take seeding out of `api/docker-entrypoint.sh` (finding 1). `api/package.json` already has `db:seed`. The host loop in `docs/tasks/docker.md` uses `docker compose run --rm api true`, so it needs the explicit command.
4. [ ] Add rate limiting on login and register (finding 3): a failure count per account with exponential delay, plus a coarse per-IP limit in nginx with `limit_req_status 429`.
   - Trap: behind a hosting proxy, `$remote_addr` may be the proxy, so one per-IP limit would apply to all users together. Check the client IP during the rehearsal.
5. [ ] Add security headers (finding 5).
   - One `add_header` in a `location` drops the inherited ones.
   - Headers need `always`, or they are missing on 4xx and 5xx responses.
   - Start HSTS without `preload`.
6. [ ] Make the config work outside Compose:
   - Secrets: `api/src/infra/env.ts:11-14` and `api/docker-entrypoint.sh:4-5` accept secrets only as files. Hosting probably gives environment variables.
   - Database TLS: `api/src/infra/db.ts:10-19` sets no TLS option. Migrations connect separately in `api/docker-entrypoint.sh:11`, so check both.
   - Api address: `web/nginx/default.conf:9` hardcodes `http://api:4000`, a name that exists only in Compose.
   - Production values: `docker-compose.yml:23` sets `NODE_ENV: development`.
7. [ ] Write `DEPLOY.md` with the exact deploy-day steps, then rehearse it (D-003) and delete everything afterwards. Correct `DEPLOY.md` wherever the rehearsal shows it is wrong.
   - `DEPLOY.md` must state that the app is not usable as a product at this point: no create post, no likes, and blank timeline rows if posts exist (D-006).

## Found by the step 1 run (2026-11-06)

Result: step 1 passed as written at `d5b7697e`, no fixes, login in Chromium. The checkbox is left for the maintainer to tick.

Not fixed. The contract check and the smoke test are decided (D-005, D-006). The other items here are not.

- **The api and web disagree, and no test can see it.** Per timeline item the api returns `id`, `publicId`, `createdAt`. Web expects `avatar`, `username`, `content`, `timestamp` (`web/src/timeline/types.ts`). `nextCursor` and `hasMore` also differ. The browser shows 10 rows with no text, then "You've reached the end". Web calls `/api/posts` for likes and create post, but `api/src/index.ts:47-49` mounts only auth and timeline, so likes return 404. Web tests use MSW and api tests use in-memory fakes, so `pnpm check` can pass with this mismatch. Step 2 as written would not catch it.
- **Decided: contract check (D-005).** A shared Zod package with an endpoint list, failing in `pnpm check`. It is not a step of this task, because the rehearsal does not depend on it. The work is F1 in `docs/tasks/test-architecture.md`.
- **Decided: smoke test (D-006).** The rehearsal requires a real login and `GET /api/timeline` returning 200, not a readable timeline. See the done condition and step 7.
- **WebKit login fails silently on `http://localhost:8080`.** The server returns 200, WebKit drops the `Secure` cookies, and the user stays logged out with no error. Confirmed with Playwright's WebKit and a proxy that strips only `Secure`. Safari and Firefox were not run. Do not remove `Secure`: use Chromium locally or add local HTTPS.
- **Audit findings confirmed at runtime:** 1 (a deleted seed account returns after a restart), 6 (dev dependencies in the 511 MB api image, running as root), 8 (`/api/health` returns 200 with the database stopped), and the `nextCursor` point of 17.

## Deploy day (for `DEPLOY.md`)

- Create the Railway and Supabase accounts and set the secrets.
- Run the migrations and do a smoke test, including a real login and `GET /api/timeline` returning 200.
- Set up a scheduled `pg_dump` stored off the host, and a restore test (finding 4).
- Add basic error tracking and an uptime check (finding 8).

## Later, only for a real launch

Review findings 9 to 12: CSRF, refresh token lifetime, register revealing emails, and password rules. The rest of the audit waits until real users are close.

## Check during the rehearsal

Everything under `Not verified` in D-002, and whether Postgres 18 migrations apply on the version Supabase gives.
