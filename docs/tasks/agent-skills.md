# Agent skills: on-demand know-how

Created: 2026-10-15
Status: in progress, resume with "Next"

## Goal

Agents get library and testing know-how from repo skills loaded only when a task needs it, with no Context7, MCP or external docs. Rule: `docs/architecture/agent-context.md`.

## Decisions

1. Rules stay in `docs/architecture/` and `AGENTS.md` files (single source). Skills hold verified how-tos and link to the rules (option A; option B, rules in skills, rejected because a skill that doesn't fire skips the rules silently).
2. Skill format: `.agents/skills/<name>/` + `.claude/skills/<name>` symlink, lean `SKILL.md`, `references/*.md`, recipes verified in the repo, `Sources` section.
3. Skills are produced by an agent running `deep-research` against pinned versions; rule changes it suggests come back as proposals.

## Done

- `implement-spec` skill (onboarding).
- `web-browser-tests` skill: 16 recipes verified on chromium + webkit; helper `web/src/test/renderWithProviders.tsx` (MemoryRouter `initialEntries`, location probe); `LoginPage` spec converted.
- Skill trial: an agent fixed the web browser specs using only `web-browser-tests` (path assertions under MemoryRouter, unawaited `render`, missing assertions, Timeline load-more, i18n locators; 9 mutation checks). It added the missing recipes to the skill. It found an app bug: timeline card content blocked clicks on the card link. Fixed with the stretched-link pattern (`pointer-events-none` on content, `pointer-events-auto` on the like button), with a new test for liking from the list.
- `hono-api` skill: recipes verified (37 temporary tests); cookies + JWT via `hono/jwt` helpers and our own `createRequireAuth` middleware (built-in `jwt` middleware rejected: plain-text 401, header wins over cookie). `createTestApp` made generic so `Hono<AuthEnv>` sub-apps can be tested.
- `tailwind-v4` skill (4.1.13) and `base-ui` skill (1.0.0; base-ui.com documents 1.9, so recipes are checked against the installed `.d.ts`): verified with temporary computed-style and interaction specs on chromium + webkit (Tailwind v4 defaults and variants, theme tokens; Base UI Form server errors, textarea `render`, `focusableWhenDisabled`, Dialog, Menu, Toast, portal stacking). `web/AGENTS.md` now points to both skills instead of external `llms.txt` files. Found: `Box` builds `p-${…}` classes, so its responsive padding is missing (`CreatePostForm` gets 16 px at desktop, not 48 px); `--z-floating` in `App.css` creates no utility and is unused; `#root` lacks `isolation: isolate`, so page `z-*` layers cover Base UI popups.

## Open questions

- At the start of a run, the Skill tool didn't find a skill created earlier in the same session ("Unknown skill"). Skills created mid-session may need a new session before they can be invoked.

- How do we check that a skill's description actually triggers? Only real tasks show it. Candidate: a short eval prompt per skill (`claude plugin eval`) or a manual trial on the next spec.
- Extract `createApp(deps)` from `api/src/index.ts` (it opens the DB and calls `serve` at import), so CORS and global wiring are testable and `pnpm e2e` real mode can start the app. Hono agent proposal.
- `arch/adr/jwt.md` assumes a same-origin frontend/backend; today it's cross-origin. Resolved direction: reverse proxy (onboarding decision 7, Next 9), not CORS. Its "Hono JWT middleware supports cookie natively" point holds, but that middleware's 401 breaks our error body.
- Share response types between api and web (contract types used by route bodies and MSW handlers) to stop mock drift. Hono RPC (`hc`) rejected for now: needs chained routes and validators, and doesn't type MSW handlers.
- `useInfiniteTimeline` sets `retry: 3` with backoff, overriding the test client's `retry: false`, so timeline error tests take ~7 s.

## Next

1. [x] `web-browser-tests` skill (Vitest browser mode, MSW, router, React Query); review the agent's report and its list of current specs that go against best practice
2. [x] `hono-api` skill (routes, errors, cookies, JWT, middleware, testing); review its proposals and the Hono RPC (`hc`) recommendation
3. [ ] Trial `hono-api` on the login spec (`web-browser-tests` already trialled); fix descriptions that didn't trigger
4. [x] `tailwind-v4` and `base-ui` skills; remove the external `llms.txt` links from `web/AGENTS.md`
5. [ ] `playwright-e2e` skill once `pnpm e2e` exists (onboarding Next 8)
6. [ ] `postgres` skill (postgres.js queries, node-pg-migrate migrations, SQL adapter tests against docker Postgres) before the first SQL adapter test
