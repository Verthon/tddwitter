# Specs

One file per feature: `docs/specs/<feature>.md`. Workflow from gym `docs/tasks/P1-spec-first-workflow.md`.

1. Claude writes the spec. Open questions that affect a criterion block it.
2. Claude turns each criterion into an acceptance test. The user reviews the tests before implementation starts.
3. Acceptance tests are locked: the implementer never edits, skips or deletes them.
4. The implementer (the `implement-spec` skill) writes code and its own tests below the seam until `pnpm check` is green.

## Template

```md
# <Feature>

Status: draft | locked | done

## Problem
## Solution
## Seam
The single entry point the acceptance tests go through (an HTTP route via `app.request`, or a page in a browser test).
## Commands
### <Command>
Actor · Preconditions
- AC-<X>-01: Given … When … Then …
## Implementation decisions
Type shapes and status codes allowed. No file paths.
## Out of scope
## Open questions
- [blocking] …
- [non-blocking] …
```

## Acceptance tests

- api: `api/src/<feature>/__tests__/<feature>.acceptance.spec.ts`
- web: `web/src/<feature>/__tests__/<feature>.acceptance.browser.spec.tsx`
- Every test name starts with its AC ID: `it("AC-LOGIN-01: …")`.
