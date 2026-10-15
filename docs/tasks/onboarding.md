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

## Done

- Baseline green: 12 api tsc errors, 4 api tests, 3 web tsc errors, 8 web browser tests, 6 biome errors.
- Routes are pure `createXRoutes(deps)` factories, with wiring in `api/src/index.ts`. Route tests no longer need a database.
- Removed the nested `web/pnpm-workspace.yaml` and `web/pnpm-lock.yaml`. Renamed the `web` package (it was `rsbuild-react-ts`, so `--filter web` matched nothing).
- `web` unit test renamed to `*.unit.spec.ts`, so vitest picks it up.
- Harness: root `pnpm check`, `.githooks` (pre-commit: lint + type-check, pre-push: check), PreToolUse hook-bypass guard, CI `check.yml`.
- Agent docs: `AGENTS.md` → `GOAL.md`, `CLAUDE.md` symlinks, `docs/architecture/api/`, `docs/specs/README.md`, `implement-spec` skill.

## Open questions

- Acceptance-test seam: `docs/specs/README.md` says the HTTP route (api) and the page (web). gym uses the use-case service. Decide before writing the login acceptance tests.
- Branch `wip/login`: delete it once the login spec is done, or earlier.
- The hook-bypass guard blocks any command that contains `core.hooksPath`, commit messages included.
- Repository infrastructure failures: `Result` with `DATABASE_ERROR` (account) or a thrown error mapped to a generic 500 (timeline; gym's rule)? This blocks the login spec, because `findByEmail` needs an answer.
- Register hashes with bcrypt cost 10 in `api/src/index.ts`. `wip/login`'s `passwordHasher` uses 12. Pick one hasher for both.
- Register returns the raw DB error message on 500 (`api/src/auth/route/route.ts`).
- Web browser tests log a lot of noise (MSW warnings, `response.errors {}` in RegisterPage).
- Unused types `Save` and `FindById` in `api/src/common/repository/Repository.ts`. No dead-code scan (gym uses knip).

## Next

1. [ ] Decide the infrastructure-failure rule and update `docs/architecture/api/repository.md`
2. [ ] Write `docs/specs/login.md` (api: login, refresh, `/me`, logout; web: login page on the real API)
3. [ ] Login acceptance tests; the user reviews them, then they're locked
4. [ ] Run `implement-spec` for login; record cost and stop reasons as in gym `agy-run-*.md`
5. [ ] Lock check: acceptance-test hashes plus no `.skip`/`.only`/`.todo` (gym P1 Next 7)
6. [ ] AC-ID traceability check in `pnpm check` (gym P1 Next 6)
7. [ ] Next features from `web/tasks/` (03–06) as specs, wired to the real API
