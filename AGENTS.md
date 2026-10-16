# Agents

Read [GOAL.md](GOAL.md) first.

- `secrets/` and `.env*` hold dev-only throwaway values; agents may read and write them. Never commit them (pre-commit blocks it; only `.env.example` files and `web/.env.test` are tracked). Production secrets never live in this repo.
- `pnpm check` (root) must be green before you call work done. It runs lint, type-check and tests for `api` and `web`.
- `api/`: Hono + postgres.js. Rules: [docs/architecture/api/](docs/architecture/api/building-blocks.md).
- `web/`: React + MSW. Rules: [web/AGENTS.md](web/AGENTS.md).
- Features are spec-first: [docs/specs/README.md](docs/specs/README.md). To implement a spec, use the `implement-spec` skill.
- Rules vs know-how: rules in `docs/architecture/`, how-tos in on-demand skills. See [docs/architecture/agent-context.md](docs/architecture/agent-context.md).
- Ongoing work and its next steps: `docs/tasks/`.
