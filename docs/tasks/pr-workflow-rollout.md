# PR workflow rollout

ADR 0001 now says: every change goes through a short-lived PR, `check` and `install_build (web)` must pass, and CodeRabbit comments as an advisory reviewer.

Done on 2026-11-03:

- Ruleset `protect-main` (id 26478399) is active on `main`: no deletion, no force push, PR required, squash only, the two checks required, empty bypass list.
- CodeRabbit is installed. `.coderabbit.yaml` lists `^main$` in `base_branches`, because without it CodeRabbit skipped PRs as "not the default branch". It reads the config from the PR branch.
- PR #1 (ADR + `AGENTS.md` + `.coderabbit.yaml`) is green and reviewed.

## Next steps

1. Merge PR #1: `gh pr merge 1 --squash --delete-branch`. The auto-mode classifier denied this for the agent, so the user merges, then the agent pulls `main` and watches the `Check` run.
2. Decide who merges: allow `gh pr merge` for the agent in permissions, or change the `AGENTS.md` line so the user merges.
3. Open a PR for the CodeRabbit finding on `docs/tasks/onboarding.md:13`: it says Node 24 / pnpm 10 and Node 26.12.1 / pnpm 12.16.1 in the same item.
4. Ignore the CodeRabbit MD038 finding on `.agents/skills/hono-api/references/testing.md:7`. The `, ` code span is intentional.
