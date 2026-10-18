# Agents

Read [GOAL.md](GOAL.md) first.

- Never read `.env*` files or `secrets/`. The user writes them; pre-commit blocks committing them.
- `pnpm check` (root) must be green before you call work done. It runs lint, type-check and tests for `api` and `web`.
- `api/`: Hono + postgres.js. Rules: [docs/architecture/api/](docs/architecture/api/building-blocks.md).
- `web/`: React + MSW. Rules: [web/AGENTS.md](web/AGENTS.md).
- Features are spec-first: [docs/specs/README.md](docs/specs/README.md). To implement a spec, use the `implement-spec` skill.
- Rules vs know-how: rules in `docs/architecture/`, how-tos in on-demand skills. See [docs/architecture/agent-context.md](docs/architecture/agent-context.md).
- Ongoing work and its next steps: `docs/tasks/`.
- Trunk-based: commit to `main`, no feature or `wip` branches. Worktree branches merge back the same day and are deleted. Commit messages explain why. See [docs/adr/0001](docs/adr/0001-trunk-based-development.md).
- After a push to `main`, wait for the `Check` run and report its result: `gh run list --workflow Check --branch main --limit 1` for the run id, then `gh run watch <id> --exit-status`. If red, `gh run view <id> --log-failed` and fix it before new work.
