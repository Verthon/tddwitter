# Backend decision log

What was decided and why, in order, so the reasoning can be read back later while learning backend.

## Rules

- Append only. Never edit or delete an entry. If a decision changes, add a new entry that names the old one in `Supersedes`. Fixing a typo is fine.
- Add an entry when a backend or devops choice had a real alternative. Routine code choices do not count.
- Write the entry in the same branch as the change it explains.
- If the decision is hard to reverse, also write an ADR in `docs/adr/` and link it.
- Record who decided and what the decision rests on. Mark anything not checked as `Not verified`.

Earlier decisions are not copied here: `arch/adr/`, `docs/adr/`, `docs/tasks/docker.md`.

## Entry shape

```
## D-000. Title
- Date:
- Decided by:
- What:
- Why:
- Rejected:
- Overturn if:
- Learn:
- Not verified:
- Supersedes:
```

Leave out `Not verified` and `Supersedes` when empty.

## Entries

## D-001. Be ready to deploy in one day, without deploying now
- Date: 2026-11-05
- Decided by: maintainer
- What: Do the hard work now, so that going live on cheap hosting takes one working day. Work is in `docs/tasks/deploy-ready.md`.
- Why: The goal is learning backend (`GOAL.md`), and a live app is not needed for that. Preparing for a deploy still teaches what a public app needs.
- Rejected: Go live now, because it adds running cost and real user data with no need for them. Do nothing until a deploy is needed, because the full stack and a real login have never been run (`docs/tasks/docker.md` Next 3), so the time a deploy would take is unknown.
- Overturn if: The app gets real users, or the maintainer wants to learn from running it live.
- Learn: Deployment readiness is something you can test. "We could deploy" means nothing until a deploy has been done once.

## D-002. Plan for Railway with Supabase Free Postgres
- Date: 2026-11-05
- Decided by: agent recommended, maintainer accepted, asking for the easier and cheaper option
- What: The target for a future deploy is the containers on Railway and Postgres on Supabase Free.
- Why: About $5/month at 1k users, with no server, firewall or OS updates to run. The price is from `~/Projects/advisors/free-tier-stack/overview.md`, 2026-10-12.
- Rejected: Railway Postgres, about $8/month, because it is a container and not a managed database, and backups need the Pro plan. One VPS with Compose, because the OS, firewall, backups and rollback are all yours, and its cost was not researched.
- Overturn if: The maintainer wants to learn server operations, which makes the VPS the better choice. Or the rehearsal shows that the api cannot use Supabase well.
- Learn: A managed database means a provider runs it for you. Check what the provider really includes. "Managed" in `docs/tasks/test-architecture.md` probably means something else: a dependency that only your app uses, which is a testing term.
- Not verified: The prices today. Which backups Supabase Free includes. Whether postgres.js on Railway connects to Supabase without problems. That Railway ends TLS and gives secrets as environment variables.

## D-003. Rehearse the deploy once, then delete it
- Date: 2026-11-05
- Decided by: maintainer
- What: Deploy once to real hosting by following `DEPLOY.md`, log in, then delete everything.
- Why: Without a rehearsal, "one day" is a guess and `DEPLOY.md` is an untested document. Expected cost is about one month of Railway, roughly $5.
- Rejected: Only test locally, because a local stack cannot show hosting problems such as TLS to the database, secrets, or the client IP behind a proxy.
- Overturn if: Nothing. If the hosting choice changes, rehearse on the new choice.
- Learn: A plan that was never run is a hypothesis. The same idea applies to backups: an untested restore does not count.

## D-004. Keep backend decisions in one append-only log
- Date: 2026-11-05
- Decided by: maintainer asked for it, agent chose the form
- What: This file. One entry per decision, never edited, with new entries replacing old ones.
- Why: The maintainer wants to read back the what and the why, as with event sourcing. Task files are deleted when finished (`AGENTS.md`), so their reasoning does not stay in the tree.
- Rejected: An ADR for every decision, because the format is too heavy for small choices, so entries would not get written. Git history alone, because commit messages explain one change and do not read as a story.
- Overturn if: The log goes unread, or the entries stop being written.
- Learn: Event sourcing keeps every change as an event, and current state is derived from them. This log borrows only the idea: no rewriting of history. In a database it has real costs, so it is not a default for application data.

## D-005. Check the api and web contract with a shared Zod package and an endpoint list
- Date: 2026-11-06
- Decided by: agent recommended, maintainer accepted
- What: A workspace package holds one Zod schema per endpoint and a list of each endpoint's method and path. Both api and web import it. `pnpm check` fails on a mismatch: api route specs parse real responses through the schema, web types and MSW fixtures come from `z.infer` and are checked by `tsc`, and an api spec fails if a listed endpoint is not mounted. Web services take their paths from the list. This entry decides the mechanism, not which endpoints it covers first.
- Why: `pnpm check` passes while web expects fields the api does not return and calls routes the api does not have. Web tests use MSW and api tests use in-memory fakes, so nothing connects the two. This is F1 in `docs/tasks/test-architecture.md` plus the endpoint list, because schemas alone cannot see a missing route such as likes returning 404. Zod 4.2.1 is already in both packages, and no new CI job is needed.
- Rejected: OpenAPI, because there is no second consumer and it still needs a separate check of web. Hono RPC, because it needs chained routes and does not type MSW handlers (`docs/tasks/agent-skills.md`). Pact, because api and web deploy together. Waiting for the F3 end-to-end tests alone, because they are not built and see only the journeys they run.
- Overturn if: A mobile client, a public API or a second team appears. OpenAPI generated from the code is then the next step.
- Learn: A shared type is a statement, not a check. It proves nothing about what a handler returns until a test parses a real response through the schema. Route specs still run on in-memory fakes, so SQL adapter mistakes stay with step 2 of `docs/tasks/deploy-ready.md`, and wiring stays with F3.
- Not verified: Nothing is built yet. Both Dockerfiles copy only their own folder, so they must change, and the new package has not been tried with `pnpm deploy` or the image builds. The research behind the OpenAPI and Pact rejections (`~/Projects/advisors/research/api-design/raw/2026-11-04-api-design.md` decision 7) is unreviewed, and its Pact point is its own inference.

