# Vitest 5 follow-ups

Created: 2026-10-23
Status: done

## Goal

Skills and configs match Vitest 5.0.5 / Playwright 1.64.1 / Vite 8.3.5, so agents writing tests follow advice that passes, not Vitest 4 advice that now fails.

## Done

- `53ed9356`: Vitest 4.0.16 → 5.0.5 (+ `@vitest/browser*`), Playwright 1.55.1 → 1.64.1, vitest-browser-react 2.3.0, `@vitejs/plugin-react` 6.1.2, `vite-tsconfig-paths` 6.1.1, `vite@8.3.5` declared in `web` and `api` (Vitest 5 makes it a peer). `toHaveTextContent(/^\/$/)` → `toHaveTextContent('/')` in 4 specs; login acceptance test re-locked with the user's approval.
- `ec5be99e`: `.gitignore` keeps `__screenshots__` (Vitest 4 leftovers) and adds `.vitest/` (Vitest 5 artifacts).
- CI green on both commits (`Check` and `Install and build`).

## Source

Vitest 5 migration guide: https://vitest.dev/guide/migration

## Next

0. [x] Timeline scroll flake (CI run 39955291254): app bug, not a test race. `TimeLineList` read only `entries[0]`; under load chromium delivered the late initial `observe()` notification (not intersecting) and the post-scroll one (intersecting) in one batch, so `fetchNextPage` never ran. Now reads the last entry. Reproduced with the full chromium suite under CPU load plus `Emulation.setCPUThrottlingRate` 20 on the spec: 2 failures in ~15 runs before, 0 in 20 after.

Steps 1–3 are independent and can run as parallel agents (one per skill or per config). Each agent verifies every changed snippet on chromium + webkit before editing a skill (the skill's own rule), and must not touch locked acceptance tests or `docs/specs/locks.json`.

1. [x] `web-browser-tests` skill updated to Vitest 5.0.5. A temporary spec on chromium + webkit showed: locators exact and case-sensitive by default (`exact: false`/regex loosen them); `toHaveTextContent('x')` is exact with whitespace normalized; `toHaveTextContent(RegExp)` never matches (so `.not` with a regex passes vacuously), use `toMatchTextContent`; `expect.poll` rejects at the 5 s repo timeout; `expect.element` still waits for the remaining test time. Path-assertion snippets, the `exact: true`/`/like/i` advice, version pins, `outdated-apis.md` and `sources.md` rewritten. The redundant `exact: true` dropped from 4 specs; the locked login acceptance test keeps its one.
2. [x] `hono-api` skill: re-ran the fake-timer claims in `references/testing.md` on 5.0.5 with a temporary spec (token expiry via `setSystemTime`, `argon2` under both modes, `setTimeout`/`setImmediate` hang only under the default). All held; bumped the note. `refresh-tokens.md` only pins hono, so nothing to change there. Node 24.22.1 has no `Temporal`, so v5 faking it alongside `Date` is a no-op here.
3. [x] `vite-tsconfig-paths` removed from `web` and `api`; both configs use `resolve.tsconfigPaths: true`. The `web` browser project's manual `src` alias and `tsconfig.vitest.json` were redundant (`web/tsconfig.json` already maps `src/*`) and are gone. Checked that turning `tsconfigPaths` off breaks `src/...` imports.
4. [x] `pnpm check` green, commit, push, CI green.
