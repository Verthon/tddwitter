# Agents

Read [GOAL.md](GOAL.md) first.

- Never read `.env*` files or `secrets/`. The user writes them; pre-commit blocks committing them.
- `pnpm check` (root) must be green before you call work done. It runs lint, type-check and tests for `api` and `web`.
- `api/`: Hono + postgres.js. Rules: [docs/architecture/api/](docs/architecture/api/building-blocks.md).
- `web/`: React + MSW. Rules: [web/AGENTS.md](web/AGENTS.md).
- Features are spec-first: [docs/specs/README.md](docs/specs/README.md). To implement a spec, use the `implement-spec` skill.
- Rules vs know-how: rules in `docs/architecture/`, how-tos in on-demand skills. See [docs/architecture/agent-context.md](docs/architecture/agent-context.md).
- Ongoing work and its next steps: `docs/tasks/`. Delete a task file once all its steps are done; git history keeps the details.
- Trunk-based via short-lived PRs: no direct pushes to `main`. One branch per same-day slice of work, opened with `gh pr create`, merged once `Check` is green, then deleted. Split multi-day specs and tasks into several branches. Automated review comments are advisory. Commit messages and PR bodies explain why. See [docs/adr/0001](docs/adr/0001-trunk-based-development.md).
- After opening a PR, wait for the `Check` run and report its result: `gh pr checks <pr> --watch`. If red, `gh run view <id> --log-failed` and fix it on the branch before merging. Merge with `gh pr merge <pr> --squash --delete-branch`.