## D-006. The rehearsal requires a real login and a timeline 200, not a readable timeline
- Date: 2026-11-06
- Decided by: agent recommended, maintainer accepted
- What: The D-003 rehearsal passes with a real login plus `GET /api/timeline` returning 200. It does not require timeline rows with text. `DEPLOY.md` must state that the app is not usable as a product at this point. The D-005 contract check starts with the auth endpoints. The timeline, `/posts` and likes go on the endpoint list marked mock-first, and each loses the mark when its spec ships.
- Why: The rehearsal exists to find hosting problems (D-003), and login already covers database TLS, secrets, cookies and the proxy. The 200 costs one line and shows that a second table was migrated and can be read through the hosted connection. A readable timeline adds almost nothing about hosting and needs posts: the only source is `api/db/seeds/002_posts.sql`, and step 3 of `docs/tasks/deploy-ready.md` takes seeding out of startup. The timeline is MVP item 4 in `GOAL.md`, delivered through a spec.
- Rejected: Login only, because the posts table would never be read through the hosted connection. A readable timeline with a manual `db:seed`, because it adds feature work and shows fake posts that a real deploy would not have. A readable timeline with create post, because it builds MVP items 3 and 4 inside a task that rules out features.
- Overturn if: A real launch is planned. The MVP specs then come before the deploy.
- Learn: "Ready to deploy in one day" here means the hosting is ready, not the product. A smoke test proves only what it touches, so write down what it does not prove. The mock-first mark lets the contract check pass on a known mismatch, but it keeps those mismatches in one visible list.
- Not verified: That `GET /api/timeline` returns 200 on an empty posts table, and on Supabase. The mock-first mark is not designed yet.

## D-007. Run database tests against a throwaway Postgres service
- Date: 2026-11-06
- Decided by: agent, while doing step 2 of `docs/tasks/deploy-ready.md`, following R2 and R3 in `docs/tasks/docker.md`. Not yet reviewed by the maintainer.
- What: A `db-test` compose service under the `test` profile: the same Postgres image as `db`, stored in memory, on port 5434, with fixed non-secret credentials. `pnpm test:db` starts it, drops the schema, applies the migrations with the same command as `api/docker-entrypoint.sh`, and runs `*.db.spec.ts`. A `test-db` job in `.github/workflows/check.yml` runs it. `pnpm check` excludes these specs and stays free of Docker.
- Why: R3 asks for a database that is never the dev one. A second database on the `db` service would need the credentials in `secrets/`, which agents must not read and CI does not have. A separate service needs no secrets, and the address in `api/src/common/test-utils/testDb.ts` is hardcoded, so the tests cannot reach dev data.
- Rejected: A second database on the `db` service, for the reason above. Testcontainers, because it adds a dependency and compose already runs Postgres. A GitHub Actions `services:` block, because CI and local runs would then start the database in different ways.
- Overturn if: The test database has to match the hosted version, such as Supabase's Postgres, more closely than one shared image can.
- Learn: A test database can be disposable. Dropping the schema and migrating from zero on each run also tests that the migrations apply from zero.
- Not verified: The `test-db` job has not run in CI. Starting `db-test` with no `secrets/` folder was checked locally with a copy of the compose file.

## D-008. Store posts.created_at in milliseconds
- Date: 2026-11-06
- Decided by: agent, because the bug failed the new test in step 2 of `docs/tasks/deploy-ready.md`. Not yet reviewed by the maintainer.
- What: A migration changes `posts.created_at` to `TIMESTAMPTZ(3)`.
- Why: The timeline cursor carries milliseconds, while the column stored microseconds. A post in the same millisecond as the cursor row, but later within it, compared as newer than the cursor and never appeared on the next page, with no error. This is the "possible pagination drift" in `docs/tasks/test-architecture.md`. A test showed it: with the column unchanged, reading three such posts one page at a time returned only the first. It needs two posts in one millisecond with a page boundary between them, or a batch insert that gives many rows one timestamp.
- Rejected: `date_trunc('milliseconds', created_at)` in the query, because that function is not immutable for `timestamptz`, so the expression could never be indexed. A microsecond cursor, because JavaScript dates hold only milliseconds, so the cursor format and the types would have to change.
- Overturn if: Something needs ordering finer than one millisecond. Posts in the same millisecond now sort by `public_id`, not by the true order they were created.
- Learn: A cursor must have the same precision as the column it pages over. Fakes hide this, because the in-memory repository holds JavaScript numbers. postgres.js also passes a `timestamptz` parameter through `Date`, which cuts it to milliseconds, so a test must cast through text to create microseconds.
- Not verified: The migration has not run on Supabase, or on a database with real rows.
