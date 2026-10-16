# Agent onboarding and project resurrection

Created: 2026-10-15
Status: in progress, resume with "Next"

## Goal

Bring tddwitter back after 8 months idle, port gym's agent setup, and push the first full-stack feature (login) through the spec-first workflow.

## Decisions

1. Claude only for now: Claude writes specs and acceptance tests, and `implement-spec` runs in a Claude session or subagent. gym's agy/Gemini split comes later, if at all.
2. Toolchain unchanged (node 24, pnpm 10, TS 5.x, oxlint in api, biome in web). Only the harness was added. Upgrading to gym's toolchain is a separate task.
3. Login WIP parked on branch `wip/login` (949b752a). It skips the password check, so it's reference material only. Login gets rebuilt from `docs/specs/login.md`.
4. First feature: login + JWT in httpOnly cookies (`arch/adr/auth.md`, `arch/adr/jwt.md`).
5. Repository infrastructure failures are thrown and mapped to a generic 500. Expected outcomes are `Result` failures, handled exhaustively (`assertNever`). Register migrated; test helpers `expectFailureOfType`, `createTestApp`, `rejectWith`.
6. E2E: one Playwright suite run by a separate `pnpm e2e` (not in `pnpm check`), blocking in CI. Backend switch: mock (MSW) now, real api + docker Postgres later; same tests. Journeys only, no page-level duplicates.
7. Same-origin web + api via a reverse proxy (nginx or similar; rsbuild dev proxy for local dev) so httpOnly cookies work without CORS and `arch/adr/jwt.md` stays true. Done in code (Next 9): web calls relative `/api` paths; not yet run in compose.
8. Acceptance-test seam: the public boundary, as in `docs/specs/README.md`. api: the HTTP route via `app.request` (`createTestApp`), in-memory repositories. web: the page in a browser test (`renderWithProviders`). Not the use-case service (gym's choice): cookies, status codes and error bodies are only visible at HTTP, and boundary tests survive refactors below the seam. Services get their own unit tests.
9. Password hashing: Argon2id via built-in `node:crypto` `argon2` (Node ≥ 24.7), OWASP parameters m=19456 KiB, t=2, p=1, 16-byte random salt, stored as a PHC string (`$argon2id$v=19$m=19456,t=2,p=1$<salt>$<hash>`), verified with `timingSafeEqual`. One `passwordHasher` used by register and login. Drop the `bcrypt` dependency. The 72-byte cap existed only because of bcrypt; keep a maximum length to bound hashing cost (the login spec sets the value). No migration: no production data yet. Source: OWASP Password Storage Cheat Sheet.
10. `JWT_SECRET` comes from a Docker secret via `JWT_SECRET_FILE`, as with the DB credentials (`docker.md` R5). The login spec states this.

## Done

- Baseline green: 12 api tsc errors, 4 api tests, 3 web tsc errors, 8 web browser tests, 6 biome errors.
- Routes are pure `createXRoutes(deps)` factories, with wiring in `api/src/index.ts`. Route tests no longer need a database.
- Removed the nested `web/pnpm-workspace.yaml` and `web/pnpm-lock.yaml`. Renamed the `web` package (it was `rsbuild-react-ts`, so `--filter web` matched nothing).
- `web` unit test renamed to `*.unit.spec.ts`, so vitest picks it up.
- Harness: root `pnpm check`, `.githooks` (pre-commit: lint + type-check, pre-push: check), PreToolUse hook-bypass guard, CI `check.yml`.
- Malformed JSON bodies return 400 `MALFORMED_JSON` via `readJsonBody` (`api/src/common/http/`), not 500. Timeline 400 now uses the standard `{ error: localizedMessage(...) }` body; first timeline route test added.
- Agent docs: `AGENTS.md` → `GOAL.md`, `CLAUDE.md` symlinks, `docs/architecture/api/`, `docs/specs/README.md`, `implement-spec` skill.

- Timeline model invariant violation throws (was a `Failure` that the service turned into a 200 with the string `"Invariant violation"`).
- MVP scope recorded in `GOAL.md`.
- Same-origin reverse proxy (decision 7): `web/src/api/apiBase.ts` (`/api`) used by every service and MSW handler instead of `PUBLIC_*_API`; rsbuild `server.proxy` sends `/api` to `http://localhost:4000` (`API_PROXY_TARGET` overrides); nginx in the compose `web` service serves the build and proxies `/api` to `api:4000` (`web/nginx/default.conf`).

## Open questions

- api image runs on `tsx` because `tsc` output keeps `@/` aliases. Works, but slower start and a compiler in production. Candidate: bundle (tsup/esbuild) or rewrite aliases at build.
- An agent bypassed the rtk git rewrite guard by calling `/usr/bin/git` directly (repo pre-commit hook still ran). Decide whether the guard should cover direct binary paths.
- User to-dos before the compose run: create `secrets/jwt_secret.txt` (32+ chars); in `api/.env*` replace `JWT_SECRET` with `JWT_SECRET_FILE`, add `DB_PORT=5433`; drop `PUBLIC_*_API` from `web/.env*`, keep `PUBLIC_MOCK`; `docker compose down -v` (volume path changed) then `docker compose up --build`.

- Branch `wip/login`: delete it once the login spec is done, or earlier.
- The hook-bypass guard blocks any command that contains `core.hooksPath`, commit messages included.
- Web browser tests log a lot of noise (MSW warnings, `response.errors {}` in RegisterPage).
- Unused types `Save` and `FindById` in `api/src/common/repository/Repository.ts`. No dead-code scan (gym uses knip).

## Next

1. [x] Decide the infrastructure-failure rule and update `docs/architecture/api/repository.md`
2. [x] Write `docs/specs/login.md` (api: login, refresh, `/me`, logout; web: login page on the real API)
3. [ ] Login acceptance tests; the user reviews them, then they're locked. Written on branch `worktree-agent-a0f0618e55ab423e1` (spec, `api/src/auth/__tests__/login.acceptance.spec.ts`, `web/src/core/auth/__tests__/login.acceptance.browser.spec.tsx`), not merged because they fail by design. Merges cleanly. Mutation-checked for api (password check, rotation, reuse revocation, family isolation). Unproven: `me` invalidation after login. Waiting for user review.
4. [ ] Run `implement-spec` for login; record cost and stop reasons as in gym `agy-run-*.md`
5. [ ] Lock check: acceptance-test hashes plus no `.skip`/`.only`/`.todo` (gym P1 Next 7)
6. [ ] AC-ID traceability check in `pnpm check` (gym P1 Next 6)
7. [ ] Next MVP features (see `GOAL.md`) as specs, wired to the real API: create post, global timeline, likes
8. [ ] Set up `pnpm e2e` (Playwright, mock mode) with the first journey: register → login
9. [x] Reverse proxy for same origin (decision 7): rsbuild dev proxy for `/api`, nginx (or similar) in `docker-compose.yml`, web services on relative `/api` paths (compose run pending, see `docker.md` Next 3)
