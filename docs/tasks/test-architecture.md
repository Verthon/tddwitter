# Test architecture: close the boundary gaps

Created: 2026-10-17
Status: reviewed, nothing fixed yet, resume with "Next"

## Goal

A green `pnpm check` plus CI means the wired system works, not only each unit in isolation. No more manual QA to find integration bugs.

## Why

Every test today stops before a real boundary. Unit tests are sound, but nothing checks that the pieces fit together:

- No api test touches Postgres. Services and routes run on in-memory repositories, and the three `createSQL*Repository` adapters have no tests.
- Web tests run on MSW with hand-written fixtures. Nothing ties those fixtures to the api's real responses.
- CI (`.github/workflows/check.yml`) runs `pnpm check` and a build. No Docker image, migration, seed or real HTTP call runs anywhere.

Bugs that got through on 2026-10-17, all with green checks:

- `api/docker-entrypoint.sh` committed as `100644`, so the api container could not start. Fixed.
- Seed accounts stored bcrypt hashes after login moved to Argon2id, so no seed account could log in. Fixed.
- **Open:** the web timeline cannot work against the real api. `web/src/timeline/types.ts` expects `{id, avatar, username, content, timestamp}` and `hasMore`; the api returns `{publicId, createdAt}` and `hasMoreItems`. `timelineQueries.ts:17` reads `lastPage.hasMore`, which is always `undefined` from the real api.
- **Open:** `/posts`, `/posts/:postId/like` and `/timeline/:id` exist only as MSW handlers. The api has no such routes.

## Review (problem class → strategy)

Assumptions confirmed by the user: Postgres is managed (api-only); api and web are owned and deployed together.

| Unit | Problem class | Current | Recommended | Verdict |
| --- | --- | --- | --- | --- |
| `passwordHasher`, `accessToken`, `registerValidation`, `queryValidation`, `localizedResponse`, `decodeCursorParts`, `compareTimelineItems`, `computeCursorMetaFields`, `createTimelineModel`, web `dateService` | Transformation | Output-based | Output-based | OK |
| `registerService`, `sessionService`, Hono route specs, `login.acceptance.spec` | Integration | State-based on in-memory fakes | Real Postgres, verify final DB state | Mismatch |
| `createSQLAccountRepository`, `createSQLRefreshTokenRepository`, `createSQLTimelineRepository` | Integration (managed DB) | None | Real Postgres | Missing |
| Web browser specs (timeline, composer, engagement, auth pages) | Integration (owned api) | MSW at the network edge, unchecked fixtures | MSW kept, fixtures bound to a shared contract | Mismatch (contract) |
| `index.ts` wiring, `env.ts`, migrations, seeds, Docker images | Integration / deployment | None | `pnpm e2e` real mode in CI | Missing |

Notes:

- Faking the managed DB hides the SQL behaviour that matters: unique violation → `DUPLICATE_EMAIL`, atomic `markRotated` (`rotated_at IS NULL`), row-value cursor comparison.
- Untested, possible pagination drift: the in-memory timeline repository sorts with `localeCompare` but filters with `<`; Postgres compares `public_id` by collation. Cursors carry milliseconds while `timestamptz` stores microseconds. Not proven to be a bug.
- Keep `sessionService.spec:46` (asserts the `verifyPassword` stub got `DUMMY_PASSWORD_HASH`). Asserting on a stub is normally overspecification, but here it is the anti-enumeration property itself, with no other observable output.

## Fixes, in order

### F1. Shared api↔web contract

One schema per endpoint in a workspace package that both api and web import. Api route specs validate responses against it; web types and MSW fixtures derive from it. Drift then fails `pnpm check` at type-check.

Fixing the timeline drift is part of this: decide the response shape (spec), align api and web to it.

The MSW auth mocks are also looser than the real api, so mock mode cannot show a signed-out or expired session:

- `GET /auth/me` always returns 200, ignoring cookies; `POST /auth/login` accepts any credentials.
- No handlers for `/auth/logout` or `/auth/refresh`.
- `GET /auth/user` exists only in MSW; the api has no such route.

### F2. Real Postgres for api integration tests

`pnpm test:db` against a separate test database (`docker.md` R2, R3), blocking in CI. Covers the SQL adapters and the acceptance suites run against real repositories. In-memory repositories stay only where a test needs speed and does not depend on SQL behaviour.

### F3. `pnpm e2e` in real mode, in CI

The Playwright suite from onboarding decision 6 (one suite, MSW mode first, real api + docker Postgres later, same tests). In CI, real mode runs against `docker compose up --build --wait` with throwaway secrets generated in the job. Journeys: register → login → `/me` → timeline → logout. Covers image build, entrypoint, migrations, seeds, env and secret loading, and the api↔web fit, and replaces manual QA. Not built yet: `onboarding.md` Next 8.

## Next

1. [ ] F1: spec the shared contract and the timeline response shape (`docs/specs/`)
2. [ ] F1: implement it, fix the timeline drift
3. [ ] Decide the MSW-only endpoints (`/posts`, likes, `/timeline/:id`): spec them for the api or mark them mock-first in the contract
4. [ ] F2: `pnpm test:db` and SQL adapter tests (tracked in `docker.md` Next 4)
5. [ ] F3: `pnpm e2e` mock mode (`onboarding.md` Next 8), then real mode in CI (closes `docker.md` Next 3)
