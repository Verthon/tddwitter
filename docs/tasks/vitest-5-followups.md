# Vitest 5 follow-ups

Created: 2026-10-23
Status: in progress, resume with "Next"

## Goal

Skills and configs match Vitest 5.0.5 / Playwright 1.64.1 / Vite 8.3.5, so agents writing tests follow advice that passes, not Vitest 4 advice that now fails.

## Done

- `53ed9356`: Vitest 4.0.16 → 5.0.5 (+ `@vitest/browser*`), Playwright 1.55.1 → 1.64.1, vitest-browser-react 2.3.0, `@vitejs/plugin-react` 6.1.2, `vite-tsconfig-paths` 6.1.1, `vite@8.3.5` declared in `web` and `api` (Vitest 5 makes it a peer). `toHaveTextContent(/^\/$/)` → `toHaveTextContent('/')` in 4 specs; login acceptance test re-locked with the user's approval.
- `ec5be99e`: `.gitignore` keeps `__screenshots__` (Vitest 4 leftovers) and adds `.vitest/` (Vitest 5 artifacts).
- CI green on both commits (`Check` and `Install and build`).

## Source

Vitest 5 migration guide: https://vitest.dev/guide/migration

## Next

0. [ ] Flake, fix first (ADR 0001): `web/src/timeline/Timeline.browser.spec.tsx` "loads timeline items automatically on scroll in mobile viewport" failed on chromium in CI run 39955291254 (`expected 10 to be 15`, poll timed out after 5 s) on a docs-only commit; the rerun was green. It's the third flake fix attempt for this test (`58454d38`, `622fb4e2`). Suspect the one-shot `window.scrollTo` firing before the load-more sentinel is observed; scrolling inside the poll, or scrolling the sentinel into view until page 2 loads, would remove the race. Reproduce with `--repeat` under CPU throttling before changing it.

Steps 1–3 are independent and can run as parallel agents (one per skill or per config). Each agent verifies every changed snippet on chromium + webkit before editing a skill (the skill's own rule), and must not touch locked acceptance tests or `docs/specs/locks.json`.

1. [ ] `web-browser-tests` skill (`.agents/skills/web-browser-tests/`):
   - `SKILL.md:169,171`, `references/router-and-query.md:25,29`, `references/msw.md:102`: path assertions now use `toHaveTextContent('/')` (exact in v5); regex only via `toMatchTextContent`.
   - `SKILL.md:17,50`: locator matching. Migration guide says `browser.locators.exact` defaults to `true` (exact, case-sensitive). Verify in the repo first, then rewrite the `exact: true` advice and the `/like/i` warning. 10 `exact: true` calls in `web/src` may become redundant.
   - Version pins: description, `SKILL.md:8` (4.0.16, vitest-browser-react 2.0.2), `:189` ("Vitest 4 paths").
   - `references/outdated-apis.md:18`: currently says to ignore Vitest 5 docs; flip it, add a v4 → v5 row (`toHaveTextContent(RegExp)` → `toMatchTextContent`).
   - `references/sources.md`: v4 doc links; re-check lines 20–21 (locator `exact` default, `expect.poll` / `expect.element` timeouts) against 5.0.5. Known change: `expect.poll` now rejects on timeout.
2. [ ] `hono-api` skill: `references/testing.md:64` and `references/refresh-tokens.md:60` say "Verified on vitest 4.0.16". Re-run the fake-timer checks on 5.0.5 (v5 also fakes `Temporal` when faking `Date` by default; we pass `toFake: ["Date"]`) and bump the notes.
3. [ ] Drop `vite-tsconfig-paths` from `web/vitest.config.ts` and `api/vitest.config.mts`: Vite 8 warns it's redundant, use `resolve.tsconfigPaths: true`. Check that the `web` browser project's `src` alias and `tsconfig.vitest.json` still resolve.
4. [ ] `pnpm check` green, commit, push, CI green.
