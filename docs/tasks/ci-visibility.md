# CI visibility for agents

Created: 2026-10-17
Status: done (2026-10-22)

## Goal

After a push to `main`, the agent sees the CI result from the shell and reports it, without the user opening the GitHub Actions tab.

## Why

ADR 0001 (trunk-based) measures trunk health: `main` red less than 5% of the time, and a red `main` is fixed before new work. That only works if a red build is visible right after the push. On 2026-10-17 the agent pushed 34 commits that CI had never run, and could not see the result because `gh` is not installed.

## Next

1. [x] User installs and authenticates the GitHub CLI: `brew install gh`, then `gh auth login` (interactive, user only)
2. [x] Check that the first CI run on `main` (from `50f43f6f`) passed: `gh run list --branch main --limit 3`; if red, fix before new work (ADR 0001). It was red on all 3 runs from a webkit-only flake in `Timeline.browser.spec.tsx`; fixed in `58454d38`, run 39103159551 green (2026-10-18).
3. [x] ~~Allow read-only `gh run list` / `gh run view` / `gh run watch` in `.claude/settings.json`~~ Not needed: `gh run list` runs without a prompt under the current permission mode (2026-10-22), same as `gym` and `portfolio`, which have no `gh` allow rules either.
4. [x] Add to `AGENTS.md`: after a push to `main`, wait for the `Check` run with `gh run watch` and report the result
