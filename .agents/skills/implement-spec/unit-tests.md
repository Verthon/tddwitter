# Tests below the seam

The acceptance tests already cover every AC. Your tests cover what they don't.

## Write

- Validation edges the ACs don't hit: boundaries from `config/` (min − 1, min, max, max + 1), wrong types, missing fields.
- Pure `model/` functions: every branch.
- Port failures: a repository that rejects must make the service reject or fail as the spec says.
- Persistence: when a test claims something was saved, read it back through the repository, or use a recording fake that captures `save` calls.

## Don't

- Restate an AC under a different name. If an acceptance test already asserts it, delete your test.
- Read `.value` or `.error` without checking `_tag`. Use `expectSuccess` / `expectFailure` from `@/common/test-utils/result.js`.
- Add more values to a partition an AC already tests.
- Name a test for something it doesn't assert.
- Import `@/infra/*` in a test. Use in-memory repositories.

## Place

- api: `__tests__/<file>.spec.ts` next to the code.
- web: `*.unit.spec.ts` (node) or `*.browser.spec.tsx` (browser).
- Never add tests to an acceptance test file.
