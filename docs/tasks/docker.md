# Docker: local stack and real Postgres for agents

Created: 2026-10-15
Status: not started, R1–R5 accepted (2026-10-16), resume with "Next"

## Goal

`docker compose up` brings up a working stack, and agents can run real Postgres work (SQL adapter tests, migrations, e2e real mode) from the shell without touching dev data or `secrets/`.

## What Docker gives an agent

Nothing for the main loop. `pnpm check` uses in-memory repositories (`createTestApp`) in api and MSW in web, so specs like login, create post and timeline need no database.

Docker matters for three things only:

1. SQL adapter tests (real postgres.js repositories): the only proof that queries and migrations are correct.
2. Migrations and seeds: checking that `api/db/migrations` applies cleanly.
3. `pnpm e2e` real mode (onboarding decision 6): the same journeys against the real api and Postgres.

## Known problems (found by reading, not by running compose)

- `api/src/infra/env.ts` requires `JWT_SECRET` (32+ chars). Compose doesn't set it, and `db.ts` calls `getEnv()` at import, so the api container should exit on start.
- The api container mounts `./api` only and installs from a stale nested `api/pnpm-lock.yaml`, not the root lockfile. The web container has no lockfile at all since `web/pnpm-lock.yaml` was removed, so it resolves unpinned versions.
- pgadmin needs `secrets/pgadmin_email.txt` and `secrets/pgadmin_password.txt`. The README doesn't mention them, and the email secret is unused because the email is hardcoded.
- The db is published on host port 5433, but `db.ts` has no port option and `env.ts` has no `DB_PORT`. The api run on the host can't reach the docker db. `api/load-secrets.sh` hardcodes 5432 and `/run/secrets`.
- The db service reads `${DB_NAME:-tddwitter_db}` from the host env, while the api hardcodes `tddwitter_db`. They can drift.
- The README claims `docker compose up` works.

## Recommendations

### R1. No Postgres MCP (or any MCP) for the database

Agents use the shell: `docker compose up -d db`, `pnpm db:migrate`, `vitest`. If they need to inspect data, they run psql inside the container with its own credentials:
`docker compose exec db sh -c 'psql -U "$(cat /run/secrets/postgres_user)" -d tddwitter_db'`

Why:
- A Postgres MCP needs the DB credentials, which breaks the spirit of "never read `secrets/`". psql in the container keeps the password out of the agent's context.
- `agent-skills.md` decision 1 already says no MCP: know-how goes in skills, rules in `docs/architecture/`.
- The schema's source of truth is `api/db/migrations/`. An agent that checks the schema in a live DB learns to trust state over code.
- MCP tool definitions take up context on every turn, but only SQL adapter work uses them.

Benefit for the coding agent: less context per turn, one way to do things (the shell, as for everything else), no credentials in context, and the schema read from the repo it's changing.

### R2. SQL adapter tests run in a separate `pnpm test:db`, not in `pnpm check`

`pnpm test:db` starts or expects the compose db and runs only the adapter tests. It's blocking in CI, like `pnpm e2e`.

Why:
- `pnpm check` stays fast, deterministic and Docker-free, so the pre-commit and pre-push hooks never fail because Docker isn't running.
- It matches onboarding decision 6 (e2e as a separate command, blocking in CI).
- The adapter is a small surface: only work on a SQL repository needs it.

Benefit for the coding agent: web and route/service work never needs Docker. "Green" keeps one meaning (`pnpm check`). When an agent touches a SQL adapter, the spec or task names `pnpm test:db` as an extra gate.

### R3. A separate test database, never the dev one

Adapter tests and real-mode e2e use their own database (for example `tddwitter_test`), migrated from zero and truncated between tests. Seeds run only on the dev database.

Why: tests that share dev data are order-dependent and flaky, and an agent running tests could wipe data you're looking at in the app.

Benefit for the coding agent: reproducible results. A failing test means the code is wrong, not that the data was left over from something else.

### R4. Fix compose before any task that depends on real Postgres

Do Next 1–3 below before agent-skills Next 6 (`postgres` skill), onboarding Next 8 in real mode, and onboarding Next 9 (nginx in compose).

Why: three planned tasks assume a working compose stack, and no task owns making it work. An agent hitting a broken stack mid-feature will either patch compose outside its allowed paths or stop.

Benefit for the coding agent: real-Postgres tasks start from a known-good baseline, and an agent's stop reasons are about its own feature.

### R5. `JWT_SECRET` as a Docker secret, like the DB credentials

Add `secrets/jwt_secret.txt` and a `JWT_SECRET_FILE` read the same way as `DB_USER_FILE`. The login spec should name this.

Why: one pattern for every secret. It also stays out of `docker-compose.yml` and env dumps.

Benefit for the coding agent: the login spec says where the secret comes from, so the implementing agent doesn't invent its own mechanism or hardcode a dev value.

## Decisions

1. R1–R5 accepted as written.
2. Lockfiles: per-service images built from the repo root with the root lockfile (`pnpm fetch` + `pnpm deploy --filter <service>`, multi-stage). Delete `api/pnpm-lock.yaml`.
3. Drop pgadmin and its secrets. psql in the container is enough.
4. Add `DB_PORT` to `env.ts` and `db.ts`. The usual dev loop is the api on the host (watch mode) against the compose db; compose runs the full stack for e2e real mode.

## Next

1. [x] Decide R1–R5
2. [ ] Fix compose: `JWT_SECRET` secret (R5), root-lockfile images, drop pgadmin, `DB_NAME` single source, `DB_PORT`
3. [ ] Verify `docker compose up` from a clean clone; update `README.md` with every required secret file
4. [ ] Test database and `pnpm test:db` (R2, R3), blocking in CI
5. [ ] Hand off to `agent-skills.md` Next 6 (`postgres` skill), which documents R1–R3 as recipes
