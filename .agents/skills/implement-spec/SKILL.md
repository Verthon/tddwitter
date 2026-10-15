---
name: implement-spec
description: Implement a locked spec and its acceptance tests inside the allowed folders. Use when a prompt gives a docs/specs/*.md path, locked acceptance tests, and allowed paths.
---

# Implement a locked spec

## Inputs

The prompt gives you a spec path, locked acceptance test paths, and the allowed folders. Read those files first. Read nothing else until a step below tells you to.

## Locked files

Never edit, skip, or delete the spec or the acceptance tests. Never edit files outside the allowed folders, including configs, `package.json` and `api/src/index.ts`, unless the prompt lists them. The lock is checked after your run, so don't check it yourself with `git`.

## Steps

1. From the spec's Seam and Implementation decisions, list the building blocks you need.
2. Build bottom-up, so a file is written only after the files it imports: model → repository → service → route (api), then services → queries/hooks → components → page (web). Before writing a block, read only its row in the table below.
3. Before writing your own tests, read [unit-tests.md](unit-tests.md).
4. Run `pnpm check` from the repo root. While fixing, narrow the loop: `pnpm --filter api exec vitest run <path>`, `pnpm --filter web exec vitest run <path>`, `pnpm lint`, `pnpm type-check`.
5. When `pnpm check` is green, write the report immediately. Don't run `git`, `find`, or `ls` to verify anything.

## Load on demand

| Writing | Read |
|---|---|
| Anything returning `Result` | `docs/architecture/api/result.md` |
| Repository | `docs/architecture/api/repository.md` |
| Service | `docs/architecture/api/service.md` |
| Route | `docs/architecture/api/route.md` |
| Anything in `web/` | `web/AGENTS.md` |

Docs end with a reference implementation. Open it only if the doc doesn't answer your question. The doc is the rule: if the reference disagrees, follow the doc and list the conflict in the report. Skip anything the doc lists as a known deviation. Don't read `docs/tasks/` or other features unless the spec names them.

## Stop and report

Stop immediately and report when:

- a locked file looks wrong (fails lint, contradicts the spec, can't pass);
- a fix needs a change outside the allowed folders;
- the same check fails 3 times in a row with the same error;
- the spec leaves open a decision that changes behavior.

## Report

- Done: files created or changed, one line each.
- `pnpm check`: green, or the failing command and its first error.
- Stopped on: `file:line`, cause, up to two proposed fixes. Omit if you didn't stop.
- Doc/code conflicts found.
